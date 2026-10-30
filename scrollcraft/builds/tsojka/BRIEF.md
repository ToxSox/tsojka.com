# BRIEF: tsojka.com (TSojka Audio)

**Status:** Teilweise interviewt. Antworten des Inhabers stehen wörtlich da. Alles,
was er ausdrücklich delegiert hat („bei dem rest kannst du entscheiden“), ist als
**Entschieden (delegiert)** markiert. Nichts davon ist ein erfundenes Zitat.

Stand: 30.10.2026 · Build: `scrollcraft/builds/tsojka` · Ausgeliefert als Astro-Seite im Repo.

---

## 1. Die acht Interview-Themen

| # | Thema | Antwort |
|---|---|---|
| 1 | Stimmung + Referenzen | Wörtlich: „eher wie apple“ |
| 2 | Weg durch die Seite | Wörtlich: „videos, testlabor, über mich workshops apps, bei dem rest kannst du entscheiden“ |
| 3 | Energiekurve | **Entschieden (delegiert):** Ruhig-selbstbewusster Einstieg, lebendig bei den Videos, eine bewusste Stille, dann der lauteste Moment im Testlabor. Danach warm und leiser (Über mich), klar und praktisch (Workshops), verspielt (Apps), ruhig und entschlossen am Ende (Kontakt). |
| 4 | Gefühl je Abschnitt + der eine Moment | **Entschieden (delegiert):** siehe Gefühlskurve und Peak unten. |
| 5 | Was die Seite kann, was keine andere kann | **Entschieden (delegiert):** Der Besucher stellt oben selbst einen EQ ein, und im Testlabor wird genau diese Kurve gemessen und in ein Messprotokoll gedruckt. |
| 6 | Wie weit weg von edel-minimal | **Entschieden (delegiert), abgeleitet aus „eher wie apple“:** Premium-minimal. Ausdrücklich gewünscht, also verdient (uniqueness.md §5). |
| 7 | Eine Welt oder einzelne Szenen | **Entschieden (delegiert):** Einzelne Kapitel mit harten Schnitten zwischen dunklem und hellem Grund, wie auf Apple-Produktseiten. Keine durchgehende Kamerafahrt. |
| 8 | Vorhandenes Material | Wörtlich: „habe keine kie.ai key“. Also nur eigenes Material: Porträt `profil.jpg`, 8 Fotos der 3D-Drucke, das SVG-Logo, die YouTube-Thumbnails aus dem Live-Feed. Keine Bildgenerierung, keine Kosten. |

**Umfang**, wörtlich: „umfang alles“. Startseite neu, Video-Archiv, Impressum,
Datenschutz und 404 im selben System.

**Bestehende Entscheidung des Inhabers, die eine Skill-Regel überstimmt:** Der eigene
Mauszeiger bleibt. Wörtlich aus einer früheren Runde: „meine kollgin findet ihn toll,
lass ihn drin“. taste.md führt „Custom cursors“ auf der Refuse-Liste; die Liste lässt
ausdrücklich zu, dass der Auftraggeber etwas davon verdient.

---

## 2. Was ist das, für wen, was soll hängen bleiben (Schritt 1)

- **Was / für wen:** Die Seite zum Car-HiFi-YouTube-Kanal von Thomas Sojka. Für
  Car-HiFi-Einsteiger, Selbsteinbauer, Händler und Profis.
- **Was der Besucher am Ende glauben soll:** Hier wird gemessen, nicht geraten.
  *(Entschieden (delegiert), abgeleitet aus dem Labor-Text „harte Fakten“ und dem
  Hinweis „unabhängig“.)*
- **Was er als Nächstes tut:** Eine Anfrage stellen. Nav-Label überall: **Kontakt**.
  Die Kapitel-Buttons tragen ihr Thema („Test anfragen“, „Workshop anfragen“,
  „Videoidee einreichen“, „Feedback geben“) und landen alle im selben Formular mit
  vorausgewähltem Thema.
- **Welt:** Low-key cinematic (worlds.md #1) für die dunklen Kapitel, technische
  Zeichnung (#8) als Sprache des Messlabors. Fotografisch, wo es echtes Foto gibt
  (Porträt, 3D-Drucke). Kein Clay, keine generierten Bilder.

## 3. Journey (Beats)

```
1  Begegnung     Thomas steht in seinem eigenen Messschrieb, der EQ folgt der Hand
2  Fülle         235 Videos, das neueste groß: hier passiert ständig etwas
3  Zweifel       Schwarzer Bildschirm, eine Frage: Vertraust du Datenblättern?
4  Beweis        Weißer Schnitt: das Messprotokoll druckt sich, mit deiner EQ-Kurve
5  Nähe          Wer misst da? Porträt, Juror-Erfahrung, REW, eigene 3D-Drucke
6  Können        Workshop-Themen, eins nach dem anderen klar
7  Spielraum     Die Apps, seitlich wie eine Produktreihe
8  Entschluss    Thema wählen, Formular ist schon vorbereitet
```

## 4. Grammatik

**Neue Grammatik: „Keynote“ (Apple-Produktseite).** Begründet, weil Navigation,
Abfolge, Ende und Verbote eine eigene Struktur beschreiben:

- **Was ein Abschnitt ist:** ein Kapitel. Jedes Kapitel beginnt mit einer großen
  Aussage auf seinem eigenen Grund, dann genau eine Vorführung (ein Gerät, das die
  Aussage zeigt), dann Fakten in ruhigem Fluss.
- **Navigation:** Lokale Produktleiste wie bei Apple: Wortmarke links, Kapitel-Links,
  eine einzige Pille „Kontakt“. Kapitel sind anspringbar.
- **Hero:** Das „Produkt“ freigestellt und geschichtet im ersten Bildschirm, Headline
  darüber, kein Vollbild-Video.
- **Ende:** Die „Welches passt zu dir?“-Wahl: Thema wählen, das Formular übernimmt die
  Wahl. Das Ende ist ein echtes Eingabefeld und bleibt stehen.
- **Verbote:** `drift` als Verlauf (Grund wechselt hart pro Kapitel), `scrub`
  (kein Material, und ein Fake-Video wäre gelogen), Scrims über Fotos,
  `kinetic` mit Zeichen-Splits, Kapitelnummern und Zähler, Scroll-Hinweise,
  mehr als ein Eyebrow pro drei Kapitel, Glow, Gedankenstriche, Raster aus
  identischen Icon-Karten.
- **Lehnt sich an:** `pin` für Vorführungen, `reveal` an Kapitelanfängen, `pan` für
  die Produktreihe, `flow` + `in` für Fakten, `parallax` im Hero, `tilt` auf Objekten.

**Warum die anderen sieben verlieren:**

| Grammatik | Warum nicht |
|---|---|
| Filmic one-shot | Verbietet anspringbare Kapitel. Die Seite ist ein Hub mit fünf Themen, Besucher kommen über Links direkt zu „Kontakt“ oder „Testlabor“. Ohne Footage auch kein Scrub. |
| Chaptered editorial | Titelseite ohne Bild und Folio statt Leiste ist Magazin, nicht „eher wie apple“. |
| Live surface | Verbietet jede Marketing-Ebene. Der Kanal ist kein Software-Produkt, das Labor ist nur ein Kapitel. Die Lehre daraus (echte Rechnung statt Attrappe) übernimmt das Messprotokoll. |
| Continuous world | Braucht eine durchgehende Kamerafahrt durch einen Ort. Kein Material, und die Themen sind kein Ort. |
| Typographic poster | Würde das echte Porträt und die 3D-Drucke verschenken. |
| Gallery / catalog | Passt nur zu den Apps, nicht zu Labor oder Workshops. |
| Split stage | Kein Zwei-Seiten-Argument über die ganze Seite. |
| Rhythmic cutlist | Verbietet `pin`. Der Peak braucht Halt, und „Apple“ ist nicht hektisch. |

## 5. Signature Move

**„Dein EQ wird gemessen.“** Im Hero zieht der Besucher mit Maus oder Finger ein
parametrisches EQ-Band über eine berechnete Messkurve (Frequenz = x, Gain = y). Diese
Einstellung wird weitergetragen: Im Testlabor zeichnet das Messprotokoll beim
Scrollen den Frequenzgang genau dieser Einstellung und druckt Frequenz, Gain und Q
des Besuchers in den Kopf des Protokolls. Wer nichts einstellt, bekommt den letzten
Stand des automatischen Demo-Bands, gekennzeichnet als solcher.

Ehrlichkeitsregel: Es werden keine erfundenen Messwerte gezeigt. Die einzigen Zahlen
im Protokoll sind die Einstellung des Besuchers. Leistung, THD+N und Dämpfung sind
als „Schema“ beschriftet.

## 6. Fingerprint-Gate

Register `scrollcraft/FINGERPRINTS.md` ist leer (erster Build dieses Workspaces).
Gate: bestanden gegen 0 Zeilen. Die Zeile wird nach Auslieferung angehängt.

## 7. Gefühlskurve (vor der Partitur geschrieben)

| Akt | Gefühl | Was es auslöst |
|---|---|---|
| 1 Hero | Neugier, Spieltrieb | Thomas steht freigestellt im Messdiagramm, die orange Kurve läuft vor ihm her und folgt der Hand |
| 2 Videos | Fülle, Vertrautheit | Das neueste Video öffnet sich groß, darunter viele weitere |
| 3 Stille | Zweifel | Fast leerer schwarzer Bildschirm, eine einzige Frage |
| 4 Testlabor | Staunen, dann Überzeugung | Harter Schnitt auf Weiß, das Protokoll baut sich unter der Hand auf, die eigene Kurve wird gemessen |
| 5 Über mich | Nähe | Porträt wird aufgedeckt, persönlicher Text, eigene 3D-Drucke zum Anfassen |
| 6 Workshops | Zuversicht | Themen schalten ruhig eins nach dem anderen durch |
| 7 Apps | Spielerische Neugier | Die Produktreihe läuft seitlich durch |
| 8 Kontakt | Entschlossenheit, Ruhe | Thema antippen, das Formular ist schon vorbereitet und bleibt stehen |

Keine zwei benachbarten Akte mit demselben Gefühl.

**Peak:** Akt 4. Satz eines Besuchers: *„Ich hab oben mit der Maus einen EQ
eingestellt, und im Testlabor wurde genau meine Kurve gemessen und ins Messprotokoll
gedruckt.“*

**Tell-someone:** *„Es ist die Seite, auf der du oben einen EQ einstellst und weiter
unten im Labor genau deine Kurve gemessen bekommst.“*

**Bewusste Stille:** Akt 3 ist absichtlich fast leer (eine Zeile auf Schwarz), damit
der Schnitt auf das weiße Labor ein Wechsel ist. Kein Dead Scroll.

## 8. Partitur

| Akt | Beat | Gerät | Spanne | Grund | Warum dieses Gerät |
|---|---|---|---|---|---|
| 1 | Begegnung | `pin` + Ebenen-Parallaxe über `--sc-p` + Pointer (EQ) | 1,6 | Schwarz | Die Ebenen trennen sich unter der Hand: Headline weicht hinter Thomas zurück, die Kurve überholt ihn |
| 2 | Fülle | `reveal` (neuestes Video) + `flow` | Fluss | Graphit | Ein Wischen ist ein Zustandswechsel: vom Versprechen zum echten Kanal |
| 3 | Zweifel | `flow` (Stille) | Fluss, ca. 1 vh | Schwarz | Leere als Instrument |
| 4 | Beweis (Peak) | `pin` + eigener Protokoll-Druck über `--sc-p` | **4,8** (größte) | Weiß | Der Rahmen hält, die Messung schreitet voran |
| 5 | Nähe | `reveal` (Porträt) + `flow` + `tilt` auf 3D-Drucken | Fluss | Schwarz | Aufdecken eines Menschen, dann Ruhe zum Lesen |
| 6 | Können | `pin` (Themenschalter) | 2,4 | Hellgrau | Ein Thema nach dem anderen, ohne Raster aus vier Karten |
| 7 | Spielraum | `pan` | 3,2 | Schwarz | Seitlich liest sich als Auswahl, nicht als Rangfolge |
| 8 | Entschluss | `flow` + Eingabe | Fluss | Weiß | Das Ende ist ein Eingabefeld |

Prüfungen: Gerätefamilien pin, parallax, pointer, reveal, flow, pan, tilt (≥ 4). Keine
Familie zweimal direkt hintereinander (Hauptgerät je Akt: pin, reveal, flow, pin,
reveal, pin, pan, flow). Kein `scrub`. Peak hat die größte Spanne (4,8 gegen 3,2).
Der Akt vor dem Peak ist der leiseste. Seitenlänge liegt deutlich über 14 vh, weil die
Seite ein Hub mit viel echtem Inhalt ist; Verwaltungsteile (Ausstattung, Hinweise,
Formular) laufen als kurzer Fluss statt als Pin. Nicht im 13,6 bis 13,8-Band.

## 9. Layer-Vertrag Hero

| Ebene | Asset | Bewegung | Kontakt/Verdeckung |
|---|---|---|---|
| Fern | Messraster (Canvas, berechnet) | kleinste: Skalierung 1 → 1,05 | keine Doppelung |
| Mitte | Rohmesskurven (gleicher Canvas) + Headline (HTML) | Headline: hoch und zurück, wird von Thomas verdeckt | Headline zu Beginn komplett lesbar |
| Subjekt | Thomas, echter Alpha-Freisteller aus `profil.jpg` | steigt langsam, skaliert leicht | Unterkante am Bildrand verankert, Boden-Verlauf versteckt den Schnitt |
| Nah | Orange Ergebnis-Kurve + Band-Marker (eigener Canvas) | stärkste, läuft vor Thomas | verdeckt nie die Headline |
| Atmosphäre | Lichtfleck hinter Thomas + Grain | langsam | trennt Subjekt vom Grund |
| Typo/Steuerung | Headline, Unterzeile, CTA, EQ-Anzeige | stabil | CTA ohne Scrollen sichtbar |

Öffnung: Headline über Thomas, Kurve läuft quer durch das Bild. Mitte: Headline weicht
hinter seinen Kopf zurück, die Kurve überholt ihn. Ausgang: Thomas und Kurve
setzen sich, die Seite schneidet in die Videos.

Mobil: Headline oben, Thomas unten größer, EQ per Antippen und Ziehen.

## 10. Was bewusst wegfällt (harte Regeln)

Kapitel-Labels „CH.01“, Pegel-Navigation, Scroll-Hinweis, Bildzähler „01 / 08“,
Lauftext-Band, Startanimation, Glow auf Kurven und LEDs, Gedankenstriche im
sichtbaren Text, Lenis-Smooth-Scroll (natives Scrollen wie bei Apple; die Engine
liest die Position direkt). Inhalte bleiben alle erhalten.

---

## 11. Verifikation (nach dem Bau)

**Harness (`shoot.mjs`), Endstand:** Desktop 1440×900, Handy 390×844, kompakt 360×640,
reduzierte Bewegung. Überall: kein Dead Scroll, alle Cues ≥ 4,5:1 im schlechtesten
Frame. Seitenlänge 25,4 vh Desktop, 30,9 vh Handy (Hub mit viel echtem Inhalt, siehe §8).

**Funktion (Chromium und Firefox):** EQ im Hero einstellen → Protokoll zeigt dieselben
Werte und „Deine Einstellung aus dem Kopfbereich“; vier Themen-Buttons landen sichtbar am
vorausgewählten Thema; alle Nav-Links treffen ihr Kapitel; Lightbox mit Pfeiltasten und
Escape; Tab-Reihenfolge Skip-Link → Logo → Kapitel; Archivsuche; 404 mit Status 404;
alte URLs leiten um; Handy-Menü öffnet, springt und schließt; kein horizontales Scrollen.

**Gefundene und behobene Fehler:**
- Workshop-Index lief der Karte einen Frame hinterher → Fortschritt aus der Lage berechnet.
- Labor-Texte überlagerten sich halb → Cue-Fenster aneinander anschließend, kurze Rampen.
- Hero: Headline wurde von Thomas verdeckt → Komposition neu, Thomas unten verankert.
- Firefox zeichnete die Protokollkurven nur halb (`vector-effect` + `pathLength`) → entfernt.
- Reduzierte Bewegung: 1,6 vh Leerlauf im Hero → Hero dort genau ein Bildschirm.
- Protokoll-Kacheln auf dem Handy: Titel und Vermerk liefen ineinander → untereinander.

**Nicht verifiziert:** echtes iPhone/Android, Safari, echtes Absenden des Formulars.
Im Firefox der Testumgebung lädt der Video-Feed nicht (CORS über den Test-Proxy, in
Chromium mit demselben Proxy klappt es; live wurde Firefox vom Inhaber bereits bestätigt).

## 12. Feel-Check (kalt, Kontaktblatt Desktop, dann mit §7 verglichen)

| Akt | Beabsichtigt | Gefühlt | Abweichung / Änderung |
|---|---|---|---|
| 1 Hero | Neugier, Spieltrieb | Neugier | passt; vor dem Fix „Unruhe“, weil Kopf die Headline verdeckte |
| 2 Videos | Fülle, Vertrautheit | Fülle | passt |
| 3 Stille | Zweifel | Pause | etwas schwächer als geplant, aber trennt klar |
| 4 Labor | Staunen, Überzeugung | Aufbau, dann Abschluss | passt; Stempel „Gemessen, nicht geraten“ markiert das Ende |
| 5 Über mich | Nähe | Ruhe, Nähe | passt |
| 6 Workshops | Zuversicht | Ordnung | passt |
| 7 Apps | spielerische Neugier | Auswahl | passt |
| 8 Kontakt | Entschlossenheit | Ankommen | passt, Formular steht still |

Peak: Akt 4 hat die größte Spanne (4,8 vh) und den größten Wechsel (Schnitt Schwarz →
Weiß). Der Akt davor ist der leiseste. Das Ende löst auf ein Eingabefeld auf.
