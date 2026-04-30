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
  { id: "jupan",    name: "주판", team: "재무팀",       category: "cost-analysis",   topics: "굿즈 원가 분석, 마진율, 프로젝트 정산, 예산 편성, 손익분석" },
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

// ── Claude API로 블로그 글 생성 ──
async function generatePost(author, existingPosts) {
  const client = new Anthropic();
  const today = todayStr();

  const existingTitles = existingPosts.map((p) => `- ${p.title}`).join("\n");

  const prompt = `당신은 "헤세드왕조"의 AI 캐릭터 "${author.name}"(${author.team})입니다.
헤세드코퍼레이션(㈜헤세드)은 IP 라이선스 기반 캐릭터 굿즈 기획·제작·유통 회사입니다.

## 당신의 전문 분야
${author.topics}

## 이미 작성된 글 (중복 금지)
${existingTitles || "(없음)"}

## 작성 규칙
1. 위 전문 분야에서 **아직 다루지 않은 구체적인 실무 주제** 1개를 선택하세요
2. SEO에 유리한 제목을 작성하세요 ("- " 뒤에 부제 포함, 50자 이내)
3. description은 2~3줄 요약 (120자 이내)
4. 본문은 마크다운으로 2000~3000자 분량
5. 실무 경험을 바탕으로 한 구체적인 정보 제공 (표, 체크리스트, 단계별 가이드 등 활용)
6. 헤세드코퍼레이션의 실무 사례를 자연스럽게 녹여주세요
7. tags는 핵심 키워드 4~6개
8. slug(파일명용)는 영문 kebab-case로 제안

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

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text;
}

// ── 응답 파싱 & 파일 저장 ──
function parseAndSave(rawText) {
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
  console.log(`   작가: ${getTodayAuthor().name} (${getTodayAuthor().team})`);
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

  const author = getTodayAuthor();
  console.log(`📝 오늘의 작가: ${author.name} (${author.team}) — 카테고리: ${author.category}`);

  const existingPosts = getExistingPosts();
  console.log(`📚 기존 글 ${existingPosts.length}편 확인\n`);

  const rawText = await generatePost(author, existingPosts);
  const filePath = parseAndSave(rawText);

  console.log(`\n🎉 완료! Netlify가 자동 배포합니다.`);
}

main().catch((err) => {
  console.error("❌ 오류 발생:", err.message);
  process.exit(1);
});
