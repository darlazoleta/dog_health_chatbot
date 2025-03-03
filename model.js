async function sendMessage() {
    var userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") {
        alert("Please enter a message.");
        return;
    }

    var chatLog = document.getElementById("chat-log");

    // Create a user message div and apply class
    let userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user");
    userMessage.innerHTML = `${userInput}`;
    chatLog.appendChild(userMessage);

    // Clear input field
    document.getElementById("user-input").value = "";

    try {
        let response = await fetch("https://doghealthchatbot-production.up.railway.app/chat", {
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

        // Create a bot message div and apply class
        let botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "bot");
        botMessage.innerHTML = `${botResponse.replace(/\n/g, "<br>")}`;
        chatLog.appendChild(botMessage);

        // Auto-scroll to the latest message
        chatLog.scrollTop = chatLog.scrollHeight;
    } catch (error) {
        console.error("Error in fetching data:", error);
        let errorMessage = document.createElement("div");
        errorMessage.classList.add("chat-message", "bot");
        errorMessage.innerHTML = `Sorry, an error occurred.`;
        chatLog.appendChild(errorMessage);
    }
}

document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
