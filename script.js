let audioContext;
let analyser;
let dataArray;

function startMic() {
  // resume audio context for iOS Safari
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      let mic = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      mic.connect(analyser);

      analyser.fftSize = 256;
      let bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      listenForBlow();
    })
    .catch((err) => {
      alert("Microphone access is required! Please allow it.");
      console.error("Microphone error:", err);
    });
}

function listenForBlow() {
  function checkVolume() {
    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    if (volume > 60) { // Adjust sensitivity here
      blowCandles();
      return;
    }
    requestAnimationFrame(checkVolume);
  }
  checkVolume();
}

function blowCandles() {
  document.getElementById("candle5").style.opacity = 0.2;
  document.getElementById("candle1").style.opacity = 0.2;
  document.getElementById("message").classList.remove("hidden");
  document.getElementById("startBtn").style.display = "none";
}
