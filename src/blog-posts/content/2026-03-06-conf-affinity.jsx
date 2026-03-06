import React, { useRef } from 'react';
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

const footnotesConfig = [
    { id: 'fn1', doi: '10.1101/2024.06.20.599739' },  // Li et al 2024b
    { id: 'fn2', doi: '10.64898/2026.03.03.709355' },  // Kosonocky et al 2026
    { id: 'fn3', doi: '10.48550/arXiv.2602.24007' },  // Maddipatla et al 2026
];

export const post = {
  id: '2026-03-06-conf-affinity',
  title: 'Protein structure prediction and design confidence metrics do not correlate with binding affinity',
  date: '2026-03-06',
  category: 'Bio/ML',
  content: (() => {
    const ContentComponent = () => {
      const contentRef = useRef(null);
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          <p><strong>Confidence metrics from structural modeling and design neural networks, namely pLDDT, ipTM, Rosetta scores, ProteinMPNN likelihoods, and ESM-2 log-likelihoods, do not correlate with binding for <em>de novo</em> binders</strong><sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup><sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>. For pLDDT this is also broadly true of protein stability. This may be due to the brittleness of the metrics with respect to sequence and MSA inputs, which was shown by Maddipatla et al 2026<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup> with ipTM.</p>

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
