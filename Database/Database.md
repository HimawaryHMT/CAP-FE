-- ======================================================================

-- Schema: Elderly Monitoring (MySQL 8+)

-- Engine/charset

-- ======================================================================

SET NAMES utf8mb4;

SET time\_zone = '+00:00';



-- Tạo database (tuỳ chọn)

CREATE DATABASE IF NOT EXISTS elderly\_monitoring

  CHARACTER SET utf8mb4 COLLATE utf8mb4\_unicode\_ci;

USE elderly\_monitoring;



-- ======================================================================

-- Table: USERs

-- ======================================================================

CREATE TABLE IF NOT EXISTS `USERs` (

  `user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`       CHAR(36)       NOT NULL,

  `full\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_name`     VARCHAR(255)   NOT NULL,

  `phone`         VARCHAR(20)    NOT NULL,

  `email`         VARCHAR(255)   NOT NULL,

  `password\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_hash` VARBINARY(255) NOT NULL,

  `status`        ENUM('active','pending','rejected','inactive') NOT NULL DEFAULT 'inactive',

  `created\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`    DATETIME(3)    NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),

  `updated\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`    DATETIME(3)             DEFAULT CURRENT\_TIMESTAMP(3) ON UPDATE CURRENT\_TIMESTAMP(3),

  CONSTRAINT `pk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs` PRIMARY KEY (`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`),

  CONSTRAINT `uq\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_phone` UNIQUE (`phone`),

  CONSTRAINT `uq\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_email` UNIQUE (`email`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- ======================================================================

-- Table: ADMINs

-- ======================================================================

CREATE TABLE IF NOT EXISTS `ADMINs` (

  `admin\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`      CHAR(36)       NOT NULL,

  `full\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_name`     VARCHAR(255)   NOT NULL,

  `email`         VARCHAR(255)   NOT NULL,

  `password\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_hash` VARBINARY(255) NOT NULL,

  `created\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`    DATETIME(3)    NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),

  `updated\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`    DATETIME(3)             DEFAULT CURRENT\_TIMESTAMP(3) ON UPDATE CURRENT\_TIMESTAMP(3),

  CONSTRAINT `pk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ADMINs` PRIMARY KEY (`admin\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`),

  CONSTRAINT `uq\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ADMINs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_email` UNIQUE (`email`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- ======================================================================

-- Table: ELDERLY\_USERs  (ver\_1: 1 user ↔ 1 elderly nếu cần, bật UNIQUE dưới)

-- ======================================================================

CREATE TABLE IF NOT EXISTS `ELDERLY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs` (

  `elderly\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`      CHAR(36)     NOT NULL,

  `user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`         CHAR(36)     NOT NULL,

  `full\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_name`       VARCHAR(255) NOT NULL,

  `gender`          ENUM('male','female','other') NOT NULL,

  `birth\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_day`       DATE         NOT NULL,

  `address`         VARCHAR(255) NOT NULL,

  `medical\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_history` TEXT,

  `created\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`      DATETIME(3)  NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),

  `updated\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`      DATETIME(3)           DEFAULT CURRENT\_TIMESTAMP(3) ON UPDATE CURRENT\_TIMESTAMP(3),

  CONSTRAINT `pk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ELDERLY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs` PRIMARY KEY (`elderly\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`),

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ELDERLY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs`

    FOREIGN KEY (`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`) REFERENCES `USERs`(`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE CASCADE ON UPDATE NO ACTION

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Nếu muốn 1–1 giữa USER và ELDERLY ở ver\_1, bật UNIQUE này:

-- ALTER TABLE `ELDERLY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs` ADD CONSTRAINT `uq\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ELDERLY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_USERs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id` UNIQUE (`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`);



-- ======================================================================

-- Table: DEVICEs (thiết bị thuộc user; serial chuẩn hoá để tránh trùng hình thức)

-- ======================================================================

CREATE TABLE IF NOT EXISTS `DEVICEs` (

  `device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`            CHAR(36)     NOT NULL,

  `device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_type`          ENUM('CAMERA','JEWELRY') NOT NULL,

  `serial\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_number`        VARCHAR(100) NOT NULL,

  -- serial chuẩn hoá: lower(trim()) để unique ổn định

  `serial\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_norm`          VARCHAR(100)

      GENERATED ALWAYS AS (LOWER(TRIM(`serial\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_number`))) STORED,

  -- vòng đời sở hữu/đăng ký

  `owner\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`        CHAR(36)     DEFAULT NULL,  -- user sở hữu sau khi duyệt

  `requested\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id` CHAR(36)     DEFAULT NULL,  -- ai gửi yêu cầu hiện tại (khi pending)

  `status`               ENUM('active','inactive','pending','rejected') NOT NULL DEFAULT 'pending',

  `created\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`           DATETIME(3)  NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),

  `updated\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`           DATETIME(3)           DEFAULT CURRENT\_TIMESTAMP(3) ON UPDATE CURRENT\_TIMESTAMP(3),

  CONSTRAINT `pk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs` PRIMARY KEY (`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`),

  CONSTRAINT `uq\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_serial` UNIQUE (`serial\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_number`),

  CONSTRAINT `uq\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_serial\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_norm` UNIQUE (`serial\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_norm`),

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_owner`

    FOREIGN KEY (`owner\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`) REFERENCES `USERs`(`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE SET NULL ON UPDATE NO ACTION,

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_requested\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_by`

    FOREIGN KEY (`requested\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`) REFERENCES `USERs`(`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE SET NULL ON UPDATE NO ACTION

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE INDEX `idx\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_owner`       ON `DEVICEs` (`owner\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`);

CREATE INDEX `idx\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_requestedby` ON `DEVICEs` (`requested\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`);

CREATE INDEX `idx\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICEs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_status`      ON `DEVICEs` (`status`);



-- ======================================================================

-- Table: DEVICE\_REGISTRATIONs (đăng ký/duyệt; trỏ theo device\_id, không lưu serial)

-- ======================================================================

CREATE TABLE IF NOT EXISTS `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_REGISTRATIONs` (

  `reg\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`      CHAR(36)       NOT NULL,

  `user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`     CHAR(36)       NOT NULL,            -- ai đăng ký

  `device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`   CHAR(36)       NOT NULL,            -- thiết bị nào

  `status`      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',

  `note`        VARCHAR(255),

  `created\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`  DATETIME(3)    NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),

  `reviewed\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_by` CHAR(36)       DEFAULT NULL,        -- admin duyệt

  `reviewed\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at` DATETIME(3)    DEFAULT NULL,

  -- cờ pending để tạo "partial unique" (MySQL không có partial index)

  `is\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_pending`  TINYINT

      GENERATED ALWAYS AS (CASE WHEN `status`='pending' THEN 1 ELSE NULL END) STORED,

  CONSTRAINT `pk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_REGISTRATIONs` PRIMARY KEY (`reg\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`),

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DR\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user` FOREIGN KEY (`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`) REFERENCES `USERs`(`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE CASCADE ON UPDATE NO ACTION,

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DR\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_admin` FOREIGN KEY (`reviewed\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_by`) REFERENCES `ADMINs`(`admin\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE SET NULL ON UPDATE NO ACTION,

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DR\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device` FOREIGN KEY (`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`) REFERENCES `DEVICEs`(`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE RESTRICT ON UPDATE NO ACTION

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE INDEX `idx\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DR\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device` ON `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_REGISTRATIONs` (`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`);



-- Chặn trùng "đang pending" cho cùng một device (toàn hệ thống)

CREATE UNIQUE INDEX `ux\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DR\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_pending`

  ON `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_REGISTRATIONs` (`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`, `is\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_pending`);



-- Nếu muốn giới hạn "mỗi (user,device) chỉ có 1 pending", dùng cái này thay cho cái trên:

-- CREATE UNIQUE INDEX `ux\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DR\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_pending`

--   ON `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_REGISTRATIONs` (`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`, `device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`, `is\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_pending`);



-- ======================================================================

-- Table: DEVICE\_ASSIGNMENTs (lịch sử gán/tháo thiết bị cho user)

-- ======================================================================

CREATE TABLE IF NOT EXISTS `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs` (

  `da\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`         CHAR(36)     NOT NULL,

  `device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`     CHAR(36)     NOT NULL,

  `user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`       CHAR(36)     NOT NULL,

  `location`      VARCHAR(255),

  `assigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),

  `unassigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at` DATETIME(3)  DEFAULT NULL,

  -- đang active nếu chưa tháo

  `active\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device` TINYINT

      GENERATED ALWAYS AS (CASE WHEN `unassigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at` IS NULL THEN 1 ELSE NULL END) STORED,

  CONSTRAINT `pk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs` PRIMARY KEY (`da\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`),

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user`

    FOREIGN KEY (`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`) REFERENCES `USERs`(`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE CASCADE ON UPDATE NO ACTION,

  CONSTRAINT `fk\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device`

    FOREIGN KEY (`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`) REFERENCES `DEVICEs`(`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`)

    ON DELETE RESTRICT ON UPDATE NO ACTION,

  CONSTRAINT `ck\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_time`

    CHECK (`unassigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at` IS NULL OR `assigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at` <= `unassigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Indexes cho tra cứu FK \& thời gian

CREATE INDEX `idx\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DA\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device`      ON `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs` (`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`);

CREATE INDEX `idx\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DA\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_user`        ON `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs` (`user\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`);

CREATE INDEX `idx\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DA\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_assigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at` ON `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs` (`assigned\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_at`);



-- Ràng buộc: mỗi device chỉ có 1 gán active

CREATE UNIQUE INDEX `ux\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_DA\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_active`

  ON `DEVICE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ASSIGNMENTs` (`device\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id`, `active\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_device`);



-- ======================================================================



# Tạo sau

-- ======================================================================

-- CanNangVaBMIs

-- ======================================================================

 	// Phải thêm cái SET utf vào

CREATE TABLE CanNangVaBMIs (

  CNVB\_id CHAR(36) PRIMARY KEY,

  elderly\_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4\_0900\_ai\_ci NOT NULL,

  CanNang DECIMAL(5,2) NOT NULL,

  ChieuCao DECIMAL(4,2) NOT NULL,

  BMI DECIMAL(4,2) NOT NULL,

  created\_at DATETIME NOT NULL DEFAULT CURRENT\_TIMESTAMP,

  FOREIGN KEY (elderly\_id) REFERENCES elderly\_users(elderly\_id)

);



-- ============================================================================

-- Table: FALL\_EVENTs (Lịch sử té ngã)

-- ============================================================================

use elderly\_monitoring;

CREATE TABLE IF NOT EXISTS `FALL\\\_EVENTs` (

  `event\\\_id`     CHAR(36)     NOT NULL,                        -- UUID

  `elderly\\\_id`   CHAR(36)     NOT NULL,                        -- Người bị té ngã

  `device\\\_id`    CHAR(36)     DEFAULT NULL,                    -- Thiết bị phát hiện (camera)

  `detected\\\_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),  -- Thời điểm phát hiện

  `snapshot\\\_url` VARCHAR(500) DEFAULT NULL,                    -- Ảnh lúc té ngã (cloud)

  `video\\\_url`    VARCHAR(500) DEFAULT NULL,                    -- Video lưu cloud (HLS)

  `created\\\_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT\_TIMESTAMP(3),  -- Record được tạo lúc

  CONSTRAINT `pk\\\_FALL\\\_EVENTs` PRIMARY KEY (`event\\\_id`),

  CONSTRAINT `fk\\\_FALL\\\_EVENTs\\\_elderly`

      FOREIGN KEY (`elderly\\\_id`)

      REFERENCES `ELDERLY\\\_USERs`(`elderly\\\_id`)

      ON DELETE CASCADE ON UPDATE NO ACTION,

  CONSTRAINT `fk\\\_FALL\\\_EVENTs\\\_device`

      FOREIGN KEY (`device\\\_id`)

      REFERENCES `DEVICEs`(`device\\\_id`)

      ON DELETE SET NULL ON UPDATE NO ACTION

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;-- ============================================================================

-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor\_ai\_chat\_history (

  dt\_ai\_id char(36) PRIMARY KEY,

  user\_id char(36),

  elderly\_id char(36),

  question TEXT NOT NULL,

  answer TEXT NOT NULL,

  condition\_name VARCHAR(255) NULL,

  severity VARCHAR(50) NULL,

  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,

  INDEX idx\_user\_id (user\_id),

  INDEX idx\_elderly\_id (elderly\_id),

  INDEX idx\_created\_at (created\_at),

  FOREIGN KEY (user\_id) REFERENCES users(user\_id) ON DELETE SET NULL,

  FOREIGN KEY (elderly\_id) REFERENCES elderly\_users(elderly\_id) ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- ============================================================================

-- ============================================================================
CREATE TABLE IF NOT EXISTS water\_intake\_records (

  id INT AUTO\_INCREMENT PRIMARY KEY,

  user\_id char(36),

  elderly\_id char(36),

  amount\_ml INT NOT NULL COMMENT 'Lượng nước uống (ml)',

  drink\_time DATETIME NOT NULL COMMENT 'Thời gian uống nước',

  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,

  updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,

  FOREIGN KEY (user\_id) REFERENCES users(user\_id) ON DELETE SET NULL,

  FOREIGN KEY (elderly\_id) REFERENCES elderly\_users(elderly\_id) ON DELETE SET NULL

)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

