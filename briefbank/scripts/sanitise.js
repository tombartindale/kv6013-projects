#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WHITELIST = [
  'id',
  'title',
  'area',
  'specialism_tag',
  'project_type_1to5',
  'generic_brief',
  'worked_examples',
  'methods_it_might_involve',
  'technologies_it_might_use',
  'programmes',
];

const AREA_MAP = {
  'AI/ML': 'AI & Machine Learning',
  'Cyber & Networks': 'Cyber Security & Networks',
  'Data & Business': 'Data Science, Analytics & Business Systems',
  'Human-Centred': 'Human-Centred & Interactive Computing',
  'Games & Immersive': 'Games & Immersive',
};

const bankPath = resolve(__dirname, '../../Project_Brief_Bank.json');
const outPath = resolve(__dirname, '../public/bank.public.json');

if (!existsSync(bankPath)) {
  console.error(`ERROR: Project_Brief_Bank.json not found at:\n  ${bankPath}`);
  process.exit(1);
}

let raw;
try {
  raw = JSON.parse(readFileSync(bankPath, 'utf8'));
} catch (e) {
  console.error(`ERROR: Failed to parse Project_Brief_Bank.json — ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(raw.briefs)) {
  console.error('ERROR: Project_Brief_Bank.json has no .briefs array');
  process.exit(1);
}

let errors = 0;

const sanitised = raw.briefs.map((brief) => {
  for (const field of WHITELIST) {
    if (!(field in brief)) {
      console.error(`ERROR: Brief ${brief.id || '(unknown)'} is missing required field: "${field}"`);
      errors++;
    }
  }

  const out = {};
  for (const field of WHITELIST) {
    out[field] = brief[field];
  }

  if (out.area && AREA_MAP[out.area]) {
    out.area = AREA_MAP[out.area];
  } else if (out.area && !AREA_MAP[out.area]) {
    console.warn(`WARNING: Brief ${brief.id} has unrecognised area code "${out.area}" — keeping as-is`);
  }

  return out;
});

if (errors > 0) {
  console.error(`\nAborted: ${errors} error(s) above must be fixed before publishing.`);
  process.exit(1);
}

// Security check: stringify and scan for any admin key
const outputStr = JSON.stringify(sanitised);
if (/"admin"/.test(outputStr)) {
  console.error('SECURITY ERROR: "admin" key detected in sanitised output — aborting.');
  process.exit(1);
}

const output = {
  module: raw.module,
  bank_version: raw.bank_version,
  n_briefs: sanitised.length,
  briefs: sanitised,
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(`✓ Sanitised ${sanitised.length} briefs → public/bank.public.json`);
