export const PITCH_FORM_URL = '__PITCH_FORM_URL__';

export const PREFERENCES_DEADLINE = '2026-10-09';

export const SUBMISSION_ENDPOINT = import.meta.env.VITE_SUBMISSION_ENDPOINT || '';

export const AREA_SLUGS = {
  'ai-ml': 'AI & Machine Learning',
  'cyber': 'Cyber Security & Networks',
  'data': 'Data Science, Analytics & Business Systems',
  'hci': 'Human-Centred & Interactive Computing',
  'games': 'Games & Immersive',
};

export const SLUG_BY_AREA = Object.fromEntries(
  Object.entries(AREA_SLUGS).map(([slug, name]) => [name, slug])
);

export const AREA_DESCRIPTIONS = {
  'AI & Machine Learning': 'Intelligent systems, machine learning, NLP, computer vision, and AI-driven applications.',
  'Cyber Security & Networks': 'Network security, penetration testing, threat detection, cryptography, and secure systems.',
  'Data Science, Analytics & Business Systems': 'Data pipelines, visualisation, business intelligence, analytics, and decision support.',
  'Human-Centred & Interactive Computing': 'UX research, accessibility, HCI, interactive systems, and participatory design.',
  'Games & Immersive': 'Game development, XR/AR/VR, interactive narratives, and immersive experiences.',
};

export const PROJECT_TYPE_LABELS = {
  1: 'Pure investigation / study',
  2: 'Mostly investigative',
  3: 'Balanced — investigation & build',
  4: 'Mostly build-focused',
  5: 'Pure product / build',
};
