import type { UsageInfo } from "../../types/chat";

interface Props {
  usage: UsageInfo;
}

export default function UsageBar({ usage }: Props) {
  const percentage = Math.min((usage.used / usage.limit) * 100, 100);
  const isExhausted = usage.used >= usage.limit;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-800 light:bg-surface-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isExhausted
                ? "bg-red-500"
                : percentage > 70
                  ? "bg-amber-500"
                  : "bg-primary-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span
        className={`text-xs font-medium tabular-nums ${
          isExhausted
            ? "text-red-400 light:text-red-600"
            : "text-surface-400 light:text-surface-500"
        }`}
      >
        {usage.used}/{usage.limit}
      </span>
    </div>
  );
}
