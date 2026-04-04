# Portfólio

Um site de portfólio pessoal construído do zero com foco em animações sincronizadas com scroll, navegação fluida e uma experiência que presta atenção nos detalhes.

---

## O que tem aqui

### Navegação
A navbar flutua no topo da página no estilo da Dynamic Island do iOS — uma pílula com blur e borda translúcida. Ela destaca automaticamente qual seção está na tela enquanto você rola, e os links fazem scroll suave até o destino sem sobressaltos.

### Scroll cinematográfico
O scroll da página inteira passa pelo [Lenis](https://github.com/studio-freight/lenis), que dá aquela sensação de inércia suave que parece animação de verdade. O Lenis roda em sincronia com o GSAP para que todas as animações baseadas em scroll sejam frame-perfect.

### Animações de entrada
Cada seção tem seu próprio momento: títulos sobem linha por linha, cards aparecem em cascata, contadores numéricos sobem do zero. Tudo orquestrado com [GSAP](https://gsap.com/) + ScrollTrigger — nada dispara antes da hora.

### Carrossel controlado pelo scroll
A seção de portfólio usa um carrossel horizontal travado no viewport enquanto você continua descendo a página. O progresso do scroll vira movimento horizontal dos slides. O slide central fica em destaque (maior, mais iluminado), os outros recuam sutilmente. Dots de progresso atualizam em tempo real.

### Cards com modal de linha do tempo
Os três cards de destaque (Eu, Acadêmico, Carreira) abrem um modal ao clicar. Dentro de cada modal tem uma linha do tempo vertical com os principais marcos — cada entrada tem período, título, descrição e um badge de status (Concluído ou Em andamento). O fundo escurece e trava o scroll da página. Fechar: clicar fora, botão ✕ ou tecla `Escape`.

### Scroll por arrastar na modal
Dentro do modal dá pra rolar arrastando com o mouse ou o dedo — igual a um app nativo. Tem detecção de velocidade e inércia pós-soltura, então o conteúdo continua deslizando depois que você solta, com atrito gradual.

### Cursor customizado
Em dispositivos com mouse, o cursor padrão é substituído por um ponto pequeno com um anel defasado que segue com delay. Em elementos clicáveis o ponto expande. Em touch o cursor some e tudo volta ao normal do sistema.

### Seção Sobre com contadores
Quatro métricas (NPS, rating, prêmios, projetos) contam do zero até o valor real quando a seção entra na tela. O card principal tem um fundo em gradiente lilás e entra inclinado, endireitando na animação.

### Parallax e partículas
As orbs de gradiente no hero se movem em velocidades diferentes enquanto você sai da seção, criando profundidade sem peso visual.

---

## Stack

| O quê | Pra quê |
|---|---|
| HTML / CSS / JS vanilla | Sem framework, zero dependência de build |
| [GSAP 3](https://gsap.com/) + ScrollTrigger | Animações e sincronização com scroll |
| [Lenis](https://github.com/studio-freight/lenis) | Scroll suave com inércia |
| Google Fonts | Syne (títulos) + DM Sans (corpo) |

Sem npm, sem bundler, sem framework. Abre direto no browser.

---

## Estrutura

```
index.html   ← tudo em um arquivo: HTML + CSS + JS
README.md    ← você está aqui
```

O CSS usa custom properties (`--accent`, `--bg`, `--sh-md`...) para manter consistência visual. Todos os tamanhos usam `clamp()` para escalar suavemente entre mobile e desktop sem media queries desnecessárias.

## Responsividade

Testado e funcional em:

- Desktop (Chrome, Firefox, Safari, Edge)
- Mobile iOS Safari (com `-webkit-overflow-scrolling` e `100dvh`)
- Mobile Android Chrome
- Tablets em landscape e portrait

O carrossel, os grids e a tipografia se adaptam via `clamp()` e breakpoints pontuais. A navbar colapsa para logo + botão em telas menores que 620px.

---

## Personalização

Os dados das linhas do tempo ficam no objeto `MODAL_DATA` dentro do script, no final do arquivo. Cada entrada tem:

```js
{
  period: 'Jan 2023 → Dez 2023',
  title:  'Nome do evento',
  desc:   'Descrição do que aconteceu.',
  status: 'done' // ou 'ongoing'
}
```

Cores, fontes e espaçamentos ficam nas custom properties no `:root` no início do CSS.
