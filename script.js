const counter = document.getElementById("counter");
const spiral = document.getElementById("spiral");
const app = document.getElementById("app");

const CHECKPOINTS = [34999, 32999, 30999, 29999, 27999];

let checkpointIndex = 0;
let currentValue = CHECKPOINTS[0];
let isAnimating = false;
let finished = false;

function buildSpiral() {
  const count = 150;
  const turns = 7.5;
  const minRadius = 8;
  const maxRadius = 68;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const angle = progress * Math.PI * 2 * turns;
    const radius = minRadius + (maxRadius - minRadius) * progress;
    const number = CHECKPOINTS[0] - i * 137;

    const element = document.createElement("span");
    element.className = "spiral-number";
    element.textContent = String(Math.max(10000, number));

    element.style.setProperty("--radius", `${radius}vw`);
    element.style.setProperty(
      "--rotation",
      `${angle * 180 / Math.PI}deg`
    );
    element.style.setProperty(
      "--opacity",
      `${0.08 + (1 - progress) * 0.28}`
    );

    fragment.appendChild(element);
  }

  spiral.appendChild(fragment);
}

function render(value) {
  counter.textContent = String(value).padStart(5, "0");
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
  const difference = start - target;
  const duration = 4000;
  const startTime = performance.now();

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeInOut(progress);

    const value = Math.round(start - difference * eased);
    render(value);

    // Subtle physical rotation while the number rolls.
    const rotation = Math.sin(progress * Math.PI) * 3.5;
    const lift = Math.sin(progress * Math.PI) * -10;
    const scale = 1 + Math.sin(progress * Math.PI) * 0.025;

    counter.style.transform =
      `translateY(${lift}px) rotate(${rotation}deg) scale(${scale})`;

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    currentValue = target;
    render(target);

    counter.style.transform =
      "translateY(0) rotate(0deg) scale(1)";

    isAnimating = false;

    if (checkpointIndex === CHECKPOINTS.length - 1) {
      finished = true;
      app.classList.add("complete");
    }
  }

  requestAnimationFrame(animate);
}

document.addEventListener("click", () => {
  if (isAnimating || finished) return;

  checkpointIndex += 1;
  rollTo(CHECKPOINTS[checkpointIndex]);
});

buildSpiral();
render(currentValue);
