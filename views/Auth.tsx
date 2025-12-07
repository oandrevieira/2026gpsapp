import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FuturisticInput } from '../components/FuturisticInput';
import { NeonButton } from '../components/NeonButton';
import { AntigravityBackground } from '../components/AntigravityBackground';

export const AuthView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Fluxo de Cadastro
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { full_name: email.split('@')[0] } }
        });
        
        if (error) throw error;

        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
             throw new Error("Conta criada. Verifique se 'Confirm Email' está OFF no Supabase.");
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cyber-black relative font-mono overflow-hidden">
      
      {/* Backgrounds */}
      <AntigravityBackground />
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none animate-pulse z-0"></div>

      {/* Main Header Outside Box */}
      <div className="text-center mb-16 relative z-10 animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2 relative inline-block group cursor-default">
          GPS <span className="text-cyber-neon group-hover:animate-glitch inline-block">2026</span>
        </h1>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyber-gray to-transparent mb-4"></div>
        <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold animate-pulse">
          Sistema de Alta Performance
        </p>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-[400px] relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Green Corner Brackets (The "Frame" from the screenshot) */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyber-neon"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyber-neon"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyber-neon"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyber-neon"></div>

        {/* Card Content */}
        <div className="bg-black/90 backdrop-blur-md border border-gray-800/50 p-8 shadow-2xl relative z-10">
          
          <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest text-left">
            Login
          </h2>

          <div className="h-px w-full bg-gray-800 mb-8"></div>

          <form onSubmit={handleAuth} className="space-y-6">
            <FuturisticInput 
              label="ID DE ACESSO (E-MAIL)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="piloto@gps2026.com"
              required
            />
            
            <FuturisticInput 
              label="CÓDIGO (SENHA)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="text-red-500 text-xs text-center border border-red-900/50 bg-red-900/10 p-3 uppercase tracking-wide font-bold animate-pulse">
                 Erro: {error}
              </div>
            )}

            <div className="pt-4">
              <NeonButton type="submit" isLoading={loading}>
                {isLogin ? 'ACESSAR SISTEMA' : 'REGISTRAR NOVO ID'}
              </NeonButton>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Toggle */}
      <div className="mt-10 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <button 
          onClick={() => { setError(null); setIsLogin(!isLogin); }}
          className="text-gray-600 hover:text-cyber-neon text-xs uppercase tracking-[0.2em] transition-colors duration-300 border-b border-transparent hover:border-cyber-neon pb-1"
        >
          {isLogin ? '/// INICIAR NOVO PROTOCOLO (CRIAR CONTA)' : '/// RETORNAR AO ACESSO PADRÃO'}
        </button>
      </div>

    </div>
  );
};