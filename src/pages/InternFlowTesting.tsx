/**
 * Intern Flow Testing Page
 * 
 * Landing page for interns to test top 10 flows, rate them step-by-step,
 * and provide detailed feedback with PDF/JSON export.
 */

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TOP_10_FLOWS } from "@/data/top10Flows";

type RatingKey = "usability" | "clarity" | "speed" | "design" | "mobile" | "trust";

const RATING_CRITERIA: Array<{
  id: RatingKey;
  label: string;
  description: string;
}> = [
  { id: "usability", label: "Usability", description: "Wie leicht ist es, durchzukommen?" },
  { id: "clarity", label: "Klarheit", description: "Ist immer klar, was als Nächstes passiert?" },
  { id: "speed", label: "Speed", description: "Fühlt es sich schnell & frictionless an?" },
  { id: "design", label: "Design", description: "Wirkt es hochwertig und konsistent?" },
  { id: "mobile", label: "Mobile", description: "Thumb-Zone, Inputs, Scrolling, Safe-Areas." },
  { id: "trust", label: "Trust", description: "Badges, Transparenz, keine 'Sus'-Vibes." },
];

type FlowRating = {
  flowId: string;
  ratings: Record<RatingKey, number>;
  pros: string;
  cons: string;
  wouldRecommend: boolean;
  completedAt: string;
};

type TestSession = {
  testerName: string;
  startedAt: string;
  flowRatings: FlowRating[];
  finalFeedback: string;
  overallRanking: string[];
  completedAt?: string;
  meta?: {
    userAgent?: string;
    viewport?: { w: number; h: number };
  };
};

function avgRating(r: FlowRating) {
  const vals = Object.values(r.ratings);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function downloadFile(filename: string, text: string, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function InternFlowTesting() {
  const [phase, setPhase] = useState<"intro" | "testing" | "summary">("intro");
  const [testerName, setTesterName] = useState("");
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);

  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [currentRatings, setCurrentRatings] = useState<Partial<Record<RatingKey, number>>>({});
  const [currentPros, setCurrentPros] = useState("");
  const [currentCons, setCurrentCons] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  const [session, setSession] = useState<TestSession | null>(null);
  const [finalFeedback, setFinalFeedback] = useState("");
  const [overallRanking, setOverallRanking] = useState<string[]>([]);

  const summaryRef = useRef<HTMLDivElement | null>(null);

  const currentFlow = TOP_10_FLOWS[currentFlowIndex];

  const progress = useMemo(() => {
    const base = currentFlowIndex / TOP_10_FLOWS.length;
    const bonus = isFlowOpen ? 0.5 / TOP_10_FLOWS.length : 0;
    return Math.min(100, (base + bonus) * 100);
  }, [currentFlowIndex, isFlowOpen]);

  const startTesting = useCallback(() => {
    if (!testerName.trim()) {
      alert("Bitte gib deinen Namen ein.");
      return;
    }
    const s: TestSession = {
      testerName: testerName.trim(),
      startedAt: new Date().toISOString(),
      flowRatings: [],
      finalFeedback: "",
      overallRanking: [],
      meta: {
        userAgent: navigator.userAgent,
        viewport: { w: window.innerWidth, h: window.innerHeight },
      },
    };
    setSession(s);
    setPhase("testing");
  }, [testerName]);

  const submitFlowRating = useCallback(() => {
    if (!currentFlow) return;

    const missing = RATING_CRITERIA.filter((c) => !currentRatings[c.id]);
    if (missing.length) {
      alert(`Bitte bewerte alle Kriterien: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    if (wouldRecommend === null) {
      alert("Bitte gib an, ob du den Flow weiterempfehlen würdest.");
      return;
    }

    const rating: FlowRating = {
      flowId: currentFlow.id,
      ratings: currentRatings as Record<RatingKey, number>,
      pros: currentPros.trim(),
      cons: currentCons.trim(),
      wouldRecommend,
      completedAt: new Date().toISOString(),
    };

    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, flowRatings: [...prev.flowRatings, rating] };
      localStorage.setItem("internFlowTestingSessionDraft", JSON.stringify(next));
      return next;
    });

    setCurrentRatings({});
    setCurrentPros("");
    setCurrentCons("");
    setWouldRecommend(null);
    setIsFlowOpen(false);

    if (currentFlowIndex < TOP_10_FLOWS.length - 1) {
      setCurrentFlowIndex((i) => i + 1);
    } else {
      setPhase("summary");
    }
  }, [currentFlow, currentFlowIndex, currentRatings, currentPros, currentCons, wouldRecommend]);

  const derivedRanking = useMemo(() => {
    if (!session?.flowRatings?.length) return [];
    const sorted = [...session.flowRatings].sort((a, b) => avgRating(b) - avgRating(a));
    return sorted.map((r) => r.flowId);
  }, [session]);

  const ensureRanking = useCallback(() => {
    if (!overallRanking.length) setOverallRanking(derivedRanking);
  }, [overallRanking.length, derivedRanking]);

  const moveRankItem = useCallback((idx: number, dir: -1 | 1) => {
    setOverallRanking((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }, []);

  const exportPdf = useCallback(async () => {
    if (!summaryRef.current) return;
    const canvas = await html2canvas(summaryRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH) {
      pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
    } else {
      let remaining = imgH;
      let position = 0;
      while (remaining > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
        remaining -= pageH;
        position -= pageH;
        if (remaining > 0) pdf.addPage();
      }
    }

    pdf.save(`umzugscheck-intern-feedback-${session?.testerName || "tester"}.pdf`);
  }, [session?.testerName]);

  const submitFinalFeedback = useCallback(async () => {
    if (!session) return;
    if (!finalFeedback.trim()) {
      alert("Bitte gib ein Gesamtfeedback ein.");
      return;
    }

    const finalSession: TestSession = {
      ...session,
      finalFeedback: finalFeedback.trim(),
      overallRanking: overallRanking.length ? overallRanking : derivedRanking,
      completedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(finalSession, null, 2);

    const copied = await copyToClipboard(json);
    if (!copied) {
      downloadFile(`umzugscheck-intern-feedback-${finalSession.testerName}.json`, json);
      alert("Clipboard blocked — JSON wurde stattdessen heruntergeladen.");
    } else {
      alert("Feedback kopiert ✅ Jetzt in Slack/Email posten.");
    }

    console.log("Test Session Complete:", finalSession);
  }, [session, finalFeedback, overallRanking, derivedRanking]);

  // ---------- Intro Phase ----------
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Helmet>
          <title>Intern Flow Testing | Umzugscheck.ch</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="text-3xl font-bold">Intern Flow Testing</h1>
          <p className="mt-2 text-slate-300">
            Teste unsere <span className="font-semibold">Top 10</span> Umzugsofferten-Flows und bewerte jeden Flow.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold">So funktioniert's</h2>
            <ol className="mt-4 grid gap-4 md:grid-cols-3">
              <li className="rounded-xl bg-slate-900 p-4">
                <div className="text-sm text-slate-300">1</div>
                <div className="mt-1 font-semibold">Flow testen</div>
                <div className="mt-1 text-sm text-slate-300">Öffnen, durchgehen, Gefühl notieren.</div>
              </li>
              <li className="rounded-xl bg-slate-900 p-4">
                <div className="text-sm text-slate-300">2</div>
                <div className="mt-1 font-semibold">Bewerten</div>
                <div className="mt-1 text-sm text-slate-300">6 Kriterien + Pro/Contra.</div>
              </li>
              <li className="rounded-xl bg-slate-900 p-4">
                <div className="text-sm text-slate-300">3</div>
                <div className="mt-1 font-semibold">Export</div>
                <div className="mt-1 text-sm text-slate-300">JSON kopieren + PDF speichern.</div>
              </li>
            </ol>
          </div>

          {/* Top 10 Preview */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold mb-4">Top 10 Flows zum Testen</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {TOP_10_FLOWS.map((flow) => (
                <div
                  key={flow.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition-colors"
                >
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-xl 
                    bg-gradient-to-br ${flow.color} text-white font-bold text-lg shrink-0
                  `}>
                    {flow.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{flow.name}</p>
                    <p className="text-sm text-slate-400 truncate">{flow.description}</p>
                  </div>
                  <div className="text-sm text-slate-400 shrink-0">
                    {flow.estimatedTime}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold">Dein Name</h2>
            <div className="mt-4 flex gap-3">
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-slate-500 transition-colors"
                placeholder="Vorname Nachname"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startTesting()}
              />
              <button
                className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
                onClick={startTesting}
              >
                Test starten
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Tipp: Mach's ehrlich — wenn's nervt, dann nervt's. Wir wollen's killen, nicht schönreden.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Testing Phase ----------
  if (phase === "testing" && session && currentFlow) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Helmet>
          <title>Flow {currentFlowIndex + 1}/10 | Testing | Umzugscheck.ch</title>
        </Helmet>
        
        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm text-slate-300">{session.testerName}</div>
              <div className="text-xl font-bold">
                Flow {currentFlowIndex + 1} / {TOP_10_FLOWS.length}: {currentFlow.name}
              </div>
            </div>
            <div className="text-sm text-slate-300">{session.flowRatings.length} bewertet</div>
          </div>

          {/* Progress */}
          <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          {/* Flow Card */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm text-slate-300">
                  #{currentFlow.rank} • {currentFlow.steps} Steps • {currentFlow.estimatedTime}
                </div>
                <div className="mt-2 text-slate-200">{currentFlow.description}</div>
                <div className="mt-2 text-sm text-slate-400">{currentFlow.reason}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
                  onClick={() => window.open(currentFlow.url, "_blank", "noopener,noreferrer")}
                >
                  In neuem Tab öffnen
                </button>
                <button
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 font-semibold hover:bg-slate-900 transition-colors"
                  onClick={() => setIsFlowOpen((v) => !v)}
                >
                  {isFlowOpen ? "Flow schließen" : "Flow hier anzeigen"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview & Rating */}
          {isFlowOpen ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className={`rounded-2xl border border-slate-800 bg-slate-900/40 p-4 ${isFullscreen ? "lg:col-span-2" : ""}`}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-semibold">Flow-Preview</div>
                  <button
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1 text-sm hover:bg-slate-900 transition-colors"
                    onClick={() => setIsFullscreen((v) => !v)}
                  >
                    {isFullscreen ? "Verkleinern" : "Vollbild"}
                  </button>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <iframe 
                    title={currentFlow.id} 
                    src={currentFlow.url} 
                    className="h-[720px] w-full bg-white" 
                  />
                </div>
              </div>

              {!isFullscreen && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                  <div className="text-xl font-bold">Bewertung</div>
                  <div className="mt-1 text-sm text-slate-300">1 = schlecht, 5 = exzellent</div>

                  <div className="mt-6 space-y-5">
                    {RATING_CRITERIA.map((c) => (
                      <div key={c.id} className="rounded-xl bg-slate-950/50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">{c.label}</div>
                            <div className="text-sm text-slate-400">{c.description}</div>
                          </div>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <button
                                key={v}
                                className={`h-9 w-9 rounded-lg border text-sm font-semibold transition-colors ${
                                  currentRatings[c.id] === v
                                    ? "border-white bg-white text-slate-950"
                                    : "border-slate-700 bg-slate-950 text-white hover:border-slate-500"
                                }`}
                                onClick={() => setCurrentRatings((prev) => ({ ...prev, [c.id]: v }))}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-semibold">Was war gut? (Pro)</label>
                        <textarea
                          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-slate-500 transition-colors"
                          rows={4}
                          value={currentPros}
                          onChange={(e) => setCurrentPros(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold">Was war schlecht? (Contra)</label>
                        <textarea
                          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-slate-500 transition-colors"
                          rows={4}
                          value={currentCons}
                          onChange={(e) => setCurrentCons(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold">Würdest du den Flow weiterempfehlen?</div>
                      <div className="mt-2 flex gap-2">
                        <button
                          className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-colors ${
                            wouldRecommend === true 
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" 
                              : "border-slate-700 bg-slate-950 hover:border-slate-500"
                          }`}
                          onClick={() => setWouldRecommend(true)}
                        >
                          Ja ✅
                        </button>
                        <button
                          className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-colors ${
                            wouldRecommend === false 
                              ? "border-rose-500 bg-rose-500/20 text-rose-300" 
                              : "border-slate-700 bg-slate-950 hover:border-slate-500"
                          }`}
                          onClick={() => setWouldRecommend(false)}
                        >
                          Nein ❌
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold hover:bg-slate-900 transition-colors"
                        onClick={() => setIsFlowOpen(false)}
                      >
                        Zurück
                      </button>
                      <button
                        className="flex-1 rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
                        onClick={submitFlowRating}
                      >
                        Bewertung speichern
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
              Klicke auf <span className="font-semibold text-white">"In neuem Tab öffnen"</span> oder{" "}
              <span className="font-semibold text-white">"Flow hier anzeigen"</span>.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- Summary Phase ----------
  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Feedback Summary | Umzugscheck.ch</title>
      </Helmet>
      
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h1 className="text-3xl font-bold">Alle Flows getestet 🎉</h1>
          <p className="mt-2 text-slate-300">
            Danke, <span className="font-semibold">{session.testerName}</span>. Jetzt noch dein Fazit + Export.
          </p>
        </div>

        {/* Summary area for PDF */}
        <div ref={summaryRef} id="summary-area" className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold">Deine Bewertungen</h2>
            <div className="mt-4 space-y-3">
              {session.flowRatings.map((r, idx) => {
                const flow = TOP_10_FLOWS.find((f) => f.id === r.flowId);
                return (
                  <div key={r.flowId} className="flex items-center justify-between rounded-xl bg-slate-950/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-400">{idx + 1}</div>
                      <div>
                        <div className="font-semibold">{flow?.name ?? r.flowId}</div>
                        <div className="text-xs text-slate-400">{flow?.url}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{avgRating(r).toFixed(1)} / 5</div>
                      <div className={`text-xs ${r.wouldRecommend ? "text-emerald-300" : "text-rose-300"}`}>
                        {r.wouldRecommend ? "Empfohlen" : "Nicht empfohlen"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Overall Ranking (optional anpassen)</h2>
              <button
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900 transition-colors"
                onClick={ensureRanking}
              >
                Ranking aus Scores erzeugen
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {(overallRanking.length ? overallRanking : derivedRanking).map((id, idx) => {
                const flow = TOP_10_FLOWS.find((f) => f.id === id);
                return (
                  <div key={id} className="flex items-center justify-between rounded-xl bg-slate-950/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-sm text-slate-400">{idx + 1}</div>
                      <div className="font-semibold">{flow?.name ?? id}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm hover:bg-slate-900 transition-colors"
                        onClick={() => moveRankItem(idx, -1)}
                      >
                        ↑
                      </button>
                      <button
                        className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm hover:bg-slate-900 transition-colors"
                        onClick={() => moveRankItem(idx, 1)}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold">Dein Gesamtfeedback</h2>
            <p className="mt-1 text-sm text-slate-300">
              Was war dein Favorit? Wo gab's Friction? Was ist "must-fix"?
            </p>
            <textarea
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-slate-500 transition-colors"
              rows={8}
              value={finalFeedback}
              onChange={(e) => setFinalFeedback(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
            onClick={submitFinalFeedback}
          >
            Feedback (JSON) kopieren / downloaden
          </button>
          <button
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold hover:bg-slate-900 transition-colors"
            onClick={exportPdf}
          >
            Feedback als PDF exportieren
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Hinweis: PDF exportiert den sichtbaren Summary-Bereich (Ratings + Ranking + Fazit).
        </p>
      </div>
    </div>
  );
}
