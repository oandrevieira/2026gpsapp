import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FuturisticInput } from '../components/FuturisticInput';
import { NeonButton } from '../components/NeonButton';
import { AntigravityBackground } from '../components/AntigravityBackground';
import { Calculator, ArrowRight, Activity, DollarSign, BookOpen, Star } from 'lucide-react';
import { END_DATE } from '../constants';

interface Props {
  onComplete: () => void;
}

export const OnboardingView: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [goalData, setGoalData] = useState({
    title: '',
    type: 'Financeiro',
    targetValue: '',
    customAction: ''
  });

  const calculateDaily = (target: number) => {
    const today = new Date();
    const diffTime = Math.abs(END_DATE.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return (target / diffDays).toFixed(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isNumeric = ['Financeiro', 'Saúde', 'Estudos'].includes(goalData.type) && !isNaN(Number(goalData.targetValue));
      const targetVal = isNumeric ? Number(goalData.targetValue) : 0;
      
      let dailyActionText = goalData.customAction;

      // Lógica do Plano Automático
      if (isNumeric && !dailyActionText) {
        const dailyVal = calculateDaily(targetVal);
        if (goalData.type === 'Financeiro') dailyActionText = `Economizar R$ ${dailyVal}`;
        if (goalData.type === 'Saúde') dailyActionText = `Cumprir ${dailyVal} unidades`;
        if (goalData.type === 'Estudos') dailyActionText = `Estudar ${dailyVal} páginas/min`;
      }

      const { error } = await supabase.from('goals').insert({
        user_id: user.id,
        title: goalData.title,
        type: goalData.type,
        target_value: targetVal,
        current_value: 0,
        daily_action: dailyActionText || 'Avançar 1% hoje'
      });

      if (error) throw error;
      onComplete();

    } catch (error) {
      console.error(error);
      alert('Erro na gravação de dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (t: string) => {
    switch(t) {
        case 'Financeiro': return <DollarSign className="w-4 h-4" />;
        case 'Saúde': return <Activity className="w-4 h-4" />;
        case 'Estudos': return <BookOpen className="w-4 h-4" />;
        default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-cyber-black relative overflow-hidden">
      
      {/* Backgrounds */}
      <AntigravityBackground />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0"></div>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-neon opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-lg mx-auto w-full relative z-10">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-block p-2 bg-cyber-dark border border-cyber-gray rounded-full mb-4">
             <span className="text-xs font-mono text-cyber-neon px-2">FASE {step}/2</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mb-2 leading-tight">
            TRADUTOR DE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-white">SONHOS</span>
          </h2>
          <p className="text-cyber-text mt-2 font-light">Configure sua Diretriz Primária para o ciclo 2026.</p>
        </div>

        {step === 1 && (
          <div className="animate-fade-in-up space-y-8">
            <FuturisticInput 
              label="Qual seu Grande Objetivo?"
              placeholder="Ex: Liberdade Financeira, Maratona..."
              value={goalData.title}
              onChange={(e) => setGoalData({...goalData, title: e.target.value})}
              autoFocus
            />
            
            <div>
              <label className="block text-cyber-text text-xs uppercase tracking-widest mb-3 font-mono">
                Categoria da Missão
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['Financeiro', 'Saúde', 'Estudos', 'Outro'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setGoalData({...goalData, type: type})}
                    className={`p-4 rounded border font-mono text-sm transition-all flex items-center gap-3 group relative overflow-hidden ${
                      goalData.type === type 
                      ? 'bg-cyber-neon/10 border-cyber-neon text-cyber-neon shadow-neon' 
                      : 'bg-cyber-dark border-cyber-gray text-gray-400 hover:border-cyber-text hover:text-white'
                    }`}
                  >
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-cyber-neon/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    
                    <span className="relative z-10">{getTypeIcon(type)}</span>
                    <span className="relative z-10">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
                <NeonButton onClick={() => {
                if(!goalData.title) return alert('Protocolo interrompido: Título obrigatório.');
                setStep(2);
                }}>
                AVANÇAR PARA CÁLCULO <ArrowRight className="inline ml-2 w-4 h-4" />
                </NeonButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up space-y-6">
            {goalData.type !== 'Outro' ? (
              <>
                <FuturisticInput 
                  label={`Alvo Numérico (${goalData.type})`}
                  type="number"
                  placeholder="Apenas números (ex: 10000)"
                  value={goalData.targetValue}
                  onChange={(e) => setGoalData({...goalData, targetValue: e.target.value})}
                  autoFocus
                />
                <div className="bg-cyber-dark/50 p-6 rounded border border-cyber-gray/50 flex items-start gap-4 hover:border-cyber-neon/30 transition-colors">
                  <div className="p-2 bg-cyber-black rounded border border-cyber-gray text-cyber-neon">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 font-mono uppercase tracking-wider">Algoritmo de Divisão</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      O sistema irá fracionar o valor total pelos dias restantes do ano, gerando uma micro-meta diária alcançável.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <FuturisticInput 
                label="Defina sua Ação Única Diária"
                placeholder="Ex: Ler 10 páginas, Beber 3L de água..."
                value={goalData.customAction}
                onChange={(e) => setGoalData({...goalData, customAction: e.target.value})}
                autoFocus
              />
            )}

            <div className="flex gap-4 pt-8">
              <NeonButton variant="ghost" onClick={() => setStep(1)}>
                 VOLTAR
              </NeonButton>
              <NeonButton onClick={handleSubmit} isLoading={loading}>
                 INICIAR PROTOCOLO 2026
              </NeonButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};