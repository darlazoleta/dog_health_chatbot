document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.querySelector("textarea");

    if (!textarea) {
        console.error("Textarea element not found.");
        return;
    }

    function adjustHeight() {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

    textarea.addEventListener("input", adjustHeight);
    adjustHeight();
});
