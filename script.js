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
