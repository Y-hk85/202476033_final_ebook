document.addEventListener("DOMContentLoaded", function() {
  function showAnswer(btn, isCorrect) {
    const feedback = btn.parentNode.querySelector('.feedback');
    const explainBox = btn.parentNode.querySelector('.explain-box');

    if (isCorrect) {
      feedback.textContent = "정답입니다!";
      feedback.style.color = "green";
      if (explainBox) explainBox.style.display = 'block';
    } else {
      feedback.textContent = "오답입니다.";
      feedback.style.color = "red";
      if (explainBox) explainBox.style.display = 'none';
    }
    
    btn.parentNode.querySelectorAll('button').forEach(b => b.style.opacity = '0.5');
    btn.style.opacity = '1';
  }
  window.showAnswer = showAnswer;

  function checkCitation() {
    const feedback = document.querySelector(".citation-feedback");
    const answer = document.querySelector("input[name='citation']:checked");
    if (!answer) {
      feedback.textContent = "선택지를 골라주세요.";
      feedback.style.color = "orange";
      return;
    }
    if (answer.value === "2") {
      feedback.textContent = "정답입니다! 올바른 출처 형식이에요.";
      feedback.style.color = "green";
    } else {
      feedback.textContent = "오답입니다. 출처 형식을 다시 확인해보세요.";
      feedback.style.color = "red";
    }
  }
  window.checkCitation = checkCitation;

  // 용어사전 기능
  window.openGlossary = function() {
    document.getElementById('glossaryPopup').style.display = 'flex';
  };

  window.closeGlossary = function() {
    document.getElementById('glossaryPopup').style.display = 'none';
  };

  // 빈칸 채우기 퀴즈
  window.checkFillBlank = function(btn) {
    const input = btn.parentNode.querySelector('.blank-input');
    const feedback = btn.parentNode.querySelector('.feedback');
    const explainBox = btn.parentNode.querySelector('.explain-box');
    const answer = input.getAttribute('data-answer');
    
    if (input.value.trim() === answer) {
      feedback.textContent = "정답입니다!";
      feedback.style.color = "#388e3c";
      input.style.borderColor = "#388e3c";
      if (explainBox) explainBox.style.display = 'block';
    } else {
      feedback.textContent = "다시 한번 생각해보세요.";
      feedback.style.color = "#d32f2f";
      input.style.borderColor = "#d32f2f";
      if (explainBox) explainBox.style.display = 'none';
    }
  };

  // 이미지 퀴즈
  window.checkImageAnswer = function(img, isCorrect) {
    const feedback = img.parentNode.parentNode.querySelector('.feedback');
    const allImages = img.parentNode.querySelectorAll('img');
    
    allImages.forEach(i => i.style.border = 'none');
    img.style.border = '3px solid ' + (isCorrect ? '#388e3c' : '#d32f2f');
    
    feedback.textContent = isCorrect ? "정답입니다!" : "다시 한번 생각해보세요.";
    feedback.style.color = isCorrect ? "#388e3c" : "#d32f2f";
  };

  // 드래그 앤 드롭 개선
  const dragItems = document.querySelectorAll('.drag-item');
  dragItems.forEach(item => {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item.textContent);
      e.dataTransfer.effectAllowed = 'move';
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', e => {
      item.classList.remove('dragging');
    });
  });

  const dropBoxes = document.querySelectorAll('.drop-box');
  dropBoxes.forEach(box => {
    box.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    box.addEventListener('drop', e => {
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain');
      const draggingItem = document.querySelector('.drag-item.dragging');
      
      if (draggingItem) {
        const newItem = document.createElement('div');
        newItem.className = 'drag-item';
        newItem.textContent = data;
        newItem.draggable = true;
        
        // 중복 체크
        const existingItems = box.querySelectorAll('.drag-item');
        const isDuplicate = Array.from(existingItems).some(item => 
          item.textContent.trim() === data.trim()
        );
        
        if (!isDuplicate) {
          box.appendChild(newItem);
          draggingItem.remove();
        }
      }
    });
  });

  // 활동 1 정답 확인 기능
  window.checkActivity1 = function() {
    const infringementBox = document.getElementById('infringement');
    const fairuseBox = document.getElementById('fair-use');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('feedback');
    feedbackDiv.style.marginTop = '1em';

    // 기존 피드백 메시지 제거
    const existingFeedback = document.querySelector('.activity-section .feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const infringementItems = Array.from(infringementBox.querySelectorAll('.drag-item')).map(item => item.textContent.trim());
    const fairuseItems = Array.from(fairuseBox.querySelectorAll('.drag-item')).map(item => item.textContent.trim());

    const correctInfringement = [
      '친구의 그림을 허락 없이 사용',
      '웹에서 음악 다운받아 사용',
      '온라인 기사 내용 복사 후 출처 없이 사용',
      '친구에게 받은 유료 폰트 공유'
    ];
    const correctFairUse = [
      '직접 찍은 사진 사용'
    ];

    let isCorrect = true;
    let feedbackText = '';

    // 저작권 침해 항목 확인
    if (infringementItems.length !== correctInfringement.length || !infringementItems.every(item => correctInfringement.includes(item))) {
      isCorrect = false;
      feedbackText += '저작권 침해 항목을 다시 확인해 보세요.\n';
    }

    // 합법적 사용 항목 확인
    if (fairuseItems.length !== correctFairUse.length || !fairuseItems.every(item => correctFairUse.includes(item))) {
       isCorrect = false;
       feedbackText += '합법적 사용 항목을 다시 확인해 보세요.';
    }

    if (isCorrect) {
      feedbackDiv.textContent = '훌륭해요! 저작권 침해 사례를 잘 구분했습니다.';
      feedbackDiv.style.color = 'green';
    } else {
      if (feedbackText === '') { // 모든 항목이 잘못된 위치에 있을 경우
         feedbackText = '모든 항목의 위치를 다시 확인해 보세요.';
      }
      feedbackDiv.textContent = feedbackText;
      feedbackDiv.style.color = 'red';
    }
    
    document.querySelector('.activity-section').appendChild(feedbackDiv);
  };

  // 활동 1 다시하기 기능
  window.resetActivity1 = function() {
    const itemsToDrag = document.getElementById('drag-source');
    const dropBoxes = document.querySelectorAll('.drop-box');
    const feedback = document.querySelector('.activity-section .feedback');

    // 드롭 박스의 항목들을 원래 위치로 이동
    dropBoxes.forEach(box => {
      const items = Array.from(box.querySelectorAll('.drag-item'));
      items.forEach(item => {
        itemsToDrag.appendChild(item);
      });
    });

    // 기존 피드백 메시지 제거
    if (feedback) {
      feedback.remove();
    }
    // 드래그 가능한 상태로 복원
itemsToDrag.querySelectorAll('.drag-item').forEach(item => {
  item.setAttribute('draggable', 'true');

  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', item.textContent);
    e.dataTransfer.effectAllowed = 'move';
    item.classList.add('dragging');
  });

  item.addEventListener('dragend', e => {
    item.classList.remove('dragging');
  });
});

  };

  // 별점 평가 기능 (기존 코드 제거)
  // const stars = document.querySelectorAll('.star-rating .star');
  // stars.forEach((star, index) => {
  //   star.addEventListener('click', () => {
  //     stars.forEach((s, i) => {
  //       s.classList.toggle('selected', i <= index);
  //     });
  //   });
  // });

  // 팝업 열기/닫기 함수
  window.openPopup = function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  };

  window.closePopup = function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('active');
  };

  // 드래그 순서 맞추기 기능 (팝업 내 새로운 id 사용)
  const listPopup = document.getElementById('sortable-list-popup');
  let draggingElePopup, placeholderPopup;

  if (listPopup) {
    listPopup.addEventListener('dragstart', function(e) {
      draggingElePopup = e.target;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => draggingElePopup.classList.add('dragging'), 0);
    });

    listPopup.addEventListener('dragend', function(e) {
      draggingElePopup.classList.remove('dragging');
      draggingElePopup = null;
    });

    listPopup.addEventListener('dragover', function(e) {
      e.preventDefault();
      const afterElement = getDragAfterElementPopup(listPopup, e.clientY);
      if (afterElement == null) {
        listPopup.appendChild(draggingElePopup);
      } else {
        listPopup.insertBefore(draggingElePopup, afterElement);
      }
    });
  }

  function getDragAfterElementPopup(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  window.checkOrderPopup = function() {
    const correct = ["저작권 확인", "이용 허락 받기", "출처 표시", "저작물 이용"];
    const items = Array.from(listPopup.children).map(li => li.textContent.trim());
    const feedback = document.getElementById('order-feedback-popup');
    const explainBox = document.getElementById('order-feedback-popup').parentNode.querySelector('.explain-box');

    if (JSON.stringify(items) === JSON.stringify(correct)) {
      feedback.textContent = "정답입니다! 잘했어요.";
      feedback.style.color = "#388e3c";
       if (explainBox) explainBox.style.display = 'block';
    } else {
      feedback.textContent = "순서를 다시 확인해 보세요.";
      feedback.style.color = "#d32f2f";
      if (explainBox) explainBox.style.display = 'none';
    }
  };

  // 메인 화면 자기 평가 별점 기능 (새로 작성)
  const ratingGroups = document.querySelectorAll('.self-eval-section .star-rating');
  ratingGroups.forEach(group => {
    const stars = group.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const value = parseInt(this.getAttribute('data-value'));
        const currentStars = this.parentNode.querySelectorAll('.star');
        
        // 현재 그룹의 별들만 초기화
        currentStars.forEach(s => s.classList.remove('selected'));
        
        // 선택한 값까지의 별들만 선택
        for (let i = 0; i < value; i++) {
          currentStars[i].classList.add('selected');
        }
        
        // 현재 선택된 별점 값 저장
        const ratingId = group.id;
        console.log(`자기평가 별점 (${ratingId}): ${value}점`);
      });
    });
  });

  // 자기 평가 서술형 입력 내용 저장 (선택 사항)
  const selfSubjectiveTextarea = document.getElementById('self-subjective');
  if (selfSubjectiveTextarea) {
      // 기존 change 이벤트 리스너 유지 (실시간 콘솔 확인용)
      selfSubjectiveTextarea.addEventListener('change', function() {
          console.log(`자기평가 서술형 내용 변경됨: ${this.value}`);
      });

      // 저장하기 버튼 클릭 시 호출될 함수
      window.saveSelfSubjective = function() {
          const content = selfSubjectiveTextarea.value.trim();
          console.log(`자기평가 서술형 내용 저장됨: ${content}`);
          // 실제 저장 로직 (예: localStorage)은 여기에 추가
          alert('작성한 내용이 저장되었습니다!'); // 저장 확인 알림
      };
  }

  // 힌트 팝업 열기/닫기 함수
  window.openHintPopup = function(btn, hintId) {
      const hintContent = document.getElementById(hintId);
      const globalHintPopup = document.getElementById('globalHintPopup');
      const hintPopupText = document.getElementById('hint-popup-text');

      if (hintContent && globalHintPopup && hintPopupText) {
          hintPopupText.innerHTML = hintContent.innerHTML; // 힌트 내용을 팝업에 복사
          globalHintPopup.classList.add('active'); // 힌트 팝업 표시
      }
  };

  window.closeHintPopup = function() {
      const globalHintPopup = document.getElementById('globalHintPopup');
      if (globalHintPopup) {
          globalHintPopup.classList.remove('active'); // 힌트 팝업 숨김
      }
  };

  // 객관식 문제 정답 확인 함수
  window.checkMCQ = function(name, correctAnswer, btn) {
      const feedback = btn.parentNode.querySelector('.feedback');
      const explainBox = btn.parentNode.querySelector('.explain-box');
      const radios = btn.parentNode.querySelectorAll('input[type="radio"][name="' + name + '"]');
      let selectedValue = null;
      radios.forEach(radio => {
          if (radio.checked) {
              selectedValue = radio.value;
          }
      });

      if (selectedValue === null) {
          feedback.textContent = "선택지를 골라주세요.";
          feedback.style.color = "orange";
           if (explainBox) explainBox.style.display = 'none';
      } else if (parseInt(selectedValue) === correctAnswer) {
          feedback.textContent = "정답입니다!";
          feedback.style.color = "#388e3c";
           if (explainBox) explainBox.style.display = 'block';
      } else {
          feedback.textContent = "오답입니다.";
          feedback.style.color = "#d32f2f";
           if (explainBox) explainBox.style.display = 'none';
      }
  };

  // 서술형 문제 제출 함수
  window.checkSubjectivePopup = function() {
      const answer = document.getElementById('subjectiveInputPopup').value.trim();
      const feedback = document.getElementById('subjectiveInputPopup').parentNode.querySelector('.feedback');
      const explainBox = document.getElementById('subjectiveInputPopup').parentNode.querySelector('.explain-box');

      // 서술형은 정답이 정해져 있지 않으므로 제출 시 무조건 해설 표시
       if (explainBox) explainBox.style.display = 'block';

      if (answer.length < 5) {
          feedback.textContent = "조금 더 자세히 작성해 주세요.";
          feedback.style.color = "#d32f2f";
      } else if (answer.includes("처벌") || answer.includes("문제")) {
          feedback.textContent = "좋아요! 작성한 내용을 확인해보세요.";
          feedback.style.color = "#388e3c";
      } else {
          feedback.textContent = "작성한 내용을 확인해보세요.";
          feedback.style.color = "#1976d2";
      }
  };

  // 활동 2 정답 확인 기능
  window.checkActivity2 = function() {
    console.log('checkActivity2 함수 호출됨'); // 디버깅 로그
    const citationInput = document.getElementById('citation-output');
    // 활동 2 섹션 내의 feedback div를 올바르게 선택
    const feedbackDiv = document.querySelector('.activity2-controls').parentNode.querySelector('.citation-feedback');

    // 기존 피드백 메시지 제거
    if (feedbackDiv) {
        feedbackDiv.textContent = '';
        feedbackDiv.style.color = '';
    }

    const userAnswer = citationInput.value.trim();
    const correctAnswerKeywords = ['김민준', '여름 바다', '무료 이미지 사이트', 'CC BY']; // 예시 정답 키워드
    
    let allKeywordsFound = true;
    correctAnswerKeywords.forEach(keyword => {
        if (!userAnswer.includes(keyword)) {
            allKeywordsFound = false;
        }
    });

    if (userAnswer.length === 0) {
        feedbackDiv.textContent = '출처를 작성해 주세요.';
        feedbackDiv.style.color = 'orange';
    } else if (allKeywordsFound) {
        feedbackDiv.textContent = '훌륭해요! 필요한 정보가 모두 포함되었습니다.';
        feedbackDiv.style.color = 'green';
    } else {
        feedbackDiv.textContent = '출처 정보가 부족하거나 잘못되었습니다. 다시 확인해 보세요.';
        feedbackDiv.style.color = 'red';
    }
  };

  // 활동 2 다시하기 기능
  window.resetActivity2 = function() {
    console.log('resetActivity2 함수 호출됨'); // 디버깅 로그
    const citationInput = document.getElementById('citation-output');
    // 활동 2 섹션 내의 feedback div를 올바르게 선택
    const feedbackDiv = document.querySelector('.activity2-controls').parentNode.querySelector('.citation-feedback');

    // 텍스트 영역 비우기
    if (citationInput) {
      citationInput.value = '';
    }

    // 피드백 메시지 제거
    if (feedbackDiv) {
      feedbackDiv.textContent = '';
      feedbackDiv.style.color = '';
    }
  };

  // 활동 2 정답 확인 버튼 이벤트 리스너 추가
  const checkActivity2Btn = document.querySelector('.activity2-controls .submit-btn:nth-of-type(1)'); // 첫 번째 submit-btn (정답 확인)
  if (checkActivity2Btn) {
    checkActivity2Btn.addEventListener('click', checkActivity2);
  }

  // 활동 2 다시하기 버튼 이벤트 리스너 추가
  const resetActivity2Btn = document.querySelector('.activity2-controls .submit-btn:nth-of-type(2)'); // 두 번째 submit-btn (다시하기)
  if (resetActivity2Btn) {
    resetActivity2Btn.addEventListener('click', resetActivity2);
  }
});

console.log('script4_1.js 로딩 완료');
  