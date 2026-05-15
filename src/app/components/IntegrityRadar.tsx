import { motion } from "motion/react";

interface IntegrityRadarProps {
  humanClarity: number;
  aiReadiness: number;
  externalExposure: number;
  ownershipGaps: number;
}

export function IntegrityRadar({
  humanClarity = 75,
  aiReadiness = 62,
  externalExposure = 88,
  ownershipGaps = 45,
}: IntegrityRadarProps) {
  const metrics = [
    { label: "Human Clarity", value: humanClarity, angle: 0 },
    { label: "AI Readiness", value: aiReadiness, angle: 90 },
    { label: "Exposure Control", value: externalExposure, angle: 180 },
    { label: "Ownership", value: ownershipGaps, angle: 270 },
  ];

  const centerX = 120;
  const centerY = 120;
  const maxRadius = 100;

  const points = metrics.map((metric) => {
    const radius = (metric.value / 100) * maxRadius;
    const angleRad = (metric.angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    return { x, y, ...metric };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ") + " Z";

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        role="img"
        aria-labelledby="integrity-radar-title"
        viewBox="0 0 240 240"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(26, 255, 255, 0.3))" }}
      >
        <title id="integrity-radar-title">
          Integrity radar showing human clarity, AI readiness, exposure control, and ownership coverage
        </title>
        {[25, 50, 75, 100].map((percent) => (
          <circle
            key={percent}
            cx={centerX}
            cy={centerY}
            r={(percent / 100) * maxRadius}
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {metrics.map((metric) => {
          const angleRad = (metric.angle * Math.PI) / 180;
          const x2 = centerX + maxRadius * Math.cos(angleRad);
          const y2 = centerY + maxRadius * Math.sin(angleRad);
          return (
            <line
              key={metric.label}
              x1={centerX}
              y1={centerY}
              x2={x2}
              y2={y2}
              stroke="#334155"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        <motion.path
          d={pathData}
          fill="#1AFFFF"
          fillOpacity={0.2}
          stroke="#1AFFFF"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#1AFFFF"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Integrity</div>
          <div className="text-2xl font-bold text-[#1AFFFF]">
            {Math.round((humanClarity + aiReadiness + externalExposure + ownershipGaps) / 4)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="text-xs text-muted-foreground">{metric.label}</div>
            <div className="text-sm font-medium text-foreground">{metric.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
