import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface HealthCardProps {
  title: string;
  grade: string;
  score: number;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  delay?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

export function HealthCard({
  title,
  grade,
  score,
  description,
  icon: Icon,
  trend = "stable",
  delay = 0,
  onClick,
  ariaLabel,
}: HealthCardProps) {
  const getGradeColor = (g: string) => {
    if (["A", "A-", "B+"].includes(g)) return "#1AFFFF";
    if (["B", "B-", "C+"].includes(g)) return "#10b981";
    if (["C", "C-", "D+"].includes(g)) return "#f59e0b";
    return "#ef4444";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "+";
    if (trend === "down") return "-";
    return "=";
  };

  const sharedProps = {
    className:
      "w-full rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:border-[#1AFFFF]/50 focus:outline-none focus:ring-2 focus:ring-[#1AFFFF]/50",
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5 },
  };

  const content = (
    <>
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-white/[0.04] p-3">
          <Icon className="h-6 w-6 text-[#1AFFFF]" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: getGradeColor(grade) }}>
            {grade}
          </div>
          <div className="text-xs text-slate-400">{score}/100</div>
        </div>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-4 text-sm text-slate-400">{description}</p>

      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full"
            style={{ backgroundColor: getGradeColor(grade) }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8 }}
          />
        </div>
        <span className="text-xs text-slate-400">{getTrendIcon()}</span>
      </div>
    </>
  );

  if (onClick) {
    return (
      <motion.button type="button" onClick={onClick} aria-label={ariaLabel} {...sharedProps}>
        {content}
      </motion.button>
    );
  }

  return <motion.div {...sharedProps}>{content}</motion.div>;
}
