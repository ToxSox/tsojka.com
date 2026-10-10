export const site = {
  title: 'TSojka Audio',
  author: 'Thomas Sojka',
  description:
    'Willkommen auf der Seite zu meinem Car-HiFi-Kanal! Tutorials, Reviews und Tipps aus der Community, für die Community.',
  youtube: 'https://www.youtube.com/@tsojka',
  email: 'youtube@tsojka.com',
  formAction: 'https://formspree.io/f/mnnnqqpw',
  videoFeed: 'https://yt.tsojka.com/youtube_playlist.json',
};

/** Kapitel des One-Pagers – Reihenfolge = Signalweg. */
export const chapters = [
  { id: 'videos', label: 'Videos', ch: '01' },
  { id: 'labor', label: 'Testlabor', ch: '02' },
  { id: 'workshops', label: 'Workshops', ch: '03' },
  { id: 'about', label: 'Über mich', ch: '04' },
  { id: 'apps', label: 'Apps & Tools', ch: '05' },
  { id: 'kontakt', label: 'Kontakt', ch: '06' },
] as const;

export const marquee = [
  'DSP-Tuning',
  'REW',
  'THD+N',
  'LiFePO4',
  'LTO',
  'Na-Ion',
  'Alubutyl',
  'OEM-Integration',
  'MOST-Bus',
  'Laufzeitkorrektur',
  'Frequenzgang',
  'Dämpfungsfaktor',
  '3D-Druck',
  'AYA',
];

export const pillars = [
  {
    title: 'Messtechnische Analysen',
    text: 'Unabhängige Leistungstests und Frequenzgang-Analysen von Endstufen und DSPs in meinem spezialisierten Labor.',
    href: '#labor',
  },
  {
    title: 'Workshops & Trainings',
    text: 'Lerne in praxisnahen Seminaren alles über moderne Stromversorgung (LiFePO4), fachgerechte Dämmung (Alubutyl) und OEM-Integration.',
    href: '#workshops',
  },
  {
    title: 'YouTube Tutorials',
    text: 'Profitiere von meinem Wissen aus hunderten Einbauten – aufbereitet in leicht verständlichen Video-Anleitungen.',
    href: '#videos',
  },
];

export const videoFormats = [
  {
    title: 'Ehrliche Produktreviews und Labor-Tests',
    text: 'Unabhängige Leistungstests und Frequenzgang-Analysen von Endstufen (Verstärker), Subwoofern, High-End Lautsprechern und DSPs, ausgemessen im eigenen Prüflabor.',
  },
  {
    title: 'Schritt-für-Schritt Tutorials',
    text: 'Von den Basics wie sicherem Verlegen der Stromkabel (erforderliche Querschnitte, Absicherung), über korrekte Alubutyl-Dämmung der Fahrzeugtüren, bis hin zum komplexen Einmessen mit REW (Room EQ Wizard).',
  },
  {
    title: 'Wettbewerbsberichte (AYA Veranstaltungen)',
    text: 'Echte Einblicke in die Welt der Sound-Quality (SQ) Car-HiFi-Events, inklusive Fahrzeugvorstellungen und Interviews mit Profis aus der Szene.',
  },
  {
    title: 'Praktische Tipps & Tricks',
    text: 'Wie finde ich Störgeräusche (z.B. Lichtmaschinenpfeifen)? Wie baue oder drucke ich Lautsprecheradapter? Maßgeschneiderte Lösungen für gängige Einbauprobleme.',
  },
];

export const labTests = [
  {
    key: 'power',
    title: 'Leistungsmessung',
    text: 'Echte RMS-Leistung (Watt) an verschiedenen Impedanzen.',
  },
  {
    key: 'thd',
    title: 'Verzerrungen und Rauschen (THD+N)',
    text: 'Total Harmonic Distortion + Noise – Wie sauber spielt der Verstärker am Limit wirklich?',
  },
  {
    key: 'damping',
    title: 'Dämpfungsfaktor',
    text: 'Kontrolle über Subwoofer und Lautsprecher durch messtechnische Erfassung des Innenwiderstands.',
  },
  {
    key: 'response',
    title: 'Frequenzgang und Linearität',
    text: 'Spielt der DSP oder die Endstufe über das gesamte Frequenzband absolut neutral?',
  },
] as const;

export const labGear = [
  'Hochpräzises Audio-Analysegerät für exakte Datenerfassung und Frequenzmessungen',
  'Stabile Stromversorgung über professionelle Labornetzteile und smarte Hochstrombatterien (z.B. LiFePO4 / LTO)',
  'Referenz-Soundinterfaces für geringstes Grundrauschen beim Messen',
  'Leistungsstarke Hochlastwiderstände (Dummy Loads) für Leistungstests unter maximaler Belastung',
];

export const workshopTopics = [
  {
    icon: 'bolt',
    title: 'Moderne Stromversorgung',
    html: 'Alles über neuartige Batterietechnologien wie <strong>LiFePO4</strong>, <strong>LTO (Lithium-Titanat)</strong> und <strong>Natrium-Ionen-Batterien (Na-Ion)</strong> für maximale und sichere Energieausbeute.',
  },
  {
    icon: 'dsp',
    title: 'DSP-Trainings & Einmessen',
    html: 'Die Königsdisziplin. Vom korrekten Grundsetup im Digitalen Signalprozessor über Laufzeitkorrektur bis hin zum klanglichen Feinschliff mit dem Messmikrofon.',
  },
  {
    icon: 'link',
    title: 'Verkabelung & OEM-Integration',
    html: 'Sichere Verlegung von Strom- und Signalkabeln sowie das verlustfreie Abgreifen von Signalen in extrem komplexen, modernen Fahrzeugen (z.B. MOST-Bus).',
  },
  {
    icon: 'layers',
    title: 'Dämmung & Akustik',
    html: 'Türbleche, Verkleidungen und Fahrzeugböden richtig behandeln, um äußere Störgeräusche zu eliminieren und den Kickbass zu maximieren.',
  },
] as const;

export const audiences = [
  {
    title: 'Für Händler & Profis',
    text: 'Die Branche entwickelt sich rasend schnell. Um Kunden optimal zu beraten und Fahrzeuge effizient umzubauen, ist ständige Weiterbildung unerlässlich. Ich gebe mein Wissen direkt an dich und dein Team weiter, damit ihr für die Zukunft gerüstet seid.',
  },
  {
    title: 'Für private Enthusiasten',
    text: 'Du baust dein System selbst ein und möchtest wissen, wie die Profis arbeiten? In meinen praxisnahen Trainings zeige ich dir Wege auf, wie du typische Fehler vermeidest und akustisch wie optisch das absolute Maximum aus deiner Hardware herausholst.',
  },
];

export const expertise = [
  {
    title: 'Wettbewerb und Community',
    html: 'Ich bin ehemaliger <strong>Vorstandsvorsitzender der AYA Deutschland e.V.</strong> (Are You Authentic), einem der führenden und renommiertesten Car-HiFi-Wettbewerbsformate in Deutschland.',
  },
  {
    title: 'Klangbewertung und Sound-Tuning',
    html: 'Als erfahrener <strong>Soundjuror</strong> und früherer <strong>Einbaujuror</strong> bewerte ich Autos streng nach klanglichen (Bühnenabbildung, Tonalität) und technischen Kriterien (Sicherheit, fachgerechte Verkabelung).',
  },
  {
    title: 'Technisches Know-how',
    html: 'Die fundierten Grundlagen der Elektrotechnik habe ich von der Pike auf gelernt und in hunderten Stunden Praxis beim Verdrahten und Einmessen von komplexen Audio-Systemen und digitalen Signalprozessoren (DSP) stetig verfeinert.',
  },
];

export const rewReasons = [
  {
    title: 'Präzise Messungen',
    text: 'REW ermöglicht genaue Messungen des Frequenzgangs, der Verzerrungen und anderer wichtiger Audioparameter.',
  },
  {
    title: 'Optimierung',
    text: 'Mit den gewonnenen Daten kannst du dein Car-HiFi-System feinabstimmen und die Klangqualität erheblich verbessern.',
  },
  {
    title: 'Vielseitigkeit',
    text: 'REW ist flexibel einsetzbar, sowohl für grundlegende Einstellungen als auch für komplexe Analysen.',
  },
];

export type App = {
  name: string;
  tags: string[];
  text: string;
  url?: string;
  cta?: string;
  status: 'live' | 'dev';
};

export const apps: App[] = [
  {
    name: 'TuneHelper',
    tags: ['iOS', 'Android'],
    text: 'Messsignale in Instrumentenqualität fürs Car-Audio-DSP-Tuning: 14 Generatoren von Rosa Rauschen über Log- und Sub-Sweeps bis zu Impulsen und Multitone, dazu Stereo-Korrelationsmodi und ein Time-Alignment-Regler mit ±20 ms. Alles wird in Echtzeit synthetisiert und per Bluetooth, USB-C oder Klinke ins Auto gestreamt – der Stepped-Sine läuft für freihändiges Messen mit REW alle 32 ISO-Mittenfrequenzen selbstständig ab.',
    url: 'https://tunehelper.apps.tsojka.com',
    cta: 'Zur Website',
    status: 'live',
  },
  {
    name: 'BlechPilot',
    tags: ['iOS', 'Android'],
    text: 'Schadendokumentation für Kfz-Werkstätten und Karosseriebetriebe: Ein geführter Workflow mit neun Pflichtfotos sorgt in Minuten für eine lückenlose Aufnahme. KI-gestützte Fahrzeugschein-Erkennung, volle Offline-Fähigkeit und verschlüsselter Upload direkt an den Gutachter-Server inklusive.',
    url: 'https://blechpilot.de',
    cta: 'Zur Website',
    status: 'live',
  },
  {
    name: 'Autoakte',
    tags: ['iOS'],
    text: 'Deine Fahrzeuge digital im Griff: Die iOS-App erinnert an HU und Kfz-Steuer, verwaltet Dokumente wie den Fahrzeugschein und führt Wartungshistorie, Tankbuch und Kostenauswertung. Ohne Datenerhebung, mit iCloud-Sync – kostenlos für bis zu zwei Autos.',
    url: 'https://autoakte.apps.tsojka.com',
    cta: 'Zur Website',
    status: 'live',
  },
  {
    name: 'ich-wuensch-mir-das.de',
    tags: ['Web-App'],
    text: 'Die Premium-Wunschliste für alle Anlässe: Erstelle digitale Wunschlisten und teile sie mit Familie und Freunden. Gemeinschaftsgeschenke mit automatischer Kostenaufteilung, Amazon-Import und Echtzeit-Reservierungen gegen Doppelkäufe – Überraschungswünsche inklusive.',
    url: 'https://ich-wuensch-mir-das.de/',
    cta: 'Zur Web-App',
    status: 'live',
  },
  {
    name: 'Build Log Creator',
    tags: ['Web-Tool'],
    text: 'Web-Tool zum Erstellen und Verwalten von Build-Logs: Dokumentiere dein Projekt Schritt für Schritt direkt im Browser und halte jeden Fortschritt übersichtlich fest.',
    url: 'https://toxsox.github.io/buildlog/',
    cta: 'Zum Tool',
    status: 'live',
  },
  {
    name: 'CarQuiz',
    tags: ['Web-App'],
    text: 'CarQuiz – das Quiz-Spiel rund ums Auto: Teste dein Wissen direkt im Browser und fordere Freunde und Familie heraus.',
    url: 'https://app.carquiz.de',
    cta: 'Zum Spiel',
    status: 'live',
  },
  {
    name: 'Anydsp',
    tags: ['Desktop'],
    text: 'Herstellerunabhängige Steuerung für Car-Audio-DSPs: Geräte verschiedener Hersteller werden über ein gemeinsames Bedienmodell angesprochen, Presets lassen sich zwischen Geräten übertragen. Vor jedem Schreibvorgang zeigt dir die Software ehrlich, was dabei nicht eins zu eins passt. Die Desktop-Version entsteht zuerst, mobile Versionen folgen später.',
    status: 'dev',
  },
  {
    name: 'Drandenker',
    tags: ['iOS', 'Android'],
    text: 'Kein Geburtstag geht mehr unter: Aus den Geburtstagen in deinem Adressbuch – auf Wunsch auch aus dem Kalender – werden Erinnerungen, die sich über den Tag steigern. Mit drei Intensitätsstufen, eigenem Zeitfenster, Nachhol-Erinnerung am Folgetag und Gratulieren per WhatsApp, Anruf oder SMS. Alles bleibt lokal auf dem Gerät – ohne Konto, ohne Server.',
    status: 'dev',
  },
];

export const gallery = [
  { file: '001.jpeg', alt: 'Adapter für Türlautsprecher' },
  { file: '002.jpeg', alt: 'Gehäuse für Hochtöner' },
  { file: '003.jpeg', alt: 'Gehäuse für Hochtöner' },
  { file: '004.jpeg', alt: 'Gehäuse für Hochtöner' },
  { file: '005.jpeg', alt: 'Adapter für Türlautsprecher' },
  { file: '006.jpeg', alt: 'Gehäuse für Hochtöner' },
  { file: '007.jpeg', alt: 'Gehäuse für Hochtöner' },
  { file: '008.jpeg', alt: 'Gehäuse für Hochtöner' },
];
