const counter = document.getElementById("counter");
const hint = document.getElementById("hint");
const progressBar = document.getElementById("progressBar");
const spiral = document.getElementById("spiral");
const app = document.getElementById("app");

// These are the ONLY numbers where the counter can stop.
const CHECKPOINTS = [32999, 30999, 29999, 27999];

let checkpointIndex = 0;
let currentValue = CHECKPOINTS[0];
let isAnimating = false;
let finished = false;


// ============================================================
// BACKGROUND NUMBER SPIRAL
// ============================================================

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
    el.style.setProperty(
      "--rotation",
      `${angle * 180 / Math.PI}deg`
    );
    el.style.setProperty(
      "--opacity",
      `${0.08 + (1 - t) * 0.28}`
    );

    spiral.appendChild(el);
  }
}


// ============================================================
// PROGRESS
// ============================================================

function updateProgress() {
  const pct =
    (checkpointIndex / (CHECKPOINTS.length - 1)) * 100;

  progressBar.style.width = `${pct}%`;
}


// ============================================================
// DIGIT ROLLER
// ============================================================

function createDigit(digit) {
  const wrapper = document.createElement("span");

  wrapper.className = "digit-wrapper";

  const track = document.createElement("span");

  track.className = "digit-track";

  // Three copies allow us to create a convincing rolling effect.
  track.innerHTML = `
    <span>${digit}</span>
    <span>${digit}</span>
    <span>${digit}</span>
  `;

  wrapper.appendChild(track);

  return {
    wrapper,
    track
  };
}


function setupCounter() {
  counter.innerHTML = "";

  const digits = String(currentValue)
    .padStart(5, "0")
    .split("");

  digits.forEach(digit => {
    const result = createDigit(digit);
    counter.appendChild(result.wrapper);
  });
}


// ============================================================
// MECHANICAL DIGIT ANIMATION
// ============================================================

function animateDigits(from, to, duration = 2200) {

  const fromDigits = String(from)
    .padStart(5, "0")
    .split("")
    .map(Number);

  const toDigits = String(to)
    .padStart(5, "0")
    .split("")
    .map(Number);

  counter.innerHTML = "";

  const digitTracks = [];

  for (let i = 0; i < 5; i++) {

    const wrapper = document.createElement("span");
    wrapper.className = "digit-wrapper";

    const track = document.createElement("span");
    track.className = "digit-track";

    /*
      Each track contains a vertical sequence of numbers.

      We use enough numbers for the digit to roll forward
      naturally. The animation ultimately stops exactly
      on the desired target digit.
    */

    let sequence = [];

    const startDigit = fromDigits[i];
    const endDigit = toDigits[i];

    let distance = endDigit - startDigit;

    /*
      Since this is a countdown, wrap downward through 0
      whenever necessary.
    */

    if (distance > 0) {
      distance -= 10;
    }

    /*
      Create a sequence long enough for the animation.
    */

    for (let j = 0; j <= Math.abs(distance) + 2; j++) {
      const value =
        (startDigit - j + 10) % 10;

      sequence.push(value);
    }

    /*
      Add the target digit explicitly at the end.
    */

    sequence.push(endDigit);

    sequence.forEach(number => {
      const digitElement = document.createElement("span");

      digitElement.textContent = number;

      track.appendChild(digitElement);
    });

    wrapper.appendChild(track);
    counter.appendChild(wrapper);

    digitTracks.push({
      track,
      startDigit,
      endDigit,
      distance
    });
  }


  /*
    Force the browser to recognise the initial position
    before starting the animation.
  */

  digitTracks.forEach(item => {
    item.track.style.transform = "translateY(0)";
  });

  requestAnimationFrame(() => {

    /*
      Each digit gets a slightly different timing.

      This makes the number feel mechanical instead of
      looking like one flat block changing at once.
    */

    digitTracks.forEach((item, index) => {

      const digitHeight =
        counter.offsetHeight;

      const steps =
        Math.abs(item.distance) + 1;

      const finalPosition =
        -(steps * digitHeight);

      const delay =
        index * 45;

      item.track.style.transition =
        `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

      item.track.style.transform =
        `translateY(${finalPosition}px)`;
    });

  });


  /*
    Wait until the animation is finished.
  */

  const totalDuration =
    duration + 5 * 45;

  setTimeout(() => {

    currentValue = to;

    /*
      Replace the animated tracks with clean,
      static digits so the browser isn't carrying
      a huge DOM structure after every click.
    */

    setupCounter();

    isAnimating = false;

    if (
      checkpointIndex ===
      CHECKPOINTS.length - 1
    ) {

      finished = true;

      app.classList.add("complete");

      /*
        IMPORTANT:
        We deliberately do NOT change the hint text here.

        This means there is no "Final number reached"
        message at the end.

        The page simply freezes.
      */

      hint.textContent = "";
    }

  }, totalDuration);
}


// ============================================================
// CLICK HANDLER
// ============================================================

function handleClick() {

  /*
    Ignore clicks while the number is rolling.
  */

  if (isAnimating || finished) {
    return;
  }

  checkpointIndex++;

  const nextTarget =
    CHECKPOINTS[checkpointIndex];

  isAnimating = true;

  animateDigits(
    currentValue,
    nextTarget,
    2300
  );

  updateProgress();
}


// ============================================================
// INITIALISE
// ============================================================

document.addEventListener(
  "click",
  handleClick
);

buildSpiral();

setupCounter();

updateProgress();
