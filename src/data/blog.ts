/* ── Blog metadata: authors (dynasty characters) & categories ── */

export interface AuthorInfo {
  id: string;
  name: string;
  hanja: string;
  role: string;
  team: string;
  image: string;
  quote: string;
  pillar: string;
}

export interface CategoryInfo {
  id: string;
  label: string;
  description: string;
  color: string;
  colorLight: string;
}

export const authors: Record<string, AuthorInfo> = {
  oksu:     { id: 'oksu',     name: '옥수', hanja: '玉穗', role: 'Chief of Staff', team: 'AI 총괄 비서', image: '/dynasty/01-oksu.jpg',     quote: '전하의 뜻, 옥수가 헤아리옵니다.',              pillar: 'royal-court' },
  cheongha: { id: 'cheongha', name: '청하', hanja: '淸霞', role: 'Strategist',     team: '기획팀',       image: '/dynasty/02-cheongha.png', quote: '옛 것을 읽어 새 것을 짓나이다.',              pillar: 'chronicles' },
  mangchi:  { id: 'mangchi',  name: '망치', hanja: '金槌', role: 'Maker',          team: '제작팀',       image: '/dynasty/03-mangchi.png',  quote: '한 땀 한 땀, 정성으로 짓나이다.',              pillar: 'behind-the-silk' },
  geumbi:   { id: 'geumbi',   name: '금비', hanja: '錦緋', role: 'Dealer',         team: '세일즈팀',     image: '/dynasty/04-geumbi.png',   quote: '만 가지 물건, 한 마음의 단골.',                pillar: 'market-stall' },
  pilbong:  { id: 'pilbong',  name: '필봉', hanja: '筆鋒', role: 'Storyteller',    team: '홍보팀',       image: '/dynasty/05-pilbong.png',  quote: '한 줄의 진심이 천 리를 달리나이다.',           pillar: 'royal-wisdom' },
  baram:    { id: 'baram',    name: '바람', hanja: '韓風', role: 'Navigator',      team: '글로벌팀',     image: '/dynasty/06-baram.png',    quote: '바람처럼 오가며, 다리처럼 잇나이다.',          pillar: 'royal-court' },
  ilgak:    { id: 'ilgak',    name: '일각', hanja: '一刻', role: 'Timekeeper',     team: 'PM팀',         image: '/dynasty/07-ilgak.png',    quote: '한 시의 어긋남이 천릿길을 틀어지게 하나이다.', pillar: 'palace-news' },
  jupan:    { id: 'jupan',    name: '주판', hanja: '籌板', role: 'Treasurer',      team: '재무팀',       image: '/dynasty/08-jupan.png',    quote: '한 푼의 정직이 곧 천금의 신용이옵니다.',       pillar: 'market-stall' },
  songsa:   { id: 'songsa',   name: '송사', hanja: '訟事', role: 'Guardian',       team: '법무팀',       image: '/dynasty/09-songsa.png',   quote: '명문이 있어야 분쟁이 없사옵니다.',             pillar: 'royal-court' },
  indeok:   { id: 'indeok',   name: '인덕', hanja: '仁德', role: 'Caretaker',      team: '인사총무팀',   image: '/dynasty/10-indeok.png',   quote: '어진 마음이 궁궐을 밝히나이다.',               pillar: 'chronicles' },
};

export const categories: Record<string, CategoryInfo> = {
  'ip-license':       { id: 'ip-license',       label: 'IP 라이선스',       description: 'IP 라이선스 계약과 콜라보레이션 전략',      color: '#2E7850', colorLight: '#D6E8DD' },
  'merch-guide':      { id: 'merch-guide',      label: '굿즈 제작',         description: '캐릭터 굿즈 기획부터 생산까지',             color: '#1D6478', colorLight: '#D4E4EA' },
  'popup-store':      { id: 'popup-store',      label: '팝업스토어',        description: '팝업스토어 기획과 현장 운영',               color: '#B23A3A', colorLight: '#F2DDDD' },
  'distribution':     { id: 'distribution',     label: '유통 전략',         description: 'B2B 납품과 온라인 유통 채널',               color: '#C89B2A', colorLight: '#F2E6C4' },
  'visual-creative':  { id: 'visual-creative',  label: '비주얼',            description: '제품 촬영과 크리에이티브 콘텐츠',            color: '#764A78', colorLight: '#E6DCE8' },
  'global-trend':     { id: 'global-trend',     label: '글로벌',            description: '해외 시장 동향과 진출 전략',                color: '#1E3A6E', colorLight: '#D9E0EC' },
  'cost-analysis':    { id: 'cost-analysis',    label: '비용 분석',         description: '원가 구조와 수익성 분석',                   color: '#8F6E1C', colorLight: '#F2E6C4' },
  'legal-guide':      { id: 'legal-guide',      label: '계약 법률',         description: 'IP 계약과 법률 실무 가이드',                color: '#142851', colorLight: '#D9E0EC' },
  'trend-ai':         { id: 'trend-ai',         label: '트렌드 & AI',       description: '업계 트렌드와 AI 활용 인사이트',             color: '#764A78', colorLight: '#E6DCE8' },
  'editorial':        { id: 'editorial',        label: '편집장 기고',       description: '옥수의 특별 기고와 종합 인사이트',           color: '#1E3A6E', colorLight: '#D9E0EC' },
};

/** Map author → primary categories */
export const authorCategories: Record<string, string[]> = {
  cheongha: ['ip-license'],
  mangchi:  ['merch-guide'],
  ilgak:    ['popup-store'],
  geumbi:   ['distribution'],
  pilbong:  ['visual-creative'],
  baram:    ['global-trend'],
  jupan:    ['cost-analysis'],
  songsa:   ['legal-guide'],
  indeok:   ['trend-ai'],
  oksu:     ['editorial'],
};
