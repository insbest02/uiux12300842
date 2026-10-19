// =========================================
// Amor AI - JavaScript
// 5주차: 이메일 가입 신청 확인 (submit)
// 6주차: 탭 전환 (click), 실시간 이메일 검사 (input),
//        상황별 추천 답장 (change)
// 7주차: AI 답장 상담 흐름 (시작 → 입력 → 선택 → 확인 → 완료)
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


// -----------------------------------------
// 7주차: AI 답장 상담 흐름 (시작 → 입력 → 선택 → 확인 → 완료)
// -----------------------------------------
const stepPanels = document.querySelectorAll(".step-panel");
const progressItems = document.querySelectorAll(".progress li");

const nicknameInput = document.querySelector("#consult-nickname");
const concernInput = document.querySelector("#consult-concern");
const concernCount = document.querySelector("#concern-count");
const relationInputs = document.querySelectorAll('input[name="relation"]');
const toneSelect = document.querySelector("#consult-tone");

const nicknameError = document.querySelector("#nickname-error");
const concernError = document.querySelector("#concern-error");
const relationError = document.querySelector("#relation-error");
const toneError = document.querySelector("#tone-error");

const MIN_CONCERN = 10; // 고민 내용 최소 글자 수

const relationLabels = { some: "썸 타는 중", dating: "연애 중", fight: "다툰 후" };
const toneLabels = { sweet: "다정하게", honest: "솔직하게", fun: "유쾌하게" };

const consultReplies = {
    some: {
        sweet: "오늘 너랑 얘기하니까 하루가 금방 갔어. 다음에 또 이야기하고 싶다 😊",
        honest: "솔직히 너랑 더 친해지고 싶어. 이번 주말에 시간 괜찮으면 밥 한번 먹을래?",
        fun: "너랑 톡하다가 배터리 다 닳았어 🔋 책임지고 커피 한 잔 사줘야 해!"
    },
    dating: {
        sweet: "오늘도 고생 많았어. 네 생각하면서 버텼어. 이따 목소리 듣고 싶어 💗",
        honest: "요즘 바빠서 대화가 줄어든 것 같아 아쉬웠어. 이번 주에 우리 시간 좀 내자.",
        fun: "오늘의 할 일: 1. 퇴근 2. 너한테 전화하기 3. 또 전화하기 📞"
    },
    fight: {
        sweet: "아까는 내가 미안했어. 다투는 것보다 네 마음을 아는 게 더 중요해.",
        honest: "서운했던 점도 있지만 내 말투도 심했던 것 같아. 차분히 다시 얘기하고 싶어.",
        fun: "화해의 의미로 네가 좋아하는 떡볶이 쏠게 🍢 그리고 진지하게, 미안해."
    }
};

// 단계 이동: 해당 단계 화면만 보여주고 진행 표시 갱신
function goToStep(step) {
    stepPanels.forEach(function (panel) {
        panel.classList.toggle("active", Number(panel.dataset.step) === step);
    });
    progressItems.forEach(function (item, index) {
        item.classList.toggle("active", index + 1 === step);
        item.classList.toggle("done", index + 1 < step);
    });
}

// 오류 표시 / 지우기
function setError(field, errorEl, text) {
    errorEl.textContent = text;
    if (field) field.classList.add("invalid");
}

function clearError(field, errorEl) {
    errorEl.textContent = "";
    if (field) field.classList.remove("invalid");
}

function getSelectedRelation() {
    let selected = "";
    relationInputs.forEach(function (input) {
        if (input.checked) selected = input.value;
    });
    return selected;
}

// ② 입력 단계 검사: 필수값이 비거나 짧으면 다음 단계로 못 넘어감
function validateInputStep() {
    const nickname = nicknameInput.value.trim();
    const concern = concernInput.value.trim();
    let valid = true;

    if (nickname === "") {
        setError(nicknameInput, nicknameError, "닉네임을 입력해 주세요.");
        valid = false;
    } else {
        clearError(nicknameInput, nicknameError);
    }

    if (concern === "") {
        setError(concernInput, concernError, "고민 내용을 입력해 주세요.");
        valid = false;
    } else if (concern.length < MIN_CONCERN) {
        setError(concernInput, concernError, "고민을 " + MIN_CONCERN + "자 이상 적어 주세요. (지금 " + concern.length + "자)");
        valid = false;
    } else {
        clearError(concernInput, concernError);
    }

    if (!valid) {
        const firstInvalid = document.querySelector("#consult .invalid");
        if (firstInvalid) firstInvalid.focus();
    }
    return valid;
}

// ③ 선택 단계 검사
function validateChoiceStep() {
    let valid = true;

    if (getSelectedRelation() === "") {
        setError(null, relationError, "지금 관계 상황을 하나 골라 주세요.");
        valid = false;
    } else {
        clearError(null, relationError);
    }

    if (toneSelect.value === "") {
        setError(toneSelect, toneError, "답장 톤을 선택해 주세요.");
        valid = false;
    } else {
        clearError(toneSelect, toneError);
    }
    return valid;
}

// ④ 확인 화면: 들어올 때마다 현재 입력·선택값으로 새로 채움 (수정값 재반영)
function fillSummary() {
    document.querySelector("#summary-nickname").textContent = nicknameInput.value.trim();
    document.querySelector("#summary-concern").textContent = concernInput.value.trim();
    document.querySelector("#summary-relation").textContent = relationLabels[getSelectedRelation()];
    document.querySelector("#summary-tone").textContent = toneLabels[toneSelect.value];
}

// ⑤ 완료 화면
function showResult() {
    const relation = getSelectedRelation();
    const tone = toneSelect.value;

    document.querySelector("#result-title").textContent =
        nicknameInput.value.trim() + "님을 위한 추천 답장이 도착했어요";
    document.querySelector("#result-reply").textContent = "\"" + consultReplies[relation][tone] + "\"";
    document.querySelector("#result-meta").textContent =
        relationLabels[relation] + " · " + toneLabels[tone];
}

// 고민 글자 수 실시간 표시
function updateConcernCount() {
    const length = concernInput.value.trim().length;
    concernCount.textContent = length + "자 / " + MIN_CONCERN + "자 이상";
    concernCount.classList.toggle("enough", length >= MIN_CONCERN);
}

// 다시 시작: 입력·선택·오류·진행 상태 모두 초기화
function resetConsult() {
    nicknameInput.value = "";
    concernInput.value = "";
    relationInputs.forEach(function (input) { input.checked = false; });
    toneSelect.value = "";
    clearError(nicknameInput, nicknameError);
    clearError(concernInput, concernError);
    clearError(null, relationError);
    clearError(toneSelect, toneError);
    updateConcernCount();
    goToStep(1);
}

// 버튼 클릭 연결
document.querySelector("#btn-start").addEventListener("click", function () {
    goToStep(2);
    nicknameInput.focus();
});

document.querySelector("#btn-to-choice").addEventListener("click", function () {
    if (validateInputStep()) goToStep(3);
});

document.querySelector("#btn-back-input").addEventListener("click", function () {
    goToStep(2); // 값을 지우지 않으므로 입력 내용이 그대로 유지됨
});

document.querySelector("#btn-to-confirm").addEventListener("click", function () {
    if (validateChoiceStep()) {
        fillSummary();
        goToStep(4);
    }
});

document.querySelector("#btn-back-choice").addEventListener("click", function () {
    goToStep(3);
});

document.querySelector("#btn-edit-input").addEventListener("click", function () {
    goToStep(2);
});

document.querySelector("#btn-complete").addEventListener("click", function () {
    showResult();
    goToStep(5);
});

document.querySelector("#btn-restart").addEventListener("click", resetConsult);

// 입력·선택하면 해당 오류 문구 바로 지우기
nicknameInput.addEventListener("input", function () {
    if (nicknameInput.value.trim() !== "") clearError(nicknameInput, nicknameError);
});

concernInput.addEventListener("input", function () {
    updateConcernCount();
    if (concernInput.value.trim().length >= MIN_CONCERN) clearError(concernInput, concernError);
});

relationInputs.forEach(function (input) {
    input.addEventListener("change", function () {
        clearError(null, relationError);
    });
});

toneSelect.addEventListener("change", function () {
    if (toneSelect.value !== "") clearError(toneSelect, toneError);
});

updateConcernCount();
goToStep(1);
