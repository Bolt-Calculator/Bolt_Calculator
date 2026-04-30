import LaTeXFormula from '@/components/LaTeXFormula';
import { CircuitBoard } from 'lucide-react';
import type { CalloutBaseProps } from './types';

export type TechnicalCalloutProps = CalloutBaseProps & {
  formula?: string;
  variables?: Array<{
    symbol: string;
    label: string;
    description: string;
  }>;
};

function renderMessage(message: string) {
  return message
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <p
        key={index}
        className="text-sm leading-6 text-slate-700 dark:text-slate-300"
      >
        {line}
      </p>
    ));
}

export function TechnicalCallout({
  heading = 'Technical Note',
  message,
  formula,
  variables = [],
}: TechnicalCalloutProps) {
  return (
    <aside className="relative w-full overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50">
      <div className="technical-grid absolute right-0 top-0 h-24 w-24 pointer-events-none opacity-20 dark:opacity-10" />

      <header className="flex items-center gap-2 border-b border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 px-4 py-2">
        <CircuitBoard className="h-4 w-4 text-blue-700 dark:text-blue-400" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
          {heading}
        </span>
      </header>

      <div className="space-y-4 p-4">
        <div className="space-y-2">{renderMessage(message)}</div>

        {formula && (
          <div className="flex flex-col items-center justify-center gap-2 border-l-2 border-blue-700 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 px-4 py-4 text-center">
            <LaTeXFormula code={formula} displayMode="block" />
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
              Equation Highlight
            </div>
          </div>
        )}

        {variables.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {variables.map((variable) => (
              <div
                key={variable.symbol}
                className="flex items-start gap-3 border-b border-slate-300/40 pb-2"
              >
                <span className="w-8 font-mono text-sm font-bold text-blue-700">
                  {variable.symbol}
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                    {variable.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {variable.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-1 w-full bg-blue-700 dark:bg-blue-600" />
    </aside>
  );
}
