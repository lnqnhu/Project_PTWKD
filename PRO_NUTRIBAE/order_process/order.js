/* ==========================================================
   order.js — toàn bộ logic cho trang đặt đồ ăn NutriBae
   ========================================================== */

(function () {

    /* ================= DỮ LIỆU DANH MỤC ================= */
    const CATEGORIES = [
        { id: "all",        label: "Tất cả",        icon: "🍽️" },
        { id: "bowls",      label: "Healthy Bowls",  icon: "🍲" },
        { id: "salad",      label: "Salad",          icon: "🥗" },
        { id: "breakfast",  label: "Breakfast",      icon: "🍳" },
        { id: "smoothies",  label: "Smoothies",      icon: "🥤" },
        { id: "vegetarian", label: "Vegetarian",     icon: "🥦" },
        { id: "snacks",     label: "Healthy Snacks", icon: "🥜" }
    ];

    /* DỮ LIỆU MÓN ĂN 
    */
    const FOODS = [
        /* BOWLS */
        {
            id: "f1", category: "bowls",
            name: "Bowl gà nướng sốt teriyaki", cal: 480, price: 65000,
            image: "/images/chicken-bowl.jpg", icon: "🍗",
            desc: "Gà nướng, gạo lứt, bông cải xanh, sốt teriyaki ít đường.",
            protein: 38, carbs: 52, fat: 10, fiber: 4,
            time: "20 phút", serving: "1 người",
            ingredients: "200g ức gà, 150g gạo lứt, 100g bông cải xanh, sốt teriyaki ít đường, vừng rang",
            steps: "Ướp gà với sốt teriyaki 15 phút → Nướng 180°C 15 phút → Luộc gạo lứt và hấp bông cải → Xếp tô, rưới sốt, rắc vừng"
        },
        {
            id: "f2", category: "bowls",
            name: "Bowl cá hồi áp chảo quinoa", cal: 520, price: 75000,
            image: "/images/salmon.jpg", icon: "🐟",
            desc: "Cá hồi áp chảo, quinoa, bơ, rau củ nướng.",
            protein: 42, carbs: 38, fat: 18, fiber: 5,
            time: "25 phút", serving: "1 người",
            ingredients: "180g cá hồi, 100g quinoa, 1/2 quả bơ, rau củ theo mùa, dầu olive, chanh",
            steps: "Nấu quinoa → Áp chảo cá hồi 3 phút mỗi mặt → Nướng rau củ 200°C 10 phút → Xếp tô, thêm bơ và vắt chanh"
        },
        {
            id: "f3", category: "bowls",
            name: "Bowl đậu gà chay Địa Trung Hải", cal: 430, price: 55000,
            image: "/images/greek-chickpea-bowl.webp", icon: "🥙",
            desc: "Đậu gà, hummus, dưa leo, cà chua bi, sốt chanh ô liu.",
            protein: 18, carbs: 55, fat: 14, fiber: 10,
            time: "15 phút", serving: "1 người",
            ingredients: "150g đậu gà luộc, 2 thìa hummus, 1/2 dưa leo, 6 cà chua bi, sốt chanh dầu olive",
            steps: "Trộn đậu gà với rau củ → Phết hummus đáy tô → Xếp topping → Rưới sốt chanh"
        },
        {
            id: "f4", category: "bowls",
            name: "Bát quinoa rau củ", cal: 320, price: 52000,
            image: "/images/quinoa-bowl.webp", icon: "🌿",
            desc: "Quinoa, rau củ theo mùa, hạt bí, sốt chanh dây.",
            protein: 14, carbs: 46, fat: 8, fiber: 7,
            time: "25 phút", serving: "2 người",
            ingredients: "100g quinoa, 1/2 bí ngòi, 1/2 ớt chuông, cải bó xôi, sốt mè rang",
            steps: "Luộc quinoa → Xào rau củ → Trộn đều và rưới sốt mè"
        },

        /* ---- SALAD ---- */
        {
            id: "f5", category: "salad",
            name: "Salad gà nướng cam mật", cal: 320, price: 45000,
            image: "/images/mango-chicken-salad.webp", icon: "🥗",
            desc: "Gà nướng, xà lách, cam, hạt óc chó, sốt mật ong mù tạt.",
            protein: 28, carbs: 22, fat: 11, fiber: 3,
            time: "20 phút", serving: "1 người",
            ingredients: "150g ức gà, 1 quả cam, xà lách romaine, hạt óc chó, sốt mật ong mù tạt",
            steps: "Nướng gà → Thái lát → Trộn xà lách và cam → Chan sốt, rắc óc chó"
        },
        {
            id: "f6", category: "salad",
            name: "Salad cá ngừ trứng", cal: 350, price: 50000,
            image: "/images/salad.png", icon: "🥚",
            desc: "Cá ngừ, trứng luộc, rau xà lách, cà chua, sốt dầu olive.",
            protein: 32, carbs: 10, fat: 18, fiber: 2,
            time: "15 phút", serving: "1 người",
            ingredients: "1 hộp cá ngừ, 2 quả trứng luộc, xà lách, cà chua, sốt dầu olive chanh",
            steps: "Luộc trứng → Trộn cá ngừ với sốt → Xếp xà lách, thêm topping, rưới dầu"
        },
        {
            id: "f7", category: "salad",
            name: "Salad bơ cam", cal: 200, price: 42000,
            image: "/images/citrus-avocado-salad.webp", icon: "🥑",
            desc: "Salad bơ cam tươi mát, cân bằng vitamin và chất béo tốt.",
            protein: 4, carbs: 18, fat: 14, fiber: 6,
            time: "15 phút", serving: "1 người",
            ingredients: "1/2 quả bơ, 1 quả cam, xà lách, hạt óc chó, sốt mật ong chanh",
            steps: "Gọt cam và bơ → Trộn cùng xà lách → Chan sốt mật ong"
        },
        {
            id: "f8", category: "salad",
            name: "Salad rau củ quinoa", cal: 280, price: 45000,
            image: "/images/quinoa.jpg", icon: "🥬",
            desc: "Quinoa, rau củ theo mùa, hạt bí, sốt chanh dây.",
            protein: 10, carbs: 38, fat: 8, fiber: 5,
            time: "20 phút", serving: "1 người",
            ingredients: "80g quinoa, rau củ theo mùa, hạt bí ngô, sốt chanh dây olive",
            steps: "Nấu quinoa để nguội → Thái rau củ → Trộn đều, rưới sốt, rắc hạt bí"
        },

        /* ---- BREAKFAST ---- */
        {
            id: "f9", category: "breakfast",
            name: "Yến mạch chuối hạt chia", cal: 310, price: 35000,
            image: "/images/yenmach.jpg", icon: "🥣",
            desc: "Yến mạch ngâm sữa hạt, chuối, hạt chia, mật ong.",
            protein: 12, carbs: 52, fat: 7, fiber: 8,
            time: "10 phút", serving: "1 người",
            ingredients: "80g yến mạch, 200ml sữa hạt, 1 quả chuối, 1 thìa hạt chia, mật ong",
            steps: "Ngâm yến mạch với sữa hạt qua đêm → Buổi sáng thêm chuối cắt lát, hạt chia và mật ong"
        },
        {
            id: "f10", category: "breakfast",
            name: "Bánh mì nguyên cám trứng ốp la", cal: 380, price: 38000,
            image: "/images/avocado-toast.webp", icon: "🍳",
            desc: "Bánh mì nguyên cám, trứng ốp la, bơ, cà chua.",
            protein: 18, carbs: 36, fat: 16, fiber: 5,
            time: "15 phút", serving: "1 người",
            ingredients: "2 lát bánh mì nguyên cám, 2 quả trứng, 1/2 quả bơ, cà chua bi, tiêu muối",
            steps: "Nướng bánh mì → Nghiền bơ phết lên bánh → Chiên trứng ốp la → Xếp cà chua và rắc tiêu"
        },
        {
            id: "f11", category: "breakfast",
            name: "Granola sữa chua Hy Lạp", cal: 290, price: 40000,
            image: "/images/berry-parfait.webp", icon: "🍓",
            desc: "Sữa chua Hy Lạp, granola, mật ong, quả mọng.",
            protein: 15, carbs: 38, fat: 6, fiber: 4,
            time: "10 phút", serving: "1 người",
            ingredients: "150g sữa chua Hy Lạp, 40g granola, 50g dâu tây + việt quất, mật ong",
            steps: "Xếp sữa chua vào ly → Rắc granola → Thêm quả mọng → Rưới mật ong"
        },
        {
            id: "f12", category: "breakfast",
            name: "Bánh kếp yến mạch", cal: 280, price: 38000,
            image: "/images/oatmeal-pancakes.jpg", icon: "🥞",
            desc: "Bánh yến mạch thơm mềm, thêm chuối hoặc mật ong.",
            protein: 14, carbs: 40, fat: 7, fiber: 5,
            time: "15 phút", serving: "1 người",
            ingredients: "50g yến mạch, 1 quả trứng, 100ml sữa hạt, 1/2 quả chuối nghiền",
            steps: "Trộn bột yến mạch với trứng và sữa → Chiên từng chiếc lửa vừa → Xếp tầng, thêm trái cây"
        },

        /* ---- SMOOTHIES ---- */
        {
            id: "f13", category: "smoothies",
            name: "Smoothie xoài chuối", cal: 220, price: 35000,
            image: "/images/xoai.jpg", icon: "🥭",
            desc: "Xoài, chuối, sữa hạt, không đường.",
            protein: 4, carbs: 48, fat: 2, fiber: 4,
            time: "5 phút", serving: "1 người",
            ingredients: "1/2 quả xoài, 1 quả chuối, 200ml sữa hạt, đá bào",
            steps: "Cho tất cả vào máy xay → Xay mịn 1 phút → Rót ra ly và thưởng thức ngay"
        },
        {
            id: "f14", category: "smoothies",
            name: "Smoothie bơ chuối", cal: 260, price: 38000,
            image: "/images/bơ.jpg", icon: "🥑",
            desc: "Bơ, chuối, sữa hạt, mật ong.",
            protein: 5, carbs: 34, fat: 12, fiber: 6,
            time: "5 phút", serving: "1 người",
            ingredients: "1/2 quả bơ chín, 1 quả chuối, 200ml sữa hạt, 1 thìa mật ong",
            steps: "Cho bơ và chuối vào máy xay → Thêm sữa hạt và mật ong → Xay mịn → Rót ra ly"
        },
        {
            id: "f15", category: "smoothies",
            name: "Smoothie rau xanh detox", cal: 180, price: 36000,
            image: "/images/rau.jpg", icon: "🥬",
            desc: "Cải kale, táo xanh, chanh, gừng.",
            protein: 3, carbs: 38, fat: 1, fiber: 5,
            time: "5 phút", serving: "1 người",
            ingredients: "1 nắm cải kale, 1 quả táo xanh, 1/2 quả chanh, 1 miếng gừng nhỏ, 150ml nước lọc",
            steps: "Rửa sạch rau → Cho vào máy xay cùng táo và gừng → Thêm nước và chanh → Xay mịn"
        },
        {
            id: "f16", category: "smoothies",
            name: "Sinh tố protein", cal: 220, price: 40000,
            image: "/images/protein-smoothie.jpg", icon: "💪",
            desc: "Bột protein, chuối, sữa hạt, bơ đậu phộng.",
            protein: 28, carbs: 26, fat: 6, fiber: 3,
            time: "8 phút", serving: "1 người",
            ingredients: "1 muỗng bột protein, 1/2 quả chuối, 200ml sữa hạt, 1 thìa bơ đậu phộng",
            steps: "Cho vào máy xay → Xay nhuyễn → Rót ra cốc uống ngay sau tập"
        },
        {
            id: "f17", category: "smoothies",
            name: "Sinh tố yến mạch berry", cal: 230, price: 37000,
            image: "/images/berry-oat-smoothie.webp", icon: "🫐",
            desc: "Thức uống trái cây và yến mạch cho năng lượng lâu dài.",
            protein: 8, carbs: 42, fat: 4, fiber: 6,
            time: "8 phút", serving: "1 người",
            ingredients: "100ml sữa hạt, 50g yến mạch, 50g dâu tây, 50g việt quất",
            steps: "Cho vào máy xay → Xay mịn → Rót ra cốc, thêm đá nếu thích"
        },

        /* ---- VEGETARIAN ---- */
        {
            id: "f18", category: "vegetarian",
            name: "Đậu phụ xào sả ớt", cal: 360, price: 48000,
            image: "/images/tofu-stir-fry.webp", icon: "🌶️",
            desc: "Đậu phụ chiên giòn, sả ớt, cơm gạo lứt.",
            protein: 20, carbs: 40, fat: 14, fiber: 4,
            time: "18 phút", serving: "2 người",
            ingredients: "200g đậu phụ, 2 cây sả, 1 ớt, nước tương, dầu ăn, cơm gạo lứt",
            steps: "Chiên đậu phụ vàng đều → Phi sả ớt → Xào đậu phụ với sốt → Ăn kèm cơm gạo lứt"
        },
        {
            id: "f19", category: "vegetarian",
            name: "Cà ri chay rau củ", cal: 400, price: 50000,
            image: "/images/cari.jpg", icon: "🍛",
            desc: "Cà ri nước cốt dừa, rau củ, đậu hũ.",
            protein: 16, carbs: 44, fat: 18, fiber: 6,
            time: "25 phút", serving: "2 người",
            ingredients: "200g đậu hũ, khoai tây, cà rốt, đậu que, nước cốt dừa, bột cà ri",
            steps: "Phi hành tỏi → Thêm bột cà ri → Cho rau củ và đậu hũ → Đổ nước cốt dừa, nấu sôi 15 phút"
        },
        {
            id: "f20", category: "vegetarian",
            name: "Cơm súp lơ nghệ", cal: 160, price: 42000,
            image: "/images/turmeric-cauliflower-rice.webp", icon: "🌻",
            desc: "Cơm súp lơ nghệ nhẹ nhàng, phù hợp giảm tinh bột.",
            protein: 5, carbs: 20, fat: 6, fiber: 5,
            time: "18 phút", serving: "2 người",
            ingredients: "200g súp lơ trắng, 1/2 thìa nghệ, 1 thìa dầu olive, hành tây, tỏi",
            steps: "Băm nhỏ súp lơ → Phi hành tỏi → Xào súp lơ với nghệ đến chín mềm"
        },
        {
            id: "f21", category: "vegetarian",
            name: "Cuộn trứng rau chân vịt", cal: 260, price: 44000,
            image: "/images/Spinach Egg Wrap.webp", icon: "🌯",
            desc: "Cuộn trứng rau chân vịt thơm ngon, giàu sắt và protein.",
            protein: 16, carbs: 22, fat: 12, fiber: 3,
            time: "12 phút", serving: "1 người",
            ingredients: "2 quả trứng, 1 nắm rau chân vịt, 1 bánh tráng, tiêu muối, sốt ớt nhẹ",
            steps: "Xào rau chân vịt → Đánh trứng với tiêu muối → Rán mỏng → Cuộn cùng bánh tráng"
        },

        /* ---- SNACKS ---- */
        {
            id: "f22", category: "snacks",
            name: "Hạt mix dinh dưỡng", cal: 150, price: 25000,
            image: "/images/mix.webp", icon: "🥜",
            desc: "Hạnh nhân, óc chó, hạt điều, nho khô.",
            protein: 5, carbs: 12, fat: 10, fiber: 2,
            time: "0 phút", serving: "1 gói",
            ingredients: "30g hạnh nhân, 20g óc chó, 20g hạt điều, 10g nho khô",
            steps: "Đóng gói sẵn — Mở ra và thưởng thức ngay, không cần chế biến"
        },
        {
            id: "f23", category: "snacks",
            name: "Thanh protein yến mạch", cal: 180, price: 28000,
            image:"/images/thanh.webp", icon: "🍫",
            desc: "Yến mạch, whey protein, mật ong.",
            protein: 15, carbs: 22, fat: 4, fiber: 3,
            time: "12 phút", serving: "1 thanh",
            ingredients: "80g yến mạch, 1 muỗng whey protein, 2 thìa mật ong, 1 thìa dầu dừa",
            steps: "Trộn tất cả nguyên liệu → Ép khuôn → Làm lạnh 30 phút → Cắt thanh"
        },
        {
            id: "f24", category: "snacks",
            name: "Khoai lang sấy giòn", cal: 160, price: 22000,
            image:"/images/khoailang.webp", icon: "🍠",
            desc: "Khoai lang sấy giòn không dầu, ít muối.",
            protein: 2, carbs: 36, fat: 0, fiber: 4,
            time: "20 phút", serving: "1 gói",
            ingredients: "200g khoai lang, chút muối biển, chút tiêu",
            steps: "Cắt khoai lang lát mỏng → Sấy 120°C trong 1.5 giờ đến giòn → Để nguội"
        },
        {
            id: "f25", category: "snacks",
            name: "Viên năng lượng hạnh nhân chà là", cal: 210, price: 32000,
            image: "/images/almond-date-energy-balls.webp", icon: "⚡",
            desc: "Viên hạt và chà là ngọt tự nhiên, bữa phụ tiện lợi.",
            protein: 5, carbs: 26, fat: 10, fiber: 4,
            time: "12 phút", serving: "6 viên",
            ingredients: "80g hạnh nhân, 80g chà là, 1 thìa dầu dừa, 1 thìa bột cacao",
            steps: "Xay nhuyễn tất cả → Vo thành viên tròn → Làm lạnh 20 phút"
        },
        {
            id: "f26", category: "snacks",
            name: "Bánh gà chiên giòn", cal: 210, price: 32000,
            image: null, icon: "⚡",
            desc: "Giòn tan mềm mọng cuốn hút.",
            protein: 5, carbs: 26, fat: 10, fiber: 4,
            time: "12 phút", serving: "6 viên",
            ingredients: "80g hạnh nhân, 80g chà là, 1 thìa dầu dừa, 1 thìa bột cacao",
            steps: "Xay nhuyễn tất cả → Vo thành viên tròn → Làm lạnh 20 phút"
        },
        {
            id: "f27", category: "snacks",
            name: "Sữa chua táo quế", cal: 190, price: 30000,
            image: "/images/apple-cinnamon-yogurt.webp", icon: "🍎",
            desc: "Sữa chua táo quế thơm ngọt, bữa phụ giàu probiotic.",
            protein: 10, carbs: 28, fat: 3, fiber: 2,
            time: "10 phút", serving: "1 người",
            ingredients: "150g sữa chua, 1/2 quả táo, 1/2 thìa quế, hạnh nhân băm nhỏ",
            steps: "Cắt táo thành dạng hạt lựu → Trộn vào sữa chua → Rắc quế và hạnh nhân"
        }
    ];

    /* ================= DỮ LIỆU MEAL PLAN ================= */
    const PLANS = [
        {
            id: "plan7", label: "Meal Plan 7 ngày", days: 7, price: 990000, popular: false,
            features: ["3 bữa/ngày theo thực đơn cá nhân hoá", "Tư vấn 1-1 với chuyên gia dinh dưỡng", "Giao hàng tận nơi mỗi ngày", "Phù hợp để bắt đầu / dùng thử"]
        },
        {
            id: "plan14", label: "Meal Plan 14 ngày", days: 14, price: 1850000, popular: true,
            features: ["3 bữa/ngày + 1 snack lành mạnh", "Theo dõi & điều chỉnh thực đơn giữa kỳ", "Tư vấn dinh dưỡng không giới hạn", "Miễn phí giao hàng toàn bộ gói"]
        },
        {
            id: "plan30", label: "Meal Plan 30 ngày", days: 30, price: 3500000, popular: false,
            features: ["3 bữa/ngày + 1 snack lành mạnh", "Báo cáo tiến độ cân nặng hàng tuần", "Ưu tiên hỗ trợ từ chuyên gia", "Tiết kiệm nhất / phù hợp mục tiêu dài hạn"]
        }
    ];

    /* ================= STATE ================= */
    let cart = [];
    let currentCategory = "all";
    let recommendedPlan = null;
    let currentOrder = null;

    const ORDER_STEPS = ["confirmed", "preparing", "delivering", "done"];

    /* ================= HELPERS ================= */
    function formatVND(n) { return n.toLocaleString("vi-VN") + "đ"; }
    function $(sel)    { return document.querySelector(sel); }
    function $all(sel) { return Array.from(document.querySelectorAll(sel)); }
    function findCartItem(key) { return cart.find(it => it.key === key); }

    /* ================= RENDER: PLAN GRID ================= */
    function renderPlans() {
        const grid = $("#planGrid");
        grid.innerHTML = PLANS.map(plan => `
            <div class="plan-card ${plan.popular ? "popular" : ""}">
                ${plan.popular ? '<span class="plan-badge">Phổ biến nhất</span>' : ""}
                <p class="plan-days">${plan.days} NGÀY</p>
                <h3>${plan.label}</h3>
                <div class="plan-price">${formatVND(plan.price)} <small>/ gói</small></div>
                <ul>${plan.features.map(f => `<li>${f}</li>`).join("")}</ul>
                <button data-plan-id="${plan.id}" class="select-plan-btn">Chọn gói này</button>
            </div>
        `).join("");
        $all(".select-plan-btn").forEach(btn => {
            btn.addEventListener("click", () => addPlanToCart(btn.dataset.planId));
        });
    }

    /* ================= RENDER: CATEGORY ROW ================= */
    function renderCategories() {
        const row = $("#categoryRow");
        row.innerHTML = CATEGORIES.map(cat => `
            <button class="category-pill ${cat.id === currentCategory ? "active" : ""}" data-cat="${cat.id}">
                <span class="pill-icon">${cat.icon}</span>
                <span class="pill-label">${cat.label}</span>
            </button>
        `).join("");
        $all(".category-pill").forEach(btn => {
            btn.addEventListener("click", () => {
                currentCategory = btn.dataset.cat;
                renderCategories();
                renderFoodGrid();
            });
        });
    }

    /* ================= RENDER: FOOD GRID ================= */
    function renderFoodGrid() {
        const grid = $("#foodGrid");
        const list = currentCategory === "all" ? FOODS : FOODS.filter(f => f.category === currentCategory);

        grid.innerHTML = list.map(food => `
            <div class="food-item-card" data-food-id="${food.id}">
                <div class="food-visual-wrap">
                    ${food.image
                        ? `<img src="${food.image}" alt="${food.name}" class="food-visual-img" loading="lazy">`
                        : `<div class="food-visual-emoji" style="background:${visualBg(food.category)}">${food.icon}</div>`
                    }
                    <span class="food-cat-badge">${CATEGORIES.find(c => c.id === food.category)?.icon || ""}</span>
                </div>
                <div class="food-info">
                    <h4>${food.name}</h4>
                    <span class="food-cal-tag">🔥 ${food.cal} cal</span>
                    <p class="food-desc">${food.desc}</p>
                    <div class="food-macros-mini">
                        <span>🥩 ${food.protein}g</span>
                        <span>🌾 ${food.carbs}g</span>
                        <span>💧 ${food.fat}g</span>
                    </div>
                    <div class="food-bottom-row">
                        <span class="food-price">${formatVND(food.price)}</span>
                        <div class="food-actions">
                            
                            <button class="add-to-cart-btn" data-food-id="${food.id}">+ Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");

        $all(".add-to-cart-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                addFoodToCart(btn.dataset.foodId);
            });
        });
        $all(".food-detail-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                openFoodDetail(btn.dataset.foodId);
            });
        });
        // Click cả card cũng mở detail
        $all(".food-item-card").forEach(card => {
            card.addEventListener("click", () => openFoodDetail(card.dataset.foodId));
        });
    }

    function visualBg(category) {
        const map = {
            bowls: "#fff3e0", salad: "#eafff1", breakfast: "#fff8e1",
            smoothies: "#e8f5ff", vegetarian: "#f1ffe8", snacks: "#fdf0ff"
        };
        return map[category] || "#eafff1";
    }

    /* ================= FOOD DETAIL MODAL ================= */
    function openFoodDetail(foodId) {
        const food = FOODS.find(f => f.id === foodId);
        if (!food) return;

        const modal = $("#foodDetailModal");
        const totalMacro = food.protein + food.carbs + food.fat;
        const pPct = Math.round(food.protein / totalMacro * 100);
        const cPct = Math.round(food.carbs   / totalMacro * 100);
        const fPct = Math.round(food.fat     / totalMacro * 100);

        modal.innerHTML = `
            <div class="fdm-content">
                <button class="fdm-close" id="fdmCloseBtn">&times;</button>

                <div class="fdm-hero">
                    ${food.image
                        ? `<img src="${food.image}" alt="${food.name}" class="fdm-img">`
                        : `<div class="fdm-img-placeholder" style="background:${visualBg(food.category)}">${food.icon}</div>`
                    }
                    <div class="fdm-hero-overlay">
                        <span class="fdm-category">${CATEGORIES.find(c => c.id === food.category)?.label || ""}</span>
                        <h2 class="fdm-name">${food.name}</h2>
                        <div class="fdm-meta-row">
                            <span>⏱ ${food.time}</span>
                            <span>🍽 ${food.serving}</span>
                            <span>🔥 ${food.cal} kcal</span>
                        </div>
                    </div>
                </div>

                <div class="fdm-body">
                    <p class="fdm-desc">${food.desc}</p>

                    <!-- MACRO BARS -->
                    <div class="fdm-macros">
                        <h4>Dinh dưỡng</h4>
                        <div class="fdm-macro-grid">
                            <div class="fdm-macro-card protein">
                                <p class="macro-label">Protein</p>
                                <p class="macro-value">${food.protein}g</p>
                                <div class="macro-bar-bg"><div class="macro-bar" style="width:${pPct}%"></div></div>
                                <p class="macro-pct">${pPct}%</p>
                            </div>
                            <div class="fdm-macro-card carbs">
                                <p class="macro-label">Carbs</p>
                                <p class="macro-value">${food.carbs}g</p>
                                <div class="macro-bar-bg"><div class="macro-bar" style="width:${cPct}%"></div></div>
                                <p class="macro-pct">${cPct}%</p>
                            </div>
                            <div class="fdm-macro-card fat">
                                <p class="macro-label">Chất béo</p>
                                <p class="macro-value">${food.fat}g</p>
                                <div class="macro-bar-bg"><div class="macro-bar" style="width:${fPct}%"></div></div>
                                <p class="macro-pct">${fPct}%</p>
                            </div>
                            <div class="fdm-macro-card fiber">
                                <p class="macro-label">Chất xơ</p>
                                <p class="macro-value">${food.fiber}g</p>
                                <div class="macro-bar-bg"><div class="macro-bar" style="width:60%"></div></div>
                                <p class="macro-pct">—</p>
                            </div>
                        </div>
                    </div>

                    <!-- NGUYÊN LIỆU -->
                    <div class="fdm-section">
                        <h4>🧾 Nguyên liệu</h4>
                        <p>${food.ingredients}</p>
                    </div>

                    <!-- CÁCH LÀM -->
                    <div class="fdm-section">
                        <h4>👩‍🍳 Cách chế biến</h4>
                        <p>${food.steps}</p>
                    </div>

                    <!-- ACTION -->
                    <div class="fdm-actions">
                        <span class="fdm-price">${formatVND(food.price)}</span>
                        <button class="primary-btn fdm-add-btn" data-food-id="${food.id}">
                            🛒 Thêm vào giỏ — ${formatVND(food.price)}
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add("active");

        $("#fdmCloseBtn").addEventListener("click", closeFoodDetail);
        modal.addEventListener("click", (e) => { if (e.target === modal) closeFoodDetail(); });
        modal.querySelector(".fdm-add-btn").addEventListener("click", () => {
            addFoodToCart(food.id);
            closeFoodDetail();
        });
    }

    function closeFoodDetail() {
        $("#foodDetailModal").classList.remove("active");
    }

    /* ================= CART LOGIC ================= */
    function addFoodToCart(foodId) {
        const food = FOODS.find(f => f.id === foodId);
        if (!food) return;
        const key = "food_" + food.id;
        const existing = findCartItem(key);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ key, type: "food", refId: food.id, name: food.name, price: food.price, qty: 1, meta: food.cal + " cal", icon: food.icon });
        }
        renderCart();
        bumpCartBadge();
        openCart();
    }

    function addPlanToCart(planId) {
        const plan = PLANS.find(p => p.id === planId);
        if (!plan) return;
        const key = "plan_" + plan.id;
        cart = cart.filter(it => !it.key.startsWith("plan_"));
        cart.push({ key, type: "plan", refId: plan.id, name: plan.label, price: plan.price, qty: 1, meta: plan.days + " ngày", icon: "📦" });
        renderCart();
        bumpCartBadge();
        openCart();
    }

    function changeQty(key, delta) {
        const item = findCartItem(key);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(it => it.key !== key);
        renderCart();
        bumpCartBadge();
    }

    function removeItem(key) {
        cart = cart.filter(it => it.key !== key);
        renderCart();
        bumpCartBadge();
    }

    function cartTotal() { return cart.reduce((sum, it) => sum + it.price * it.qty, 0); }
    function cartCount() { return cart.reduce((sum, it) => sum + it.qty, 0); }

    function bumpCartBadge() {
        const badge = $("#cartBadge");
        const count = cartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }

    function renderCart() {
        const wrap = $("#cartItems");
        if (cart.length === 0) {
            wrap.innerHTML = '<p class="cart-empty">Giỏ hàng đang trống. Hãy chọn một món hoặc gói Meal Plan nhé!</p>';
        } else {
            wrap.innerHTML = cart.map(it => `
                <div class="cart-item">
                    <div class="cart-item-icon">${it.icon}</div>
                    <div class="cart-item-info">
                        <h5>${it.name}</h5>
                        <p class="cart-item-meta">${it.meta}</p>
                        <div class="cart-item-controls">
                            ${it.type === "food" ? `
                                <button class="qty-btn" data-action="dec" data-key="${it.key}">−</button>
                                <span>${it.qty}</span>
                                <button class="qty-btn" data-action="inc" data-key="${it.key}">+</button>
                            ` : `<span>Số lượng: 1</span>`}
                            <span class="cart-item-price">${formatVND(it.price * it.qty)}</span>
                            <button class="cart-item-remove" data-action="remove" data-key="${it.key}">Xoá</button>
                        </div>
                    </div>
                </div>
            `).join("");
        }
        $("#cartTotal").textContent = formatVND(cartTotal());
        $("#checkoutBtn").disabled = cart.length === 0;
        $all('[data-action="inc"]').forEach(b => b.addEventListener("click", () => changeQty(b.dataset.key, 1)));
        $all('[data-action="dec"]').forEach(b => b.addEventListener("click", () => changeQty(b.dataset.key, -1)));
        $all('[data-action="remove"]').forEach(b => b.addEventListener("click", () => removeItem(b.dataset.key)));
    }

    function openCart() { $("#cartDrawer").classList.add("open"); $("#cartOverlay").classList.add("active"); }
    function closeCart() { $("#cartDrawer").classList.remove("open"); $("#cartOverlay").classList.remove("active"); }

    /* ================= MODAL HELPERS ================= */
    function openModal(id)  { $("#" + id).classList.add("active"); }
    function closeModal(id) { $("#" + id).classList.remove("active"); }

    /* ================= MEAL PLAN SUGGESTION ================= */
    function calculateNutrition(profile) {
        const weight = Number(profile.currentWeight), height = Number(profile.height),
              age = Number(profile.age), gender = profile.gender,
              activityLevel = profile.activityLevel, goal = profile.goal;
        let bmr = gender === "female"
            ? 10 * weight + 6.25 * height - 5 * age - 161
            : 10 * weight + 6.25 * height - 5 * age + 5;
        const activityMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
        let calories = bmr * (activityMap[activityLevel] || 1.2);
        if (goal === "lose_weight") calories -= 400;
        if (goal === "gain_weight" || goal === "gain_muscle") calories += 300;
        calories = Math.round(calories);
        return { targetCalories: calories, macros: { protein: Math.round((calories * 0.3) / 4), carbs: Math.round((calories * 0.45) / 4), fat: Math.round((calories * 0.25) / 9) } };
    }

    function recommendPlanByProfile(profile) {
        const diff = Math.abs(Number(profile.currentWeight) - Number(profile.desiredWeight));
        if (diff <= 2) return PLANS[0];
        if (diff <= 5) return PLANS[1];
        return PLANS[2];
    }

    function handleSuggestSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const profile = { height: form.height.value, age: form.age.value, currentWeight: form.currentWeight.value, desiredWeight: form.desiredWeight.value, gender: form.gender.value, activityLevel: form.activityLevel.value, goal: form.goal.value };
        const nutrition = calculateNutrition(profile);
        const plan = recommendPlanByProfile(profile);
        recommendedPlan = plan;
        const goalLabelMap = { lose_weight: "Giảm mỡ", gain_weight: "Tăng cân", gain_muscle: "Tăng cơ", maintain: "Duy trì cân nặng", eat_clean: "Eat clean" };
        const resultBox = $("#suggestResult");
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <h4>Gói gợi ý: ${plan.label}</h4>
            <div class="suggest-stats">
                <div class="suggest-stat">Mục tiêu<br><b>${goalLabelMap[profile.goal] || profile.goal}</b></div>
                <div class="suggest-stat">Calo/ngày<br><b>${nutrition.targetCalories} kcal</b></div>
                <div class="suggest-stat">Protein<br><b>${nutrition.macros.protein} g</b></div>
                <div class="suggest-stat">Carbs<br><b>${nutrition.macros.carbs} g</b></div>
                <div class="suggest-stat">Fat<br><b>${nutrition.macros.fat} g</b></div>
            </div>
            <p class="suggest-result-note">Đây là ước tính nhu cầu dinh dưỡng cơ bản. Đội ngũ NutriBae sẽ xây dựng thực đơn cá nhân hoá và liên hệ với bạn sớm nhất.</p>
            <button type="button" class="suggest-add-btn" id="addRecommendedPlanBtn">Thêm "${plan.label}" vào giỏ hàng</button>
        `;
        $("#addRecommendedPlanBtn").addEventListener("click", () => { addPlanToCart(plan.id); closeModal("suggestModal"); });
    }

    /* ================= CHECKOUT ================= */
    function renderCheckoutSummary() {
        const box = $("#checkoutSummary");
        box.innerHTML = cart.map(it => `
            <div class="checkout-summary-row"><span>${it.name} ${it.type === "food" ? "x" + it.qty : ""}</span><span>${formatVND(it.price * it.qty)}</span></div>
        `).join("") + `<div class="checkout-summary-row checkout-summary-total"><span>Tổng cộng</span><span>${formatVND(cartTotal())}</span></div>`;
    }

    function handleCheckoutSubmit(e) {
        e.preventDefault();
        if (cart.length === 0) return;
        const form = e.target;
        currentOrder = { id: "NB" + Date.now().toString().slice(-8), status: "confirmed", customer: { fullName: form.fullName.value, phone: form.phone.value, address: form.address.value, paymentMethod: form.paymentMethod.value }, items: cart.map(it => ({ ...it })), total: cartTotal() };
        cart = []; renderCart(); bumpCartBadge(); closeCart(); closeModal("checkoutModal"); form.reset();
        renderTracking();
        $("#tracking").style.display = "block";
        $("#navTracking").style.display = "inline-block";
        $("#tracking").scrollIntoView({ behavior: "smooth" });
    }

    const paymentLabelMap = { cod: "Thanh toán khi nhận hàng (COD)", bank_transfer: "Chuyển khoản ngân hàng", ewallet: "Ví điện tử (Momo / ZaloPay)" };

    function renderTracking() {
        if (!currentOrder) return;
        $("#trackingInfo").innerHTML = `
            <div class="ti-block"><p>Mã đơn hàng</p><h4>#${currentOrder.id}</h4></div>
            <div class="ti-block"><p>Khách hàng</p><h4>${currentOrder.customer.fullName} — ${currentOrder.customer.phone}</h4></div>
            <div class="ti-block"><p>Địa chỉ giao hàng</p><h4>${currentOrder.customer.address}</h4></div>
            <div class="ti-block"><p>Phương thức thanh toán</p><h4>${paymentLabelMap[currentOrder.customer.paymentMethod]}</h4></div>
            <div class="ti-block"><p>Số món</p><h4>${currentOrder.items.length} sản phẩm</h4></div>
            <div class="ti-block"><p>Tổng tiền</p><h4>${formatVND(currentOrder.total)}</h4></div>
        `;
        updateTimelineUI();
    }

    function updateTimelineUI() {
        const currentIndex = ORDER_STEPS.indexOf(currentOrder.status);
        $all(".timeline-step").forEach(stepEl => {
            const idx = ORDER_STEPS.indexOf(stepEl.dataset.step);
            stepEl.classList.remove("active", "done");
            if (idx < currentIndex) stepEl.classList.add("done");
            if (idx === currentIndex) stepEl.classList.add("active");
        });
        const btn = $("#demoAdvanceBtn");
        if (currentIndex >= ORDER_STEPS.length - 1) { btn.disabled = true; btn.textContent = "Đơn hàng đã hoàn thành 🎉"; }
        else { btn.disabled = false; btn.textContent = "Demo: cập nhật trạng thái tiếp theo →"; }
    }

    function advanceOrderStatus() {
        if (!currentOrder) return;
        const idx = ORDER_STEPS.indexOf(currentOrder.status);
        if (idx < ORDER_STEPS.length - 1) { currentOrder.status = ORDER_STEPS[idx + 1]; updateTimelineUI(); }
    }

    /* ================= INIT ================= */
    function init() {
        renderPlans(); renderCategories(); renderFoodGrid(); renderCart();
        $("#cartOpenBtn").addEventListener("click", openCart);
        $("#cartCloseBtn").addEventListener("click", closeCart);
        $("#cartOverlay").addEventListener("click", closeCart);
        $("#openSuggestBtn").addEventListener("click", () => openModal("suggestModal"));
        $all(".modal-close").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.close)));
        $("#suggestForm").addEventListener("submit", handleSuggestSubmit);
        $("#checkoutBtn").addEventListener("click", () => { if (cart.length === 0) return; renderCheckoutSummary(); openModal("checkoutModal"); });
        $("#checkoutForm").addEventListener("submit", handleCheckoutSubmit);
        $("#demoAdvanceBtn").addEventListener("click", advanceOrderStatus);
        $all(".food-modal").forEach(modal => { modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); }); });
    }

    document.addEventListener("DOMContentLoaded", init);
})();