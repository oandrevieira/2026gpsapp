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
  
  // Focus Area serve para Body (weight_loss/muscle) e Mind (anxiety/study)
  const [focusArea, setFocusArea] = useState<string>(''); 
  
  const [customAction, setCustomAction] = useState('');

  const handleSubmit = async () => {
    if (!title) return alert("Defina um título para sua meta.");
    
    // Validação básica
    if (category === 'body' && !focusArea) return alert("Selecione um foco para o corpo.");
    if (category === 'mind' && !focusArea) return alert("Selecione um foco para a mente.");
    if (category === 'custom' && !customAction) return alert("Defina a ação diária.");

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let targetVal = 0;
      let currentVal = 0;
      let finalFocusArea = null;
      let finalCustomAction = null;

      // Mapeamento de Dados baseado na Categoria
      switch (category) {
        case 'finance':
          targetVal = Number(financeTarget);
          currentVal = Number(financeCurrent);
          break;
        case 'body':
          targetVal = 365; 
          finalFocusArea = focusArea; // 'weight_loss' | 'muscle'
          break;
        case 'mind':
          targetVal = 365;
          finalFocusArea = focusArea; // 'anxiety' | 'study'
          break;
        case 'custom':
          targetVal = 365;
          finalCustomAction = customAction;
          break;
      }

      // Payload exato para o Supabase
      const payload = {
        user_id: user.id,
        title: title,
        category: category,
        focus_area: finalFocusArea,
        target_value: targetVal,
        current_value: currentVal,
        custom_action: finalCustomAction
      };

      console.log("Enviando Payload:", payload);

      const { error } = await supabase.from('goals').insert(payload);

      if (error) {
        console.error("Erro Supabase Detalhado:", error);
        throw error;
      }
      
      onComplete();

    } catch (error: any) {
      console.error("Erro geral:", error);
      alert(`Erro ao salvar: ${error.message || error.details || 'Verifique o console'}`);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'finance', label: 'FINANCEIRO', icon: <DollarSign className="w-6 h-6" />, desc: 'Acumular R$ ou Pagar Dívidas' },
    { id: 'body', label: 'CORPO / SAÚDE', icon: <Dumbbell className="w-6 h-6" />, desc: 'Bio-Hacking e Estética' },
    { id: 'mind', label: 'MENTE / FOCO', icon: <Brain className="w-6 h-6" />, desc: 'Ansiedade ou Estudos' },
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
              placeholder="Ex: Liberdade, Shape, Aprovação..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id as GoalCategory);
                    // Reset sub-states
                    setFocusArea('');
                  }}
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
            
            {/* --- FINANCEIRO --- */}
            {category === 'finance' && (
              <>
                <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <DollarSign />
                   <h3 className="text-xl font-bold uppercase">Parâmetros Financeiros</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">O sistema calculará automaticamente a meta diária.</p>
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

            {/* --- CORPO / SAÚDE --- */}
            {category === 'body' && (
              <>
                 <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <Dumbbell />
                   <h3 className="text-xl font-bold uppercase">Bio-Hacking Diário</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  IA Simulada rotacionará tarefas diárias otimizadas.
                </p>
                <div className="space-y-4">
                  <label className="block text-cyber-neon text-[10px] uppercase tracking-widest font-bold">Qual o foco?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFocusArea('weight_loss')}
                      className={`p-4 border rounded text-center uppercase text-xs font-bold tracking-widest ${focusArea === 'weight_loss' ? 'bg-cyber-neon text-black border-cyber-neon' : 'border-cyber-gray text-gray-400'}`}
                    >
                      Emagrecimento
                    </button>
                    <button 
                      onClick={() => setFocusArea('muscle')}
                      className={`p-4 border rounded text-center uppercase text-xs font-bold tracking-widest ${focusArea === 'muscle' ? 'bg-cyber-neon text-black border-cyber-neon' : 'border-cyber-gray text-gray-400'}`}
                    >
                      Hipertrofia
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* --- MENTE / ESTUDO (Atualizado) --- */}
            {category === 'mind' && (
              <>
                <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <Brain />
                   <h3 className="text-xl font-bold uppercase">Protocolo Mental</h3>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  Escolha o algoritmo de desenvolvimento pessoal.
                </p>
                
                <div className="space-y-4">
                  <label className="block text-cyber-neon text-[10px] uppercase tracking-widest font-bold">Qual o objetivo?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFocusArea('anxiety')}
                      className={`p-4 border rounded text-center uppercase text-xs font-bold tracking-widest ${focusArea === 'anxiety' ? 'bg-cyber-neon text-black border-cyber-neon' : 'border-cyber-gray text-gray-400'}`}
                    >
                      Anti-Ansiedade (Zen)
                    </button>
                    <button 
                      onClick={() => setFocusArea('study')}
                      className={`p-4 border rounded text-center uppercase text-xs font-bold tracking-widest ${focusArea === 'study' ? 'bg-cyber-neon text-black border-cyber-neon' : 'border-cyber-gray text-gray-400'}`}
                    >
                      Produtividade / Estudo
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* --- CUSTOM --- */}
            {category === 'custom' && (
              <>
                 <div className="flex items-center gap-3 text-cyber-neon mb-2">
                   <Rocket />
                   <h3 className="text-xl font-bold uppercase">Protocolo Livre</h3>
                </div>
                <FuturisticInput 
                  label="Qual a Ação Única Diária?"
                  placeholder="Ex: Ler 10 páginas, Ligar para 5 clientes..."
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