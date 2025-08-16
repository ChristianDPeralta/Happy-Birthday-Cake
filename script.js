let mic;
let audioContext;
let analyser;
let dataArray;

function startMic() {
  // create audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      mic = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      mic.connect(analyser);

      analyser.fftSize = 256;
      let bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      listenForBlow();
    })
    .catch((err) => {
      console.error("Microphone access denied:", err);
    });
}

function listenForBlow() {
  function checkVolume() {
    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    if (volume > 60) {  // threshold for "blowing"
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
  document.getElementById("startBtn").style.display = "none"; // hide start button
}
