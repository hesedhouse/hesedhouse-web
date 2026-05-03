#!/usr/bin/env node
/**
 * 헤세드왕조 블로그 자동 포스트 생성기
 * - Claude API로 매일 1편의 블로그 글을 자동 생성
 * - 10명의 왕조 캐릭터 작가가 순환하며 집필
 * - GitHub Actions cron에서 실행
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, "..", "src", "content", "blog");

// ── 작가 & 카테고리 매핑 ──
const AUTHORS = [
  { id: "cheongha", name: "청하", team: "기획팀",       category: "ip-license",      topics: "IP 라이선스 계약, 캐릭터 콜라보, 라이선서 협상, MG/로열티, IP 포트폴리오 전략" },
  { id: "mangchi",  name: "망치", team: "제작팀",       category: "merch-guide",     topics: "캐릭터 굿즈 제작, 아크릴키링/포카/인형/문구, OEM 공장 관리, 샘플 QC, 패키지 디자인" },
  { id: "ilgak",    name: "일각", team: "PM팀",         category: "popup-store",     topics: "팝업스토어 기획, 현장 운영, VMD, 인력 관리, 이벤트 부스, 일정 관리" },
  { id: "geumbi",   name: "금비", team: "세일즈팀",     category: "distribution",    topics: "B2B 유통, 온라인 셀렉트샵, 위탁판매, 거래처 관리, 납품 프로세스, 쇼핑몰 운영" },
  { id: "pilbong",  name: "필봉", team: "홍보팀",       category: "visual-creative", topics: "제품 촬영, SNS 콘텐츠, 브랜딩, 비주얼 스토리텔링, 인스타그램 마케팅" },
  { id: "baram",    name: "바람", team: "글로벌팀",     category: "global-trend",    topics: "해외 IP 시장, K-캐릭터 수출, 일본/동남아 트렌드, 현지화 전략, 해외 전시회" },
  { id: "jupan",    name: "주판", team: "재무팀",       category: "cost-analysis",   topics: "팬덤 굿즈 가성비 추천, 한정판 가치 분석, 콜라보 굿즈 트렌드, 컬렉팅 입문/보관 가이드, 팝업스토어 굿즈 구매 노하우, 시즌별 굿즈 트렌드 — 모두 '팬·고객 입장'에서 가치를 짚어주는 콘텐츠 (※회사 내부 원가·마진율·구체 단가 등 영업 비밀은 절대 공개 금지)" },
  { id: "songsa",   name: "송사", team: "법무팀",       category: "legal-guide",     topics: "IP 계약 법률, 저작권, 상표권, 라이선스 분쟁, 계약서 조항 해설" },
  { id: "indeok",   name: "인덕", team: "인사총무팀",   category: "trend-ai",        topics: "AI 업무 자동화, 디지털 전환, 업계 트렌드, 스타트업 운영, HR 테크" },
  { id: "oksu",     name: "옥수", team: "AI 총괄 비서", category: "editorial",       topics: "IP 산업 종합 인사이트, 사업 전략, 시장 전망, 경영 칼럼, 조직 운영" },
];

// ── 오늘의 작가 결정 (날짜 기반 순환) ──
function getTodayAuthor() {
  const today = new Date();
  const epoch = new Date("2026-04-26"); // 첫 블로그 글 날짜 기준
  const daysSinceEpoch = Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % AUTHORS.length;
  return AUTHORS[index];
}

// ── 기존 글 목록 확인 (중복 방지) ──
function getExistingPosts() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return [];
  }
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
      const titleMatch = content.match(/^title:\s*"(.+)"/m);
      return { file: f, title: titleMatch?.[1] || f };
    });
}

// ── 오늘 날짜 문자열 ──
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── 이미 오늘 글이 있는지 확인 ──
function alreadyPostedToday() {
  const today = todayStr();
  if (!fs.existsSync(BLOG_DIR)) return false;
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
    if (content.includes(`pubDate: ${today}`)) return true;
  }
  return false;
}

// ── 이번 달 K-POP 글이 이미 발행됐는지 확인 ──
function alreadyPostedKpopThisMonth() {
  const d = new Date();
  const ymPrefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (!fs.existsSync(BLOG_DIR)) return false;
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
    if (content.includes(`category: "kpop-monthly"`) && content.includes(`pubDate: ${ymPrefix}-`)) {
      return true;
    }
  }
  return false;
}

// ── 이번 달 첫 주(1~7일) 여부 ──
function isFirstWeekOfMonth() {
  return new Date().getDate() <= 7;
}

// ── Claude API로 블로그 글 생성 ──
async function generatePost(author, existingPosts, opts = {}) {
  const { isKpop = false } = opts;
  const client = new Anthropic();

  const existingTitles = existingPosts.map((p) => `- ${p.title}`).join("\n");

  let prompt;
  let tools;

  if (isKpop) {
    const d = new Date();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const slug = `kpop-concert-lineup-${year}-${String(month).padStart(2, "0")}`;

    prompt = `당신은 "헤세드왕조"의 AI 캐릭터 "바람"(글로벌팀, K-POP·해외 시장 담당)입니다.
헤세드코퍼레이션은 IP 라이선스 기반 캐릭터 굿즈 회사이며, 팬·K-컬처 트렌드를 다루는 블로그 "궁궐 서고"를 운영합니다.

## 오늘의 주제 (고정)
${year}년 ${month}월 한국에서 열리는 K-POP 콘서트·팬미팅·페스티벌 라인업 정리

## 작성 규칙
1. **반드시 web_search 도구를 사용하여** ${year}년 ${month}월 한국에서 열리는 실제 K-POP 공연 정보를 검색하세요. 최소 4~6회 검색 권장.
2. 검색 키워드 예: "${year}년 ${month}월 K-POP 콘서트", "${month}월 한국 K팝 공연 일정", "${year} ${month}월 팬미팅", "${month}월 K-POP 페스티벌 라인업", "interpark ${year}년 ${month}월 콘서트", "yes24 티켓 ${month}월 K-POP"
3. **검색에서 확인된 공연만** 작성. 미확인·과거 정보는 추측하지 말고 생략하세요.
4. 정리 형식:
   - 도입부 (이번 달 K-POP 씬 한눈에 — 200~300자)
   - **메인 표**: 날짜 | 아티스트 | 공연/투어명 | 장소 | 티켓 정보
   - 주요 공연 5~10개 각각 200~400자 해설 (관전 포인트, 팬덤 동향, 굿즈/MD 정보)
   - 팬을 위한 팁 섹션 (티켓 오픈 일정 확인법, 양도 주의사항 등)
   - 마지막 안내문: "* 본 일정은 ${todayStr()} 기준 공개된 정보를 정리한 것이며, 변경될 수 있습니다. 최신 정보는 각 공연 공식 채널에서 확인해 주세요."
5. 본문은 마크다운 **4,000~5,500자** 분량
6. tags 5~6개 포함
7. **회사(헤세드코퍼레이션) 내부 원가·마진·구체 단가 정보 노출 금지**

## 출력 형식 (이 형식 그대로 출력, ---마커--- 표기 정확히 지킬 것)
---SLUG---
${slug}
---FRONTMATTER---
title: "${year}년 ${month}월 K-POP 콘서트·팬미팅 라인업 - 이번 달 가볼 만한 K팝 공연 정리"
description: "${year}년 ${month}월 한국에서 열리는 K-POP 콘서트·팬미팅·페스티벌을 일정·장소·티켓 정보 중심으로 정리했습니다."
category: "kpop-monthly"
author: "baram"
tags: ["K-POP", "콘서트", "팬미팅", "${year}년 ${month}월 공연", "공연정보", "K팝 라인업"]
---BODY---
(마크다운 본문)`;

    tools = [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 8,
    }];
  } else {
    prompt = `당신은 "헤세드왕조"의 AI 캐릭터 "${author.name}"(${author.team})입니다.
헤세드코퍼레이션(㈜헤세드)은 IP 라이선스 기반 캐릭터 굿즈 기획·제작·유통 회사이며, 팬·라이선시·파트너가 즐겨 읽는 블로그 "궁궐 서고"를 운영합니다.

## 당신의 전문 분야
${author.topics}

## 이미 작성된 글 (중복 금지)
${existingTitles || "(없음)"}

## 작성 규칙
1. 위 전문 분야에서 **아직 다루지 않은 구체적이고 흥미로운 주제** 1개를 선택하세요
2. SEO에 유리한 제목 ("- " 뒤에 부제 포함, 50자 이내)
3. description은 2~3줄 요약 (120자 이내)
4. **본문은 마크다운으로 4,000~5,500자 분량** (이전 가이드의 약 2배 길이로 깊이 있게)
5. 표·체크리스트·단계별 가이드·실제 사례·고객 인터뷰 톤 등을 풍부하게 활용
6. **고객(팬·라이선시·파트너) 입장에서 유익하고 재미있는 톤**으로 작성. 과한 B2B 전문용어는 풀어쓰기.
7. 헤세드코퍼레이션의 실무 사례·관점을 자연스럽게 녹여주세요
8. **회사 내부 원가·마진율·구체 단가·매입가 등 영업 비밀은 절대 공개 금지** (필요 시 비율·범위·구조만 언급)
9. tags 4~6개
10. slug(파일명용)는 영문 kebab-case로 제안

## 출력 형식 (이 형식 그대로 출력)
---SLUG---
(영문-kebab-case-slug)
---FRONTMATTER---
title: "(제목)"
description: "(설명)"
category: "${author.category}"
author: "${author.id}"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
---BODY---
(마크다운 본문)`;
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    ...(tools ? { tools } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  // 웹서치 사용 시 content에 server_tool_use / web_search_tool_result 블록이 섞이므로
  // text 블록만 모아서 합침 (마지막 text 블록이 보통 최종 출력)
  const textBlocks = response.content.filter((b) => b.type === "text");
  if (textBlocks.length === 0) {
    throw new Error("응답에 text 블록이 없음");
  }
  return textBlocks.map((b) => b.text).join("\n");
}

// ── 응답 파싱 & 파일 저장 ──
function parseAndSave(rawText, author) {
  const slugMatch = rawText.match(/---SLUG---\s*\n(.+)/);
  const frontmatterMatch = rawText.match(/---FRONTMATTER---\s*\n([\s\S]+?)---BODY---/);
  const bodyMatch = rawText.match(/---BODY---\s*\n([\s\S]+)/);

  if (!slugMatch || !frontmatterMatch || !bodyMatch) {
    throw new Error("파싱 실패: Claude 응답 형식이 예상과 다릅니다");
  }

  const slug = slugMatch[1].trim();
  const frontmatter = frontmatterMatch[1].trim();
  const body = bodyMatch[1].trim();
  const today = todayStr();

  const fileContent = `---
${frontmatter}
pubDate: ${today}
draft: false
---

${body}
`;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    throw new Error(`파일 이미 존재: ${filePath}`);
  }

  fs.writeFileSync(filePath, fileContent, "utf-8");
  console.log(`✅ 새 블로그 글 생성 완료: ${slug}.md`);
  console.log(`   작가: ${author.name} (${author.team})`);
  console.log(`   날짜: ${today}`);
  return filePath;
}

// ── 메인 ──
async function main() {
  console.log("🏯 헤세드왕조 블로그 자동 생성기 시작\n");

  // 오늘 이미 글이 있으면 스킵
  if (alreadyPostedToday()) {
    console.log("⏭️  오늘 이미 글이 발행되어 있습니다. 스킵합니다.");
    process.exit(0);
  }

  // 매월 첫 주(1~7일) + 이번 달 K-POP 글 미발행 → K-POP 월간 라인업 우선 발행
  const isKpopDay = isFirstWeekOfMonth() && !alreadyPostedKpopThisMonth();
  let author;
  if (isKpopDay) {
    author = AUTHORS.find((a) => a.id === "baram");
    console.log(`🎤 K-POP 월간 라인업 발행일 — 작가: ${author.name} (${author.team})`);
  } else {
    author = getTodayAuthor();
    console.log(`📝 오늘의 작가: ${author.name} (${author.team}) — 카테고리: ${author.category}`);
  }

  const existingPosts = getExistingPosts();
  console.log(`📚 기존 글 ${existingPosts.length}편 확인\n`);

  const rawText = await generatePost(author, existingPosts, { isKpop: isKpopDay });
  const filePath = parseAndSave(rawText, author);

  console.log(`\n🎉 완료! Netlify가 자동 배포합니다.`);
}

main().catch((err) => {
  console.error("❌ 오류 발생:", err.message);
  process.exit(1);
});
