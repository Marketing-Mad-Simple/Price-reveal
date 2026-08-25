const counter = document.getElementById("counter");
const spiral = document.getElementById("spiral");
const app = document.getElementById("app");


// ============================================================
// FIXED CHECKPOINTS
// ============================================================

const CHECKPOINTS = [
  34999,
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

    const progress =
      i / (count - 1);

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
      String(
        Math.max(
          10000,
          number
        )
      );


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
// DISPLAY NUMBER
// ============================================================

function render(value) {

  counter.textContent =
    String(value).padStart(5, "0");

}


// ============================================================
// FULL NUMBER ROLL
// ============================================================

function rollTo(target) {

  if (
    isAnimating ||
    finished
  ) {
    return;
  }


  isAnimating = true;


  const start =
    currentValue;


  const difference =
    start - target;


  /*
    SLOW CINEMATIC ANIMATION

    Minimum: 3.6 seconds
    Maximum: 4.8 seconds
  */

  const duration =
    Math.min(
      4800,
      Math.max(
        3600,
        difference * 1.8
      )
    );


  const startTime =
    performance.now();


  // ----------------------------------------------------------
  // EASING
  // ----------------------------------------------------------

  function easeInOutQuint(t) {

    return t < 0.5
      ? 16 * Math.pow(t, 5)
      : 1 -
        Math.pow(
          -2 * t + 2,
          5
        ) / 2;
  }


  // ----------------------------------------------------------
  // ANIMATION
  // ----------------------------------------------------------

  function animate(now) {

    const elapsed =
      now - startTime;


    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    const eased =
      easeInOutQuint(progress);


    /*
      Calculate the rolling number.
    */

    const value =
      Math.round(
        start -
        difference * eased
      );


    render(value);


    // --------------------------------------------------------
    // ROTATION EFFECT
    // --------------------------------------------------------

    /*
      The rotation starts at zero,
      becomes strongest around the middle,
      then settles back to zero.

      This makes the number feel like it has physical
      momentum rather than simply changing text.
    */

    const rotation =
      Math.sin(
        progress * Math.PI
      ) * 4;


    // --------------------------------------------------------
    // VERTICAL MOVEMENT
    // --------------------------------------------------------

    const verticalMovement =
      Math.sin(
        progress * Math.PI
      ) * -16;


    // --------------------------------------------------------
    // SCALE
    // --------------------------------------------------------

    const scale =
      1 +
      Math.sin(
        progress * Math.PI
      ) * 0.045;


    // --------------------------------------------------------
    // APPLY MOTION
    // --------------------------------------------------------

    counter.style.transform =
      `
        translateY(${verticalMovement}px)
        rotate(${rotation}deg)
        scale(${scale})
      `;


    // --------------------------------------------------------
    // CONTINUE
    // --------------------------------------------------------

    if (
      progress < 1
    ) {

      requestAnimationFrame(
        animate
      );

    }

    else {

      /*
        ALWAYS LAND ON THE EXACT CHECKPOINT.
      */

      currentValue =
        target;


      render(
        target
      );


      /*
        Return the number to its neutral position.
      */

      counter.style.transform =
        "translateY(0) rotate(0deg) scale(1)";


      isAnimating =
        false;


      // ------------------------------------------------------
      // FINAL STATE
      // ------------------------------------------------------

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

    /*
      Don't allow another click while the number
      is still rolling.
    */

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
