import { ImageResponse } from "next/og";

export const alt = "스크린미터 · 한국 영화관 스크린 비교";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#111827",
          color: "#f9fafb",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, opacity: 0.7 }}>SCREENMETER</div>
        <div style={{ fontSize: 56, fontWeight: 700, marginTop: 20, lineHeight: 1.2 }}>
          Compare Korean cinema screens
        </div>
        <div style={{ fontSize: 28, opacity: 0.8, marginTop: 28 }}>
          CGV · Lotte Cinema · Megabox
        </div>
      </div>
    ),
    { ...size },
  );
}
