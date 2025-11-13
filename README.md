# player-video-zustand

Documentação da aplicação "player-video-zustand" — um exemplo/mini-aplicação de um player de vídeo em React + TypeScript usando Vite e Zustand para gerenciamento de estado.

> Observação: este documento é uma visão abrangente e orientada a desenvolvedores para entender, executar, estender e manter a aplicação. Ajuste exemplos e trechos conforme o código real do repositório, quando necessário.

## Sumário

- Visão geral
- Funcionalidades
- Arquitetura e decisões técnicas
- Pré-requisitos
- Instalação e execução
- Scripts disponíveis
- Estrutura de pastas sugerida
- State management (Zustand)
  - Estrutura da store
  - Exemplo de uso
- Componentes principais
  - Player
  - Controls
  - ProgressBar
  - VolumeControl
  - FullscreenToggle
- Integração com HTMLMediaElement (API do vídeo)
- Testes
- Boas práticas e recomendações
- Como contribuir
- Troubleshooting (Problemas comuns)
- Licença

---

## Visão geral

O objetivo desta aplicação é fornecer um player de vídeo customizado construído com:

- React + TypeScript
- Vite (dev server e build)
- Zustand (gerenciamento de estado leve e simples)
- CSS/SCSS (ou algum framework de estilos, ex.: Tailwind, dependendo do projeto)

O foco principal é demonstrar um fluxo reativo para controlar reprodução, seek, volume, estado de carregamento e dados associados ao player usando uma store centralizada com Zustand.

## Funcionalidades

- Play / Pause
- Seek (barra de progresso com arrastar)
- Mostrar tempo atual / duração
- Controle de volume e mute
- Toggle de fullscreen
- Indicadores de buffering / carregamento
- Possibilidade de suportar múltiplas fontes (formats / HLS)
- Eventos expostos para integração (callbacks ou hooks)

## Arquitetura e decisões técnicas

- Estado do player centralizado em uma store Zustand para fácil compartilhamento entre componentes (controls, barra de progresso, info).
- Componentização: componente `Player` é responsável por renderizar o elemento `<video>` e sincronizar eventos nativos; subcomponentes consumem a store para exibir/controlar o estado.
- TypeScript para segurança de tipos e melhor DX.
- Vite para bundling rápido durante desenvolvimento e build.

Motivação por Zustand:
- API simples e pequena.
- Evita prop drilling e uso excessivo de Context + reducers para este caso simples de estado do player.

## Pré-requisitos

- Node.js >= 16 (recomendado 18+)
- npm >= 8 ou yarn / pnpm
- Navegador moderno (Chrome, Firefox, Safari ou Edge) para rodar localmente

## Instalação e execução

Passos básicos (usando npm):

1. Clone o repositório:
   ```bash
   git clone https://github.com/Mraimundo/player-video-zustand.git
   cd player-video-zustand
   ```

2. Instale dependências:
   ```bash
   npm install
   # ou
   # yarn
   # pnpm install
   ```

3. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador em:
   ```
   http://localhost:5173
   ```

5. Build para produção:
   ```bash
   npm run build
   npm run preview
   ```

Ajuste os comandos se você usa yarn/pnpm ou se os scripts diferem no package.json.

## Scripts disponíveis

(Exemplos típicos; verifique package.json para confirmar.)

- npm run dev — iniciar servidor de desenvolvimento (Vite)
- npm run build — compilar para produção
- npm run preview — pré-visualizar build de produção
- npm run lint — executar lint (ESLint)
- npm run test — executar testes unitários
- npm run format — aplicar formatação (Prettier)

## Estrutura de pastas sugerida

(Organização típica — adapte ao repositório real)

```
src/
  assets/
  components/
    Player/
      Player.tsx
      Player.module.css
    Controls/
      Controls.tsx
      PlayPauseButton.tsx
      ProgressBar.tsx
      VolumeControl.tsx
      FullscreenToggle.tsx
  hooks/
    useVideoElement.ts
  stores/
    usePlayerStore.ts
  utils/
    time.ts
  App.tsx
  main.tsx
index.html
```

## State management (Zustand)

Exemplo de como a store pode ser estruturada (simplificada):

```ts
// src/stores/usePlayerStore.ts
import create from 'zustand'

type PlayerState = {
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  buffering: boolean
  setPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (v: number) => void
  setMuted: (m: boolean) => void
  setBuffering: (b: boolean) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  playing: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  buffering: false,
  setPlaying: (playing) => set({ playing }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ muted }),
  setBuffering: (buffering) => set({ buffering }),
}))
```

### Exemplo de uso no componente Controls

```tsx
import { usePlayerStore } from '../stores/usePlayerStore'

function PlayPauseButton() {
  const { playing, setPlaying } = usePlayerStore()
  return (
    <button onClick={() => setPlaying(!playing)}>
      {playing ? 'Pause' : 'Play'}
    </button>
  )
}
```

## Componentes principais

A seguir descrevo os componentes esperados e responsabilidades. Ajuste nomes e APIs conforme implementado no projeto.

- Player (Player.tsx)
  - Renderiza o elemento `<video>`/`<audio>`
  - Registra listeners: loadmetadata, timeupdate, play, pause, waiting, playing, volumechange
  - Sincroniza o estado com a store (setDuration, setCurrentTime, setBuffering, setVolume, setMuted, setPlaying)
  - Exemplo de props:
    - src: string | string[] (source(s))
    - poster?: string
    - autoPlay?: boolean
    - muted?: boolean
    - controls?: boolean (se true mostra controles nativos — normalmente false)

- Controls (Controls.tsx)
  - Composição dos controles: PlayPause, ProgressBar, TimeDisplay, VolumeControl, FullscreenToggle
  - Consome a store para atualizar comandos

- ProgressBar (ProgressBar.tsx)
  - Exibe progresso baseado em currentTime/duration
  - Permite seek (drag/click) e atualiza currentTime na store ou chama uma callback do Player

- VolumeControl (VolumeControl.tsx)
  - Slider para volume
  - Botão de mute/unmute

- FullscreenToggle (FullscreenToggle.tsx)
  - Usa a Fullscreen API do browser para alternar tela cheia
  - Deve manipular fallback quando a API não estiver disponível

## Integração com HTMLMediaElement

O Player sincroniza a store com o elemento de mídia:

- Ao receber setPlaying(true) pela store, chamar videoElement.play()
- Ao receber setPlaying(false), chamar videoElement.pause()
- Ao alterar volume na store, ajustar videoElement.volume e videoElement.muted
- Ao arrastar o progress bar, atualizar currentTime e chamar videoElement.currentTime = newTime

Cuidados:
- Chamadas a play() retornam Promise; trate refused play em browsers (autoplay policies)
- Debounce/throttle de eventos frequentíssimos (timeupdate) se necessário

## Hook utilitário (recomendado)

useVideoElement: encapsula ref para elemento <video> e helpers:

```ts
function useVideoElement() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const play = async () => { if (videoRef.current) await videoRef.current.play() }
  const pause = () => videoRef.current?.pause()
  // etc...
  return { videoRef, play, pause, seek: (t:number) => { if(videoRef.current) videoRef.current.currentTime = t } }
}
```

## Utilitários

- time.ts — conversão de segundos para mm:ss
- throttle/debounce helpers para performance nos eventos

## Testes

Recomenda-se:

- Testes unitários com Vitest/Jest para lógica de utilitários e stores
- Testes de componentes com Testing Library (React Testing Library) para interações do player
- Testes e2e com Playwright/Cypress para fluxo de reprodução real (abrir, play, seek, fullscreen)

Exemplo de teste simples para store:

```ts
import { usePlayerStore } from './usePlayerStore'
test('setCurrentTime updates currentTime', () => {
  const { setCurrentTime } = usePlayerStore.getState()
  setCurrentTime(12)
  expect(usePlayerStore.getState().currentTime).toBe(12)
})
```

## Boas práticas e recomendações

- Sincronize apenas o necessário entre store e DOM; evite loops (ex.: setCurrentTime que dispara timeupdate que volta a setCurrentTime) — use checagens.
- Trate erros de play() (autoplay bloqueado) e exponha estados para UI (ex.: mostrar botão "Tocar").
- Para múltiplas instâncias de players na mesma página, crie stores isoladas por instância (fábrica de store ou contexto que injeta a store).
- Use aria-labels e roles para acessibilidade (Play/Pause, Seek, Volume).
- Forneça fallback para dispositivos móveis e navegadores antigos.

## Como contribuir

1. Fork do repositório
2. Crie uma branch: feat/minha-nova-funcionalidade
3. Faça commits atômicos e descritivos
4. Abra PR descrevendo:
   - O que foi alterado
   - Como testar manualmente
   - Links para issues relacionadas (se houver)
5. Mantenha o estilo do projeto (lint / prettier)

## Troubleshooting (Problemas comuns)

- Vídeo não inicia automaticamente:
  - Policy de autoplay do navegador requer que esteja mudo ou que o usuário interaja antes.
- play() retorna uma Promise rejeitada:
  - Use try/catch e exiba mensagem para usuário ou esperar interação.
- Barra de progresso não acompanha:
  - Verifique se o evento timeupdate está registrado e atualiza a store.
- Fullscreen não funciona:
  - Checar se o elemento container está sendo usado para requestFullscreen e suportado pelo browser.

## FAQ

- Posso usar HLS (m3u8)?
  - Sim. Para HLS em navegadores sem suporte nativo (ex.: Safari tem suporte, Chrome não), integre `hls.js` e anexe as fontes ao elemento video via MediaSource.
- Como lidar com legendas?
  - Adicione <track kind="subtitles" src="..." srclang="pt" label="Português"> no <video> e controle a visualização nas preferências.

## Exemplo rápido de integração (Player + Controls)

```tsx
// App.tsx
import Player from './components/Player/Player'
import Controls from './components/Controls/Controls'

export default function App() {
  return (
    <div className="app">
      <Player src="/assets/sample.mp4" poster="/assets/poster.jpg">
        <Controls />
      </Player>
    </div>
  )
}
```

## Licença

(Adicionar a licença do projeto, ex.: MIT)

---

Se quiser, eu posso:
- Gerar esse README.md diretamente no repositório (push) — me diga se quer que eu crie/atualize o arquivo e em qual branch.
- Gerar documentação adicional (ex.: docs/architecture.md, docs/api.md) com diagramas ou referência de componentes e tipos TypeScript.
- Inspecionar arquivos do repositório e adaptar a documentação automaticamente para refletir a estrutura real do código.

O que prefere que eu faça a seguir?
