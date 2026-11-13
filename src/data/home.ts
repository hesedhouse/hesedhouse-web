// 홈(리디자인 2026) 콘텐츠 데이터.
// ⚠ PLACEHOLDER 표시가 있는 항목은 시안의 자리표시자다. master 머지(발행) 전에 실제 값으로 교체할 것.

export interface HomeService {
  num: string;
  title: string;      // 한글 서비스명
  en: string;         // 영문 소제목
  short: string;      // 히어로 아래 인덱스 표기
  desc: string;
  href: string;
  ico: "" | "r" | "t" | "a";
  highlight?: boolean;
}

export const homeServices: HomeService[] = [
  { num: "01", title: "IP 라이선스 & 콜라보", en: "IP LICENSE & COLLABO", short: "IP LICENSE", desc: "IP 라이선스 확보와 브랜드 콜라보를 중개하고, 양측 모두에게 유리한 파트너십 구조를 설계합니다.", href: "/iplicensecollabo", ico: "" },
  { num: "02", title: "머천다이징", en: "MERCHANDISING", short: "MERCHANDISING", desc: "굿즈와 MD 상품을 기획·디자인·생산합니다. 소량 샘플부터 대량 양산까지 검증된 생산 라인을 운영합니다.", href: "/merchandising", ico: "r" },
  { num: "03", title: "유통", en: "DISTRIBUTION", short: "DISTRIBUTION", desc: "온·오프라인 유통 채널을 연결하고 해외 시장 진출을 지원합니다.", href: "/distribution", ico: "t" },
  { num: "04", title: "팝업 운영", en: "POP-UP OPERATION", short: "POP-UP", desc: "팝업스토어, 전시, 이벤트를 기획부터 현장 운영, 정산까지 맡습니다.", href: "/popupoperation", ico: "" },
  { num: "05", title: "비주얼 스튜디오", en: "VISUAL STUDIO", short: "VISUAL STUDIO", desc: "브랜드 아이덴티티를 위한 비주얼 콘텐츠를 제작합니다. 키비주얼, 패키지, 영상, 공간 그래픽.", href: "/visualstudio", ico: "r" },
  { num: "06", title: "AI 솔루션", en: "AI SOLUTION · MINDSCOPE KOREA", short: "AI SOLUTION", desc: "업무를 설계하고 비즈니스를 자동화합니다. AI 여론 리서치 서비스 MindScope Korea를 운영합니다.", href: "/ai-solution", ico: "a", highlight: true },
  { num: "07", title: "투자 & 사업개발", en: "INVESTMENT & BIZ DEV", short: "INVESTMENT", desc: "IP, 콘텐츠, 테크 분야에 투자하고 함께 사업을 개발합니다.", href: "/investment", ico: "" },
];

/** 소개 헤드라인에서 순환하는 단어 */
export const rotatingWords = ["프로젝트", "브랜드", "굿즈", "팝업", "런칭", "캠페인"];

export const introKeywords = [
  "IP 라이선스", "브랜드 콜라보", "굿즈 제작", "MD 기획", "해외 유통", "팝업스토어",
  "전시·이벤트", "비주얼 스튜디오", "AI 자동화", "MindScope Korea", "투자·사업개발",
];

export const marqueeWords = ["회의는 적게", "창구는 하나", "전달은 빠르게", "결과는 확실하게"];

/** 작업 아카이브: 포트폴리오 카테고리 → 표기 라벨 */
export const workCategoryLabels: Record<string, string> = {
  ip: "IP License",
  merch: "Merchandising",
  popup: "Pop-up",
  distribution: "Distribution",
  vs: "Visual Studio",
  ai: "AI Solution",
};

/**
 * 실적 수치 — 홈과 About 이 함께 쓰는 단일 출처 (2026-11-13 대표: "홈 값으로 통일").
 * 값은 리디자인 이전 홈에 있던 그대로다. 최신값이 확인되면 여기만 고치면 두 페이지에 반영된다.
 * short 는 About 의 짧은 영문 라벨.
 */
export const homeStats = [
  { value: 500, label: "PROJECTS 프로젝트", short: "Projects" },
  { value: 50, label: "PARTNERS 파트너사", short: "Partners" },
  { value: 10, label: "AI AGENTS 운영 중인 AI 에이전트", short: "AI Agents" },
];
/** 설립 연도 (홈의 "SINCE 2016") */
export const sinceYear = 2016;

export const homeProcess = [
  { n: "01", title: "기획", en: "DIRECTION", desc: "목표·예산·일정을 함께 정리하고 IP·채널·제작 방식을 결정합니다.", accent: false },
  { n: "02", title: "제작", en: "PRODUCTION", desc: "디자인·샘플·생산·콘텐츠. AI로 시안과 변주를 빠르게 뽑고 전문가가 다듬습니다.", accent: false },
  { n: "03", title: "검수", en: "QUALITY", desc: "샘플 검수, 라이선스 승인, 일정 리스크 관리. 모든 결과물은 사람이 확인합니다.", accent: true },
  { n: "04", title: "전달", en: "DELIVERY", desc: "납품·유통·현장 운영·정산까지. 끝난 뒤에도 데이터로 다음 프로젝트를 설계합니다.", accent: false },
];

/**
 * PLACEHOLDER — 파트너 로고 격자.
 * 시안의 자리표시자(업종 라벨 + 가짜 마크)다. 실제 파트너사 이름·로고(SVG/PNG)로 교체하면
 * name 에 회사명, logo 에 /partners/xxx.svg 경로를 넣는다. logo 가 없으면 자리표시자 마크로 그린다.
 */
export const partnersArePlaceholder = true;
export const homePartners: { industry: string; name?: string; logo?: string }[] = [
  "캐릭터 IP", "엔터테인먼트", "게임", "웹툰", "유통사", "편의점",
  "백화점", "이커머스", "패션", "뷰티", "F&B", "카페",
  "출판", "교육", "공공기관", "금융", "테크", "전시·컨벤션",
  "방송", "스포츠", "완구", "문구", "라이프스타일", "호텔",
].map((industry) => ({ industry }));

/**
 * FAQ. placeholder: true 인 답변은 시안의 예시 문구다(화면에도 "(예시 문구)"로 표시됨).
 * 실제 답변으로 바꾸면 placeholder 를 지운다.
 */
export const homeFaq: { q: string; a: string; placeholder?: boolean }[] = [
  { q: "소량 굿즈 제작도 가능한가요?", a: "네. 샘플 1개부터 수만 개 양산까지 품목별 최소 수량이 다르며, 견적 요청 시 수량대별 단가를 함께 안내드립니다." },
  { q: "IP 라이선스 계약은 어떻게 진행되나요?", a: "IP 홀더 확인 → 사용 범위·기간·로열티 협의 → 계약 → 디자인 승인(샘플 검수) 순으로 진행되며 보통 4~8주가 걸립니다.", placeholder: true },
  { q: "팝업스토어는 어디까지 맡아주나요?", a: "장소 섭외, 공간 디자인·시공, 상품 구성, 현장 인력 운영, 정산 리포트까지 전 과정을 맡습니다. 일부 단계만 의뢰도 가능합니다.", placeholder: true },
  { q: "AI 솔루션은 어떤 업무에 적용할 수 있나요?", a: "반복 문서 작업, 고객 응대 자동화, 리서치·리포트 생성, 커머스 운영 데이터 분석 등에 적용합니다. MindScope Korea로 여론 리서치도 제공합니다.", placeholder: true },
  { q: "견적과 일정은 얼마나 걸리나요?", a: "간단한 문의는 1영업일 내 1차 견적, 상세 견적은 범위 확정 후 3~5영업일이 걸립니다. 제작 일정은 품목에 따라 2주~3개월입니다.", placeholder: true },
];

export const contactLinks = {
  kakao: "http://pf.kakao.com/_Kxnkxou",
  tel: "031-994-7740",
};
