import { useState } from "react";
import { TV_TONIGHT, TV_KIND_COLORS } from "@/data/tv-tonight";
import { useTvTonight, type TvChannel } from "@/hooks/useTvTonight";

const VISIBLE = 5;

// Map format programme-tv.net → couleurs TvKind existantes.
const formatToKind = (format?: string) => {
  if (!format) return "DOCUMENTAIRE" as const;
  const f = format.toLowerCase();
  if (f.includes("série")) return "SÉRIE" as const;
  if (f.includes("doc")) return "DOCUMENTAIRE" as const;
  if (f.includes("magazine") || f.includes("infos") || f.includes("émission") || f.includes("emission"))
    return "ÉMISSION" as const;
  if (f.includes("musique") || f.includes("concert")) return "CONCERT" as const;
  if (f.includes("débat") || f.includes("politique")) return "DÉBAT" as const;
  return "ÉMISSION" as const;
};

const formatDateFr = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const ChannelCard = ({ channel, index }: { channel: TvChannel; index: number }) => {
  const hero = channel.hero;
  if (!hero) {
    // Pas de hero (erreur scrape par exemple) — card discrète
    return (
      <div
        className="flex flex-col rounded-sm p-7"
        style={{
          backgroundColor: "rgba(242,237,228,0.04)",
          border: "1px solid rgba(201,168,76,0.18)",
          opacity: 0.55,
          animation: `mm-slide-up 0.9s ease-out ${0.2 + index * 0.1}s both`,
        }}
      >
        <div
          className="font-serif-display"
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "hsl(var(--linen))",
            marginTop: "auto",
            marginBottom: "auto",
            textAlign: "center",
          }}
        >
          {channel.name}
        </div>
        <div
          className="font-sans-ui uppercase text-center"
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "rgba(242,237,228,0.5)",
            marginTop: 12,
          }}
        >
          Programme indisponible
        </div>
      </div>
    );
  }
  const kind = formatToKind(hero.format);
  const c = TV_KIND_COLORS[kind];

  return (
    <div
      className="flex flex-col rounded-sm p-7"
      style={{
        backgroundColor: "rgba(242,237,228,0.06)",
        border: "1px solid rgba(201,168,76,0.25)",
        animation: `mm-slide-up 0.9s ease-out ${0.2 + index * 0.12}s both`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className="font-sans-ui uppercase"
          style={{
            fontSize: 13,
            letterSpacing: "0.32em",
            color: "hsl(var(--gold))",
          }}
        >
          {hero.start}
        </div>
        {hero.format && (
          <div
            className="font-sans-ui uppercase rounded-sm px-2 py-1"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              backgroundColor: c.bg,
              color: c.fg,
              border: `1px solid ${c.border}`,
            }}
          >
            {hero.format}
          </div>
        )}
      </div>
      <div
        className="mt-4 font-serif-display leading-tight"
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: "hsl(var(--linen))",
        }}
      >
        {channel.name}
      </div>
      <div className="mt-2" style={{ width: 36, height: 1, backgroundColor: "hsl(var(--gold) / 0.6)" }} />
      <div
        className="mt-4 font-serif-display italic"
        style={{
          fontSize: 22,
          lineHeight: 1.25,
          color: "rgba(242,237,228,0.95)",
          fontWeight: 400,
        }}
      >
        {hero.title}
      </div>
      {hero.subtitle && (
        <div
          className="mt-2 font-serif-display"
          style={{
            fontSize: 17,
            lineHeight: 1.35,
            color: "rgba(242,237,228,0.7)",
          }}
        >
          {hero.subtitle}
        </div>
      )}
      <div
        className="font-sans-ui uppercase"
        style={{
          fontSize: 12,
          letterSpacing: "0.32em",
          color: "rgba(201,168,76,0.85)",
          lineHeight: 1.3,
          borderTop: "1px solid rgba(201,168,76,0.2)",
          marginTop: "auto",
          paddingTop: 16,
        }}
      >
        {hero.duration ?? ""}
        {hero.rebroadcast && (
          <span style={{ marginLeft: 10, color: "rgba(242,237,228,0.5)" }}>· Rediff.</span>
        )}
        {channel.next && (
          <div
            className="font-serif-display italic"
            style={{
              fontSize: 13,
              marginTop: 8,
              color: "rgba(242,237,228,0.55)",
              letterSpacing: "0",
              textTransform: "none",
            }}
          >
            Puis {channel.next.start} · {channel.next.title}
          </div>
        )}
      </div>
    </div>
  );
};

const TvLiveView = ({ data }: { data: import("@/hooks/useTvTonight").TvTonight }) => (
  <div
    className="absolute inset-0 px-28 pb-24 pt-36"
    style={{
      background: "linear-gradient(135deg, #1A1410 0%, #2E2419 60%, #0E0805 100%)",
    }}
  >
    <div
      className="pointer-events-none absolute"
      style={{
        top: "-15%",
        left: "-10%",
        width: 800,
        height: 800,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)",
      }}
    />
    <div className="relative">
      <div className="flex items-center gap-5">
        <div style={{ fontSize: 54 }}>📺</div>
        <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
        <div
          className="font-sans-ui uppercase"
          style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}
        >
          Ce soir à la télé · {formatDateFr(data.fetchedAt)}
        </div>
      </div>
      <h2
        className="mt-8 font-serif-display leading-[1]"
        style={{ fontSize: 110, color: "hsl(var(--linen))" }}
      >
        <span className="font-semibold">Cinq chaînes,</span>{" "}
        <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>
          cinq prime-time.
        </span>
      </h2>
      <p
        className="mt-6 max-w-[1240px] font-serif-display italic"
        style={{ fontSize: 32, lineHeight: 1.3, color: "rgba(242,237,228,0.7)" }}
      >
        Les programmes phares de TF1, France 2, France 5, Arte et M6 — mis à jour chaque matin.
      </p>

      <div className="mt-12 grid grid-cols-5 gap-6" style={{ height: 540 }}>
        {data.channels.slice(0, VISIBLE).map((ch, i) => (
          <ChannelCard key={ch.name} channel={ch} index={i} />
        ))}
      </div>

      <div
        className="mt-10 font-sans-ui uppercase text-center"
        style={{
          fontSize: 14,
          letterSpacing: "0.42em",
          color: "rgba(201,168,76,0.55)",
        }}
      >
        Grille TV · Source programme-tv.net · Rafraîchie chaque matin
      </div>
    </div>
  </div>
);

// Vue éditoriale (fallback quand tv-tonight.json n'est pas dispo)
const EditorialView = () => {
  const [pick] = useState(() => {
    const arr = [...TV_TONIGHT];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, VISIBLE);
  });

  return (
    <div
      className="absolute inset-0 px-28 pb-24 pt-36"
      style={{ background: "linear-gradient(135deg, #1A1410 0%, #2E2419 60%, #0E0805 100%)" }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-15%",
          left: "-10%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-5">
          <div style={{ fontSize: 54 }}>📺</div>
          <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div
            className="font-sans-ui uppercase"
            style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}
          >
            Café de spécialité & vin nature · Ce soir
          </div>
        </div>
        <h2
          className="mt-8 font-serif-display leading-[1]"
          style={{ fontSize: 110, color: "hsl(var(--linen))" }}
        >
          <span className="font-semibold">Cinq programmes</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>
            pour les esprits curieux.
          </span>
        </h2>
        <p
          className="mt-6 max-w-[1240px] font-serif-display italic"
          style={{ fontSize: 32, lineHeight: 1.3, color: "rgba(242,237,228,0.7)" }}
        >
          Notre sélection éditoriale — autour du café d'exception, du vin vivant et des terroirs.
        </p>

        <div className="mt-12 grid grid-cols-5 gap-6" style={{ height: 540 }}>
          {pick.map((p, i) => {
            const c = TV_KIND_COLORS[p.kind];
            return (
              <div
                key={`${p.channel}-${p.title}`}
                className="flex flex-col rounded-sm p-7"
                style={{
                  backgroundColor: "rgba(242,237,228,0.06)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.12}s both`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="font-sans-ui uppercase"
                    style={{ fontSize: 13, letterSpacing: "0.32em", color: "hsl(var(--gold))" }}
                  >
                    {p.slot}
                  </div>
                  <div
                    className="font-sans-ui uppercase rounded-sm px-2 py-1"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      backgroundColor: c.bg,
                      color: c.fg,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {p.kind}
                  </div>
                </div>
                <div
                  className="mt-4 font-serif-display leading-tight"
                  style={{ fontSize: 34, fontWeight: 600, color: "hsl(var(--linen))" }}
                >
                  {p.channel}
                </div>
                <div className="mt-2" style={{ width: 36, height: 1, backgroundColor: "hsl(var(--gold) / 0.6)" }} />
                <div
                  className="mt-4 font-serif-display italic"
                  style={{ fontSize: 22, lineHeight: 1.25, color: "rgba(242,237,228,0.95)" }}
                >
                  {p.title}
                </div>
                <div
                  className="mt-4 font-serif-display"
                  style={{ fontSize: 17, lineHeight: 1.35, color: "rgba(242,237,228,0.72)" }}
                >
                  {p.note}
                </div>
                <div
                  className="font-serif-display italic"
                  style={{
                    fontSize: 16,
                    color: "rgba(201,168,76,0.85)",
                    lineHeight: 1.3,
                    borderTop: "1px solid rgba(201,168,76,0.2)",
                    marginTop: "auto",
                    paddingTop: 16,
                  }}
                >
                  ✦ <span style={{ marginLeft: 4 }}>{p.pick}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-10 font-sans-ui uppercase text-center"
          style={{ fontSize: 16, letterSpacing: "0.42em", color: "rgba(201,168,76,0.7)" }}
        >
          Maison Maitre · Le bon goût, du grain au verre
        </div>
      </div>
    </div>
  );
};

export const TvTonightScene = () => {
  const tv = useTvTonight();
  if (tv && tv.channels.some((c) => c.hero)) {
    return <TvLiveView data={tv} />;
  }
  return <EditorialView />;
};
