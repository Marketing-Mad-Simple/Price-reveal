const counter = document.getElementById("counter");
const spiral = document.getElementById("spiral");
const app = document.getElementById("app");

const CHECKPOINTS = [34999, 32999, 30999, 29999, 27999];

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

    const angle =
      t *
      Math.PI *
      2 *
      turns;

    const radius =
      minRadius +
      (maxRadius - minRadius) * t;

    const number =
      CHECKPOINTS[0] -
      i * 137;

    const el =
      document.createElement("span");

    el.className =
      "spiral-number";

    el.textContent =
      String(Math.max(10000, number));

    el.style.setProperty(
      "--radius",
      `${radius}vw`
    );

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
// DISPLAY NUMBER
// ============================================================

function render(value) {

  counter.textContent =
    String(value).padStart(5, "0");

}


// ============================================================
// SMOOTH FULL-NUMBER ROLL
// ============================================================

function rollTo(target) {

  if (isAnimating || finished) {
    return;
  }

  isAnimating = true;

  const start =
    currentValue;

  const difference =
    start - target;

  /*
    The entire five-digit number rolls continuously.

    The user only clicks once, but visually the number
    passes through every intermediate value.

    It will ONLY settle at the predefined checkpoint.
  */

  const duration =
    Math.min(
      2600,
      Math.max(
        1400,
        difference * 0.6
      )
    );

  const startTime =
    performance.now();


  function easeInOut(t) {

    return t < 0.5
      ? 2 * t * t
      : 1 -
        Math.pow(
          -2 * t + 2,
          2
        ) / 2;

  }


  function animate(now) {

    const elapsed =
      now - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    const eased =
      easeInOut(progress);


    /*
      Continuously change the ENTIRE number.

      This is the part that gave us the original
      full-number mechanical/rolling effect.
    */

    const value =
      Math.round(
        start -
        difference * eased
      );


    render(value);


    if (progress < 1) {

      requestAnimationFrame(
        animate
      );

    } else {

      /*
        Always force the exact checkpoint.

        No rounding error can leave us on another
        final number.
      */

      currentValue =
        target;

      render(
        target
      );

      isAnimating =
        false;


      /*
        Final checkpoint.
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

    }

  }


  requestAnimationFrame(
    animate
  );
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


    const nextTarget =
      CHECKPOINTS[
        checkpointIndex
      ];


    rollTo(
      nextTarget
    );

  }
);


// ============================================================
// INITIALISE
// ============================================================

buildSpiral();

render(
  currentValue
);
