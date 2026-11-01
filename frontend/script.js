
console.log("Welcome to Educational Hub!");

// Home page welcome message
window.addEventListener("load", function () {
    console.log("Educational Hub loaded successfully.");
});



// Login form
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const role = document.getElementById("loginRole").value;

        if (email === "" || password === "") {
            alert("Please fill all fields.");
            return;
        }

        alert("Login form is working! Backend connection is pending.");
    });
}

// Registration form
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        alert("Registration form is working! Backend connection is pending.");
    });
}
