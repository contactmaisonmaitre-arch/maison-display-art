import { useEffect, useMemo } from "react";
import { useCarte, useDispo } from "@/hooks/useCarte";
import {
  BOARD,
  TAG_LABEL,
  currentMoment,
  ephemeresActive,
  slug,
  type CarteItem,
  type CarteTag,
} from "@/data/carte";
import { remoteUrl } from "@/lib/signage/remote";

// Carte mobile (QR code affiché sur la TV) : même charte que la carte
// imprimée, avec compositions, pastilles et boissons épuisées en direct.

const img = (src?: string) => {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return import.meta.env.DEV ? `/${src.replace(/^\//, "")}` : remoteUrl(src);
};

const PILL: Record<CarteTag, { bg: string; fg: string }> = {
  nouveau: { bg: BOARD.orange, fg: BOARD.wine },
  coeur: { bg: BOARD.wine, fg: "#FFFFFF" },
  vegetal: { bg: "#E4ECE3", fg: "#3E5A48" },
  glace: { bg: "#DCE6EA", fg: "#2F4B57" },
};

const Pill = ({ tag }: { tag: CarteTag }) => (
  <span
    style={{
      fontSize: 10,
      letterSpacing: "0.14em",
      fontWeight: 700,
      textTransform: "uppercase",
      padding: "3px 8px",
      borderRadius: 999,
      background: PILL[tag].bg,
      color: PILL[tag].fg,
      whiteSpace: "nowrap",
    }}
  >
    {tag === "coeur" ? "♥ " : ""}
    {TAG_LABEL[tag]}
  </span>
);

const Row = ({ it, soldOut }: { it: CarteItem; soldOut: boolean }) => (
  <div style={{ padding: "12px 0", borderBottom: `1px solid ${BOARD.rule}`, opacity: soldOut ? 0.45 : 1 }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 19, fontWeight: 600, textDecoration: soldOut ? "line-through" : "none" }}>{it.name}</span>
        {it.size && <span style={{ fontSize: 13, color: BOARD.muted, marginLeft: 6 }}>{it.size}</span>}
      </div>
      {soldOut ? (
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BOARD.muted }}>Épuisé</span>
      ) : (
        it.price && <span style={{ fontSize: 18, fontWeight: 600, fontVariantNumeric: "tabular-nums lining-nums" }}>{it.price} €</span>
      )}
    </div>
    {(it.pitch || it.desc) && (
      <div style={{ fontSize: 15, fontStyle: "italic", color: BOARD.muted, marginTop: 3, lineHeight: 1.35 }}>{it.pitch ?? it.desc}</div>
    )}
    {(it.tags?.length || it.allergenes?.length) ? (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7, alignItems: "center" }}>
        {(it.tags ?? []).map((t) => (
          <Pill key={t} tag={t} />
        ))}
        {it.allergenes?.length ? (
          <span style={{ fontSize: 12, color: BOARD.muted }}>Allergènes : {it.allergenes.join(", ")}</span>
        ) : null}
      </div>
    ) : null}
  </div>
);

const CarteMobile = () => {
  const carte = useCarte();
  const epuises = useDispo(60 * 1000);
  const moment = useMemo(() => currentMoment(carte), [carte]);

  useEffect(() => {
    document.title = "La carte · Maison Maitre";
    const prev = document.body.style.background;
    document.body.style.background = BOARD.cream;
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  const eph = carte && ephemeresActive(carte) ? carte.ephemeres : null;
  const sections = carte?.columns.flat() ?? [];
  const focus = new Set(moment?.focus ?? []);
  // Les sections de circonstance passent en premier sur mobile.
  const ordered = [...sections.filter((s) => focus.has(s.title)), ...sections.filter((s) => !focus.has(s.title))];

  return (
    <div className="font-serif-display" style={{ minHeight: "100vh", background: BOARD.cream, color: BOARD.wine, letterSpacing: "-0.005em" }}>
      <header style={{ background: BOARD.wine, color: "#FFFFFF", padding: "28px 20px 24px", textAlign: "center" }}>
        <img src="/brand/logo-white.png" alt="Maison Maitre" style={{ height: 70, margin: "0 auto 14px", display: "block" }} />
        <h1 style={{ fontSize: 46, fontWeight: 600, lineHeight: 1, margin: 0 }}>La Carte</h1>
        {moment ? (
          <p style={{ margin: "10px 0 0", color: BOARD.sand, fontStyle: "italic", fontSize: 17 }}>
            {moment.label} · {moment.titre}
          </p>
        ) : null}
      </header>

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "8px 20px 40px" }}>
        {!carte && <p style={{ textAlign: "center", marginTop: 40, fontStyle: "italic" }}>Chargement de la carte…</p>}

        {eph && (
          <section style={{ marginTop: 22 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.26em", fontWeight: 700, textTransform: "uppercase", color: BOARD.orange }}>
              {eph.eyebrow ?? "Éphémères"}
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 600, margin: "4px 0 14px" }}>{(eph.title ?? ["Les", "Éphémères"]).join(" ")}</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {eph.items.map((e) => {
                const out = epuises.includes(slug(e.name));
                return (
                  <article
                    key={e.name}
                    style={{ background: e.bg ?? "#EAE3D6", borderRadius: 20, padding: 16, display: "flex", gap: 14, opacity: out ? 0.5 : 1 }}
                  >
                    {e.image && <img src={img(e.image)} alt={e.name} style={{ width: 96, height: 96, objectFit: "contain", flexShrink: 0 }} />}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                        <strong style={{ fontSize: 19, lineHeight: 1.15 }}>{e.name}</strong>
                        <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 18, whiteSpace: "nowrap" }}>{out ? "Épuisé" : `${e.price} €`}</span>
                      </div>
                      {e.tagline && <div style={{ fontStyle: "italic", fontSize: 15, marginTop: 2 }}>{e.tagline}</div>}
                      {e.desc && <div style={{ fontSize: 14, color: BOARD.muted, marginTop: 6, lineHeight: 1.4 }}>{e.desc}</div>}
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        {(e.tags ?? [])
                          .map((t) => t.toLowerCase())
                          .filter((t): t is CarteTag => t in TAG_LABEL)
                          .map((t) => (
                            <Pill key={t} tag={t} />
                          ))}
                        {e.vegan && <Pill tag="vegetal" />}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {ordered.map((s) => (
          <section key={s.title} style={{ marginTop: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ fontSize: 32, fontWeight: 600, margin: 0 }}>{s.title}</h2>
              {focus.has(s.title) && (
                <span style={{ fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, background: BOARD.orange }}>
                  En ce moment
                </span>
              )}
            </div>
            {s.note && <p style={{ fontStyle: "italic", color: BOARD.muted, margin: "6px 0 0", fontSize: 15 }}>{s.note}</p>}
            {s.groups.map((g, gi) => (
              <div key={gi} style={{ marginTop: 8 }}>
                {g.label && (
                  <div style={{ fontSize: 12, letterSpacing: "0.26em", fontWeight: 700, textTransform: "uppercase", color: BOARD.muted, marginTop: 14 }}>
                    {g.label}
                  </div>
                )}
                {g.items.map((it) => (
                  <Row key={it.name} it={it} soldOut={epuises.includes(slug(it.name))} />
                ))}
              </div>
            ))}
          </section>
        ))}

        {carte?.side?.map((g) => (
          <section key={g.label} style={{ marginTop: 30, background: BOARD.wine, color: "#FFFFFF", borderRadius: 20, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.26em", fontWeight: 700, textTransform: "uppercase", color: BOARD.sand }}>{g.label}</div>
            {g.items.map((it) => (
              <div key={it.name} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(232,201,169,0.2)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{it.name}</div>
                  {it.desc && <div style={{ fontSize: 13, fontStyle: "italic", color: BOARD.sand }}>{it.desc}</div>}
                </div>
                {it.price && <div style={{ fontWeight: 600 }}>{it.price} €</div>}
              </div>
            ))}
          </section>
        ))}

        <footer style={{ marginTop: 30, textAlign: "center", fontSize: 14, color: BOARD.muted, lineHeight: 1.6 }}>
          {(carte?.footer ?? []).map((f) => (
            <div key={f}>{f}</div>
          ))}
          <div style={{ marginTop: 8 }}>Une question sur une composition ? L'équipe vous répond au comptoir.</div>
          <div style={{ marginTop: 14, fontStyle: "italic" }}>Maison Maitre · 16 rue de Besançon, Dole</div>
        </footer>
      </main>
    </div>
  );
};

export default CarteMobile;
