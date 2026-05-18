-- ======================================================================
-- Schema: Elderly Monitoring (MySQL 8+)
-- Engine/charset
-- ======================================================================
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Tạo database (tuỳ chọn)
CREATE DATABASE IF NOT EXISTS elderly_monitoring
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elderly_monitoring;

-- ======================================================================
-- Table: USERs
-- ======================================================================
CREATE TABLE IF NOT EXISTS `USERs` (
  `user_id`       CHAR(36)       NOT NULL,
  `full_name`     VARCHAR(255)   NOT NULL,
  `phone`         VARCHAR(20)    NOT NULL,
  `email`         VARCHAR(255)   NOT NULL,
  `password_hash` VARBINARY(255) NOT NULL,
  `status`        ENUM('active','pending','rejected','inactive') NOT NULL DEFAULT 'inactive',
  `created_at`    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)             DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `pk_USERs` PRIMARY KEY (`user_id`),
  CONSTRAINT `uq_USERs_phone` UNIQUE (`phone`),
  CONSTRAINT `uq_USERs_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- Table: ADMINs
-- ======================================================================
CREATE TABLE IF NOT EXISTS `ADMINs` (
  `admin_id`      CHAR(36)       NOT NULL,
  `full_name`     VARCHAR(255)   NOT NULL,
  `email`         VARCHAR(255)   NOT NULL,
  `password_hash` VARBINARY(255) NOT NULL,
  `created_at`    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)             DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `pk_ADMINs` PRIMARY KEY (`admin_id`),
  CONSTRAINT `uq_ADMINs_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- Table: ELDERLY_USERs  (ver_1: 1 user ↔ 1 elderly nếu cần, bật UNIQUE dưới)
-- ======================================================================
CREATE TABLE IF NOT EXISTS `ELDERLY_USERs` (
  `elderly_id`      CHAR(36)     NOT NULL,
  `user_id`         CHAR(36)     NOT NULL,
  `full_name`       VARCHAR(255) NOT NULL,
  `gender`          ENUM('male','female','other') NOT NULL,
  `birth_day`       DATE         NOT NULL,
  `address`         VARCHAR(255) NOT NULL,
  `medical_history` TEXT,
  `created_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)           DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `pk_ELDERLY_USERs` PRIMARY KEY (`elderly_id`),
  CONSTRAINT `fk_ELDERLY_USERs_user_id_USERs`
    FOREIGN KEY (`user_id`) REFERENCES `USERs`(`user_id`)
    ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Nếu muốn 1–1 giữa USER và ELDERLY ở ver_1, bật UNIQUE này:
-- ALTER TABLE `ELDERLY_USERs` ADD CONSTRAINT `uq_ELDERLY_USERs_user_id` UNIQUE (`user_id`);

-- ======================================================================
-- Table: DEVICEs (thiết bị thuộc user; serial chuẩn hoá để tránh trùng hình thức)
-- ======================================================================
CREATE TABLE IF NOT EXISTS `DEVICEs` (
  `device_id`            CHAR(36)     NOT NULL,
  `device_type`          ENUM('CAMERA','JEWELRY') NOT NULL,
  `serial_number`        VARCHAR(100) NOT NULL,
  -- serial chuẩn hoá: lower(trim()) để unique ổn định
  `serial_norm`          VARCHAR(100)
      GENERATED ALWAYS AS (LOWER(TRIM(`serial_number`))) STORED,
  -- vòng đời sở hữu/đăng ký
  `owner_user_id`        CHAR(36)     DEFAULT NULL,  -- user sở hữu sau khi duyệt
  `requested_by_user_id` CHAR(36)     DEFAULT NULL,  -- ai gửi yêu cầu hiện tại (khi pending)
  `status`               ENUM('active','inactive','pending','rejected') NOT NULL DEFAULT 'pending',
  `created_at`           DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`           DATETIME(3)           DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `pk_DEVICEs` PRIMARY KEY (`device_id`),
  CONSTRAINT `uq_DEVICEs_serial` UNIQUE (`serial_number`),
  CONSTRAINT `uq_DEVICEs_serial_norm` UNIQUE (`serial_norm`),
  CONSTRAINT `fk_DEVICEs_owner`
    FOREIGN KEY (`owner_user_id`) REFERENCES `USERs`(`user_id`)
    ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_DEVICEs_requested_by`
    FOREIGN KEY (`requested_by_user_id`) REFERENCES `USERs`(`user_id`)
    ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `idx_DEVICEs_owner`       ON `DEVICEs` (`owner_user_id`);
CREATE INDEX `idx_DEVICEs_requestedby` ON `DEVICEs` (`requested_by_user_id`);
CREATE INDEX `idx_DEVICEs_status`      ON `DEVICEs` (`status`);

-- ======================================================================
-- Table: DEVICE_REGISTRATIONs (đăng ký/duyệt; trỏ theo device_id, không lưu serial)
-- ======================================================================
CREATE TABLE IF NOT EXISTS `DEVICE_REGISTRATIONs` (
  `reg_id`      CHAR(36)       NOT NULL,
  `user_id`     CHAR(36)       NOT NULL,            -- ai đăng ký
  `device_id`   CHAR(36)       NOT NULL,            -- thiết bị nào
  `status`      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `note`        VARCHAR(255),
  `created_at`  DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reviewed_by` CHAR(36)       DEFAULT NULL,        -- admin duyệt
  `reviewed_at` DATETIME(3)    DEFAULT NULL,
  -- cờ pending để tạo "partial unique" (MySQL không có partial index)
  `is_pending`  TINYINT
      GENERATED ALWAYS AS (CASE WHEN `status`='pending' THEN 1 ELSE NULL END) STORED,
  CONSTRAINT `pk_DEVICE_REGISTRATIONs` PRIMARY KEY (`reg_id`),
  CONSTRAINT `fk_DR_user` FOREIGN KEY (`user_id`) REFERENCES `USERs`(`user_id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_DR_admin` FOREIGN KEY (`reviewed_by`) REFERENCES `ADMINs`(`admin_id`)
    ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_DR_device` FOREIGN KEY (`device_id`) REFERENCES `DEVICEs`(`device_id`)
    ON DELETE RESTRICT ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `idx_DR_device` ON `DEVICE_REGISTRATIONs` (`device_id`);

-- Chặn trùng "đang pending" cho cùng một device (toàn hệ thống)
CREATE UNIQUE INDEX `ux_DR_device_pending`
  ON `DEVICE_REGISTRATIONs` (`device_id`, `is_pending`);

-- Nếu muốn giới hạn "mỗi (user,device) chỉ có 1 pending", dùng cái này thay cho cái trên:
-- CREATE UNIQUE INDEX `ux_DR_user_device_pending`
--   ON `DEVICE_REGISTRATIONs` (`user_id`, `device_id`, `is_pending`);

-- ======================================================================
-- Table: DEVICE_ASSIGNMENTs (lịch sử gán/tháo thiết bị cho user)
-- ======================================================================
CREATE TABLE IF NOT EXISTS `DEVICE_ASSIGNMENTs` (
  `da_id`         CHAR(36)     NOT NULL,
  `device_id`     CHAR(36)     NOT NULL,
  `user_id`       CHAR(36)     NOT NULL,
  `location`      VARCHAR(255),
  `assigned_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `unassigned_at` DATETIME(3)  DEFAULT NULL,
  -- đang active nếu chưa tháo
  `active_device` TINYINT
      GENERATED ALWAYS AS (CASE WHEN `unassigned_at` IS NULL THEN 1 ELSE NULL END) STORED,
  CONSTRAINT `pk_DEVICE_ASSIGNMENTs` PRIMARY KEY (`da_id`),
  CONSTRAINT `fk_DEVICE_ASSIGNMENTs_user`
    FOREIGN KEY (`user_id`) REFERENCES `USERs`(`user_id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_DEVICE_ASSIGNMENTs_device`
    FOREIGN KEY (`device_id`) REFERENCES `DEVICEs`(`device_id`)
    ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT `ck_DEVICE_ASSIGNMENTs_time`
    CHECK (`unassigned_at` IS NULL OR `assigned_at` <= `unassigned_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes cho tra cứu FK & thời gian
CREATE INDEX `idx_DA_device`      ON `DEVICE_ASSIGNMENTs` (`device_id`);
CREATE INDEX `idx_DA_user`        ON `DEVICE_ASSIGNMENTs` (`user_id`);
CREATE INDEX `idx_DA_assigned_at` ON `DEVICE_ASSIGNMENTs` (`assigned_at`);

-- Ràng buộc: mỗi device chỉ có 1 gán active
CREATE UNIQUE INDEX `ux_DA_device_active`
  ON `DEVICE_ASSIGNMENTs` (`device_id`, `active_device`);

-- ======================================================================
-- ======================================================================
-- CanNangVaBMIs
-- ======================================================================
SET NAMES utf8mb4;
CREATE TABLE `CanNangVaBMIs` (
  CNVB_id CHAR(36) PRIMARY KEY ,
  elderly_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  CanNang DECIMAL(5,2) NOT NULL,
  ChieuCao DECIMAL(4,2) NOT NULL,
  BMI DECIMAL(4,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (elderly_id) REFERENCES elderly_users(elderly_id)
);

-- ============================================================================
-- Table: FALL_EVENTs (Lịch sử té ngã)
-- ============================================================================

CREATE TABLE IF NOT EXISTS `FALL_EVENTs` (
  `event_id`     CHAR(36)     NOT NULL,                        -- UUID
  `elderly_id`   CHAR(36)     NOT NULL,                        -- Người bị té ngã
  `device_id`    CHAR(36)     DEFAULT NULL,                    -- Thiết bị phát hiện (camera)
  `detected_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),  -- Thời điểm phát hiện
  `snapshot_url` VARCHAR(500) DEFAULT NULL,                    -- Ảnh lúc té ngã (cloud)
  `video_url`    VARCHAR(500) DEFAULT NULL,                    -- Video lưu cloud (HLS)
  `created_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),  -- Record được tạo lúc
  CONSTRAINT `pk_FALL_EVENTs` PRIMARY KEY (`event_id`),
  CONSTRAINT `fk_FALL_EVENTs_elderly`
      FOREIGN KEY (`elderly_id`)
      REFERENCES `ELDERLY_USERs`(`elderly_id`)
      ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_FALL_EVENTs_device`
      FOREIGN KEY (`device_id`)
      REFERENCES `DEVICEs`(`device_id`)
      ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ============================================================================


CREATE TABLE IF NOT EXISTS doctor_ai_chat_history (
  dt_ai_id char(36) PRIMARY KEY,
  user_id char(36),
  elderly_id char(36),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS water_intake_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id char(36),
  elderly_id char(36),
  amount_ml INT NOT NULL COMMENT 'Lượng nước uống (ml)',
  drink_time DATETIME NOT NULL COMMENT 'Thời gian uống nước',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (elderly_id) REFERENCES elderly_users(elderly_id) ON DELETE SET NULL
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;