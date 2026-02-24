require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE ================= */

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Kousik@SQL1063",
    database: "ProjectX"
});

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB max
});

/* ================= REGISTER - SEND OTP ================= */

app.post("/register-send-otp", upload.single("aadhaar"), async (req, res) => {

    try {
        const { full_name, business_name, address, phone, role, products } = req.body;

        if (!full_name || !phone) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Check if already registered
        const [existing] = await db.query(
            "SELECT * FROM users WHERE phone = ?",
            [phone]
        );

        if (existing.length > 0) {
            return res.json({
                success: false,
                message: "Phone already registered. Please login."
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        const imagePath = req.file ? req.file.path : null;

        await db.query(
            `INSERT INTO users 
            (full_name, business_name, address, phone, role, products, aadhaar_image, otp, otp_expiry, is_verified) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), FALSE)`,
            [full_name, business_name, address, phone, role, products || "", imagePath, otp]
        );

        console.log("==================================");
        console.log("REGISTER OTP for", phone, ":", otp);
        console.log("Image saved at:", imagePath);
        console.log("==================================");

        res.json({ success: true, message: "OTP generated. Check server terminal." });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

/* ================= VERIFY REGISTRATION OTP ================= */

app.post("/register-verify-otp", async (req, res) => {

    try {
        const { phone, otp } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE phone=? AND otp=? AND otp_expiry > NOW()",
            [phone, otp]
        );

        if (rows.length === 0) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        await db.query(
            "UPDATE users SET is_verified = TRUE WHERE phone=?",
            [phone]
        );

        res.json({ success: true, message: "Registration successful!" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

/* ================= LOGIN SEND OTP ================= */

app.post("/login-send-otp", async (req, res) => {

    try {
        const { phone } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE phone=? AND is_verified=TRUE",
            [phone]
        );

        if (rows.length === 0) {
            return res.json({ success: false, message: "You must register first." });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        await db.query(
            "UPDATE users SET otp=?, otp_expiry=DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE phone=?",
            [otp, phone]
        );

        console.log("==================================");
        console.log("LOGIN OTP for", phone, ":", otp);
        console.log("==================================");

        res.json({ success: true, message: "OTP generated. Check server terminal." });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

/* ================= LOGIN VERIFY ================= */

app.post("/login-verify-otp", async (req, res) => {

    try {
        const { phone, otp } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE phone=? AND otp=? AND otp_expiry > NOW()",
            [phone, otp]
        );

        if (rows.length === 0) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        res.json({ success: true, user: rows[0] });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

/* ================= START SERVER ================= */

app.listen(5000, () => {
    console.log("Server running on port 5000");
});