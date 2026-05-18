-- ======================================================================
-- Schema: Elderly Monitoring (MySQL 8+)
-- ======================================================================
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS elderly_monitoring_ver1
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elderly_monitoring_ver1;

-- ======================================================================
-- USERs
-- ======================================================================
CREATE TABLE USERs (
  user_id       CHAR(36)       NOT NULL,
  full_name     VARCHAR(255)   NOT NULL,
  phone         VARCHAR(20)    NOT NULL,
  email         VARCHAR(255)   NOT NULL,
  password_hash VARBINARY(255) NOT NULL,
  status        ENUM('active','pending','rejected','inactive') NOT NULL DEFAULT 'inactive',
  created_at    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)             DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (user_id),
  UNIQUE (phone),
  UNIQUE (email)
);

-- ======================================================================
-- ADMINs
-- ======================================================================
CREATE TABLE ADMINs (
  admin_id      CHAR(36)       NOT NULL,
  full_name     VARCHAR(255)   NOT NULL,
  email         VARCHAR(255)   NOT NULL,
  password_hash VARBINARY(255) NOT NULL,
  created_at    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)             DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (admin_id),
  UNIQUE (email)
);

-- ======================================================================
-- ELDERLY_USERs
-- ======================================================================
CREATE TABLE ELDERLY_USERs (
  elderly_id      CHAR(36)     NOT NULL,
  user_id         CHAR(36)     NOT NULL,
  full_name       VARCHAR(255) NOT NULL,
  gender          ENUM('male','female','other') NOT NULL,
  birth_day       DATE         NOT NULL,
  address         VARCHAR(255) NOT NULL,
  medical_history TEXT,
  created_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)           DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (elderly_id),
  FOREIGN KEY (user_id) REFERENCES USERs(user_id)
    ON DELETE CASCADE ON UPDATE NO ACTION
);

-- ======================================================================
-- DEVICEs
-- ======================================================================
CREATE TABLE DEVICEs (
  device_id            CHAR(36)     NOT NULL,
  device_type          ENUM('CAMERA','JEWELRY') NOT NULL,
  serial_number        VARCHAR(100) NOT NULL,
  serial_norm          VARCHAR(100)
      GENERATED ALWAYS AS (LOWER(TRIM(serial_number))) STORED,
  owner_user_id        CHAR(36)     DEFAULT NULL,
  requested_by_user_id CHAR(36)     DEFAULT NULL,
  status               ENUM('active','inactive','pending','rejected') NOT NULL DEFAULT 'pending',
  created_at           DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at           DATETIME(3)           DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (device_id),
  UNIQUE (serial_number),
  UNIQUE (serial_norm),
  FOREIGN KEY (owner_user_id) REFERENCES USERs(user_id)
    ON DELETE SET NULL ON UPDATE NO ACTION,
  FOREIGN KEY (requested_by_user_id) REFERENCES USERs(user_id)
    ON DELETE SET NULL ON UPDATE NO ACTION
);

CREATE INDEX idx_DEVICEs_owner       ON DEVICEs (owner_user_id);
CREATE INDEX idx_DEVICEs_requestedby ON DEVICEs (requested_by_user_id);
CREATE INDEX idx_DEVICEs_status      ON DEVICEs (status);

-- ======================================================================
-- DEVICE_REGISTRATIONs
-- ======================================================================
CREATE TABLE DEVICE_REGISTRATIONs (
  reg_id      CHAR(36)       NOT NULL,
  user_id     CHAR(36)       NOT NULL,
  device_id   CHAR(36)       NOT NULL,
  device_type ENUM('CAMERA','JEWELRY') NOT NULL,
  status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  note        VARCHAR(255),
  created_at  DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  reviewed_by CHAR(36)       DEFAULT NULL,
  reviewed_at DATETIME(3)    DEFAULT NULL,
  is_pending  TINYINT
      GENERATED ALWAYS AS (CASE WHEN status='pending' THEN 1 ELSE NULL END) STORED,
  PRIMARY KEY (reg_id),
  FOREIGN KEY (user_id) REFERENCES USERs(user_id)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (reviewed_by) REFERENCES ADMINs(admin_id)
    ON DELETE SET NULL ON UPDATE NO ACTION,
  FOREIGN KEY (device_id) REFERENCES DEVICEs(device_id)
    ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE INDEX idx_DR_device ON DEVICE_REGISTRATIONs (device_id);
-- Mỗi user có thể đăng kí nhiều device khác nhau nhưng mỗi device chỉ được pending của 1 người 
CREATE UNIQUE INDEX ux_DR_device_pending
  ON DEVICE_REGISTRATIONs (device_id, is_pending);


-- ======================================================================
-- DEVICE_ASSIGNMENTs
-- ======================================================================
CREATE TABLE DEVICE_ASSIGNMENTs (
  da_id         CHAR(36)     NOT NULL,
  device_id     CHAR(36)     NOT NULL,
  user_id       CHAR(36)     NOT NULL,
  location      VARCHAR(255),
  assigned_at   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  unassigned_at DATETIME(3)  DEFAULT NULL,
  active_device TINYINT
      GENERATED ALWAYS AS (CASE WHEN unassigned_at IS NULL THEN 1 ELSE NULL END) STORED,
  PRIMARY KEY (da_id),
  FOREIGN KEY (user_id) REFERENCES USERs(user_id)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (device_id) REFERENCES DEVICEs(device_id)
    ON DELETE RESTRICT ON UPDATE NO ACTION,
  CHECK (unassigned_at IS NULL OR assigned_at <= unassigned_at)
);

CREATE INDEX idx_DA_device      ON DEVICE_ASSIGNMENTs (device_id);
CREATE INDEX idx_DA_user        ON DEVICE_ASSIGNMENTs (user_id);
CREATE INDEX idx_DA_assigned_at ON DEVICE_ASSIGNMENTs (assigned_at);

CREATE UNIQUE INDEX ux_DA_device_active
  ON DEVICE_ASSIGNMENTs (device_id, active_device);

-- ======================================================================
