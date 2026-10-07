import { ImageResponse } from "next/og";
import { contact, seo, site } from "@/content/site-content";

/**
 * Gambar Open Graph (pratinjau saat tautan dibagikan di WhatsApp, Facebook, dsb.).
 * Dibuat saat pertama diminta lalu di-cache — tidak membebani pemuatan halaman.
 * Next.js otomatis menautkannya ke og:image dan twitter:image.
 *
 * Gaya mengikuti identitas situs: navy, aksen emas, dan seal AFK.
 * TODO: ganti dengan foto kantor bila sudah tersedia (cukup ubah isi JSX di bawah).
 */

// Runtime Edge: dianjurkan untuk ImageResponse, dan menghindari bug path font bawaan
// @vercel/og pada runtime Node di Windows (Next 14). Di Vercel hasilnya di-cache CDN.
export const runtime = "edge";

export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0A1628";
const GOLD = "#D4AF6A";
const GOLD_LIGHT = "#E1C68C";
const CREAM = "#FDFBF7";
const MUTED = "#9BB0CC";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: NAVY,
          padding: "0 80px",
          position: "relative",
        }}
      >
        {/* Bingkai tipis ala kop akta */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `1px solid ${GOLD}55`,
            borderRadius: 12,
            display: "flex",
          }}
        />

        {/* Seal */}
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: 9999,
            border: `2px solid ${GOLD}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 202,
              height: 202,
              borderRadius: 9999,
              border: `4px solid ${GOLD}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 64, color: GOLD_LIGHT, letterSpacing: 2 }}>AFK</div>
            <div style={{ width: 96, height: 2, background: GOLD, margin: "6px 0 10px" }} />
            <div style={{ fontSize: 17, color: GOLD, letterSpacing: 5 }}>NOTARIS</div>
            <div style={{ fontSize: 17, color: GOLD, letterSpacing: 5 }}>& PPAT</div>
          </div>
        </div>

        {/* Teks */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 56 }}>
          <div style={{ fontSize: 22, color: GOLD, letterSpacing: 4, textTransform: "uppercase" }}>
            Notaris & PPAT
          </div>
          <div style={{ fontSize: 46, color: CREAM, marginTop: 14, lineHeight: 1.15 }}>
            {site.notaryName}
          </div>
          <div style={{ width: 96, height: 2, background: GOLD, margin: "28px 0" }} />
          <div style={{ fontSize: 28, color: MUTED }}>
            {`${contact.addressStreet}, Kabupaten Gorontalo`}
          </div>
          <div style={{ fontSize: 26, color: GOLD_LIGHT, marginTop: 14 }}>{site.domain}</div>
        </div>
      </div>
    ),
    size,
  );
}
