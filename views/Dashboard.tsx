import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Goal } from '../types';
import { NeonButton } from '../components/NeonButton';
import { AntigravityBackground } from '../components/AntigravityBackground';
import { LogOut, Settings, AlertTriangle, CheckCircle2, Trophy, Zap, RefreshCw } from 'lucide-react';
import { END_DATE, TASK_DATABASE } from '../constants';

interface Props {
  user: any;
}

export const DashboardView: React.FC<Props> = ({ user }) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckedToday, setIsCheckedToday] = useState(false);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [dailyMissionText, setDailyMissionText] = useState('');
  
  // Helpers
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const calculateDailyMission = (g: Goal) => {
    switch (g.category) {
      case 'finance':
        const today = new Date();
        const diffTime = Math.abs(END_DATE.getTime() - today.getTime());
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const remaining = g.target_value - g.current_value;
        const dailyNeed = remaining / diffDays;
        return `Economizar ou Gerar R$ ${dailyNeed.toFixed(2)}`;
      
      case 'body':
      case 'mind':
        // Lógica de Inteligência (Fake AI)
        if (g.focus_area && TASK_DATABASE[g.focus_area]) {
          const tasks = TASK_DATABASE[g.focus_area];
          const index = getDayOfYear() % tasks.length;
          return tasks[index];
        }
        return "Mantenha o foco no objetivo.";

      case 'custom':
        return g.custom_action || "Ação diária indefinida";
        
      default:
        return "Avançar 1% hoje.";
    }
  };

  const triggerCelebration = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00FF9C', '#FFFFFF', '#050505'],
        disableForReducedMotion: true
      });
    }
    
    try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.5);
    } catch(e) { console.error("Audio error", e) }
  };

  const fetchGoal = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setGoal(data);
        setDailyMissionText(calculateDailyMission(data));

        const todayStr = new Date().toISOString().split('T')[0];
        const lastCompleted = data.last_completed_at ? data.last_completed_at.split('T')[0] : null;
        setIsCheckedToday(todayStr === lastCompleted);
        
        // Percent logic
        let percent = 0;
        if (data.category === 'finance') {
            percent = data.target_value > 0 
            ? Math.min(100, (data.current_value / data.target_value) * 100) 
            : 0;
        } else {
             percent = (data.current_value / 365) * 100;
        }
        
        setTimeout(() => setAnimatedPercent(percent), 100);
      }
    } catch (error) {
      console.error('Error fetching goal:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckIn = async () => {
    if (!goal || isCheckedToday) return;

    triggerCelebration();
    setIsCheckedToday(true); 

    let increment = 0;
    if (goal.category === 'finance') {
        const today = new Date();
        const diffTime = Math.abs(END_DATE.getTime() - today.getTime());
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const remaining = goal.target_value - goal.current_value;
        increment = remaining / diffDays;
    } else {
        increment = 1; // Soma 1 dia de consistência
    }

    const newCurrent = goal.current_value + increment;
    
    // Atualizar barra visualmente
    let newPercent = 0;
    if (goal.category === 'finance') {
        newPercent = goal.target_value > 0 ? Math.min(100, (newCurrent / goal.target_value) * 100) : 0;
    } else {
        newPercent = (newCurrent / 365) * 100;
    }
    setAnimatedPercent(newPercent);

    try {
      await supabase.from('goals').update({
        current_value: newCurrent,
        last_completed_at: new Date().toISOString()
      }).eq('id', goal.id);
      
      setGoal({ ...goal, current_value: newCurrent, last_completed_at: new Date().toISOString() });
    } catch (e) {
      console.error(e);
      setIsCheckedToday(false); // Revert on error
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-cyber-black text-cyber-neon font-mono relative">
        <AntigravityBackground />
        <div className="w-16 h-16 border-4 border-cyber-neon border-t-transparent rounded-full animate-spin mb-4 relative z-10"></div>
        <span className="animate-pulse tracking-widest relative z-10">CARREGANDO DADOS...</span>
    </div>
  );
  
  if (!goal) return <div className="h-screen flex items-center justify-center bg-cyber-black text-white">Nenhuma meta encontrada.</div>;

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col relative overflow-hidden">
      
      <AntigravityBackground />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0"></div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-cyber-gray bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-50 animate-fade-in-up">
        <div>
            <h1 className="text-xl font-mono font-bold text-white tracking-tighter">OLÁ, <span className="text-cyber-neon drop-shadow-lg">{user.email?.split('@')[0].toUpperCase()}</span></h1>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse"></span>
                <p className="text-[10px] text-cyber-text uppercase tracking-widest">
                  {goal.category === 'finance' ? 'Protocolo Financeiro' : 
                   goal.category === 'body' ? 'Bio-Hacking Ativo' : 
                   goal.category === 'mind' ? 'Cognição Aumentada' : 'Protocolo Custom'}
                </p>
            </div>
        </div>
        <div className="flex gap-4">
            <button className="text-cyber-text hover:text-white transition-colors p-2 hover:bg-cyber-gray rounded"><Settings className="w-5 h-5" /></button>
            <button onClick={handleLogout} className="text-cyber-text hover:text-red-500 transition-colors p-2 hover:bg-red-900/20 rounded"><LogOut className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-8 max-w-xl mx-auto w-full relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Main Goal Card */}
        <div className="bg-cyber-dark p-6 rounded-lg border border-cyber-gray shadow-lg relative overflow-hidden group hover:border-cyber-neon/50 transition-colors duration-500">
            {/* Holographic Effect */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                <Trophy className="w-40 h-40 text-cyber-neon" />
            </div>
            
            <h2 className="text-cyber-text text-xs uppercase tracking-[0.2em] font-mono mb-3 border-l-2 border-cyber-neon pl-3">Objetivo Primário</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">{goal.title}</h3>
            
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between font-mono">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-cyber-black bg-cyber-neon">
                            Progresso Global
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-bold inline-block text-cyber-neon drop-shadow-[0_0_5px_rgba(0,255,156,0.8)]">
                            {animatedPercent.toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-sm bg-black border border-cyber-gray relative">
                    {/* Animated Bar with Shimmer */}
                    <div 
                        style={{ width: `${animatedPercent}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyber-neon transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_0_15px_#00FF9C] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
                <p className="text-xs text-right text-gray-500 font-mono">
                    {goal.category === 'finance' 
                        ? `ALVO: R$ ${goal.target_value.toLocaleString('pt-BR')} | ATUAL: R$ ${Math.floor(goal.current_value).toLocaleString('pt-BR')}`
                        : `DIAS: 365 | FEITOS: ${Math.floor(goal.current_value)}`
                    }
                </p>
            </div>
        </div>

        {/* Laser Focus Section */}
        <div className="flex-1 flex flex-col">
            <h2 className="text-cyber-text text-xs uppercase tracking-[0.2em] font-mono mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-[ping_1.5s_infinite]"></span>
                Foco Laser (Hoje)
            </h2>
            
            <div className={`flex-1 bg-cyber-dark border ${isCheckedToday ? 'border-cyber-neon shadow-[0_0_20px_rgba(0,255,156,0.1)]' : 'border-cyber-gray'} rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all duration-500 relative overflow-hidden group min-h-[300px]`}>
                
                {/* Scanner Line */}
                {!isCheckedToday && <div className="absolute top-0 left-0 w-full h-1 bg-cyber-neon/30 animate-scanline pointer-events-none blur-sm z-0"></div>}
                
                <h4 className="text-xl md:text-2xl text-white font-medium mb-10 max-w-sm mx-auto leading-relaxed relative z-10">
                    {dailyMissionText}
                </h4>
                
                <button 
                    onClick={handleCheckIn}
                    disabled={isCheckedToday}
                    className={`
                        w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform relative z-10
                        ${isCheckedToday 
                            ? 'bg-cyber-neon border-cyber-neon scale-110 shadow-[0_0_50px_#00FF9C]' 
                            : 'border-cyber-gray hover:border-cyber-neon hover:shadow-[0_0_30px_rgba(0,255,156,0.3)] hover:scale-105 active:scale-95 bg-cyber-black group-hover:border-cyber-neon/50'
                        }
                    `}
                >
                    {isCheckedToday ? (
                         <CheckCircle2 className="w-14 h-14 text-cyber-black animate-bounce" />
                    ) : (
                         <div className="relative">
                            <Zap className="w-12 h-12 text-gray-600 group-hover:text-cyber-neon transition-colors duration-300" />
                            <div className="absolute inset-0 animate-ping opacity-20 bg-cyber-neon rounded-full" />
                         </div>
                    )}
                </button>
                
                <p className={`mt-8 text-sm font-mono transition-colors relative z-10 ${isCheckedToday ? 'text-cyber-neon font-bold' : 'text-gray-500'}`}>
                    {isCheckedToday ? '/// MISSÃO CUMPRIDA. SYNC COMPLETE.' : '/// AGUARDANDO EXECUÇÃO'}
                </p>
                
                {/* AI / Focus Area Indicator */}
                {(goal.category === 'body' || goal.category === 'mind') && !isCheckedToday && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-gray-600">
                        <RefreshCw className="w-3 h-3" />
                        <span>IA: {goal.focus_area?.toUpperCase()}</span>
                    </div>
                )}
            </div>
        </div>

      </main>

      {/* Panic Footer */}
      <footer className="p-6 text-center relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <button 
            onClick={() => alert('Protocolo de Emergência: Beba 500ml de água, Respire fundo por 2 min e reorganize a agenda. Mantenha o foco.')}
            className="group flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded border border-transparent hover:border-red-900/50 hover:bg-red-900/10 transition-all"
        >
            <AlertTriangle className="w-4 h-4 text-red-700 group-hover:text-red-500" />
            <span className="text-red-900 group-hover:text-red-500 text-xs font-mono tracking-widest">BOTÃO DE PÂNICO (SOS)</span>
        </button>
      </footer>
    </div>
  );
};