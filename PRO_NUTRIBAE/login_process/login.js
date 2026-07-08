document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Không tìm thấy form đăng nhập với id='loginForm'.");
        return;
    }

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Đăng nhập thất bại");
                return;
            }

            if (!data.token) {
                alert("Đăng nhập chưa hoàn tất. Hệ thống không nhận được token.");
                return;
            }

            // Standard key used by NutriBae Order and Admin-related pages.
            localStorage.setItem("nutribaeToken", data.token);

            // Keep the previous key temporarily for compatibility with older code.
            localStorage.setItem("nutribae_token", data.token);

            // Save basic user data for the profile display and future pages.
            localStorage.setItem("nutribaeUser", JSON.stringify(data.user || {}));

            window.location.href = "/page.html";
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối server");
        }
    });
});