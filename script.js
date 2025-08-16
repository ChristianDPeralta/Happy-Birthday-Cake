// Select candles and message
const candles = document.querySelectorAll(".candle");
const message = document.getElementById("message");

let audioContext;
let analyser;
let dataArray;

function startMic() {
  // Create audio context (for iOS Safari compatibility)
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();

  // Ask for microphone access
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      listenForBlow();
    })
    .catch(err => {
      console.error("Mic access denied:", err);
      alert("Please enable microphone access to blow out the candles 🎤");
    });
}

function listenForBlow() {
  function detect() {
    analyser.getByteFrequencyData(dataArray);

    // Measure loudness (average volume)
    let values = 0;
    for (let i = 0; i < dataArray.length; i++) {
      values += dataArray[i];
    }
    let average = values / dataArray.length;

    // If loud enough, blow out candles
    if (average > 50) {
      blowOutCandles();
      return; // stop checking after success
    }

    requestAnimationFrame(detect);
  }

  detect();
}

function blowOutCandles() {
  candles.forEach(candle => {
    candle.style.setProperty("--flame", "none");
    candle.style.animation = "none";
    candle.style.background = "#ddd"; // burned out
  });
  message.classList.remove("hidden");
}

// Start mic on first user interaction (needed for mobile autoplay policies)
document.body.addEventListener("click", () => {
  if (!audioContext || audioContext.state === "suspended") {
    startMic();
  }
}, { once: true });
