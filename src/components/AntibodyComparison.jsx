import { useEffect, useRef, useState } from 'react';
import {
  buildAntibodyComparison,
  focusAntibodyComparison,
} from '../lib/antibodyComparison';

const assetRoot = '/assets/posts/structure-based-antibody-renumbering';
const examples = [
  {
    name: 'Query · 6AD0 L',
    resolution: '3.90 Å',
    sequence: 'HQASISCR',
    sabr: [18, 19, 20, 21, 22, 23, 24, 25],
    anarci: [17, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    name: 'Reference · 9ZWE O',
    resolution: '2.75 Å',
    sequence: 'QASISCRS',
    sabr: [18, 19, 20, 21, 22, 23, 24, 25],
    anarci: [18, 19, 20, 21, 22, 23, 24, 25],
  },
];

export default function AntibodyComparison() {
  const container = useRef(null);
  const viewer = useRef(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let complete = false;
    let instance;
    setStatus('loading');
    setError('');
    const initialize = async () => {
      if (!window.PDBeMolstarPlugin)
        throw new Error(
          'The 3D viewer could not load. Please check your connection and reload the page.'
        );
      instance = new window.PDBeMolstarPlugin();
      await buildAntibodyComparison(instance, container.current);
      if (active) {
        viewer.current = instance;
        setStatus('ready');
      }
    };
    initialize()
      .catch((reason) => {
        if (active) {
          setStatus('error');
          setError(reason.message);
        }
      })
      .finally(() => {
        complete = true;
        if (!active) instance?.plugin?.dispose();
      });
    return () => {
      active = false;
      viewer.current = null;
      if (complete) instance?.plugin?.dispose();
    };
  }, [attempt]);

  return (
    <>
      <div className="comparison-headings">
        {examples.map((e) => (
          <div key={e.name}>
            <strong>{e.name}</strong>
            <span>{e.resolution} resolution</span>
          </div>
        ))}
      </div>
      <div className="comparison-stage">
        <div
          ref={container}
          className="comparison-canvas"
          aria-label="Mol* viewer containing both antibody structures"
        />
        {status === 'loading' && (
          <div className="comparison-status" role="status">
            Loading both structures…
          </div>
        )}
        {status === 'error' && (
          <div className="comparison-status" role="alert">
            <p>{error}</p>
            <button onClick={() => setAttempt((a) => a + 1)}>Try again</button>
            <a href={`${assetRoot}/register-errors.png`}>
              View the source figure
            </a>
          </div>
        )}
      </div>
      <div className="comparison-controls">
        <span>Drag to rotate · Scroll to zoom · Right-drag to pan</span>
        <button
          disabled={status !== 'ready'}
          onClick={() =>
            focusAntibodyComparison(viewer.current, container.current)
          }
        >
          Reset focus
        </button>
        <a
          className="comparison-download"
          href={`${assetRoot}/molstar/sabr-figure-s4-comparison.molx`}
          download
        >
          Download Mol* session
        </a>
      </div>
      <div className="comparison-numbering">
        {examples.map((e) => (
          <table
            key={e.name}
            aria-label={`${e.name} IMGT numbering from the source figure`}
          >
            <caption>{e.name}</caption>
            <thead>
              <tr>
                <th scope="col">Residue</th>
                {[...e.sequence].map((letter, i) => (
                  <th
                    scope="col"
                    key={i}
                    className={letter === 'C' ? 'cysteine' : ''}
                  >
                    {letter}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['sabr', 'anarci'].map((method) => (
                <tr key={method}>
                  <th scope="row">{method === 'sabr' ? 'SAbR' : 'ANARCI'}</th>
                  {e[method].map((number, i) => (
                    <td
                      key={i}
                      className={e.sequence[i] === 'C' ? 'cysteine' : ''}
                    >
                      {number}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </>
  );
}
