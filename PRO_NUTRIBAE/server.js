const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_jwt_secret";

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Do not expose server-side source or dependency folders through static hosting.
app.use(["/server.js", "/package.json", "/package-lock.json"], (req, res) => res.status(404).end());
app.use(express.static(__dirname, { dotfiles: "ignore" }));
app.use("/node_modules", (req, res) => res.status(404).end());

// ================= MODELS =================
const profileSchema = new mongoose.Schema(
    {
        goal: { type: String, trim: true },
        gender: { type: String, enum: ["female", "male", "other", ""], default: "" },
        age: Number,
        height: Number,
        weight: Number,
        activityLevel: { type: String, trim: true },
        targetCalories: Number,
        macros: {
            protein: Number,
            carbs: Number,
            fat: Number
        }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["customer", "admin"], default: "customer" },
        profile: { type: profileSchema, default: {} }
    },
    { timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
    {
        key: { type: String, required: true },
        type: { type: String, enum: ["food", "plan"], required: true },
        refId: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        qty: { type: Number, required: true, min: 1, max: 50 },
        meta: { type: String, default: "" },
        icon: { type: String, default: "" }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderCode: { type: String, required: true, unique: true, index: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        customer: {
            fullName: { type: String, required: true, trim: true },
            email: { type: String, required: true, trim: true, lowercase: true },
            phone: { type: String, required: true, trim: true },
            address: { type: String, required: true, trim: true }
        },
        items: { type: [orderItemSchema], required: true, validate: [(items) => items.length > 0, "Order must have at least one item"] },
        total: { type: Number, required: true, min: 0 },
        paymentMethod: { type: String, enum: ["cod", "bank_transfer", "ewallet"], required: true },
        paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
        status: {
            type: String,
            enum: ["confirmed", "preparing", "delivering", "done", "cancelled"],
            default: "confirmed",
            index: true
        },
        statusHistory: [
            {
                status: { type: String, required: true },
                note: { type: String, default: "" },
                updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                updatedAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);

// ================= HELPERS =================
function createToken(user) {
    return jwt.sign(
        { userId: user._id.toString(), role: user.role || "customer" },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}

function publicUser(user) {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || "customer",
        profile: user.profile || {},
        createdAt: user.createdAt
    };
}

function publicOrder(order) {
    return {
        id: order._id,
        orderCode: order.orderCode,
        customer: order.customer,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        statusHistory: order.statusHistory,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    };
}

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Bạn cần đăng nhập để sử dụng chức năng này" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role || "customer";
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" });
    }
}

async function requireAdmin(req, res, next) {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền truy cập trang quản trị" });
        }
        req.admin = user;
        return next();
    } catch (error) {
        return res.status(500).json({ message: "Không thể xác thực quyền quản trị" });
    }
}

function toOptionalNumber(value) {
    if (value === undefined || value === null || value === "") return undefined;
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
}

function normalizeProfile(input = {}) {
    const profile = {
        goal: typeof input.goal === "string" ? input.goal.trim() : "",
        gender: ["female", "male", "other"].includes(input.gender) ? input.gender : "",
        age: toOptionalNumber(input.age),
        height: toOptionalNumber(input.height),
        weight: toOptionalNumber(input.weight),
        activityLevel: typeof input.activityLevel === "string" ? input.activityLevel.trim() : ""
    };

    Object.keys(profile).forEach((key) => {
        if (profile[key] === undefined) delete profile[key];
    });
    return profile;
}

function canCalculateNutrition(profile) {
    return Number(profile.weight) > 0 && Number(profile.height) > 0 && Number(profile.age) > 0 &&
        ["female", "male"].includes(profile.gender) && Boolean(profile.activityLevel);
}

function calculateNutrition(profile) {
    if (!canCalculateNutrition(profile)) return null;

    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    const activityMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };

    let bmr = profile.gender === "female"
        ? 10 * weight + 6.25 * height - 5 * age - 161
        : 10 * weight + 6.25 * height - 5 * age + 5;

    let calories = bmr * (activityMap[profile.activityLevel] || 1.2);
    if (profile.goal === "lose_weight") calories -= 400;
    if (["gain_weight", "gain_muscle"].includes(profile.goal)) calories += 300;
    calories = Math.max(1200, Math.round(calories));

    return {
        targetCalories: calories,
        macros: {
            protein: Math.round((calories * 0.3) / 4),
            carbs: Math.round((calories * 0.45) / 4),
            fat: Math.round((calories * 0.25) / 9)
        }
    };
}

function mergeAndCalculateProfile(existingProfile = {}, incomingProfile = {}) {
    const merged = { ...existingProfile, ...normalizeProfile(incomingProfile) };
    const nutrition = calculateNutrition(merged);
    if (nutrition) {
        merged.targetCalories = nutrition.targetCalories;
        merged.macros = nutrition.macros;
    }
    return merged;
}

function escapeRegExp(value = "") {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateOrderCode() {
    return `NB${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
}

function normalizeOrderItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Giỏ hàng đang trống");
    }

    return items.map((item) => {
        const price = Number(item.price);
        const qty = Number(item.qty);
        if (!item.key || !item.refId || !item.name || !["food", "plan"].includes(item.type) || !Number.isFinite(price) || price < 0 || !Number.isInteger(qty) || qty < 1 || qty > 50) {
            throw new Error("Dữ liệu món ăn hoặc gói Meal Plan không hợp lệ");
        }
        return {
            key: String(item.key),
            type: item.type,
            refId: String(item.refId),
            name: String(item.name).trim(),
            price,
            qty,
            meta: item.meta ? String(item.meta) : "",
            icon: item.icon ? String(item.icon) : ""
        };
    });
}

async function ensureAdminAccount() {
    // Existing accounts created before the role field was added are normal customers.
    await User.updateMany(
        { $or: [{ role: { $exists: false } }, { role: null }, { role: "" }] },
        { $set: { role: "customer" } }
    );

    const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || "";
    const fullName = process.env.ADMIN_NAME || "NutriBae Administrator";

    if (!email || !password) {
        console.warn("[Admin] ADMIN_EMAIL and ADMIN_PASSWORD are not set. Admin account was not seeded.");
        return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
        if (existing.role !== "admin") {
            existing.role = "admin";
            await existing.save();
        }
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
        fullName,
        email,
        passwordHash,
        role: "admin",
        profile: {}
    });
    console.log(`[Admin] Seeded admin account: ${email}`);
}

// ================= PAGE ROUTES =================
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "page.html")));
app.get("/recipe", (req, res) => res.sendFile(path.join(__dirname, "recipe", "recipe.html")));
app.get("/calorie-tracker", (req, res) => res.sendFile(path.join(__dirname, "calorie-tracker", "calorie.html")));
app.get("/order", (req, res) => res.sendFile(path.join(__dirname, "order_process", "order.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "admin", "admin.html")));

app.get("/api/health", (req, res) => {
    res.json({ message: "NutriBae API is running", mongodb: mongoose.connection.readyState === 1 ? "connected" : "not connected" });
});

// ================= AUTH =================
app.post("/api/auth/register", async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, profile } = req.body;
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const existedUser = await User.findOne({ email: normalizedEmail });
        if (existedUser) return res.status(409).json({ message: "Email này đã được đăng ký" });

        const passwordHash = await bcrypt.hash(password, 10);
        const finalProfile = mergeAndCalculateProfile({}, profile || {});
        const user = await User.create({ fullName, email: normalizedEmail, passwordHash, role: "customer", profile: finalProfile });
        const token = createToken(user);

        return res.status(201).json({ message: "Đăng ký thành công", token, user: publicUser(user) });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "Email này đã được đăng ký" });
        console.error("Register error:", error);
        return res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });

        const user = await User.findOne({ email: String(email).toLowerCase().trim() });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        const token = createToken(user);
        return res.json({ message: "Đăng nhập thành công", token, user: publicUser(user) });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Lỗi server khi đăng nhập" });
    }
});

app.get("/api/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        return res.json({ user: publicUser(user) });
    } catch (error) {
        console.error("Get me error:", error);
        return res.status(500).json({ message: "Lỗi server khi lấy dữ liệu người dùng" });
    }
});

// ================= CUSTOMER ORDER API =================
app.post("/api/orders", requireAuth, async (req, res) => {
    try {
        const { fullName, phone, address, paymentMethod, items } = req.body;
        if (!fullName || !phone || !address || !["cod", "bank_transfer", "ewallet"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Thông tin giao hàng hoặc phương thức thanh toán không hợp lệ" });
        }

        const normalizedItems = normalizeOrderItems(items);
        const total = normalizedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản người dùng" });

        const order = await Order.create({
            orderCode: generateOrderCode(),
            user: user._id,
            customer: { fullName: String(fullName).trim(), email: user.email, phone: String(phone).trim(), address: String(address).trim() },
            items: normalizedItems,
            total,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
            status: "confirmed",
            statusHistory: [{ status: "confirmed", note: "Order created by customer", updatedBy: user._id }]
        });

        return res.status(201).json({ message: "Đặt hàng thành công", order: publicOrder(order) });
    } catch (error) {
        console.error("Create order error:", error);
        return res.status(400).json({ message: error.message || "Không thể tạo đơn hàng" });
    }
});

app.get("/api/orders/my/latest", requireAuth, async (req, res) => {
    try {
        const order = await Order.findOne({ user: req.userId }).sort({ createdAt: -1 });
        return res.json({ order: order ? publicOrder(order) : null });
    } catch (error) {
        console.error("Get latest order error:", error);
        return res.status(500).json({ message: "Không thể tải đơn hàng" });
    }
});

app.get("/api/orders/my", requireAuth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 }).limit(20);
        return res.json({ orders: orders.map(publicOrder) });
    } catch (error) {
        console.error("Get customer orders error:", error);
        return res.status(500).json({ message: "Không thể tải danh sách đơn hàng" });
    }
});

// ================= ADMIN API =================
app.get("/api/admin/dashboard", requireAuth, requireAdmin, async (req, res) => {
    try {
        const [totalOrders, totalCustomers, revenueRows, statusRows, recentOrders] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: "customer" }),
            Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
            Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Order.find().sort({ createdAt: -1 }).limit(5)
        ]);

        const statusCounts = statusRows.reduce((result, row) => {
            result[row._id] = row.count;
            return result;
        }, {});

        return res.json({
            summary: {
                totalOrders,
                totalCustomers,
                totalRevenue: revenueRows[0]?.total || 0,
                statusCounts
            },
            recentOrders: recentOrders.map(publicOrder)
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({ message: "Không thể tải dashboard" });
    }
});

app.get("/api/admin/orders", requireAuth, requireAdmin, async (req, res) => {
    try {
        const { status, search = "" } = req.query;
        const filter = {};
        if (["confirmed", "preparing", "delivering", "done", "cancelled"].includes(status)) filter.status = status;
        if (String(search).trim()) {
            const regex = new RegExp(escapeRegExp(String(search).trim()), "i");
            filter.$or = [
                { orderCode: regex },
                { "customer.fullName": regex },
                { "customer.email": regex },
                { "customer.phone": regex }
            ];
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
        return res.json({ orders: orders.map(publicOrder) });
    } catch (error) {
        console.error("Admin orders error:", error);
        return res.status(500).json({ message: "Không thể tải danh sách đơn hàng" });
    }
});

app.put("/api/admin/orders/:id/status", requireAuth, requireAdmin, async (req, res) => {
    try {
        const { status, paymentStatus, note = "" } = req.body;
        const allowedStatuses = ["confirmed", "preparing", "delivering", "done", "cancelled"];
        const allowedPaymentStatuses = ["pending", "paid", "failed"];
        if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ" });
        if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) return res.status(400).json({ message: "Trạng thái thanh toán không hợp lệ" });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        const statusChanged = order.status !== status;
        order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (statusChanged) order.statusHistory.push({ status, note: String(note).trim(), updatedBy: req.admin._id, updatedAt: new Date() });
        await order.save();

        return res.json({ message: "Cập nhật đơn hàng thành công", order: publicOrder(order) });
    } catch (error) {
        console.error("Update order error:", error);
        return res.status(500).json({ message: "Không thể cập nhật đơn hàng" });
    }
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
    try {
        const { search = "" } = req.query;
        const filter = { role: "customer" };
        if (String(search).trim()) {
            const regex = new RegExp(escapeRegExp(String(search).trim()), "i");
            filter.$or = [{ fullName: regex }, { email: regex }];
        }

        const users = await User.find(filter).select("-passwordHash").sort({ createdAt: -1 }).limit(200);
        return res.json({ users: users.map(publicUser) });
    } catch (error) {
        console.error("Admin users error:", error);
        return res.status(500).json({ message: "Không thể tải danh sách khách hàng" });
    }
});

app.get("/api/admin/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, role: "customer" }).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(20);
        return res.json({ user: publicUser(user), orders: orders.map(publicOrder) });
    } catch (error) {
        console.error("Admin user detail error:", error);
        return res.status(500).json({ message: "Không thể tải thông tin khách hàng" });
    }
});

app.put("/api/admin/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, role: "customer" });
        if (!user) return res.status(404).json({ message: "Không tìm thấy khách hàng" });

        const { fullName, email, profile } = req.body;
        if (fullName) user.fullName = String(fullName).trim();
        if (email) {
            const normalizedEmail = String(email).toLowerCase().trim();
            const duplicated = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
            if (duplicated) return res.status(409).json({ message: "Email này đã được sử dụng bởi tài khoản khác" });
            user.email = normalizedEmail;
        }
        if (profile && typeof profile === "object") user.profile = mergeAndCalculateProfile(user.profile || {}, profile);

        await user.save();
        return res.json({ message: "Cập nhật khách hàng thành công", user: publicUser(user) });
    } catch (error) {
        console.error("Update user error:", error);
        return res.status(500).json({ message: "Không thể cập nhật khách hàng" });
    }
});

// ================= CHAT ROUTES =================
// Keep the existing chatbot integration if this file is present in your project.
try {
    app.use("/api/chat", require("./chatbot/chatRoutes"));
} catch (error) {
    console.warn("[Chat] chatbot/chatRoutes.js was not loaded:", error.message);
}

// ================= START SERVER =================
async function startServer() {
    try {
        if (!MONGODB_URI) {
            console.error("MongoDB Connection Error: MONGODB_URI is undefined. Check your .env file.");
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB Connected Successfully");
        await ensureAdminAccount();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
        });
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

startServer();
