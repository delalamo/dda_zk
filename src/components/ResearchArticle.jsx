import PostMarkdown from './PostMarkdown';

export default function ResearchArticle({ article, figures = {} }) {
  const components = {
    a({ href, children }) {
      if (href?.startsWith('#cite:')) {
        const ids = href.slice(6).split(',');
        return (
          <span className="article-citation">
            [
            {ids.map((id, index) => (
              <span key={id}>
                {index > 0 && ', '}
                <a
                  href={`#reference-${id}`}
                  aria-label={`Reference ${article.citationNumbers.get(id)}`}
                >
                  {article.citationNumbers.get(id)}
                </a>
              </span>
            ))}
            ]
          </span>
        );
      }
      const match = /^#(figure):([a-z0-9-]+)(?::([A-Z]))?$/.exec(href || '');
      if (match) {
        const target = article.targets.get(`${match[1]}:${match[2]}`);
        return (
          <a href={`#${target.anchor}`}>
            {target.label}
            {match[3]}
          </a>
        );
      }
      return <a href={href}>{children}</a>;
    },
  };
  const markdown = (source) => (
    <PostMarkdown components={components}>{source}</PostMarkdown>
  );

  return (
    <div className="research-article">
      {article.blocks.map((block, index) => {
        if (block.type === 'markdown')
          return <div key={index}>{markdown(block.source)}</div>;
        if (block.type === 'references') {
          return (
            <section
              key="references"
              className="article-references"
              aria-labelledby="references-heading"
            >
              <h2 id="references-heading">References</h2>
              <ol>
                {article.bibliography.map((entry) => (
                  <li
                    key={entry.id}
                    id={`reference-${entry.id}`}
                    value={entry.number}
                  >
                    {entry.url && entry.text.includes(entry.url) ? (
                      <>
                        {entry.text.split(entry.url)[0]}
                        <a href={entry.url}>{entry.url}</a>
                        {entry.text.split(entry.url).slice(1).join(entry.url)}
                      </>
                    ) : (
                      <>
                        {entry.text}
                        {entry.url && (
                          <>
                            {' '}
                            <a href={entry.url}>Source</a>
                          </>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          );
        }
        const FigureContent = figures[block.id];
        return (
          <figure
            key={block.anchor}
            id={block.anchor}
            className={`article-${block.type}${FigureContent ? ' article-interactive-figure' : ''}`}
            aria-labelledby={`${block.anchor}-caption`}
          >
            {FigureContent ? (
              <FigureContent />
            ) : (
              <a
                href={block.src || block.href}
                target="_blank"
                rel="noreferrer"
                aria-label={
                  block.src ? `Open ${block.label} at full size` : undefined
                }
              >
                {block.src ? (
                  <img
                    src={block.src}
                    alt={block.alt}
                    width={block.width}
                    height={block.height}
                    loading="lazy"
                  />
                ) : (
                  block.linkLabel
                )}
              </a>
            )}
            <figcaption id={`${block.anchor}-caption`}>
              <strong>{block.label}.</strong> {markdown(block.caption)}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
