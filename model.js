document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    if (!userInput || !chatLog) {
        console.error("Missing chat input or chat log elements. Ensure your HTML has them.");
        return;
    }

    async function sendMessage() {
        let userMessageText = userInput.value.trim();
        if (userMessageText === "") {
            alert("Please enter a message.");
            return;
        }

        // Create and display user message
        let userMessage = document.createElement("div");
        userMessage.classList.add("chat-message", "user");
        userMessage.innerHTML = `${userMessageText}`;
        chatLog.appendChild(userMessage);

        // Clear input field
        userInput.value = "";

        try {
            let response = await fetch("https://doghealthchatbot-production.up.railway.app/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessageText })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data = await response.json();
            console.log("API Response:", data);  // Debugging

            let botResponse = data.response || "Sorry, an error occurred.";

            // Create bot message div
            let botMessage = document.createElement("div");
            botMessage.classList.add("chat-message", "bot");
            botMessage.innerHTML = `${botResponse.replace(/\n/g, "<br>")}`;
            chatLog.appendChild(botMessage);

            // Auto-scroll to latest message
            chatLog.scrollTop = chatLog.scrollHeight;
        } catch (error) {
            console.error("Error in fetching data:", error);
            let errorMessage = document.createElement("div");
            errorMessage.classList.add("chat-message", "bot");
            errorMessage.innerHTML = `Sorry, an error occurred.`;
            chatLog.appendChild(errorMessage);
        }
    }

    // Handle Enter key for sending messages
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
