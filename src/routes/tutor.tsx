import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { getTooth, type L } from "@/lib/teeth";
import {
  recognitionSteps,
  tellApart,
  MESIAL_DISTAL_LESSON,
  MIRROR_LESSON,
  mirrorFdi,
} from "@/lib/lessons";
import { classIAntagonists } from "@/lib/anatomyFacts";
import { assessRecognitionAnswer } from "@/lib/tutorAssessment";
import { SectionTitle, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Send, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Tutor dentale — DentalMind3D" },
      {
        name: "description",
        content: "Tutor socratico in quattro lingue (IT/DE/EN/SQ): ti guida a ragionare su arcata, gruppo, cuspidi, radici, mesiale/distale e numero FDI.",
      },
      { property: "og:title", content: "Tutor dentale — DentalMind3D" },
      { property: "og:description", content: "Un tutor che ti fa ragionare invece di darti la risposta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TutorPage,
});

/** Tutor messages keep all four languages, so switching language re-renders the whole chat. */
type Msg = { role: "tutor"; text: L } | { role: "user"; text: string };

interface Session {
  fdi: string;
  step: number;
  awaiting: boolean;
}

const GREETING: L = {
  it: "Ciao! Sono il tuo tutor di anatomia dentale. Non ti do subito la risposta: ti guido a ragionare. Scrivi un numero FDI (es. «Aiutami a riconoscere il 14»), chiedimi la differenza tra due denti oppure un concetto come mesiale e distale.",
  de: "Hallo! Ich bin dein Tutor für Zahnanatomie. Ich gebe dir nicht sofort die Lösung, sondern führe dich zum eigenen Denken. Schreibe eine FDI-Nummer (z. B. „Hilf mir, den 14 zu erkennen“), frage nach dem Unterschied zweier Zähne oder nach einem Begriff wie mesial und distal.",
  en: "Hi! I'm your dental anatomy tutor. I won't give you the answer straight away: I'll guide your reasoning. Type an FDI number (e.g. 'Help me recognise 14'), ask me the difference between two teeth, or a concept such as mesial and distal.",
  sq: "Përshëndetje! Jam tutori yt i anatomisë dentare. Nuk ta jap menjëherë përgjigjen: të udhëheq të arsyetosh. Shkruaj një numër FDI (p.sh. «Më ndihmo ta njoh 14»), më pyet për dallimin ndërmjet dy dhëmbëve ose për një koncept si mezial dhe distal.",
};

const map = (fn: (lang: keyof L) => string): L => ({ it: fn("it"), de: fn("de"), en: fn("en"), sq: fn("sq") });

const LESSON_INTRO: L = {
  it: "Partiamo da una domanda: qual è il punto di riferimento di tutte le direzioni?\n\n",
  de: "Beginnen wir mit einer Frage: Was ist der Bezugspunkt aller Richtungen?\n\n",
  en: "Let's start with a question: what is the reference point for all directions?\n\n",
  sq: "Le të fillojmë me një pyetje: cila është pika e referimit për të gjitha drejtimet?\n\n",
};

const FALLBACK: L = {
  it: "Restiamo sul metodo: dimmi un numero FDI da riconoscere (es. 14), due denti da confrontare (es. 41 e 42) oppure un concetto (mesiale/distale, logica dello specchio).",
  de: "Bleiben wir bei der Methode: Nenne mir eine FDI-Nummer (z. B. 14), zwei Zähne zum Vergleich (z. B. 41 und 42) oder einen Begriff (mesial/distal, Spiegellogik).",
  en: "Let's stick to the method: give me an FDI number to recognise (e.g. 14), two teeth to compare (e.g. 41 and 42) or a concept (mesial/distal, mirror logic).",
  sq: "Le t'i qëndrojmë metodës: më jep një numër FDI për ta njohur (p.sh. 14), dy dhëmbë për t'i krahasuar (p.sh. 41 dhe 42) ose një koncept (mezial/distal, logjika e pasqyrës).",
};

const OK: L = {
  it: "La risposta contiene il dato atteso. Confronta il ragionamento: ",
  de: "Die Antwort enthält die erwartete Angabe. Vergleiche die Herleitung: ",
  en: "Your answer contains the expected information. Compare the reasoning: ",
  sq: "Përgjigjja përmban të dhënën e pritur. Krahaso arsyetimin: ",
};
const NOT_OK: L = {
  it: "Non posso confermare questa risposta. Confrontala con la spiegazione: ",
  de: "Diese Antwort kann ich nicht bestätigen. Vergleiche sie mit der Erklärung: ",
  en: "I can't confirm this answer. Compare it with the explanation: ",
  sq: "Nuk mund ta konfirmoj këtë përgjigje. Krahasoje me shpjegimin: ",
};

const CHIPS: L[] = [
  { it: "Aiutami a riconoscere il 14", de: "Hilf mir, den 14 zu erkennen", en: "Help me recognise 14", sq: "Më ndihmo ta njoh 14" },
  { it: "Differenza tra 41 e 42", de: "Unterschied zwischen 41 und 42", en: "Difference between 41 and 42", sq: "Dallimi ndërmjet 41 dhe 42" },
  { it: "Spiegami mesiale e distale", de: "Erkläre mesial und distal", en: "Explain mesial and distal", sq: "Më shpjego mezial dhe distal" },
  { it: "Logica dello specchio", de: "Spiegellogik", en: "Mirror logic", sq: "Logjika e pasqyrës" },
];

const TXT = {
  subtitle: {
    it: "Un tutor socratico: ti guida passo passo a dedurre arcata, gruppo, cuspidi, radici, lato e numero FDI.",
    de: "Ein sokratischer Tutor: Er führt dich Schritt für Schritt zu Kiefer, Gruppe, Höckern, Wurzeln, Seite und FDI-Nummer.",
    en: "A Socratic tutor: it guides you step by step to work out arch, group, cusps, roots, side and FDI number.",
    sq: "Një tutor sokratik: të udhëheq hap pas hapi të nxjerrësh harkun, grupin, kuspidët, rrënjët, anën dhe numrin FDI.",
  },
  placeholder: { it: "Scrivi la tua risposta o una domanda…", de: "Schreibe deine Antwort oder Frage…", en: "Type your answer or a question…", sq: "Shkruaj përgjigjen ose një pyetje…" },
  aria: { it: "Messaggio per il tutor", de: "Nachricht an den Tutor", en: "Message to the tutor", sq: "Mesazh për tutorin" },
  send: { it: "Invia", de: "Senden", en: "Send", sq: "Dërgo" },
} satisfies Record<string, L>;

const lessonText = (sections: typeof MESIAL_DISTAL_LESSON): L =>
  map((l) => sections.map((x) => `**${x.title[l]}**\n${x.body[l]}${x.tip ? `\n💡 ${x.tip[l]}` : ""}`).join("\n\n"));

export default function TutorPage() {
  const { t, loc } = useI18n();
  const [messages, setMessages] = React.useState<Msg[]>([{ role: "tutor", text: GREETING }]);
  const [session, setSession] = React.useState<Session | null>(null);
  const [input, setInput] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
    inputRef.current?.focus();
  }, [messages]);

  const say = (text: L) => setMessages((m) => [...m, { role: "tutor", text }]);

  const startRecognition = (fdi: string) => {
    const tooth = getTooth(fdi);
    if (!tooth) return false;
    const steps = recognitionSteps(tooth);
    const s = steps[0];
    if (!s) return false;
    setSession({ fdi, step: 0, awaiting: true });
    say({
      it: `Perfetto, lavoriamo sul dente ${fdi}. Procediamo per passi.\n\n${s.title.it} — ${s.question.it}\nProva a rispondere con parole tue.`,
      de: `Gut, arbeiten wir am Zahn ${fdi}. Wir gehen Schritt für Schritt vor.\n\n${s.title.de} — ${s.question.de}\nAntworte mit eigenen Worten.`,
      en: `Great, let's work on tooth ${fdi}. We'll go step by step.\n\n${s.title.en} — ${s.question.en}\nTry to answer in your own words.`,
      sq: `Shumë mirë, le të punojmë me dhëmbin ${fdi}. Do të vazhdojmë hap pas hapi.\n\n${s.title.sq} — ${s.question.sq}\nProvo të përgjigjesh me fjalët e tua.`,
    });
    return true;
  };

  const continueSession = (userText: string) => {
    if (!session) return;
    const tooth = getTooth(session.fdi);
    if (!tooth) return;
    const steps = recognitionSteps(tooth);
    const cur = steps[session.step];
    if (!cur) return;
    const feedback = assessRecognitionAnswer(tooth, session.step, userText) ? OK : NOT_OK;
    const next = steps[session.step + 1];
    if (next) {
      setSession({ ...session, step: session.step + 1 });
      say(map((l) => `${feedback[l]}${cur.answer[l]}\n💡 ${cur.tip[l]}\n\n${next.title[l]} — ${next.question[l]}`));
    } else {
      setSession(null);
      const mirror = mirrorFdi(tooth.fdi);
      const ant = classIAntagonists(tooth.fdi);
      const closing: L = {
        it: `Hai consultato i passaggi sul ${tooth.fdi}; non è una verifica di competenza clinica. Omologo controlaterale: ${mirror}. Antagonisti in occlusione ideale di Classe I: ${ant.join(" e ")}; i contatti reali possono differire. Vuoi provare un altro dente?`,
        de: `Du hast die Schritte zu ${tooth.fdi} durchgesehen; dies ist kein klinischer Kompetenznachweis. Kontralateraler homologer Zahn: ${mirror}. Antagonisten in idealer Klasse-I-Okklusion: ${ant.join(" und ")}; tatsächliche Kontakte können abweichen. Möchtest du einen weiteren Zahn?`,
        en: `You've gone through the steps for ${tooth.fdi}; this is not an assessment of clinical competence. Contralateral homologue: ${mirror}. Antagonists in ideal Class I occlusion: ${ant.join(" and ")}; real contacts may differ. Want to try another tooth?`,
        sq: `I kalove hapat për ${tooth.fdi}; ky nuk është vlerësim i kompetencës klinike. Homologu kontralateral: ${mirror}. Antagonistët në okluzionin ideal të Klasës I: ${ant.join(" dhe ")}; kontaktet reale mund të ndryshojnë. Do të provosh një dhëmb tjetër?`,
      };
      say(map((l) => `${feedback[l]}${cur.answer[l]}\n💡 ${cur.tip[l]}\n\n${closing[l]}`));
    }
  };

  const answer = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    const low = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const fdis = text.match(/\b[1-4][1-8]\b/g) ?? [];

    if (fdis.length >= 2) {
      const a = getTooth(fdis[0] ?? "");
      const b = getTooth(fdis[1] ?? "");
      if (a && b) {
        setSession(null);
        const intro: L = {
          it: `Confrontiamo ${a.fdi} e ${b.fdi}. Prima di leggere, chiediti: stessa arcata? stesso gruppo? quante radici?\n\n`,
          de: `Vergleichen wir ${a.fdi} und ${b.fdi}. Frage dich zuerst: gleicher Kiefer? gleiche Gruppe? wie viele Wurzeln?\n\n`,
          en: `Let's compare ${a.fdi} and ${b.fdi}. Before reading on, ask yourself: same arch? same group? how many roots?\n\n`,
          sq: `Le të krahasojmë ${a.fdi} dhe ${b.fdi}. Para se të lexosh, pyet veten: i njëjti hark? i njëjti grup? sa rrënjë?\n\n`,
        };
        say(map((l) => intro[l] + tellApart(a, b, l).map((c) => `• ${c}`).join("\n")));
        return;
      }
    }

    if (session && (fdis.length === 0 || session.step === 4)) {
      continueSession(text);
      return;
    }

    if (fdis.length === 1 && startRecognition(fdis[0] ?? "")) return;

    if (/mesial|distal|mezial/.test(low)) {
      setSession(null);
      const body = lessonText(MESIAL_DISTAL_LESSON);
      say(map((l) => LESSON_INTRO[l] + body[l]));
      return;
    }

    if (/specchi|spiegel|mirror|pasqyr|antagon|lato|seite|\bside\b/.test(low)) {
      setSession(null);
      say(lessonText(MIRROR_LESSON));
      return;
    }

    say(FALLBACK);
  };

  return (
    <div>
      <SectionTitle title={t("nav.tutor")} subtitle={loc(TXT.subtitle)} />

      <Card className="flex max-h-[62vh] flex-col gap-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" && "justify-end")}>
            {m.role === "tutor" && <GraduationCap className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />}
            <p
              className={cn(
                "max-w-[85%] whitespace-pre-line text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-2xl bg-primary px-4 py-2 text-primary-foreground"
                  : "text-foreground",
              )}
            >
              {m.role === "tutor" ? loc(m.text) : m.text}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </Card>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c.it}
            type="button"
            onClick={() => answer(loc(c))}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            {loc(c)}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          answer(input);
          setInput("");
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={loc(TXT.placeholder)}
          aria-label={loc(TXT.aria)}
          className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-90"
          aria-label={loc(TXT.send)}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
