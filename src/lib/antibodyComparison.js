const ROOT = '/assets/posts/structure-based-antibody-renumbering/molstar';

function loaded(viewer) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      subscription.unsubscribe();
      reject(new Error('Loading the structures timed out. Please try again.'));
    }, 45000);
    const subscription = viewer.events.loadComplete.subscribe((success) => {
      clearTimeout(timer);
      subscription.unsubscribe();
      if (success) resolve();
      else
        reject(
          new Error('The structure data could not be loaded. Please try again.')
        );
    });
  });
}

// The camera framing is derived from the canvas shape, so both structures remain
// visible on small screens. The PDB assets have only rigid display transforms.
export function focusAntibodyComparison(viewer, container) {
  const canvas = viewer.plugin.canvas3d;
  const aspect = container.clientWidth / container.clientHeight;
  const height = Math.max(31, 73 / aspect);
  const distance = height / (2 * Math.tan(canvas.camera.state.fov / 2));
  canvas.requestCameraReset({
    snapshot: {
      mode: 'orthographic',
      target: [0, -1, 0],
      position: [0, -1, distance],
      up: [0, 1, 0],
      radius: 55,
      radiusMax: 100,
    },
    durationMs: 0,
  });
}

export async function buildAntibodyComparison(viewer, container) {
  const firstLoad = loaded(viewer);
  await viewer.render(container, {
    customData: { url: `${ROOT}/6ad0-L.pdb`, format: 'pdb', binary: false },
    hideControls: true,
    sequencePanel: false,
    pdbeLink: false,
    selectInteraction: false,
    bgColor: { r: 255, g: 255, b: 255 },
    hideCanvasControls: ['animation', 'controlInfo'],
    hideStructure: ['water', 'het'],
    visualStyle: 'cartoon',
  });
  await firstLoad;
  await viewer.load(
    { url: `${ROOT}/9zwe-O.pdb`, format: 'pdb', isBinary: false },
    false
  );
  const plugin = viewer.plugin;
  const structures = [
    ...plugin.managers.structure.hierarchy.current.structures,
  ];
  if (structures.length !== 2)
    throw new Error('Both structures are required for this comparison.');

  for (let index = 0; index < structures.length; index++) {
    const root = structures[index];
    const structureNumber = index + 1;
    const chain = index === 0 ? 'L' : 'O';
    const range = (start, end) => ({
      auth_asym_id: chain,
      start_auth_residue_number: start,
      end_auth_residue_number: end,
    });
    // Remove default representations so every visible component has an explicit role.
    const remove = plugin.build();
    for (const component of root.components)
      remove.delete(component.cell.transform.ref);
    await remove.commit();

    async function component(name, queries, options) {
      const bundle = viewer.getBundle(queries, structureNumber);
      if (!bundle) throw new Error(`The ${name} selection is empty.`);
      const part = await plugin.builders.structure.tryCreateComponent(
        root.cell,
        {
          type: { name: 'bundle', params: bundle },
          label: name,
          nullIfEmpty: true,
        },
        name
      );
      return plugin.builders.structure.representation.addRepresentation(
        part,
        options
      );
    }
    const cartoon = (color, alpha = 1) => ({
      type: 'cartoon',
      typeParams: { alpha, sizeFactor: 0.18, quality: 'high' },
      color: 'uniform',
      colorParams: { value: color },
    });
    await component(
      'Framework context',
      [{ auth_asym_id: chain }],
      cartoon(0xbababa, 0.2)
    );
    await component(
      'Disputed strand',
      [index === 0 ? range(16, 25) : range(17, 26)],
      cartoon(0x808080)
    );
    // CDR loop spans in the deposited light-chain numbering; displayed for context.
    await component(
      'CDR1',
      [index === 0 ? range(27, 38) : range(27, 33)],
      cartoon(0xdd7479, 0.7)
    );
    await component(
      'CDR2',
      [index === 0 ? range(56, 62) : range(51, 57)],
      cartoon(0x88d7ae, 0.6)
    );
    await component(
      'CDR3',
      [index === 0 ? range(94, 102) : range(89, 97)],
      cartoon(0xe6a25c, 0.6)
    );
    const selected = [
      index === 0 ? range(17, 24) : range(18, 25),
      range(index === 0 ? 93 : 88, index === 0 ? 93 : 88),
    ];
    await component('Highlighted residues and C104', selected, {
      type: 'ball-and-stick',
      typeParams: {
        sizeFactor: 0.16,
        sizeAspectRatio: 0.7,
        ignoreHydrogens: true,
        quality: 'high',
      },
      color: 'element-symbol',
      colorParams: {
        carbonColor: { name: 'uniform', params: { value: 0x707070 } },
      },
    });
    await viewer.visual.tooltips({
      structureNumber,
      data: [
        {
          ...selected[0],
          tooltip:
            index === 0
              ? 'Disputed strand: SAbR IMGT 18–25; ANARCI IMGT 17–24'
              : 'Reference strand: SAbR and ANARCI IMGT 18–25',
        },
        {
          ...selected[1],
          tooltip:
            'Conserved partner cysteine: IMGT C104 (original PDB numbering retained)',
        },
      ],
    });
    await plugin.managers.structure.measurement.addLabel(
      viewer.getLociForParams(
        [{ ...selected[1], atoms: ['SG'] }],
        structureNumber
      ),
      {
        labelParams: {
          customText: 'C104',
          textColor: 0x222222,
          textSize: 1.5,
          offsetX: 1.6,
          offsetY: -0.8,
          offsetZ: 2,
          borderColor: 0xffffff,
          borderWidth: 0.2,
        },
        visualParams: { scaleByRadius: false },
      }
    );
  }
  plugin.canvas3d.setProps({
    camera: { mode: 'orthographic' },
    renderer: { backgroundColor: 0xffffff },
    marking: { enabled: true },
  });
  focusAntibodyComparison(viewer, container);
}
