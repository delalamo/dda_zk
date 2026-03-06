import React, { useRef } from 'react';
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

const footnotesConfig = [
    { id: 'fn1', doi: '10.48550/arXiv.2602.05285' },  // Li et al 2026
    { id: 'fn2', doi: '10.48550/arXiv.2602.24007' },  // Maddipatla et al 2026
    { id: 'fn3', doi: '10.48550/arXiv.2209.14687' },  // DPS
    { id: 'fn4', doi: '10.48550/arXiv.2506.04490' }
];


export const post = {
  id: '2026-03-06-diff-steering',
  title: 'Diffusion-based structure prediction can be steered by modifying the conditioning embeddings rather than the latent space, and such embeddings can be used for subsequent iterations',
  date: '2026-03-06',
  category: 'Bio/ML',
  content: (() => {
    const ContentComponent = () => {
      const contentRef = useRef(null);
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          <p><strong>Diffusion-based structure prediction can be steered into specific conformations by modifying conditioning embeddings rather than the latent-space embeddings used for diffusion</strong><sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup><sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>.
          
          <img src="/assets/post_images/2026_03_06/2026_03_06_steer_A.png" alt="Figure from Maddipatla et al 2026" width="500" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Maddipatla et al 2026<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup></p>

          The modified conditioning representations have the added advantage of being reusable, and therefore facilitating improvements across multiple runs, as opposed to traditional diffusion posterior sampling which only operates within independent diffusion trajectory<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup><sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>]</sup>.
          
          <img src="/assets/post_images/2026_03_06/2026_03_06_steer_B.png" alt="Figure from Maddipatla et al 2026" width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Maddipatla et al 2026<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup></p>
          
          Yet even without such multi-trajectory improvements, the approach was shown to slightly outperform standard Diffusion Posterior Sampling.</p>
          <img src="/assets/post_images/2026_03_06/2026_03_06_steer_C.png" alt="Figure from Li et al 2026" width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Li et al 2026<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup></p>

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
