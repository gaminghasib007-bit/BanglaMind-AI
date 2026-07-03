const API_KEY = "AQ.Ab8RN6KKB8COzcRC1BubwrO87ynTFrVEiLykiEaegJ0YcGXswg";

const chat = document.getElementById("chat");
const questionInput = document.getElementById("question");

async function askAI() {

    const question = questionInput.value.trim();

    if (!question) return;

    chat.innerHTML += `
        <div class="user">
            👤 ${question}
        </div>
    `;
    saveChat();

    questionInput.value = "";

    const q = question.toLowerCase();

    if (
        q.includes("তোমার নাম") ||
        q.includes("what is your name")
    ) {

        chat.innerHTML += `
            <div class="ai">
                🤖 আমার নাম <b>BanglaMind AI</b>।
            </div>
        `;

        return;
    }

    if (
        q.includes("কে বানিয়েছে") ||
        q.includes("who made you") ||
        q.includes("creator")
    ) {

        chat.innerHTML += `
            <div class="ai">
                🤖 আমাকে <b>তানভীর সরকার হাসিব</b>
                (Tanvir Sorkar Hasib)
                তৈরি করেছেন।
            </div>
        `;

        return;
    }
    try {

        chat.innerHTML += `
            <div class="ai" id="typing">
                🤖 উত্তর তৈরি হচ্ছে...
            </div>
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `

তুমি BanglaMind AI।

তোমার নাম BanglaMind AI।

তোমাকে তানভীর সরকার হাসিব (Tanvir Sorkar Hasib) তৈরি করেছেন।

ব্যবহারকারী যে ভাষায় প্রশ্ন করবে, সেই ভাষায় উত্তর দেবে।
বাংলা হলে বাংলায়, ইংরেজি হলে ইংরেজিতে, আরবি হলে আরবিতে এবং অন্যান্য ভাষা হলে সেই ভাষাতেই উত্তর দেবে।

প্রশ্ন:
${question}

`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
                document.getElementById("typing").remove();

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";

        chat.innerHTML += `
            <div class="ai">
                🤖 ${reply}
            </div>
        `;

        chat.scrollTop = chat.scrollHeight;
    } catch (error) {
        const typing = document.getElementById("typing");

if (typing) {
    typing.remove();
}

chat.innerHTML += `
    <div class="ai">
        ❌ ${error.message}
    </div>
`;

console.error(error);

}

}
questionInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        askAI();
    }
});

function newChat() {
    chat.innerHTML = "";
}

window.onload = function () {
    questionInput.focus();
    loadChat();
};
function saveChat() {
    localStorage.setItem("banglamind_chat", chat.innerHTML);
}

function loadChat() {
    const data = localStorage.getItem("banglamind_chat");

    if (data) {
        chat.innerHTML = data;
        chat.scrollTop = chat.scrollHeight;
    }
}
