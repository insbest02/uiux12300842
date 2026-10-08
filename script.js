// =========================================
// Amor AI - 5주차 JavaScript
// 기능: 이메일 가입 신청 확인
// 버튼을 누르면 입력값을 검사해서
// 안내 문구와 버튼 상태를 바꿔 보여준다.
// =========================================

// 1. 필요한 HTML 요소 선택
const signupForm = document.querySelector("#signup form");
const emailInput = document.querySelector("#email");
const signupButton = document.querySelector("#signup button");
const message = document.querySelector("#signup-message");

// 브라우저 기본 경고창 대신 직접 만든 안내 문구를 쓰기 위해 끔
signupForm.noValidate = true;

// 2. 안내 문구를 보여주는 함수 (type: "error" 또는 "success")
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

// 3. 가입 신청 버튼을 눌렀을 때 실행되는 함수
function handleSignup(event) {
    event.preventDefault(); // 페이지 새로고침 막기

    const email = emailInput.value.trim(); // 입력값 (앞뒤 공백 제거)

    // 4. 조건문으로 입력값에 따라 다른 결과 보여주기
    if (email === "") {
        showMessage("이메일 주소를 입력해 주세요.", "error");
        emailInput.focus();
    } else if (!email.includes("@") || !email.includes(".")) {
        showMessage("이메일 형식이 올바르지 않아요. 예) amor@email.com", "error");
        emailInput.focus();
    } else {
        showMessage("💗 " + email + " 으로 가입 신청이 완료되었어요! Amor AI 소식을 보내드릴게요.", "success");

        // 5. 처리 결과에 따라 버튼 상태 변경
        signupButton.textContent = "신청 완료";
        signupButton.disabled = true;
        emailInput.disabled = true;
    }
}

// 6. 폼 제출(버튼 클릭) 시 함수가 실행되도록 연결
signupForm.addEventListener("submit", handleSignup);

// 다시 입력하기 시작하면 오류 문구 지우기
emailInput.addEventListener("input", function () {
    if (message.classList.contains("error")) {
        showMessage("", "");
    }
});
