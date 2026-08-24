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
// STATIC COUNTER
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

    const digitElement =
      document.createElement("span");

    digitElement.textContent = digit;

    track.appendChild(digitElement);

    wrapper.appendChild(track);

    counter.appendChild(wrapper);
  });
}


// ============================================================
// FULL MECHANICAL NUMBER ROLL
// ============================================================

function animateDigits(from, to) {

  if (isAnimating || finished) return;

  isAnimating = true;

  const fromDigits =
    String(from)
      .padStart(5, "0")
      .split("")
      .map(Number);

  const toDigits =
    String(to)
      .padStart(5, "0")
      .split("")
      .map(Number);

  counter.innerHTML = "";

  const tracks = [];

  /*
    IMPORTANT:

    Every digit gets a complete rolling sequence.

    Even if a digit starts and ends on the SAME number,
    it still makes several rotations before settling.

    This creates the full mechanical-counter effect.
  */

  for (let i = 0; i < 5; i++) {

    const wrapper =
      document.createElement("span");

    wrapper.className =
      "digit-wrapper";


    const track =
      document.createElement("span");

    track.className =
      "digit-track";


    const startDigit =
      fromDigits[i];

    const endDigit =
      toDigits[i];


    /*
      Base movement required to reach the target.
    */

    let targetDistance =
      startDigit - endDigit;

    if (targetDistance < 0) {
      targetDistance += 10;
    }


    /*
      Add COMPLETE extra rotations.

      This is what makes ALL five digits roll.

      Higher-place digits get slightly more movement,
      giving the number a much more dramatic mechanical feel.
    */

    const extraRotations =
      2 + (4 - i);


    const totalDistance =
      targetDistance +
      extraRotations * 10;


    /*
      Build the digit wheel sequence.
    */

    for (
      let step = 0;
      step <= totalDistance;
      step++
    ) {

      const value =
        (startDigit - step + 100) % 10;

      const digit =
        document.createElement("span");

      digit.textContent = value;

      track.appendChild(digit);
    }


    wrapper.appendChild(track);

    counter.appendChild(wrapper);


    tracks.push({
      track,
      totalDistance
    });
  }


  /*
    Start animation after the browser has
    rendered the initial positions.
  */

  requestAnimationFrame(() => {

    const digitHeight =
      counter.getBoundingClientRect().height;


    tracks.forEach((item, index) => {

      const finalPosition =
        -(item.totalDistance * digitHeight);


      /*
        Every digit starts together but with a tiny
        stagger, creating a cascading mechanical effect.
      */

      const delay =
        index * 45;


      /*
        The outer digits move slightly slower,
        making the entire number feel alive.
      */

      const duration =
        2300 + index * 100;


      item.track.style.transition =
        `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;


      item.track.style.transform =
        `translateY(${finalPosition}px)`;

    });

  });


  /*
    Allow enough time for the slowest digit.
  */

  const animationTime =
    2300 +
    4 * 100 +
    4 * 45 +
    100;


  setTimeout(() => {

    currentValue = to;

    setupCounter(currentValue);

    isAnimating = false;


    /*
      Once 27999 is reached, freeze permanently
      until the page is refreshed.
    */

    if (
      checkpointIndex ===
      CHECKPOINTS.length - 1
    ) {

      finished = true;

      app.classList.add("complete");
    }

  }, animationTime);
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
// INITIALISE
// ============================================================

buildSpiral();

setupCounter(currentValue);
