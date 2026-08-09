import type { Theater } from "../types";
import { SCREENS } from "./seed-screens";

const ALL_THEATERS: Theater[] = [
  { id: "cgv-yongsan", chain: "cgv", name: "CGV 용산아이파크몰", region: "서울", city: "용산구", address: "서울 용산구 한강대로23길 55" },
  { id: "cgv-cheonho", chain: "cgv", name: "CGV 천호", region: "서울", city: "강동구", address: "서울 강동구 양재대로 1571" },
  { id: "cgv-wangsimni", chain: "cgv", name: "CGV 왕십리", region: "서울", city: "성동구", address: "서울 성동구 왕십리광장로 17" },
  { id: "cgv-ilsan", chain: "cgv", name: "CGV 일산", region: "경기", city: "고양시", address: "경기 고양시 일산동구 정발산로 24" },
  { id: "cgv-pangyo", chain: "cgv", name: "CGV 판교", region: "경기", city: "성남시", address: "경기 성남시 분당구 판교역로 146" },
  { id: "cgv-gwanggyo", chain: "cgv", name: "CGV 광교", region: "경기", city: "수원시", address: "경기 수원시 영통구 광교중앙로 124" },
  { id: "cgv-bucheon", chain: "cgv", name: "CGV 소풍", region: "경기", city: "부천시", address: "경기 부천시 길주로 1" },
  { id: "cgv-uijeongbu", chain: "cgv", name: "CGV 의정부", region: "경기", city: "의정부시", address: "경기 의정부시 평화로 525" },
  { id: "cgv-incheon", chain: "cgv", name: "CGV 인천", region: "인천", city: "남동구", address: "인천 남동구 예술로 198" },
  { id: "cgv-daejeon", chain: "cgv", name: "CGV 대전", region: "대전", city: "중구", address: "대전 중구 계백로 1700" },
  { id: "cgv-jeonju", chain: "cgv", name: "CGV 전주효자", region: "전북", city: "전주시", address: "전북 전주시 완산구 용머리로 45" },
  { id: "cgv-ulsan", chain: "cgv", name: "CGV 울산삼산", region: "울산", city: "남구", address: "울산 남구 화합로 185" },
  { id: "cgv-daegu", chain: "cgv", name: "CGV 대구", region: "대구", city: "북구", address: "대구 북구 침산로 93" },
  { id: "cgv-seomyeon", chain: "cgv", name: "CGV 서면", region: "부산", city: "부산진구", address: "부산 부산진구 동천로 4" },
  { id: "cgv-centum", chain: "cgv", name: "CGV 센텀시티", region: "부산", city: "해운대구", address: "부산 해운대구 센텀남대로 35" },
  { id: "cgv-gwangju", chain: "cgv", name: "CGV 광주터미널", region: "광주", city: "서구", address: "광주 서구 무진대로 904" },
  { id: "cgv-chuncheon", chain: "cgv", name: "CGV 춘천", region: "강원", city: "춘천시", address: "강원 춘천시 지석로 80" },
  { id: "cgv-changwon", chain: "cgv", name: "CGV 창원더시티", region: "경남", city: "창원시", address: "경남 창원시 원이대로 332" },
  { id: "cgv-cheongju", chain: "cgv", name: "CGV 청주(서문)", region: "충북", city: "청주시", address: "충북 청주시 상당구 상당로81번길 33" },
  { id: "lotte-worldtower", chain: "lotte", name: "롯데시네마 월드타워", region: "서울", city: "송파구", address: "서울 송파구 올림픽로 300" },
  { id: "lotte-sillim", chain: "lotte", name: "롯데시네마 신림", region: "서울", city: "관악구", address: "서울 관악구 신림로 330" },
  { id: "lotte-jinju-mbcine", chain: "lotte", name: "롯데시네마 엠비씨네(진주)", region: "경남", city: "진주시", address: "경남 진주시 가호로 13" },
  { id: "mega-coex", chain: "megabox", name: "메가박스 코엑스", region: "서울", city: "강남구", address: "서울 강남구 영동대로 513" },
  { id: "mega-dongdaegu", chain: "megabox", name: "메가박스 대구신세계(동대구)", region: "대구", city: "동구", address: "대구 동구 동부로 149" },
  { id: "mega-namyangju", chain: "megabox", name: "메가박스 남양주현대아울렛스페이스원", region: "경기", city: "남양주시", address: "경기 남양주시 별내3로 332" },
  { id: "mega-suwon-ak", chain: "megabox", name: "메가박스 수원AK플라자(수원역)", region: "경기", city: "수원시", address: "경기 수원시 팔달구 덕영대로 924" },
];

const theaterIdsWithScreens = new Set(SCREENS.map((s) => s.theaterId));

export const THEATERS: Theater[] = ALL_THEATERS.filter((t) => theaterIdsWithScreens.has(t.id));
