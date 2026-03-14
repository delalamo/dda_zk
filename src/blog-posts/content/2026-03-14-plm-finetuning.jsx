import React, { useRef } from 'react';
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

const footnotesConfig = [
    { id: 'fn1', doi: '10.1038/s41587-022-01618-2' },   // Madani et al 2023
    { id: 'fn2', doi: '10.1101/2024.05.03.592223' },    // Munsamy et al 2024
    { id: 'fn3', doi: '10.64898/2026.03.06.710001' },   // Bixby et al 2026
    { id: 'fn4', doi: '10.1126/science.ads0018' },      // Hayes et al 2025
    { id: 'fn5', doi: '10.48550/arXiv.2306.00872' },    // Fannjiang & Listgarten 2023
    { id: 'fn6', doi: '10.1038/s41592-021-01100-y' },   // Biswas et al 2021
];

export const post = {
  id: '2026-03-14-plm-finetuning',
  title: 'Base PLMs must usually be fine-tuned to generate functionally active sequences',
  date: '2026-03-14',
  category: 'Bio/ML',
  content: (() => {
    const ContentComponent = () => {
      const contentRef = useRef(null);
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          <p><strong>Base protein language models must usually be fine-tuned to generate functionally active sequences</strong><sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>,<a href="#fn2" id="fnref2"></a>]</sup>. Bixby et al showed that, in a head-to-head between an unspecified foundation model and its "evo-tuned"<sup className="footnote-ref">[<a href="#fn6" id="fnref6"></a>]</sup> derivative, the latter was better at variant effect prediction<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup>. Note that this is not true of models where functional annotations can be provided, such as ZymCTRL<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup> and ESM3<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>]</sup>. Pan-protein data has also been shown to be unnecessary for generating novel sequences<sup className="footnote-ref">[<a href="#fn5" id="fnref5"></a>]</sup>.</p>

          <img src="/assets/post_images/2026_03_14/2026_03_14_A.png" alt="Figure from Munsamy et al 2024" width="500" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Munsamy et al 2024<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>.</p>

          <img src="/assets/post_images/2026_03_14/2026_03_14_B.png" alt="Figure from Bixby et al 2026" width="500" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Bixby et al 2026<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup>.</p>

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
