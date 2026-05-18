-- SQL script để tạo bảng lưu lịch sử chat với Doctor AI
-- Chạy script này trong MySQL để tạo bảng (optional - nếu muốn lưu lịch sử)

CREATE TABLE IF NOT EXISTS doctor_ai_chat_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  elderly_id INT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  condition_name VARCHAR(255) NULL,
  severity VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_elderly_id (elderly_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (elderly_id) REFERENCES elderly_users(elderly_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

