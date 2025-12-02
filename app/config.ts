import { Level } from "./types";
import { images } from "./images";

export const config = {
  company: {
    name: "Sollich",
    logoUrl: "🍫",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    industryVibe:
      "Wir bauen Maschinen, die Süßes produzieren. In Bad Salzuflen. Mit Verantwortung von Anfang an.",
  },
  landing: {
    headline: "Checken, ob's passt.",
    subline:
      "Probier den Job als Industriemechaniker:in bei Sollich aus – in 3 Minuten.",
    startButtonText: "Mission starten 🚀",
  },
  levels: [
    {
      id: 1,
      title: "Das richtige Werkzeug",
      status: "unlocked" as const,
      icon: "🛠️",
      type: "validation" as const,
      imageUrl: images[1].uploadUrl, // Materialauswahl
      content: {
        scenario:
          "Auf der Werkbank liegen viele verschiedene Feilen: grobe, feine, runde und flache 🛠️. Du musst eine runde Ecke in das Metall formen. Welche nimmst du? 🧐",
        options: [
          {
            id: 1,
            text: "Die Rundfeile",
            correct: true,
            feedback:
              "Genau richtig! Die Rundfeile ist perfekt für runde Ecken. Du denkst schon wie ein Profi! 🔧",
          },
          {
            id: 2,
            text: "Die flache Feile",
            correct: false,
            feedback:
              "Die flache Feile ist gut für gerade Flächen, aber für runde Ecken brauchst du eine Rundfeile. Probier's nochmal! 💪",
          },
          {
            id: 3,
            text: "Die Säge",
            correct: false,
            feedback:
              "Die Säge ist zum Abtrennen, nicht zum Formen. Für runde Ecken brauchst du eine Feile! 🪚",
          },
          {
            id: 4,
            text: "Den Hammer",
            correct: false,
            feedback:
              "Mit dem Hammer würdest du das Metall nur verformen. Für präzise Arbeit brauchst du die richtige Feile! 🔨",
          },
        ],
      },
    },
    {
      id: 2,
      title: "Material prüfen",
      status: "locked" as const,
      icon: "📏",
      type: "validation" as const,
      imageUrl: images[2].uploadUrl, // Messen / Präzision
      content: {
        scenario:
          "Du hast das Material ausgewählt. Bevor du loslegst, solltest du es mit der Schieblehre prüfen. Dein Ausbilder sagt: 'Immer erst messen, dann arbeiten.' Warum ist das wichtig? 📐",
        options: [
          {
            id: 1,
            text: "Damit ich weiß, ob das Material die richtige Größe hat",
            correct: true,
            feedback:
              "Perfekt! Genau so arbeitet man professionell. Erst prüfen, dann fertigen. 🎯",
          },
          {
            id: 2,
            text: "Weil der Ausbilder es so will",
            correct: false,
            feedback:
              "Es gibt einen guten Grund: Falsche Maße führen zu Ausschuss. Denk immer mit! 💭",
          },
          {
            id: 3,
            text: "Das ist eigentlich nicht so wichtig",
            correct: false,
            feedback:
              "Doch, ist es! Präzision ist das A und O in der Industrie. Jeder Fehler kostet Zeit und Geld. ⚠️",
          },
        ],
      },
    },
    {
      id: 3,
      title: "Nach Zeichnung arbeiten",
      status: "locked" as const,
      icon: "📋",
      type: "validation" as const,
      imageUrl: images[7].uploadUrl, // Bauplan / Analyse
      content: {
        scenario:
          "Du hast die Zeichnung vor dir. Dein Werkstück soll genau nach Plan entstehen. Wie gehst du vor? 📐",
        options: [
          {
            id: 1,
            text: "Ich schaue mir die Zeichnung genau an, markiere wichtige Maße und arbeite Schritt für Schritt",
            correct: true,
            feedback:
              "Exzellent! Systematisches Arbeiten nach Zeichnung ist genau das, was wir bei Sollich brauchen. 🎯",
          },
          {
            id: 2,
            text: "Ich fange einfach an und schaue, was passiert",
            correct: false,
            feedback:
              "Ohne Plan entsteht nur Schrott. Die Zeichnung ist dein Fahrplan – nutze sie! 📊",
          },
          {
            id: 3,
            text: "Ich frage erstmal, ob jemand anders das machen kann",
            correct: false,
            feedback:
              "Bei Sollich übertragen wir dir von Anfang an Verantwortung. Trau dich, du schaffst das! ✨",
          },
        ],
      },
    },
    {
      id: 4,
      title: "Qualitätskontrolle",
      status: "locked" as const,
      icon: "✅",
      type: "validation" as const,
      imageUrl: images[4].uploadUrl, // Fehler / Kratzer
      content: {
        scenario:
          "Dein Werkstück ist fertig. Jetzt kommt die Qualitätskontrolle mit der Messschraube. Du findest eine minimale Abweichung von 0,1mm. Was machst du? 🔍",
        options: [
          {
            id: 1,
            text: "Passt schon, 0,1mm fällt niemandem auf",
            correct: false,
            feedback:
              "Bei Sollich zählt jedes Zehntelmillimeter. Präzision ist unser Markenzeichen. 📏",
          },
          {
            id: 2,
            text: "Ich messe nochmal genau nach und korrigiere falls nötig",
            correct: true,
            feedback:
              "Genau richtig! Dieser Blick fürs Detail und die Bereitschaft, es richtig zu machen, suchen wir. 🎯",
          },
          {
            id: 3,
            text: "Ich hoffe, dass es keiner merkt",
            correct: false,
            feedback:
              "Bei uns geht Qualität vor Geschwindigkeit. Ehrlichkeit und Präzision zählen. 💎",
          },
        ],
      },
    },
    {
      id: 5,
      title: "Teamfit checken",
      status: "locked" as const,
      icon: "🏁",
      type: "reflection" as const,
      imageUrl: images[6].uploadUrl, // Teamwork / Montage
      content: {
        scenario:
          "Du hast alle Aufgaben gemeistert! Zeit für den wichtigsten Check: Passt die Ausbildung bei Sollich zu dir? Wir starten entspannt um 9:00 Uhr, unterstützen dich beim Führerschein und geben dir von Anfang an Verantwortung. 🌅",
        options: [
          {
            id: 1,
            text: "Ja, das klingt genau nach mir!",
            feedback: "Perfekt! Lass uns quatschen. 🚀",
          },
          {
            id: 2,
            text: "Klingt gut, aber ich bin noch unsicher",
            feedback: "Kein Problem! Wir beantworten alle deine Fragen. 💬",
          },
          {
            id: 3,
            text: "Auf jeden Fall! Wo kann ich mich bewerben?",
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
    jobMerken: "Job merken",
    submit: "Teamfit checken",
    submitSuccess: "Alles klar! Wir melden uns in max. 24h bei dir.",
    victoryHeadline: "Sauber gelöst. 🍫",
    victorySubtext:
      "Du hast technisches Verständnis bewiesen. Genau diese Präzision suchen wir bei Sollich.",
    nudgeHeadline: "Mal ehrlich...",
    nudgeText:
      "Du stellst dich hier besser an als viele andere. Wir sollten uns mal unverbindlich unterhalten. Kein Stress, kein Anzug. Bei uns startest du entspannt um 9:00 Uhr und bekommst von Anfang an Verantwortung. ✨",
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
