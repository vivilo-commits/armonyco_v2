import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-stone-50 px-4 pt-24 pb-4 md:px-6 md:pt-28 md:pb-6 lg:px-8 lg:pt-32 lg:pb-8">
      
      {/* Hero Shell - Removed hover transforms and shadows */}
      <div className="ui-card relative min-h-[85vh] w-full flex flex-col justify-center items-start px-6 md:px-20 py-20 overflow-hidden rounded-3xl border-stone-200 shadow-sm cursor-default">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 p-12 opacity-40 pointer-events-none">
          <div className="w-[600px] h-[600px] border border-armonyco-gold/20 rounded-full blur-3xl bg-gradient-to-br from-armonyco-gold/10 to-transparent animate-pulse duration-10000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl w-full">
            <span className="inline-block py-1 px-3 rounded-full bg-stone-100 border border-stone-200 text-armonyco-gold font-mono tracking-[0.2em] text-[10px] mb-8 uppercase font-bold shadow-sm">
              System of Truth
            </span>
            
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-light text-stone-900 leading-[0.95] tracking-tighter mb-12">
              AI Trust & <br/><span className="font-normal italic">Control Layer</span>
            </h1>

            <div className="max-w-4xl space-y-12">
              <p className="text-xl md:text-3xl text-stone-600 font-light leading-relaxed">
                Armonyco is a system of operational truth: the layer that governs real-world execution, turning messy, human operations into certified value, measurable risk, and provable responsibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-12 border-t border-stone-100">
                <div className="space-y-1">
                  <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Legacy Systems</p>
                  <p className="text-stone-900 text-lg font-light">Where others <span className="font-normal border-b border-stone-300 pb-0.5">capture data</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-armonyco-gold text-xs uppercase tracking-widest font-bold">Armonyco</p>
                  <p className="text-stone-900 text-lg font-light">Armonyco <span className="font-normal border-b border-armonyco-gold pb-0.5">produces verdicts</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Legacy Reporting</p>
                  <p className="text-stone-900 text-lg font-light">Where others <span className="font-normal border-b border-stone-300 pb-0.5">report performance</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-armonyco-gold text-xs uppercase tracking-widest font-bold">Armonyco</p>
                  <p className="text-stone-900 text-lg font-light">Armonyco <span className="font-normal border-b border-armonyco-gold pb-0.5">delivers proof</span></p>
                </div>
              </div>
            </div>
        </div>
      </section>
  );
};