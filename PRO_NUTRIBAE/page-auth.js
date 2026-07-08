document.addEventListener("DOMContentLoaded", async function () {
    // Hỗ trợ cả key cũ và key mới để không bị lỗi giữa các trang.
    const token =
        localStorage.getItem("nutribaeToken") ||
        localStorage.getItem("nutribae_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

    const profileBox = document.getElementById("userProfileBox");
    const logoutBtn = document.getElementById("logoutBtn");

    function clearLoginData() {
        localStorage.removeItem("nutribaeToken");
        localStorage.removeItem("nutribae_token");
        localStorage.removeItem("nutribaeUser");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
    }

    // Logout phải luôn hoạt động, kể cả khi token đã hết hạn.
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            const confirmLogout = confirm("Bạn có muốn đăng xuất khỏi NutriBae không?");

            if (!confirmLogout) return;

            clearLoginData();

            if (profileBox) {
                profileBox.style.display = "none";
            }

            // Quay về trang chủ ở trạng thái chưa đăng nhập.
            window.location.replace("/page.html");
        });
    }

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
            clearLoginData();
            profileBox.style.display = "none";
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
});

function convertGoal(goal) {
    const goals = {
        lose_weight: "Giảm cân",
        maintain: "Giữ cân",
        gain_weight: "Tăng cân",
        gain_muscle: "Tăng cơ",
        eat_clean: "Eat clean"
    };

    return goals[goal] || "--";
}