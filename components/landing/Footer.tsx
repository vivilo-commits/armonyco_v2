import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-24 px-6 md:px-24 bg-stone-900 border-t border-stone-800 text-stone-400">
      <div className="flex justify-between items-center text-xs text-stone-600 uppercase tracking-widest">
        <span>Armonyco</span>
        <span>© 2024 System of Truth</span>
      </div>
    </footer>
  );
};