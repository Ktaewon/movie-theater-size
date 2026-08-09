# ScreenMeter — 한국 영화관 스크린 비교

CGV · 롯데시네마 · 메가박스 상영관 스크린을 **면적·가로·세로**로 비교하고, **사용자 제보 → 관리자 승인**으로 DB를 키우는 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

- 비교: http://localhost:3000
- 제보: http://localhost:3000/report
- 관리: http://localhost:3000/admin (키: `dev-admin` 또는 `ADMIN_KEY`)

## 데이터

- 지점·상영관 시드: `src/lib/data/seed-*.ts`
- 런타임 제보/승인: `data/runtime-store.json` (로컬 파일)
- 프로덕션용 Postgres 스키마: `supabase/migrations/20260309000000_initial.sql`

공식 통합 스크린 크기 API는 없습니다. 시드에는 **가로·세로가 출처와 함께 확인된 상영관만** 넣습니다(추정·빈 skeleton 없음).

포함 예:
- CGV IMAX (위키백과 영화관 목록)
- 롯데 월드타워 주요 관 (익무 수치), 신림 LED (보도)
- 메가박스 코엑스 Dolby / MEGA LED (커뮤니티·보도)

그 외 관은 제보 → 승인 후에만 목록에 올라갑니다.

## 환경변수

`.env.local` 예시:

```
ADMIN_KEY=your-secret
```
