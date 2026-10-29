// =========================================
// Amor AI - JavaScript
// 5주차: 이메일 신청 확인 (submit) -> 9주차에 알림 신청 폼으로 개선
// 6주차: 탭 전환 (click), 실시간 이메일 검사 (input),
//        상황별 추천 답장 (change)
// 7주차: AI 답장 상담 흐름 (시작 → 입력 → 선택 → 확인 → 완료)
// 중간고사: 내 답장 보관함 (저장 → 찾기 → 열기·다시 상담 → 삭제·되돌리기)
// 9주차: 소식 알림 신청 폼 (조건부 입력, 실시간 검증, 제출 상태) + 답장 복사
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
        replyBox.textContent = "상황을 선택하면 상황별 예시 답장을 보여드려요.";
        replyBox.className = "reply-box";
        document.querySelector("#reply-copy-row").hidden = true;
    } else {
        replyBox.textContent = "💬 상황별 예시 답장: " + replies[situation];
        replyBox.className = "reply-box " + situation; // 상황마다 색상 변경
        document.querySelector("#reply-copy-row").hidden = false;
    }
    document.querySelector("#copy-feedback-tab").textContent = "";
}

situationSelect.addEventListener("change", showReply);


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

    // 중간고사: 보관함에 저장할 현재 결과 기억
    currentResult = {
        nickname: nicknameInput.value.trim(),
        concern: concernInput.value.trim(),
        relation: relation,
        tone: tone,
        reply: consultReplies[relation][tone]
    };
    resetSaveState();
    document.querySelector("#copy-feedback-result").textContent = "";
    if (isSaved(currentResult)) {
        syncSaveButton();
        showSaveFeedback("이미 보관함에 저장된 답장이에요. 아래 보관함에서 확인할 수 있어요.", "warn");
    }
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
    currentResult = null;   // 중간고사: 저장 상태도 초기화 (보관함 목록은 유지)
    resetSaveState();
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



// -----------------------------------------
// 중간고사: 내 답장 보관함
// 완료한 추천 답장을 저장 → 키워드·상황으로 찾기 → 열기·다시 상담 → 삭제·되돌리기
// -----------------------------------------
const MAX_MEMO = 20;
const STORAGE_KEY = "amor-saved-replies";

const memoInput = document.querySelector("#save-memo");
const memoError = document.querySelector("#memo-error");
const saveButton = document.querySelector("#btn-save");
const saveFeedback = document.querySelector("#save-feedback");

const savedCount = document.querySelector("#saved-count");
const savedSearch = document.querySelector("#saved-search");
const savedFilter = document.querySelector("#saved-filter");
const savedList = document.querySelector("#saved-list");
const savedEmpty = document.querySelector("#saved-empty");
const savedEmptyText = document.querySelector("#saved-empty-text");
const savedEmptyAction = document.querySelector("#saved-empty-action");
const savedDetail = document.querySelector("#saved-detail");
const undoBar = document.querySelector("#undo-bar");
const undoText = document.querySelector("#undo-text");

let currentResult = null;        // 완료 화면에 보이는 결과
let savedReplies = loadSaved();  // 보관함 목록
let openedId = null;             // 지금 열어 본 항목
let lastDeleted = null;          // 되돌리기용 { item, index }

// 새로고침해도 목록이 남도록 브라우저에 저장 (실패해도 페이지는 동작)
function loadSaved() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

function persistSaved() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedReplies));
    } catch (e) {
        // 저장소를 쓸 수 없는 환경이면 이번 방문 동안만 유지
    }
}

function findSaved(id) {
    return savedReplies.find(function (item) { return item.id === id; });
}

function isSaved(result) {
    return savedReplies.some(function (item) {
        return item.reply === result.reply && item.concern === result.concern;
    });
}

function formatDate(time) {
    const d = new Date(time);
    const pad = function (n) { return String(n).padStart(2, "0"); };
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + pad(d.getHours()) + ":" + pad(d.getMinutes());
}

// ---- 완료 화면: 저장 ----
function showSaveFeedback(text, type) {
    saveFeedback.textContent = text;
    saveFeedback.className = "save-feedback " + type;
}

function resetSaveState() {
    memoInput.value = "";
    memoInput.disabled = false;
    clearError(memoInput, memoError);
    saveFeedback.textContent = "";
    saveFeedback.className = "save-feedback";
    saveButton.textContent = "보관함에 저장";
    saveButton.disabled = false;
}

// 보관함 상태에 맞춰 저장 버튼 상태 맞추기 (삭제·되돌리기 후)
function syncSaveButton() {
    if (!currentResult) return;
    const saved = isSaved(currentResult);
    saveButton.disabled = saved;
    memoInput.disabled = saved;
    saveButton.textContent = saved ? "저장 완료" : "보관함에 저장";
}

function handleSave() {
    if (!currentResult) return;

    const memo = memoInput.value.trim();

    if (memo.length > MAX_MEMO) {
        setError(memoInput, memoError, "메모는 " + MAX_MEMO + "자 이내로 줄여 주세요. (지금 " + memo.length + "자)");
        memoInput.focus();
        return;
    }
    clearError(memoInput, memoError);

    if (isSaved(currentResult)) {
        showSaveFeedback("이미 보관함에 있는 답장이에요. 아래 보관함에서 확인해 보세요.", "warn");
        syncSaveButton();
        return;
    }

    const now = Date.now();
    savedReplies.unshift({
        id: now,
        nickname: currentResult.nickname,
        concern: currentResult.concern,
        relation: currentResult.relation,
        tone: currentResult.tone,
        reply: currentResult.reply,
        memo: memo,
        savedAt: now
    });
    persistSaved();
    hideUndo();
    renderSaved();

    showSaveFeedback("💾 보관함에 저장했어요! 지금 " + savedReplies.length + "개가 보관되어 있어요.", "success");
    syncSaveButton();
}

// ---- 보관함 목록: 찾기 ----
function getFilteredReplies() {
    const keyword = savedSearch.value.trim().toLowerCase();
    const relation = savedFilter.value;

    return savedReplies.filter(function (item) {
        const matchRelation = relation === "all" || item.relation === relation;
        const text = (item.memo + " " + item.concern + " " + item.reply + " " + item.nickname).toLowerCase();
        const matchKeyword = keyword === "" || text.includes(keyword);
        return matchRelation && matchKeyword;
    });
}

function showEmpty(text, actionLabel, action) {
    savedEmpty.hidden = false;
    savedEmptyText.textContent = text;
    savedEmptyAction.textContent = actionLabel;
    savedEmptyAction.dataset.action = action;
}

function renderSaved() {
    const list = getFilteredReplies();
    savedList.innerHTML = "";

    if (savedReplies.length === 0) {
        savedCount.textContent = "보관된 답장 0개";
        showEmpty("아직 저장한 답장이 없어요. 위의 AI 답장 상담을 끝까지 진행한 뒤 '보관함에 저장'을 눌러 보세요.",
            "상담하러 가기", "consult");
    } else if (list.length === 0) {
        savedCount.textContent = "전체 " + savedReplies.length + "개 중 0개 표시";
        const conditions = [];
        const keyword = savedSearch.value.trim();
        if (keyword !== "") conditions.push("'" + keyword + "'");
        if (savedFilter.value !== "all") conditions.push(relationLabels[savedFilter.value]);
        showEmpty(conditions.join(" · ") + " 조건에 맞는 답장이 없어요. 다른 키워드를 입력하거나 관계 상황을 '전체'로 바꿔 보세요.",
            "검색 조건 초기화", "reset");
    } else {
        savedCount.textContent = "전체 " + savedReplies.length + "개 중 " + list.length + "개 표시";
        savedEmpty.hidden = true;
        list.forEach(function (item) {
            savedList.appendChild(createCard(item));
        });
    }

    // 열어 둔 항목이 삭제됐으면 상세 닫기
    if (openedId !== null && !findSaved(openedId)) {
        closeDetail();
    }
}

function createCard(item) {
    const li = document.createElement("li");
    li.className = "saved-card" + (item.id === openedId ? " opened" : "");

    const meta = document.createElement("p");
    meta.className = "saved-meta";
    meta.textContent = relationLabels[item.relation] + " · " + toneLabels[item.tone] + " · " + formatDate(item.savedAt);

    const memo = document.createElement("p");
    memo.className = "saved-memo" + (item.memo ? "" : " empty");
    memo.textContent = item.memo || "메모 없음";

    const preview = document.createElement("p");
    preview.className = "saved-preview";
    preview.textContent = item.reply;

    const actions = document.createElement("div");
    actions.className = "saved-actions";

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "secondary";
    openButton.textContent = item.id === openedId ? "열려 있음" : "열기";
    openButton.addEventListener("click", function () { openDetail(item.id); });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", function () { deleteReply(item.id); });

    actions.append(openButton, deleteButton);
    li.append(meta, memo, preview, actions);
    return li;
}

// ---- 열기 / 닫기 ----
function openDetail(id) {
    const item = findSaved(id);
    if (!item) return;

    openedId = id;
    document.querySelector("#detail-memo").textContent = item.memo || "메모 없는 답장";
    document.querySelector("#detail-meta").textContent =
        relationLabels[item.relation] + " · " + toneLabels[item.tone] + " · " + formatDate(item.savedAt) + " 저장";
    document.querySelector("#detail-nickname").textContent = item.nickname;
    document.querySelector("#detail-concern").textContent = item.concern;
    document.querySelector("#detail-reply").textContent = "\"" + item.reply + "\"";
    document.querySelector("#copy-feedback-detail").textContent = "";
    savedDetail.hidden = false;

    renderSaved();
    savedDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeDetail() {
    openedId = null;
    savedDetail.hidden = true;
}

// 저장한 내용으로 7주차 상담 흐름에 다시 들어가기 (확인 단계로 이동)
function reuseReply() {
    const item = findSaved(openedId);
    if (!item) return;

    nicknameInput.value = item.nickname;
    concernInput.value = item.concern;
    relationInputs.forEach(function (input) {
        input.checked = input.value === item.relation;
    });
    toneSelect.value = item.tone;

    clearError(nicknameInput, nicknameError);
    clearError(concernInput, concernError);
    clearError(null, relationError);
    clearError(toneSelect, toneError);
    updateConcernCount();

    fillSummary();
    goToStep(4);
    document.querySelector("#consult").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- 삭제 / 되돌리기 ----
function hideUndo() {
    undoBar.hidden = true;
    lastDeleted = null;
}

function deleteReply(id) {
    const index = savedReplies.findIndex(function (item) { return item.id === id; });
    if (index === -1) return;

    const item = savedReplies[index];
    savedReplies.splice(index, 1);
    persistSaved();
    lastDeleted = { item: item, index: index };

    if (openedId === id) closeDetail();
    renderSaved();
    syncSaveButton();

    const name = item.memo || item.reply.slice(0, 12) + "…";
    undoText.textContent = "'" + name + "' 답장을 삭제했어요.";
    undoBar.hidden = false;
}

function undoDelete() {
    if (!lastDeleted) return;

    const index = Math.min(lastDeleted.index, savedReplies.length);
    savedReplies.splice(index, 0, lastDeleted.item);
    persistSaved();
    hideUndo();
    renderSaved();
    syncSaveButton();
}

// ---- 이벤트 연결 ----
saveButton.addEventListener("click", handleSave);

memoInput.addEventListener("input", function () {
    if (memoInput.value.trim().length <= MAX_MEMO) clearError(memoInput, memoError);
});

savedSearch.addEventListener("input", renderSaved);
savedFilter.addEventListener("change", renderSaved);

savedEmptyAction.addEventListener("click", function () {
    if (savedEmptyAction.dataset.action === "reset") {
        savedSearch.value = "";
        savedFilter.value = "all";
        renderSaved();
        savedSearch.focus();
    } else {
        document.querySelector("#consult").scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

document.querySelector("#btn-detail-close").addEventListener("click", function () {
    closeDetail();
    renderSaved();
});

document.querySelector("#btn-detail-delete").addEventListener("click", function () {
    if (openedId !== null) deleteReply(openedId);
});

document.querySelector("#btn-detail-reuse").addEventListener("click", reuseReply);
document.querySelector("#btn-undo").addEventListener("click", undoDelete);

renderSaved();



// -----------------------------------------
// 9주차 (교수님 코멘트 반영): 답장 복사
// 추천 답장을 바로 메신저에 붙여넣을 수 있게 클립보드에 복사
// -----------------------------------------
function fallbackCopy(text) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    let ok = false;
    try {
        ok = document.execCommand("copy");
    } catch (e) {
        ok = false;
    }
    helper.remove();
    return ok;
}

function copyReply(text, feedbackEl) {
    const showResult = function (ok) {
        if (ok) {
            feedbackEl.textContent = "✓ 복사했어요! 메신저에 붙여넣어 보내 보세요.";
            feedbackEl.className = "copy-feedback success";
        } else {
            feedbackEl.textContent = "✗ 복사하지 못했어요. 답장 문장을 길게 눌러 직접 복사해 주세요.";
            feedbackEl.className = "copy-feedback error";
        }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(function () { showResult(true); })
            .catch(function () { showResult(fallbackCopy(text)); });
    } else {
        showResult(fallbackCopy(text));
    }
}

document.querySelector("#btn-copy-tab").addEventListener("click", function () {
    const situation = situationSelect.value;
    if (situation === "") return;
    copyReply(replies[situation].replace(/^"|"$/g, ""), document.querySelector("#copy-feedback-tab"));
});

document.querySelector("#btn-copy-result").addEventListener("click", function () {
    if (!currentResult) return;
    copyReply(currentResult.reply, document.querySelector("#copy-feedback-result"));
});

document.querySelector("#btn-copy-detail").addEventListener("click", function () {
    const item = findSaved(openedId);
    if (!item) return;
    copyReply(item.reply, document.querySelector("#copy-feedback-detail"));
});


// -----------------------------------------
// 9주차: Amor AI 소식 알림 신청 폼
// 입력 검증(입력 중 피드백) → 조건부 입력(문자 알림) → submit 처리(차단·신청 중·성공·실패)
// -----------------------------------------
const NOTIFY_KEY = "amor-notify-list";
const NAME_MIN = 2;
const NAME_MAX = 10;
const WISH_MAX = 100;

const topicLabels = {
    reply: "답장 추천 팁",
    analysis: "대화 분석 리포트 소식",
    coaching: "관계 코칭 콘텐츠",
    news: "새 기능 출시 소식"
};
const frequencyLabels = { weekly: "주 1회 모아서", instant: "새 소식이 있을 때마다" };

const notifyForm = document.querySelector("#notify-form");
const notifySubmit = document.querySelector("#notify-submit");
const notifyReset = document.querySelector("#notify-reset");
const formSummary = document.querySelector("#form-summary");
const submitStatus = document.querySelector("#submit-status");
const notifyDone = document.querySelector("#notify-done");

const smsCheck = document.querySelector("#notify-sms");
const smsArea = document.querySelector("#sms-area");
const phoneInput = document.querySelector("#notify-phone");

let isSubmitting = false;
let editingEmail = null;        // 신청 내용 수정 중이면 원래 이메일
let duplicateEmail = null;      // 실패(중복)로 표시 중인 이메일

// 브라우저 저장 (실패하면 제출 실패로 처리)
function loadNotifyList() {
    try {
        const data = JSON.parse(localStorage.getItem(NOTIFY_KEY));
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

function saveNotifyList(list) {
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(list)); // 저장할 수 없으면 오류 발생 -> 실패 처리
}

function phoneDigits(value) {
    return value.replace(/\D/g, "");
}

function formatPhone(value) {
    const d = phoneDigits(value).slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return d.slice(0, 3) + "-" + d.slice(3);
    if (d.length === 10) return d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6);
    return d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7);
}

// 항목별 검사 규칙: ok(통과 여부), message(오류 문구), hint(입력 중 안내)
const fields = {
    name: {
        el: document.querySelector("#notify-name"),
        status: document.querySelector("#name-status"),
        label: "이름",
        check: function (value) {
            const length = value.trim().length;
            const count = length + " / " + NAME_MAX + "자";
            if (length === 0) return { ok: false, message: "이름 또는 닉네임을 입력해 주세요.", hint: count + " · " + NAME_MIN + "자 이상 입력하면 돼요" };
            if (length < NAME_MIN) return { ok: false, message: NAME_MIN + "자 이상 입력해 주세요. (지금 " + length + "자)", hint: count + " · " + (NAME_MIN - length) + "자 더 필요해요" };
            return { ok: true, okText: count + " · 사용할 수 있어요" };
        }
    },
    email: {
        el: document.querySelector("#notify-email"),
        status: document.querySelector("#email-status"),
        label: "이메일",
        check: function (value) {
            const email = value.trim();
            if (email === "") return { ok: false, message: "이메일 주소를 입력해 주세요.", hint: "" };
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                return { ok: false, message: "이메일 형식이 아니에요. '@'와 '.'을 넣어 고쳐 주세요. 예) amor@email.com", hint: "아직 이메일 형식이 아니에요" };
            }
            if (duplicateEmail !== null && email.toLowerCase() === duplicateEmail) {
                return { ok: false, message: "이미 알림을 신청한 이메일이에요. 다른 주소를 입력해 주세요.", hint: "" };
            }
            return { ok: true, okText: "올바른 이메일 형식이에요" };
        }
    },
    topic: {
        el: document.querySelector("#notify-topic"),
        status: document.querySelector("#topic-status"),
        label: "받을 소식",
        check: function (value) {
            if (value === "") return { ok: false, message: "받고 싶은 소식을 하나 골라 주세요.", hint: "" };
            return { ok: true, okText: "'" + topicLabels[value] + "'을(를) 먼저 보내 드려요" };
        }
    },
    phone: {
        el: phoneInput,
        status: document.querySelector("#phone-status"),
        label: "휴대폰 번호",
        check: function (value) {
            const d = phoneDigits(value);
            if (d.length === 0) return { ok: false, message: "문자를 받을 휴대폰 번호를 입력해 주세요. 원하지 않으면 위 체크를 해제하세요.", hint: "" };
            if (!/^01[016789]\d{7,8}$/.test(d)) {
                return { ok: false, message: "휴대폰 번호를 확인해 주세요. 010으로 시작하는 10~11자리예요. (지금 " + d.length + "자리)", hint: d.length + "자리 입력 중 · 10~11자리가 필요해요" };
            }
            return { ok: true, okText: "문자 알림을 받을 수 있는 번호예요" };
        }
    },
    wish: {
        el: document.querySelector("#notify-wish"),
        status: document.querySelector("#wish-status"),
        label: "바라는 점",
        check: function (value) {
            const length = value.trim().length;
            const count = length + " / " + WISH_MAX + "자";
            if (length > WISH_MAX) return { ok: false, message: WISH_MAX + "자 이내로 줄여 주세요. (지금 " + length + "자, " + (length - WISH_MAX) + "자 초과)", hint: "" };
            return { ok: true, okText: count, quiet: length === 0 };
        }
    },
    agree: {
        el: document.querySelector("#notify-agree"),
        status: document.querySelector("#agree-status"),
        label: "동의",
        check: function () {
            if (!document.querySelector("#notify-agree").checked) return { ok: false, message: "알림을 보내려면 정보 저장에 동의해 주세요.", hint: "" };
            return { ok: true, okText: "동의했어요" };
        }
    }
};

Object.keys(fields).forEach(function (key) { fields[key].touched = false; });

// 화면에 상태 표시: 색과 함께 ✓/✗ 문구로도 구분
function setStatus(field, state, text) {
    field.status.textContent = text;
    field.status.className = "field-status " + state;
    field.el.classList.toggle("invalid", state === "error");
    field.el.classList.toggle("valid", state === "ok");
    field.el.setAttribute("aria-invalid", state === "error" ? "true" : "false");
}

// 한 항목 검사 + 표시. 오류는 한 번 건드렸거나(blur) 제출을 시도한 뒤부터 빨갛게 보여 줌
function renderField(key) {
    const field = fields[key];
    if (field.el.disabled) {
        setStatus(field, "", "");
        return true;
    }
    const value = field.el.type === "checkbox" ? "" : field.el.value;
    const result = field.check(value);

    if (result.ok) {
        if (result.quiet) setStatus(field, "", "");
        else setStatus(field, "ok", "✓ " + result.okText);
    } else if (field.touched) {
        setStatus(field, "error", "✗ " + result.message);
    } else {
        setStatus(field, result.hint ? "hint" : "", result.hint);
    }
    return result.ok;
}

function updateSummary() {
    if (formSummary.hidden) return;
    const invalid = Object.keys(fields).filter(function (key) {
        return !fields[key].el.disabled && !fields[key].check(fields[key].el.value || "").ok;
    });
    if (invalid.length === 0) {
        formSummary.hidden = true;
    } else {
        showSummary(invalid);
    }
}

function showSummary(invalidKeys) {
    const names = invalidKeys.map(function (key) { return fields[key].label; });
    formSummary.textContent = "확인이 필요한 항목이 " + invalidKeys.length + "개 있어요: " + names.join(", ") +
        ". 빨간 안내를 보고 고친 뒤 다시 신청해 주세요.";
    formSummary.hidden = false;
}

// 입력 중 피드백 연결
["name", "email", "phone", "wish"].forEach(function (key) {
    const field = fields[key];
    field.el.addEventListener("input", function () {
        if (key === "phone") {
            field.el.value = formatPhone(field.el.value);
        }
        if (key === "email" && duplicateEmail !== null && field.el.value.trim().toLowerCase() !== duplicateEmail) {
            duplicateEmail = null; // 주소를 고치면 중복 오류 해제
        }
        if (key === "wish" && field.el.value.trim().length > WISH_MAX) {
            field.touched = true; // 글자 수 초과는 입력 중에도 바로 알려 줌
        }
        renderField(key);
        updateSummary();
    });
    field.el.addEventListener("blur", function () {
        if (field.el.value.trim() !== "") field.touched = true;
        renderField(key);
    });
});

fields.topic.el.addEventListener("change", function () {
    fields.topic.touched = true;
    renderField("topic");
    updateSummary();
});

fields.agree.el.addEventListener("change", function () {
    fields.agree.touched = true;
    renderField("agree");
    updateSummary();
});

// 조건부 입력: 문자 알림 체크 → 휴대폰 번호 영역 표시 + 사용 가능 / 해제 → 숨김 + disabled
function updateSmsArea() {
    const on = smsCheck.checked;
    smsArea.hidden = !on;
    phoneInput.disabled = !on;
    smsCheck.setAttribute("aria-expanded", on ? "true" : "false");
    if (!on) fields.phone.touched = false;
    renderField("phone");
    updateSummary();
}

smsCheck.addEventListener("change", function () {
    updateSmsArea();
    if (smsCheck.checked) phoneInput.focus();
});

// 제출 중 / 끝 버튼 상태
function setSubmitting(on) {
    isSubmitting = on;
    notifySubmit.disabled = on;
    notifyReset.disabled = on;
    notifyForm.setAttribute("aria-busy", on ? "true" : "false");
    if (on) {
        notifySubmit.textContent = editingEmail ? "저장 중…" : "신청 중…";
    } else {
        notifySubmit.textContent = editingEmail ? "수정 내용 저장" : "알림 신청하기";
    }
}

function showSubmitStatus(text, type) {
    submitStatus.textContent = text;
    submitStatus.className = "submit-status " + type;
}

function collectForm() {
    return {
        name: fields.name.el.value.trim(),
        email: fields.email.el.value.trim(),
        topic: fields.topic.el.value,
        frequency: document.querySelector('input[name="frequency"]:checked').value,
        phone: smsCheck.checked ? formatPhone(phoneInput.value) : "",
        wish: fields.wish.el.value.trim(),
        savedAt: Date.now()
    };
}

// 저장 시도: 성공하면 기록, 실패하면 이유를 담은 오류를 던짐
function saveApplication(data) {
    const list = loadNotifyList();
    const email = data.email.toLowerCase();
    const original = editingEmail ? editingEmail.toLowerCase() : null;

    const taken = list.some(function (item) {
        return item.email.toLowerCase() === email && item.email.toLowerCase() !== original;
    });
    if (taken) {
        const error = new Error("duplicate");
        error.reason = "duplicate";
        throw error;
    }

    const next = list.filter(function (item) {
        return item.email.toLowerCase() !== original;
    });
    next.push(data);

    try {
        saveNotifyList(next);
    } catch (e) {
        const error = new Error("storage");
        error.reason = "storage";
        throw error;
    }
}

function showDone(data, wasEdit) {
    document.querySelector("#done-badge").textContent = wasEdit ? "✅ 신청 내용 수정 완료" : "✅ 알림 신청 완료";
    document.querySelector("#done-title").textContent =
        data.name + "님, " + (wasEdit ? "신청 내용을 수정했어요." : "알림 신청이 완료되었어요.");
    document.querySelector("#done-email").textContent = data.email;
    document.querySelector("#done-topic").textContent = topicLabels[data.topic];
    document.querySelector("#done-frequency").textContent = frequencyLabels[data.frequency];
    document.querySelector("#done-phone").textContent = data.phone ? data.phone + " 으로도 받아요" : "받지 않음";
    document.querySelector("#done-wish").textContent = data.wish || "없음";

    notifyForm.hidden = true;
    notifyDone.hidden = false;
    notifyDone.dataset.email = data.email;
}

// submit 이벤트
function handleNotifySubmit(event) {
    event.preventDefault();
    if (isSubmitting) return; // 중복 제출 방지

    // 1) 모든 항목 검사 (숨겨진 휴대폰 칸은 disabled라 제외)
    const invalid = [];
    Object.keys(fields).forEach(function (key) {
        fields[key].touched = true;
        if (!renderField(key)) invalid.push(key);
    });

    if (invalid.length > 0) {
        showSummary(invalid);
        showSubmitStatus("", "");
        fields[invalid[0]].el.focus();
        return; // 조건 미충족 → 제출 차단
    }
    formSummary.hidden = true;

    // 2) 신청 중: 진행 문구 + 버튼 비활성화
    const data = collectForm();
    const wasEdit = editingEmail !== null;
    setSubmitting(true);
    showSubmitStatus("⏳ " + (wasEdit ? "수정 내용을 저장하고 있어요…" : "알림 신청을 처리하고 있어요…"), "pending");

    setTimeout(function () {
        try {
            saveApplication(data);
        } catch (error) {
            // 3) 실패: 입력 내용은 그대로 두고 다시 시도할 수 있게
            setSubmitting(false);
            if (error.reason === "duplicate") {
                duplicateEmail = data.email.toLowerCase();
                fields.email.touched = true;
                renderField("email");
                fields.email.el.focus();
                showSubmitStatus("✗ 신청하지 못했어요. 이미 알림을 신청한 이메일이에요. 다른 주소로 고친 뒤 다시 신청해 주세요. (입력한 내용은 그대로 있어요)", "error");
            } else {
                showSubmitStatus("✗ 신청하지 못했어요. 이 브라우저에 저장할 수 없는 상태예요. 입력한 내용은 그대로 있으니 잠시 후 다시 시도해 주세요.", "error");
            }
            return;
        }

        // 4) 성공
        setSubmitting(false);
        showSubmitStatus("", "");
        showDone(data, wasEdit);
    }, 1200);
}

notifyForm.addEventListener("submit", handleNotifySubmit);

// 다시 작성 / 새로 신청: 입력값·안내 문구·버튼 상태·조건부 영역 모두 초기화
function afterReset() {
    editingEmail = null;
    duplicateEmail = null;
    Object.keys(fields).forEach(function (key) {
        fields[key].touched = false;
    });
    formSummary.hidden = true;
    showSubmitStatus("", "");
    setSubmitting(false);
    updateSmsArea();
    Object.keys(fields).forEach(renderField);
}

notifyForm.addEventListener("reset", function () {
    // reset 이벤트 직후 값이 비워지므로 다음 순간에 상태를 다시 그림
    setTimeout(afterReset, 0);
});

document.querySelector("#btn-notify-new").addEventListener("click", function () {
    notifyDone.hidden = true;
    notifyForm.hidden = false;
    notifyForm.reset();
    fields.name.el.focus();
});

// 신청 내용 수정 (교수님 코멘트: 주소를 잘못 입력했을 때 다시 입력하는 경로)
document.querySelector("#btn-notify-edit").addEventListener("click", function () {
    editingEmail = notifyDone.dataset.email;
    duplicateEmail = null;
    notifyDone.hidden = true;
    notifyForm.hidden = false;
    setSubmitting(false);
    showSubmitStatus("✏️ 신청 내용을 수정하고 있어요. 고친 뒤 '수정 내용 저장'을 눌러 주세요.", "info");
    Object.keys(fields).forEach(renderField);
    fields.email.el.focus();
    fields.email.el.select();
});

updateSmsArea();
Object.keys(fields).forEach(renderField);
