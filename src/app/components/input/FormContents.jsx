import InfoTooltip from '../InfoTooltip';

export default function FormContents({
  formData,
  onInputChange,
  onSubmitForm,
  onReset,
}) {
  return (
    <form onSubmit={onSubmitForm} className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <span className="material-icons-round text-xl">straighten</span>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">
              Geometry Settings
            </h3>
          </div>
          <div className="space-y-6">
            <div className="group">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Number of Bolts</span>
                <InfoTooltip>
                  Total number of bolts sharing the joint load.
                  <br />
                  This value is passed to the backend for processing and must be
                  a whole number greater than zero.
                </InfoTooltip>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-100"
                  placeholder="4"
                  type="number"
                  name="numberOfBolts"
                  min="1"
                  step="1"
                  value={formData.numberOfBolts}
                  onChange={onInputChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  count
                </span>
              </div>
            </div>

            <div className="group">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Plate Thickness</span>
                <InfoTooltip>
                  Thickness of the clamped member stack contributing to joint
                  stiffness.
                  <br />
                  Used for calculating member stiffness and load distribution
                  between bolt and plates.
                  <br />
                  Use effective grip length, not nominal plate size.
                </InfoTooltip>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-100"
                  placeholder="10.00"
                  type="number"
                  name="plateThickness"
                  value={formData.plateThickness}
                  onChange={onInputChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  mm
                </span>
              </div>
            </div>

            <div className="group">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Engaged Thread Length (L&apos;e)</span>
                <InfoTooltip>
                  Effective length of threads engaged in the nut or tapped hole.
                  <br />
                  Used for thread stripping and load-sharing checks.
                  <br />
                  Excludes run-out and incomplete threads.
                </InfoTooltip>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-100"
                  placeholder="12.00"
                  type="number"
                  name="engagedThreadLength"
                  value={formData.engagedThreadLength}
                  onChange={onInputChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  mm
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <span className="material-icons-round text-xl">speed</span>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">
              Load Conditions
            </h3>
          </div>
          <div className="space-y-6">
            <div className="group">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>External Load</span>
                <InfoTooltip>
                  Axial service load applied to the joint after tightening.
                  <br />
                  Assumed to act in tension unless stated otherwise.
                  <br />
                  Used to compute additional bolt load based on joint stiffness
                  ratio.
                </InfoTooltip>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-100"
                  placeholder="5000"
                  type="number"
                  name="externalLoad"
                  value={formData.externalLoad}
                  onChange={onInputChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  N
                </span>
              </div>
            </div>

            <div className="group">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Preload (Fi)</span>
                <InfoTooltip>
                  Initial tensile force induced in the bolt during tightening.
                  <br />
                  Typically derived from torque–tension relation or recommended
                  preload percentage of proof load.
                  <br />
                  Critical for joint separation and fatigue checks.
                </InfoTooltip>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-100"
                  placeholder="8000"
                  type="number"
                  name="preLoad"
                  value={formData.preLoad}
                  onChange={onInputChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  N
                </span>
              </div>
            </div>

            <div className="group">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Lateral Load</span>
                <InfoTooltip>
                  Transverse shear load acting parallel to the joint interface.
                  <br />
                  Used for slip, bearing, or shear failure checks depending on
                  joint type (friction-grip or bearing-type).
                  <br />
                  Assumed uniformly distributed unless specified.
                </InfoTooltip>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-100"
                  placeholder="2000"
                  type="number"
                  name="lateralLoad"
                  value={formData.lateralLoad}
                  onChange={onInputChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  N
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="md:col-span-2 bg-slate-100 dark:bg-slate-800/20 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="material-icons-round text-xl">science</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Material Properties (Fixed)
              </h3>
            </div>
            <span className="material-icons-round text-slate-400 text-sm">
              lock
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                Young&apos;s Modulus (E)
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed"
                  disabled
                  readOnly
                  type="number"
                  value="210000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase">
                  N/mm²
                </span>
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                Safety Factor (S.F.)
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  disabled
                  readOnly
                  step="0.1"
                  type="number"
                  value="2.0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  ratio
                </span>
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                Material Grade
              </label>
              <div className="relative">
                <select
                  className="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 appearance-none cursor-not-allowed"
                  disabled
                >
                  <option>ISO (Carbon Steel)</option>
                  <option defaultValue>ISO 10.9 (Alloy Steel)</option>
                  <option>ISO 12.9 (High Tensile)</option>
                  <option>A2-70 (Stainless Steel)</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-border-light dark:border-border-dark pt-6 md:pt-8 gap-4">
        <button
          className="px-4 sm:px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2 order-2 sm:order-1"
          type="button"
          onClick={onReset}
        >
          <span className="material-icons-round text-lg">restart_alt</span>
          <span className="hidden sm:inline">Reset Parameters</span>
          <span className="sm:hidden">Reset</span>
        </button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 order-1 sm:order-2">
          <button
            className="px-6 sm:px-10 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            type="submit"
          >
            <span>RUN CALCULATION</span>
            <span className="material-icons-round">play_arrow</span>
          </button>
        </div>
      </div>
    </form>
  );
}
