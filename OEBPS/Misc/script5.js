// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 게임 보드 초기화
    const gameBoard = document.getElementById('licenseGameBoard');
    if (gameBoard) {
        gameBoard.addEventListener('dragover', handleDragOver);
        gameBoard.addEventListener('drop', handleDrop);
    }

    // 편집기 캔버스 초기화
    drawingCanvas = document.getElementById('drawingCanvas');
    previewCanvas = document.getElementById('previewCanvas');
    if (drawingCanvas && previewCanvas) {
        // 캔버스 컨텍스트는 전역에서 관리
        drawingCtx = drawingCanvas.getContext('2d');
        previewCtx = previewCanvas.getContext('2d');
        
        // 초기 미리보기 업데이트
        updatePreview();
    }

    // 저장된 나의 다짐 불러오기
    const pledgeTextarea = document.getElementById('myPledgeTextarea');
    if (pledgeTextarea) {
        const savedPledge = localStorage.getItem('myPledge');
        if (savedPledge) {
            pledgeTextarea.value = savedPledge;
        }
    }

    // 저장된 캠페인 영상 기획 불러오기
    loadCampaignPlan();

    // 도움말 아이콘 이벤트 리스너 설정 (클릭 이벤트 유지)
    const helpIcons = document.querySelectorAll('.help-icon');
    helpIcons.forEach(icon => {
        icon.addEventListener('click', showHelpPopup); // 클릭 이벤트 추가
    });
    
    // 라이선스 선택 드롭다운 변경 이벤트 리스너
    const licenseSelect = document.getElementById('licenseSelect');
    if (licenseSelect) {
        licenseSelect.addEventListener('change', updateLicense);
    }
    
    // 작품 제목, 제작자 등 출처 정보 입력 필드 변경 시 미리보기 업데이트 이벤트 리스너 추가
    const sourceInfoInputs = document.querySelectorAll('.source-form input[type="text"], .source-form input[type="date"]');
    sourceInfoInputs.forEach(input => {
        input.addEventListener('input', updatePreview); // input 이벤트 발생 시 미리보기 업데이트
    });

    // 초기 라이선스 정보 표시 (DOMContentLoaded 시점에 호출되도록 유지)
    updateLicense();
});

// 전역 캔버스 변수 선언
let drawingCanvas;
let previewCanvas;
let drawingCtx;
let previewCtx;

// 현재 선택된 색상 (텍스트 색상으로 사용)
let currentColor = '#000000'; // 기본 색상 검정

// 도움말 팝업 표시 함수
function showHelpPopup(event) {
    const helpIcon = event.target;
    const helpText = helpIcon.dataset.help;

    if (!helpText) return;

    // 팝업 배경 생성
    const popupBackground = document.createElement('div');
    popupBackground.style.position = 'fixed';
    popupBackground.style.top = '0';
    popupBackground.style.left = '0';
    popupBackground.style.width = '100%';
    popupBackground.style.height = '100%';
    popupBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // 어두운 배경
    popupBackground.style.zIndex = '1000';
    popupBackground.style.display = 'flex';
    popupBackground.style.justifyContent = 'center';
    popupBackground.style.alignItems = 'center';
    popupBackground.style.cursor = 'pointer'; // 클릭 가능한 커서

    // 팝업 내용 컨테이너 생성
    const popupContent = document.createElement('div');
    popupContent.style.backgroundColor = '#fff';
    popupContent.style.padding = '2em';
    popupContent.style.borderRadius = '10px';
    popupContent.style.maxWidth = '80%';
    popupContent.style.maxHeight = '80%';
    popupContent.style.overflow = 'auto'; // 내용이 많으면 스크롤바 생성
    popupContent.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    popupContent.style.fontSize = '1.1em';
    popupContent.style.lineHeight = '1.6';
    popupContent.style.color = '#333';
    popupContent.textContent = helpText;

    // 팝업 내용 클릭 시 이벤트 전파 중지 및 팝업 닫기
    popupContent.addEventListener('click', function(event){
        event.stopPropagation(); // 이벤트 버블링 중지
        popupBackground.remove(); // 팝업 닫기
    });

    // 팝업에 내용 추가
    popupBackground.appendChild(popupContent);
    document.body.appendChild(popupBackground);

    // 배경 클릭 시 팝업 닫기
    popupBackground.addEventListener('click', function() {
        popupBackground.remove();
    });
}

// CCL 라이선스 게임 관련 함수
function startLicenseGame() {
    const gameBoard = document.getElementById('licenseGameBoard');
    const gameScore = document.getElementById('gameScore');
    const gameInstructions = document.querySelector('.game-instructions');
    
    if (!gameBoard || !gameScore || !gameInstructions) {
        console.error('게임 요소를 찾을 수 없습니다.');
        return;
    }

    // 게임 보드 및 점수 표시
    gameBoard.style.display = 'flex'; /* 숨김 해제 */
    gameScore.parentElement.style.display = 'block'; /* 점수 컨테이너 표시 */
    gameInstructions.style.display = 'none'; /* 설명 숨김 */

    const licenseContainer = gameBoard.querySelector('.license-cards-container');
    const useCaseContainer = gameBoard.querySelector('.usecase-cards-container');

    if (!licenseContainer || !useCaseContainer) {
        console.error('게임 카드 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    // 컨테이너 내용 초기화
    licenseContainer.innerHTML = '';
    useCaseContainer.innerHTML = '';
    
    // 라이선스 카드 데이터
    const licenses = [
        { type: 'CC BY', description: '저작자 표시' },
        { type: 'CC BY-NC', description: '저작자 표시-비영리' },
        { type: 'CC BY-SA', description: '저작자 표시-동일조건변경허락' }
    ];
    
    // 사용 사례 데이터
    const useCases = [
        { text: '학교 발표자료에 사용', license: 'CC BY' },
        { text: '상업용 웹사이트에 사용', license: 'CC BY-NC' },
        { text: '수정 후 재배포', license: 'CC BY-SA' }
    ];
    
    // 카드 생성 및 배치
    licenses.forEach(license => {
        const card = createCard(license.type, license.description, 'license');
        licenseContainer.appendChild(card); // 라이선스 카드는 licenseContainer에 추가
    });
    
    useCases.forEach(useCase => {
        const card = createCard(useCase.text, '', 'useCase', useCase.license);
        useCaseContainer.appendChild(card); // 사용 사례 카드는 usecaseContainer에 추가
    });

    // 점수 초기화
    gameScore.textContent = '0';
}

function createCard(title, description, type, correctLicense) {
    const card = document.createElement('div');
    card.className = `game-card ${type}`;
    card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;
    
    if (type === 'useCase') {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', handleDragStart);
        card.dataset.correctLicense = correctLicense;
    } else if (type === 'license') { // 라이선스 카드에 드롭 이벤트 추가
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
    }
    
    return card;
}

// 드래그 앤 드롭 이벤트 핸들러
function handleDragStart(e) {
    const draggedCard = e.target.closest('.game-card.useCase');
    if (draggedCard) {
        e.dataTransfer.setData('text/plain', draggedCard.dataset.correctLicense);
        draggedCard.classList.add('dragging');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const draggedLicense = e.dataTransfer.getData('text/plain');
    const targetCard = e.target.closest('.game-card.license'); 
    
    const draggedCardElement = document.querySelector('.game-card.dragging');

    if (targetCard && draggedCardElement) {
        const targetLicenseType = targetCard.querySelector('h3').textContent;
        const isCorrect = targetLicenseType === draggedLicense;

        updateScore(isCorrect);
        showFeedback(isCorrect);
        
        draggedCardElement.classList.remove('dragging');
        
    } else if (draggedCardElement) {
        draggedCardElement.classList.remove('dragging');
    }
}

// 점수 업데이트
function updateScore(isCorrect) {
    const scoreElement = document.getElementById('gameScore');
    let currentScore = parseInt(scoreElement.textContent) || 0;
    currentScore += isCorrect ? 10 : -5;
    scoreElement.textContent = currentScore;
}

// 피드백 표시
function showFeedback(isCorrect) {
    const existingFeedback = document.querySelector('.feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? '정답입니다!' : '다시 한번 생각해보세요.';
    
    const gameContainer = document.querySelector('.license-game');
    if (gameContainer) {
        const gameBoard = document.getElementById('licenseGameBoard');
        if (gameBoard) {
             gameBoard.insertAdjacentElement('afterend', feedback);
             setTimeout(() => feedback.remove(), 2000);
        }
    }
}

// 디지털 콘텐츠 편집기 관련 함수
// 캔버스 및 컨텍스트는 DOMContentLoaded에서 초기화됨 (전역 변수 사용)

// 텍스트 추가
function addText() {
    // 텍스트를 입력받아 캔버스에 그리는 로직
    const text = prompt('텍스트를 입력하세요:');
    if (text && drawingCtx) { // drawingCtx가 유효한지 확인
        drawingCtx.fillStyle = currentColor; // 텍스트 색상 적용
        drawingCtx.font = '20px Arial';
        drawingCtx.fillText(text, 50, 50); // 원하는 위치에 텍스트 그리기
        updatePreview(); // 미리보기 업데이트
    }
}

// 이미지 업로드
function uploadImage(file) {
    // 파일을 읽어 이미지로 로드하고 캔버스에 그리는 로직
    if (file && drawingCanvas && drawingCtx) { // 요소들이 유효한지 확인
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 이미지 크기를 캔버스에 맞게 조절하여 그리기
                drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); // 기존 내용 지우기
                drawingCtx.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height);
                updatePreview(); // 미리보기 업데이트
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 캔버스 초기화
function clearCanvas() {
    // 캔버스 내용을 지우는 로직
    if (drawingCanvas && drawingCtx) { // 요소들이 유효한지 확인
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        updatePreview(); // 미리보기 업데이트
    }
}

// 라이선스 업데이트
function updateLicense() {
    const licenseSelect = document.getElementById('licenseSelect');
    const licenseInfoDiv = document.getElementById('licenseInfo');
    
    if (!licenseSelect || !licenseInfoDiv) return; // 요소가 없으면 중단

    const selectedLicense = licenseSelect.value;
    
    let licenseText = '';
    switch(selectedLicense) {
      case 'CC BY':
        licenseText = '이 저작물은 크리에이티브 커먼즈 저작자표시 4.0 국제 라이선스에 따라 이용할 수 있습니다.';
        break;
      case 'CC BY-SA':
        licenseText = '이 저작물은 크리에이티브 커먼즈 저작자표시-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.';
        break;
      case 'CC BY-NC':
        licenseText = '이 저작물은 크리에이티브 커먼즈 저작자표시-비영리 4.0 국제 라이선스에 따라 이용할 수 있습니다.';
        break;
      case 'CC BY-NC-SA':
        licenseText = '이 저작물은 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.';
        break;
      case 'CC BY-ND':
        licenseText = '이 저작물은 크리에이티브 커먼즈 저작자표시-변경금지 4.0 국제 라이선스에 따라 이용할 수 있습니다.';
        break;
      case 'CC BY-NC-ND':
        licenseText = '이 저작물은 크리에이티브 커먼즈 저작자표시-비영리-변경금지 4.0 국제 라이선스에 따라 이용할 수 있습니다.';
        break;
      default:
        licenseText = ''; // 알 수 없는 라이선스
    }
    
    // #licenseInfo div에 라이선스 이름과 설명을 모두 포함하여 업데이트
    licenseInfoDiv.innerHTML = `<p>${selectedLicense} 4.0</p><p>${licenseText}</p>`;
    
    // 라이선스 정보가 업데이트되면 미리보기도 업데이트
    updatePreview();
}

// 미리보기 업데이트
function updatePreview() {
    const drawingCanvas = document.getElementById('drawingCanvas');
    const previewCanvas = document.getElementById('previewCanvas');
    
    // 캔버스 및 컨텍스트가 유효한지 다시 한번 확인
    if (!drawingCanvas || !previewCanvas || !drawingCtx || !previewCtx) {
        console.error("미리보기 캔버스 또는 컨텍스트를 찾을 수 없습니다.");
        return;
    }

    // 메인 캔버스의 내용을 미리보기 캔버스로 복사
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    // 원본 캔버스의 비율을 유지하면서 미리보기 캔버스에 맞게 그리기
    const drawingRatio = drawingCanvas.width / drawingCanvas.height;
    const previewRatio = previewCanvas.width / previewCanvas.height;
    let drawWidth = previewCanvas.width;
    let drawHeight = previewCanvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (drawingRatio > previewRatio) {
        // 원본이 더 가로로 길면 너비를 맞추고 높이 계산
        drawHeight = previewCanvas.width / drawingRatio;
        offsetY = (previewCanvas.height - drawHeight) / 2;
    } else {
        // 원본이 더 세로로 길거나 같으면 높이를 맞추고 너비 계산
        drawWidth = previewCanvas.height * drawingRatio;
        offsetX = (previewCanvas.width - drawWidth) / 2;
    }
    
    // 이미지를 먼저 그립니다.
    previewCtx.drawImage(drawingCanvas, offsetX, offsetY, drawWidth, drawHeight);
    
    // 라이선스 및 출처 정보 영역 확보
    const infoAreaHeight = 95; // 정보 표시 영역 높이 (80에서 95으로 증가)
    const infoAreaY = previewCanvas.height - infoAreaHeight; // 미리보기 캔버스 하단 기준
    
    // 정보 영역 배경 추가
    previewCtx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // 불투명도 약간 더 높임
    previewCtx.fillRect(0, infoAreaY, previewCanvas.width, infoAreaHeight);

    // 텍스트 색상 및 기본 위치 설정
    previewCtx.fillStyle = '#000'; // 텍스트 색상 검정
    let textY = infoAreaY + 15; // 정보 영역 상단에서 시작
    const margin = 10; // 좌우 여백
    const lineHeight = 15; // 줄 간격

    // 라이선스 정보 추가
    const licenseInfoElement = document.getElementById('licenseInfo');
    if (licenseInfoElement) {
        const licenseText = licenseInfoElement.innerText || '';
        const licenseLines = licenseText.split('\n').map(line => line.trim()).filter(line => line.length > 0); // 줄바꿈 처리 및 빈 줄 제거

        if (licenseLines.length > 0) {
             previewCtx.font = 'bold 12px Arial'; // 라이선스 이름 폰트 두껍게
             previewCtx.fillText(licenseLines[0], margin, textY); // 첫 번째 줄 (라이선스 이름) 그리기
             textY += lineHeight;

             if (licenseLines.length > 1) {
                 previewCtx.font = '10px Arial'; // 라이선스 설명 폰트 작게
                 // 나머지 줄 (라이선스 설명) 그리기
                 for (let i = 1; i < licenseLines.length; i++) {
                     const line = licenseLines[i];
                     // 캔버스 너비를 고려하여 텍스트 자르거나 줄바꿈 (간단 구현)
                     const words = line.split(' ');
                     let currentLine = words[0];
                     for (let j = 1; j < words.length; j++) {
                         const testLine = currentLine + ' ' + words[j];
                         const metrics = previewCtx.measureText(testLine);
                         if (metrics.width < previewCanvas.width - margin * 2) {
                             currentLine = testLine;
                         } else {
                             previewCtx.fillText(currentLine, margin, textY);
                             textY += lineHeight;
                             currentLine = words[j];
                         }
                     }
                     previewCtx.fillText(currentLine, margin, textY); // 마지막 부분 그리기
                     textY += lineHeight;
                 }
                 textY += 5; // 라이선스 설명 아래 추가 간격
             }
        } else { // 라이선스 정보가 없을 경우에도 기본 높이 확보
             textY += lineHeight * 2 + 5; // 대략 2줄 + 추가 간격 높이만큼 건너뛰기
        }
    }
    
    // 출처 정보 추가
    const workTitle = document.getElementById('workTitle')?.value || '';
    const creatorName = document.getElementById('creatorName')?.value || '';
    const referenceSource = document.getElementById('referenceSource')?.value || '';
    const creationDate = document.getElementById('creationDate')?.value || ''; // 제작 날짜 값 가져오기

    let sourceText = '';
    if(workTitle) sourceText += `제목: ${workTitle}`;
    if(workTitle && creatorName) sourceText += ', ';
    if(creatorName) sourceText += `제작자: ${creatorName}`;
    if((workTitle || creatorName) && referenceSource) sourceText += ', ';
    if(referenceSource) sourceText += `참고: ${referenceSource}`;

    if (sourceText) {
        previewCtx.font = '10px Arial'; // 출처 정보 폰트
        // 텍스트가 너무 길 경우 간단히 자르기 (필요시 줄바꿈 로직 추가)
        if (previewCtx.measureText(sourceText).width > previewCanvas.width - margin * 2) {
             let truncatedText = '';
             for(let i = 0; i < sourceText.length; i++) {
                 const testText = sourceText.substring(0, i + 1);
                 if(previewCtx.measureText(testText).width < previewCanvas.width - margin * 2 - 20) { // 20은 ... 여유 공간
                     truncatedText = testText;
                 } else {
                     truncatedText += '...';
                     break;
                 }
             }
             sourceText = truncatedText;
        }
        // 라이선스 정보 아래에 출처 정보 표시
        previewCtx.fillText(sourceText, margin, textY); 
        textY += lineHeight; // 출처 정보 다음 줄로 이동
    } else { // 출처 정보가 없을 경우에도 기본 높이 확보
         textY += lineHeight; // 1줄 높이만큼 건너뛰기
    }

    // 제작 날짜 추가
    if (creationDate) {
        previewCtx.font = '10px Arial'; // 제작 날짜 폰트 (출처 정보와 동일)
        previewCtx.fillStyle = '#000'; // 텍스트 색상 검정
        previewCtx.fillText(`제작 날짜: ${creationDate}`, margin, textY); // 출처 정보 아래에 그리기
        // textY += lineHeight; // 다음 정보가 있다면 줄바꿈 (현재는 마지막 정보)
    }
}

// 작품 저장 함수
function saveWork() {
    const drawingCanvas = document.getElementById('drawingCanvas');
    const workTitle = document.getElementById('workTitle').value;
    const creatorName = document.getElementById('creatorName').value;
    const referenceSource = document.getElementById('referenceSource').value;
    const creationDate = document.getElementById('creationDate').value;
    
    if (!workTitle || !creatorName) {
      alert('작품 제목과 제작자 이름을 입력해주세요.');
      return;
    }
    
    // 메타데이터 생성
    const metadata = {
      title: workTitle,
      creator: creatorName,
      reference: referenceSource,
      date: creationDate,
      license: document.getElementById('licenseSelect').value
    };
    
    // 이미지와 메타데이터를 함께 저장할 임시 캔버스 생성
    const finalCanvas = document.createElement('canvas');
    const metadataHeight = 100; // 메타데이터를 위한 추가 공간 높이
    finalCanvas.width = drawingCanvas.width;
    finalCanvas.height = drawingCanvas.height + metadataHeight;
    const finalCtx = finalCanvas.getContext('2d');
    
    // 원본 이미지 복사
    finalCtx.drawImage(drawingCanvas, 0, 0);
    
    // 메타데이터 추가 배경
    finalCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    finalCtx.fillRect(0, drawingCanvas.height, finalCanvas.width, metadataHeight);
    
    // 메타데이터 텍스트 추가
    finalCtx.fillStyle = '#000';
    finalCtx.font = '14px Arial';
    finalCtx.fillText(`제목: ${metadata.title}`, 20, drawingCanvas.height + 20);
    finalCtx.fillText(`제작자: ${metadata.creator}`, 20, drawingCanvas.height + 40);
    if (metadata.reference) {
      finalCtx.fillText(`참고 자료: ${metadata.reference}`, 20, drawingCanvas.height + 60);
    }
    finalCtx.fillText(`라이선스: ${metadata.license}`, 20, drawingCanvas.height + 80);
    // 제작 날짜 추가
    if (metadata.date) {
        finalCtx.fillText(`제작 날짜: ${metadata.date}`, 20, drawingCanvas.height + 100); // 위치 조정 필요할 수 있음
    }

    
    // 이미지 다운로드
    const link = document.createElement('a');
    link.download = `${workTitle}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
}

// 포스터 예시 토글
function toggleTip() {
    const tip = document.getElementById('tipImage');
    if (tip) {
        tip.style.display = tip.style.display === "none" ? "block" : "none";
    }
}

// 포스터 확대 팝업 표시 함수 추가
function showPosterPopup(imageUrl) {
    // 팝업 배경 생성 (도움말 팝업과 동일한 스타일 재활용)
    const popupBackground = document.createElement('div');
    popupBackground.style.position = 'fixed';
    popupBackground.style.top = '0';
    popupBackground.style.left = '0';
    popupBackground.style.width = '100%';
    popupBackground.style.height = '100%';
    popupBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // 어두운 배경
    popupBackground.style.zIndex = '1000';
    popupBackground.style.display = 'flex';
    popupBackground.style.justifyContent = 'center';
    popupBackground.style.alignItems = 'center';
    popupBackground.style.cursor = 'pointer'; // 클릭 가능한 커서

    // 팝업 내용 컨테이너 생성
    const popupContent = document.createElement('div');
    popupContent.style.backgroundColor = '#fff';
    popupContent.style.padding = '1em'; // 이미지에 맞게 패딩 줄임
    popupContent.style.borderRadius = '10px';
    popupContent.style.maxWidth = '90%'; // 좀 더 크게 표시
    popupContent.style.maxHeight = '90%';
    popupContent.style.overflow = 'auto'; // 이미지 크기에 따라 스크롤바 생성
    popupContent.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    popupContent.style.textAlign = 'center'; // 이미지 중앙 정렬

    // 이미지 엘리먼트 생성
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '100%';
    img.style.maxHeight = 'calc(100vh - 40px)'; // 뷰포트 높이에 맞게 조절 (패딩 고려)
    img.style.display = 'block'; // 이미지 하단 공백 제거

    // 팝업에 이미지 추가
    popupContent.appendChild(img);
    popupBackground.appendChild(popupContent);
    document.body.appendChild(popupBackground);

    // 배경 클릭 시 팝업 닫기 (이제 팝업 내용 클릭도 포함)
    popupBackground.addEventListener('click', function() {
        popupBackground.remove();
    });
}

// 나의 다짐 저장 함수
function savePledge() {
    const pledgeTextarea = document.getElementById('myPledgeTextarea');
    if (pledgeTextarea) {
        localStorage.setItem('myPledge', pledgeTextarea.value);
        alert('나의 다짐이 저장되었습니다!');
    }
}

// 저작권 캠페인 영상 기획 저장 함수 추가
function saveCampaignPlan() {
    const campaignTopic = document.querySelector('.campaign-plan input[placeholder="예) 올바른 출처 표시의 중요성"]').value;
    const targetAudience = document.querySelector('.campaign-plan input[placeholder="예) 중학생 친구들"]').value;
    const coreMessage = document.querySelector('.campaign-plan textarea[placeholder="예) 출처를 밝히는 것은 창작자를 존중하는 첫걸음입니다."]').value;
    const frame1 = document.querySelector('.storyboard-frames .frame:nth-child(1) textarea').value;
    const frame2 = document.querySelector('.storyboard-frames .frame:nth-child(2) textarea').value;
    const frame3 = document.querySelector('.storyboard-frames .frame:nth-child(3) textarea').value;

    const campaignData = {
        topic: campaignTopic,
        audience: targetAudience,
        message: coreMessage,
        storyboard: [
            frame1,
            frame2,
            frame3
        ]
    };

    localStorage.setItem('campaignPlan', JSON.stringify(campaignData));
    alert('캠페인 영상 기획이 저장되었습니다!');
}

// 페이지 로드 시 저장된 캠페인 영상 기획 불러오기 함수 추가
function loadCampaignPlan() {
    const savedData = localStorage.getItem('campaignPlan');
    if (savedData) {
        const campaignData = JSON.parse(savedData);
        document.querySelector('.campaign-plan input[placeholder="예) 올바른 출처 표시의 중요성"]').value = campaignData.topic || '';
        document.querySelector('.campaign-plan input[placeholder="예) 중학생 친구들"]').value = campaignData.audience || '';
        document.querySelector('.campaign-plan textarea[placeholder="예) 출처를 밝히는 것은 창작자를 존중하는 첫걸음입니다."]').value = campaignData.message || '';
        document.querySelector('.storyboard-frames .frame:nth-child(1) textarea').value = campaignData.storyboard?.[0] || '';
        document.querySelector('.storyboard-frames .frame:nth-child(2) textarea').value = campaignData.storyboard?.[1] || '';
        document.querySelector('.storyboard-frames .frame:nth-child(3) textarea').value = campaignData.storyboard?.[2] || '';
    }
}

// 포스터 파일 제출 함수
function submitPosterFile() {
    // 파일 선택을 위한 input 요소 생성
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*, application/pdf'; // 이미지 또는 PDF 파일 허용
    fileInput.style.display = 'none'; // 숨김

    fileInput.onchange = function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            // TODO: 여기에 파일 제출 로직 구현 (예: 서버 업로드)
            alert(`'${file.name}' 파일이 제출되었습니다.`);
            // 파일 입력 초기화
            event.target.value = '';
        } else {
            alert('선택된 파일이 없습니다.');
        }
    };

    // 파일 선택 대화상자 열기
    fileInput.click();
}
  