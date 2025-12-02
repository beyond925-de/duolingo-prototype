import { Level } from "./types";
import { images } from "./images";

export const config = {
  company: {
    name: "TechSteel GmbH",
    logoUrl: "🔧",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    industryVibe:
      "Hier zählt, was du mit den Händen kannst. Wir bauen die Maschinen von morgen.",
  },
  landing: {
    headline: "Checken, ob's passt.",
    subline: "Probier den Job als Industriemechaniker:in aus – in 3 Minuten.",
    startButtonText: "Mission starten 🚀",
  },
  levels: [
    {
      id: 1,
      title: "Der Notfall",
      status: "unlocked" as const,
      icon: "🚨",
      type: "validation" as const,
      imageUrl: images[9].uploadUrl,
      content: {
        scenario:
          "Du stehst in der großen Montagehalle bei SOLLICH und baust an einer neuen Anlage für Schokoriegel 🍫. Ein schweres Bauteil will sich einfach nicht in den Rahmen schieben lassen, obwohl es laut Plan passen müsste. 🔧 Ein falscher Handgriff könnte das teure Material beschädigen. Was machst du?",
        options: [
          {
            id: 1,
            text: "Bedienungsanleitung suchen?",
            correct: true,
            feedback:
              "Stark. In der Industrie geht Sicherheit immer vor Produktion. Alles richtig gemacht.",
          },
          {
            id: 2,
            text: "Kollegen fragen?",
            correct: true,
            feedback: "Super! Teamwork ist wichtig im Betrieb.",
          },
          {
            id: 3,
            text: "Mit Gewalt probieren?",
            correct: false,
            feedback: "Vorsicht! Das könnte Material beschädigen.",
          },
        ],
      },
    },
    {
      id: 2,
      title: "Deine Gedanken",
      status: "locked" as const,
      icon: "💭",
      type: "reflection" as const,
      imageUrl: images[2].uploadUrl,
      content: {
        scenario:
          "Du hast gerade dein erstes Bauteil perfekt gefertigt. Dein Ausbilder nickt anerkennend. Wie fühlst du dich dabei?",
        options: [
          {
            id: 1,
            text: "Stolz, dass ich es geschafft habe",
            feedback: "Nice! Genau dieses Gefühl treibt uns an. 🚀",
          },
          {
            id: 2,
            text: "Erleichtert, dass nichts schiefging",
            feedback: "Total verständlich! Mit der Zeit kommt die Routine. 💪",
          },
          {
            id: 3,
            text: "Motiviert für das nächste Teil",
            feedback: "Das ist die Einstellung! Let's go! 🔥",
          },
        ],
        allowTextInput: true,
      },
    },
    {
      id: 3,
      title: "Der Adlerauge-Test",
      status: "locked" as const,
      icon: "👁️",
      type: "validation" as const,
      imageUrl: images[4].uploadUrl,
      content: {
        scenario:
          "Endkontrolle. Ein Bauteil hat einen winzigen Kratzer, funktioniert aber technisch noch. Der Kunde wartet dringend.",
        options: [
          {
            id: 1,
            text: "Passt schon. Fällt niemandem auf.",
            correct: false,
            feedback:
              "Das ist der Unterschied zwischen Basteln und Industrie: Wir liefern nur 100%.",
          },
          {
            id: 2,
            text: "Aussortieren. Qualität ist unser Markenzeichen.",
            correct: true,
            feedback:
              "Exzellent. Genau diesen Blick fürs Detail suchen wir hier.",
          },
          {
            id: 3,
            text: "Ich poliere es schnell über und schicke es raus.",
            correct: false,
            feedback:
              "Gut gemeint, aber bei TechSteel vertuschen wir nichts. Ehrlich währt am längsten.",
          },
        ],
      },
    },
    {
      id: 4,
      title: "Teamfit checken",
      status: "locked" as const,
      icon: "🏁",
      type: "reflection" as const,
      imageUrl: images[6].uploadUrl,
      content: {
        scenario:
          "Du hast alle Aufgaben gemeistert! Zeit für den wichtigsten Check: Passt die Ausbildung zu dir und passt du zu uns?",
        options: [
          {
            id: 1,
            text: "Ja, ich will mehr erfahren!",
            feedback: "Perfekt! Lass uns quatschen. 🚀",
          },
          {
            id: 2,
            text: "Klingt spannend, aber ich bin noch unsicher.",
            feedback: "Kein Problem! Wir beantworten alle deine Fragen. 💬",
          },
          {
            id: 3,
            text: "Auf jeden Fall! Wo melde ich mich?",
            feedback: "Nice! Genau die richtige Einstellung. Let's go! 🔥",
          },
        ],
        allowTextInput: false,
      },
    },
  ] as Level[],
  copy: {
    continueButton: "Weiter",
    nextLevel: "Nächstes Level",
    menu: "Menü",
    checkChances: "Meine Chancen checken",
    expressApply: "Lass uns quatschen",
    jobMerken: "Job merken (Später)",
    submit: "Kostenlos Rückruf anfordern",
    submitSuccess: "Alles klar! Wir melden uns in max. 24h bei dir.",
    victoryHeadline: "Sauber gelöst. 🔧",
    victorySubtext:
      "Du hast technisches Verständnis bewiesen. Genau diese Präzision suchen wir.",
    nudgeHeadline: "Mal ehrlich...",
    nudgeText:
      "Du stellst dich hier besser an als viele andere. Wir sollten uns mal unverbindlich unterhalten. Kein Stress, kein Anzug.",
    firstName: "Wie heißt du?",
    phoneType: "Welches Handy nutzt du? (Egal, nur Neugier)",
    schoolType: "Auf welcher Schule bist du?",
    android: "Android Team",
    iphone: "iPhone Team",
    realschule: "Realschule",
    gymnasium: "Gymnasium",
    andere: "Andere / Ich hab schon Abschluss",
    settings: {
      title: "Einstellungen",
      showStartScreen: "Intro nochmal zeigen",
      vibration: "Haptisches Feedback",
      sound: "Soundeffekte",
      animation: "Animationen",
    },
  },
};

