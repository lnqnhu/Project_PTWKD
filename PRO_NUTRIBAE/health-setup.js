document.addEventListener("DOMContentLoaded", function () {
    const healthSetupForm = document.getElementById("healthSetupForm");

    const pendingRegister = JSON.parse(sessionStorage.getItem("pendingRegister"));

    if (!pendingRegister) {
        alert("Bạn cần đăng ký tài khoản trước");
        window.location.href = "register.html";
        return;
    }

    healthSetupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const profile = {
            goal: document.getElementById("goal").value,
            gender: document.getElementById("gender").value,
            age: Number(document.getElementById("age").value),
            height: Number(document.getElementById("height").value),
            weight: Number(document.getElementById("weight").value),
            activityLevel: document.getElementById("activityLevel").value
        };

        const registerData = {
            ...pendingRegister,
            profile
        };

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Đăng ký thất bại");
                return;
            }

            sessionStorage.removeItem("pendingRegister");

            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            window.location.href = "login.html";
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối server");
        }
    });
});