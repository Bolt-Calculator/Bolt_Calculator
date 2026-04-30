import { AlertTriangle, CheckSquare } from 'lucide-react';
import type { CalloutBaseProps } from './types';

export type WarningCalloutProps = CalloutBaseProps & {
  reference?: string;
  steps?: string[];
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
};

function renderMessage(message: string) {
  return message
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <p
        key={index}
        className="text-sm leading-6 text-red-950/90 dark:text-red-200"
      >
        {line}
      </p>
    ));
}

export function WarningCallout({
  heading = 'Safety Protocol',
  message,
  reference = 'REF: ISO-26262-S',
  steps = [],
  primaryActionLabel = 'Acknowledge Protocol',
  secondaryActionLabel = 'View Full Manual',
}: WarningCalloutProps) {
  return (
    <aside className="w-full border-l-4 border-red-700 dark:border-red-500 bg-red-100 dark:bg-red-950 p-6 shadow-sm dark:shadow-slate-950/50">
      <div className="flex items-start gap-4">
        <div className="shrink-0\">
          <AlertTriangle className="mt-0.5 h-6 w-6 text-red-700" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-700">
              {heading}
            </span>
          </div>

          <div className="space-y-3">{renderMessage(message)}</div>

          {steps.length > 0 && (
            <div className="mt-5 space-y-2 border-t border-red-500/10 dark:border-red-500/20 pt-4">
              {steps.map((step) => (
                <div key={step} className="flex items-start gap-2">
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
                  <span className="text-sm leading-6 text-red-950/80 dark:text-red-200">
                    {step}
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
