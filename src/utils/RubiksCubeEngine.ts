/**
 * RubiksCubeEngine.ts
 * Pure TypeScript Rubik's Cube state machine.
 * 27 cubies, each with a world-position and an orientation matrix.
 * Moves: U U' D D' L L' R R' F F' B B'
 */

export type Vec3 = [number, number, number];
export type Mat3 = [Vec3, Vec3, Vec3]; // row-major rotation matrix

export interface Cubie {
  /** Home position (readonly reference, integer coords -1/0/+1) */
  home: Vec3;
  /** Current integer position after moves */
  pos: Vec3;
  /** Current orientation: 3x3 rotation matrix (integer entries) */
  ori: Mat3;
}

/** Identity rotation matrix */
const IDENTITY: Mat3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

/** Sticker face normals in home space */
export const FACE_NORMALS: Record<string, Vec3> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  R: [1, 0, 0],
  L: [-1, 0, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
};

/** WCA sticker colours */
export const STICKER_COLORS: Record<string, string> = {
  U: '#FFFFFF', // white
  D: '#FACC15', // yellow
  R: '#22C55E', // green
  L: '#3B82F6', // blue
  F: '#EF4444', // red
  B: '#F97316', // orange
};

// ---------------------------------------------------------------------------
// Matrix helpers
// ---------------------------------------------------------------------------

function matMul(a: Mat3, b: Mat3): Mat3 {
  const out: Mat3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      out[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c];
    }
  }
  return out;
}

function matVec(m: Mat3, v: Vec3): Vec3 {
  return [
    Math.round(m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2]),
    Math.round(m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2]),
    Math.round(m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]),
  ];
}

function cloneMat(m: Mat3): Mat3 {
  return [
    [...m[0]] as Vec3,
    [...m[1]] as Vec3,
    [...m[2]] as Vec3,
  ];
}

/**
 * Rotation matrix for 90° CCW around an axis (right-hand rule).
 * axis: 'x' | 'y' | 'z', dir: +1 (CCW 90°) or -1 (CW 90°)
 */
function rotMatrix(axis: 'x' | 'y' | 'z', dir: 1 | -1): Mat3 {
  const c = 0; // cos(90°) = 0
  const s = dir; // sin(90°) = ±1
  if (axis === 'x')
    return [
      [1, 0, 0],
      [0, c, -s],
      [0, s, c],
    ];
  if (axis === 'y')
    return [
      [c, 0, s],
      [0, 1, 0],
      [-s, 0, c],
    ];
  // z
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
}

// ---------------------------------------------------------------------------
// Face‐move definition
// ---------------------------------------------------------------------------
type MoveAxis = 'x' | 'y' | 'z';

interface MoveDef {
  axis: MoveAxis;
  slice: number; // which slice: -1 | 0 | 1
  dir: 1 | -1;   // +1 = CCW (relative to positive axis), -1 = CW
}

const MOVE_DEFS: Record<string, MoveDef> = {
  U:  { axis: 'y', slice:  1, dir:  1 },
  "U'": { axis: 'y', slice:  1, dir: -1 },
  D:  { axis: 'y', slice: -1, dir: -1 },
  "D'": { axis: 'y', slice: -1, dir:  1 },
  R:  { axis: 'x', slice:  1, dir:  1 },
  "R'": { axis: 'x', slice:  1, dir: -1 },
  L:  { axis: 'x', slice: -1, dir: -1 },
  "L'": { axis: 'x', slice: -1, dir:  1 },
  F:  { axis: 'z', slice:  1, dir:  1 },
  "F'": { axis: 'z', slice:  1, dir: -1 },
  B:  { axis: 'z', slice: -1, dir: -1 },
  "B'": { axis: 'z', slice: -1, dir:  1 },
};

export type MoveName = keyof typeof MOVE_DEFS;

// ---------------------------------------------------------------------------
// Engine class
// ---------------------------------------------------------------------------

export class RubiksCubeEngine {
  cubies: Cubie[];
  moveHistory: MoveName[];

  constructor() {
    this.cubies = [];
    this.moveHistory = [];
    this._buildSolved();
  }

  private _buildSolved() {
    this.cubies = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          this.cubies.push({
            home: [x, y, z],
            pos: [x, y, z],
            ori: cloneMat(IDENTITY),
          });
        }
      }
    }
    this.moveHistory = [];
  }

  reset() {
    this._buildSolved();
  }

  /** Returns the indices of affected cubies for the given move */
  affectedIndices(moveName: MoveName): number[] {
    const def = MOVE_DEFS[moveName];
    const axisIdx = def.axis === 'x' ? 0 : def.axis === 'y' ? 1 : 2;
    return this.cubies
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => c.pos[axisIdx] === def.slice)
      .map(({ i }) => i);
  }

  /** Apply a move and return the affected cubie indices */
  applyMove(moveName: MoveName): number[] {
    const def = MOVE_DEFS[moveName];
    const rot = rotMatrix(def.axis, def.dir);
    const indices = this.affectedIndices(moveName);
    for (const i of indices) {
      const c = this.cubies[i];
      c.pos = matVec(rot, c.pos);
      c.ori = matMul(rot, c.ori);
    }
    this.moveHistory.push(moveName);
    return indices;
  }

  scramble(n = 20): MoveName[] {
    const moves = Object.keys(MOVE_DEFS) as MoveName[];
    const applied: MoveName[] = [];
    let lastBase = '';
    for (let i = 0; i < n; i++) {
      // avoid redundant moves on same face
      let pick: MoveName;
      do {
        pick = moves[Math.floor(Math.random() * moves.length)];
      } while (pick.replace("'", '') === lastBase);
      lastBase = pick.replace("'", '');
      this.applyMove(pick);
      applied.push(pick);
    }
    return applied;
  }

  isSolved(): boolean {
    return this.cubies.every(
      (c) =>
        c.pos[0] === c.home[0] &&
        c.pos[1] === c.home[1] &&
        c.pos[2] === c.home[2] &&
        c.ori[0][0] === 1 &&
        c.ori[1][1] === 1 &&
        c.ori[2][2] === 1
    );
  }

  /**
   * For each cubie, compute its sticker colours as a map from face-normal-key
   * ('U','D','R','L','F','B') to colour string. Only external faces get a colour.
   */
  getStickerColors(cubieIndex: number): Partial<Record<string, string>> {
    const c = this.cubies[cubieIndex];
    const result: Partial<Record<string, string>> = {};
    for (const [faceName, normal] of Object.entries(FACE_NORMALS)) {
      // Transform normal back to home space: ori^-1 * normal
      // For rotation matrices, inverse = transpose
      const oriT: Mat3 = [
        [c.ori[0][0], c.ori[1][0], c.ori[2][0]],
        [c.ori[0][1], c.ori[1][1], c.ori[2][1]],
        [c.ori[0][2], c.ori[1][2], c.ori[2][2]],
      ];
      const homeNormal = matVec(oriT, normal);
      // Check if this home-space face is actually a surface face of this cubie
      const hx = c.home[0], hy = c.home[1], hz = c.home[2];
      if (
        (homeNormal[0] === 1 && hx === 1) ||
        (homeNormal[0] === -1 && hx === -1) ||
        (homeNormal[1] === 1 && hy === 1) ||
        (homeNormal[1] === -1 && hy === -1) ||
        (homeNormal[2] === 1 && hz === 1) ||
        (homeNormal[2] === -1 && hz === -1)
      ) {
        // Map home face normal to face name for colour lookup
        const homeFace = Object.entries(FACE_NORMALS).find(
          ([, n]) => n[0] === homeNormal[0] && n[1] === homeNormal[1] && n[2] === homeNormal[2]
        );
        if (homeFace) result[faceName] = STICKER_COLORS[homeFace[0]];
      }
    }
    return result;
  }
}
