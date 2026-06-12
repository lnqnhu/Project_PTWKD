document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("nutribae_token");

    const profileBox = document.getElementById("userProfileBox");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!token || !profileBox) {
        return;
    }

    try {
        const res = await fetch("/api/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            localStorage.removeItem("nutribae_token");
            return;
        }

        const user = data.user;
        const profile = user.profile || {};
        const macros = profile.macros || {};

        document.getElementById("profileName").textContent = user.fullName || "Bae";
        document.getElementById("profileGoal").textContent = convertGoal(profile.goal);
        document.getElementById("profileWeight").textContent = profile.weight || "--";
        document.getElementById("profileHeight").textContent = profile.height || "--";
        document.getElementById("profileAge").textContent = profile.age || "--";
        document.getElementById("profileCalories").textContent = profile.targetCalories || "--";
        document.getElementById("profileProtein").textContent = macros.protein || "--";
        document.getElementById("profileCarbs").textContent = macros.carbs || "--";
        document.getElementById("profileFat").textContent = macros.fat || "--";

        profileBox.style.display = "block";
    } catch (err) {
        console.error("Lỗi tải dữ liệu người dùng:", err);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("nutribae_token");
            window.location.href = "login.html";
        });
    }
});

function convertGoal(goal) {
    const goals = {
        lose_weight: "Giảm cân",
        maintain: "Giữ cân",
        gain_weight: "Tăng cân",
        gain_muscle: "Tăng cơ"
    };

    return goals[goal] || "--";
}