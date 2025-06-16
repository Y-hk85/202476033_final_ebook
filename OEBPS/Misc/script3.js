function evaluateCitation() {
    const input = document.getElementById('citationInput').value;
    const feedback = document.getElementById('feedbackBox');
    if (input.includes('https://') && input.includes('CC')) {
      feedback.innerText = '출처 문장이 적절합니다! 😊';
      feedback.style.background = '#e0ffe0';
    } else {
      feedback.innerText = '출처 문장에 필요한 요소가 빠졌어요. 다시 확인해보세요!';
      feedback.style.background = '#ffe0e0';
    }
  }
  
  function selectEmojiRadio(radio) {
    const spans = radio.parentNode.querySelectorAll('span');
    spans.forEach(s => s.style.opacity = '0.3');
    const index = Array.from(radio.parentNode.querySelectorAll('input')).indexOf(radio);
    spans[index].style.opacity = '1';
  }
  
  function showPopupQuiz() {
    document.getElementById('quizPopup').style.display = 'block';
    document.getElementById('quizPopupOverlay').style.display = 'block';
  }
  
  function closePopupQuiz() {
    document.getElementById('quizPopup').style.display = 'none';
    document.getElementById('quizPopupOverlay').style.display = 'none';
    resetQuiz();
  }
  
  function checkAnswer(index) {
    const options = document.querySelectorAll('.quiz-option');
    const resultMsg = document.getElementById('quizResultMsg');
    options.forEach((opt, i) => {
      opt.classList.remove('correct', 'incorrect');
    });
    if (index === 2) {
      options[2].classList.add('correct');
      resultMsg.textContent = '정답입니다! 참 잘했어요 👍';
      resultMsg.style.color = '#388e3c';
    } else {
      options[index].classList.add('incorrect');
      resultMsg.textContent = '오답입니다. 다시 선택하세요!';
      resultMsg.style.color = '#d32f2f';
    }
  }
  
  function resetQuiz() {
    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.classList.remove('correct', 'incorrect');
    });
    const resultMsg = document.getElementById('quizResultMsg');
    if(resultMsg) resultMsg.textContent = '';
  }
  
  function showPracticeExplain() {
    var popup = document.getElementById('practiceExplainPopup');
    if (popup) popup.classList.add('active');
  }
  
  function closePracticeExplain() {
    var popup = document.getElementById('practiceExplainPopup');
    if (popup) popup.classList.remove('active');
  }