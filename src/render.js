const { ipcRenderer } = require("electron");
const { Menu } = require("@electron/remote");

const videoElement = document.querySelector("video");
const videoSelectBtn = document.getElementById("videoSelectBtn");
const videoWrapper = document.getElementById("videoWrapper");
const sizeSelectWrapper = document.getElementById("sizeSelectWrapper");
let currentOpacity = 1;
let opacityDecaySpeed = 0.01;
let currentTime = Date.now();
let prevTime = Date.now();
let screenSelected = false;

let timer = Date.now();

function step(timestamp) {
  timestamp = Date.now();
  const elapsed = timestamp - prevTime;

  if (prevTime !== timestamp && screenSelected && currentOpacity) {
    //currentOpacity = Math.max(0.97 * currentOpacity, 0);
    if (Date.now() > timer + 500) {
      sizeSelectWrapper.style.opacity = 0;
    }
  }
  prevTime = timestamp;
  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

document.body.addEventListener("mousemove", function (e) {
  timer = Date.now();
  sizeSelectWrapper.style.opacity = 1;
});
document.body.addEventListener("scroll", function (e) {
  timer = Date.now();
  sizeSelectWrapper.style.opacity = 1;
});

const resize11720 = document.getElementById("resize11720");
resize11720.onclick = () => ipcRenderer.send("resize11720");

const resize169720 = document.getElementById("resize169720");
resize169720.onclick = () => ipcRenderer.send("resize169720");

const resize111080 = document.getElementById("resize111080");
resize111080.onclick = () => ipcRenderer.send("resize111080");

const resize1691080 = document.getElementById("resize1691080");
resize1691080.onclick = () => ipcRenderer.send("resize1691080");

const customWidth = document.getElementById("width");
const customHeight = document.getElementById("height");

// customWidth.addEventListener("focusout", (event) => {
//   if (customWidth.value > 5000) {
//     customWidth.value = 5000;
//   }
// });

// customHeight.addEventListener("focusout", (event) => {
//   if (customHeight.value > 5000) {
//     customHeight.value = 5000;
//   }
// });

// const customResize = document.getElementById("customSizeButton");
// customResize.onclick = () =>
//   ipcRenderer.send("resizecustom", {
//     width: customWidth.value,
//     height: customHeight.value,
//   });

window.onload = getVideoSources;

async function getVideoSources() {
  ipcRenderer.send("screen-capture");
  const loadingText = document.createElement("div");
  loadingText.innerText = "Loading screens";
  document.querySelector("#videoSelectBtn").appendChild(loadingText);
}

ipcRenderer.on("screen-capture-reply", (event, sources) => {
  document.querySelector("#videoSelectBtn").innerHTML =
    "<div>Choose screen:</div>";
  sources.map((source, index) => {
    const div = document.createElement("div");
    div.classList.add("windowContainer");

    const image = document.createElement("img");
    image.src = source.thumbnail.toDataURL();
    div.appendChild(image);

    div.onclick = () => selectSource(source);
    document.querySelector("#videoSelectBtn").appendChild(div);
  });
});

function changeVideoSize(change) {
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
  screenSelected = true;
  videoWrapper.style.height = "100vh";
}
