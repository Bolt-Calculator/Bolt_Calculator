import { CheckCircle2 } from 'lucide-react';
import type { CalloutBaseProps } from './types';

export type TakeawayCalloutProps = CalloutBaseProps & {
  reference?: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
};

function renderMessage(message: string) {
  return message
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <p key={index} className="leading-7 text-slate-600 dark:text-slate-400">
        {line}
      </p>
    ));
}

export function TakeawayCallout({
  heading = 'Key Takeaway',
  message,
  reference,
  stats = [],
}: TakeawayCalloutProps) {
  return (
    <aside className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm dark:shadow-slate-950/50">
      <div className="flex items-start gap-4">
        <div className="mt-1 shrink-0">
          <CheckCircle2 className="h-7 w-7 fill-blue-700 text-blue-700 dark:fill-blue-500 dark:text-blue-500" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {heading}
            </span>
            {reference && (
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                {reference}
              </span>
            )}
          </div>

          <div className="space-y-2">{renderMessage(message)}</div>

          {stats.length > 0 && (
            <div className="mt-2 grid grid-cols-1 gap-3 border-t border-slate-300 dark:border-slate-700 pt-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {stat.label}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
