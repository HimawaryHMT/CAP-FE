import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

import authRouter from "./src/routers/authRouter.js";
import Them_Ban_Ghi from "./src/routers/CanNangVaBMI/Them_Ban_Ghi.js";
import fallEventRoutes from "./src/routers/fallEventRoutes.js";
import doctorAIRouter from "./src/routers/doctorAIRouter.js";
import waterIntakeRouter from "./src/routers/waterIntakeRouter.js";

dotenv.config();

// ===================== CONFIG PATH =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================== CONFIG CAMERA =====================
const RTSP_URL = "rtsp://admin:LFDJPI@192.168.207.45:554/ch1/sub"; 
const HLS_OUTPUT_DIR = path.join(__dirname, "hls", "cam1");

// ===================== EXPRESS APP =====================
const app = express();
app.use(cors());
app.use(express.json());

// ===================== SOCKET.IO SETUP =====================
// 🔥 phải tạo HTTP server để gắn socket.io
const server = http.createServer(app);

// 🔥 socket.io server chung
const io = new Server(server, {
  cors: {
    origin: "*", // Dành cho Expo Go / Emulator
    credentials: true,
  },
});

// 🔥 middleware: gắn io vào req để controller dùng emit
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 🔌 Khi có client kết nối vào socket
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ===================== ROUTES =====================
app.use("/api/auth", authRouter);
app.use("/api/CanNangVaBMI", Them_Ban_Ghi);
app.use("/api/fall-events", fallEventRoutes);
app.use("/api/doctor-ai", doctorAIRouter);
app.use("/api/water-intake", waterIntakeRouter);

// serve HLS (m3u8 + .ts) với CORS headers
app.use("/hls", (req, res, next) => {
  // Set CORS headers cho HLS files
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  
  // Set content type cho m3u8 files
  if (req.path.endsWith('.m3u8')) {
    res.header("Content-Type", "application/vnd.apple.mpegurl");
  } else if (req.path.endsWith('.ts')) {
    res.header("Content-Type", "video/mp2t");
  }
  
  next();
}, express.static(path.join(__dirname, "hls")));

// ===================== FFmpeg CONVERT RTSP → HLS =====================
let ffmpegProcess = null;

// Đảm bảo thư mục HLS tồn tại
function ensureHlsDirectory() {
  if (!fs.existsSync(HLS_OUTPUT_DIR)) {
    fs.mkdirSync(HLS_OUTPUT_DIR, { recursive: true });
    console.log("✔ Created HLS directory:", HLS_OUTPUT_DIR);
  }
}

function startFFmpeg() {
  ensureHlsDirectory();
  
  const hlsOutputPath = path.join(HLS_OUTPUT_DIR, "index.m3u8");
  console.log("✔ FFmpeg starting: RTSP → HLS...");
  console.log("   Current directory:", __dirname);
  console.log("   RTSP URL:", RTSP_URL);
  console.log("   HLS Output:", hlsOutputPath);
  console.log("   HLS Output (absolute):", path.resolve(hlsOutputPath));

  // Dừng process cũ nếu có
  if (ffmpegProcess) {
    ffmpegProcess.kill();
    ffmpegProcess = null;
  }

  const args = [
    "-rtsp_transport", "tcp",
    "-i", RTSP_URL,
    "-an", // Tắt audio
    "-c:v", "libx264", // Encode video
    "-preset", "ultrafast", // Fastest encoding
    "-tune", "zerolatency", // Zero latency tuning
    "-g", "30", // GOP size nhỏ hơn để giảm delay (30 frames)
    "-keyint_min", "30", // Minimum keyframe interval
    "-sc_threshold", "0", // Disable scene change detection để giảm delay
    "-f", "hls",
    "-hls_time", "1", // Giảm segment duration xuống 1 giây để giảm delay
    "-hls_list_size", "3", // Giảm số segments trong playlist (chỉ giữ 3 segments)
    "-hls_flags", "delete_segments+append_list+independent_segments", // Independent segments cho low latency
    "-hls_segment_type", "mpegts",
    "-hls_segment_filename", path.join(HLS_OUTPUT_DIR, "index%04d.ts"),
    "-hls_start_number_source", "epoch", // Start từ epoch để tránh vấn đề với số segment
    "-fflags", "+genpts", // Generate presentation timestamps
    "-vsync", "cfr", // Constant frame rate
    "-flush_packets", "1", // Flush packets ngay lập tức
    path.join(HLS_OUTPUT_DIR, "index.m3u8"),
  ];

  ffmpegProcess = spawn("ffmpeg", args);

  ffmpegProcess.stdout.on("data", (data) => {
    const output = data.toString();
    if (output.includes("Stream") || output.includes("Duration")) {
      console.log("[FFmpeg stdout]", output.trim());
    }
  });

  ffmpegProcess.stderr.on("data", (data) => {
    const output = data.toString();
    // Chỉ log các thông tin quan trọng, bỏ qua warnings về timestamps
    if (output.includes("error") || output.includes("Error") || output.includes("Connection refused") || output.includes("failed")) {
      console.error("[FFmpeg ERROR]", output.trim());
    } else if (output.includes("Stream mapping") || output.includes("Output") || output.includes("Opening")) {
      // Log đường dẫn file để verify đúng thư mục
      if (output.includes("Opening")) {
        const match = output.match(/Opening '([^']+)'/);
        if (match) {
          console.log("[FFmpeg] Writing to:", match[1]);
        }
      } else {
        console.log("[FFmpeg]", output.trim());
      }
    }
    // Bỏ qua warnings về timestamps (đã fix bằng -fflags +genpts)
  });

  ffmpegProcess.on("close", (code) => {
    console.log("⚠️ FFmpeg STOPPED, exit code =", code);
    ffmpegProcess = null;

    // Chỉ retry nếu không phải là kill manual
    if (code !== 0 && code !== null) {
      console.log("🔄 Retrying FFmpeg in 5 seconds...");
      setTimeout(startFFmpeg, 5000);
    }
  });

  ffmpegProcess.on("error", (error) => {
    console.error("❌ FFmpeg spawn error:", error.message);
    if (error.code === "ENOENT") {
      console.error("⚠️ FFmpeg not found! Please install FFmpeg:");
      console.error("   Windows: https://ffmpeg.org/download.html");
      console.error("   Mac: brew install ffmpeg");
      console.error("   Linux: sudo apt-get install ffmpeg");
    }
  });
}

// ===================== START SERVER =====================
const PORT = process.env.PORT || 5060;

server.listen(PORT, () => {
  console.log(`✔ Server + Socket.io running at http://localhost:${PORT}`);
  console.log(`✔ Current working directory: ${__dirname}`);
  console.log(`✔ HLS output directory: ${HLS_OUTPUT_DIR}`);
  console.log(`✔ HLS stream available at: http://localhost:${PORT}/hls/cam1/index.m3u8`);

  // Đảm bảo thư mục HLS tồn tại trước khi start FFmpeg
  ensureHlsDirectory();
  
  // chạy FFmpeg
  startFFmpeg();
});
