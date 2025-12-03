import { images } from "./images";
import { Job } from "./types";

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
    {
      id: "industriemechaniker",
      title: "Industriemechaniker:in",
      description: "Maschinen bauen, reparieren und optimieren",
      icon: "🛠️",
      color: "#3b82f6",
      levels: [
        {
          id: 1,
          title: "Ausbildungsstart",
          status: "unlocked" as const,
          icon: "🛠️",
          scenarios: [
            {
              id: 1,
              scenario:
                "Auf der Werkbank liegen viele verschiedene Feilen: grobe, feine, runde und flache 🛠️. Du musst eine runde Ecke in das Metall formen. Welche nimmst du? 🧐",
              imageUrl: images[2].uploadUrl,
              type: "single-select-correct" as const,
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
            {
              id: 2,
              scenario:
                "Du hast das Material ausgewählt. Bevor du loslegst, solltest du es mit der Schieblehre prüfen. Dein Ausbilder sagt: 'Immer erst messen, dann arbeiten.' Warum ist das wichtig? 📐",
              imageUrl: images[3].uploadUrl,
              type: "single-select-correct" as const,
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
            {
              id: 3,
              scenario:
                "Bevor du mit der Arbeit beginnst, musst du die richtige Schutzausrüstung anlegen. Welche der folgenden Sicherheitsmaßnahmen sind wichtig? (Wähle alle zutreffenden) 🛡️",
              imageUrl: images[14].uploadUrl,
              type: "multiple-select" as const,
              options: [
                {
                  id: 1,
                  text: "Schutzbrille tragen",
                  correct: true,
                  feedback:
                    "Richtig! Schutzbrillen schützen deine Augen vor Funken und Spänen. 👓",
                },
                {
                  id: 2,
                  text: "Handschuhe anziehen",
                  correct: true,
                  feedback:
                    "Genau! Handschuhe schützen vor Schnitten und Verbrennungen. 🧤",
                },
                {
                  id: 3,
                  text: "Gehörschutz verwenden",
                  correct: true,
                  feedback:
                    "Korrekt! Lärm kann das Gehör dauerhaft schädigen. 🎧",
                },
                {
                  id: 4,
                  text: "Lange Haare offen tragen",
                  correct: false,
                  feedback:
                    "Falsch! Lange Haare müssen zusammengebunden werden, damit sie nicht in Maschinen geraten. ⚠️",
                },
                {
                  id: 5,
                  text: "Schmuck ablegen",
                  correct: true,
                  feedback:
                    "Richtig! Schmuck kann in Maschinen hängen bleiben und zu Verletzungen führen. 💍",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Fertigung",
          status: "locked" as const,
          icon: "📋",
          scenarios: [
            {
              id: 4,
              scenario:
                "Du hast die Zeichnung vor dir. Dein Werkstück soll genau nach Plan entstehen. Wie gehst du vor? 📐",
              imageUrl: images[8].uploadUrl,
              type: "single-select-correct" as const,
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
            {
              id: 5,
              scenario:
                "Dein Werkstück ist fertig. Jetzt kommt die Qualitätskontrolle mit der Messschraube. Du findest eine minimale Abweichung von 0,1mm. Was machst du? 🔍",
              imageUrl: images[3].uploadUrl,
              type: "single-select-correct" as const,
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
            {
              id: 6,
              scenario:
                "Du hast ein Problem bei der Fertigung: Das Werkstück passt nicht richtig zusammen. Beschreibe kurz, wie du vorgehen würdest, um das Problem zu lösen. 💭",
              imageUrl: images[10].uploadUrl,
              type: "text-field" as const,
              options: [],
              allowTextInput: true,
            },
          ],
        },
        {
          id: 3,
          title: "Teamfit checken",
          status: "locked" as const,
          icon: "🏁",
          scenarios: [
            {
              id: 7,
              scenario:
                "Du hast alle Aufgaben gemeistert! Zeit für den wichtigsten Check: Passt die Ausbildung bei Sollich zu dir? Wir starten entspannt um 9:00 Uhr, unterstützen dich beim Führerschein und geben dir von Anfang an Verantwortung. 🌅",
              imageUrl: images[7].uploadUrl,
              type: "single-select-or-text" as const,
              allowTextInput: true,
              options: [
                {
                  id: 1,
                  text: "Ja, das klingt genau nach mir!",
                  feedback: "Perfekt! Lass uns quatschen. 🚀",
                },
                {
                  id: 2,
                  text: "Klingt gut, aber ich bin noch unsicher",
                  feedback:
                    "Kein Problem! Wir beantworten alle deine Fragen. 💬",
                },
                {
                  id: 3,
                  text: "Auf jeden Fall! Wo kann ich mich bewerben?",
                  feedback:
                    "Nice! Genau die richtige Einstellung. Let's go! 🔥",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "technischer-zeichner",
      title: "Technischer Zeichner:in",
      description: "Vom Blatt Papier zum digitalen 3D-Modell",
      icon: "📐",
      color: "#8b5cf6",
      levels: [
        {
          id: 1,
          title: "Ausbildungsstart",
          status: "unlocked" as const,
          icon: "🖥️",
          scenarios: [
            {
              id: 1,
              scenario:
                "Du sitzt das erste Mal am CAD-Computer 🖥️. Dein Ausbilder legt dir eine Handskizze von einem einfachen Metallwürfel mit einer Bohrung hin. Er fragt dich: 'Wie fängst du am besten an, das hier im 3D-Programm zu bauen?' 🤔",
              imageUrl: images[12].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Erst eine 2D-Skizze zeichnen ✏️",
                  correct: true,
                  feedback:
                    "Genau richtig! Bei Sollich arbeiten wir systematisch: Erst die Skizze, dann das 3D-Modell. Du denkst schon wie ein Profi! 🎯",
                },
                {
                  id: 2,
                  text: "Sofort den 3D-Würfel ziehen 🧊",
                  correct: false,
                  feedback:
                    "Fast! Aber ohne Skizze fehlt dir die Basis. Bei uns lernst du Schritt für Schritt – erst die 2D-Skizze, dann das 3D-Modell. 💪",
                },
                {
                  id: 3,
                  text: "Erst das Material auswählen 🧱",
                  correct: false,
                  feedback:
                    "Das Material kommt später! Erst brauchst du die Form. Bei Sollich lernst du den richtigen Ablauf: Skizze → Modell → Material. 📐",
                },
                {
                  id: 4,
                  text: "Die Farbe aussuchen 🎨",
                  correct: false,
                  feedback:
                    "Die Farbe ist nicht wichtig für die Konstruktion! Bei uns lernst du, was wirklich zählt: Präzision und Funktion. 🎯",
                },
              ],
            },
            {
              id: 2,
              scenario:
                "Du sollst ein einfaches Drehteil nach Skizze modellieren. Die Skizze zeigt einen Zylinder mit einer Nut. Wie gehst du vor? 🔧",
              imageUrl: images[12].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Ich zeichne die 2D-Kontur, rotiere sie um die Achse, dann füge ich die Nut ein",
                  correct: true,
                  feedback:
                    "Perfekt! Genau so arbeitet man professionell im CAD. Bei Sollich lernst du diese Methoden Schritt für Schritt. 🎯",
                },
                {
                  id: 2,
                  text: "Ich ziehe einfach einen Zylinder und hoffe, dass es passt",
                  correct: false,
                  feedback:
                    "Bei Sollich arbeiten wir präzise! Die Skizze ist dein Fahrplan – nutze sie systematisch. 📊",
                },
                {
                  id: 3,
                  text: "Ich frage, ob jemand anders das machen kann",
                  correct: false,
                  feedback:
                    "Bei Sollich übertragen wir dir von Anfang an Verantwortung. Trau dich, du schaffst das! ✨",
                },
              ],
            },
            {
              id: 3,
              scenario:
                "Du brauchst Schrauben und Lager für deine Baugruppe. Wo findest du diese am schnellsten? 🔍",
              imageUrl: images[12].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "In der CAD-Datenbank nach Normteilen suchen",
                  correct: true,
                  feedback:
                    "Genau richtig! Normteile aus der Datenbank sparen Zeit und sind standardisiert. Genau so arbeiten wir bei Sollich. 🎯",
                },
                {
                  id: 2,
                  text: "Ich zeichne sie selbst",
                  correct: false,
                  feedback:
                    "Das wäre viel zu aufwendig! Bei Sollich lernst du, effizient zu arbeiten – Normteile aus der Datenbank nutzen. 💡",
                },
                {
                  id: 3,
                  text: "Ich schaue im Internet",
                  correct: false,
                  feedback:
                    "Die CAD-Datenbank ist der richtige Ort! Bei uns lernst du, die professionellen Tools zu nutzen. 🛠️",
                },
              ],
            },
            {
              id: 5,
              scenario:
                "Du arbeitest an einem neuen Projekt. Wie fühlst du dich dabei? 🎨",
              imageUrl: images[12].uploadUrl,
              type: "single-select-no-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Sehr motiviert und neugierig",
                  feedback:
                    "Das ist genau die richtige Einstellung! Neugierde treibt Innovation voran. 🚀",
                },
                {
                  id: 2,
                  text: "Etwas unsicher, aber bereit zu lernen",
                  feedback:
                    "Unsicherheit ist völlig normal am Anfang. Bei Sollich unterstützen wir dich dabei! 💪",
                },
                {
                  id: 3,
                  text: "Aufgeregt und gespannt",
                  feedback:
                    "Perfekt! Diese Energie bringt frischen Wind ins Team. ✨",
                },
              ],
            },
            {
              id: 4,
              scenario:
                "Dein 3D-Modell ist fertig. Jetzt braucht die Werkstatt eine 2D-Zeichnung für die Fertigung. Wie erstellst du diese? 📐",
              imageUrl: images[8].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Ich leite Ansichten aus dem 3D-Modell ab und ergänze Maße und Toleranzen",
                  correct: true,
                  feedback:
                    "Perfekt! Genau so funktioniert professionelle Konstruktion. Bei Sollich lernst du, wie 3D und 2D zusammenhängen. 🎯",
                },
                {
                  id: 2,
                  text: "Ich zeichne alles nochmal von Hand",
                  correct: false,
                  feedback:
                    "Das Modell ist schon da! Bei Sollich lernst du, effizient zu arbeiten – Ansichten automatisch ableiten. 💡",
                },
                {
                  id: 3,
                  text: "Die Werkstatt soll sich das Modell anschauen",
                  correct: false,
                  feedback:
                    "Die Werkstatt braucht 2D-Zeichnungen mit Maßen! Bei uns lernst du, was wirklich gebraucht wird. 📏",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Azubi 2./3. Lehrjahr",
          status: "locked" as const,
          icon: "🔧",
          scenarios: [
            {
              id: 5,
              scenario:
                "Du konstruierst gerade einen Antrieb für ein Förderband bei SOLLICH 🍫. Am Bildschirm führst du eine 'Kollisionsprüfung' durch und siehst: Der Motor ragt 5mm in ein Halteblech hinein 💥. In der echten Montage könnte das später krachen! Was tust du? 🛠️",
              imageUrl: images[12].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Blech im CAD anpassen ✏️",
                  correct: true,
                  feedback:
                    "Genau richtig! Kollisionsprüfung ist wichtig. Bei Sollich lernst du, Probleme am Bildschirm zu lösen, bevor sie in der Werkstatt entstehen. 🎯",
                },
                {
                  id: 2,
                  text: "Hoffen, dass es passt 🤞",
                  correct: false,
                  feedback:
                    "Bei Sollich arbeiten wir professionell! Probleme am Bildschirm lösen spart Zeit und Geld. 💎",
                },
                {
                  id: 3,
                  text: "Motor einfach weglassen 🚫",
                  correct: false,
                  feedback:
                    "Der Motor ist wichtig! Bei uns lernst du, konstruktiv zu denken – das Blech anpassen, nicht den Motor weglassen. 🔧",
                },
                {
                  id: 4,
                  text: "Werkstatt fragen, ob sie feilen 🔧",
                  correct: false,
                  feedback:
                    "Die Konstruktion muss stimmen! Bei Sollich lernst du, Verantwortung zu übernehmen – Probleme im CAD lösen, nicht in der Werkstatt. ✨",
                },
              ],
            },
            {
              id: 6,
              scenario:
                "Du konstruierst ein Pumpengehäuse mit mehreren Teilen. Wie stellst du sicher, dass alles montierbar ist? 🔩",
              imageUrl: images[7].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Ich prüfe Montagefolge, Zugänglichkeit und ob alle Schrauben erreichbar sind",
                  correct: true,
                  feedback:
                    "Exzellent! Montierbarkeit ist genauso wichtig wie die Funktion. Genau das lernen wir dir bei Sollich. 🎯",
                },
                {
                  id: 2,
                  text: "Wenn es im CAD passt, passt es auch in echt",
                  correct: false,
                  feedback:
                    "CAD ist nur die Hälfte! Bei Sollich lernst du, auch an die Montage zu denken. 🛠️",
                },
                {
                  id: 3,
                  text: "Das ist Aufgabe der Werkstatt",
                  correct: false,
                  feedback:
                    "Bei Sollich arbeiten wir im Team! Die Konstruktion muss montierbar sein – das ist deine Verantwortung. 💪",
                },
              ],
            },
            {
              id: 7,
              scenario:
                "Deine Baugruppe ist fertig konstruiert. Jetzt braucht die Fertigung eine Stückliste. Was gehört alles rein? 📝",
              imageUrl: images[8].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Alle Bauteile mit Bezeichnung, Material, Menge und Zeichnungsnummer",
                  correct: true,
                  feedback:
                    "Perfekt! Eine vollständige Stückliste ist essentiell. Genau so arbeiten wir bei Sollich. 🎯",
                },
                {
                  id: 2,
                  text: "Nur die wichtigsten Teile",
                  correct: false,
                  feedback:
                    "Die Fertigung braucht alle Teile! Bei Sollich lernst du, vollständig und präzise zu arbeiten. 📊",
                },
                {
                  id: 3,
                  text: "Die Werkstatt weiß schon, was sie braucht",
                  correct: false,
                  feedback:
                    "Bei Sollich übernimmst du Verantwortung! Eine vollständige Stückliste ist deine Aufgabe. ✨",
                },
              ],
            },
          ],
        },
        {
          id: 3,
          title: "Nach der Ausbildung",
          status: "locked" as const,
          icon: "🌍",
          scenarios: [
            {
              id: 8,
              scenario:
                "Ein großer Kunde aus den USA 🇺🇸 möchte eine riesige Überzieh-Linie kaufen. Er schickt dir den Hallenplan. Problem: Eine Betonsäule steht genau dort, wo unsere Maschine hinsoll. Der Kunde fragt: 'Können wir die Maschine irgendwie um die Säule herum bauen?' 🏗️",
              imageUrl: images[11].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Ja, wir planen eine Kurve ↩️",
                  correct: true,
                  feedback:
                    "Genau richtig! Kreative Lösungen für Kundenwünsche – das ist Ingenieurskunst. Genau das machen wir bei Sollich. 🎯",
                },
                {
                  id: 2,
                  text: "Nein, die Säule muss weg 🔨",
                  correct: false,
                  feedback:
                    "Bei Sollich finden wir Lösungen! Kundenwünsche sind Herausforderungen, die wir kreativ lösen. 💡",
                },
                {
                  id: 3,
                  text: "Wir bauen die Maschine kürzer 📉",
                  correct: false,
                  feedback:
                    "Das würde die Funktion beeinträchtigen! Bei Sollich lernen wir, sowohl technisch als auch kreativ zu denken. 🧠",
                },
                {
                  id: 4,
                  text: "Das muss der Chef entscheiden 📞",
                  correct: false,
                  feedback:
                    "Bei Sollich übertragen wir dir Verantwortung! Du lernst, eigenständig Lösungen zu entwickeln. ✨",
                },
              ],
            },
            {
              id: 9,
              scenario:
                "Du planst die Anordnung der Maschine in der Kundenhalle. Was musst du beachten? 🏭",
              imageUrl: images[11].uploadUrl,
              type: "single-select-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Hallenmaße, Zugänge, Wartungsbereiche, Sicherheitsabstände und bestehende Infrastruktur",
                  correct: true,
                  feedback:
                    "Perfekt! Layout-Planung ist komplex. Bei Sollich lernst du, alle Faktoren zu berücksichtigen. 🎯",
                },
                {
                  id: 2,
                  text: "Hauptsache die Maschine passt rein",
                  correct: false,
                  feedback:
                    "Es gibt mehr zu beachten! Bei Sollich lernst du, ganzheitlich zu denken. 🧠",
                },
                {
                  id: 3,
                  text: "Das macht der Kunde selbst",
                  correct: false,
                  feedback:
                    "Bei Sollich übernehmen wir Verantwortung! Layout-Planung ist Teil unseres Service. 💪",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          title: "Teamfit checken",
          status: "locked" as const,
          icon: "🏁",
          scenarios: [
            {
              id: 10,
              scenario:
                "Du hast alle Aufgaben gemeistert! Zeit für den wichtigsten Check: Passt die Ausbildung bei Sollich zu dir? Wir starten entspannt um 9:00 Uhr, unterstützen dich beim Führerschein und geben dir von Anfang an Verantwortung. 🌅",
              imageUrl: images[7].uploadUrl,
              type: "single-select-no-correct" as const,
              options: [
                {
                  id: 1,
                  text: "Ja, das klingt genau nach mir!",
                  feedback: "Perfekt! Lass uns quatschen. 🚀",
                },
                {
                  id: 2,
                  text: "Klingt gut, aber ich bin noch unsicher",
                  feedback:
                    "Kein Problem! Wir beantworten alle deine Fragen. 💬",
                },
                {
                  id: 3,
                  text: "Auf jeden Fall! Wo kann ich mich bewerben?",
                  feedback:
                    "Nice! Genau die richtige Einstellung. Let's go! 🔥",
                },
              ],
              allowTextInput: false,
            },
          ],
        },
      ],
    },
  ] as Job[],
  copy: {
    continueButton: "Weiter",
    nextLevel: "Nächstes Level",
    menu: "Menü",

    // Low-Threshold Conversion Wording
    checkChances: "Meine Chancen checken",
    expressApply: "Lass uns quatschen",
    jobMerken: "Job merken",

    submit: "Teamfit prüfen",
    submitSuccess: "Top! Wir schauen uns das an und melden uns in max. 24h.",

    // Victory Screen (Psychologische Brücke)
    victoryHeadline: "Sauber gelöst. 🍫",
    victorySubtext:
      "Du hast technisches Verständnis bewiesen. Genau diese Präzision suchen wir bei Sollich.",

    // The Nudge (Integrierte Benefits)
    nudgeHeadline: "Mal ehrlich...",
    nudgeText:
      "Du stellst dich hier besser an als viele andere. Wir sollten uns kennenlernen. Ganz ohne Stress und Anzug. ✨",

    // Form Labels
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
