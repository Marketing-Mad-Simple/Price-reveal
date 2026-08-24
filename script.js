/* ============================================================
   MECHANICAL NUMBER ROLLER
   ============================================================ */

.counter {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 1em;
}

.digit-wrapper {
  display: inline-block;
  position: relative;
  height: 1em;
  overflow: hidden;
  line-height: 1;
}

.digit-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform;
}

.digit-track span {
  display: block;
  height: 1em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 600px) {
  .digit-wrapper {
    height: 1em;
  }
}
