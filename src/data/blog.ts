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
  'ip-trend':         { id: 'ip-trend',         label: 'IP 트렌드',         description: 'IP 시장 동향과 캐릭터 산업 트렌드 분석',       color: '#2E7850', colorLight: '#D6E8DD' },
  'goods-culture':    { id: 'goods-culture',    label: '굿즈 컬처',         description: '굿즈 문화 트렌드와 소비 심리 분석',            color: '#1D6478', colorLight: '#D4E4EA' },
  'popup-retail':     { id: 'popup-retail',     label: '팝업 & 리테일',     description: '팝업스토어·리테일 트렌드와 사례 분석',         color: '#B23A3A', colorLight: '#F2DDDD' },
  'market-insight':   { id: 'market-insight',   label: '마켓 인사이트',     description: '캐릭터 시장 데이터와 유통 트렌드 분석',        color: '#C89B2A', colorLight: '#F2E6C4' },
  'brand-story':      { id: 'brand-story',      label: '브랜드 스토리',     description: '성공 브랜드 분석과 스토리텔링 인사이트',       color: '#764A78', colorLight: '#E6DCE8' },
  'k-content-global': { id: 'k-content-global', label: 'K-콘텐츠 글로벌',   description: 'K-캐릭터·K-POP의 글로벌 확장 분석',           color: '#1E3A6E', colorLight: '#D9E0EC' },
  'fan-economy':      { id: 'fan-economy',      label: '팬덤 이코노미',     description: '팬덤 경제학과 컬렉팅 문화 트렌드',            color: '#8F6E1C', colorLight: '#F2E6C4' },
  'biz-legal':        { id: 'biz-legal',        label: '비즈니스 & 법률',   description: 'AI 저작권·IP 보호·계약 쟁점 분석',            color: '#142851', colorLight: '#D9E0EC' },
  'ai-biz':           { id: 'ai-biz',           label: 'AI & 비즈니스',     description: 'AI가 비즈니스를 바꾸는 현장과 트렌드',        color: '#764A78', colorLight: '#E6DCE8' },
  'editorial':        { id: 'editorial',        label: '인사이트 칼럼',     description: '옥수의 산업 전망과 경영 인사이트',            color: '#1E3A6E', colorLight: '#D9E0EC' },
  'kpop-monthly':     { id: 'kpop-monthly',     label: 'K-POP 라이브',      description: '이번 달 K-POP 콘서트·팬미팅·페스티벌 라인업', color: '#D63384', colorLight: '#F8DCEB' },
};

/** Map author → primary categories */
export const authorCategories: Record<string, string[]> = {
  cheongha: ['ip-trend'],
  mangchi:  ['goods-culture'],
  ilgak:    ['popup-retail'],
  geumbi:   ['market-insight'],
  pilbong:  ['brand-story'],
  baram:    ['k-content-global', 'kpop-monthly'],
  jupan:    ['fan-economy'],
  songsa:   ['biz-legal'],
  indeok:   ['ai-biz'],
  oksu:     ['editorial'],
};
