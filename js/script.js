// script.js

// Example: Simple input validation
function validateNumberInput(inputId) {
    const input = document.getElementById(inputId);
    if (isNaN(input.value) || input.value === "") {
        alert("Please enter a valid number.");
        input.focus();
        return false;
    }
    return true;
}

// Example: Glow effect for result dynamically
function highlightResult(resultId) {
    const result = document.getElementById(resultId);
    result.style.transition = "all 0.5s ease";
    result.style.boxShadow = "0 0 15px #00ffe7";
    setTimeout(() => {
        result.style.boxShadow = "none";
    }, 800);
}
