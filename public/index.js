(function () {
  const err = document.getElementById("err");

  function showError(msg) {
    err.textContent = msg;
    err.style.display = "block";
    setTimeout(() => {
      err.style.display = "none";
    }, 4000);
  }

  // ====== PREMIUM COSMIC PLAYLIST SYSTEM ======
  const audio = document.createElement("audio");
  audio.id = "audio";
  audio.preload = "none";
  document.body.appendChild(audio);

  // Built-in songs with default URLs
  const builtInSongs = [
    {
      name: "Until I Found You",
      url: "music/until-i-found-you.mp3",
    },
    { name: "甜蜜蜜丽江古城民谣广场", url: "music/甜蜜蜜丽江古城民谣广场.mp3" },
    { name: "ពន្លឺចាន់ថ្លា", url: "music/khmersong.mp3" },
  ];

  let playlist = [...builtInSongs];
  let currentIndex = 0;
  let isPlaying = false;

  const playlistItemsEl = document.getElementById("playlistItems");
  const nowPlayingTitleEl = document.getElementById("nowPlayingTitle");
  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const pickFile = document.getElementById("pickFile");
  const playerEl = document.getElementById("player");
  const musicOrbEl = document.getElementById("musicOrb");

  let isDrawerOpen = false;

  // Render playlist items
  function renderPlaylist() {
    playlistItemsEl.innerHTML = "";

    playlist.forEach((song, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = `playlist-item ${index === currentIndex ? "active" : ""}`;
      itemEl.innerHTML = `<span>♪</span> <span>${song.name}</span>`;
      itemEl.onclick = () => playSong(index);
      playlistItemsEl.appendChild(itemEl);
    });
  }

  // Update now playing display
  function updateNowPlaying() {
    if (playlist[currentIndex]) {
      nowPlayingTitleEl.textContent = playlist[currentIndex].name;
    }
    renderPlaylist();
  }

  // Play a specific song by index
  function playSong(index) {
    currentIndex = index;
    const song = playlist[currentIndex];

    audio.src = song.url;
    audio
      .play()
      .then(() => {
        isPlaying = true;
        playBtn.textContent = "⏸";
        updateNowPlaying();
      })
      .catch((e) => {
        console.log("Playback started (may require user interaction)");
        playBtn.textContent = "▶";
      });
  }

  // Play/Pause toggle
  playBtn.onclick = () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = "⏵";
    } else {
      if (audio.src) {
        audio
          .play()
          .then(() => {
            isPlaying = true;
            playBtn.textContent = "⏸";
          })
          .catch(() => {
            if (playlist.length > 0) {
              playSong(currentIndex);
            }
          });
      } else if (playlist.length > 0) {
        playSong(0);
      }
    }
  };

  // Previous button
  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(currentIndex);
  };

  // Next button
  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    playSong(currentIndex);
  };

  // Auto play next song when current ends
  audio.onended = () => {
    nextBtn.click();
  };

  // Toggle drawer open/close
  musicOrbEl.onclick = (e) => {
    e.stopPropagation();
    isDrawerOpen = !isDrawerOpen;
    if (isDrawerOpen) {
      playerEl.classList.remove("hidden");
    } else {
      playerEl.classList.add("hidden");
    }
  };

  // Close drawer when clicking outside
  document.body.addEventListener("click", (e) => {
    if (!playerEl.contains(e.target) && !musicOrbEl.contains(e.target)) {
      if (isDrawerOpen) {
        isDrawerOpen = false;
        playerEl.classList.add("hidden");
      }
    }
  });

  // Close drawer when clicking on playlist items
  playerEl.addEventListener("click", (e) => {
    if (e.target.closest(".playlist-item")) {
      setTimeout(() => {
        isDrawerOpen = false;
        playerEl.classList.add("hidden");
      }, 300);
    }
  });

  // Upload handler
  uploadBtn.onclick = () => pickFile.click();

  pickFile.onchange = () => {
    if (pickFile.files && pickFile.files.length > 0) {
      for (let file of pickFile.files) {
        if (file.type === "audio/mpeg" || file.name.endsWith(".mp3")) {
          const url = URL.createObjectURL(file);
          const songName = file.name.replace(".mp3", "").replace(/[-_]/g, " ");
          playlist.push({ name: songName, url });
        }
      }
      renderPlaylist();
      pickFile.value = ""; // Reset file input
    }
  };

  // Auto-play on first interaction (mobile friendly)
  document.body.addEventListener(
    "click",
    function () {
      if (playlist.length > 0 && !audio.src) {
        playSong(0);
      }

      const msg = document.getElementById("tapMessage");
      if (msg) msg.style.display = "none";
    },
    { once: true },
  );

  // Initialize playlist display
  renderPlaylist();

  // ====== WEBGL DETECTION ======
  try {
    const test =
      document.createElement("canvas").getContext("webgl") ||
      document.createElement("canvas").getContext("experimental-webgl");
    if (!test) throw new Error("WebGL not supported");
  } catch (e) {
    showError(
      "WebGL is disabled. Try Chrome, Firefox, or Safari with hardware acceleration enabled.",
    );
    return;
  }

  // ====== THREE.JS GALAXY SETUP ======
  const canvas = document.getElementById("galaxy-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    precision: "highp",
  });

  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 10;
  controls.maxDistance = 220;
  controls.target.set(0, 0, 0);

  // ====== PREMIUM STARFIELD TEXTURE ======
  function makePremiumStarfield(size = 1024, count = 3500) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");

    // Nebula backdrop with premium gradient
    const r = size / 2;
    const nebula = g.createRadialGradient(r, r, r * 0.1, r, r, r * 1.2);
    nebula.addColorStop(0, "#1a0033");
    nebula.addColorStop(0.4, "#0d001f");
    nebula.addColorStop(1, "#000000");
    g.fillStyle = nebula;
    g.fillRect(0, 0, size, size);

    // Premium stars with varied colors
    for (let i = 0; i < count; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const brightness = Math.random() * 0.8 + 0.2;

      // Star glow
      const glow = g.createRadialGradient(x, y, 0, x, y, Math.random() * 3 + 2);

      const colorVariant = Math.random();
      let inner, outer;

      if (colorVariant < 0.3) {
        // Blue stars
        inner = `rgba(180, 220, 255, ${0.7 * brightness})`;
        outer = `rgba(100, 180, 255, ${0.1 * brightness})`;
      } else if (colorVariant < 0.6) {
        // Pink/purple stars
        inner = `rgba(255, 200, 240, ${0.7 * brightness})`;
        outer = `rgba(200, 100, 200, ${0.1 * brightness})`;
      } else {
        // White stars
        inner = `rgba(255, 255, 255, ${0.8 * brightness})`;
        outer = `rgba(200, 200, 255, ${0.1 * brightness})`;
      }

      glow.addColorStop(0, inner);
      glow.addColorStop(1, outer);
      g.fillStyle = glow;
      g.beginPath();
      g.arc(x, y, Math.random() * 1.5 + 0.8, 0, Math.PI * 2);
      g.fill();
    }

    return new THREE.CanvasTexture(c);
  }

  // Create starfield background
  const bgGeo = new THREE.SphereGeometry(600, 64, 64);
  const starTex = makePremiumStarfield(1024, 3500);
  starTex.wrapS = starTex.wrapT = THREE.RepeatWrapping;
  const bg = new THREE.Mesh(
    bgGeo,
    new THREE.MeshBasicMaterial({
      map: starTex,
      side: THREE.BackSide,
      transparent: false,
      opacity: 0.9,
    }),
  );
  scene.add(bg);

  // ====== GALAXY GROUP ======
  const galaxy = new THREE.Group();
  scene.add(galaxy);

  // Love phrases in English
  const phrases = [
    "My Love ❤️",
    "My Queen 👑",
    "My Universe 🌌",
    "My Beautiful Soul ✨",
    "My Everything 💖",
    "My Happiness 😊",
    "My Forever ♾️",
    "My Angel 😇",
    "You Are Amazing 💫",
    "My Favorite Person 🥰",
    "You Make Me Smile 🌷",
    "My Heart ❤️",
    "My Sunshine ☀️",
    "My Star ⭐",
    "My Dream ✨",
    "My Treasure 💎",
    "My Princess 👸",
    "My Peace ☁️",
    "My Destiny 💞",
    "You Are My Home 🏡",
    "Always & Forever ♾️",
    "I Adore You 🌹",
    "You Complete Me ❤️",
    "My Beautiful Goddess 👑",
    "I Love You Forever 💖",
  ];

  const phraseCount = Math.max(phrases.length * 7, 200);
  const arms = 5;
  const radius = 82;
  const maxH = 22;

  // Create premium text textures
  function makeTextTexture(text, size = 48) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 128;
    const g = c.getContext("2d");
    g.clearRect(0, 0, c.width, c.height);
    g.font = `800 ${size}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.shadowColor = "rgba(168, 85, 247, 0.8)";
    g.shadowBlur = 32;
    g.shadowOffsetX = 0;
    g.shadowOffsetY = 0;
    g.fillStyle = "rgba(255, 245, 255, 0.99)";
    g.fillText(text, c.width / 2, c.height / 2);
    return new THREE.CanvasTexture(c);
  }

  // Add phrases as sprites
  for (let i = 0; i < phraseCount; i++) {
    const text = phrases[i % phrases.length];
    const tex = makeTextTexture(text, 48);
    const spr = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      }),
    );
    spr.isPhrase = true;

    const perArm = phraseCount / arms;
    const ang = ((i % perArm) * (Math.PI * 2)) / perArm;
    const armAng = Math.floor(i / perArm) * ((Math.PI * 2) / arms);
    const dist = Math.pow(i / phraseCount, 0.72) * radius;
    const thickness = Math.pow(1 - dist / radius, 2);

    const x = Math.cos(ang + armAng) * dist;
    const z = Math.sin(ang + armAng) * dist;
    const y = (Math.random() - 0.5) * maxH * thickness * 0.9;

    spr.position.set(x, y, z);
    spr.scale.set(20, 2.6, 1);
    galaxy.add(spr);
  }

  // ====== GALAXY STARS ======
  const starCount = 12000;
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(starCount * 3);
  const col = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 1.15;
    const y =
      (Math.random() - 0.5) *
      36 *
      Math.pow(1 - Math.min(dist, radius) / radius, 1.5);

    pos[i * 3] = Math.cos(ang) * dist;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(ang) * dist;

    // Color variation
    const colorVar = Math.random();
    if (colorVar < 0.4) {
      col[i * 3] = 0.7 + Math.random() * 0.3;
      col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      col[i * 3 + 2] = 1;
    } else if (colorVar < 0.7) {
      col[i * 3] = 1;
      col[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      col[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    } else {
      col[i * 3] = 1;
      col[i * 3 + 1] = 1;
      col[i * 3 + 2] = 1;
    }
  }

  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geom.setAttribute("color", new THREE.BufferAttribute(col, 3));

  galaxy.add(
    new THREE.Points(
      geom,
      new THREE.PointsMaterial({
        size: 0.32,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      }),
    ),
  );

  // ====== PREMIUM BLACK HOLE ======
  const coreR = 12;
  const coreTexCanvas = document.createElement("canvas");
  coreTexCanvas.width = coreTexCanvas.height = 256;
  const cg = coreTexCanvas.getContext("2d");
  const coreGradient = cg.createRadialGradient(128, 128, 8, 128, 128, 128);
  coreGradient.addColorStop(0, "#4c1d95");
  coreGradient.addColorStop(0.5, "#200055");
  coreGradient.addColorStop(1, "#000000");
  cg.fillStyle = coreGradient;
  cg.arc(128, 128, 128, 0, Math.PI * 2);
  cg.fill();

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(coreR, 64, 64),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(coreTexCanvas),
    }),
  );
  core.renderOrder = 1;
  scene.add(core);

  // Premium photon ring
  const photonRing = new THREE.Mesh(
    new THREE.RingGeometry(coreR * 1.05, coreR * 1.25, 128),
    new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    }),
  );
  photonRing.rotation.x = -Math.PI / 2;
  photonRing.renderOrder = 0.5;
  scene.add(photonRing);

  // ====== PREMIUM HALO ======
  function makeHaloTexture(size = 1024, inner = 0.45) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const r = size / 2;
    const grd = g.createRadialGradient(r, r, r * inner, r, r, r);
    grd.addColorStop(0.0, "rgba(168, 85, 247, 0.5)");
    grd.addColorStop(0.25, "rgba(236, 72, 153, 0.4)");
    grd.addColorStop(0.5, "rgba(168, 85, 247, 0.25)");
    grd.addColorStop(0.75, "rgba(59, 130, 246, 0.15)");
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  const haloPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshBasicMaterial({
      map: makeHaloTexture(1024, 0.45),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
    }),
  );
  haloPlane.rotation.x = -Math.PI / 2;
  haloPlane.renderOrder = 0.2;
  scene.add(haloPlane);

  // ====== ADDITIONAL GLOW EFFECT ======
  const glowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(550, 550),
    new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.08,
    }),
  );
  glowPlane.rotation.x = -Math.PI / 2;
  glowPlane.renderOrder = 0.1;
  scene.add(glowPlane);

  // ====== CAMERA SETUP ======
  function setCam() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768 || w < h;
    camera.fov = isMobile ? 90 : 75;
    camera.position.set(0, isMobile ? 26 : 22, isMobile ? 110 : 75);
    camera.updateProjectionMatrix();
    controls.update();
  }

  setCam();

  // ====== ANIMATION LOOP ======
  let tw = 0;

  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.0005;

    tw = (tw + 0.0002) % 1;
    starTex.offset.set(tw * 0.3, tw * 0.15);

    galaxy.rotation.y = t * 0.08;
    core.rotation.y = t * 0.15;
    photonRing.rotation.z = t * 0.25;
    haloPlane.rotation.z = t * 0.03;
    glowPlane.rotation.z = -t * 0.02;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // ====== WINDOW RESIZE ======
  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    setCam();
  });

  // ====== HEART PARTICLES (Double tap/click) ======
  const fx = document.getElementById("fx");
  const ctx2 = fx.getContext("2d");

  function resizeFx() {
    fx.width = Math.floor(
      innerWidth * Math.min(2, window.devicePixelRatio || 1),
    );
    fx.height = Math.floor(
      innerHeight * Math.min(2, window.devicePixelRatio || 1),
    );
    fx.style.width = innerWidth + "px";
    fx.style.height = innerHeight + "px";
  }

  addEventListener("resize", resizeFx);
  resizeFx();

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const hearts = [];

  function spawnHearts(x, y, n = 25) {
    x *= DPR;
    y *= DPR;
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      hearts.push({
        x,
        y,
        vx: Math.cos(angle) * (0.6 + Math.random() * 0.8),
        vy: -(0.8 + Math.random() * 1.2),
        life: 1,
        size: 12 + Math.random() * 18,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
      });
    }
  }

  function drawHeart(x, y, size, rotation) {
    const s = size;
    ctx2.save();
    ctx2.translate(x, y);
    ctx2.rotate(rotation);
    ctx2.beginPath();
    ctx2.moveTo(0, -0.25 * s);
    ctx2.bezierCurveTo(0.5 * s, -0.9 * s, 1.4 * s, -0.1 * s, 0, 0.9 * s);
    ctx2.bezierCurveTo(-1.4 * s, -0.1 * s, -0.5 * s, -0.9 * s, 0, -0.25 * s);
    const g = ctx2.createRadialGradient(0, 0, 0, 0, 0, s);
    g.addColorStop(0, "rgba(236, 72, 153, 0.95)");
    g.addColorStop(0.6, "rgba(168, 85, 247, 0.7)");
    g.addColorStop(1, "rgba(59, 130, 246, 0)");
    ctx2.fillStyle = g;
    ctx2.fill();
    ctx2.restore();
  }

  let lastTap = 0;

  addEventListener(
    "click",
    (e) => {
      const now = performance.now();
      if (now - lastTap < 320) spawnHearts(e.clientX, e.clientY, 25);
      lastTap = now;
    },
    { passive: true },
  );

  addEventListener(
    "touchend",
    (e) => {
      const now = performance.now();
      const t = e.changedTouches && e.changedTouches[0];
      if (now - lastTap < 320 && t) spawnHearts(t.clientX, t.clientY, 25);
      lastTap = now;
    },
    { passive: true },
  );

  // Heart animation loop
  function loopFx() {
    ctx2.clearRect(0, 0, fx.width, fx.height);
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.vy -= 0.025;
      h.life -= 0.012;
      h.rotation += h.rotSpeed;
      ctx2.globalAlpha = Math.max(0, h.life);
      drawHeart(h.x / DPR, h.y / DPR, h.size, h.rotation);
      if (h.life <= 0) hearts.splice(i, 1);
    }
    requestAnimationFrame(loopFx);
  }

  loopFx();
})();
