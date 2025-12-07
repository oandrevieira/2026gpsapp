import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FuturisticInput } from '../components/FuturisticInput';
import { NeonButton } from '../components/NeonButton';
import { AntigravityBackground } from '../components/AntigravityBackground';
import { ArrowRight, DollarSign, Dumbbell, Brain, Rocket, CheckCircle2 } from 'lucide-react';
import { GoalCategory } from '../types';

interface Props {
  onComplete: () => void;
}

export const OnboardingView: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Estado Centralizado
  const [category, setCategory] = useState<GoalCategory>('finance');
  const [title, setTitle] = useState('');
  
  // Estados Específicos
  const [financeTarget, setFinanceTarget] = useState('');
  const [financeCurrent, setFinanceCurrent] = useState('0');
  
  const [bodyFocus, setBodyFocus] = useState<'lose_weight' | 'hypertrophy'>('lose_weight');
  
  const [mindHabit, setMindHabit] = useState('');
  const [mindMinutes, setMindMinutes] = useState('');
  
  const [customAction, setCustomAction] = useState('');

  const handleSubmit = async () => {
    if (!title) return alert("Defina um título para sua meta.");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let targetVal = 0;
      let currentVal = 0;
      let finalDailyAction = '';

      // Mapeamento de Dados baseado na Categoria
      switch (category) {
        case 'finance':
          targetVal = Number(financeTarget);
          currentVal = Number(financeCurrent);
          finalDailyAction = 'SAVE'; // Placeholder
          break;
        case 'body':
          targetVal = 365; // Meta de consistência
          finalDailyAction = bodyFocus; // 'lose_weight' | 'hypertrophy'
          break;
        case 'mind':
          targetVal = 365; // Meta de consistência
          finalDailyAction = `${mindHabit}|${mindMinutes}`; // Formato: "Ler|30"
          break;
        case 'custom':
          targetVal = 365; // Meta de consistência
          finalDailyAction = customAction;
          break;
      }

      const { error } = await supabase.from('goals').insert({
        user_id: user.id,
        title: title,
        type: category,
        target_value: targetVal,
        current_value: currentVal,
        daily_action: finalDailyAction
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

  const categories = [
    { id: 'finance', label: 'FINANCEIRO', icon: <DollarSign className="w-6 h-6" />, desc: 'Acumular R$ ou Pagar Dívidas' },
    { id: 'body', label: 'CORPO / SAÚDE', icon: <Dumbbell className="w-6 h-6" />, desc: 'Emagrecer ou Hipertrofia' },
    { id: 'mind', label: 'MENTE / ESTUDO', icon: <Brain className="w-6 h-6" />, desc: 'Hábito diário fixo' },
    { id: 'custom', label: 'CUSTOM', icon: <Rocket className="w-6 h-6" />, desc: 'Objetivo livre' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-cyber-black relative overflow-hidden font-mono">
      
      <AntigravityBackground />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0"></div>

      <div className="max-w-xl mx-auto w-full relative z-10">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-block p-2 bg-cyber-dark border border-cyber-gray rounded-full mb-4">
             <span className="text-xs text-cyber-neon px-2">CONFIGURAÇÃO DO PROTOCOLO</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
            NOVA MISSÃO <span className="text-cyber-neon">2026</span>
          </h2>
          <p className="text-gray-500 mt-2 font-light">Selecione o arquétipo do seu objetivo.</p>
        </div>

        {step === 1 && (
          <div className="animate-fade-in-up space-y-6">
            <FuturisticInput 
              label="Nome da Missão (Título)"
              placeholder="Ex: Liberdade Financeira, Shape 2026..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as GoalCategory)}
                  className={`p-6 rounded-lg border text-left transition-all flex flex-col gap-3 group relative overflow-hidden ${
                    category === cat.id 
                    ? 'bg-cyber-neon/10 border-cyber-neon shadow-[0_0_20px_rgba(0,255,156,0.15)]' 
                    : 'bg-cyber-dark border-cyber-gray hover:border-gray-500'
                  }`}
                >
                  <div className={`${category === cat.id ? 'text-cyber-neon' : 'text-gray-400'} transition-colors`}>
                    {cat.icon}
                  </div>
                  <div>
                    <span className={`block text-sm font-bold tracking-widest ${category === cat.id ? 'text-white' : 'text-gray-300'}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">{cat.desc}</span>
                  </div>
                  {category === cat.id && (
                    <div className="absolute top-2 right-2 text-cyber-neon">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <NeonButton onClick={() => {
                if(!title) return alert('Título obrigatório.');
                setStep(2);
              }}>
                CONFIGURAR PARÂMETROS <ArrowRight className="inline ml-2 w-4 h-4" />
              </NeonButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up space-y-8 bg-cyber-dark/50 p-6 rounded-lg border border-cyber-gray backdrop-blur-md">
            
            {/* --- FORMULÁRIO FINANCEIRO --- */}
            {category === 'finance' && (
              <>
                <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <DollarSign />
                   <h3 className="text-xl font-bold uppercase">Parâmetros Financeiros</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">O sistema calculará automaticamente quanto você precisa economizar por dia baseado nos dias restantes do ano.</p>
                
                <FuturisticInput 
                  label="Valor Alvo Final (R$)"
                  type="number"
                  placeholder="Ex: 50000"
                  value={financeTarget}
                  onChange={(e) => setFinanceTarget(e.target.value)}
                />
                <FuturisticInput 
                  label="Valor Já Acumulado (R$)"
                  type="number"
                  placeholder="Ex: 1500"
                  value={financeCurrent}
                  onChange={(e) => setFinanceCurrent(e.target.value)}
                />
              </>
            )}

            {/* --- FORMULÁRIO CORPO/SAÚDE --- */}
            {category === 'body' && (
              <>
                 <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <Dumbbell />
                   <h3 className="text-xl font-bold uppercase">Bio-Hacking Diário</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  O sistema usará uma "IA Simulada" para rotacionar tarefas diárias otimizadas baseadas no dia do ano. Você não precisa decidir o que fazer.
                </p>

                <div className="space-y-4">
                  <label className="block text-cyber-neon text-[10px] uppercase tracking-widest font-bold">Qual o foco principal?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setBodyFocus('lose_weight')}
                      className={`p-4 border rounded text-center uppercase text-xs font-bold tracking-widest ${bodyFocus === 'lose_weight' ? 'bg-cyber-neon text-black border-cyber-neon' : 'border-cyber-gray text-gray-400'}`}
                    >
                      Emagrecimento
                    </button>
                    <button 
                      onClick={() => setBodyFocus('hypertrophy')}
                      className={`p-4 border rounded text-center uppercase text-xs font-bold tracking-widest ${bodyFocus === 'hypertrophy' ? 'bg-cyber-neon text-black border-cyber-neon' : 'border-cyber-gray text-gray-400'}`}
                    >
                      Hipertrofia
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* --- FORMULÁRIO MENTE/ESTUDO --- */}
            {category === 'mind' && (
              <>
                <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <Brain />
                   <h3 className="text-xl font-bold uppercase">Hábito Cognitivo</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  Defina uma rotina fixa. A repetição gera a excelência.
                </p>

                <FuturisticInput 
                  label="Qual o Hábito?"
                  placeholder="Ex: Ler, Meditar, Estudar Inglês..."
                  value={mindHabit}
                  onChange={(e) => setMindHabit(e.target.value)}
                />
                <FuturisticInput 
                  label="Tempo Diário (Minutos)"
                  type="number"
                  placeholder="Ex: 30"
                  value={mindMinutes}
                  onChange={(e) => setMindMinutes(e.target.value)}
                />
              </>
            )}

            {/* --- FORMULÁRIO CUSTOM --- */}
            {category === 'custom' && (
              <>
                 <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <Rocket />
                   <h3 className="text-xl font-bold uppercase">Protocolo Livre</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  Você define a regra do jogo.
                </p>

                <FuturisticInput 
                  label="Qual a Ação Única Diária?"
                  placeholder="Ex: Escrever 500 palavras, Fazer 1 venda..."
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                />
              </>
            )}

            <div className="flex gap-4 pt-8">
              <NeonButton variant="ghost" onClick={() => setStep(1)}>
                 VOLTAR
              </NeonButton>
              <NeonButton onClick={handleSubmit} isLoading={loading}>
                 INICIAR SISTEMA
              </NeonButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};