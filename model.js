async function sendMessage() {
    var userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") {
        alert("Please enter a message.");
        return;
    }

    var chatLog = document.getElementById("chat-log");

    // Create user message
    let userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user");
    userMessage.innerHTML = `${userInput}`;
    chatLog.appendChild(userMessage);

    // Clear input field
    document.getElementById("user-input").value = "";

    // Create bot message container
    let botMessage = document.createElement("div");
    botMessage.classList.add("chat-message", "bot");
    chatLog.appendChild(botMessage);

    try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if it's a regular JSON response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            botMessage.innerHTML = data.response || data.error;
            return;
        }

        // Handle streaming response
        let responseText = "";
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.error) {
                            botMessage.innerHTML = `Error: ${data.error}`;
                            console.error("Bot error:", data.error);
                            break;
                        }
                        if (data.chunk) {
                            responseText += data.chunk;
                            botMessage.innerHTML = responseText.replace(/\n/g, "<br>");
                            chatLog.scrollTop = chatLog.scrollHeight;
                        }
                    } catch (e) {
                        console.error("Parse error:", e, "Line:", line);
                    }
                }
            }
        }

        if (!responseText) {
            botMessage.innerHTML = "Sorry, I couldn't generate a response. Please try again.";
        }

    } catch (error) {
        console.error("Network error:", error);
        botMessage.innerHTML = "Sorry, an error occurred. Please try again.";
    }

    chatLog.scrollTop = chatLog.scrollHeight;
}

document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});


document.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");
    const aboutSection = document.querySelector("#chat");

    if (window.scrollY >= aboutSection.offsetTop) {
        nav.style.position = "absolute";
    } else {
        nav.style.position = "fixed";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var chatLog = document.getElementById("chat-log");

    // Display initial bot message once when the page loads
    let initialMessage = document.createElement("div");
    initialMessage.classList.add("chat-message", "bot");
    initialMessage.innerHTML = "Hello there! The responses will take a minute or less to load due to a FREE server plan hosting this site. Thank you for understanding.";
    chatLog.appendChild(initialMessage);

    // Auto-scroll
    chatLog.scrollTop = chatLog.scrollHeight;
});