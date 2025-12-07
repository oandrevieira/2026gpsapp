import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FuturisticInput: React.FC<Props> = ({ label, ...props }) => {
  return (
    <div className="mb-4 w-full group">
      <label className="block text-cyber-neon text-[10px] uppercase tracking-widest mb-2 font-bold font-mono group-hover:text-cyber-neonHover transition-colors">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 rounded-sm focus:outline-none focus:border-cyber-neon focus:bg-cyber-dark/80 focus:shadow-[0_0_15px_rgba(0,255,156,0.1)] transition-all duration-300 font-mono text-sm placeholder-gray-700 shadow-inner"
      />
    </div>
  );
};