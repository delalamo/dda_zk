# delalamo.xyz

Personal website built with React and Vite.

```sh
npm install
npm run dev
npm run build
```

## Writing posts

Posts appear at `/posts`, newest first, with permanent URLs at `/posts/<id>`.
The home page remains the CV.

Edit the first post's prose in
`src/blog-posts/content/structure-based-antibody-renumbering.md`. Use normal
Markdown for headings, links, images, lists, code blocks, and tables. The adjacent
`.jsx` file holds its title, publication date, URL ID, and content component.

The short SAbR post uses named `:::figure` blocks for the overview image and
interactive comparison. Both captions and all citations are editable in Markdown;
the `.jsx` file maps `register-comparison` to the Mol* component. The preserved manuscript is in
`src/blog-posts/content/structure-based-antibody-renumbering-report.md`, available
at `/posts/structure-based-antibody-renumbering/report`. Its managed references,
figures, and Markdown tables are unchanged.
The post's “full report” link opens the original long `SAbR_manuscript.pdf`,
stored in `public/assets/posts/structure-based-antibody-renumbering/`. The web
report also links to this PDF. This is the full manuscript, not the MoML version.

### SAbR structure comparison

`AntibodyComparison.jsx` embeds a single Mol* canvas with 6AD0 L and 9ZWE O.
`src/lib/antibodyComparison.js` defines the selections, colors, labels, and camera.
The source figure labels the reference Q; the deposited entry has no protein
chain Q, so chain O (with the matching sequence) is used and explicitly noted.
Both structures retain deposited author residue numbers. The IMGT numbering
rows are transcribed from the figure, rather than inferred from PDB numbering.

The assets and portable session are in
`public/assets/posts/structure-based-antibody-renumbering/molstar/`. The `.molx`
file includes both coordinate files and the initial scene, and was checked by
reopening it in Mol*. Load it via **Open Files** in the Mol* viewer. The page's
download link works independently of WebGL. To save a changed camera or styling,
use Mol*'s **Screenshot / State Snapshot** menu or **State** controls.

To regenerate the rigidly positioned PDB assets, download the unmodified RCSB
mmCIF files and run `scripts/prepare-antibody-comparison.py 6ad0.cif 9zwe.cif`
with Python and NumPy. The script preserves atom identities, residue numbering,
and internal geometry; it uses a local backbone fit based on the figure's SAbR
correspondence. `provenance.json` records the mapping and fit. After changing
the assets or scene, re-export the `.molx` from Mol* so the download matches.

To add another post:

1. Copy that pair of files with a new filename.
2. Update the Markdown import in the `.jsx` file.
3. Set a unique `id`, a `title`, and a fixed `date` in `YYYY-MM-DD` format.
   Optionally add an `excerpt` and `category` to the exported `post` object.
4. Write the Markdown. The list discovers `.jsx` files automatically.

Keep IDs stable so existing links continue to work. Every discovered post is
public when deployed; keep unfinished work outside `content` until ready.

## Calculations and interactive charts

Use Markdown for prose and React for executable content. Markdown code blocks
are displayed as text; they do not execute. In a post's component, run JavaScript
calculations, interpolate results into Markdown, and insert React components
between prose sections. React state and the installed D3 library are available
for interactive visualizations. Split long prose into multiple `.md` files and
import each with `?raw` as needed.

This complete example demonstrates a calculated value and an interactive SVG
chart. To try it, save it as `src/blog-posts/content/chart-demo.jsx` (doing so
adds it to the public list):

```jsx
import { useState } from 'react';
import PostMarkdown from '../../components/PostMarkdown';

function ChartDemo() {
  const [scale, setScale] = useState(2);
  const values = [1, 2, 3, 4].map((value) => value * scale);
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <>
      <PostMarkdown>{`## Illustrative data\n\nCalculated total: **${total}**.`}</PostMarkdown>
      <label>
        Scale: {scale}
        <input
          type="range"
          min="1"
          max="5"
          value={scale}
          onChange={(event) => setScale(Number(event.target.value))}
        />
      </label>
      <svg viewBox="0 0 320 220" role="img" aria-label={`Scaled values: ${values.join(', ')}`}>
        {values.map((value, index) => (
          <g key={index}>
            <rect
              x={index * 80 + 10}
              y={200 - value * 9}
              width="50"
              height={value * 9}
              fill="var(--color-accent)"
            />
            <text x={index * 80 + 35} y="218" textAnchor="middle" fill="currentColor">
              {value}
            </text>
          </g>
        ))}
      </svg>
    </>
  );
}

export const post = {
  id: 'chart-demo',
  title: 'Interactive chart example',
  date: '2026-09-18',
  content: <ChartDemo />,
};
```

Calculations run in the visitor's browser. Keep secret keys and expensive
processing out of post components; precompute large datasets and load the results.

## Manuscript authoring: figures, tables, citations, and math

The SAbR post and full report use `ResearchArticle`, which adds named blocks and references to
Markdown. Its `.jsx` entry calls `prepareArticle(markdown, references)` once, then
passes the result to the renderer. The original manuscript's main text,
acknowledgments, disclosures, and supplementary material are all included.

### Figures and tables

Use descriptive IDs, never numeric labels. A figure consists of an image followed
by a Markdown caption:

```markdown
See [figure](#figure:overview), or [figure](#figure:template-ensembles:A).

:::figure overview
![Description of the image](/assets/posts/example/overview.png)

Caption text, without a figure number.
:::
```

The renderer generates “Figure 1”, its caption label, and its clickable link.
Move the entire block to change its number; references keep pointing to the same
ID. Panel suffixes such as `:A` are preserved. Add `supplementary` after the ID to
use a separate S1, S2, … sequence. Figure images open at full size when clicked. An optional image title such as
`![Alt](/image.png "1650x734")` supplies pixel dimensions to reserve space while
images load, keeping links to distant figures stable.

Tables work the same way, using editable GitHub-style Markdown:

```markdown
See [table](#table:performance).

:::table performance
Caption text, without a table number.

| Method | Accuracy |
| --- | ---: |
| Example | 95.0% |
:::
```

Figures and tables have independent counters. IDs must be unique within their
kind. Unknown references and duplicate IDs raise an error rather than silently
showing an incorrect number. Wide tables scroll horizontally, including with the
keyboard when focused.

### Citations

Structured CSL-JSON records live in
`src/blog-posts/references/structure-based-antibody-renumbering.json`. The 41 records
were retrieved using the manuscript's DOIs on September 18, 2026 through DOI content
negotiation and Crossref. Journal issue dates are preferred when supplied. A few
incomplete registry fields (authors, article numbers, chapter information, and
malformed titles) were corrected against the manuscript. The bibliography is
formatted by the installed Citation.js CSL plugin in Vancouver style; it is not
copied from the PDF. All records are stored locally, so reading the article does
not require citation API requests.

The short post shares those records and adds seven in
`src/blog-posts/references/structure-based-antibody-renumbering-post.json`.
The added DOI records were retrieved on September 18, 2026 from publisher/Crossref
and arXiv metadata and normalized to CSL-JSON. JAM-2 uses metadata from Nabla Bio's
original technical report. Chai-2 and Latent-X2 are marked as preprints.
The Mol* caption cites the original 6AD0 and 9ZWE papers and links their PDB entries.
The 9ZWE paper's title matches the deposition's primary citation; its published
Cell Reports metadata supplies the DOI and complete author list even though the
PDB citation still says “To be published.”

```markdown
A claim [cite](#cite:dunbar-anarci).
Another claim [cite](#cite:dunbar-anarci,greenshields-anarcii).

:::references
:::
```

Add a CSL-JSON record with a unique descriptive `id` to cite a new work. Include
`type`, `title`, `author`, `issued`, and publication details plus `DOI` or `URL`.
A reference manager that exports CSL-JSON can provide these records. Numbers are
assigned by first appearance; repeated citations share a number. The bibliography
includes only cited records, in the same order. To change bibliography style,
change the Citation.js `template` option in `src/lib/articleReferences.js`.

### Equations and future interactive content

Use a fenced block with language `math` for display equations in LaTeX. The
existing MathJax integration renders them. Keep calculations and interactive
components in React, as shown above. The Markdown and structured reference data
remain separate from executable code, so static figures can later be replaced by
React charts without rewriting the prose or changing their reference IDs.

Run reference-integrity and renumbering checks with:

```sh
node --test tests/articleReferences.test.js
```

To replace a static figure later, pass a React component keyed by its existing ID:

```jsx
<ResearchArticle article={article} figures={{ 'designed-cdrs': MyInteractiveChart }} />
```

Its caption, number, and incoming links remain managed automatically.
