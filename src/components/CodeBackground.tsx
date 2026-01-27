import { useEffect, useRef } from 'react';

const codeSnippets = [
  'const bot = new TelegramBot();',
  'await bot.sendMessage(chatId, msg);',
  'function playMusic(url) {',
  '  return stream.pipe(output);',
  '}',
  'import { PyTgCalls } from "pytgcalls";',
  'async def start_handler():',
  '    await message.reply("🎵")',
  'const queue = new MusicQueue();',
  'queue.add(track);',
  'await voice.joinCall(chatId);',
  'stream.on("data", chunk => {',
  '  buffer.push(chunk);',
  '});',
  'export default bot;',
  'npm install pyrogram',
  'pip install pytgcalls',
  'docker-compose up -d',
  'git push origin main',
  'const API_ID = process.env.API_ID;',
  'session.connect();',
  'await client.start();',
  'return res.json({ success: true });',
  'if (isPlaying) pause();',
  'else resume();',
  '// Deploy music bot',
  '/* Uppermoon Devs */',
  'class MusicPlayer {',
  '  constructor() {',
  '    this.queue = [];',
  '  }',
  '}',
  'fetch("/api/deploy")',
  '.then(r => r.json())',
  'console.log("🚀 Bot started");',
  'app.listen(3000);',
];

const CodeBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createCodeLine = () => {
      const line = document.createElement('div');
      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      
      line.textContent = snippet;
      line.className = 'code-line';
      line.style.cssText = `
        position: absolute;
        font-family: 'JetBrains Mono', monospace;
        font-size: ${10 + Math.random() * 4}px;
        color: hsl(210 100% 56% / ${0.08 + Math.random() * 0.12});
        white-space: nowrap;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: -30px;
        animation: fall ${15 + Math.random() * 20}s linear forwards;
        text-shadow: 0 0 10px hsl(210 100% 56% / 0.3);
      `;
      
      container.appendChild(line);
      
      setTimeout(() => {
        line.remove();
      }, 35000);
    };

    // Initial burst
    for (let i = 0; i < 20; i++) {
      setTimeout(createCodeLine, i * 200);
    }

    // Continuous generation
    const interval = setInterval(createCodeLine, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden="true"
      />
      {/* Matrix-style grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(hsl(210 100% 56% / 0.03) 1px, transparent 1px),
            linear-gradient(90deg, hsl(210 100% 56% / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      {/* Scanline effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(210 100% 50% / 0.1) 2px, hsl(210 100% 50% / 0.1) 4px)',
        }}
      />
    </>
  );
};

export default CodeBackground;
