import './HeroCube.css';

// WCA standard face order: front, back, right, left, top, bottom
// Colors: red front, orange back, green right, blue left, white top, yellow bottom
const STICKER_ROWS = 3;


const SOLVED_FACE_COLORS: Record<string, string> = {
  front: '#EF4444',
  back: '#F97316',
  right: '#22C55E',
  left: '#3B82F6',
  top: '#FFFFFF',
  bottom: '#FACC15',
};

function FacePlane({ face }: { face: string }) {
  const color = SOLVED_FACE_COLORS[face];
  return (
    <div className={`hero-cube__face hero-cube__face--${face}`}>
      {Array.from({ length: STICKER_ROWS }).map((_, row) =>
        Array.from({ length: STICKER_ROWS }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className="hero-cube__sticker"
            style={{ background: color }}
          />
        ))
      )}
    </div>
  );
}

const FACES = ['front', 'back', 'right', 'left', 'top', 'bottom'] as const;

const HeroCube: React.FC = () => {
  return (
    <div className="h-[160px] w-full flex items-center justify-center rounded-xl overflow-hidden bg-slate-900/80">
      <div className="hero-cube__scene">
        <div className="hero-cube">
          {FACES.map(face => (
            <FacePlane key={face} face={face} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCube;
