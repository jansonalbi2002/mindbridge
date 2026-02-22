import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { RubiksCubeEngine, FACE_NORMALS, type MoveName } from '../../utils/RubiksCubeEngine';
import type { Question, FaceId } from '../../utils/questions';
import { FACE_QUESTIONS } from '../../utils/questions';
import { useUIStore } from '../../store/useUIStore';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CUBIE_SIZE = 0.92;
const CUBIE_GAP = 1.0;
const ANIM_DURATION = 0.22; // seconds
const STICKER_INSET = CUBIE_SIZE / 2 + 0.005;

const FACE_TO_MOVE: Record<string, MoveName> = {
  U: 'U', D: 'D', R: 'R', L: 'L', F: 'F', B: 'B',
};

const KEY_TO_MOVE: Record<string, MoveName> = {
  u: 'U', U: "U'",
  d: 'D', D: "D'",
  r: 'R', R: "R'",
  l: 'L', L: "L'",
  f: 'F', F: "F'",
  b: 'B', B: "B'",
};

// ---------------------------------------------------------------------------
// Sticker euler angles per face
// ---------------------------------------------------------------------------
const STICKER_EULER: Record<string, THREE.Euler> = {
  U: new THREE.Euler(-Math.PI / 2, 0, 0),
  D: new THREE.Euler(Math.PI / 2, 0, 0),
  R: new THREE.Euler(0, Math.PI / 2, 0),
  L: new THREE.Euler(0, -Math.PI / 2, 0),
  F: new THREE.Euler(0, 0, 0),
  B: new THREE.Euler(0, Math.PI, 0),
};

const FACE_NORMALS_KEYS = Object.entries(FACE_NORMALS) as [string, [number, number, number]][];

// ---------------------------------------------------------------------------
// Shared geometries (prevents WebGL memory leak / Context Lost on re-renders)
// ---------------------------------------------------------------------------
const cubieGeometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);
const stickerGeometry = new THREE.PlaneGeometry(CUBIE_SIZE - 0.08, CUBIE_SIZE - 0.08);
const baseMaterial = new THREE.MeshStandardMaterial({
  color: '#0d0d0d',
  roughness: 0.25,
  metalness: 0.7,
});

// ---------------------------------------------------------------------------
// Single cubie mesh
// ---------------------------------------------------------------------------
interface CubieProps {
  position: [number, number, number];
  stickers: Partial<Record<string, string>>;
  onClick?: (face: string) => void;
}

function CubieMesh({ position, stickers, onClick }: CubieProps) {
  return (
    <group position={position}>
      <mesh geometry={cubieGeometry} material={baseMaterial} />
      {FACE_NORMALS_KEYS.map(([faceName, normal]) => {
        const color = stickers[faceName];
        if (!color) return null;
        const px = normal[0] * STICKER_INSET;
        const py = normal[1] * STICKER_INSET;
        const pz = normal[2] * STICKER_INSET;
        return (
          <mesh
            key={faceName}
            position={[px, py, pz]}
            rotation={STICKER_EULER[faceName]}
            onClick={onClick ? (e) => { e.stopPropagation(); onClick(faceName); } : undefined}
            geometry={stickerGeometry}
          >
            <meshStandardMaterial
              color={color}
              roughness={0.12}
              metalness={0.05}
              emissive={color}
              emissiveIntensity={0.06}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Animation state (kept as a ref — no React re-render during animation)
// ---------------------------------------------------------------------------
interface AnimState {
  indices: Set<number>;
  axis: THREE.Vector3;
  targetAngle: number;
  startTime: number;
  moveName: MoveName;
}

// ---------------------------------------------------------------------------
// Cube scene — manages animation loop
// ---------------------------------------------------------------------------
interface CubeSceneProps {
  engineRef: React.RefObject<RubiksCubeEngine>;
  onAnimDone: () => void;
  onFaceClick: (face: string) => void;
  triggerRef: React.RefObject<{ pendingMove: MoveName | null }>;
  orbitEnabled: boolean;
  version: number; // bump to force cubie re-read
}

function CubeScene({ engineRef, onAnimDone, onFaceClick, triggerRef, orbitEnabled, version }: CubeSceneProps) {
  const { clock } = useThree();
  const animRef = useRef<AnimState | null>(null);
  const animGroupRef = useRef<THREE.Group>(null!);
  const consumedMove = useRef<MoveName | null>(null);
  const [tick, setTick] = useState(0);

  // Poll for new pending moves (avoid stale closure issues with useEffect)
  useFrame(() => {
    // ── 1) Pick up a newly queued move ──────────────────────────────────────
    const trigger = triggerRef.current;
    if (!animRef.current && trigger?.pendingMove && trigger.pendingMove !== consumedMove.current) {
      const moveName = trigger.pendingMove;
      consumedMove.current = moveName;

      const def = moveName as string;
      const axisChar =
        def[0] === 'U' || def[0] === 'D' ? 'y'
          : def[0] === 'R' || def[0] === 'L' ? 'x' : 'z';
      const slice = ['U', 'R', 'F'].includes(def[0]) ? 1 : -1;
      const isPrime = def.includes("'");

      const axisVec = (axisChar === 'x'
        ? new THREE.Vector3(1, 0, 0)
        : axisChar === 'y'
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1)
      ).multiplyScalar(slice);

      const indices = new Set(engineRef.current!.affectedIndices(moveName));

      animRef.current = {
        indices,
        axis: axisVec,
        targetAngle: (isPrime ? 1 : -1) * (Math.PI / 2),
        startTime: clock.elapsedTime,
        moveName,
      };

      // Force React to re-render so animating cubies split from static ones
      setTick(t => t + 1);
    }

    // ── 2) Drive the animation group ────────────────────────────────────────
    if (!animRef.current) return;
    const anim = animRef.current;
    const elapsed = clock.elapsedTime - anim.startTime;
    const t = Math.min(elapsed / ANIM_DURATION, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    const angle = anim.targetAngle * eased;
    animGroupRef.current.setRotationFromAxisAngle(anim.axis, angle);

    if (t >= 1) {
      // Apply move to engine
      engineRef.current!.applyMove(anim.moveName);
      animRef.current = null;
      animGroupRef.current.rotation.set(0, 0, 0);
      onAnimDone();
      setTick(t => t + 1);
    }
  });

  // Build cubie data from engine (recomputed when tick or version changes)
  const cubieMeshes = useMemo(() => {
    const eng = engineRef.current!;
    return eng.cubies.map((cubie, i) => ({
      index: i,
      pos: [
        cubie.pos[0] * CUBIE_GAP,
        cubie.pos[1] * CUBIE_GAP,
        cubie.pos[2] * CUBIE_GAP,
      ] as [number, number, number],
      stickers: eng.getStickerColors(i),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, version]);

  const animIndices = animRef.current?.indices ?? new Set<number>();
  const staticCubies = cubieMeshes.filter(c => !animIndices.has(c.index));
  const animCubies = cubieMeshes.filter(c => animIndices.has(c.index));

  const handleClick = useCallback(
    (face: string) => {
      if (animRef.current) return;
      onFaceClick(face);
    },
    [onFaceClick]
  );

  return (
    <group>
      {staticCubies.map(({ index, pos, stickers }) => (
        <CubieMesh
          key={index}
          position={pos}
          stickers={stickers}
          onClick={handleClick}
        />
      ))}
      <group ref={animGroupRef}>
        {animCubies.map(({ index, pos, stickers }) => (
          <CubieMesh key={index} position={pos} stickers={stickers} />
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enabled={orbitEnabled && !animRef.current}
        makeDefault
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Keyboard listener
// ---------------------------------------------------------------------------
function useKeyboardMoves(onMove: (m: MoveName) => void) {
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const char = e.shiftKey ? e.key.toUpperCase() : e.key.toLowerCase();
      const move = KEY_TO_MOVE[char];
      if (move) { e.preventDefault(); onMoveRef.current(move); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}

// ---------------------------------------------------------------------------
// Quiz face colours
// ---------------------------------------------------------------------------
const faceColors: Record<FaceId, string> = {
  front: '#EF4444',
  back: '#F97316',
  left: '#3B82F6',
  right: '#22C55E',
  top: '#FFFFFF',
  bottom: '#FACC15',
};

const FACE_TO_QUIZ: Record<string, FaceId> = {
  F: 'front', B: 'back', L: 'left', R: 'right', U: 'top', D: 'bottom',
};

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------
const RubiksCube3D: React.FC = () => {
  const { mindLab } = useUIStore();

  const engineRef = useRef(new RubiksCubeEngine());

  // triggerRef lets CubeScene's useFrame see the latest pending move without re-render
  const triggerRef = useRef<{ pendingMove: MoveName | null }>({ pendingMove: null });

  const [moveQueue, setMoveQueue] = useState<MoveName[]>([]);
  const [pendingMove, setPendingMove] = useState<MoveName | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(true);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // bump to force cubie re-render after scramble/reset
  const [version, setVersion] = useState(0);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [activeFace, setActiveFace] = useState<FaceId | null>(null);

  const solvedCount = mindLab.solvedFaces.size;
  const totalFaces = 6;
  const completion = Math.round((solvedCount / totalFaces) * 100);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (isMobile || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          // Delay mount slightly to survive React 18 Strict Mode double-invoke
          setTimeout(() => {
            if (containerRef.current) setIsReady(true);
          }, 150);
          observer.disconnect();
          return;
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  // Keep triggerRef in sync
  useEffect(() => {
    triggerRef.current.pendingMove = pendingMove;
  }, [pendingMove]);

  // Drain queue
  useEffect(() => {
    if (pendingMove !== null) return;
    if (moveQueue.length === 0) return;
    const [next, ...rest] = moveQueue;
    setPendingMove(next);
    setMoveQueue(rest);
  }, [pendingMove, moveQueue]);

  const enqueueMove = useCallback((m: MoveName) => {
    setMoveQueue(q => [...q, m]);
    setMoveCount(c => c + 1);
    setOrbitEnabled(false);
  }, []);

  const handleAnimDone = useCallback(() => {
    setPendingMove(null);
    setIsSolved(engineRef.current.isSolved());
    setMoveQueue(q => {
      if (q.length === 0) setOrbitEnabled(true);
      return q;
    });
  }, []);

  const handleScramble = useCallback(() => {
    engineRef.current.scramble(20);
    setMoveCount(0);
    setMoveQueue([]);
    setPendingMove(null);
    triggerRef.current.pendingMove = null;
    setIsSolved(false);
    setOrbitEnabled(true);
    setVersion(v => v + 1);
  }, []);

  const handleReset = useCallback(() => {
    engineRef.current.reset();
    setMoveCount(0);
    setMoveQueue([]);
    setPendingMove(null);
    triggerRef.current.pendingMove = null;
    setIsSolved(true);
    setOrbitEnabled(true);
    setVersion(v => v + 1);
  }, []);

  useKeyboardMoves(enqueueMove);

  const handleFaceClick = useCallback((face: string) => {
    const move = FACE_TO_MOVE[face];
    if (move) {
      enqueueMove(move);
      const quizFace = FACE_TO_QUIZ[face];
      if (quizFace) {
        const list = FACE_QUESTIONS[quizFace];
        if (list?.length) {
          const q = list[Math.floor(Math.random() * list.length)];
          setCurrentQuestion(q);
          setActiveFace(quizFace);
          setFeedback(null);
        }
      }
    }
  }, [enqueueMove]);

  const handleAnswer = useCallback((opt: string) => {
    if (!currentQuestion || !activeFace) return;
    const correct = opt === currentQuestion.answer;
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) {
      mindLab.incrementSolved(activeFace);
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.value = 0.15;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch { /* ignore */ }
      if (mindLab.solvedFaces.size + 1 === totalFaces) {
        setTimeout(() => { setActiveFace(null); setCurrentQuestion(null); }, 900);
      }
    }
  }, [currentQuestion, activeFace, mindLab, totalFaces]);

  const facesSolvedLabel = useMemo(
    () => `${solvedCount} / ${totalFaces} faces solved`,
    [solvedCount]
  );

  return (
    <div className="glass-card relative h-[360px] overflow-hidden rounded-3xl p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            3D Rubik&apos;s Cube
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Click face to turn · drag to orbit · U D L R F B keys
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {facesSolvedLabel}
        </div>
      </div>

      <div className="grid h-[calc(100%-3rem)] gap-3 md:grid-cols-2">
        {/* ── 3D Canvas ── */}
        <div className="relative min-h-[200px] rounded-2xl bg-slate-950/90" ref={containerRef}>
          {isMobile ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-3 text-xs text-slate-300">
              <div className="grid grid-cols-3 gap-2">
                {(['front', 'right', 'top', 'left', 'back', 'bottom'] as FaceId[]).map(face => (
                  <button
                    key={face}
                    type="button"
                    onClick={() => {
                      const list = FACE_QUESTIONS[face];
                      if (!list?.length) return;
                      const q = list[Math.floor(Math.random() * list.length)];
                      setCurrentQuestion(q); setActiveFace(face); setFeedback(null);
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-[10px] font-semibold shadow-md"
                    style={{ backgroundColor: faceColors[face] }}
                  >
                    {face}
                  </button>
                ))}
              </div>
              <p className="text-center text-[11px] text-slate-400">
                Tap a colour to reveal a challenge. On desktop you&apos;ll see a full 3D cube.
              </p>
            </div>
          ) : isReady ? (
            <>
              <Canvas
                camera={{ position: [4, 4, 4], fov: 45 }}
                gl={{
                  antialias: true,
                  powerPreference: 'high-performance',
                  alpha: false,
                  stencil: false,
                  depth: true,
                }}
                onCreated={({ gl }) => {
                  const canvas = gl.domElement;
                  canvas.addEventListener('webglcontextlost', (e) => {
                    e.preventDefault();
                  });
                  canvas.addEventListener('webglcontextrestored', () => {
                    gl.resetState();
                  });
                  return () => {
                    gl.dispose();
                    gl.forceContextLoss();
                  };
                }}
                style={{ position: 'absolute', inset: 0, borderRadius: '1rem' }}
              >
                <ambientLight intensity={0.7} />
                <directionalLight
                  position={[5, 8, 5]}
                  intensity={1.5}
                />
                <pointLight position={[-4, -4, -4]} intensity={0.5} color="#a78bfa" />
                <CubeScene
                  engineRef={engineRef}
                  onAnimDone={handleAnimDone}
                  onFaceClick={handleFaceClick}
                  triggerRef={triggerRef}
                  orbitEnabled={orbitEnabled}
                  version={version}
                />
              </Canvas>

              {/* Controls bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleScramble}
                  className="rounded-full bg-slate-800/90 px-3 py-1 text-[10px] font-semibold text-slate-200 shadow hover:bg-indigo-600/80 transition-colors"
                >
                  Scramble
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-slate-800/90 px-3 py-1 text-[10px] font-semibold text-slate-200 shadow hover:bg-slate-600 transition-colors"
                >
                  Reset
                </button>
                <span className="rounded-full bg-slate-800/60 px-2 py-1 text-[10px] text-slate-400 tabular-nums">
                  Moves: {moveCount}
                </span>
              </div>

              {/* Solved badge */}
              <AnimatePresence>
                {isSolved && moveCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-400/30"
                  >
                    🎉 Solved!
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : null}
        </div>

        {/* ── Quiz panel ── */}
        <div className="flex flex-col justify-between rounded-2xl bg-slate-50/80 p-3 dark:bg-slate-900/70">
          {!currentQuestion ? (
            <div className="flex h-full flex-col items-start justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Click a coloured sticker on the cube to reveal a mini math or logic challenge.
                Correct answers light up the cube.
              </p>
              <button
                type="button"
                onClick={mindLab.reset}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
              >
                Reset quiz
              </button>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Challenge
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-50">
                  {currentQuestion.prompt}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {currentQuestion.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswer(opt)}
                      className="rounded-xl bg-white/80 px-3 py-2 text-left font-medium text-slate-700 shadow-sm hover:bg-accent/10 hover:text-primary dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-accent/20"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${feedback === 'correct'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                    }`}
                >
                  {feedback === 'correct'
                    ? 'Correct! Face energy increased.'
                    : 'Not quite. Try a different strategy.'}
                </motion.div>
              )}
            </div>
          )}

          {completion === 100 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-2 rounded-xl bg-gradient-to-r from-emerald-500/15 via-accent/15 to-primary/15 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300"
            >
              Cube complete. A completion plume will unlock your next difficulty band.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RubiksCube3D;
