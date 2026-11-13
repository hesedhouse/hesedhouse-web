// About 페이지 "사업·브랜드" 섹션 데이터.
// 문구는 이미 공개된 서비스·포트폴리오 설명에서 가져왔다. 항목을 더하거나 빼려면 이 파일만 고치면 된다.
// 넣지 않은 것: 플루이(PLUEE, 출시 전·브랜드명 재검토 중), 쿳즈·얼떨이(준비 중), 굿중박(헤세드하우스 소속).

export interface BusinessItem {
  name: string;
  desc: string;
  /** 내부 서비스 페이지 또는 외부 사이트 */
  href?: string;
  /** 오른쪽 작은 분류 표기 */
  tag?: string;
}

/** 고객사와 함께 만드는 일 — 서비스 페이지로 연결 */
export const clientBusiness: BusinessItem[] = [
  { name: "IP 라이선스 & 콜라보", desc: "IP 라이선스 확보와 브랜드 콜라보레이션의 파트너십 구조를 설계합니다.", href: "/iplicensecollabo" },
  { name: "굿즈 제작", desc: "굿즈와 MD 상품을 기획·디자인·생산해 납품합니다.", href: "/goods" },
  { name: "팝업스토어 운영", desc: "팝업스토어, 전시, 이벤트를 기획부터 현장 운영까지 맡습니다.", href: "/popupoperation" },
  { name: "유통 · 라이브커머스", desc: "온·오프라인 유통 채널과 해외 진출, 실시간 판매 방송을 운영합니다.", href: "/distribution" },
  { name: "비주얼 스튜디오", desc: "브랜드 아이덴티티를 위한 비주얼 콘텐츠를 제작합니다.", href: "/visualstudio" },
  { name: "AI 솔루션", desc: "AI로 업무를 설계하고 비즈니스를 자동화합니다.", href: "/ai-solution" },
  { name: "투자 & 사업개발", desc: "IP·콘텐츠·테크 분야에 투자하고 함께 사업을 개발합니다.", href: "/investment" },
];

/** 직접 운영하는 브랜드와 서비스 */
export const ownBusiness: BusinessItem[] = [
  { name: "굿즈나라", desc: "IP 캐릭터 굿즈 전문 셀렉트샵. 상품 큐레이션부터 온라인 판매, CS까지 직접 운영합니다.", tag: "COMMERCE" },
  { name: "BRICKS", desc: "벽돌을 모티브로 한 의류 중심 자체 브랜드. 기획부터 제품 개발, 온라인 론칭까지 직접 구축했습니다.", tag: "BRAND" },
  { name: "MindScope Korea", desc: "AI 여론·소비자 인식 조사 서비스.", href: "https://mindscopekorea.com", tag: "AI SERVICE" },
  { name: "헤세드왕조", desc: "조선 궁궐을 모티프로 한 캐릭터 10인의 오리지널 세계관. IP를 직접 키워가고 있습니다.", tag: "ORIGINAL IP" },
  { name: "Rainbow Ark", desc: "AI 영상으로 만드는 어린이 성경동화 유튜브 채널.", tag: "CONTENT" },
  { name: "동네소리", desc: "동 단위 주민 커뮤니티 서비스.", tag: "PLATFORM" },
];
