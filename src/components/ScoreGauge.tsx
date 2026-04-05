interface ScoreGaugeProps {
  overallScore: number;
  scores: number[];
}

function scoreToColor(score: number): string {
  if (score <= 3) return "#16a34a"; // emerald-600 (works on both bg)
  if (score <= 7) return "#d97706"; // amber-600
  return "#e11d48";                 // rose-600
}

export default function ScoreGauge({ overallScore, scores }: ScoreGaugeProps) {
  const SIZE = 120;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 44;

  const angles = Array.from({ length: 5 }, (_, i) => (i * 72 - 90) * (Math.PI / 180));

  const getPoint = (angle: number, radius: number) => ({
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  });

  const rings = [1, 0.6, 0.2];

  const ringPath = (r: number) => {
    const pts = angles.map((a) => getPoint(a, R * r));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  };

  const dataPath = scores
    .map((s, i) => {
      const v = s / 10;
      const pt = getPoint(angles[i], R * v);
      return `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`;
    })
    .join(" ") + " Z";

  const overallColor = scoreToColor(overallScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {rings.map((r) => (
          <path
            key={r}
            d={ringPath(r)}
            fill="none"
            stroke="rgba(128,128,128,0.12)"
            strokeWidth="1"
          />
        ))}
        {angles.map((a, i) => {
          const outer = getPoint(a, R);
          return (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="rgba(128,128,128,0.12)"
              strokeWidth="1"
            />
          );
        })}
        <path d={dataPath} fill={`${overallColor}22`} stroke={overallColor} strokeWidth="1.5" />
        {scores.map((s, i) => {
          const pt = getPoint(angles[i], R * (s / 10));
          return (
            <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill={scoreToColor(s)} />
          );
        })}
      </svg>
      <div className="text-center">
        <div className="text-xs text-neutral-400 dark:text-white/30 font-mono">overall</div>
        <div className="text-base font-bold font-mono tabular-nums" style={{ color: overallColor }}>
          {overallScore.toFixed(1)}<span className="text-xs text-neutral-400 dark:text-white/30 font-normal">/10</span>
        </div>
      </div>
    </div>
  );
}
