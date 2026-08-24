const counter = document.getElementById("counter");
const spiral = document.getElementById("spiral");
const app = document.getElementById("app");

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

    const number = CHECKPOINTS[0] - i * 137;

    const el = document.createElement("span");

    el.className = "spiral-number";
    el.textContent = String(Math.max(10000, number));

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
// INITIAL CENTRAL NUMBER
// ============================================================

function setupCounter(value) {
  counter.innerHTML = "";

  const digits = String(value)
    .padStart(5, "0")
    .split("");

  digits.forEach(digit => {
    const wrapper = document.createElement("span");
    wrapper.className = "digit-wrapper";

    const track = document.createElement("span");
    track.className = "digit-track";

    const digitElement = document.createElement("span");
    digitElement.textContent = digit;

    track.appendChild(digitElement);
    wrapper.appendChild(track);
    counter.appendChild(wrapper);
  });
}


// ============================================================
// MECHANICAL DIGIT ROLL
// ============================================================

function animateDigits(from, to) {

  if (isAnimating || finished) return;

  isAnimating = true;

  const fromDigits = String(from)
    .padStart(5, "0")
    .split("")
    .map(Number);

  const toDigits = String(to)
    .padStart(5, "0")
    .split("")
    .map(Number);

  counter.innerHTML = "";

  const tracks = [];

  for (let i = 0; i < 5; i++) {

    const wrapper = document.createElement("span");
    wrapper.className = "digit-wrapper";

    const track = document.createElement("span");
    track.className = "digit-track";

    const startDigit = fromDigits[i];
    const endDigit = toDigits[i];

    /*
      Calculate how many places this digit needs
      to roll downward.
    */

    let distance = startDigit - endDigit;

    if (distance < 0) {
      distance += 10;
    }

    /*
      Build the rolling sequence.
    */

    const sequence = [];

    for (let j = 0; j <= distance; j++) {

      const value =
        (startDigit - j + 10) % 10;

      sequence.push(value);
    }

    sequence.forEach(value => {

      const digit = document.createElement("span");

      digit.textContent = value;

      track.appendChild(digit);

    });

    wrapper.appendChild(track);
    counter.appendChild(wrapper);

    tracks.push({
      track,
      distance
    });
  }


  /*
    Wait one frame so the browser registers
    the starting position before animating.
  */

  requestAnimationFrame(() => {

    const digitHeight = counter.offsetHeight;

    tracks.forEach((item, index) => {

      const finalPosition =
        -(item.distance * digitHeight);

      /*
        Slight delay between digits makes the
        number feel more mechanical.
      */

      const delay = index * 60;

      item.track.style.transition =
        `transform 2200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

      item.track.style.transform =
        `translateY(${finalPosition}px)`;

    });

  });


  /*
    Wait for the full animation to finish.
  */

  setTimeout(() => {

    currentValue = to;

    setupCounter(currentValue);

    isAnimating = false;


    /*
      At 27999, permanently freeze until refresh.
    */

    if (
      checkpointIndex ===
      CHECKPOINTS.length - 1
    ) {

      finished = true;

      app.classList.add("complete");
    }

  }, 2600);
}


// ============================================================
// CLICK ANYWHERE
// ============================================================

document.addEventListener("click", () => {

  if (isAnimating || finished) {
    return;
  }

  checkpointIndex++;

  const nextValue =
    CHECKPOINTS[checkpointIndex];

  animateDigits(
    currentValue,
    nextValue
  );

});


// ============================================================
// START EXPERIENCE
// ============================================================

buildSpiral();

setupCounter(currentValue);
