// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('user-input');

    if (userInput) {
        userInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});
