import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { prepareArticle } from '../src/lib/articleReferences.js';

const figure = (id, supplementary = false) =>
  `:::figure ${id}${supplementary ? ' supplementary' : ''}\n![Alt](/test.png)\n\nCaption.\n:::\n`;
const references = '\n:::references\n:::\n';

test('moving definitions renumbers forward references, with independent supplemental numbering', () => {
  const source = '[figure](#figure:second:B)\n\n';
  const original = prepareArticle(
    source + figure('first') + figure('extra', true) + figure('second')
  );
  const reordered = prepareArticle(
    source + figure('second') + figure('extra', true) + figure('first')
  );
  assert.equal(original.targets.get('figure:second').label, 'Figure 2');
  assert.equal(reordered.targets.get('figure:second').label, 'Figure 1');
  assert.equal(reordered.targets.get('figure:extra').label, 'Figure S1');
  assert.equal(
    original.targets.get('figure:second').anchor,
    reordered.targets.get('figure:second').anchor
  );
});

test('citations and generated bibliography follow first use, not metadata order', () => {
  const records = ['alpha', 'beta'].map((id) => ({
    id,
    title: id,
    type: 'article-journal',
    issued: { 'date-parts': [[2026]] },
  }));
  const result = prepareArticle(
    '[cite](#cite:beta,alpha) and [cite](#cite:beta)' + references,
    records
  );
  assert.deepEqual(
    [...result.citationNumbers],
    [
      ['beta', 1],
      ['alpha', 2],
    ]
  );
  assert.deepEqual(
    result.bibliography.map(({ id, number }) => [id, number]),
    [
      ['beta', 1],
      ['alpha', 2],
    ]
  );
  assert.ok(result.bibliography.every((entry) => entry.text.includes('2026')));
});

test('broken references and duplicate definitions fail clearly', () => {
  assert.throws(
    () => prepareArticle('[figure](#figure:missing)'),
    /Unknown figure/
  );
  assert.throws(
    () => prepareArticle('[cite](#cite:missing)' + references),
    /Missing citation/
  );
  assert.throws(
    () => prepareArticle(figure('same') + figure('same')),
    /Duplicate/
  );
  assert.throws(
    () => prepareArticle(':::figure unfinished\n![Alt](/image.png)'),
    /Unclosed/
  );
});

test('the imported manuscript has every figure, table, reference, and image asset', () => {
  const source = readFileSync(
    new URL(
      '../src/blog-posts/content/structure-based-antibody-renumbering-report.md',
      import.meta.url
    ),
    'utf8'
  );
  const records = JSON.parse(
    readFileSync(
      new URL(
        '../src/blog-posts/references/structure-based-antibody-renumbering.json',
        import.meta.url
      ),
      'utf8'
    )
  );
  const article = prepareArticle(source, records);
  const figures = article.blocks.filter((block) => block.type === 'figure');
  const tables = article.blocks.filter((block) => block.type === 'table');
  assert.equal(figures.length, 11);
  assert.equal(tables.length, 7);
  assert.equal(article.bibliography.length, 41);
  assert.equal(article.citationNumbers.size, records.length);
  assert.doesNotMatch(source, /\b(?:Figure|Table) S?\d|\[\d+(?:[–,\d ]*)\]/);
  for (const figure of figures) {
    assert.ok(
      existsSync(new URL(`../public${figure.src}`, import.meta.url)),
      figure.src
    );
  }
  for (const table of tables) {
    const lines = table.source.trim().split('\n');
    const cells = lines[0].split('|').length;
    assert.ok(
      lines.every((line) => line.split('|').length === cells),
      table.id
    );
    assert.equal(lines.length - 2, table.id === 'template-selection' ? 2 : 8);
  }
});

test('the short post resolves prose and structure citations in one bibliography', () => {
  const source = readFileSync(
    new URL(
      '../src/blog-posts/content/structure-based-antibody-renumbering.md',
      import.meta.url
    ),
    'utf8'
  );
  const records = ['', '-post'].flatMap((suffix) =>
    JSON.parse(
      readFileSync(
        new URL(
          `../src/blog-posts/references/structure-based-antibody-renumbering${suffix}.json`,
          import.meta.url
        ),
        'utf8'
      )
    )
  );
  const article = prepareArticle(source, records);
  assert.equal(article.bibliography.length, 13);
  assert.equal(article.citationNumbers.get('dunbar-anarci'), 1);
  assert.equal(article.citationNumbers.get('dunbar-sabdab'), 2);
  const comparison = article.blocks.find(
    (block) => block.id === 'register-comparison'
  );
  for (const id of ['zhu-6ad0', 'sponholtz-9zwe']) {
    assert.ok(comparison.caption.includes(`#cite:${id}`));
    assert.ok(article.bibliography.find((entry) => entry.id === id)?.url);
  }
  const usedRecords = records.filter((record) =>
    article.citationNumbers.has(record.id)
  );
  assert.ok(usedRecords.every((record) => record.title && record.author.length));
  assert.equal(article.targets.get('figure:overview').label, 'Figure 1');
  assert.equal(comparison.label, 'Figure 2');
});
