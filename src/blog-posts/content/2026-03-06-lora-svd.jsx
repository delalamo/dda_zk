import React, { useRef } from 'react';
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

const footnotesConfig = [
    { id: 'fn1', doi: '10.48550/arXiv.2405.17604' },  // Balazy et al 2024
    { id: 'fn2', doi: '10.48550/arXiv.2602.04118' },  // Morris et al 2026
];

export const post = {
  id: '2026-03-06-lora-svd',
  title: 'Low-rank adaptation with even fewer parameters can operate on truncated SVD matrices, but only with reinforcement learning',
  date: '2026-03-06',
  category: 'ML',
  content: (() => {
    const ContentComponent = () => {
      const contentRef = useRef(null);
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          <p><strong>Low-rank adaptation can work with even fewer parameters than traditional LoRA, by tuning a truncated SVD matrix rather than using pairs of low-rank matrices </strong><sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>. 
          
          <img src="/assets/post_images/2026_03_06/2026_03_06_lora_A.png" alt="Figure from Balazy et al 2024" width="400" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Bałazy et al 2024<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup></p>
          
          Interestingly, a recent paper shows that this method does not appear to be trainable using standard supervised fine-tuning, and instead requires reinforcement learning <sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>. 

          <img src="/assets/post_images/2026_03_06/2026_03_06_lora_C.png" alt="Figure from Morris et al 2026" width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Morris et al 2026<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>; SFT = supervised fine-tuning; GRPO = Group Relative Policy Optimization, a type of Reinforcement Learning</p>
          
          
          Additionally, initialization of the adaptor matrices with values from SVD matrices outperforms those of random matrices.</p>

          <img src="/assets/post_images/2026_03_06/2026_03_06_lora_B.png" alt="Figure from Balazy et al 2024" width="400" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Figure from Bałazy et al 2024<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup></p>


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
