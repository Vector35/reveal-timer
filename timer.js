
/*****************************************************************
 * @author: Vector 35
 * https://github.com/vector35
 *
 * Timer.js for Reveal.js
 * Version 0.0.1
 *
 * @license
 * MIT licensed
 *
 ******************************************************************/

const Timer = () => {
  let interval;
  let timerDisplay, customTimeInput, timerOverlay;

  const createTimerOverlay = () => {
    timerOverlay = document.createElement('div');
    timerOverlay.id = 'timerOverlay';
//    timerOverlay.style.cssText = 'display: none; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000;';

    const container = document.createElement('div');
    container.id = 'timerContainer';
    //container.style.cssText = 'background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5); text-align: center;';

    timerOverlay.appendChild(container);

    const selectHTML = `
      <select id="timeSelect">
        <option value="300">5m</option>
        <option value="600">10m</option>
        <option value="900">15m</option>
        <option value="1800">30m</option>
        <option value="custom">Custom (min & sec)</option>
      </select>
      <input type="text" id="customTime" style="display:none;" placeholder="e.g., 1m 10s" />
      <button onclick="startTimer()">Start Timer</button>
      <button onclick="stopResetTimer()">Stop/Reset</button>
      <div id="timerClock">00:00</div>
    `;
    container.innerHTML = selectHTML;

    document.body.appendChild(timerOverlay);

    customTimeInput = document.getElementById('customTime');
    timerDisplay = document.getElementById('timerClock');

    document.getElementById('timeSelect').addEventListener('change', function() {
      const value = this.value
      customTimeInput.style.display = value === 'custom' ? 'inline' : 'none';
        // Immediately start the timer based on the new selection
      if (value !== 'custom') {
        console.log(value);
        const duration = parseInt(value, 10); // Assuming the value is in minutes
        startTimer(duration);
      }
    });
  };

  const startTimer = (duration) => {
    clearInterval(interval);
    let time = duration ? parseInt(duration, 10) : parseCustomTime(customTimeInput.value);
    updateDisplay(time);
    interval = setInterval(() => {
      if(time <= 0) {
        clearInterval(interval);
        timerDisplay.textContent = "DONE!";
        return;
      }
      time--;
      updateDisplay(time);
    }, 1000);
    if (timerOverlay) timerOverlay.style.display = 'flex';
  };

  const stopResetTimer = () => {
    clearInterval(interval);
    if (timerDisplay) timerDisplay.textContent = "00:00";
    if (timerOverlay) timerOverlay.style.display = 'none'; // Check if timerOverlay is defined
  };

  const updateDisplay = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (timerDisplay) timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const parseCustomTime = (input) => {
    let minutes = 0;
    let seconds = 0;

    // Check for a minutes specifier
    const minuteMatch = input.match(/(\d+)m/);
    if (minuteMatch) {
      minutes = parseInt(minuteMatch[1], 10);
    }

    // Check for a seconds specifier
    const secondMatch = input.match(/(\d+)s/);
    if (secondMatch) {
      seconds = parseInt(secondMatch[1], 10);
    }

    return minutes * 60 + seconds;
  };

  const checkSlideForTimer = (event) => {
    const slide = event.currentSlide;
    if (!slide) {
      console.error("Current slide is undefined");
    return;
    }
    const duration = slide.getAttribute('data-timer');
    if (duration) {
      startTimer(parseCustomTime(duration));
    } else {
      stopResetTimer();
    }
  };

  const initEventListeners = (reveal) => {
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            stopResetTimer();
        }
    });
    reveal.addEventListener('slidechanged', checkSlideForTimer);
    reveal.addEventListener('ready', checkSlideForTimer);
  };

  return {
    id: 'Timer',
    init: (reveal) => {
      createTimerOverlay();
      initEventListeners(reveal);
      window.startTimer = startTimer;
      window.stopResetTimer = stopResetTimer;
    }
  };
};

