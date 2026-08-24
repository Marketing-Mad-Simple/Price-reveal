const counter = document.getElementById("counter");
const spiral = document.getElementById("spiral");
const app = document.getElementById("app");


// ============================================================
// FIXED CHECKPOINTS
// ============================================================

const CHECKPOINTS = [
  32999,
  30999,
  29999,
  27999
];

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

    const progress = i / (count - 1);

    const angle =
      progress *
      Math.PI *
      2 *
      turns;

    const radius =
      minRadius +
      (maxRadius - minRadius) *
      progress;

    const number =
      CHECKPOINTS[0] -
      i * 137;

    const element =
      document.createElement("span");

    element.className =
      "spiral-number";

    element.textContent =
      String(Math.max(10000, number));

    element.style.setProperty(
      "--radius",
      `${radius}vw`
    );

    element.style.setProperty(
      "--rotation",
      `${angle * 180 / Math.PI}deg`
    );

    element.style.setProperty(
      "--opacity",
      `${0.08 + (1 - progress) * 0.28}`
    );

    spiral.appendChild(element);
  }
}


// ============================================================
// CREATE STATIC NUMBER
// ============================================================

function showNumber(number) {

  counter.innerHTML = "";

  const digits =
    String(number)
      .padStart(5, "0")
      .split("");

  digits.forEach(digit => {

    const wrapper =
      document.createElement("span");

    wrapper.className =
      "digit-wrapper";


    const track =
      document.createElement("span");

    track.className =
      "digit-track";


    const digitElement =
      document.createElement("span");

    digitElement.textContent =
      digit;


    track.appendChild(
      digitElement
    );

    wrapper.appendChild(
      track
    );

    counter.appendChild(
      wrapper
    );
  });
}


// ============================================================
// CREATE A REAL NUMBER WHEEL
// ============================================================

function createWheel(startDigit, endDigit, index) {

  const wrapper =
    document.createElement("span");

  wrapper.className =
    "digit-wrapper";


  const track =
    document.createElement("span");

  track.className =
    "digit-track";


  /*
    We deliberately create MANY complete rotations.

    Every digit therefore physically travels through:

    9
    8
    7
    6
    ...
    0
    9
    8
    ...

    before eventually landing on its target.
  */

  const fullRotations =
    3 + index * 0.35;


  const rotationSteps =
    Math.ceil(
      fullRotations * 10
    );


  /*
    Calculate where the target occurs
    after all those rotations.
  */

  let targetOffset =
    startDigit - endDigit;

  if (targetOffset < 0) {
    targetOffset += 10;
  }


  const totalSteps =
    rotationSteps +
    targetOffset;


  /*
    Build the complete wheel.
  */

  for (
    let step = 0;
    step <= totalSteps;
    step++
  ) {

    const value =
      (startDigit - step + 100) %
      10;

    const element =
      document.createElement("span");

    element.textContent =
      value;

    track.appendChild(
      element
    );
  }


  wrapper.appendChild(
    track
  );

  counter.appendChild(
    wrapper
  );


  return {
    track,
    totalSteps,
    index
  };
}


// ============================================================
// ROLL THE ENTIRE FIVE-DIGIT NUMBER
// ============================================================

function rollNumber(from, to) {

  if (isAnimating || finished) {
    return;
  }

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


  /*
    Clear the existing number.
  */

  counter.innerHTML = "";


  const wheels = [];


  /*
    Create FIVE independent mechanical wheels.

    This is the important part:
    every single digit gets its own wheel,
    including digits that don't change.
  */

  for (let i = 0; i < 5; i++) {

    const wheel =
      createWheel(
        fromDigits[i],
        toDigits[i],
        i
      );

    wheels.push(wheel);
  }


  /*
    Force the browser to render the
    starting position first.
  */

  wheels.forEach(wheel => {

    wheel.track.style.transform =
      "translateY(0px)";

  });


  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      /*
        Get the actual height of ONE digit.
      */

      const digitHeight =
        counter
          .querySelector(
            ".digit-track span"
          )
          .getBoundingClientRect()
          .height;


      /*
        Roll every wheel.

        The stagger makes it feel like a
        physical machine rather than a flat
        text animation.
      */

      wheels.forEach((wheel, index) => {

        const distance =
          wheel.totalSteps *
          digitHeight;


        /*
          Higher digits start slightly earlier.
          Lower digits follow.
        */

        const delay =
          index * 70;


        /*
          Slightly different durations create
          the mechanical cascading effect.
        */

        const duration =
          2400 +
          index * 120;


        wheel.track.style.transition =
          [
            "transform",
            `${duration}ms`,
            "cubic-bezier(0.12, 0.75, 0.2, 1)",
            `${delay}ms`
          ].join(" ");


        wheel.track.style.transform =
          `translateY(-${distance}px)`;

      });

    });

  });


  /*
    Wait for the slowest wheel.
  */

  const totalAnimationTime =
    2400 +
    (4 * 120) +
    (4 * 70) +
    150;


  setTimeout(() => {

    currentValue =
      to;


    /*
      Replace all the wheels with the
      clean final number.
    */

    showNumber(
      currentValue
    );


    isAnimating =
      false;


    /*
      27999 is the final state.

      Nothing else happens until refresh.
    */

    if (
      checkpointIndex ===
      CHECKPOINTS.length - 1
    ) {

      finished =
        true;

      app.classList.add(
        "complete"
      );
    }

  }, totalAnimationTime);
}


// ============================================================
// CLICK ANYWHERE
// ============================================================

document.addEventListener(
  "click",
  () => {

    if (
      isAnimating ||
      finished
    ) {
      return;
    }


    checkpointIndex++;


    const nextValue =
      CHECKPOINTS[
        checkpointIndex
      ];


    rollNumber(
      currentValue,
      nextValue
    );

  }
);


// ============================================================
// INITIALISE
// ============================================================

buildSpiral();

showNumber(
  currentValue
);
