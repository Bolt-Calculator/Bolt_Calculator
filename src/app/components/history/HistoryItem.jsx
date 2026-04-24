export default function HistoryItem({ item, index, formatDate, onViewReport }) {
  return (
    <div
      key={index}
      className="group bg-white dark:bg-[#2a1d17] p-6 rounded-xl border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all shadow-sm"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold dark:text-white mb-1">
            Selected Bolt - {item.curBolt.designation}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              schedule
            </span>
            {formatDate(item.userInputData.calculatedAt)}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Number of Bolts
              </p>
              <p className="text-sm font-semibold dark:text-slate-200">
                {item.userInputData.numberOfBolts ?? 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Plate Thickness
              </p>
              <p className="text-sm font-semibold dark:text-slate-200">
                {item.userInputData.plateThickness.toFixed(2)} mm
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                External Load
              </p>
              <p className="text-sm font-semibold dark:text-slate-200">
                {item.userInputData.externalLoad} N
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Grade
              </p>
              <p className="text-sm font-semibold dark:text-slate-200">
                {item.curBoltProperty.className}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Bolt Diameter
              </p>
              <p className="text-sm font-semibold dark:text-slate-200">
                {item.curBolt.nominalDiameter} mm
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            className={`w-full md:w-auto px-6 py-2.5 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-lg text-sm font-bold flex items-center justify-center gap-2`}
            onClick={() => onViewReport(index)}
          >
            View Report
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
