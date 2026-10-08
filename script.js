// =========================================
// Amor AI - JavaScript
// 5주차: 이메일 가입 신청 확인 (submit)
// 6주차: 탭 전환 (click), 실시간 이메일 검사 (input),
//        상황별 추천 답장 (change)
// =========================================


// -----------------------------------------
// 6주차 ① 탭 UI (click 이벤트)
// -----------------------------------------
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

function openTab(targetId) {
    // 모든 탭 버튼과 내용을 비활성화
    tabButtons.forEach(function (button) {
        button.classList.remove("active");
        button.setAttribute("aria-selected", "false");
    });
    tabPanels.forEach(function (panel) {
        panel.classList.remove("active");
    });

    // 선택한 탭 버튼과 해당 내용만 활성화
    const selectedButton = document.querySelector('.tab-button[data-tab="' + targetId + '"]');
    selectedButton.classList.add("active");
    selectedButton.setAttribute("aria-selected", "true");
    document.querySelector("#" + targetId).classList.add("active");
}

tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        openTab(button.dataset.tab);
    });
});


// -----------------------------------------
// 6주차 ② 상황별 추천 답장 (change 이벤트)
// -----------------------------------------
const situationSelect = document.querySelector("#situation");
const replyBox = document.querySelector("#reply-box");

const replies = {
    some: "\"오늘 얘기 너무 재밌었어 😊 다음엔 네가 말한 그 카페 같이 가볼래?\"",
    dating: "\"오늘 하루 고생 많았어. 퇴근하면 잠깐 통화할래? 목소리 듣고 싶어 💗\"",
    fight: "\"아까는 내가 말이 좀 심했던 것 같아. 네 마음 먼저 듣고 싶어. 이야기할 수 있을 때 알려줘.\""
};

function showReply() {
    const situation = situationSelect.value;

    if (situation === "") {
        replyBox.textContent = "상황을 선택하면 AI가 추천 답장을 보여드려요.";
        replyBox.className = "reply-box";
    } else {
        replyBox.textContent = "💬 추천 답장: " + replies[situation];
        replyBox.className = "reply-box " + situation; // 상황마다 색상 변경
    }
}

situationSelect.addEventListener("change", showReply);


// -----------------------------------------
// 5주차 + 6주차 ③ 이메일 가입 (input / submit 이벤트)
// -----------------------------------------
const signupForm = document.querySelector("#signup form");
const emailInput = document.querySelector("#email");
const signupButton = document.querySelector("#signup button");
const message = document.querySelector("#signup-message");

// 브라우저 기본 경고창 대신 직접 만든 안내 문구 사용
signupForm.noValidate = true;

// 처음에는 버튼 비활성화 + 안내 문구
signupButton.disabled = true;
showMessage("이메일을 입력하면 가입 신청 버튼이 활성화돼요.", "hint");

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

function isValidEmail(email) {
    return email.includes("@") && email.includes(".") && email.indexOf("@") > 0;
}

// input 이벤트: 입력할 때마다 실시간 검사
function checkEmail() {
    const email = emailInput.value.trim();

    if (email === "") {
        showMessage("이메일을 입력하면 가입 신청 버튼이 활성화돼요.", "hint");
        emailInput.className = "";
        signupButton.disabled = true;
    } else if (!isValidEmail(email)) {
        showMessage("이메일 형식을 확인해 주세요. 예) amor@email.com", "error");
        emailInput.className = "invalid";   // 입력칸 빨간 테두리
        signupButton.disabled = true;       // 버튼 비활성화
    } else {
        showMessage("올바른 이메일 형식이에요! 가입 신청을 눌러 주세요.", "ok");
        emailInput.className = "valid";     // 입력칸 초록 테두리
        signupButton.disabled = false;      // 버튼 활성화
    }
}

emailInput.addEventListener("input", checkEmail);

// submit 이벤트: 가입 신청 버튼 클릭
function handleSignup(event) {
    event.preventDefault(); // 페이지 새로고침 막기

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        checkEmail();
        emailInput.focus();
        return;
    }

    showMessage("💗 " + email + " 으로 가입 신청이 완료되었어요! Amor AI 소식을 보내드릴게요.", "success");
    signupButton.textContent = "신청 완료";
    signupButton.disabled = true;
    emailInput.disabled = true;
}

signupForm.addEventListener("submit", handleSignup);
