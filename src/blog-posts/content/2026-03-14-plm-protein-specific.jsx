import React, { useRef } from 'react';
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

const footnotesConfig = [
    { id: 'fn1', doi: '10.1101/2024.03.15.585128' },  // Gelman et al 2024
];

export const post = {
  id: '2026-03-14-plm-protein-specific',
  title: 'Protein language models make better predictions when trained on individual proteins or protein families',
  date: '2026-03-14',
  category: 'Bio/ML',
  content: (() => {
    const ContentComponent = () => {
      const contentRef = useRef(null);
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          <p><strong>Protein language models make better predictions when trained on individual proteins or protein families</strong><sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>. Below, METL-L is trained on individual proteins and METL-G is trained on global sequence data.</p>

          <img src="/assets/post_images/2026_03_14/2026_03_14_A.png" alt="Figure from Gelman et al 2024" width="500" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Gelman et al 2024<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>.</p>

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
