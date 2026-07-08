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
            name: "Bowl quinoa rau củ", cal: 320, price: 52000,
            image: "/images/quinoa-bowl.webp", icon: "🌿",
            desc: "Quinoa, rau củ theo mùa, hạt bí, sốt chanh dây.",
            protein: 14, carbs: 46, fat: 8, fiber: 7,
            time: "25 phút", serving: "2 người",
            ingredients: "100g quinoa, 1/2 bí ngòi, 1/2 ớt chuông, cải bó xôi, sốt mè rang",
            steps: "Luộc quinoa → Xào rau củ → Trộn đều và rưới sốt mè"
        },
        {
            id: "f28", category: "bowls",
            name: "Bowl bò áp chảo rau củ",
            cal: 510, price: 72000,
            image: "/images/beef-bowl.jpg", icon: "🥩",
            desc: "Bò áp chảo cùng rau củ và gạo lứt giàu protein.",
            protein: 40, carbs: 45, fat: 16, fiber: 5,
            time: "20 phút", serving: "1 người",
            ingredients: "180g thịt bò, 150g gạo lứt, bông cải xanh, cà rốt, dầu olive",
            steps: "Áp chảo bò 3 phút mỗi mặt → Luộc gạo lứt → Hấp rau củ → Xếp tô và thưởng thức"
        },
        {
            id: "f29", category: "bowls",
            name: "Bowl tôm quinoa",
            cal: 450, price: 70000,
            image: "/images/shrimp-bowl.jpg", icon: "🍤",
            desc: "Tôm áp chảo cùng quinoa và rau xanh.",
            protein: 35, carbs: 42, fat: 10, fiber: 4,
            time: "18 phút", serving: "1 người",
            ingredients: "200g tôm, 100g quinoa, xà lách, cà chua bi, dầu olive",
            steps: "Nấu quinoa → Áp chảo tôm → Trộn rau xanh → Xếp tô và rưới sốt"
        },
        {
            id: "f30", category: "bowls",
            name: "Bowl gà pesto",
            cal: 490, price: 68000,
            image: "/images/pesto-bowl.jpg", icon: "🍗",
            desc: "Ức gà nướng sốt pesto ăn kèm rau củ.",
            protein: 39, carbs: 46, fat: 14, fiber: 5,
            time: "20 phút", serving: "1 người",
            ingredients: "200g ức gà, sốt pesto, bí ngòi, cà chua bi, gạo lứt",
            steps: "Nướng gà → Luộc gạo lứt → Xào rau củ → Trộn cùng sốt pesto"
        },
        {
            id: "f31", category: "bowls",
            name: "Bowl cá ngừ avocado",
            cal: 470, price: 73000,
            image: "/images/tuna-bowl.jpg", icon: "🐟",
            desc: "Cá ngừ tươi kết hợp bơ và rau xanh.",
            protein: 38, carbs: 35, fat: 18, fiber: 6,
            time: "15 phút", serving: "1 người",
            ingredients: "150g cá ngừ, 1/2 quả bơ, rau xà lách, cà chua bi",
            steps: "Áp chảo cá ngừ → Cắt bơ → Trộn rau → Xếp tô và rưới sốt chanh"
        },
        {
            id: "f32", category: "bowls",
            name: "Bowl thịt viên healthy",
            cal: 520, price: 69000,
            image: "/images/meatball-bowl.jpg", icon: "🍖",
            desc: "Thịt viên ít béo cùng cơm gạo lứt và rau củ.",
            protein: 37, carbs: 48, fat: 15, fiber: 5,
            time: "22 phút", serving: "1 người",
            ingredients: "200g thịt bò xay, gạo lứt, bông cải xanh, cà rốt",
            steps: "Nặn thịt viên → Nướng chín → Luộc gạo lứt → Ăn kèm rau củ"
        },
        {
            id: "f33", category: "bowls",
            name: "Bowl đậu hũ nướng",
            cal: 390, price: 58000,
            image: "/images/tofu-bowl.jpg", icon: "🌱",
            desc: "Đậu hũ nướng cùng rau xanh và quinoa.",
            protein: 20, carbs: 40, fat: 10, fiber: 8,
            time: "18 phút", serving: "1 người",
            ingredients: "200g đậu hũ, 80g quinoa, cải bó xôi, cà chua bi",
            steps: "Nướng đậu hũ → Nấu quinoa → Trộn rau xanh → Xếp tô"
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
        {
            id: "f34", category: "salad",
            name: "Salad cá hồi xông khói",
            cal: 320, price: 65000,
            image: "/images/smoked-salmon-salad.jpg", icon: "🐟",
            desc: "Cá hồi xông khói, rau xanh và sốt chanh dầu olive.",
            protein: 28, carbs: 12, fat: 15, fiber: 3,
            time: "15 phút", serving: "1 người",
            ingredients: "100g cá hồi xông khói, xà lách romaine, cà chua bi, dầu olive, chanh",
            steps: "Rửa rau → Xếp cá hồi lên trên → Rưới dầu olive và nước cốt chanh"
        },
        {
            id: "f35", category: "salad",
            name: "Salad Hy Lạp",
            cal: 270, price: 50000,
            image: "/images/greek-salad.jpg", icon: "🧀",
            desc: "Phô mai feta, olive đen và rau củ tươi.",
            protein: 10, carbs: 18, fat: 14, fiber: 4,
            time: "10 phút", serving: "1 người",
            ingredients: "Phô mai feta, cà chua, dưa leo, olive đen, hành tím",
            steps: "Cắt nhỏ rau củ → Trộn đều → Thêm feta và olive → Rưới sốt"
        },
        {
            id: "f36", category: "salad",
            name: "Salad tôm bơ",
            cal: 290, price: 58000,
            image: "/images/shrimp-avocado-salad.jpg", icon: "🍤",
            desc: "Tôm áp chảo và bơ tươi giàu chất béo tốt.",
            protein: 24, carbs: 10, fat: 16, fiber: 4,
            time: "15 phút", serving: "1 người",
            ingredients: "150g tôm, 1/2 quả bơ, xà lách, cà chua bi",
            steps: "Áp chảo tôm → Cắt bơ → Trộn rau → Xếp topping và rưới sốt"
        },
        {
            id: "f37", category: "salad",
            name: "Salad trứng luộc rau xanh",
            cal: 260, price: 45000,
            image: "/images/egg-salad.jpg", icon: "🥚",
            desc: "Trứng luộc kết hợp rau xanh và sốt mè rang.",
            protein: 18, carbs: 12, fat: 14, fiber: 3,
            time: "12 phút", serving: "1 người",
            ingredients: "2 quả trứng, xà lách, dưa leo, sốt mè rang",
            steps: "Luộc trứng → Cắt đôi → Trộn rau → Chan sốt mè rang"
        },
        {
            id: "f38", category: "salad",
            name: "Salad Caesar Healthy",
            cal: 340, price: 55000,
            image: "/images/caesar-salad.jpg", icon: "🥗",
            desc: "Phiên bản Caesar ít béo với ức gà nướng.",
            protein: 30, carbs: 15, fat: 12, fiber: 4,
            time: "18 phút", serving: "1 người",
            ingredients: "150g ức gà, xà lách romaine, phô mai parmesan, bánh mì nguyên cám",
            steps: "Nướng gà → Cắt lát → Trộn cùng rau → Rắc parmesan và bánh mì nướng"
        },
        {
            id: "f39", category: "salad",
            name: "Salad dâu tây óc chó",
            cal: 240, price: 48000,
            image: "/images/strawberry-salad.jpg", icon: "🍓",
            desc: "Dâu tây tươi kết hợp hạt óc chó và rau xanh.",
            protein: 6, carbs: 22, fat: 12, fiber: 5,
            time: "10 phút", serving: "1 người",
            ingredients: "Dâu tây, xà lách, hạt óc chó, mật ong, chanh",
            steps: "Cắt dâu tây → Trộn rau → Thêm óc chó → Rưới sốt mật ong chanh"
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
        {
            id: "f40", category: "breakfast",
            name: "Bánh mì bơ đậu phộng chuối",
            cal: 350, price: 38000,
            image: "/images/peanut-butter-toast.jpg", icon: "🍞",
            desc: "Bánh mì nguyên cám với bơ đậu phộng và chuối.",
            protein: 14, carbs: 42, fat: 12, fiber: 5,
            time: "8 phút", serving: "1 người",
            ingredients: "2 lát bánh mì nguyên cám, 2 thìa bơ đậu phộng, 1 quả chuối",
            steps: "Nướng bánh mì → Phết bơ đậu phộng → Xếp chuối cắt lát lên trên"
        },
        {
            id: "f41", category: "breakfast",
            name: "Trứng bác rau củ",
            cal: 290, price: 40000,
            image: "/images/scrambled-eggs.jpg", icon: "🍳",
            desc: "Trứng bác mềm cùng rau củ nhiều vitamin.",
            protein: 18, carbs: 18, fat: 14, fiber: 3,
            time: "12 phút", serving: "1 người",
            ingredients: "3 quả trứng, cà chua, hành tây, cải bó xôi",
            steps: "Đánh trứng → Xào rau củ → Cho trứng vào đảo đều đến chín"
        },
        {
            id: "f42", category: "breakfast",
            name: "Cháo yến mạch gà xé",
            cal: 330, price: 42000,
            image: "/images/oatmeal-chicken.jpg", icon: "🍲",
            desc: "Cháo yến mạch và ức gà giàu protein.",
            protein: 25, carbs: 32, fat: 7, fiber: 4,
            time: "15 phút", serving: "1 người",
            ingredients: "60g yến mạch, 100g ức gà, hành lá",
            steps: "Luộc gà → Xé nhỏ → Nấu cùng yến mạch đến khi sánh"
        },
        {
            id: "f43", category: "breakfast",
            name: "Bánh mì cá ngừ healthy",
            cal: 360, price: 45000,
            image: "/images/tuna-toast.jpg", icon: "🐟",
            desc: "Cá ngừ kết hợp bánh mì nguyên cám.",
            protein: 26, carbs: 34, fat: 10, fiber: 4,
            time: "10 phút", serving: "1 người",
            ingredients: "2 lát bánh mì nguyên cám, cá ngừ hộp, xà lách",
            steps: "Nướng bánh mì → Trộn cá ngừ → Kẹp cùng rau xanh"
        },
        {
            id: "f44", category: "breakfast",
            name: "Smoothie bowl trái cây",
            cal: 310, price: 42000,
            image: "/images/smoothie-bowl.jpg", icon: "🍓",
            desc: "Smoothie đặc ăn cùng granola và trái cây.",
            protein: 10, carbs: 50, fat: 6, fiber: 7,
            time: "10 phút", serving: "1 người",
            ingredients: "Chuối, dâu tây, granola, sữa chua Hy Lạp",
            steps: "Xay trái cây → Đổ ra tô → Thêm granola và topping"
        },
        {
            id: "f45", category: "breakfast",
            name: "Khoai lang trứng luộc",
            cal: 280, price: 35000,
            image: "/images/sweet-potato-egg.jpg", icon: "🍠",
            desc: "Bữa sáng đơn giản, giàu dinh dưỡng và no lâu.",
            protein: 14, carbs: 36, fat: 6, fiber: 5,
            time: "15 phút", serving: "1 người",
            ingredients: "200g khoai lang, 2 quả trứng",
            steps: "Luộc khoai lang → Luộc trứng → Thưởng thức cùng nhau"
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
            {
            id: "f46", category: "smoothies",
            name: "Smoothie dâu tây chuối",
            cal: 210, price: 36000,
            image: "/images/strawberry-banana-smoothie.jpg", icon: "🍓",
            desc: "Dâu tây và chuối ngọt tự nhiên, giàu vitamin C.",
            protein: 5, carbs: 42, fat: 2, fiber: 4,
            time: "5 phút", serving: "1 người",
            ingredients: "100g dâu tây, 1 quả chuối, 200ml sữa hạt",
            steps: "Cho tất cả nguyên liệu vào máy xay → Xay mịn → Thưởng thức"
        },
        {
            id: "f47", category: "smoothies",
            name: "Smoothie việt quất sữa chua",
            cal: 230, price: 39000,
            image: "/images/blueberry-yogurt-smoothie.jpg", icon: "🫐",
            desc: "Việt quất kết hợp sữa chua Hy Lạp giàu chất chống oxy hóa.",
            protein: 10, carbs: 35, fat: 4, fiber: 5,
            time: "5 phút", serving: "1 người",
            ingredients: "100g việt quất, 150g sữa chua Hy Lạp, đá viên",
            steps: "Cho nguyên liệu vào máy xay → Xay nhuyễn → Rót ra ly"
        },
        {
            id: "f48", category: "smoothies",
            name: "Smoothie dứa cam nhiệt đới",
            cal: 190, price: 35000,
            image: "/images/tropical-smoothie.jpg", icon: "🍍",
            desc: "Dứa và cam tươi mát, bổ sung vitamin C.",
            protein: 3, carbs: 40, fat: 1, fiber: 4,
            time: "5 phút", serving: "1 người",
            ingredients: "100g dứa, 1 quả cam, đá viên",
            steps: "Ép cam → Xay cùng dứa và đá → Rót ra ly"
        },
        {
            id: "f49", category: "smoothies",
            name: "Smoothie chocolate protein",
            cal: 260, price: 42000,
            image: "/images/chocolate-protein-smoothie.jpg", icon: "🍫",
            desc: "Sinh tố protein vị chocolate dành cho người tập luyện.",
            protein: 28, carbs: 24, fat: 6, fiber: 3,
            time: "7 phút", serving: "1 người",
            ingredients: "1 muỗng whey chocolate, 200ml sữa hạt, 1/2 quả chuối",
            steps: "Cho tất cả vào máy xay → Xay mịn → Uống sau khi tập"
        },
        {
            id: "f50", category: "smoothies",
            name: "Smoothie kiwi táo xanh",
            cal: 180, price: 37000,
            image: "/images/kiwi-apple-smoothie.jpg", icon: "🥝",
            desc: "Kiwi và táo xanh giúp thanh mát và hỗ trợ tiêu hóa.",
            protein: 3, carbs: 36, fat: 1, fiber: 5,
            time: "5 phút", serving: "1 người",
            ingredients: "2 quả kiwi, 1 quả táo xanh, 150ml nước lọc",
            steps: "Gọt vỏ kiwi → Cắt táo → Xay cùng nước → Thưởng thức"
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
        {
            id: "f51", category: "vegetarian",
            name: "Nấm đùi gà nướng thảo mộc",
            cal: 280, price: 48000,
            image: "/images/herb-mushroom.jpg", icon: "🍄",
            desc: "Nấm đùi gà nướng cùng thảo mộc và rau củ.",
            protein: 12, carbs: 24, fat: 10, fiber: 5,
            time: "20 phút", serving: "1 người",
            ingredients: "200g nấm đùi gà, rosemary, dầu olive, bí ngòi",
            steps: "Ướp nấm với thảo mộc → Nướng 180°C 15 phút → Ăn kèm rau củ"
        },
        {
            id: "f52", category: "vegetarian",
            name: "Mì Ý sốt cà chua chay",
            cal: 390, price: 52000,
            image: "/images/vegan-pasta.jpg", icon: "🍝",
            desc: "Mì Ý nguyên cám với sốt cà chua và rau củ.",
            protein: 14, carbs: 58, fat: 9, fiber: 7,
            time: "25 phút", serving: "1 người",
            ingredients: "100g mì nguyên cám, cà chua, hành tây, nấm",
            steps: "Luộc mì → Nấu sốt cà chua → Trộn đều và thưởng thức"
        },
        {
            id: "f53", category: "vegetarian",
            name: "Đậu hũ sốt nấm",
            cal: 340, price: 50000,
            image: "/images/tofu-mushroom.jpg", icon: "🧈",
            desc: "Đậu hũ non sốt nấm thơm ngon, giàu đạm thực vật.",
            protein: 18, carbs: 26, fat: 12, fiber: 4,
            time: "18 phút", serving: "1 người",
            ingredients: "200g đậu hũ non, nấm đông cô, nước tương",
            steps: "Áp chảo đậu hũ → Xào nấm → Chan sốt lên đậu hũ"
        },
        {
            id: "f54", category: "vegetarian",
            name: "Burger chay đậu đen",
            cal: 410, price: 55000,
            image: "/images/blackbean-burger.jpg", icon: "🍔",
            desc: "Burger đậu đen ăn kèm rau xanh tươi mát.",
            protein: 20, carbs: 48, fat: 12, fiber: 8,
            time: "25 phút", serving: "1 người",
            ingredients: "Đậu đen nghiền, bánh burger nguyên cám, rau xà lách",
            steps: "Tạo hình patty đậu đen → Áp chảo → Kẹp cùng bánh và rau"
        },
        {
            id: "f55", category: "vegetarian",
            name: "Cơm gạo lứt rau củ áp chảo",
            cal: 360, price: 50000,
            image: "/images/brown-rice-veggie.jpg", icon: "🍚",
            desc: "Cơm gạo lứt cùng rau củ áp chảo ít dầu.",
            protein: 10, carbs: 56, fat: 8, fiber: 6,
            time: "20 phút", serving: "1 người",
            ingredients: "Gạo lứt, bông cải xanh, cà rốt, bắp non",
            steps: "Nấu cơm → Áp chảo rau củ → Trộn đều và dùng nóng"
        },
        {
            id: "f56", category: "vegetarian",
            name: "Soup bí đỏ hạt bí",
            cal: 240, price: 45000,
            image: "/images/pumpkin-soup.jpg", icon: "🎃",
            desc: "Soup bí đỏ mịn thơm, bổ sung vitamin A.",
            protein: 6, carbs: 34, fat: 7, fiber: 5,
            time: "20 phút", serving: "1 người",
            ingredients: "300g bí đỏ, sữa hạt, hạt bí rang",
            steps: "Luộc bí đỏ → Xay nhuyễn → Nấu cùng sữa hạt → Rắc hạt bí"
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
            name: "Bánh gạo lứt bơ hạnh nhân", cal: 170, price: 29000,
            image: "/images/rice-cake-almond-butter.webp", icon: "🍘",
            desc: "Bánh gạo lứt giòn kết hợp bơ hạnh nhân giàu năng lượng.",
            protein: 6, carbs: 20, fat: 7, fiber: 3,
            time: "3 phút", serving: "2 bánh",
            ingredients: "2 bánh gạo lứt, 1 thìa bơ hạnh nhân, hạt chia",
            steps: "Phết bơ hạnh nhân lên bánh gạo lứt → Rắc hạt chia → Dùng ngay"
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
        },
        {
            id: "f57", category: "snacks",
            name: "Bắp rang rong biển",
            cal: 140, price: 25000,
            image: "/images/seaweed-popcorn.jpg", icon: "🍿",
            desc: "Bắp rang ít dầu kết hợp rong biển giàu khoáng chất.",
            protein: 4, carbs: 24, fat: 3, fiber: 3,
            time: "8 phút", serving: "1 gói",
            ingredients: "50g hạt bắp, rong biển vụn, dầu olive",
            steps: "Làm nổ bắp → Trộn rong biển → Đóng gói dùng ngay"
        },
        {
            id: "f58", category: "snacks",
            name: "Chuối sấy mật ong",
            cal: 170, price: 26000,
            image: "/images/honey-banana-chips.jpg", icon: "🍌",
            desc: "Chuối sấy giòn ngọt nhẹ từ mật ong tự nhiên.",
            protein: 2, carbs: 38, fat: 2, fiber: 3,
            time: "15 phút", serving: "1 gói",
            ingredients: "Chuối chín, mật ong nguyên chất",
            steps: "Cắt lát chuối → Phết mật ong → Sấy đến giòn"
        },
        {
            id: "f59", category: "snacks",
            name: "Pudding hạt chia",
            cal: 180, price: 30000,
            image: "/images/chia-pudding.jpg", icon: "🥛",
            desc: "Hạt chia ngâm sữa hạt cùng trái cây tươi.",
            protein: 6, carbs: 22, fat: 8, fiber: 7,
            time: "10 phút",
            serving: "1 hũ",
            ingredients: "Hạt chia, sữa hạnh nhân, dâu tây, việt quất",
            steps: "Ngâm hạt chia qua đêm → Thêm trái cây → Dùng lạnh"
        },
        {
            id: "f60", category: "snacks",
            name: "Táo sấy quế",
            cal: 150, price: 27000,
            image: "/images/apple-chips.jpg", icon: "🍎",
            desc: "Táo sấy giòn cùng bột quế thơm tự nhiên.",
            protein: 1, carbs: 34, fat: 1, fiber: 4,
            time: "12 phút",
            serving: "1 gói",
            ingredients: "Táo đỏ, bột quế",
            steps: "Cắt lát táo → Rắc quế → Sấy giòn"
        },
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
    let searchKeyword = "";
    const ORDER_STEPS = ["confirmed", "preparing", "delivering", "done"];
    const ORDER_STATUS_LABELS = {
        confirmed: "Đã xác nhận",
        preparing: "Đang chuẩn bị",
        delivering: "Đang giao",
        done: "Hoàn thành",
        cancelled: "Đã hủy"
    };

    /* ================= HELPERS ================= */
    function formatVND(n) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; }
    function $(sel)    { return document.querySelector(sel); }
    function $all(sel) { return Array.from(document.querySelectorAll(sel)); }
    function findCartItem(key) { return cart.find(it => it.key === key); }

    function normalizeSearchText(value = "") {
        return String(value)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase()
            .trim();
    }

    function getCategoryLabel(categoryId) {
        return CATEGORIES.find(category => category.id === categoryId)?.label || "";
    }

    function matchesFoodSearch(food, keyword) {
        const searchTerms = normalizeSearchText(keyword)
            .split(/\s+/)
            .filter(Boolean);

        if (searchTerms.length === 0) {
            return true;
        }

        const searchableContent = normalizeSearchText([
            food.name,
            getCategoryLabel(food.category),
            food.category,
            food.desc,
            food.ingredients,
            food.steps
        ].join(" "));

        // Every entered word must appear somewhere in the searchable content.
        return searchTerms.every(term => searchableContent.includes(term));
    }

    function getAuthToken() {
        // Supports both the old login key and the standardized NutriBae key.
        return (
            localStorage.getItem("nutribaeToken") ||
            localStorage.getItem("nutribae_token") ||
            localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            ""
        );
    }

    async function apiRequest(url, options = {}) {
        const headers = { ...(options.headers || {}) };
        const token = getAuthToken();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (options.body && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, { ...options, headers });

        let data = {};
        try {
            data = await response.json();
        } catch (_) {
            // The API may return an empty response body.
        }

        if (!response.ok) {
            throw new Error(data.message || "Không thể xử lý yêu cầu");
        }

        return data;
    }

    function showOrderMessage(message) {
        window.alert(message);
    }

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
        if (!grid) return;

        let foodList = currentCategory === "all"
            ? [...FOODS]
            : FOODS.filter(food => food.category === currentCategory);

        foodList = foodList.filter(food => matchesFoodSearch(food, searchKeyword));

        const searchStatus = $("#foodSearchStatus");
        const clearSearchButton = $("#clearFoodSearchBtn");
        const keyword = searchKeyword.trim();

        if (clearSearchButton) {
            clearSearchButton.hidden = !keyword;
        }

        if (searchStatus) {
            searchStatus.textContent = keyword
                ? `Tìm thấy ${foodList.length} món phù hợp với từ khóa “${keyword}”.`
                : "";
        }

        if (foodList.length === 0) {
            grid.innerHTML = `
                <div class="food-empty-state">
                    <strong>Không tìm thấy món phù hợp</strong>
                    <span>Hãy thử tên món, nguyên liệu hoặc chọn danh mục khác nhé.</span>
                </div>
            `;
            return;
        }

        grid.innerHTML = foodList.map(food => `
            <div class="food-item-card" data-food-id="${food.id}">
                <div class="food-visual-wrap">
                    ${food.image
                        ? `<img src="${food.image}" alt="${food.name}" class="food-visual-img" loading="lazy">`
                        : `<div class="food-visual-emoji" style="background:${visualBg(food.category)}">${food.icon}</div>`
                    }
                    <span class="food-cat-badge">${CATEGORIES.find(category => category.id === food.category)?.icon || ""}</span>
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
                            <button
                                class="add-to-cart-btn"
                                data-food-id="${food.id}"
                                type="button"
                            >
                                + Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");

        $all(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();
                addFoodToCart(button.dataset.foodId);
            });
        });

        $all(".food-item-card").forEach(card => {
            card.addEventListener("click", () => {
                openFoodDetail(card.dataset.foodId);
            });
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

    async function handleCheckoutSubmit(e) {
        e.preventDefault();
        if (cart.length === 0) return;
        const token = getAuthToken();

        if (!token) {
            showOrderMessage("Vui lòng đăng nhập trước khi đặt hàng để NutriBae lưu đơn hàng của bạn.");
            window.location.href = "../login_process/login.html";
            return;
        }

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = "Đang tạo đơn hàng...";

        try {
            const result = await apiRequest("/api/orders", {
                method: "POST",
                body: JSON.stringify({
                    fullName: form.fullName.value.trim(),
                    phone: form.phone.value.trim(),
                    address: form.address.value.trim(),
                    paymentMethod: form.paymentMethod.value,
                    items: cart.map(item => ({
                        key: item.key,
                        type: item.type,
                        refId: item.refId,
                        name: item.name,
                        price: item.price,
                        qty: item.qty,
                        meta: item.meta,
                        icon: item.icon
                    }))
                })
            });

            currentOrder = result.order;
            cart = [];
            renderCart();
            bumpCartBadge();
            closeCart();
            closeModal("checkoutModal");
            form.reset();
            renderTracking();
            $("#tracking").style.display = "block";
            $("#navTracking").style.display = "inline-block";
            $("#tracking").scrollIntoView({ behavior: "smooth" });
            showOrderMessage(`Đặt hàng thành công! Mã đơn của bạn là #${currentOrder.orderCode}.`);
        } catch (error) {
            showOrderMessage(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Xác nhận đặt hàng";
        }
    }

    const paymentLabelMap = { cod: "Thanh toán khi nhận hàng (COD)", bank_transfer: "Chuyển khoản ngân hàng", ewallet: "Ví điện tử (Momo / ZaloPay)" };

    function renderTracking() {
        if (!currentOrder) return;
        const itemCount = (currentOrder.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
        $("#trackingInfo").innerHTML = `
            <div class="ti-block"><p>Mã đơn hàng</p><h4>#${currentOrder.orderCode || currentOrder.id}</h4></div>
            <div class="ti-block"><p>Khách hàng</p><h4>${currentOrder.customer.fullName} — ${currentOrder.customer.phone}</h4></div>
            <div class="ti-block"><p>Địa chỉ giao hàng</p><h4>${currentOrder.customer.address}</h4></div>
            <div class="ti-block"><p>Phương thức thanh toán</p><h4>${paymentLabelMap[currentOrder.paymentMethod] || currentOrder.paymentMethod}</h4></div>
            <div class="ti-block"><p>Số món</p><h4>${itemCount} sản phẩm</h4></div>
            <div class="ti-block"><p>Tổng tiền</p><h4>${formatVND(currentOrder.total)}</h4></div>
        `;
        updateTimelineUI();
    }

    function updateTimelineUI() {
        const currentIndex = ORDER_STEPS.indexOf(currentOrder.status);
        $all(".timeline-step").forEach(stepEl => {
            const idx = ORDER_STEPS.indexOf(stepEl.dataset.step);
            stepEl.classList.remove("active", "done");
            if (currentOrder.status === "cancelled") return;
            if (idx < currentIndex) stepEl.classList.add("done");
            if (idx === currentIndex) stepEl.classList.add("active");
        });
        const btn = $("#demoAdvanceBtn");
        btn.disabled = false;
        btn.textContent = currentOrder.status === "cancelled"
            ? "Đơn hàng đã bị hủy — Làm mới"
            : `Làm mới trạng thái: ${ORDER_STATUS_LABELS[currentOrder.status] || currentOrder.status}`;
    }

    async function refreshOrderStatus() {
        const token = getAuthToken();

        if (!token) {
            showOrderMessage("Vui lòng đăng nhập để xem đơn hàng.");
            return;
        }
        try {
            const result = await apiRequest("/api/orders/my/latest");
            if (!result.order) {
                showOrderMessage("Bạn chưa có đơn hàng nào.");
                return;
            }
            currentOrder = result.order;
            renderTracking();
            $("#tracking").style.display = "block";
            $("#navTracking").style.display = "inline-block";
            showOrderMessage("Đã cập nhật trạng thái đơn hàng mới nhất.");
        } catch (error) {
            showOrderMessage(error.message);
        }
    }

    async function loadLatestOrder() {
        const token = getAuthToken();

        if (!token) return;
        try {
            const result = await apiRequest("/api/orders/my/latest");
            if (!result.order) return;
            currentOrder = result.order;
            renderTracking();
            $("#tracking").style.display = "block";
            $("#navTracking").style.display = "inline-block";
        } catch (error) {
            console.warn("Không thể tải đơn hàng gần nhất:", error.message);
        }
    }

    function initializeFoodSearch() {
        const foodSearchInput = $("#foodSearchInput");
        const clearFoodSearchButton = $("#clearFoodSearchBtn");

        if (foodSearchInput) {
            foodSearchInput.addEventListener("input", event => {
                searchKeyword = event.target.value;
                renderFoodGrid();
            });

            foodSearchInput.addEventListener("keydown", event => {
                if (event.key === "Escape") {
                    searchKeyword = "";
                    foodSearchInput.value = "";
                    renderFoodGrid();
                }
            });
        }

        if (clearFoodSearchButton) {
            clearFoodSearchButton.addEventListener("click", () => {
                searchKeyword = "";

                if (foodSearchInput) {
                    foodSearchInput.value = "";
                    foodSearchInput.focus();
                }

                renderFoodGrid();
            });
        }
    }

    /* ================= INIT ================= */
    function init() {
        renderPlans();
        renderCategories();
        renderFoodGrid();
        renderCart();
        initializeFoodSearch();

        $("#cartOpenBtn").addEventListener("click", openCart);
        $("#cartCloseBtn").addEventListener("click", closeCart);
        $("#cartOverlay").addEventListener("click", closeCart);
        $("#openSuggestBtn").addEventListener("click", () => openModal("suggestModal"));
        $all(".modal-close").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.close)));
        $("#suggestForm").addEventListener("submit", handleSuggestSubmit);
        $("#checkoutBtn").addEventListener("click", () => { if (cart.length === 0) return; renderCheckoutSummary(); openModal("checkoutModal"); });
        $("#checkoutForm").addEventListener("submit", handleCheckoutSubmit);
        $("#demoAdvanceBtn").addEventListener("click", refreshOrderStatus);
        $all(".food-modal").forEach(modal => { modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); }); });
        loadLatestOrder();
    }

    document.addEventListener("DOMContentLoaded", init);
})();