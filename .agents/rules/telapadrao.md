---
trigger: glob
globs: Tipo de tela Padrao
---

1. Estrutura de Layout (Container)
Largura Máxima: max-w-[1600px] mx-auto (garante que o conteúdo não se espalhe demais em monitores ultra-wide).
Espaçamento Vertical: space-y-6 (espaço entre o título e o card principal).
Animação: animate-in fade-in duration-500 para uma entrada suave.
2. Cabeçalho (Título e Subtítulo)
Estilo: Sem fundo, sem bordas, apenas texto sobre o fundo da página.
Container: flex flex-col md:flex-row justify-between items-center py-4.
Título Principal: text-2xl font-black uppercase tracking-tighter (estilo impactante e compacto).
Ícone do Módulo: Tamanho fixo size={24}.
Subtítulo: text-muted text-xs mt-1 font-medium italic (discreto e elegante).
3. Container de Dados (O Card Principal)
Bordas: border border-card-border/50 com rounded-[5px].
Efeito de Profundidade: Uma shadow-sm leve e um anel interno sutil: ring-1 ring-black/5 dark:ring-white/5.
Organização Interna: O card é dividido em Toolbar (cima) e Tabela (baixo).
4. Toolbar (Filtros e Busca)
Padding: Reduzido para p-4 (anteriormente era p-6).
Barra de Busca:
Input com py-2.5 e ícone size={18}.
Borda arredondada rounded-xl para contraste com o resto do sistema que é mais quadrado.
Botões de Ação (ex: "Novo Cadastro"):
Altura: py-2.5 (compacto).
Texto: font-black text-xs uppercase tracking-widest.
Borda: rounded-[5px].
Dropdowns (Selects):
Altura: py-2.5.
Texto: text-xs font-black uppercase tracking-widest.
Ícones de filtro/seta: size={16}.
5. Tabela de Dados (Densidade Máxima)
Cabeçalho (thead):
Fundo: bg-background (leve contraste com o card).
Células: py-2.5 px-6 (altura reduzida).
Texto: text-[10px] font-black uppercase tracking-[0.2em] text-muted.
Linhas de Conteúdo (tbody tr):
Altura da Célula: py-2 px-6 (isso cria o efeito de 20% menor na altura).
Hover: hover:bg-background/40 transition-all.
Elementos Internos:
Badges de Status: text-[9px] font-black uppercase px-2 py-0.5 rounded-md.
IDs/Códigos: font-mono text-xs font-black px-2 py-0.5 bg-background/50.
Textos de Nome/Descrição: font-black text-sm uppercase tracking-tight.
6. Paginação (Padrão 10 itens)
Sempre posicionada no rodapé do card principal.
Botões de navegação pequenos e discretos, mantendo o padrão de bordas de 5px.
Dica de Implementação: Ao aplicar no Financeiro ou Estoque, priorize o uso de cores de destaque apenas nos ícones e botões de ação principal (como o botão "Novo"). O resto do layout deve permanecer em tons de cinza/muted para que a interface não fique "cansativa" visualmente.