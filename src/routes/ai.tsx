import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, FileText, MessageSquare, Send, Sparkles } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";
import { Dropzone } from "@/components/massiva/Dropzone";
import { AiLoadingSteps } from "@/components/massiva/AiLoadingSteps";
import { AiResultDashboard } from "@/components/massiva/AiResultDashboard";
import { ChatBubble } from "@/components/massiva/ai/ChatBubble";
import { TypingDots } from "@/components/massiva/ai/TypingDots";
import { runAiSimulation, type AiResult } from "@/lib/aiSimulator";
import { loadStudentProfile } from "@/lib/studentProfile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "MASSIVA AI Orientation — Analyse intelligente de profil" },
      { name: "description", content: "Décris ton profil ou téléverse ton bulletin : notre IA simulée génère des recommandations de spécialités, un profil cognitif et une stratégie." },
      { property: "og:title", content: "MASSIVA AI Orientation" },
      { property: "og:description", content: "Analyse simulée de ton profil Bac avec recommandations personnalisées." },
    ],
  }),
  component: AiPage,
});

type Tab = "prompt" | "upload";
type State = "idle" | "chatting" | "loading" | "result";
type Msg = { role: "user" | "ai"; text: string };

function AiPage() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("prompt");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<AiResult | null>(null);
  const [messages, setMessages] = useState<Msg[]>([{ role: "ai", text: t("ai.greeting") }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, state]);

  const canSubmit = (tab === "prompt" && prompt.trim().length >= 5) || (tab === "upload" && file !== null);

  function start() {
    if (!canSubmit) return;
    if (tab === "prompt") {
      setMessages((m) => [...m, { role: "user", text: prompt }]);
    } else if (file) {
      setMessages((m) => [...m, { role: "user", text: `📎 ${file.name}` }]);
    }
    setState("loading");
  }

  function onLoadingDone() {
    const r = runAiSimulation({
      prompt: tab === "prompt" ? prompt : "",
      fileName: tab === "upload" ? file?.name : undefined,
      studentProfile: loadStudentProfile(),
    }, t);
    setResult(r);
    setMessages((m) => [...m, { role: "ai", text: r.summary }]);
    setState("result");
  }

  function reset() {
    setState("idle"); setResult(null); setPrompt(""); setFile(null);
    setMessages([{ role: "ai", text: t("ai.reset.greeting") }]);
  }

  const examples = ["ai.prompt.ex1", "ai.prompt.ex2", "ai.prompt.ex3", "ai.prompt.ex4"];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Bot className="h-3.5 w-3.5" /> MASSIVA AI
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{t("ai.title")}</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{t("ai.subtitle")}</p>
      </header>

      {state !== "result" && (
        <>
          {/* Chat thread */}
          <div className="mt-8 rounded-3xl border bg-card shadow-soft">
            <div ref={scrollRef} className="max-h-[280px] space-y-3 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role}>{m.text}</ChatBubble>
              ))}
              {state === "loading" && (
                <ChatBubble role="ai">
                  <span className="inline-flex items-center gap-2"><TypingDots /> {t("ai.analyzing")}</span>
                </ChatBubble>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                <div className="mb-4 inline-flex rounded-xl border bg-card p-1 shadow-soft">
                  {([
                    { id: "prompt" as const, label: t("ai.tab.prompt"), icon: MessageSquare },
                    { id: "upload" as const, label: t("ai.tab.upload"), icon: FileText },
                  ]).map(({ id, label, icon: Icon }) => (
                    <button
                      key={id} type="button" onClick={() => setTab(id)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                        tab === id ? "bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </button>
                  ))}
                </div>

                {tab === "prompt" && (
                  <div className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
                    <label className="mb-2 block text-sm font-semibold text-foreground">{t("ai.prompt.label")}</label>
                    <textarea
                      value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4}
                      placeholder={t("ai.prompt.placeholder")}
                      className="w-full resize-none rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Sparkles className="h-3 w-3" /> {t("ai.suggestions")}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {examples.map((k) => (
                          <button
                            key={k} type="button" onClick={() => setPrompt(t(k))}
                            className="rounded-full border bg-background px-3 py-1.5 text-xs text-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                          >
                            {t(k)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tab === "upload" && (
                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-foreground">{t("ai.upload.title")}</h2>
                    <Dropzone file={file} onFile={setFile} />
                  </div>
                )}

                <div className="mt-6 flex items-center justify-center">
                  <button
                    type="button" disabled={!canSubmit} onClick={start}
                    className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--grad-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lift transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> {t("ai.analyze")}
                  </button>
                </div>
              </motion.div>
            )}

            {state === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto mt-6 max-w-xl">
                <AiLoadingSteps onDone={onLoadingDone} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {state === "result" && result && (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
          <AiResultDashboard result={result} onReset={reset} />
        </motion.div>
      )}
    </main>
  );
}
