const counter = document.getElementById("counter");
const hint = document.getElementById("hint");
const progressBar = document.getElementById("progressBar");
const spiral = document.getElementById("spiral");
const app = document.getElementById("app");

// These are the ONLY numbers where the experience can stop.
// A click moves to the next checkpoint and rolls through every
// number between the current checkpoint and the next one.
const CHECKPOINTS = [32999, 30999, 29999, 27999];

let checkpointIndex = 0;
let currentValue = CHECKPOINTS[0];
let isAnimating = false;
let finished = false;

// Build the giant background number spiral.
function buildSpiral() {
  const count = 150;
  const turns = 7.5;
  const minRadius = 8;
  const maxRadius = 68;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = t * Math.PI * 2 * turns;
    const radius = minRadius + (maxRadius - minRadius) * t;

    const n = CHECKPOINTS[0] - i * 137;
    const el = document.createElement("span");
    el.className = "spiral-number";
    el.textContent = String(Math.max(10000, n));

    el.style.setProperty("--radius", `${radius}vw`);
    el.style.setProperty("--rotation", `${angle * 180 / Math.PI}deg`);
    el.style.setProperty("--opacity", `${0.08 + (1 - t) * 0.28}`);

    spiral.appendChild(el);
  }
}

function updateProgress() {
  const pct = (checkpointIndex / (CHECKPOINTS.length - 1)) * 100;
  progressBar.style.width = `${pct}%`;
}

function render(value) {
  counter.textContent = String(value).padStart(5, "0");
  counter.classList.remove("rolling");
  void counter.offsetWidth;
  counter.classList.add("rolling");
}

function easeInOut(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function rollTo(target) {
  if (isAnimating || finished) return;

  isAnimating = true;
  const start = currentValue;
  const distance = start - target;

  // Longer rolls feel like a physical odometer/counter.
  // Every intermediate integer is shown, but the animation only
  // settles at the predefined checkpoint.
  const duration = Math.min(2600, Math.max(1100, distance * 0.55));
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const raw = Math.min(elapsed / duration, 1);
    const eased = easeInOut(raw);

    const value = Math.round(start - distance * eased);
    render(value);

    if (raw < 1) {
      requestAnimationFrame(frame);
    } else {
      currentValue = target;
      render(target);
      isAnimating = false;

      if (checkpointIndex === CHECKPOINTS.length - 1) {
        finished = true;
        app.classList.add("complete");
        hint.textContent = "Final number reached";
        progressBar.style.width = "100%";
      } else {
        hint.textContent = "Click anywhere to continue";
      }
    }
  }

  requestAnimationFrame(frame);
}

function handleClick() {
  if (isAnimating || finished) return;

  checkpointIndex += 1;
  const nextTarget = CHECKPOINTS[checkpointIndex];
  rollTo(nextTarget);
}

document.addEventListener("click", handleClick);

buildSpiral();
updateProgress();
