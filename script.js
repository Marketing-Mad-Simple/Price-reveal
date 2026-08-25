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

  const start = currentValue;
  const difference = start - target;

  /*
    SLOWER, MORE CINEMATIC ROLL

    The old animation was quite quick.
    This gives each transition roughly 4 seconds,
    while still adapting slightly to the distance.
  */

  const duration =
    Math.min(
      4500,
      Math.max(
        3000,
        difference * 1.5
      )
    );

  const startTime = performance.now();


  /*
    Stronger easing creates a sense of momentum:
    
    - starts slowly
    - accelerates
    - rolls through the numbers
    - gradually settles
  */

  function easeInOutCubic(t) {

    return t < 0.5
      ? 4 * t * t * t
      : 1 -
        Math.pow(
          -2 * t + 2,
          3
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
      easeInOutCubic(progress);


    /*
      Calculate the current number.
    */

    const value =
      Math.round(
        start -
        difference * eased
      );


    render(value);


    /*
      ROTATION EFFECT

      The entire number subtly rotates and moves vertically
      while the counter is rolling.

      The rotation peaks around the middle of the animation
      and naturally returns to zero at the end.
    */

    const rotation =
      Math.sin(
        progress * Math.PI
      ) * 3.5;


    const verticalMovement =
      Math.sin(
        progress * Math.PI
      ) * -12;


    const scale =
      1 +
      Math.sin(
        progress * Math.PI
      ) * 0.035;


    counter.style.transform =
      `
        translateY(${verticalMovement}px)
        rotate(${rotation}deg)
        scale(${scale})
      `;


    if (progress < 1) {

      requestAnimationFrame(
        animate
      );

    } else {

      /*
        Always finish on the EXACT checkpoint.
      */

      currentValue =
        target;

      render(
        target
      );


      /*
        Return the number to its normal position.
      */

      counter.style.transform =
        "translateY(0) rotate(0deg) scale(1)";


      isAnimating =
        false;


      /*
        Freeze permanently at 27999.
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
