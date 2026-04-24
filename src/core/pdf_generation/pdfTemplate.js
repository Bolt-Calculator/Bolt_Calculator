// NOT IN USE

///////////////////////////////////////////////

// export function buildHTMLReport(result) {
//   const data = result || {};
//   const now = new Date();
//   const formatDate = (date) =>
//     date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: '2-digit',
//     });
//   const formatNumber = (value, digits = 2) => {
//     if (value === null || value === undefined || Number.isNaN(value)) {
//       return '-';
//     }

//     return Number(value).toLocaleString('en-US', {
//       minimumFractionDigits: digits,
//       maximumFractionDigits: digits,
//     });
//   };
//   const formatNumberInt = (value) => {
//     if (value === null || value === undefined || Number.isNaN(value)) {
//       return '-';
//     }

//     return Number(value).toLocaleString('en-US', {
//       maximumFractionDigits: 0,
//     });
//   };
//   const formatSafetyFactor = (value) => {
//     if (value === null || value === undefined || Number.isNaN(value)) {
//       return '-';
//     }

//     return Number(value).toFixed(2);
//   };
//   const buildReferenceId = () => {
//     if (data.referenceId) {
//       return data.referenceId;
//     }

//     const yyyy = now.getFullYear();
//     const mm = String(now.getMonth() + 1).padStart(2, '0');
//     const dd = String(now.getDate()).padStart(2, '0');
//     return `BCP-${yyyy}${mm}${dd}-AUTO`;
//   };

//   const userData = data.userData || {};
//   const curBolt = data.curBolt || {};
//   const curBoltProperty = data.curBoltProperty || {};
//   const obtained = data.obtainedValues || {};
//   const limits = data.limits || {};
//   const boltDesignation = curBolt.designation || data.boltDesignation || '-';
//   const boltPitch = data.threadPitch ?? '-';
//   const boltGrade = data.boltGrade || '-';
//   const boltArea = curBolt.tensileStressArea ?? data.tensileStressArea;
//   const safetyFactor = data.safetyFactor ?? data.calculatedSafetyFactor;

//   const tensileStress = obtained.tensileStress ?? data.tensileStress;
//   const tensileStressLimit = limits.tensileStress ?? data.tensileStressLimit;

//   const shearStress = obtained.shearStress ?? data.shearStress;
//   const shearStressLimit = limits.shearStress ?? data.shearStressLimit;

//   const bearingStress = obtained.plateBearingStress;
//   const bearingStressLimit = limits.plateBearingStress;

//   const threadShearStress =
//     obtained.threadShearStress ?? data.threadShearStress;
//   const threadShearLimit =
//     limits.threadShearStress ?? data.threadShearStressLimit;

//   const preloadStress = obtained.preLoad ?? data.preloadStress;
//   const preloadLimit = limits.preLoad ?? data.preloadLimit;
//   const separationLoad = obtained.separationLoad ?? data.separationLoad;
//   const separationLimit = limits.separationLoad ?? data.separationLoadLimit;

//   const isPass = (value, limit) => {
//     if (value === null || value === undefined || Number.isNaN(value)) {
//       return false;
//     }
//     if (limit === null || limit === undefined || Number.isNaN(limit)) {
//       return false;
//     }

//     return Number(value) <= Number(limit);
//   };

//   const renderStatus = (status) =>
//     status
//       ? `
// <div class="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
// <span class="material-icons-round text-xs">check_circle</span> PASS
// </div>
// `
//       : `
// <div class="inline-flex items-center gap-1.5 text-rose-600 font-bold text-[10px] bg-rose-50 px-2.5 py-1 rounded border border-rose-100">
// <span class="material-icons-round text-xs">cancel</span> FAIL
// </div>
// `;

//   return `
//   <!DOCTYPE html>
// <html lang="en"><head>
// <meta charset="utf-8"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
// <title>BoltCalculator Bolt Analysis - ${formatDate(now)}</title>
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"/>
// <script src="https://cdn.tailwindcss.com?plugins=forms,typography,container-queries"></script>
// <script id="tailwind-config">
//         tailwind.config = {
//             darkMode: "class",
//             theme: {
//                 extend: {
//                     colors: {
//                         "primary": "#1978e5",
//                         "background-light": "#f1f3f5",
//                         "background-dark": "#111821",
//                     },
//                     fontFamily: {
//                         "display": ["Inter", "sans-serif"],
//                         "sans": ["Inter", "sans-serif"],
//                         "mono": ["JetBrains Mono", "monospace"],
//                     },
//                     borderRadius: {
//                         "DEFAULT": "0.25rem",
//                         "lg": "0.5rem",
//                         "xl": "0.75rem",
//                         "full": "9999px"
//                     },
//                 },
//             },
//         };
//     </script>
// <style type="text/tailwindcss">
//         @layer base {
//             body { font-family: 'Inter', sans-serif; }
//         }
//         @media print {
//             body { background: white !important; }
//             .a4-page {
//                 box-shadow: none !important;
//                 margin: 0 !important;
//                 border: none !important;
//                 width: 100% !important;
//                 padding: 15mm !important;
//             }
//         }
//         .a4-page {
//             width: 210mm;
//             min-height: 297mm;
//             padding: 20mm;
//             margin: 3rem auto;
//             background: white;
//             box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//             position: relative;
//         }
//         .material-symbols-outlined {
//             font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
//         }
//         table { border-collapse: collapse; width: 100%; }
//         th { text-align: left; @apply text-slate-500 text-[10px] uppercase tracking-wider py-2 border-b border-slate-200 font-display; }
//         td { @apply py-3 text-sm border-b border-slate-100 font-display; }
//     </style>
// </head>
// <body class="bg-background-light dark:bg-background-dark text-slate-900 min-h-screen font-display flex flex-col items-center">
// <div class="a4-page flex flex-col">
// <header class="flex justify-between items-start border-b-2 border-primary pb-8 mb-8">
// <div>
// <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Engineering Analysis Report</h1>
// <div class="mt-4 space-y-1">
// <p class="text-sm text-slate-500 flex items-center gap-2">
// <span class="font-semibold text-slate-700 uppercase text-[10px] w-24">Date:</span> ${data.reportDate || formatDate(now)}
//                     </p>
// <p class="text-sm text-slate-500 flex items-center gap-2">
// <span class="font-semibold text-slate-700 uppercase text-[10px] w-24">Reference ID:</span> ${buildReferenceId()}
//                     </p>
// <p class="text-sm text-slate-500 flex items-center gap-2">
// <span class="font-semibold text-slate-700 uppercase text-[10px] w-24">Project:</span> ${data.projectName || 'Bolt Design Analysis'}
//                     </p>
// </div>
// </div>
// <div class="flex items-center gap-3">
// <div class="text-right">
// <div class="font-bold text-xl tracking-tight leading-none">Bolt<span class="text-primary">Calculator</span></div>
// <div class="text-[9px] text-slate-400 uppercase tracking-widest mt-1">Engineering Suite</div>
// </div>
// <div class="bg-primary p-2 rounded-lg flex items-center justify-center">
// <span class="material-symbols-outlined text-white text-3xl">hardware</span>
// </div>
// </div>
// </header>
// <div class="flex-1">
// <section class="mb-10">
// <div class="flex items-center gap-2 mb-4 border-l-4 border-primary pl-3">
// <h2 class="text-sm font-bold text-slate-800 uppercase tracking-widest">Design Input Parameters</h2>
// </div>
// <div class="grid grid-cols-2 gap-12">
// <div>
// <h3 class="text-xs font-semibold text-slate-400 uppercase mb-2 px-1">Geometry &amp; Load</h3>
// <table class="w-full">
// <thead>
// <tr>
// <th>Parameter</th>
// <th class="text-right">Value</th>
// </tr>
// </thead>
// <tbody>
// <tr>
// <td class="text-slate-600">Plate Thickness</td>
// <td class="text-right font-mono font-medium">${formatNumber(userData.plateThickness)} mm</td>
// </tr>
// <tr>
// <td class="text-slate-600">Engaged Thread Length</td>
// <td class="text-right font-mono font-medium">${formatNumber(userData.engagedThreadLength)} mm</td>
// </tr>
// <tr>
// <td class="text-slate-600">External Load</td>
// <td class="text-right font-mono font-medium">${formatNumberInt(userData.externalLoad)} N</td>
// </tr>
// <tr>
// <td class="text-slate-600">Preload</td>
// <td class="text-right font-mono font-medium">${formatNumberInt(userData.preLoad)} N</td>
// </tr>
// <tr>
// <td class="text-slate-600">Lateral Load</td>
// <td class="text-right font-mono font-medium">${formatNumberInt(userData.lateralLoad)} N</td>
// </tr>
// </tbody>
// </table>
// </div>
// <div>
// <h3 class="text-xs font-semibold text-slate-400 uppercase mb-2 px-1">Material Specification</h3>
// <table class="w-full">
// <thead>
// <tr>
// <th>Property</th>
// <th class="text-right">Standard</th>
// </tr>
// </thead>
// <tbody>

// <tr>
// <td class="text-slate-600">Young's Modulus (E)</td>
// <td class="text-right font-mono font-medium text-slate-900">21000 N/mm²</td>

// <tr>
// <td class="text-slate-600">Safety Factor</td>
// <td class="text-right font-mono font-medium text-slate-900">2.0</td>
// </tr>
// </tbody>
// </table>
// </div>
// </div>
// </section>
// <section class="mb-8">
// <div class="flex items-center gap-2 mb-6 border-l-4 border-primary pl-3">
// <h2 class="text-sm font-bold text-slate-800 uppercase tracking-widest">Calculated Results</h2>
// </div>
// <div class="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10 shadow-sm">
// <div class="flex items-center gap-6">
// <div class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-center">
// <span class="material-symbols-outlined text-primary text-2xl">construction</span>
// </div>
// <div class="flex-1">
// <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Selected Bolt Specifications</h3>
// <div class="grid grid-cols-4 gap-4 items-center">
// <div>
// <p class="text-[10px] text-slate-500 uppercase font-medium mb-1">Bolt Size</p>
// <p class="text-base font-bold text-slate-900">${boltDesignation}</p>
// </div>
// <div class="border-l border-slate-200 pl-4">
// <p class="text-[10px] text-slate-500 uppercase font-medium mb-1">Bolt Grade</p>
// <p class="text-base font-bold text-slate-900">${curBoltProperty.xValue + curBoltProperty.yValue || '-'}</p>
// </div>
// <div class="border-l border-slate-200 pl-4">
// <p class="text-[10px] text-slate-500 uppercase font-medium mb-1">Bolt Diameter</p>
// <p class="text-base font-bold text-slate-900">${curBolt.nominalDiameter} mm</p>
// </div>
// <div class="border-l border-slate-200 pl-4">
// <p class="text-[10px] text-slate-500 uppercase font-medium mb-1">Tensile Stress Area (A't)</p>
// <p class="text-base font-bold font-mono text-slate-900">${formatNumber(boltArea, 1)} mm²</p>
// </div>
// </div>
// </div>
// </div>
// </div>
// <div class="mb-12">
// <h3 class="text-xs font-semibold text-slate-400 uppercase mb-4 px-1">Stress and Load Verification</h3>
// <table class="w-full">
// <thead>
// <tr class="bg-slate-50/50">
// <th class="pl-3 w-2/5">Parameter/Calculation Description</th>
// <th class="text-right">Nominal Value</th>
// <th class="text-right">Allowable Limit</th>
// <th class="text-right pr-3">Status</th>
// </tr>
// </thead>
// <tbody>
// <tr>
// <td class="pl-3 font-medium text-slate-800">Tensile Stress </td>
// <td class="text-right font-mono">${formatNumber(tensileStress)} MPa</td>
// <td class="text-right font-mono text-slate-500">${formatNumber(tensileStressLimit)} MPa</td>
// <td class="text-right pr-3">
// ${renderStatus(isPass(tensileStress, tensileStressLimit))}
// </td>
// </tr>
// <tr>
// <td class="pl-3 font-medium text-slate-800">Shear Stress </td>
// <td class="text-right font-mono">${formatNumber(shearStress)} MPa</td>
// <td class="text-right font-mono text-slate-500">${formatNumber(shearStressLimit)} MPa</td>
// <td class="text-right pr-3">
// ${renderStatus(isPass(shearStress, shearStressLimit))}
// </td>
// </tr>
// <tr>
// <td class="pl-3 font-medium text-slate-800">Bearing Stress</td>
// <td class="text-right font-mono">${formatNumber(bearingStress)} MPa</td>
// <td class="text-right font-mono text-slate-500">${formatNumber(bearingStressLimit)} MPa</td>
// <td class="text-right pr-3">
// ${renderStatus(isPass(bearingStress, bearingStressLimit))}
// </td>
// </tr>
// <tr>
// <td class="pl-3 font-medium text-slate-800">Thread Shear Stress</td>
// <td class="text-right font-mono">${formatNumber(threadShearStress)} MPa</td>
// <td class="text-right font-mono text-slate-500">${formatNumber(threadShearLimit)} MPa</td>
// <td class="text-right pr-3">
// ${renderStatus(isPass(threadShearStress, threadShearLimit))}
// </td>
// </tr>

// <tr>
// <td class="pl-3 font-medium text-slate-800">Preload Stress</td>
// <td class="text-right font-mono">${formatNumber(preloadStress)} MPa</td>
// <td class="text-right font-mono text-slate-500">${formatNumber(preloadLimit)} MPa</td>
// <td class="text-right pr-3">
// ${renderStatus(isPass(preloadStress, preloadLimit))}
// </td>
// </tr>
// <tr>
// <td class="pl-3 font-medium text-slate-800">Separation Load</td>
// <td class="text-right font-mono">${formatNumber(separationLoad, 2)} kN</td>
// <td class="text-right font-mono text-slate-500">${formatNumber(separationLimit, 2)} kN (Min)</td>
// <td class="text-right pr-3">
// ${renderStatus(isPass(separationLimit, separationLoad))}
// </td>
// </tr>
// </tbody>
// </table>
// </div>
// <div class="action-section border-t border-slate-100 mt-12 pt-10">
// <div class="bg-slate-50/50 border border-slate-200 rounded-xl p-6 flex items-center justify-between">
// <div>
// <h4 class="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">Recalculate</h4>
// <p class="text-slate-500 text-sm">Want to calculate again? Visit Bolt Calculator</p>
// </div>
// <a class="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm uppercase tracking-wide no-print" href="https://bolt-calculator.vercel.app/home">
// <span class="material-icons-round text-lg">calculate</span>
//                             Go to Calculator
//                         </a>
// </div>
// </div>
// </section>
// </div>
// <footer class="mt-auto pt-8 border-t border-slate-200">
// <div class="flex justify-between items-end">
// <div>
// <p class="text-[10px] text-slate-400 max-w-xl italic leading-relaxed">
//                         Disclaimer: This report is generated by BoltCalculator and is intended for engineering reference only. Final design decisions should be verified by a licensed professional engineer according to regional standards (ASME/ISO/Eurocode). Calculated safety factor is 2.0 (Yield basis).
//                     </p>
// </div>
// <div class="text-right">
// <p class="text-xs text-slate-500 font-semibold uppercase tracking-widest">Page 1 of 1</p>
// <p class="text-[10px] text-slate-400 mt-1">Generated by BoltCalculator Engineering Suite</p>
// </div>
// </div>
// </footer>
// </div>

// </body></html>
//   `;
// }
