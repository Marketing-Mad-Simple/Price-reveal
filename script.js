const counter =
  document.getElementById("counter");

const spiral =
  document.getElementById("spiral");

const app =
  document.getElementById("app");


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

let currentValue =
  CHECKPOINTS[0];

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


  for (
    let i = 0;
    i < count;
    i++
  ) {

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


    spiral.appendChild(
      element
    );
  }
}


// ============================================================
// DISPLAY NUMBER
// ============================================================

function render(value) {

  counter.textContent =
    String(value).padStart(
      5,
      "0"
    );
}


// ============================================================
// ROLLING ANIMATION
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
    Slower cinematic duration.

    Every checkpoint gets enough time
    to feel like a deliberate reveal.
  */

  const duration = 4000;


  const startTime =
    performance.now();


  // ----------------------------------------------------------
  // EASING
  // ----------------------------------------------------------

  function easeInOut(t) {

    return t < 0.5

      ? 2 * t * t

      : 1 -
        Math.pow(
          -2 * t + 2,
          2
        ) / 2;
  }


  // ----------------------------------------------------------
  // FRAME
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
      easeInOut(progress);


    /*
      Roll through EVERY intermediate number.
    */

    const value =
      Math.round(
        start -
        difference * eased
      );


    render(value);


    // --------------------------------------------------------
    // ROTATION
    // --------------------------------------------------------

    /*
      Gentle rocking motion.

      Strongest around the middle,
      perfectly straight at the beginning
      and end.
    */

    const rotation =
      Math.sin(
        progress * Math.PI
      ) * 3.5;


    // --------------------------------------------------------
    // VERTICAL MOVEMENT
    // --------------------------------------------------------

    const lift =
      Math.sin(
        progress * Math.PI
      ) * -10;


    // --------------------------------------------------------
    // SCALE
    // --------------------------------------------------------

    const scale =
      1 +
      Math.sin(
        progress * Math.PI
      ) * 0.025;


    // --------------------------------------------------------
    // APPLY
    // --------------------------------------------------------

    counter.style.transform =
      `
        translateY(${lift}px)
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

      return;
    }


    // --------------------------------------------------------
    // FINISH
    // --------------------------------------------------------

    currentValue =
      target;


    render(
      target
    );


    /*
      Return perfectly to neutral.
    */

    counter.style.transform =
      "translateY(0) rotate(0deg) scale(1)";


    isAnimating =
      false;


    // --------------------------------------------------------
    // FREEZE AT 27999
    // --------------------------------------------------------

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
