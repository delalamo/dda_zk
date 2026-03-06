import React, { useRef } from 'react';
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

const footnotesConfig = [
    { id: 'fn1', doi: '10.64898/2026.02.05.703733' },  // Zhang et al 2026
];

export const post = {
  id: '2026-03-06-abag-data',
  title: 'Antibody-antigen modeling by diffusion-based structure prediction is data-limited',
  date: '2026-03-06',
  category: 'Bio/ML',
  excerpt: 'Antibody-antigen complex prediction by diffusion-based structure prediction methods is data-limited, unlike other poor-performing tasks such as small molecule docking.',
  content: (() => {
    const ContentComponent = () => {
      const contentRef = useRef(null);
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          <p><strong>Antibody-antigen complex prediction by diffusion-based structure prediction methods is data-limited</strong><sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>. This is not true of other poor-performing tasks, such as small molecule docking. This was observed using a version of Protenix trained on four additional years of public data.</p>

          <img src="/assets/post_images/2026_03_06/2026_03_06_abag_A.png" alt="Figure from Zhang et al 2026" width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Zhang et al 2026<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>, with relevant section highlighted by red box; DQ SR % means percentage with DockQ ≥ 0.23.</p>

          <FootnoteList
            citationsData={citationsData}
            idToNumberMap={idToNumberMap}
            isLoading={isLoading}
            error={error}
          />
        </div>
      );
    };
    return <ContentComponent />;
  })(),
};
