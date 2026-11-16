// 서비스 상세(단순형 5개)와 Works 분야 페이지의 콘텐츠 데이터 — 리디자인 2026 2차.
// 문구는 리디자인 이전 페이지의 것을 그대로 옮겼다. 번호·한글 서비스명은 data/home.ts 의 homeServices 와 맞춘다.

export type WorkCategory = "ip" | "merch" | "popup" | "distribution" | "vs" | "ai";

export interface ServiceDetail {
  slug: string;              // 페이지 경로 (/merchandising)
  title: string;             // 영문 제목 (히어로)
  tagline: string;           // 히어로 부제 = meta description
  lead: string;              // 소개 문단
  items: { title: string; desc: string }[];
  category: WorkCategory;    // 관련 작업을 뽑을 포트폴리오 분야
  worksHref: string;
  cta: { title: string; subtitle: string };
}

export const serviceDetails: Record<string, ServiceDetail> = {
  iplicensecollabo: {
    slug: "/iplicensecollabo",
    title: "IP LICENSE & COLLABO",
    tagline: "IP 라이선스 확보부터 브랜드 콜라보레이션까지",
    lead: "IP의 가치를 극대화하는 전략적 파트너십을 설계합니다. 원작의 세계관을 깊이 이해하고, 최적의 라이선스 구조와 콜라보 모델을 제안합니다.",
    items: [
      { title: "License Acquisition", desc: "IP 라이선스 계약 체결 및 권리 확보" },
      { title: "Brand Collaboration", desc: "브랜드 간 콜라보레이션 기획 및 실행" },
      { title: "IP Consulting", desc: "IP 가치 분석 및 비즈니스 모델 설계" },
    ],
    category: "ip",
    worksHref: "/works-ipco",
    cta: { title: "IP 비즈니스, 함께 설계합니다.", subtitle: "라이선스부터 콜라보까지 원스톱으로." },
  },
  merchandising: {
    slug: "/merchandising",
    title: "MERCHANDISING",
    tagline: "트렌드를 읽고, 상품으로 완성합니다",
    lead: "아이디어에서 완제품까지. 기획, 디자인, 샘플링, 생산, 품질관리의 전 과정을 전담합니다.",
    items: [
      { title: "Product Planning", desc: "시장 분석 기반 상품 기획 및 라인업 구성" },
      { title: "Design & Sampling", desc: "디자인 시안 제작, 샘플 개발 및 승인" },
      { title: "Production & QC", desc: "본생산 관리, 품질 검수, 패키징" },
    ],
    category: "merch",
    worksHref: "/works-merch",
    cta: { title: "상품 기획부터 생산까지, 함께합니다.", subtitle: "아이디어를 완제품으로 만들어 드립니다." },
  },
  distribution: {
    slug: "/distribution",
    title: "DISTRIBUTION",
    tagline: "온·오프라인을 아우르는 글로벌 유통",
    lead: "국내외 유통 채널을 통해 IP 상품의 시장 접근성을 극대화합니다.",
    items: [
      { title: "Online Distribution", desc: "자사몰, 오픈마켓, 위탁판매 운영" },
      { title: "Offline Distribution", desc: "편집숍, 백화점, 전문매장 입점" },
      { title: "Global Export", desc: "해외 바이어 매칭, 수출입 실무" },
    ],
    category: "distribution",
    worksHref: "/works-distribution",
    cta: { title: "유통의 모든 채널, 함께 열어갑니다.", subtitle: "온라인부터 글로벌까지." },
  },
  popupoperation: {
    slug: "/popupoperation",
    title: "POP-UP OPERATION",
    tagline: "공간을 브랜드 경험으로 전환합니다",
    lead: "팝업스토어, 전시, 이벤트의 기획부터 시공, 운영, 철수까지 원스톱으로 제공합니다.",
    items: [
      { title: "Space Planning", desc: "공간 디자인, 동선 설계, 시공 관리" },
      { title: "Operations", desc: "현장 운영, 인력 관리, POS 시스템" },
      { title: "Event Marketing", desc: "현장 이벤트, 프로모션, SNS 연동" },
    ],
    category: "popup",
    worksHref: "/works-popup",
    cta: { title: "공간이 곧 브랜드입니다.", subtitle: "기획부터 철수까지, 원스톱으로." },
  },
  visualstudio: {
    slug: "/visualstudio",
    title: "VISUAL STUDIO",
    tagline: "브랜드를 시각으로 완성합니다",
    lead: "사진, 영상, 그래픽 디자인까지. 브랜드의 비주얼 아이덴티티를 구축합니다.",
    items: [
      { title: "Photography", desc: "제품 촬영, 룩북, 공간 촬영" },
      { title: "Video Production", desc: "홍보 영상, 바이럴 콘텐츠, 인터뷰" },
      { title: "Graphic Design", desc: "패키지 디자인, 인쇄물, 디지털 에셋" },
    ],
    category: "vs",
    worksHref: "/works-vs",
    cta: { title: "비주얼로 브랜드를 말합니다.", subtitle: "촬영부터 디자인까지." },
  },
};

export interface WorksCategoryInfo {
  key: WorkCategory;
  href: string;
  label: string;        // 탭 표기 (한글)
  title: string;        // 히어로 영문 제목
  subtitle: string;
  description: string;  // meta description
}

/** Works 분야 페이지 6개. 순서 = 탭 순서 (/works 의 탭과 동일) */
export const worksCategories: WorksCategoryInfo[] = [
  { key: "ip", href: "/works-ipco", label: "IP 라이선스", title: "IP LICENSE & COLLABO", subtitle: "IP 라이선스 및 콜라보레이션 프로젝트", description: "헤세드코퍼레이션의 IP 라이선스 및 콜라보레이션 프로젝트 포트폴리오" },
  { key: "merch", href: "/works-merch", label: "굿즈 제작", title: "MERCHANDISING", subtitle: "MD 상품 기획 및 제작 포트폴리오", description: "헤세드코퍼레이션의 MD 상품 기획 및 제작 포트폴리오" },
  { key: "popup", href: "/works-popup", label: "팝업·이벤트", title: "POP-UP OPERATION", subtitle: "팝업스토어 및 현장 운영 프로젝트", description: "헤세드코퍼레이션의 팝업스토어 및 현장 운영 프로젝트 포트폴리오" },
  { key: "distribution", href: "/works-distribution", label: "유통", title: "DISTRIBUTION", subtitle: "유통 및 납품 프로젝트", description: "헤세드코퍼레이션의 유통 및 납품 프로젝트 포트폴리오" },
  { key: "vs", href: "/works-vs", label: "비주얼", title: "VISUAL STUDIO", subtitle: "비주얼 콘텐츠 제작 포트폴리오", description: "헤세드코퍼레이션의 비주얼 콘텐츠 제작 포트폴리오" },
  { key: "ai", href: "/works-ai", label: "AI 솔루션", title: "AI SOLUTION", subtitle: "AI 솔루션 프로젝트 포트폴리오", description: "헤세드코퍼레이션의 AI 솔루션 프로젝트 포트폴리오" },
];
