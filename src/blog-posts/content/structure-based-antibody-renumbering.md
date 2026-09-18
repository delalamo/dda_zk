Something kind of striking about the field of antibody bioinformatics, and particularly the subfield focused on de novo antibody design, is the almost universal reliance on one specific tool, ANARCI, for CDR annotations [cite](#cite:dunbar-anarci,dunbar-sabdab). To back up: antibody de novo design usually only focuses on designing a small part of the structure, the complementarity-determining regions, or CDRs for short; everything else is fixed [cite](#cite:bennett-rfantibody,chai-discovery-chai2,nabla-jam2,latent-labs-latentx2,luo-diffab,mille-fragoso-germinal). Because the training set is too large to define these by hand, practitioners use so-called renumbering algorithms to assign these and other regions, leaving the rest of the antibody fixed [cite](#cite:dunbar-sabdab). What I found surprising, as a recent entrant to the field, is that these annotation tools operate entirely in sequence space, with ANARCI being the most popular by far [cite](#cite:dunbar-anarci). There just didn't seem to be any kind of algorithm for taking antibody structures and defining CDRs and other regions from that 3D info directly.

This gap bothered me so much that, when I was between jobs late last year, I went ahead and put together SAbR, or Structure-based Antibody Renumbering. SAbR builds on SoftAlign, a structure alignment method released last spring, which aligns ProteinMPNN embeddings with algorithms closely matching those used for sequences [cite](#cite:trinquier-softalign,dauparas-proteinmpnn). I introduced three adaptations to this method to permit renumbering of antibodies with high fidelity. First, SAbR aligns to reference embeddings from hundreds of thousands of renumbered reference structures; second, it fine-tunes the SoftAlign weights to fix a small bug; and third, it post-processes the annotations using code from the open-source sequence renumbering method ANARCI. The method still has shortcomings: it fails with structures that are missing residues, for example, and makes more mistakes on single-chain Fvs.

:::figure overview
![SAbR renumbers antibody structures by comparing their per-residue ProteinMPNN embeddings to average embeddings calculated from thousands of reference models.](/assets/posts/structure-based-antibody-renumbering/overview.png "1650x734")

SAbR renumbers antibody structures by comparing their per-residue ProteinMPNN embeddings to average embeddings calculated from thousands of reference models.
:::

The hope is that design pipelines can now determine where these regions are in designs using actual geometry, rather than sequences. The bigger value-add is how it might allow the training data to be better defined and cleaned up. One thing I found while developing this method was that it disagreed occasionally with sequence-based tools; in a few cases, the disagreements were localized to places flagged by a previous study as being possibly misassigned [cite](#cite:rodriguez-register-errors):

:::figure register-comparison
![Interactive comparison of antibody structures 6AD0 chain L and 9ZWE chain O, focused on the disputed strand and nearby conserved cysteine.](/assets/posts/structure-based-antibody-renumbering/register-errors.png)

The disputed strand and the nearby conserved cysteine (IMGT C104) are shown as sticks; the surrounding framework is faded. Loop colors follow the source figure. The rows show its SAbR and ANARCI IMGT assignments; hovering over the structures shows the deposited residue numbers. [Source figure and discussion](/posts/structure-based-antibody-renumbering/report#figure-register-errors).

Structure sources: [6AD0](https://www.rcsb.org/structure/6AD0), Zhu et al. [cite](#cite:zhu-6ad0); [9ZWE](https://www.rcsb.org/structure/9ZWE), Sponholtz et al. [cite](#cite:sponholtz-9zwe).

:::

The full report can be found [here](/assets/posts/structure-based-antibody-renumbering/SAbR_manuscript.pdf) and code can be found [here](https://github.com/delalamo/SAbR).

:::references
:::
