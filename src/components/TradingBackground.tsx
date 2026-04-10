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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function TradingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const prevMouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const symbols: Symbol[] = [];
    const particles: Particle[] = [];
    const HOVER_RADIUS = 120;
    const MAX_PARTICLES = 80;

    const bullChars = ['▲', '△', '↑', '⬆', '₹', '+', '◆'];
    const bearChars = ['▼', '▽', '↓', '⬇', '−', '◇'];
    const greenShades = ['#00e676', '#00c853', '#4caf50', '#66bb6a', '#81c784'];
    const redShades = ['#ff1744', '#d50000', '#f44336', '#ef5350', '#e57373'];
    const trailColors = ['#00e5ff', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      prevMouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

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

    const spawnParticles = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const pmx = prevMouseRef.current.x;
      const pmy = prevMouseRef.current.y;

      if (mx < -500 || pmx < -500) return;

      const moveDist = Math.sqrt((mx - pmx) ** 2 + (my - pmy) ** 2);
      if (moveDist < 2) return;

      const spawnCount = Math.min(Math.floor(moveDist / 8) + 1, 3);
      for (let i = 0; i < spawnCount; i++) {
        if (particles.length >= MAX_PARTICLES) {
          // Recycle oldest
          const oldest = particles.reduce((a, b) => (a.life < b.life ? a : b));
          const idx = particles.indexOf(oldest);
          particles.splice(idx, 1);
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.2;
        particles.push({
          x: mx + (Math.random() - 0.5) * 8,
          y: my + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 40 + Math.random() * 30,
          size: 1.5 + Math.random() * 2.5,
          color: trailColors[Math.floor(Math.random() * trailColors.length)],
        });
      }
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Spawn trail particles
      spawnParticles();

      // Draw symbols
      for (const s of symbols) {
        const isBull = greenShades.includes(s.color);
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearCursor = dist < HOVER_RADIUS;
        const proximity = nearCursor ? 1 - dist / HOVER_RADIUS : 0;

        const speedMult = 1 + proximity * 3;
        s.y += (isBull ? -s.speed : s.speed) * speedMult;
        s.x += (s.drift + Math.sin(time * 0.001 + s.phase) * 0.3) * speedMult;

        if (nearCursor) {
          const pushStrength = proximity * 1.5;
          s.x += (dx / dist) * pushStrength;
          s.y += (dy / dist) * pushStrength;
        }

        if (s.y < -30) s.y = canvas.height + 30;
        if (s.y > canvas.height + 30) s.y = -30;
        if (s.x < -30) s.x = canvas.width + 30;
        if (s.x > canvas.width + 30) s.x = -30;

        const pulse = 0.6 + 0.4 * Math.sin(time * 0.002 + s.phase);
        const hoverGlow = s.opacity + proximity * 0.25;
        ctx.globalAlpha = hoverGlow * pulse;
        ctx.font = `${s.size + proximity * 6}px sans-serif`;
        ctx.fillStyle = s.color;
        ctx.fillText(s.char, s.x, s.y);
      }

      // Draw & update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.life += 1;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = (1 - progress) * 0.5;
        const radius = p.size * (1 - progress * 0.5);

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Subtle glow
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
