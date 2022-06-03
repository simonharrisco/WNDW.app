const { ipcRenderer } = require("electron");
const { Menu } = require("@electron/remote");

const videoElement = document.querySelector("video");
const videoSelectBtn = document.getElementById("videoSelectBtn");

window.onload = getVideoSources;

async function getVideoSources() {
  ipcRenderer.send("screen-capture");
  const loadingText = document.createElement("div");
  loadingText.innerText = "Loading screens";
  document.querySelector("#videoSelectBtn").appendChild(loadingText);
}

ipcRenderer.on("screen-capture-reply", (event, sources) => {
  document.querySelector("#videoSelectBtn").innerHTML = "Choose screen: ";
  sources.map((source, index) => {
    const button = document.createElement("button");
    button.innerText = source.name;
    button.onclick = () => selectSource(source);
    document.querySelector("#videoSelectBtn").appendChild(button);
  });
});

function changeVideoSize(change) {
  console.log("got here");
  currentZoom += change;
  videoElement.style.width = `${currentZoom}%`;
}

async function selectSource(source) {
  document.querySelector("#videoSelectBtn").innerHTML = "";
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
      },
    },
  });

  videoElement.srcObject = stream;
  videoElement.onloadedmetadata = (e) => videoElement.play();
}
// ipcRenderer.on("stream", (event, stream) => {
//   videoElement.srcObject = stream;
//   videoElement.onloadedmetadata = (e) => video.play();
// });
