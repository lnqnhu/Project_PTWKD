document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!fullName || !email || !password || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        const pendingRegister = {
            fullName,
            email,
            password,
            confirmPassword
        };

        sessionStorage.setItem("pendingRegister", JSON.stringify(pendingRegister));

        window.location.href = "health-setup.html";
    });
});