#!/usr/bin/env node
// Line-by-line repository analyzer (CommonJS)
// Usage: `node scripts/line_analysis.cjs`

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'artifacts', 'dist', 'build', 'out', 'coverage']);
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.mdx', '.html', '.css', '.scss', '.less', '.yml', '.yaml', '.svg', '.txt']);

function walk(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const name = ent.name;
    if (EXCLUDE_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    if (ent.isDirectory()) {
      results = results.concat(walk(full));
    } else if (ent.isFile()) {
      const ext = path.extname(name).toLowerCase();
      if (EXTENSIONS.has(ext)) results.push(full);
    }
  }
  return results;
}

function analyzeFile(filePath) {
  const rel = path.relative(ROOT, filePath).split(path.sep).join('/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const totalLines = lines.length;
  const fileSummary = {
    path: rel,
    totalLines,
    blankLines: 0,
    commentLines: 0,
    longLines: 0,
    trailingWhitespace: 0,
    todos: 0,
    consoleCalls: 0,
    debuggers: 0,
    evals: 0,
  };

  const lineReports = [];
  const ext = path.extname(filePath).toLowerCase();
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const trimmed = text.trim();
    const number = i + 1;
    const isBlank = trimmed.length === 0;
    let isComment = false;

    if (!isBlank) {
      if (inBlockComment) {
        isComment = true;
        if (trimmed.includes('*/') || trimmed.includes('-->')) inBlockComment = false;
      } else {
        if (trimmed.startsWith('//')) isComment = true;
        else if (trimmed.startsWith('/*') || trimmed.includes('/*')) {
          isComment = true;
          if (!trimmed.includes('*/')) inBlockComment = true;
        } else if (ext === '.html' && trimmed.startsWith('<!--')) {
          isComment = true;
          if (!trimmed.includes('-->')) inBlockComment = true;
        }
      }
    }

    if (isBlank) fileSummary.blankLines++;
    if (isComment) fileSummary.commentLines++;

    const longLine = text.length > 120;
    if (longLine) fileSummary.longLines++;

    const trailingWhitespace = /[ \t]+$/.test(text);
    if (trailingWhitespace) fileSummary.trailingWhitespace++;

    const containsTODO = /TODO|FIXME/i.test(text);
    if (containsTODO) fileSummary.todos++;

    const containsConsole = /\bconsole\.(log|warn|error|info|debug)\b/.test(text);
    if (containsConsole) fileSummary.consoleCalls++;

    const containsDebugger = /\bdebugger\b/.test(text);
    if (containsDebugger) fileSummary.debuggers++;

    const containsEval = /\beval\s*\(/.test(text);
    if (containsEval) fileSummary.evals++;

    const flags = {};
    if (isBlank) flags.isBlank = true;
    if (isComment) flags.isComment = true;
    if (longLine) flags.longLine = true;
    if (trailingWhitespace) flags.trailingWhitespace = true;
    if (containsTODO) flags.containsTODO = true;
    if (containsConsole) flags.containsConsole = true;
    if (containsDebugger) flags.containsDebugger = true;
    if (containsEval) flags.containsEval = true;

    lineReports.push({ number, text, length: text.length, flags });
  }

  return { summary: fileSummary, lines: lineReports };
}

function main() {
  console.log('Scanning repository for analysis...');
  const files = walk(ROOT);
  console.log(`Found ${files.length} files to analyze.`);

  const report = {
    generatedAt: new Date().toISOString(),
    root: ROOT,
    fileCount: files.length,
    files: [],
  };

  const aggregate = { totalLines: 0, blankLines: 0, commentLines: 0, longLines: 0, trailingWhitespace: 0, todos: 0, consoleCalls: 0, debuggers: 0, evals: 0 };

  for (const f of files) {
    try {
      const res = analyzeFile(f);
      report.files.push({ path: res.summary.path, totalLines: res.summary.totalLines, summary: res.summary, lines: res.lines });
      aggregate.totalLines += res.summary.totalLines;
      aggregate.blankLines += res.summary.blankLines;
      aggregate.commentLines += res.summary.commentLines;
      aggregate.longLines += res.summary.longLines;
      aggregate.trailingWhitespace += res.summary.trailingWhitespace;
      aggregate.todos += res.summary.todos;
      aggregate.consoleCalls += res.summary.consoleCalls;
      aggregate.debuggers += res.summary.debuggers;
      aggregate.evals += res.summary.evals;
    } catch (err) {
      console.error(`Error analyzing ${f}: ${err.message}`);
    }
  }

  report.aggregate = aggregate;
  const outDir = path.join(ROOT, 'artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'line_analysis_report.json');
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf8');

  console.log('Analysis complete.');
  console.log(`Files scanned: ${report.fileCount}`);
  console.log(`Total lines: ${aggregate.totalLines}`);
  console.log(`Lines with TODO/FIXME: ${aggregate.todos}`);
  console.log(`Long lines (>120): ${aggregate.longLines}`);
  console.log('Report written to artifacts/line_analysis_report.json');
}

main();
