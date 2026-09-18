/* eslint-disable react-refresh/only-export-components -- Post modules export metadata and content together. */
import ResearchArticle from '../../components/ResearchArticle';
import AntibodyComparison from '../../components/AntibodyComparison';
import { prepareArticle } from '../../lib/articleReferences';
import draft from './structure-based-antibody-renumbering.md?raw';
import manuscript from './structure-based-antibody-renumbering-report.md?raw';
import references from '../references/structure-based-antibody-renumbering.json';
import postReferences from '../references/structure-based-antibody-renumbering-post.json';

const article = prepareArticle(manuscript, references);
const blogArticle = prepareArticle(draft, [...references, ...postReferences]);

function StructureBasedAntibodyRenumbering() {
  return (
    <ResearchArticle
      article={blogArticle}
      figures={{ 'register-comparison': AntibodyComparison }}
    />
  );
}

export const post = {
  id: 'structure-based-antibody-renumbering',
  title: 'Structure-based Antibody Renumbering',
  date: '2026-09-18',
  content: <StructureBasedAntibodyRenumbering />,
  reportContent: (
    <>
      <p>
        <a href="/assets/posts/structure-based-antibody-renumbering/SAbR_manuscript.pdf">
          Read the original full manuscript (PDF)
        </a>
      </p>
      <ResearchArticle article={article} />
    </>
  ),
};
