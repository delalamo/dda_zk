import { Cite } from '@citation-js/core';
import '@citation-js/plugin-csl';

// A small authoring layer around ordinary Markdown. IDs survive moves; displayed
// numbers follow definition order (and citation numbers follow first use).
export function prepareArticle(source, records = []) {
  const blocks = [];
  const targets = new Map();
  const definition =
    /^:::(figure|references)(?: ([a-z][a-z0-9-]*))?\n([\s\S]*?)^:::$/gm;
  let cursor = 0;
  let bibliographyCount = 0;

  for (const match of source.matchAll(definition)) {
    if (match.index > cursor) {
      blocks.push({
        type: 'markdown',
        source: source.slice(cursor, match.index),
      });
    }
    const [, type, id, body] = match;
    if (type === 'references') {
      if (++bibliographyCount > 1)
        throw new Error('Only one bibliography is allowed.');
      blocks.push({ type });
    } else {
      if (!id) throw new Error(`Missing ${type} ID.`);
      const key = `${type}:${id}`;
      if (targets.has(key))
        throw new Error(`Duplicate article reference: ${key}`);
      const label = `Figure ${targets.size + 1}`;
      const target = { type, id, label, anchor: `${type}-${id}` };
      targets.set(key, target);

      const media =
        /^(!?)\[([^\]]*)\]\(([^\s)]+)(?: "([1-9]\d*)x([1-9]\d*)")?\)\s*\n([\s\S]*)$/.exec(
          body
        );
      if (!media)
        throw new Error(
          `Figure ${id} must start with a Markdown image or link.`
        );
      const [, imageMarker, mediaLabel, url, width, height, caption] = media;
      blocks.push({
        ...target,
        ...(imageMarker
          ? {
              alt: mediaLabel,
              src: url,
              width: width ? Number(width) : undefined,
              height: height ? Number(height) : undefined,
            }
          : { href: url, linkLabel: mediaLabel }),
        caption: caption.trim(),
      });
    }
    cursor = match.index + match[0].length;
  }
  blocks.push({ type: 'markdown', source: source.slice(cursor) });
  if (
    blocks.some(
      (block) => block.type === 'markdown' && /^:::/m.test(block.source)
    )
  ) {
    throw new Error('Unclosed or invalid article block.');
  }

  const byId = new Map();
  for (const record of records) {
    if (byId.has(record.id))
      throw new Error(`Duplicate citation ID: ${record.id}`);
    byId.set(record.id, record);
  }
  const citationNumbers = new Map();
  for (const [, ids] of source.matchAll(/\[cite\]\(#cite:([a-z0-9,-]+)\)/g)) {
    for (const id of ids.split(',')) {
      if (!byId.has(id)) throw new Error(`Missing citation record: ${id}`);
      if (!citationNumbers.has(id))
        citationNumbers.set(id, citationNumbers.size + 1);
    }
  }
  for (const [, type, id] of source.matchAll(
    /\]\(#(figure):([a-z0-9-]+)(?::[A-Z])?\)/g
  )) {
    if (!targets.has(`${type}:${id}`))
      throw new Error(`Unknown ${type} reference: ${id}`);
  }
  if (citationNumbers.size && !bibliographyCount)
    throw new Error('Missing bibliography block.');

  const orderedRecords = [...citationNumbers.keys()].map((id) => byId.get(id));
  // Plain text output avoids injecting publisher-supplied markup into the page.
  const bibliography = orderedRecords.length
    ? new Cite(orderedRecords)
        .format('bibliography', {
          format: 'text',
          template: 'vancouver',
          lang: 'en-US',
          asEntryArray: true,
          nosort: true,
        })
        .map(([id, text]) => ({
          id,
          number: citationNumbers.get(id),
          text: text
            .replace(/^\d+\.\s*/, '')
            .replace(/\s+/g, ' ')
            .trim(),
          url: byId.get(id).DOI
            ? `https://doi.org/${byId.get(id).DOI}`
            : byId.get(id).URL,
        }))
    : [];

  return { blocks, targets, citationNumbers, bibliography };
}
