"""Prepare the Figure S4 comparison. Usage: python script.py 6ad0.cif 9zwe.cif.

Requires NumPy. Input: unmodified RCSB mmCIF files. Output: variable domains
with original author residue IDs; coordinates change only by rigid transforms.
The query's 17–24 backbone is fitted to reference 18–25, following the figure's
SAbR correspondence, not a sequence alignment. No residues are remodelled.
"""
import json
import sys
from pathlib import Path
import numpy as np

OUT = Path(__file__).resolve().parents[1] / 'public/assets/posts/structure-based-antibody-renumbering/molstar'

def read_atoms(path, chain, max_seq):
    atoms = []
    columns = []
    for line in Path(path).read_text().splitlines():
        if line.startswith('_atom_site.'):
            columns.append(line.split()[0].split('.')[1])
        elif line.startswith(('ATOM ', 'HETATM ')):
            row = dict(zip(columns, line.split(), strict=True))
            if row['auth_asym_id'] == chain and row['group_PDB'] == 'ATOM' and row['pdbx_PDB_model_num'] == '1' and row['label_alt_id'] in ('.', 'A') and int(row['label_seq_id']) <= max_seq:
                atoms.append(row)
    return atoms

def coord(a):
    return np.array([float(a[f'Cartn_{d}']) for d in 'xyz'])

def atom(atoms, res, name='CA'):
    return coord(next(a for a in atoms if int(a['auth_seq_id']) == res and a['label_atom_id'] == name and a['pdbx_PDB_ins_code'] in ('.', '?')))

q = read_atoms(sys.argv[1], 'L', 113)
r = read_atoms(sys.argv[2], 'O', 112)
qfit = np.array([atom(q,i,n) for i in range(17,25) for n in ('N','CA','C')])
rfit = np.array([atom(r,i,n) for i in range(18,26) for n in ('N','CA','C')])
u,s,v = np.linalg.svd((qfit-qfit.mean(0)).T @ (rfit-rfit.mean(0)))
rotation = u @ np.diag([1,1,np.linalg.det(u@v)]) @ v
rmsd = np.sqrt(np.mean(np.sum(((qfit-qfit.mean(0))@rotation-(rfit-rfit.mean(0)))**2,axis=1)))
x = atom(r,25)-atom(r,18); x /= np.linalg.norm(x)
y = atom(r,23)-atom(r,88); y -= x*np.dot(x,y); y /= np.linalg.norm(y)
z = np.cross(x,y)
tilt = np.deg2rad(45)
frame = np.array([x,y,z]).T @ np.array([[1,0,0],[0,np.cos(tilt),np.sin(tilt)],[0,-np.sin(tilt),np.cos(tilt)]])
center = rfit.mean(0)

for atoms, pdb, chain, offset in ((q,'6ad0','L',-20),(r,'9zwe','O',20)):
    lines = [f'HEADER    SABR FIGURE S4 COMPARISON                 {pdb.upper()}', 'REMARK 900 SOURCE https://files.rcsb.org/download/'+pdb.upper()+'.cif', 'REMARK 900 AUTHOR RESIDUE NUMBERS PRESERVED. RIGID DISPLAY TRANSFORM ONLY.']
    for i,a in enumerate(atoms,1):
        p = coord(a)
        if pdb == '6ad0': p = (p-qfit.mean(0)) @ rotation + rfit.mean(0)
        p = (p-center) @ frame + [offset,0,0]
        name = a['auth_atom_id']; atom_name = f' {name:<3}' if len(name)<4 else name
        ins = a['pdbx_PDB_ins_code']; ins = ' ' if ins in ('.','?') else ins
        lines.append(f"ATOM  {i:5d} {atom_name} {a['auth_comp_id']:>3} {chain}{int(a['auth_seq_id']):4d}{ins}   {p[0]:8.3f}{p[1]:8.3f}{p[2]:8.3f}{float(a['occupancy']):6.2f}{float(a['B_iso_or_equiv']):6.2f}          {a['type_symbol']:>2}  ")
    lines += ['TER', 'END']
    (OUT/f'{pdb}-{chain}.pdb').write_text('\n'.join(lines)+'\n')
    print(pdb,chain,len(atoms),'atoms')
(OUT/'provenance.json').write_text(json.dumps({'sourceFigure':'SAbR manuscript, supplementary figure S4, second example','query':{'pdb':'6AD0','authChain':'L','residueRange':[17,24],'partnerCysteine':93},'reference':{'pdb':'9ZWE','authChain':'O','figureChainLabel':'Q','residueRange':[18,25],'partnerCysteine':88,'note':'The source figure labels the reference Q. Deposited protein chain O has the matching light-chain sequence; the deposited entry has no protein auth chain Q.'},'alignment':{'atoms':['N','CA','C'],'queryResidues':[17,24],'referenceResidues':[18,25],'rmsdAngstrom':round(float(rmsd),5),'method':'proper Kabsch rigid fit; no internal coordinate edits'},'numbering':'PDB author residue numbers retained. SAbR/ANARCI IMGT comparison shown separately, transcribed from source figure.'},indent=2)+'\n')
print('Local backbone fit RMSD:',rmsd)
