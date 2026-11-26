/* ==========================================================================
   ROU7 PERFUME — LUXURY 3D MOTION ENGINE (luxury-motion.js)
   1. Real Three.js WebGL 3D Hero Ambient Scene (floating crystals, halos, mist)
   2. GPU-Accelerated 3D Tilt & Specular Spotlight on Cards
   3. Magnetic Pull Micro-Interaction on Primary CTAs
   4. Scroll-Triggered Staggered Reveal Animations (with fail-safe)
   5. Sticky Glass Header Scroll Depth
   Zero Interference with Existing App / Admin / Product Logic
   ========================================================================== */
(() => {
  'use strict';

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Inject Ambient Floating Mesh Orbs Background ──────────────────────
  function injectAmbientMesh() {
    if (document.querySelector('.rooh-ambient-mesh')) return;
    const mesh = document.createElement('div');
    mesh.className = 'rooh-ambient-mesh';
    mesh.setAttribute('aria-hidden', 'true');
    mesh.innerHTML =
      '<span class="rooh-orb rooh-orb-1"></span>' +
      '<span class="rooh-orb rooh-orb-2"></span>' +
      '<span class="rooh-orb rooh-orb-3"></span>';
    document.body.insertBefore(mesh, document.body.firstChild);
  }

  // ── 2. Sticky Glass Header Scroll Depth ──────────────────────────────────
  function initHeaderScrollState() {
    const header = document.querySelector('.site-header') || document.querySelector('.admin-topbar');
    if (!header) return;
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 16);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  // ── 3. Real Three.js WebGL 3D Hero Scene ─────────────────────────────────
  function initThreeHeroScene() {
    if (prefersReducedMotion) return;
    const heroSection = document.getElementById('home');
    if (!heroSection || !window.THREE) return;
    if (document.getElementById('roohThreeCanvas')) return;

    const THREE = window.THREE;
    let renderer;
    try {
      const canvas = document.createElement('canvas');
      canvas.id = 'roohThreeCanvas';
      canvas.setAttribute('aria-hidden', 'true');
      heroSection.insertBefore(canvas, heroSection.firstChild);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      renderer.setClearColor(0x000000, 0);
    } catch (err) {
      // WebGL unavailable — gracefully fall back to ambient CSS orbs
      const c = document.getElementById('roohThreeCanvas');
      if (c) c.remove();
      return;
    }

    const canvas = document.getElementById('roohThreeCanvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 11.5);

    // Warm luxury atelier lighting
    scene.add(new THREE.AmbientLight(0xfff6e8, 1.15));

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.45);
    keyLight.position.set(6, 8, 9);
    scene.add(keyLight);

    const amberLight = new THREE.PointLight(0xff8f3a, 2.2, 26);
    amberLight.position.set(-5.5, 2.5, 5);
    scene.add(amberLight);

    const sageLight = new THREE.PointLight(0x4b5a3c, 1.4, 24);
    sageLight.position.set(5.8, -3.5, 4);
    scene.add(sageLight);

    // Master parallax group
    const world = new THREE.Group();
    scene.add(world);

    // Floating translucent glass prisms framing the 3D bottle (never obstructing center)
    const crystalMatAmber = new THREE.MeshPhysicalMaterial({
      color: 0xffb36b,
      roughness: 0.14,
      metalness: 0.12,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    });

    const crystalMatGlass = new THREE.MeshPhysicalMaterial({
      color: 0xfff8ee,
      roughness: 0.1,
      metalness: 0.08,
      transparent: true,
      opacity: 0.46,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06
    });

    const crystalMatOlive = new THREE.MeshPhysicalMaterial({
      color: 0x5d6f4b,
      roughness: 0.2,
      metalness: 0.15,
      transparent: true,
      opacity: 0.34,
      clearcoat: 0.9
    });

    const prismSpecs = [
      { geo: new THREE.OctahedronGeometry(0.95, 0), mat: crystalMatAmber, pos: [-5.6, 2.1, -1.6], speed: 0.42, phase: 0.2 },
      { geo: new THREE.IcosahedronGeometry(0.72, 0), mat: crystalMatGlass, pos: [5.7, 2.3, -1.2], speed: 0.36, phase: 1.4 },
      { geo: new THREE.OctahedronGeometry(0.62, 0), mat: crystalMatOlive, pos: [-4.9, -2.4, -0.8], speed: 0.50, phase: 2.5 },
      { geo: new THREE.IcosahedronGeometry(0.88, 0), mat: crystalMatAmber, pos: [5.2, -2.2, -1.8], speed: 0.32, phase: 3.7 },
      { geo: new THREE.OctahedronGeometry(0.45, 0), mat: crystalMatGlass, pos: [-2.8, 3.0, -2.5], speed: 0.55, phase: 4.8 },
      { geo: new THREE.OctahedronGeometry(0.48, 0), mat: crystalMatOlive, pos: [3.1, -2.9, -2.2], speed: 0.46, phase: 5.4 }
    ];

    const prisms = prismSpecs.map(spec => {
      const mesh = new THREE.Mesh(spec.geo, spec.mat);
      mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      // Add subtle golden wireframe edge highlight
      const edges = new THREE.EdgesGeometry(spec.geo);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xff8f3a, transparent: true, opacity: 0.28 })
      );
      mesh.add(line);
      world.add(mesh);
      return { mesh, base: spec.pos, speed: spec.speed, phase: spec.phase };
    });

    // Two delicate golden orbital halos floating behind the bottle
    const haloMat1 = new THREE.MeshBasicMaterial({
      color: 0xff8f3a,
      transparent: true,
      opacity: 0.18
    });
    const haloMat2 = new THREE.MeshBasicMaterial({
      color: 0x4b5a3c,
      transparent: true,
      opacity: 0.14
    });

    const halo1 = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.016, 12, 96), haloMat1);
    halo1.position.set(0, 0.1, -2.6);
    halo1.rotation.set(1.12, 0.28, 0.15);
    world.add(halo1);

    const halo2 = new THREE.Mesh(new THREE.TorusGeometry(4.35, 0.012, 12, 108), haloMat2);
    halo2.position.set(0, -0.1, -3.2);
    halo2.rotation.set(1.28, -0.35, -0.2);
    world.add(halo2);

    // Floating fragrance mist particles with soft radial dot sprite
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 165, 86, 0.95)');
    grad.addColorStop(0.45, 'rgba(255, 143, 58, 0.45)');
    grad.addColorStop(1, 'rgba(255, 143, 58, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    const particleCount = window.innerWidth < 700 ? 55 : 105;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.5;
      speeds[i] = 0.0022 + Math.random() * 0.0045;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.24,
      map: spriteTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    const mistPoints = new THREE.Points(pGeo, pMat);
    world.add(mistPoints);

    // Sizing
    const resize = () => {
      const w = heroSection.clientWidth || window.innerWidth;
      const h = heroSection.clientHeight || 600;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      // Scale composition gently on narrow screens so crystals stay near edges
      const isMobile = w < 640;
      world.scale.setScalar(isMobile ? 0.68 : 1);
    };
    resize();
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(heroSection);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    // Smooth mouse/touch parallax target
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      targetX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 1.4;
      targetY = -(e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 0.9;
    }, { passive: true });

    // Visibility-aware 60fps loop
    let inView = true;
    let rafId = null;
    const clock = new THREE.Clock();

    function animate() {
      if (!inView || document.hidden) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      curX += (targetX - curX) * 0.045;
      curY += (targetY - curY) * 0.045;
      world.rotation.y = curX * 0.22;
      world.rotation.x = -curY * 0.16;
      camera.position.x = curX * 0.55;
      camera.position.y = curY * 0.35;
      camera.lookAt(0, 0, 0);

      for (let i = 0; i < prisms.length; i++) {
        const p = prisms[i];
        p.mesh.rotation.x = t * p.speed * 0.6 + p.phase;
        p.mesh.rotation.y = t * p.speed + p.phase;
        p.mesh.position.y = p.base[1] + Math.sin(t * 0.9 + p.phase) * 0.28;
      }

      halo1.rotation.z = 0.15 + t * 0.09;
      halo1.rotation.x = 1.12 + Math.sin(t * 0.4) * 0.08;
      halo2.rotation.z = -0.2 - t * 0.07;
      halo2.rotation.y = -0.35 + Math.cos(t * 0.35) * 0.08;

      const posAttr = pGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + speeds[i];
        if (y > 4.6) y = -4.6;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    const startLoop = () => {
      if (!rafId && inView && !document.hidden) {
        clock.getDelta();
        animate();
      }
    };

    if (window.IntersectionObserver) {
      const io = new IntersectionObserver(entries => {
        inView = entries[0]?.isIntersecting !== false;
        if (inView) startLoop();
      }, { threshold: 0.02 });
      io.observe(heroSection);
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) startLoop();
    });

    canvas.classList.add('is-ready');
    startLoop();
  }

  // ── 4. GPU-Accelerated 3D Tilt & Specular Spotlight (Delegated) ──────────
  function init3DTiltCards() {
    if (prefersReducedMotion) return;
    const TILT_SELECTOR = [
      '.product-card',
      '.custom-perfume-card',
      '.pdp-card',
      '.stat-card',
      '.inventory-kpi-card',
      '.sales-kpi-card',
      '.source-card'
    ].join(',');

    let activeCard = null;

    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const card = e.target.closest ? e.target.closest(TILT_SELECTOR) : null;

      if (activeCard && activeCard !== card) {
        activeCard.style.transform = '';
        activeCard = null;
      }
      if (!card) return;

      activeCard = card;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);

      // Subtle luxury tilt angle (lighter for wide cards, crisp for feature/product cards)
      const maxTilt = card.classList.contains('custom-perfume-card') ? 2.6 : 5.2;
      const rotY = (px - 0.5) * maxTilt * 2;
      const rotX = -(py - 0.5) * maxTilt * 2;
      card.style.transform = `perspective(920px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
    }, { passive: true });

    document.addEventListener('pointerout', e => {
      if (!activeCard) return;
      if (!e.relatedTarget || !activeCard.contains(e.relatedTarget)) {
        activeCard.style.transform = '';
        activeCard = null;
      }
    });
  }

  // ── 5. Magnetic Pull Micro-Interaction on Primary CTAs ───────────────────
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    const MAG_SELECTOR = '.button-primary, .button-gold, .hero-bottle-trigger-btn, .btn-atomizer-spray, .hstage-cta-primary';
    let activeBtn = null;

    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const btn = e.target.closest ? e.target.closest(MAG_SELECTOR) : null;

      if (activeBtn && activeBtn !== btn) {
        activeBtn.style.transform = '';
        activeBtn = null;
      }
      if (!btn || btn.disabled) return;

      activeBtn = btn;
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
      const clampedX = Math.max(-6, Math.min(6, dx));
      const clampedY = Math.max(-5, Math.min(5, dy));
      btn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${(clampedY - 2).toFixed(1)}px, 0)`;
    }, { passive: true });

    document.addEventListener('pointerout', e => {
      if (!activeBtn) return;
      if (!e.relatedTarget || !activeBtn.contains(e.relatedTarget)) {
        activeBtn.style.transform = '';
        activeBtn = null;
      }
    });
  }

  // ── 6. Scroll-Triggered Staggered Reveal Animations ──────────────────────
  function initScrollReveals() {
    if (prefersReducedMotion || !window.IntersectionObserver) return;

    document.documentElement.classList.add('rooh-motion-ready');

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    const registerElements = (els, staggerStep = 55) => {
      els.forEach((el, idx) => {
        if (!el || el.classList.contains('is-visible')) return;
        if (!el.classList.contains('rooh-reveal')) {
          el.classList.add('rooh-reveal');
          el.style.setProperty('--stagger', `${Math.min(idx % 6, 5) * staggerStep}ms`);
        }
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96) {
          el.classList.add('is-visible');
        } else {
          io.observe(el);
        }
      });
    };

    const STATIC_SELECTORS = [
      '.custom-perfume-card',
      '.section-heading',
      '.story',
      '.quote-band',
      '.newsletter',
      '.prod-visual-stage',
      '.prod-info-col',
      '.pdp-card',
      '.welcome',
      '.stat-card',
      '.inventory-kpi-card',
      '.source-card'
    ].join(',');

    registerElements([...document.querySelectorAll(STATIC_SELECTORS)], 60);

    // Observe dynamically populated product & related grids for staggered card reveals
    ['productGrid', 'relatedGrid'].forEach(gridId => {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      registerElements([...grid.querySelectorAll('.product-card, .related-card')], 48);
      if (window.MutationObserver) {
        const mo = new MutationObserver(() => {
          registerElements([...grid.querySelectorAll('.product-card, .related-card')], 48);
        });
        mo.observe(grid, { childList: true });
      }
    });

    // Safety fail-safe: ensure any visible element never stays hidden
    setTimeout(() => {
      document.querySelectorAll('.rooh-reveal:not(.is-visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.15) {
          el.classList.add('is-visible');
        }
      });
    }, 900);
  }

  // ── Bootstrap ────────────────────────────────────────────────────────────
  function initAll() {
    injectAmbientMesh();
    initHeaderScrollState();
    init3DTiltCards();
    initMagneticButtons();
    initScrollReveals();

    // Wait briefly if Three.js CDN script is still loading
    if (window.THREE) {
      initThreeHeroScene();
    } else if (document.getElementById('home')) {
      let tries = 0;
      const timer = setInterval(() => {
        if (window.THREE) {
          clearInterval(timer);
          initThreeHeroScene();
        } else if (++tries > 25) {
          clearInterval(timer);
        }
      }, 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
