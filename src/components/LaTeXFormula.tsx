'use client';

import katex from 'katex';
import { InlineMath, BlockMath } from 'react-katex';

interface LaTeXFormulaProps {
  code: string;
  displayMode?: 'inline' | 'block';
  alt?: string;
}

export default function LaTeXFormula({
  code,
  displayMode = 'inline',
  alt,
}: LaTeXFormulaProps) {
  if (!code) return null;

  let hasLatexError = false;

  try {
    katex.renderToString(code, { throwOnError: true });
  } catch (error) {
    hasLatexError = true;
    console.error('LaTeX validation error:', error);
  }

  if (hasLatexError) {
    return (
      <code className="rounded bg-red-50 px-2 py-1 font-mono text-sm text-red-600">
        {alt || code}
      </code>
    );
  }

  if (displayMode === 'block') {
    return (
      <div className="my-6 flex justify-center overflow-x-auto">
        <div className="inline-block">
          <BlockMath math={code} />
        </div>
      </div>
    );
  }

  return <InlineMath math={code} />;
}
