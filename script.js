// Start microphone input
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  source.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function checkBlow() {
    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

    if (volume > 50) { 
      extinguishCandles();
    }

    requestAnimationFrame(checkBlow);
  }

  checkBlow();
});

function extinguishCandles() {
  document.getElementById("candle5").classList.add("extinguished");
  document.getElementById("candle1").classList.add("extinguished");
}
document.getElementById("message").classList.remove("hidden");
// Add this inside your <script> but keep the rest of your code
let audioCtx;
let analyser;
let dataArray;

async function enableMic() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaStreamSource(stream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);

    listenBlow();
  } catch (err) {
    console.error("Mic error:", err);
    alert("Please allow microphone access to blow out the candles 🎤");
  }
}

function listenBlow() {
  function detect() {
    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

    if (volume > 60) { // adjust threshold if too sensitive
      document.querySelectorAll(".candle::after, .flame").forEach(f => f.style.display = "none");
      alert("🎉 Candles blown out!");
    }

    requestAnimationFrame(detect);
  }
  detect();
}

// Require a tap before enabling mic (fix for mobile autoplay restriction)
document.body.addEventListener("click", () => {
  if (!audioCtx || audioCtx.state === "suspended") {
    enableMic();
  }
}, { once: true });
