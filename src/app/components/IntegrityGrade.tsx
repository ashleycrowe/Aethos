import { motion } from "motion/react";

interface IntegrityGradeProps {
  score: number;
  trendDelta?: string;
}

function getLetterGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D+";
  if (score >= 45) return "D";
  return "F";
}

function getGradeColor(score: number): string {
  if (score >= 80) return "#1AFFFF";
  if (score >= 60) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function IntegrityGrade({ score, trendDelta = "+4%" }: IntegrityGradeProps) {
  const letter = getLetterGrade(score);
  const color = getGradeColor(score);

  return (
    <div className="relative" aria-label={`Integrity grade ${letter}, score ${score} out of 100, ${trendDelta} change`}>
      <motion.div
        className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="mb-2 text-sm text-slate-400">Global Integrity Grade</div>
          <motion.div
            className="text-7xl font-black leading-none md:text-8xl"
            style={{ color }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            {letter}
          </motion.div>
          <motion.div
            className="mt-2 text-2xl font-black text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}/100
          </motion.div>
        </div>

        <div className="h-32 w-px bg-border" />

        <div className="space-y-4">
          <div>
            <div className="mb-1 text-xs text-slate-400">Operational Clarity</div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#1AFFFF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / 100) * 100}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </div>
              <span className="text-xs font-medium">{score}%</span>
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs text-slate-400">AI Readiness</div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#4f46e5]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, score - 15)}%` }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />
              </div>
              <span className="text-xs font-medium">{Math.max(0, score - 15)}%</span>
            </div>
          </div>
          <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-400">
            {trendDelta} trend
          </div>
        </div>
      </motion.div>
    </div>
  );
}
