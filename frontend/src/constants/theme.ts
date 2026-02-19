export const COLORS = {
  // Primary colors (Blue & Pink gradient)
  primary: '#FF1493',      // Deep Pink
  primaryDark: '#DB1380',
  secondary: '#00D4FF',    // Cyan Blue
  
  // Gradient colors
  gradientPink: '#FF1493',
  gradientBlue: '#00D4FF',
  gradientPurple: '#8B5CF6',
  
  // Gaming accents
  xbox: '#107C10',
  playstation: '#006FCD',
  pc: '#FF6B00',
  
  // Background - Pure Black
  background: '#000000',
  card: '#111111',
  cardLight: '#1A1A1A',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  
  // Status
  success: '#00FF88',
  error: '#FF4757',
  warning: '#FFD93D',
  
  // Others
  border: '#222222',
  overlay: 'rgba(0,0,0,0.85)',
  match: '#FF1493',        // Pink for matches
  
  // Accent Blue
  blue: '#00D4FF',
  blueLight: '#33DDFF',
  blueDark: '#00A8CC',
  
  // Accent Pink
  pink: '#FF1493',
  pinkLight: '#FF69B4',
  pinkDark: '#DB1380',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const CONSOLES = [
  { id: 'xbox', name: 'Xbox', color: COLORS.xbox, icon: 'logo-xbox' },
  { id: 'ps5', name: 'PlayStation 5', color: COLORS.playstation, icon: 'logo-playstation' },
  { id: 'pc', name: 'PC', color: COLORS.pc, icon: 'desktop-outline' },
  { id: 'switch', name: 'Nintendo Switch', color: '#E60012', icon: 'game-controller-outline' },
];

export const LOOKING_FOR_OPTIONS = [
  { id: 'ami_occasionnel', label: 'Ami Occasionnel', icon: 'game-controller-outline' },
  { id: 'ami_team', label: 'Ami de Team', icon: 'people-outline' },
  { id: 'ami_regulier', label: 'Ami Régulier', icon: 'heart-outline' },
];

export const POPULAR_GAMES = [
  'Fortnite', 'Call of Duty', 'FIFA', 'GTA V', 'Minecraft',
  'Apex Legends', 'Valorant', 'League of Legends', 'Rocket League',
  'Overwatch 2', 'Rainbow Six Siege', 'CS:GO', 'Elden Ring',
  'Destiny 2', 'Halo Infinite', 'God of War', 'Spider-Man 2',
  'Baldur\'s Gate 3', 'Diablo IV', 'World of Warcraft',
];

export const POPULAR_INTERESTS = [
  'RPG', 'FPS', 'MMORPG', 'Battle Royale', 'Sports', 'Racing',
  'Stratégie', 'Aventure', 'Horreur', 'Indie', 'Esports',
  'Streaming', 'Speedrun', 'Casual Gaming', 'Compétitif',
];

export const COUNTRIES = [
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola',
  'Antigua-et-Barbuda', 'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche',
  'Azerbaïdjan', 'Bahamas', 'Bahreïn', 'Bangladesh', 'Barbade', 'Belgique', 'Belize',
  'Bénin', 'Bhoutan', 'Biélorussie', 'Birmanie', 'Bolivie', 'Bosnie-Herzégovine',
  'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso', 'Burundi', 'Cambodge',
  'Cameroun', 'Canada', 'Cap-Vert', 'Centrafrique', 'Chili', 'Chine', 'Chypre', 'Colombie',
  'Comores', 'Corée du Nord', 'Corée du Sud', 'Costa Rica', 'Côte d\'Ivoire', 'Croatie',
  'Cuba', 'Danemark', 'Djibouti', 'Dominique', 'Égypte', 'Émirats arabes unis', 'Équateur',
  'Érythrée', 'Espagne', 'Estonie', 'États-Unis', 'Éthiopie', 'Fidji', 'Finlande', 'France',
  'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 'Grenade', 'Guatemala', 'Guinée',
  'Guinée équatoriale', 'Guinée-Bissau', 'Guyana', 'Haïti', 'Honduras', 'Hongrie', 'Inde',
  'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël', 'Italie', 'Jamaïque', 'Japon',
  'Jordanie', 'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati', 'Koweït', 'Laos', 'Lesotho',
  'Lettonie', 'Liban', 'Liberia', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
  'Macédoine du Nord', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte',
  'Maroc', 'Maurice', 'Mauritanie', 'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 'Mongolie',
  'Monténégro', 'Mozambique', 'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger', 'Nigeria',
  'Norvège', 'Nouvelle-Zélande', 'Oman', 'Ouganda', 'Ouzbékistan', 'Pakistan', 'Palaos',
  'Palestine', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou',
  'Philippines', 'Pologne', 'Portugal', 'Qatar', 'République dominicaine',
  'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda', 'Saint-Kitts-et-Nevis',
  'Saint-Vincent-et-les-Grenadines', 'Sainte-Lucie', 'Salomon', 'Salvador', 'Samoa',
  'São Tomé-et-Príncipe', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour',
  'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka', 'Suède',
  'Suisse', 'Suriname', 'Swaziland', 'Syrie', 'Tadjikistan', 'Tanzanie', 'Tchad', 'Thaïlande',
  'Timor oriental', 'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie', 'Turkménistan', 'Turquie',
  'Tuvalu', 'Ukraine', 'Uruguay', 'Vanuatu', 'Vatican', 'Venezuela', 'Viêt Nam', 'Yémen',
  'Zambie', 'Zimbabwe'
];

// Alias for ALL_COUNTRIES
export const ALL_COUNTRIES = COUNTRIES;

export const LANGUAGES = [
  { id: 'français', label: 'Français', flag: '🇫🇷' },
  { id: 'anglais', label: 'Anglais', flag: '🇬🇧' },
  { id: 'espagnol', label: 'Espagnol', flag: '🇪🇸' },
  { id: 'italien', label: 'Italien', flag: '🇮🇹' },
  { id: 'mandarin', label: 'Mandarin', flag: '🇨🇳' },
  { id: 'arabe', label: 'Arabe', flag: '🇸🇦' },
];

export const GENDERS = [
  { id: 'homme', label: 'Homme' },
  { id: 'femme', label: 'Femme' },
  { id: 'autre', label: 'Autre' },
];
