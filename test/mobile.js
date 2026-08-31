const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

console.log('\n--- 1. File Existence & Integrity ---');
const files = ['index.html', 'manifesto.html', 'evidence.html', 'ethics.html', 'global.html', 'poster.html', 'site.css', 'i18n.js', 'sw.js', 'manifest.webmanifest'];
files.forEach(f => {
  assert(fs.existsSync(path.join(ROOT, f)), `${f} exists on disk`);
});

console.log('\n--- 2. Evaluating i18n Translations in Real JS Context ---');
const i18nCode = fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8');
const context = {};
try {
  vm.runInNewContext(i18nCode + '; window = { I18N };', context);
  const I18N = context.window.I18N;
  assert(typeof I18N === 'object', 'I18N object evaluates successfully with zero syntax errors');

  const requiredLangs = ['en', 'hi', 'mr', 'bn', 'ta', 'te'];
  requiredLangs.forEach(lang => {
    assert(I18N[lang] != null, `Language '${lang}' root exists`);
    assert(typeof I18N[lang].ui.homeSubtitle === 'string' && I18N[lang].ui.homeSubtitle.length > 10,
      `Language '${lang}' has non-empty humanized homeSubtitle ("${I18N[lang].ui.homeSubtitle.slice(0, 35)}...")`);
    
    const insts = ['phq4', 'phq9', 'gad7', 'who5', 'auditc'];
    insts.forEach(inst => {
      assert(I18N[lang].inst[inst] != null, `Language '${lang}' contains instrument '${inst}'`);
      assert(Array.isArray(I18N[lang].inst[inst].q) && I18N[lang].inst[inst].q.length > 0,
        `Language '${lang}' instrument '${inst}' has questions array`);
    });
  });
} catch (e) {
  assert(false, `i18n.js VM execution failed: ${e.message}`);
}

console.log('\n--- 3. Critical Path, PWA & Rendering Checks ---');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert(indexHtml.includes('localStorage.getItem("psych-prefs")'), 'prefs.js inlined in <head> (CLS = 0)');
assert(indexHtml.includes('window.HELP = {'), 'helplines.js inlined in index.html');
assert(indexHtml.includes('rel="manifest"'), 'PWA manifest linked in <head>');
assert(indexHtml.includes('copySBARSummary'), 'SBAR clinical brief copy function present');
assert(indexHtml.includes('readQuestionAloud'), 'Web Speech API voice mode present');

console.log('\n--- 4. CSS Design System & Shadow Cleanup ---');
const siteCss = fs.readFileSync(path.join(ROOT, 'site.css'), 'utf8');
assert(!siteCss.includes('4px 4px 0 var('), 'No neo-brutalist 4px 4px 0 offset shadows in site.css');
assert(siteCss.includes('--shadow-card:'), '--shadow-card multi-layer diffuse shadow defined');

console.log('\n--- 5. Service Worker Cache Integrity ---');
const swCode = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
assert(swCode.includes('psych-screener-v8'), 'Service Worker cache version bumped to v8');
assert(!swCode.includes('anton.woff2'), 'Dead font anton.woff2 removed from cache');

console.log(`\n========================================`);
console.log(`Total Checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed === 0) {
  console.log(`ALL CHECKS PASS ✓`);
  process.exit(0);
} else {
  console.error(`SOME CHECKS FAILED ✗`);
  process.exit(1);
}
