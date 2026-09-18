# delalamo.xyz

Personal website built with React and Vite.

```sh
npm install
npm run dev
npm run build
```

## Posts

Posts appear at `/posts`. Each `src/blog-posts/content/*.jsx` file exports a
`post` with an `id`, `title`, `date` (`YYYY-MM-DD`), and React `content`.
The SAbR post's prose is in `structure-based-antibody-renumbering.md`; its adjacent
`.jsx` file connects the Markdown, citations, and interactive figure.

Use ordinary Markdown for prose and tables. Keep calculations and interactive
charts in React components and pass them to `ResearchArticle` through its
`figures` map. The SAbR component shows how to do this with the Mol* viewer.

## Figures and citations

`prepareArticle` assigns figure numbers by block order and citation numbers by
first use. Refer to figures and papers using stable IDs:

```markdown
See [figure](#figure:overview). A claim [cite](#cite:dunbar-anarci).

:::figure overview
![Description](/assets/posts/example/overview.png "1650x734")

Caption without a figure number.
:::

:::references
:::
```

A figure can start with a regular Markdown link instead of an image, as a
fallback for an interactive component. Numbers and captions remain automatic.

The 13 cited papers are stored as CSL-JSON in
`src/blog-posts/references/structure-based-antibody-renumbering.json`.
Citation.js generates the bibliography locally. To add a paper, add its metadata
with a unique `id`, then use `[cite](#cite:id)`; comma-separated IDs group citations.
Metadata came from DOI/Crossref, arXiv, and the original JAM-2 technical report.

## SAbR assets

`public/assets/posts/structure-based-antibody-renumbering/` contains Figure 1,
the original long `SAbR_manuscript.pdf`, and the Mol* assets. The full report and
source-figure links open this PDF.

`src/lib/antibodyComparison.js` defines the single-canvas comparison of 6AD0 L
and 9ZWE O, including colors, selections, and camera focus. The PDB files retain
author residue numbers; coordinates were positioned with rigid transforms only.
The comparison rows reproduce the source figure's SAbR/ANARCI IMGT assignments.
The `.molx` download embeds both structures; open it with Mol*'s **Open Files**.

Run the citation and figure checks with:

```sh
node --test tests/articleReferences.test.js
```
