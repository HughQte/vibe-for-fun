
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Magical Christmas Night</title>

<style>
* { box-sizing: border-box; }

body {
  margin: 0;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(
    ellipse at center, #12334a, #050c19 75%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
}

/* CHRISTMAS TREE */
.scene {
  width: 400px;
  height: 550px;
  perspective: 900px;
}

.tree {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: spin 12s linear infinite;
}

@keyframes spin {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

.branch, .light {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform-style: preserve-3d;
}

.branch {
  width: 6px;
  height: 6px;
  background: #16db85;
  box-shadow: 0 0 9px #00ff88;
}

.light {
  width: 7px;
  height: 7px;
  box-shadow:
    0 0 12px currentColor,
    0 0 25px currentColor;
  animation: twinkle 1.8s ease-in-out infinite alternate;
}

@keyframes twinkle {
  from { opacity: .35; filter: brightness(.7); }
  to { opacity: 1; filter: brightness(2); }
}

.star {
  position: absolute;
  left: 50%;
  top: 40px;
  font-size: 54px;
  color: gold;
  transform: translateX(-50%);
  text-shadow:
    0 0 20px gold,
    0 0 45px orange,
    0 0 75px yellow;
  animation: starGlow 1.3s infinite alternate;
}

@keyframes starGlow {
  to { filter: brightness(1.8); }
}

/* SNOW */
.snow {
  position: fixed;
  top: -15px;
  color: white;
  pointer-events: none;
  animation: snowfall linear infinite;
}

@keyframes snowfall {
  to { transform: translateY(110vh); }
}

/* CHRISTMAS MESSAGE */
.message {
  position: fixed;
  bottom: 30px;
  color: #ffe9a3;
  font-size: clamp(18px, 4vw, 28px);
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 15px gold;
  text-align: center;
  z-index: 10;
}

/* SANTA AND REINDEER */
#santaFlight {
  position: fixed;
  top: 0;
  left: 0;
  width: 660px;
  height: 180px;
  z-index: 20;
  cursor: pointer;
  will-change: transform;
  user-select: none;
}

#santaFlight svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

#flyingBody {
  animation: float 1s ease-in-out infinite alternate;
  transform-origin: center;
}

@keyframes float {
  from { transform: translateY(-4px) rotate(-1deg); }
  to { transform: translateY(5px) rotate(1deg); }
}

.reindeer {
  animation: gallop .45s ease-in-out infinite alternate;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes gallop {
  from { transform: translateY(-5px) rotate(-4deg); }
  to { transform: translateY(5px) rotate(4deg); }
}

.rudolphNose {
  animation: noseGlow .5s infinite alternate;
}

@keyframes noseGlow {
  from { opacity: .5; }
  to { opacity: 1; filter: brightness(2); }
}

.sparkle {
  position: fixed;
  pointer-events: none;
  z-index: 19;
  font-size: 16px;
  animation: sparkleFade .8s ease-out forwards;
}

@keyframes sparkleFade {
  to {
    opacity: 0;
    transform: translateY(30px) scale(.2);
  }
}

.hint {
  position: fixed;
  top: 15px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #b8d8ed;
  font-size: 14px;
  z-index: 10;
  pointer-events: none;
}
</style>
</head>

<body>

<div class="hint">🎅 Try to catch Santa with your mouse!</div>

<div class="scene">
  <div class="tree" id="tree">
    <div class="star">★</div>
  </div>
</div>

<div id="santaFlight">
  <svg viewBox="0 0 660 180" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <g id="flyingBody">
      <!-- REINS -->
      <path d="M190 110 Q380 70 630 94"
        fill="none" stroke="#e5c37b"
        stroke-width="1.8" opacity=".8"/>

      <!-- SLEIGH -->
      <path d="M25 108 Q85 143 212 106 L193 141
        Q100 159 41 133 Z"
        fill="#b91c35" stroke="#ffd166" stroke-width="3"/>

      <path d="M25 143 Q95 177 215 145"
        fill="none" stroke="#ffcf50"
        stroke-width="6" stroke-linecap="round"/>

      <path d="M48 135 L45 151 M190 139 L196 151"
        stroke="#ffd166" stroke-width="4"/>

      <!-- BAG OF PRESENTS -->
      <ellipse cx="85" cy="87" rx="48" ry="42" fill="#a66a31"/>
      <path d="M62 56 Q83 42 104 54"
        stroke="#e6bb77" fill="none" stroke-width="5"/>

      <!-- PRESENTS -->
      <rect x="45" y="76" width="28" height="26"
        fill="#2dd4bf" stroke="#fff" stroke-width="1"/>
      <path d="M59 76 V102 M45 89 H73"
        stroke="#ffdb4d" stroke-width="5"/>

      <rect x="79" y="63" width="31" height="30"
        fill="#ff538a" stroke="#fff" stroke-width="1"/>
      <path d="M94 63 V93 M79 78 H110"
        stroke="#ffeb82" stroke-width="5"/>

      <rect x="112" y="84" width="25" height="23"
        fill="#8b5cf6"/>
      <path d="M124 84 V107 M112 95 H137"
        stroke="gold" stroke-width="4"/>

      <!-- SANTA -->
      <ellipse cx="155" cy="103" rx="26" ry="31" fill="#ed2345"/>
      <path d="M133 104 H178"
        stroke="white" stroke-width="7"/>

      <circle cx="157" cy="59" r="19" fill="#ffc9a3"/>
      <ellipse cx="156" cy="76" rx="19" ry="15" fill="white"/>

      <circle cx="150" cy="58" r="2.3" fill="#242424"/>
      <circle cx="164" cy="58" r="2.3" fill="#242424"/>
      <circle cx="157" cy="66" r="4" fill="#ff9f9f"/>

      <path d="M135 48 L150 15 Q173 21 178 48 Z"
        fill="#ed2345"/>
      <path d="M135 48 H178"
        stroke="white" stroke-width="8" stroke-linecap="round"/>
      <circle cx="150" cy="15" r="8" fill="white"/>

      <!-- SANTA WAVING -->
      <path d="M171 91 Q191 82 196 63"
        fill="none" stroke="#ed2345"
        stroke-width="12" stroke-linecap="round"/>
      <circle cx="196" cy="62" r="8" fill="white"/>
    </g>

    <!-- Six flying reindeer are added with JavaScript -->
    <g id="reindeerTeam"></g>
  </svg>
</div>

<div class="message">🎄 Merry Christmas 🎄</div>

<script>
/* =========================================
   1. BUILD THE GLOWING CHRISTMAS TREE
========================================= */

const tree = document.getElementById("tree");

const colors = [
  "#ff3333", "#ffe600", "#00ddff",
  "#ff55ff", "#ffffff", "#ff9900"
];

const total = 1600;
const turns = 18;
const height = 390;

for (let i = 0; i < total; i++) {
  const t = i / (total - 1);
  const angle = t * Math.PI * 2 * turns;
  const radius = 155 * t;
  const y = -205 + t * height;

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const dot = document.createElement("div");
  const isLight = i % 9 === 0;

  dot.className = isLight ? "light" : "branch";

  if (isLight) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    dot.style.background = color;
    dot.style.color = color;
    dot.style.animationDelay = Math.random() * 2 + "s";
  }

  dot.style.transform =
    `translate3d(${x}px, ${y}px, ${z}px)`;

  tree.appendChild(dot);
}

/* =========================================
   2. GENERATE SNOW
========================================= */

for (let i = 0; i < 100; i++) {
  const snow = document.createElement("div");
  snow.className = "snow";
  snow.textContent = "❄";

  snow.style.left = Math.random() * 100 + "vw";
  snow.style.fontSize = 5 + Math.random() * 15 + "px";
  snow.style.opacity = .3 + Math.random() * .7;
  snow.style.animationDuration = 4 + Math.random() * 8 + "s";
  snow.style.animationDelay = -Math.random() * 12 + "s";

  document.body.appendChild(snow);
}

/* =========================================
   3. CREATE SIX FLYING REINDEER
========================================= */

const team = document.getElementById("reindeerTeam");
const NS = "http://www.w3.org/2000/svg";

for (let i = 0; i < 6; i++) {
  const g = document.createElementNS(NS, "g");

  const x = 285 + i * 61;
  const y = 83 + Math.sin(i * 1.5) * 13;

  g.setAttribute("transform", `translate(${x},${y})`);

  const inner = document.createElementNS(NS, "g");
  inner.setAttribute("class", "reindeer");
  inner.style.animationDelay = `${i * -.12}s`;

  inner.innerHTML = `
    <!-- BODY -->
    <ellipse cx="0" cy="0" rx="23" ry="12"
      fill="#a86b3f" stroke="#734325" stroke-width="1.5"/>

    <!-- NECK -->
    <path d="M13 -3 L25 -25 L33 -21 L23 5 Z"
      fill="#a86b3f"/>

    <!-- HEAD -->
    <ellipse cx="30" cy="-25" rx="13" ry="9"
      fill="#bb814e"/>

    <!-- EARS -->
    <path d="M23 -30 L17 -39 L28 -34 Z"
      fill="#d49a65"/>

    <!-- ANTLERS -->
    <path d="M29 -31 L25 -48
      M25 -42 L17 -47
      M25 -40 L34 -50
      M34 -31 L38 -46
      M38 -40 L44 -45"
      stroke="#e6ba7a" stroke-width="2.5"
      fill="none" stroke-linecap="round"/>

    <!-- EYE -->
    <circle cx="35" cy="-27" r="2" fill="#191919"/>

    <!-- NOSE -->
    <circle cx="43" cy="-23" r="3.7"
      fill="${i === 5 ? '#ff2020' : '#33251c'}"
      ${i === 5 ? 'class="rudolphNose" filter="url(#glow)"' : ''}/>

    <!-- FRONT LEGS -->
    <path d="M12 7 L28 23 L37 19
      M4 8 L17 26 L27 24"
      fill="none" stroke="#a86b3f"
      stroke-width="5" stroke-linecap="round"/>

    <!-- BACK LEGS -->
    <path d="M-15 6 L-30 23 L-40 19
      M-9 8 L-19 27 L-30 28"
      fill="none" stroke="#a86b3f"
      stroke-width="5" stroke-linecap="round"/>

    <!-- TAIL -->
    <path d="M-21 -3 L-34 -13"
      stroke="#c18a57" stroke-width="5"
      stroke-linecap="round"/>
  `;

  g.appendChild(inner);
  team.appendChild(g);
}

/* =========================================
   4. MAKE SANTA FLY ACROSS THE SCREEN
========================================= */

const santa = document.getElementById("santaFlight");

const santaWidth = 660;
const santaHeight = 180;

let santaX = -santaWidth;
let santaY = Math.max(30, window.innerHeight * .18);

let speed = 105;  // Pixels per second
let lastTime = performance.now();
let lastDodge = 0;
let flightTime = 0;

/* =========================================
   5. MAGIC SPARKLE TRAIL
========================================= */

function makeSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";

  sparkle.textContent =
    ["✨", "⭐", "✦", "❄"][Math.floor(Math.random() * 4)];

  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";

  document.body.appendChild(sparkle);

  sparkle.addEventListener("animationend", () => {
    sparkle.remove();
  });
}

/* =========================================
   6. SANTA DODGES YOUR MOUSE
========================================= */

function dodgeSanta(mouseX, mouseY, force = false) {
  const now = performance.now();

  // Brief cooldown prevents endless jumping
  if (now - lastDodge < 350) return;

  const centerX = santaX + santaWidth / 2;
  const centerY = santaY + santaHeight / 2;

  const dx = centerX - mouseX;
  const dy = centerY - mouseY;

  // Detect cursor within the flying group
  const near =
    mouseX > santaX - 65 &&
    mouseX < santaX + santaWidth + 65 &&
    mouseY > santaY - 65 &&
    mouseY < santaY + santaHeight + 65;

  if (near || force) {
    lastDodge = now;

    // Leap forward, away from the cursor
    santaX += 100 + Math.random() * 100;

    // Move vertically away from the pointer
    const direction = dy >= 0 ? 1 : -1;
    santaY += direction * (65 + Math.random() * 70);

    santaY = Math.max(
      10,
      Math.min(window.innerHeight - santaHeight - 10, santaY)
    );

    // Leave magic sparkles behind
    for (let i = 0; i < 12; i++) {
      makeSparkle(
        centerX - Math.random() * 120,
        centerY + (Math.random() - .5) * 100
      );
    }
  }
}

window.addEventListener("pointermove", (event) => {
  dodgeSanta(event.clientX, event.clientY);
});

santa.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  dodgeSanta(event.clientX, event.clientY, true);
});

/* =========================================
   7. ANIMATE THE ENTIRE FLIGHT
========================================= */

let sparkleTimer = 0;

function animateSanta(now) {
  const dt = Math.min((now - lastTime) / 1000, .05);
  lastTime = now;

  flightTime += dt;
  santaX += speed * dt;

  const bob = Math.sin(flightTime * 2.5) * 8;

  // Return to the left after flying off-screen
  if (santaX > window.innerWidth + 80) {
    santaX = -santaWidth;
    santaY = Math.max(
      20,
      window.innerHeight * (.1 + Math.random() * .35)
    );
  }

  santa.style.transform =
    `translate3d(${santaX}px, ${santaY + bob}px, 0)`;

  // Sparkling sleigh trail
  sparkleTimer += dt;

  if (sparkleTimer > .12 && santaX > 0) {
    sparkleTimer = 0;
    makeSparkle(
      santaX + 35,
      santaY + 135 + bob
    );
  }

  requestAnimationFrame(animateSanta);
}

requestAnimationFrame(animateSanta);

</script>
</body>
</html>
