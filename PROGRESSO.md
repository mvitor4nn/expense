# Progresso — Expense Control (Desempenho + lista de categorias)

## Concluído (tudo testado no navegador, sem erros de JavaScript)
- [x] Etapa 1: bolhas de categorias -> lista de barras sobre a foto (`bubble()` / `bubbleBlock()`), com % do total, ordenada do maior para o menor. Toque para abrir subcategorias e o filtro continuam iguais.
- [x] Etapa 2: aba "Histórico" -> "Desempenho" (pt/en/es), novo ícone, seletor Semana | Mês.
  - Semana: gráfico atual x anterior, "Gasto na semana" (com % vs anterior), "Maior dia", lista dos gastos da semana. Toque num ponto mostra o valor.
  - Mês: evolução dos últimos 6 meses com linha do limite (salário x limite%), "Gasto no mês", "Média 6 meses", e "Histórico por mês" (toque abre o mês).
- [x] Etapa 3: cache do `sw.js` subiu de expense-v2 para expense-v3.

## Para publicar
Substitua index.html e sw.js no seu servidor e abra o app duas vezes (a 1ª atualiza o cache).

## Ajustes fáceis (se quiser mudar)
- Início da semana: no index.html procure `var WEEK_START=0;` (0 = domingo, 1 = segunda).
- Cor da linha atual: classe `.chart .l-now` / `.d-now` (usa a cor de destaque do app, roxo).
- Foto de fundo: a força da camada escura é `.bg-dim{opacity:.45}`.

## Ainda não feito / ideias
- Só testei no computador (Chromium, tela de celular simulada). Falta você testar no seu celular com a foto de fundo real.
- Comparação "vs anterior" do mês compara o mês parcial atual com o mês fechado anterior.
- index.original.html = cópia do arquivo original, para comparar.
