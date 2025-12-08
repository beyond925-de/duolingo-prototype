import { Job } from "./types";

import * as mechanikerImages from "./sollich-images.json";
import * as zeichnerImages from "./sollich-images-zeichner.json";

/**
 * Level Type Examples:
 *
 * 1. single-select-correct: Single select with correct answer
 *    - Options have correct: true/false
 *    - Shows correct/wrong feedback
 *    - User must select correct answer to proceed
 *
 * 2. single-select-no-correct: Single select with no right answer
 *    - Options don't need correct property
 *    - Shows feedback for any selection
 *    - User can select any option to proceed
 *
 * 3. multiple-select: Multiple select
 *    - Options have correct: true/false
 *    - User can select multiple options
 *    - All correct options must be selected (and no incorrect ones)
 *
 * 4. text-field: Custom answer text field
 *    - No options needed (or empty array)
 *    - User enters free text
 *    - allowTextInput is automatically true
 *
 * 5. single-select-or-text: Single select or custom text input
 *    - Options available for selection
 *    - OR user can enter custom text
 *    - allowTextInput should be true
 */

export const config = {
  company: {
    name: "Sollich",
    logoUrl: "🍫", // Oder URL zum Logo-Asset
    primaryColor: "#c8102e", // Sollich Red (aus Screenshot)
    secondaryColor: "#10b981", // Success Green
    city: "Bad Salzuflen",
    website: "https://sollich.com",
    industryVibe:
      "Wir bauen die Maschinen, die die Welt mit Schokolade versorgen. High-Tech aus Bad Salzuflen.",
    organizationFacts: [
      {
        title: "Führerschein-Support",
        value:
          "Wir lassen dich nicht stehen. Wir unterstützen dich finanziell bei deinem Führerschein.",
        icon: "🚗",
      },
      {
        title: "Ausschlafen inklusive",
        value:
          "Morgenmuffel? Kein Thema. Bei uns geht's entspannt um 9:00 Uhr los.",
        icon: "⏰",
      },
      {
        title: "Echte Missionen",
        value:
          "Kaffee kochen tun andere. Du kriegst bei uns ab Tag 1 echte Verantwortung.",
        icon: "🔥",
      },
    ],
  },

  landing: {
    headline: "Deine Zukunft schmeckt süß. 🍫",
    subline:
      "Sollich baut Maschinen für die Süßwarenindustrie. Finde heraus, ob du ins Team passt – in 3 Minuten.",
    startButtonText: "1. Tag bestreiten 🚀",
  },

  campus: {
    headline: "Dein Talent. Dein Job.",
    subline: "Bist du eher der Macher an der Maschine oder der Planer am PC?",
    categories: [
      {
        id: "technik",
        title: "Für Macher (Handwerk)",
        jobId: "mechaniker",
      },
      {
        id: "planung",
        title: "Für Planer (Digital)",
        jobId: "zeichner",
      },
    ],
  },
  jobs: [
    // Choose the visual layout via pathModeId (see app/pathModes.ts for presets)
    {
      id: "technischer-produktdesigner",
      title: "Technische:r Produktdesigner:in",
      description: "Designe die Schoko-Fabriken der Zukunft am PC! 🖥️🍫",
      icon: "📐",
      color: "#8b5cf6",
      tags: ["🖥️ Digital & 3D", "🧠 Logik-Profi", "🍫 High-Tech"],
      pathModeId: "branching",
      levels: [
        {
          id: 1,
          title: "Startblock",
          status: "unlocked",
          icon: "👀",
          row: 0,
          nextLevelIds: [2, 3], // BRANCHING: User chooses a mission
          scenarios: [
            {
              id: 1,
              scenario:
                "Hi! 👋 Als Produktdesigner:in bist du das Bindeglied zwischen Idee und Maschine. Ein Ingenieur gibt dir eine Skizze für einen neuen Keks-Greifer. Was ist dein erster Job?",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGsI4iyqZSOa5oGfeQw0igHmDClury4RAtNT1b",
              type: "single-select-correct",
              options: [
                {
                  id: 1,
                  text: "Ich baue das Teil sofort in der Werkstatt zusammen 🔨",
                  correct: false,
                  feedback:
                    "Nicht ganz! Du arbeitest digital. Erst muss das Modell am Computer stehen. 💻",
                },
                {
                  id: 2,
                  text: "Ich erstelle ein 3D-Modell am CAD-Computer 🖥️",
                  correct: true,
                  feedback:
                    "Volltreffer! 🎯 Du konstruierst das Bauteil virtuell, bevor es gebaut wird.",
                },
              ],
            },
            {
              id: 2,
              scenario:
                "Damit das Teil später auch passt, brauchst du ein super räumliches Vorstellungsvermögen. Stell dir einen Würfel vor. Wir schneiden eine Ecke gerade ab. Wie sieht die Schnittfläche aus?",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGrQ3UmIoLx1pZiT3K4VDNbFJalWARdm6foQGr",
              type: "single-select-correct",
              options: [
                {
                  id: 1,
                  text: "Quadratisch ▪️",
                  correct: false,
                  feedback:
                    "Knapp daneben! Denk an die drei Seiten, die an der Ecke zusammentreffen.",
                },
                {
                  id: 2,
                  text: "Dreieckig 🔺",
                  correct: true,
                  feedback:
                    "Stark! 🧠 Genau diesen 'Röntgenblick' brauchst du, wenn du komplexe Anlagen planst.",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Mission: Konstruktion",
          status: "locked",
          icon: "🖱️",
          row: 1, // Branch Option A
          nextLevelIds: [4], // Merges to Level 4
          scenarios: [
            {
              id: 1,
              scenario:
                "Du arbeitest an einer neuen Pralinen-Anlage. 🍬 Plötzlich siehst du im 3D-Modell ein Problem: Der Motor für das Förderband ist zu groß und ragt in den Tunnel, wo die Pralinen langfahren. Das nennt man 'Kollision'. Du musst das lösen, bevor die Teile gefertigt werden! Sprich mit dem Projektleiter.",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGm3Oq6HMFodsMg0pf6abPAN8Q57e1OcDqvuwL",
              type: "llm-interactive",
              options: [],
              conversationHistory: [
                {
                  role: "assistant",
                  content:
                    "Mist, gut, dass du das gesehen hast! Wenn wir das so bauen, gibt es Pralinen-Matsch. 🍫 Was schlägst du vor? Sollen wir einen kleineren, schwächeren Motor suchen oder den Tunnel breiter konstruieren?",
                },
              ],
            },
          ],
        },
        {
          id: 3,
          title: "Mission: Werkstatt-Call",
          status: "locked",
          icon: "📞",
          row: 1, // Branch Option B
          nextLevelIds: [4], // Merges to Level 4
          scenarios: [
            {
              id: 1,
              scenario:
                "Alarm! 🚨 Dein Telefon klingelt. Ein Industriemechaniker aus der Halle ist dran. Er will gerade die Welle für die Keks-Maschine drehen, aber auf deiner Zeichnung fehlt ein wichtiges Maß. Die Maschine steht still. Du musst reagieren – schnell und präzise.",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGl4XVzAEhsMuDVbkoejf1IAxSiQ96ZycP2nBL",
              type: "llm-interactive",
              options: [],
              conversationHistory: [
                {
                  role: "assistant",
                  content:
                    "Hier ist Alex aus der Fertigung. Sag mal, ich steh hier an der Drehbank. Auf Zeichnung 204 fehlt der Durchmesser für den Lagerzapfen. Soll ich das schätzen oder kannst du das im 3D-Modell nachmessen? Wir haben Zeitdruck!",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          title: "Der SOLLICH-Check",
          status: "locked",
          icon: "✅",
          row: 2, // Merged Level
          nextLevelIds: [5, 6], // Splitting again
          scenarios: [
            {
              id: 1,
              scenario:
                "Puh, Problem gelöst! 😅 Als Produktdesigner:in arbeitest du viel mit dem Kopf. Damit du fit bleibst, schauen wir, was SOLLICH dir bietet:",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGpqoCmdz97Aj1hznsJlaW5tFZHNPDuCodmTU2",
              type: "bento-grid",
              options: [],
              facts: [
                {
                  title: "Arbeitsplatz",
                  value: "High-End CAD-Rechner & moderne Büros.",
                  icon: "🖥️",
                  layout: { colSpan: 2, rowSpan: 1 },
                },
                {
                  title: "Arbeitszeit",
                  value: "35h-Woche & Gleitzeit.",
                  icon: "⏰",
                  layout: { colSpan: 1, rowSpan: 1 },
                },
                {
                  title: "No Overtime",
                  value: "Keine Überstunden für Azubis!",
                  icon: "🧘",
                  layout: { colSpan: 1, rowSpan: 1 },
                },
              ],
            },
            {
              id: 2,
              scenario:
                "Neben der Technik ist uns das Miteinander wichtig. Was denkst du, wie läuft es hier?",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGpqoCmdz97Aj1hznsJlaW5tFZHNPDuCodmTU2",
              type: "single-select-no-correct",
              options: [
                {
                  id: 1,
                  text: "Jeder kämpft für sich allein 🐺",
                  feedback:
                    "Zum Glück nicht! Wir arbeiten als ein großes Team zusammen.",
                },
                {
                  id: 2,
                  text: "Familiär und unterstützend 🤝",
                  feedback:
                    "Genau so ist es. Wir sind per Du und helfen uns gegenseitig.",
                },
              ],
            },
          ],
        },
        {
          id: 5,
          title: "Weg: Weiterbildung",
          status: "locked",
          icon: "📈",
          row: 3, // Branch Option A
          nextLevelIds: [7], // Merges to Final
          scenarios: [
            {
              id: 1,
              scenario:
                "Nach den 3,5 Jahren Ausbildung (oder 3, wenn du gut bist!) stehen dir alle Türen offen. Welcher dieser Titel klingt spannender für dich?",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGfkCcPxmOlGwh2tk47Nmb0FcsyoQ9DzXpJLdu",
              type: "single-select-no-correct",
              options: [
                {
                  id: 1,
                  text: "Staatlich geprüfte:r Techniker:in 🎓",
                  feedback:
                    "Sehr beliebt! Damit übernimmst du komplexere Projekte und Verantwortung.",
                },
                {
                  id: 2,
                  text: "Fachwirt:in (IHK) 💼",
                  feedback:
                    "Gute Wahl, wenn du auch kaufmännische Aufgaben spannend findest.",
                },
              ],
            },
          ],
        },
        {
          id: 6,
          title: "Weg: Studium",
          status: "locked",
          icon: "🎓",
          row: 3, // Branch Option B
          nextLevelIds: [7], // Merges to Final
          scenarios: [
            {
              id: 1,
              scenario:
                "Du willst noch tiefer in die Theorie? Bei uns kannst du das 'Kooperative Studium' machen. Ausbildung + Bachelor (z.B. Maschinenbau) parallel. 📚",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxG8fM8EUKpVATEMkn9gidZwvPHcrDbsyI0F1XB",
              type: "single-select-no-correct",
              options: [
                {
                  id: 1,
                  text: "Das klingt hart, aber lohnt sich! 💪",
                  feedback:
                    "Stimmt! Es ist fordernd, aber du hast Theorie & Praxis und verdienst schon Geld.",
                },
                {
                  id: 2,
                  text: "Lieber erst Ausbildung, dann mal sehen. 👀",
                  feedback:
                    "Auch ein super Weg. Viele entscheiden sich erst später für ein Studium.",
                },
              ],
            },
          ],
        },
        {
          id: 7,
          title: "Dein Start",
          status: "locked",
          icon: "🚀",
          row: 4, // Final Merge
          scenarios: [
            {
              id: 1,
              scenario:
                "Bist du bereit, die Schoko-Welt digital zu gestalten? Uwe Heiland, unser Ausbildungsleiter für Produktdesigner, freut sich auf dich! 😎",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGolmmMys8YWEkrBcDVnqv7lxtwb9CGjsIUPNK",
              type: "single-select-or-text",
              allowTextInput: true,
              options: [
                {
                  id: 1,
                  text: "Ich bin dabei! Bewerbung geht raus. 📧",
                  feedback:
                    "Klasse! Einfach PDF an bewerbung@sollich.com. Wir sind gespannt!",
                },
                {
                  id: 2,
                  text: "Ich möchte erst ein Praktikum machen. 🔍",
                  feedback:
                    "Sehr gute Idee! So lernst du das Team und die Aufgaben live kennen. Meld dich einfach!",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "industriemechaniker",
      title: "Industriemechaniker:in",
      description: "Schrauben, Tüfteln, High-Tech – Deine Mission! 🔧🍫",
      icon: "⚙️",
      color: "#3b82f6",
      tags: ["🍫 Schoko-Tech", "🔧 Hands-on", "🌍 Weltmarktführer"],
      pathModeId: "branching",
      levels: [
        {
          id: 1,
          title: "Startblock",
          status: "unlocked",
          icon: "🏁",
          row: 0,
          nextLevelIds: [2, 3], // BRANCHING into Level 2 or 3
          scenarios: [
            {
              id: 1,
              scenario:
                "Willkommen im Team! Wir bauen die Maschinen, die weltweit Schokoriegel und Kekse produzieren. 🌍 Hast du schon mal an etwas herumgeschraubt?",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGl4XVzAEhsMuDVbkoejf1IAxSiQ96ZycP2nBL",
              type: "single-select-no-correct",
              options: [
                {
                  id: 1,
                  text: "Na klar! Am Fahrrad, Moped oder PC. 🚲",
                  feedback:
                    "Perfekt! Genau dieses technische Verständnis brauchst du hier.",
                },
                {
                  id: 2,
                  text: "Weniger, aber ich will lernen, wie Technik funktioniert. 🧐",
                  feedback:
                    "Gute Einstellung! Wir bringen dir alles von der Pike auf bei.",
                },
              ],
            },
            {
              id: 2,
              scenario:
                "Bevor es in die Halle geht: Sicherheit ist Nr. 1. Du siehst eine ölverschmierte Stelle am Boden neben einer Fräsmaschine. Was machst du? (Wähle alle sinnvollen Optionen)",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGqQestfJmJFi6t8Hsn0RVKzcG9xNIuw2rOjXC",
              type: "multiple-select",
              options: [
                {
                  id: 1,
                  text: "Sofort sauber machen oder abstreuen 🧹",
                  correct: true,
                  feedback:
                    "Richtig. Rutschgefahr ist in der Werkstatt extrem gefährlich.",
                },
                {
                  id: 2,
                  text: "Dem Kollegen Bescheid sagen, damit keiner ausrutscht 🗣️",
                  correct: true,
                  feedback:
                    "Kommunikation ist alles! Wir arbeiten hier als ein großes Team.",
                },
                {
                  id: 3,
                  text: "Drübersteigen, ist ja nicht mein Öl 🤷",
                  correct: false,
                  feedback:
                    "No way! Bei SOLLICH achten wir aufeinander. Jeder übernimmt Verantwortung.",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Mission: Montage",
          status: "locked",
          icon: "🏗️",
          row: 1, // Branch Option A
          nextLevelIds: [4], // Merges back to Level 4
          scenarios: [
            {
              id: 1,
              scenario:
                "Du bist in der Montage. 🏗️ Wir bauen eine riesige 'Conbar'-Anlage für einen Kunden in den USA. Du sollst eine Seitenwand montieren, aber die Bohrlöcher sitzen 2mm zu weit links. Das Blech passt nicht. Der Meister ist gerade im Meeting. Du musst das lösen. Beschreibe mir, wie du vorgehst oder was du prüfst! 🛠️",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGm3Oq6HMFodsMg0pf6abPAN8Q57e1OcDqvuwL",
              type: "llm-interactive",
              options: [],
              conversationHistory: [
                {
                  role: "assistant",
                  content:
                    "Mist, das Blech klemmt. Einfach neue Löcher bohren könnte das Bauteil ruinieren. Hast du eine Idee, was wir zuerst messen oder prüfen sollten?",
                },
              ],
            },
          ],
        },
        {
          id: 3,
          title: "Mission: Wartung",
          status: "locked",
          icon: "🩺",
          row: 1, // Branch Option B (Parallel to Level 2)
          nextLevelIds: [4], // Merges back to Level 4
          scenarios: [
            {
              id: 1,
              scenario:
                "Du begleitest einen Techniker zur Wartung. Eine Überziehmaschine macht seltsame 'Klacker'-Geräusche im Antrieb. 🔊 Es klingt metallisch und rhythmisch. Wenn die Anlage ausfällt, steht die Schoko-Produktion still. Du darfst den Fehler suchen. Was schaust du dir an? 🕵️‍♂️",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGI58z2JNe8YP9rULlHW6twAGpNyO5KuodC1R0",
              type: "llm-interactive",
              options: [],
              conversationHistory: [
                {
                  role: "assistant",
                  content:
                    "Okay, hör mal genau hin. Das Klackern kommt aus der Nähe des Hauptmotors. Sollen wir den Riemen prüfen oder eher das Lager? Was meinst du?",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          title: "Der SOLLICH-Deal",
          status: "locked",
          icon: "🤝",
          row: 2, // Merged Level
          nextLevelIds: [5, 6], // Splitting again for development paths
          scenarios: [
            {
              id: 1,
              scenario:
                "Gute Arbeit vorhin! 💪 Nach der Arbeit ist vor der Arbeit. Wie sieht dein Feierabend aus? Hier sind die Hard Facts:",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGJ18MJJmlpvPZCiHSaRuT75GFr4y1bM2gnDLX",
              type: "bento-grid",
              options: [],
              facts: [
                {
                  title: "35 Stunden",
                  value: "Vollzeit heißt bei uns 35h/Woche & Gleitzeit.",
                  icon: "⏰",
                  layout: { colSpan: 1, rowSpan: 1 },
                },
                {
                  title: "Null Überstunden",
                  value: "Azubis machen keine Überstunden. Punkt.",
                  icon: "🚫",
                  layout: { colSpan: 1, rowSpan: 1 },
                },
                {
                  title: "Kohle & Extras",
                  value: "Metall-Tarif NRW, Fahrtgeld & Urlaubsprämie.",
                  icon: "💸",
                  layout: { colSpan: 2, rowSpan: 1 },
                },
              ],
            },
            {
              id: 2,
              scenario:
                "Klingt fair, oder? Was wäre dir bei einem Arbeitgeber am wichtigsten?",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGpqoCmdz97Aj1hznsJlaW5tFZHNPDuCodmTU2",
              type: "single-select-no-correct",
              options: [
                {
                  id: 1,
                  text: "Dass ich pünktlich rauskomme und Freizeit habe 🕒",
                  feedback: "Das klappt hier definitiv. 35h-Woche regelt!",
                },
                {
                  id: 2,
                  text: "Dass das Geld stimmt 💰",
                  feedback:
                    "Mit dem Metall-Tarif NRW bist du da sehr gut aufgestellt.",
                },
                {
                  id: 3,
                  text: "Ein cooles Team, das zusammenhält 🤜🤛",
                  feedback:
                    "Wir sind über 450 Leute, aber arbeiten wie eine große Familie.",
                },
              ],
            },
          ],
        },
        {
          id: 5,
          title: "Weg: Praktiker",
          status: "locked",
          icon: "🎓",
          row: 3, // Branch Option A (Development)
          nextLevelIds: [7], // Merges to Final
          scenarios: [
            {
              id: 1,
              scenario:
                "Du willst nach der Ausbildung richtig anpacken und aufsteigen? 🚀 Bei SOLLICH ist nach dem Gesellenbrief nicht Schluss. Welcher Titel klingt für dich mächtiger?",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGfkCcPxmOlGwh2tk47Nmb0FcsyoQ9DzXpJLdu",
              type: "single-select-no-correct",
              options: [
                {
                  id: 1,
                  text: "Industriemeister:in – Der Chef in der Halle 🏭",
                  feedback:
                    "Klassischer Weg! Du übernimmst Führung und Verantwortung.",
                },
                {
                  id: 2,
                  text: "Techniker:in – Der Problemlöser mit Tiefgang 🧠",
                  feedback:
                    "Sehr gut. Damit tauchst du noch tiefer in die Technik ein.",
                },
              ],
            },
          ],
        },
        {
          id: 6,
          title: "Weg: Student",
          status: "locked",
          icon: "📚",
          row: 3, // Branch Option B (Development)
          nextLevelIds: [7], // Merges to Final
          scenarios: [
            {
              id: 1,
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxG8fM8EUKpVATEMkn9gidZwvPHcrDbsyI0F1XB",
              type: "text-field",
              allowTextInput: true,
              options: [],
              scenario:
                "Was reizt dich an einem Studium in Kombination mit Arbeit? (Tipp einfach kurz deine Gedanken ein)",
            },
          ],
        },
        {
          id: 7,
          title: "Dein Start",
          status: "locked",
          icon: "🚀",
          row: 4, // Final Merge
          scenarios: [
            {
              id: 1,
              scenario:
                "Ob Meister oder Studium – der erste Schritt ist die Ausbildung zum Industriemechaniker:in. Interesse geweckt? 😎",
              imageUrl:
                "https://f2ixrbf6u3.ufs.sh/f/YXvu0UBUfbxGsI4iyqZSOa5oGfeQw0igHmDClury4RAtNT1b",
              type: "single-select-or-text",
              allowTextInput: true,
              options: [
                {
                  id: 1,
                  text: "Auf jeden Fall! Wo bewerbe ich mich? 📝",
                  feedback:
                    "Klasse! Schick deine Unterlagen (PDF) an bewerbung@sollich.com. Dominik Höke ist dein Ansprechpartner.",
                },
                {
                  id: 2,
                  text: "Ich will erst mal schnuppern (Praktikum). 👀",
                  feedback:
                    "Sehr gerne! Ein Schülerpraktikum ist der beste Weg, uns kennenzulernen. Melde dich einfach!",
                },
              ],
            },
          ],
        },
      ],
    },
    /*
    {
      id: "karriere-map",
      title: "Alle Ausbildungswege",
      description:
        "Erkunde alle Pfade gleichzeitig – zoomen, pannen und vergleichen.",
      icon: "🗺️",
      color: "#f97316",
      tags: ["🌍 Explorer", "🧭 Überblick"],
      pathModeId: "global-map",
      levels: [],
    },
    */
  ] as Job[],
  copy: {
    // Low-Threshold Conversion Wording (Company-specific)
    checkChances: "Meine Chancen checken",
    expressApply: "Lass uns quatschen",
    jobMerken: "Job merken",

    submit: "Teamfit prüfen",
    submitSuccess: "Top! Wir schauen uns das an und melden uns in max. 24h.",

    // Victory Screen (Psychologische Brücke) - Company-specific
    victoryHeadline: "Sauber gelöst. 🍫",
    victorySubtext:
      "Du hast technisches Verständnis bewiesen. Genau diese Präzision suchen wir bei Sollich.",

    // The Nudge (Integrierte Benefits) - Company-specific
    nudgeHeadline: "Mal ehrlich...",
    nudgeText:
      "Du stellst dich hier besser an als viele andere. Wir sollten uns kennenlernen. Ganz ohne Stress und Anzug. ✨",

    // Form Labels (Company-specific)
    firstName: "Wie heißt du?",
    phoneType: "Welches Handy nutzt du? (Egal, nur Neugier)",
    schoolType: "Auf welcher Schule bist du?",
    android: "Android Team",
    iphone: "iPhone Team",
    realschule: "Realschule",
    gymnasium: "Gymnasium",
    andere: "Andere / Ich hab schon Abschluss",

    // Express Apply Form (Company-specific)
    expressApplyIntro: "Ein paar kurze Infos genügen. Wir melden uns bei dir!",
    exploreOtherJobs: "Erstmal andere Jobs entdecken",
  },
};
