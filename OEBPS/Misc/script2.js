let selectedConditions = [];

function toggleCondition(code) {
  if (!selectedConditions.includes(code)) {
    selectedConditions.push(code);
  }
  updateSelectedConditions();
}

function updateSelectedConditions() {
  const container = document.getElementById("selected-conditions");
  const overlay = document.querySelector(".overlay-text");
  container.innerHTML = ""; // 초기화

  selectedConditions.forEach(code => {
    const img = document.createElement("img");
    img.className = "ccl-icon";
    img.alt = code;
    img.src = "../Images/icon_" + code + ".png";
    container.appendChild(img);
  });

  updateComboResult();

  // 조건이 하나라도 있으면 overlay 문구 숨김
  if (overlay) {
    overlay.style.display = selectedConditions.length > 0 ? "none" : "block";
  }
}

function updateComboResult() {
  const result = document.getElementById("combo-result");
  if (selectedConditions.length === 0) {
    result.innerText = "선택된 조건에 따른 의미가 여기에 표시됩니다.";
    return;
  }

  let meaning = selectedConditions.map(cond => {
    switch (cond) {
      case "BY": return "✔ 출처를 밝혀야 함";
      case "NC": return "✔ 비영리 목적에만 사용 가능";
      case "ND": return "✔ 변경 없이 원본 그대로 사용";
      case "SA": return "✔ 동일한 조건으로만 재배포";
      default: return "";
    }
  }).join("\n");

  result.innerText = meaning;
}

// 드래그 앤 드롭
function dragCondition(event, code) {
  event.dataTransfer.setData("text/plain", code);
}

function allowDrop(event) {
  event.preventDefault();
}

function dropCondition(event) {
  event.preventDefault();
  const code = event.dataTransfer.getData("text/plain");
  if (!selectedConditions.includes(code)) {
    selectedConditions.push(code);
  }
  updateSelectedConditions();
}

// YouTube 영상 제어
function playVideo() {
  const video = document.getElementById("cclVideo");
  video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
}

function pauseVideo() {
  const video = document.getElementById("cclVideo");
  video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}


function openCclOverlay() {
  const overlay = document.getElementById("cclOverlay");
  if (overlay) overlay.style.display = "block";
}

function closeCclOverlay() {
  const overlay = document.getElementById("cclOverlay");
  if (overlay) overlay.style.display = "none";
}
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('cclVideo');
}

function playVideo() {
  if (player && typeof player.playVideo === "function") {
    player.playVideo();
  }
}

function pauseVideo() {
  if (player && typeof player.pauseVideo === "function") {
    player.pauseVideo();
  }
}
