/**
 * Efek Konfeti Bertema Winnie the Pooh
 */
const Confetti = (() => {
  const colors = ['#F2B738', '#D3383A', '#6D8C5B', '#FFE082', '#F48FB1'];
  let particles = [];
  let animationId = null;

  function launch() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = Array.from({ length: 110 }, () => ({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 14 - 4,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      opacity: 1
    }));

    if (animationId) cancelAnimationFrame(animationId);

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeCount = 0;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.99;
        p.rotation += p.vr;
        if (p.y > canvas.height * 0.85) {
          p.opacity -= 0.025;
        }

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          activeCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          ctx.restore();
        }
      }

      if (activeCount > 0) {
        animationId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationId = null;
      }
    }

    frame();
  }

  return { launch };
})();
