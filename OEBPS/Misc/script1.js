
function openVideo(url) {
  window.open(url, "videoWindow", "width=800,height=450");
}

function readBox(boxId) {
  const element = document.getElementById(boxId);
  if (element) {
    const text = element.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel(); // 중복 방지
    speechSynthesis.speak(utterance);
  }
}

function stopReading() {
  speechSynthesis.cancel();
}

function toggleCard(cardId) {
  const card = document.getElementById(cardId);
  if (card.style.display === "block") {
    card.style.display = "none";
  } else {
    card.style.display = "block";
  }
}

function toggleQuiz() {
  const quiz = document.getElementById("quizPopup");
  if (quiz.style.display === "block") {
    quiz.style.display = "none";
  } else {
    quiz.style.display = "block";
  }
}

function checkAnswer(isCorrect, number) {
  const feedback = document.getElementById("quizFeedback" + number);
  if (isCorrect) {
    feedback.innerText = "✅ 정답입니다!";
    feedback.style.color = "green";
  } else {
    feedback.innerText = "❌ 오답입니다. 다시 생각해보세요.";
    feedback.style.color = "red";
  }
}
  function playIntroVideo() {
    const video = document.getElementById('introVideo');
    if (video) {
      video.play();
    }
  }
  
document.addEventListener('DOMContentLoaded', function() {
  const playButton = document.getElementById('playVideoButton');
  const introVideo = document.getElementById('introVideo');

  if (playButton && introVideo) {
    playButton.addEventListener('click', function() {
      introVideo.play();
    });
  }
});
