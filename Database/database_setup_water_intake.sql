-- SQL script để tạo bảng lưu lịch sử uống nước
-- Chạy script này trong MySQL để tạo bảng

-- Bảng lưu từng lần uống nước
CREATE TABLE IF NOT EXISTS water_intake_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  elderly_id INT NULL,
  amount_ml INT NOT NULL COMMENT 'Lượng nước uống (ml)',
  drink_time DATETIME NOT NULL COMMENT 'Thời gian uống nước',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_elderly_id (elderly_id),
  INDEX idx_drink_time (drink_time),
  INDEX idx_date (drink_time),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (elderly_id) REFERENCES elderly_users(elderly_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

