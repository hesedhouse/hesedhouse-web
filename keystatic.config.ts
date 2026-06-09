import { config, fields, collection } from '@keystatic/core';

const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'hesedhouse/hesedhouse-web',
      }
    : {
        kind: 'local',
      },

  collections: {
    blog: collection({
      label: '블로그',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: '제목' } }),
        description: fields.text({ label: '설명', multiline: true }),
        pubDate: fields.date({ label: '발행일' }),
        updatedDate: fields.date({ label: '수정일' }),
        category: fields.select({
          label: '카테고리',
          options: [
            { label: 'IP 트렌드', value: 'ip-trend' },
            { label: '굿즈 컬처', value: 'goods-culture' },
            { label: '팝업 리테일', value: 'popup-retail' },
            { label: '마켓 인사이트', value: 'market-insight' },
            { label: '브랜드 스토리', value: 'brand-story' },
            { label: 'K-콘텐츠 글로벌', value: 'k-content-global' },
            { label: '팬 이코노미', value: 'fan-economy' },
            { label: '비즈니스 & 법률', value: 'biz-legal' },
            { label: 'AI 비즈니스', value: 'ai-biz' },
            { label: '에디토리얼', value: 'editorial' },
            { label: 'K-POP 먼슬리', value: 'kpop-monthly' },
          ],
          defaultValue: 'brand-story',
        }),
        tags: fields.array(fields.text({ label: '태그' }), {
          label: '태그 목록',
          itemLabel: (props) => props.value,
        }),
        author: fields.select({
          label: '작성자',
          options: [
            { label: '옥수 (AI 총괄 비서)', value: 'oksu' },
            { label: '청하 (기획팀)', value: 'cheongha' },
            { label: '망치 (제작팀)', value: 'mangchi' },
            { label: '세종 (글로벌팀)', value: 'sejong' },
            { label: '필봉 (홍보팀)', value: 'pilbong' },
            { label: '두리 (인사총무팀)', value: 'duri' },
            { label: '소리 (재무팀)', value: 'sori' },
            { label: '한울 (법무팀)', value: 'hanul' },
            { label: '다올 (영업팀)', value: 'daol' },
            { label: '인덕 (PM팀)', value: 'indeok' },
          ],
          defaultValue: 'oksu',
        }),
        heroImage: fields.image({
          label: '대표 이미지',
          directory: 'public/blog',
          publicPath: '/blog/',
        }),
        heroImageAlt: fields.text({ label: '이미지 alt 텍스트' }),
        draft: fields.checkbox({ label: '초안 (비공개)', defaultValue: false }),
        content: fields.markdoc({ label: '본문' }),
      },
    }),

    portfolio: collection({
      label: '포트폴리오',
      slugField: 'title',
      path: 'src/content/portfolio/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: '프로젝트명' } }),
        category: fields.select({
          label: '카테고리',
          options: [
            { label: 'IP 라이선스 & 콜라보', value: 'ip' },
            { label: '머천다이징', value: 'merch' },
            { label: '팝업 운영', value: 'popup' },
            { label: '유통', value: 'distribution' },
            { label: '비주얼 스튜디오', value: 'vs' },
            { label: 'AI 솔루션', value: 'ai' },
          ],
          defaultValue: 'merch',
        }),
        client: fields.text({ label: '클라이언트' }),
        description: fields.text({ label: '설명', multiline: true }),
        year: fields.text({ label: '연도', defaultValue: '2026' }),
        tag: fields.text({ label: '태그 (카드 상단)' }),
        order: fields.integer({ label: '정렬 순서', defaultValue: 0 }),
        draft: fields.checkbox({ label: '초안 (비공개)', defaultValue: false }),
        content: fields.markdoc({ label: '상세 내용 (선택)' }),
      },
    }),

    dynasty: collection({
      label: '헤세드왕조 인물',
      slugField: 'name',
      path: 'src/content/dynasty/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: '이름' } }),
        hanja: fields.text({ label: '한자' }),
        role: fields.text({ label: '역할 (영문)' }),
        team: fields.text({ label: '팀' }),
        personality: fields.text({ label: 'MBTI' }),
        quote: fields.text({ label: '한 줄 소개' }),
        image: fields.text({ label: '이미지 경로' }),
        order: fields.integer({ label: '순서' }),
        content: fields.markdoc({ label: '상세 소개' }),
      },
    }),
  },
});
