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

async function sendMessage() {
    var userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") {
        alert("Please enter a message.");
        return;
    }

    var chatLog = document.getElementById("chat-log");

    // Create and display the user message
    let userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user");
    userMessage.innerHTML = `${userInput}`;
    chatLog.appendChild(userMessage);

    // Clear input field
    document.getElementById("user-input").value = "";

    // Add typing indicator
    let typingIndicator = document.createElement("div");
    typingIndicator.classList.add("chat-message", "typing");
    typingIndicator.innerHTML = "<i>Dogtor is typing...</i>";
    chatLog.appendChild(typingIndicator);

    // Auto-scroll
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
        let response = await fetch("https://doggy-chatbot.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        let botResponse = data.response || "Sorry, an error occurred.";

        // Remove typing indicator before displaying bot response
        typingIndicator.remove();

        // Create and display bot message
        let botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "bot");
        botMessage.innerHTML = `${botResponse.replace(/\n/g, "<br>")}`;
        chatLog.appendChild(botMessage);

        // Auto-scroll
        chatLog.scrollTop = chatLog.scrollHeight;
    } catch (error) {
        console.error("Error in fetching data:", error);
        
        // Remove typing indicator before showing error
        typingIndicator.remove();
        
        let errorMessage = document.createElement("div");
        errorMessage.classList.add("chat-message", "bot");
        errorMessage.innerHTML = "Sorry, an error occurred.";
        chatLog.appendChild(errorMessage);
    }
}

// Handle Enter key press
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