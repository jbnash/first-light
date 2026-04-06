"use client";

import { useState } from "react";

const DIMENSION_CONFIG = [
  { lines: ["Context", "Specificity"] },
  { lines: ["Task", "Openness"] },
  { lines: ["Process", "Visibility"] },
  { lines: ["Output", "Type"] },
  { lines: ["Verification", "Surface"] },
];

function scoreToColor(score: number): string {
  if (score <= 3) return "#16a34a";
  if (score <= 7) return "#d97706";
  return "#e11d48";
}

interface RadarChartProps {
  scores: number[];
  overallScore: number;
}

export default function RadarChart({ scores, overallScore }: RadarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const CX = 200;
  const CY = 185;
  const R = 90;
  const LABEL_R = 116;

  const angles = Array.from({ length: 5 }, (_, i) => (i * 72 - 90) * (Math.PI / 180));

  const getPoint = (angle: number, radius: number) => ({
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  });

  const ringPath = (f: number) => {
    const pts = angles.map((a) => getPoint(a, R * f));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  };

  const dataPath =
    scores
      .map((s, i) => {
        const pt = getPoint(angles[i], R * Math.max(0.05, s / 10));
        return `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`;
      })
      .join(" ") + " Z";

  const overallColor = scoreToColor(overallScore);

  const textAnchor = (a: number) => {
    const x = Math.cos(a);
    if (x > 0.3) return "start";
    if (x < -0.3) return "end";
    return "middle";
  };

  return (
    <svg
      viewBox="0 0 400 360"
      width="100%"
      className="text-neutral-600 dark:text-white/55 overflow-visible"
    >
      {/* Ring guides */}
      {[0.3, 0.6, 1.0].map((f) => (
        <path
          key={f}
          d={ringPath(f)}
          fill="none"
          stroke="rgba(128,128,128,0.15)"
          strokeWidth="1"
        />
      ))}

      {/* Ring scale labels */}
      {[
        { f: 0.3, v: "3" },
        { f: 0.6, v: "6" },
        { f: 1.0, v: "10" },
      ].map(({ f, v }) => (
        <text
          key={v}
          x={CX + 3}
          y={CY - R * f - 3}
          fontSize="8"
          fill="rgba(128,128,128,0.4)"
          textAnchor="start"
        >
          {v}
        </text>
      ))}

      {/* Axis spokes */}
      {angles.map((a, i) => {
        const outer = getPoint(a, R);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={outer.x}
            y2={outer.y}
            stroke="rgba(128,128,128,0.15)"
            strokeWidth="1"
          />
        );
      })}

      {/* Filled data polygon */}
      <path
        d={dataPath}
        fill={`${overallColor}1e`}
        stroke={overallColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data point dots */}
      {scores.map((s, i) => {
        const pt = getPoint(angles[i], R * Math.max(0.05, s / 10));
        const color = scoreToColor(s);
        const isH = hovered === i;
        return (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={isH ? 6 : 4}
            fill={color}
            stroke="white"
            strokeWidth={isH ? 2 : 1.5}
            style={{ cursor: "pointer", transition: "r 0.12s ease" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        );
      })}

      {/* Labels */}
      {angles.map((a, i) => {
        const lp = getPoint(a, LABEL_R);
        const anchor = textAnchor(a);
        const isH = hovered === i;
        const scoreColor = scoreToColor(scores[i]);
        const { lines } = DIMENSION_CONFIG[i];
        // For the top vertex, shift up so two-line label sits above the point
        const yBase = Math.sin(a) < -0.3 ? lp.y - 12 : lp.y;

        return (
          <g
            key={i}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <text
              x={lp.x}
              y={yBase}
              textAnchor={anchor}
              fontSize="10"
              fontWeight={isH ? "700" : "500"}
              fill={isH ? scoreColor : "currentColor"}
            >
              <tspan x={lp.x} dy="0">
                {lines[0]}
              </tspan>
              <tspan x={lp.x} dy="1.3em">
                {lines[1]}
              </tspan>
            </text>

            <text
              x={lp.x}
              y={yBase + 32}
              textAnchor={anchor}
              fontSize="12"
              fontWeight="700"
              fontFamily="monospace"
              fill={scoreColor}
            >
              {scores[i]}
              <tspan
                fontSize="9"
                fontWeight="400"
                fill="rgba(128,128,128,0.55)"
              >
                /10
              </tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
