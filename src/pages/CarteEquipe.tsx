import { useEffect, useMemo, useState } from "react";
import { useCarte, fetchDispo, DISPO_PATH } from "@/hooks/useCarte";
import { BOARD, allItems } from "@/data/carte";

// Page équipe : cocher une boisson « épuisée » depuis un téléphone.
// Écrit public/data/dispo.json sur GitHub (API) avec un jeton personnel
// gardé uniquement dans ce navigateur. La TV et la carte mobile suivent
// en ~2 minutes, sans republier le site.

const REPO = "contactmaisonmaitre-arch/maison-display-art";
const TOKEN_KEY = "mm-github-token";

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
};

const toB64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
};

async function saveDispo(token: string, epuises: string[]) {
  const url = `https://api.github.com/repos/${REPO}/contents/${DISPO_PATH}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };
  for (let attempt = 0; attempt < 2; attempt++) {
    const cur = await fetch(`${url}?ref=main`, { headers, cache: "no-store" });
    if (cur.status === 401 || cur.status === 403) throw new Error("Jeton refusé par GitHub.");
    const sha = cur.ok ? ((await cur.json()) as { sha: string }).sha : undefined;
    const body = {
      _aide: "Boissons épuisées (identifiants = nom en minuscules sans accents, tirets). Modifié par la page /carte/equipe.",
      epuises: [...epuises].sort(),
      updatedAt: new Date().toISOString(),
    };
    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `dispo: ${epuises.length ? `épuisé ${epuises.join(", ")}` : "tout est disponible"}`,
        content: toB64(`${JSON.stringify(body, null, 2)}\n`),
        sha,
        branch: "main",
      }),
    });
    if (res.ok) return;
    if (res.status !== 409) throw new Error(`GitHub a répondu ${res.status}.`);
  }
  throw new Error("Conflit d'enregistrement, réessaie.");
}

const CarteEquipe = () => {
  const carte = useCarte();
  const items = useMemo(() => allItems(carte), [carte]);
  const [token, setToken] = useState(readToken);
  const [draft, setDraft] = useState("");
  const [epuises, setEpuises] = useState<string[] | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Épuisés · Maison Maitre";
    fetchDispo().then((d) => setEpuises(d?.epuises ?? []));
  }, []);

  const toggle = async (id: string) => {
    if (!epuises || busy) return;
    const next = epuises.includes(id) ? epuises.filter((x) => x !== id) : [...epuises, id];
    const prev = epuises;
    setEpuises(next);
    setBusy(true);
    setStatus("Enregistrement…");
    try {
      await saveDispo(token, next);
      setStatus("Enregistré ✓ La TV se met à jour d'ici 2 minutes.");
    } catch (e) {
      setEpuises(prev);
      setStatus(e instanceof Error ? e.message : "Erreur d'enregistrement.");
    } finally {
      setBusy(false);
    }
  };

  const page: React.CSSProperties = { minHeight: "100vh", background: BOARD.cream, color: BOARD.wine };

  if (!token) {
    return (
      <div className="font-serif-display" style={page}>
        <main style={{ maxWidth: 520, margin: "0 auto", padding: "40px 20px" }}>
          <h1 style={{ fontSize: 34, fontWeight: 600 }}>Épuisés — accès équipe</h1>
          <p style={{ lineHeight: 1.5, marginTop: 12 }}>
            À faire une seule fois sur ce téléphone : colle le jeton GitHub de la boutique (fine-grained token, accès
            « Contents : Read and write » au dépôt maison-display-art). Il reste enregistré dans ce navigateur uniquement.
          </p>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value.trim())}
            placeholder="github_pat_…"
            style={{ width: "100%", marginTop: 16, padding: 14, fontSize: 16, borderRadius: 12, border: `1px solid ${BOARD.rule}` }}
          />
          <button
            onClick={() => {
              try {
                localStorage.setItem(TOKEN_KEY, draft);
              } catch {
                /* navigation privée : le jeton ne tiendra que cette session */
              }
              setToken(draft);
            }}
            disabled={!draft}
            style={{ marginTop: 12, width: "100%", padding: 14, fontSize: 17, fontWeight: 600, borderRadius: 12, background: BOARD.wine, color: "#FFFFFF", border: 0 }}
          >
            Enregistrer
          </button>
        </main>
      </div>
    );
  }

  const sections = Array.from(new Set(items.map((i) => i.section)));

  return (
    <div className="font-serif-display" style={page}>
      <header style={{ background: BOARD.wine, color: "#FFFFFF", padding: "22px 20px", position: "sticky", top: 0, zIndex: 2 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Boissons épuisées</h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: BOARD.sand, minHeight: 18 }}>
          {status || "Touche une boisson pour la passer en épuisée (ou la remettre)."}
        </p>
      </header>
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "10px 20px 40px" }}>
        {!epuises && <p style={{ fontStyle: "italic", marginTop: 20 }}>Chargement…</p>}
        {epuises &&
          sections.map((sec) => (
            <section key={sec} style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>{sec}</h2>
              {items
                .filter((i) => i.section === sec)
                .map((i) => {
                  const out = epuises.includes(i.id);
                  return (
                    <button
                      key={i.id}
                      onClick={() => toggle(i.id)}
                      disabled={busy}
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        marginBottom: 8,
                        borderRadius: 14,
                        border: `1px solid ${out ? BOARD.muted : BOARD.rule}`,
                        background: out ? "#EADFD8" : "#FFFFFF",
                        color: BOARD.wine,
                        fontSize: 17,
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      <span style={{ textDecoration: out ? "line-through" : "none" }}>{i.name}</span>
                      <span
                        style={{
                          fontSize: 12,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "5px 10px",
                          borderRadius: 999,
                          background: out ? BOARD.wine : "#E4ECE3",
                          color: out ? "#FFFFFF" : "#3E5A48",
                        }}
                      >
                        {out ? "Épuisé" : "Dispo"}
                      </span>
                    </button>
                  );
                })}
            </section>
          ))}
        <button
          onClick={() => {
            try {
              localStorage.removeItem(TOKEN_KEY);
            } catch {
              /* rien */
            }
            setToken("");
          }}
          style={{ marginTop: 30, background: "none", border: 0, color: BOARD.muted, textDecoration: "underline", fontSize: 14 }}
        >
          Oublier le jeton sur ce téléphone
        </button>
      </main>
    </div>
  );
};

export default CarteEquipe;
