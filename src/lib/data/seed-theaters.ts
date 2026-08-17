import type { Theater } from "../types";
import { SCREENS } from "./seed-screens";

function cgv(code: string) {
  return `https://cgv.co.kr/cnm/bzplcCgv/${code}001`;
}
function lotte(cinemaId: string) {
  return `https://www.lottecinema.co.kr/NLCHS/Cinema/Detail?cinemaID=${cinemaId}`;
}
function megabox(brchNo: string) {
  return `https://www.megabox.co.kr/theater?brchNo=${brchNo}`;
}

const ALL_THEATERS: Theater[] = [
  { id: "cgv-yongsan", chain: "cgv", name: "CGV 용산아이파크몰", region: "서울", city: "용산구", address: "서울 용산구 한강대로23길 55", officialUrl: cgv("0013") },
  { id: "cgv-cheonho", chain: "cgv", name: "CGV 천호", region: "서울", city: "강동구", address: "서울 강동구 양재대로 1571", officialUrl: cgv("0199") },
  { id: "cgv-wangsimni", chain: "cgv", name: "CGV 왕십리", region: "서울", city: "성동구", address: "서울 성동구 왕십리광장로 17", officialUrl: cgv("0074") },
  { id: "cgv-ilsan", chain: "cgv", name: "CGV 일산", region: "경기", city: "고양시", address: "경기 고양시 일산동구 정발산로 24", officialUrl: cgv("0054") },
  { id: "cgv-pangyo", chain: "cgv", name: "CGV 판교", region: "경기", city: "성남시", address: "경기 성남시 분당구 판교역로 146", officialUrl: cgv("0181") },
  { id: "cgv-ori", chain: "cgv", name: "CGV 오리", region: "경기", city: "성남시", address: "경기 성남시 분당구 탄천상로151번길 20", officialUrl: cgv("0004") },
  { id: "cgv-shinsegae-gyeonggi", chain: "cgv", name: "CGV 신세계경기", region: "경기", city: "용인시", address: "경기 용인시 수지구 포은대로 536", officialUrl: cgv("0055") },
  { id: "cgv-seohyeon", chain: "cgv", name: "CGV 서현", region: "경기", city: "성남시", address: "경기 성남시 분당구 서현로180번길 19", officialUrl: cgv("0196") },
  { id: "cgv-yatap", chain: "cgv", name: "CGV 야탑", region: "경기", city: "성남시", address: "경기 성남시 분당구 성남대로925번길 16", officialUrl: cgv("0003") },
  { id: "cgv-gwanggyo", chain: "cgv", name: "CGV 광교", region: "경기", city: "수원시", address: "경기 수원시 영통구 광교중앙로 124", officialUrl: cgv("0257") },
  { id: "cgv-wirye", chain: "cgv", name: "CGV 스타필드시티위례", region: "경기", city: "하남시", address: "경기 하남시 위례대로 200", officialUrl: cgv("0274") },
  { id: "cgv-bucheon", chain: "cgv", name: "CGV 소풍", region: "경기", city: "부천시", address: "경기 부천시 길주로 1", officialUrl: cgv("0143") },
  { id: "cgv-bucheon-jungdong", chain: "cgv", name: "CGV 부천", region: "경기", city: "부천시", address: "경기 부천시 원미구 길주로 180", officialUrl: cgv("0015") },
  { id: "cgv-gimpo", chain: "cgv", name: "CGV 김포", region: "경기", city: "김포시", address: "경기 김포시 풍무로 128", officialUrl: cgv("0278") },
  { id: "cgv-baegot", chain: "cgv", name: "CGV 배곧", region: "경기", city: "시흥시", address: "경기 시흥시 서울대학로278번길 61", officialUrl: cgv("0226") },
  { id: "cgv-uijeongbu", chain: "cgv", name: "CGV 의정부", region: "경기", city: "의정부시", address: "경기 의정부시 평화로 525", officialUrl: cgv("0113") },
  { id: "cgv-incheon", chain: "cgv", name: "CGV 인천", region: "인천", city: "남동구", address: "인천 남동구 예술로 198", officialUrl: cgv("0002") },
  { id: "cgv-daejeon", chain: "cgv", name: "CGV 대전", region: "대전", city: "중구", address: "대전 중구 계백로 1700", officialUrl: cgv("0007") },
  { id: "cgv-jeonju", chain: "cgv", name: "CGV 전주효자", region: "전북", city: "전주시", address: "전북 전주시 완산구 용머리로 45", officialUrl: cgv("0179") },
  { id: "cgv-ulsan", chain: "cgv", name: "CGV 울산삼산", region: "울산", city: "남구", address: "울산 남구 화합로 185", officialUrl: cgv("0128") },
  { id: "cgv-daegu", chain: "cgv", name: "CGV 대구", region: "대구", city: "북구", address: "대구 북구 침산로 93", officialUrl: cgv("0345") },
  { id: "cgv-seomyeon", chain: "cgv", name: "CGV 서면", region: "부산", city: "부산진구", address: "부산 부산진구 동천로 4", officialUrl: cgv("0005") },
  { id: "cgv-centum", chain: "cgv", name: "CGV 센텀시티", region: "부산", city: "해운대구", address: "부산 해운대구 센텀남대로 35", officialUrl: cgv("0089") },
  { id: "cgv-gwangju", chain: "cgv", name: "CGV 광주터미널", region: "광주", city: "서구", address: "광주 서구 무진대로 904" },
  { id: "cgv-chuncheon", chain: "cgv", name: "CGV 춘천", region: "강원", city: "춘천시", address: "강원 춘천시 지석로 80", officialUrl: cgv("0070") },
  { id: "cgv-changwon", chain: "cgv", name: "CGV 창원더시티", region: "경남", city: "창원시", address: "경남 창원시 원이대로 332", officialUrl: cgv("0079") },
  { id: "cgv-cheongju", chain: "cgv", name: "CGV 청주(서문)", region: "충북", city: "청주시", address: "충북 청주시 상당구 상당로81번길 33", officialUrl: cgv("0228") },
  { id: "cgv-apgujeong", chain: "cgv", name: "CGV 압구정", region: "서울", city: "강남구", address: "서울 강남구 압구정로30길 45", officialUrl: cgv("0040") },
  { id: "cgv-yeongdeungpo", chain: "cgv", name: "CGV 영등포", region: "서울", city: "영등포구", address: "서울 영등포구 영중로 15", officialUrl: cgv("0059") },
  { id: "cgv-dongtan", chain: "cgv", name: "CGV 동탄", region: "경기", city: "화성시", address: "경기 화성시 동탄중앙로 220", officialUrl: cgv("0106") },
  { id: "cgv-pyeongtaek", chain: "cgv", name: "CGV 평택", region: "경기", city: "평택시", address: "경기 평택시 평택로 51", officialUrl: cgv("0052") },
  { id: "cgv-suncheon", chain: "cgv", name: "CGV 순천신대", region: "전남", city: "순천시", address: "전남 순천시 해룡면 해광로 199", officialUrl: cgv("0268") },
  { id: "cgv-cheonan-terminal", chain: "cgv", name: "CGV 천안터미널", region: "충남", city: "천안시", address: "충남 천안시 동남구 만남로 43", officialUrl: cgv("0293") },
  { id: "cgv-daejeon-terminal", chain: "cgv", name: "CGV 대전터미널", region: "대전", city: "동구", address: "대전 동구 동서대로1695번길 30", officialUrl: cgv("0127") },
  { id: "lotte-worldtower", chain: "lotte", name: "롯데시네마 월드타워", region: "서울", city: "송파구", address: "서울 송파구 올림픽로 300", officialUrl: lotte("1016") },
  { id: "lotte-sillim", chain: "lotte", name: "롯데시네마 신림", region: "서울", city: "관악구", address: "서울 관악구 신림로 330", officialUrl: lotte("1007") },
  { id: "lotte-jinju-mbcine", chain: "lotte", name: "롯데시네마 엠비씨네(진주)", region: "경남", city: "진주시", address: "경남 진주시 가호로 13", officialUrl: lotte("9105") },
  { id: "lotte-paju-unjeong", chain: "lotte", name: "롯데시네마 파주운정", region: "경기", city: "파주시", address: "경기 파주시 청암로17번길 17", officialUrl: lotte("3034") },
  { id: "lotte-suwon", chain: "lotte", name: "롯데시네마 수원", region: "경기", city: "수원시", address: "경기 수원시 권선구 세화로 134", officialUrl: lotte("3024") },
  { id: "lotte-suji", chain: "lotte", name: "롯데시네마 수지", region: "경기", city: "용인시", address: "경기 용인시 수지구 성복2로 38", officialUrl: lotte("3044") },
  { id: "lotte-gwangmyeong-outlet", chain: "lotte", name: "롯데시네마 광명아울렛", region: "경기", city: "광명시", address: "경기 광명시 일직로 17", officialUrl: lotte("3025") },
  { id: "lotte-dongtan", chain: "lotte", name: "롯데시네마 동탄", region: "경기", city: "화성시", address: "경기 화성시 동탄역로 160", officialUrl: lotte("3048") },
  { id: "lotte-pangyo", chain: "lotte", name: "롯데시네마 판교(창조경제밸리)", region: "경기", city: "성남시", address: "경기 성남시 수정구 창업로 18", officialUrl: lotte("3047") },
  { id: "mega-coex", chain: "megabox", name: "메가박스 코엑스", region: "서울", city: "강남구", address: "서울 강남구 영동대로 513", officialUrl: megabox("1351") },
  { id: "mega-dongdaegu", chain: "megabox", name: "메가박스 대구신세계(동대구)", region: "대구", city: "동구", address: "대구 동구 동부로 149", officialUrl: megabox("7011") },
  { id: "mega-namyangju", chain: "megabox", name: "메가박스 남양주현대아울렛스페이스원", region: "경기", city: "남양주시", address: "경기 남양주시 별내3로 332", officialUrl: megabox("0019") },
  { id: "mega-suwon-ak", chain: "megabox", name: "메가박스 수원AK플라자(수원역)", region: "경기", city: "수원시", address: "경기 수원시 팔달구 덕영대로 924", officialUrl: megabox("0052") },
  { id: "mega-suwon-starfield", chain: "megabox", name: "메가박스 수원스타필드", region: "경기", city: "수원시", address: "경기 수원시 장안구 수성로 175", officialUrl: megabox("0062") },
  { id: "mega-bundang", chain: "megabox", name: "메가박스 분당", region: "경기", city: "성남시", address: "경기 성남시 분당구 황새울로 332", officialUrl: megabox("4631") },
  { id: "mega-hanam", chain: "megabox", name: "메가박스 하남스타필드", region: "경기", city: "하남시", address: "경기 하남시 미사대로 750", officialUrl: megabox("4651") },
];

const theaterIdsWithScreens = new Set(SCREENS.map((s) => s.theaterId));

export const THEATERS: Theater[] = ALL_THEATERS.filter((t) => theaterIdsWithScreens.has(t.id));
