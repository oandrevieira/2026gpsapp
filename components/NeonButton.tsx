import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const NeonButton: React.FC<Props> = ({ children, variant = 'primary', isLoading, className, ...props }) => {
  const baseStyles = "w-full py-4 px-6 font-bold uppercase tracking-[0.15em] text-sm transition-all duration-200 transform active:scale-[0.98] flex justify-center items-center font-mono relative overflow-hidden group border";
  
  const variants = {
    // Primary: Solid Neon Block, Black Text (Matches Screenshot)
    primary: "bg-cyber-neon text-black border-cyber-neon hover:bg-white hover:border-white hover:text-black shadow-[0_0_15px_rgba(0,255,156,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] rounded-sm",
    
    // Danger: Red Border
    danger: "bg-transparent text-red-500 border-red-500 hover:bg-red-500 hover:text-white rounded-sm",
    
    // Ghost: Transparent with border
    ghost: "bg-transparent text-gray-400 border-gray-700 hover:border-cyber-neon hover:text-cyber-neon rounded-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className || ''}`} 
      disabled={isLoading}
      {...props}
    >
      {/* Background slide animation for Ghost/Danger */}
      {variant !== 'primary' && (
        <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity"></div>
      )}

      {isLoading ? (
        <span className="flex items-center gap-2">
           <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
           <span className="w-2 h-2 bg-current rounded-full animate-bounce delay-75"></span>
           <span className="w-2 h-2 bg-current rounded-full animate-bounce delay-150"></span>
        </span>
      ) : (
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      )}
    </button>
  );
};