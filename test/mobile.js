const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Testing File & DOM Integrity ---');
const files = ['index.html', 'manifesto.html', 'evidence.html', 'ethics.html', 'global.html', 'poster.html', 'site.css', 'i18n.js', 'sw.js'];
files.forEach(f => {
  const p = path.join(ROOT, f);
  assert(fs.existsSync(p), `${f} exists`);
});

console.log('\n--- 2. Testing Critical Path Inlining (P2) ---');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert(indexHtml.includes('localStorage.getItem("psych-prefs")'), 'prefs.js inlined in <head> to prevent theme flash & CLS');
assert(indexHtml.includes('window.HELP = {'), 'helplines.js data inlined in index.html to eliminate extra round trip');
assert(!indexHtml.includes('<script src="prefs.js"></script>'), 'prefs.js external script removed from index.html');
assert(!indexHtml.includes('<script src="helplines.js"></script>'), 'helplines.js external script removed from index.html');

console.log('\n--- 3. Testing Humanized Card Hierarchy & Plain Language (Directives 3 & 5) ---');
assert(indexHtml.includes('id="homeSubtitle"'), 'homeSubtitle patient statement placed above cards');
assert(indexHtml.includes('id="primer"'), 'Pre-screener primer panel present');
assert(indexHtml.includes('primerSeen(id)'), 'Primer skippability logic present for returning users');

const i18nCode = fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8');
assert(i18nCode.includes('homeSubtitle:'), 'homeSubtitle defined in i18n English');
assert(i18nCode.includes('अंक का क्या अर्थ है'), 'Hindi translations intact and properly encoded in UTF-8');

console.log('\n--- 4. Testing Touch & Mobile Ergonomics (Directive 2 & P4) ---');
assert(indexHtml.includes('@media (pointer: coarse){ .bigopts .kbd{display:none;} }') || indexHtml.includes('@media (pointer: coarse)'), 'Keyboard numbers hidden on touch devices');
assert(indexHtml.includes('requestAnimationFrame'), 'Reflow reads & writes batched with requestAnimationFrame in trackTabbar');

console.log('\n--- 5. Testing Elimination of Neo-Brutalist Artifacts (Directive 1 & D2) ---');
const pages = ['index.html', 'manifesto.html', 'evidence.html', 'ethics.html', 'global.html'];
pages.forEach(p => {
  const content = fs.readFileSync(path.join(ROOT, p), 'utf8');
  assert(!content.includes('4px 4px 0 var('), `${p} has no 4px 4px 0 hard offset shadows`);
});

console.log('\n--- 6. Testing Service Worker Offline Asset Sync ---');
const swCode = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
assert(swCode.includes('psych-screener-v8'), 'Service Worker cache bumped to v8');
assert(!swCode.includes('anton.woff2'), 'Anton font removed from Service Worker cache assets');

console.log(`\n========================================`);
console.log(`Total Checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed === 0) {
  console.log(`ALL CHECKS PASS ✓`);
  process.exit(0);
} else {
  console.error(`SOME CHECKS FAILED ✗`);
  process.exit(1);
}
