document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

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
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Đăng nhập thất bại");
                return;
            }

            localStorage.setItem("nutribae_token", data.token);

            window.location.href = "page.html";
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối server");
        }
    });
});