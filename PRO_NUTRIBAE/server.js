const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "nutribae_secret";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép mở HTML/CSS/JS trong thư mục PRO_NUTRIBAE
app.use(express.static(__dirname));

// ================= USER MODEL =================

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        profile: {
            goal: String,
            gender: String,
            age: Number,
            height: Number,
            weight: Number,
            activityLevel: String,
            targetCalories: Number,
            macros: {
                protein: Number,
                carbs: Number,
                fat: Number
            }
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

// ================= HELPER =================

function createToken(user) {
    return jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}

function publicUser(user) {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt
    };
}

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Chưa đăng nhập"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Token không hợp lệ"
        });
    }
}

function calculateNutrition(profile) {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    const gender = profile.gender;
    const activityLevel = profile.activityLevel;
    const goal = profile.goal;

    let bmr;

    if (gender === "female") {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    }

    const activityMap = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725
    };

    let calories = bmr * (activityMap[activityLevel] || 1.2);

    if (goal === "lose_weight") {
        calories -= 400;
    }

    if (goal === "gain_weight" || goal === "gain_muscle") {
        calories += 300;
    }

    calories = Math.round(calories);

    return {
        targetCalories: calories,
        macros: {
            protein: Math.round((calories * 0.3) / 4),
            carbs: Math.round((calories * 0.45) / 4),
            fat: Math.round((calories * 0.25) / 9)
        }
    };
}

// ================= ROUTES =================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "page.html"));
});

app.get("/api/health", (req, res) => {
    res.json({
        message: "NutriBae API is running",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "not connected"
    });
});

// Đăng ký + lưu thông số cơ thể
app.post("/api/auth/register", async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            confirmPassword,
            profile
        } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Mật khẩu xác nhận không khớp"
            });
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(409).json({
                message: "Email này đã được đăng ký"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nutrition = calculateNutrition(profile || {});

        const user = await User.create({
            fullName,
            email,
            passwordHash,
            profile: {
                ...(profile || {}),
                targetCalories: nutrition.targetCalories,
                macros: nutrition.macros
            }
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            user: publicUser(user)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Lỗi server khi đăng ký"
        });
    }
});

// Đăng nhập
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập email và mật khẩu"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        const token = createToken(user);

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: publicUser(user)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Lỗi server khi đăng nhập"
        });
    }
});

// Lấy dữ liệu user đang đăng nhập
app.get("/api/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            });
        }

        res.json({
            user: publicUser(user)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Lỗi server khi lấy dữ liệu người dùng"
        });
    }
});

// ================= START SERVER =================

async function startServer() {
    try {
        if (!MONGODB_URI) {
            console.error("MongoDB Connection Error: MONGODB_URI is undefined");
            console.error("Kiểm tra lại file .env phải nằm cùng thư mục với server.js");
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server Running On Port ${PORT}`);
            console.log(`Open: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
}

startServer();