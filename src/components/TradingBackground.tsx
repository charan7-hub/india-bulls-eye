import { useEffect, useRef } from 'react';

interface Symbol {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  char: string;
  color: string;
  drift: number;
  phase: number;
}

export default function TradingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const symbols: Symbol[] = [];

    const bullChars = ['▲', '△', '↑', '⬆', '₹', '+', '◆'];
    const bearChars = ['▼', '▽', '↓', '⬇', '−', '◇'];
    const greenShades = ['#00e676', '#00c853', '#4caf50', '#66bb6a', '#81c784'];
    const redShades = ['#ff1744', '#d50000', '#f44336', '#ef5350', '#e57373'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize symbols
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < count; i++) {
      const isBull = Math.random() > 0.45;
      symbols.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.8,
        size: 10 + Math.random() * 18,
        opacity: 0.04 + Math.random() * 0.12,
        char: isBull
          ? bullChars[Math.floor(Math.random() * bullChars.length)]
          : bearChars[Math.floor(Math.random() * bearChars.length)],
        color: isBull
          ? greenShades[Math.floor(Math.random() * greenShades.length)]
          : redShades[Math.floor(Math.random() * redShades.length)],
        drift: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of symbols) {
        // Bulls float up, bears float down
        const isBull = greenShades.includes(s.color);
        s.y += isBull ? -s.speed : s.speed;
        s.x += s.drift + Math.sin(time * 0.001 + s.phase) * 0.3;

        // Wrap around
        if (s.y < -30) s.y = canvas.height + 30;
        if (s.y > canvas.height + 30) s.y = -30;
        if (s.x < -30) s.x = canvas.width + 30;
        if (s.x > canvas.width + 30) s.x = -30;

        // Pulsing opacity
        const pulse = 0.6 + 0.4 * Math.sin(time * 0.002 + s.phase);
        ctx.globalAlpha = s.opacity * pulse;
        ctx.font = `${s.size}px sans-serif`;
        ctx.fillStyle = s.color;
        ctx.fillText(s.char, s.x, s.y);
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
