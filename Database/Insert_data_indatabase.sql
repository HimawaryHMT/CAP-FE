
-- ================= USERs ============================
INSERT INTO USERs (user_id, full_name, phone, email, password_hash, status)
VALUES
('u-001', 'Huỳnh Minh Thắng', '090140601', 'thang@example.com', '$2b$10$dY7kcCzWvOmCX7nqu/.BVeK9xMqF4Arvl7rS0IDU3CR4oYDNRCaDO', 'active'),
('u-002', 'Trần Thị Bê', '0901000002', '1@example.com', '$2b$10$8lVpGjN4e9YDVjfDCyL2Eeho6XmLGCLplOBIafWxe4uSCREzZcsdO', 'pending'),
('u-003', 'Nguyễn Văn Dũng', '0901000003', 'c@example.com', '$2b$10$8lVpGjN4e9YDVjfDCyL2Eeho6XmLGCLplOBIafWxe4uSCREzZcsdO', 'active'),
('u-004', 'Phạm Văn c', '0901000004', 'd@example.com', '$2b$10$8lVpGjN4e9YDVjfDCyL2Eeho6XmLGCLplOBIafWxe4uSCREzZcsdO', 'inactive'),
('u-005', 'Hoàng Văn E', '0901000005', 'e@example.com', '$2b$10$8lVpGjN4e9YDVjfDCyL2Eeho6XmLGCLplOBIafWxe4uSCREzZcsdO', 'active');

-- ================= ADMINs ============================
INSERT INTO ADMINs (admin_id, full_name, email, password_hash)
VALUES
('a-001', 'Nguyen Quang Huy', 'thanghuynh@admin.com', '$2b$10$u.l1op8fzkNgWPbuTmPx8e/faq6yJvoBRV7FtYgSREEXR9qZpXBw2'),
('a-002', 'Tran Bao Anh', 'hmt@admin.com', '$2b$10$u/5iLXQLOeIW.xfFUcoDguFYT6cgMZCs76KgtKZ2C5I0UQsphuqSu');

-- ================= ELDERLY_USERs ============================
INSERT INTO ELDERLY_USERs (elderly_id, user_id, full_name, gender, birth_day, address, medical_history)
VALUES
('e-001', 'u-002', 'Cụ Nguyễn Văn Hòa', 'male', '1945-05-12', 'Đà Nẵng', 'Huyết áp cao'),
('e-002', 'u-003', 'Bà Trần Thị Mai', 'female', '1950-09-21', 'Huế', 'Tiểu đường'),
('e-003', 'u-001', 'Ông Lê Văn Lâm', 'male', '1940-01-03', 'Quảng Nam', 'Tim mạch'),
('e-004', 'u-004', 'Cụ Phạm Thị Hồng', 'female', '1939-03-15', 'Đà Nẵng', 'Không');


-- ================= DEVICEs ============================
INSERT INTO DEVICEs (device_id, device_type, serial_number, owner_user_id, requested_by_user_id, status)
VALUES
('d-001', 'CAMERA', 'CAM001', 'u-001', NULL, 'active'),
('d-002', 'JEWELRY', 'JWL001', 'u-001', NULL, 'active'),
('d-003', 'CAMERA', 'CAM002', NULL, 'u-003', 'pending'),
('d-004', 'JEWELRY', 'JWL002', NULL, 'u-003', 'pending'),
('d-005', 'CAMERA', 'CAM003', NULL , NULL, 'inactive'),
('d-006', 'JEWELRY', 'JWL003', NULL , NULL, 'inactive');


-- ================= DEVICE_REGISTRATIONs ============================
INSERT INTO DEVICE_REGISTRATIONs (reg_id, user_id, device_id, status, note, reviewed_by, reviewed_at)
VALUES
('r-001', 'u-003', 'd-003', 'pending', 'Đang chờ duyệt camera mới', NULL, NULL),
('r-002', 'u-003', 'd-004', 'pending', 'Đang chờ duyệt vòng tay', NULL, NULL),
('r-003', 'u-001', 'd-001', 'approved', 'Đăng ký thành công với CAMERA', 'a-001', NOW()),
('r-004', 'u-001', 'd-002', 'approved', 'Đăng ký thành công với JEWELRY', 'a-001', NOW()),
('r-005', 'u-005', 'd-005', 'rejected', 'Thiết bị hỏng', 'a-002', NOW());


-- ================= DEVICE_ASSIGNMENTs ============================
INSERT INTO DEVICE_ASSIGNMENTs (da_id, device_id, user_id, location, assigned_at, unassigned_at)
VALUES
('da-001', 'd-001', 'u-001', 'Nhà riêng Đà Nẵng', '2025-01-01 08:00:00.000', NULL), -- active
('da-002', 'd-002', 'u-002', 'Huế', '2025-02-01 09:00:00.000', '2025-03-01 10:00:00.000'), -- hết active
('da-003', 'd-003', 'u-003', 'Quảng Nam', '2025-03-10 08:30:00.000', NULL); -- active

-- ================= CanNangVaBMIs ============================
INSERT INTO CanNangVaBMIs 
(CNVB_id, elderly_id, CanNang, ChieuCao, BMI, created_at)
VALUES
('cnvb-1','e-001', 55.0, 1.60, ROUND(55.0 / (1.60 * 1.60), 2), NOW()),
('cnvb-2','e-001', 63.5, 1.70, ROUND(63.5 / (1.70 * 1.70), 2), NOW()),
('cnvb-3','e-002', 70.0, 1.75, ROUND(70.0 / (1.75 * 1.75), 2), NOW()),
('cnvb-4','e-002', 48.0, 1.55, ROUND(48.0 / (1.55 * 1.55), 2), NOW()),
('cnvb-5','e-001', 80.0, 1.80, ROUND(80.0 / (1.80 * 1.80), 2), NOW());
INSERT INTO CanNangVaBMIs 
(CNVB_id, elderly_id, CanNang, ChieuCao, BMI, created_at)
VALUES
('cnvb-6', 'e-003', 47.01, 1.60, ROUND(47.01 / (1.60 * 1.60), 2), STR_TO_DATE('2025-01-10 08:30:00', '%Y-%m-%d %H:%i:%s')),
('cnvb-7', 'e-003', 47.58, 1.60, ROUND(47.58 / (1.60 * 1.60), 2), STR_TO_DATE('2025-02-15 09:45:00', '%Y-%m-%d %H:%i:%s')),
('cnvb-8', 'e-003', 49.02, 1.60, ROUND(49.02 / (1.60 * 1.60), 2), STR_TO_DATE('2025-03-20 07:20:00', '%Y-%m-%d %H:%i:%s')),
('cnvb-9', 'e-003', 50.80, 1.60, ROUND(50.80 / (1.60 * 1.60), 2), STR_TO_DATE('2025-04-28 10:15:00', '%Y-%m-%d %H:%i:%s')),
('cnvb-10', 'e-003', 49.10, 1.61, ROUND(49.10 / (1.61 * 1.61), 2), STR_TO_DATE('2025-05-05 11:05:00', '%Y-%m-%d %H:%i:%s'));


use elderly_monitoring;
INSERT INTO `FALL_EVENTs` (
    event_id,
    elderly_id,
    device_id,
    detected_at,
    snapshot_url,
    video_url
) VALUES (
    '123e4567-e89b-12d3-a456-426614174000', -- UUID của event
    'e-003', -- UUID của elderly
    'd-001',                             -- ID thiết bị (có thể NULL)
    '2025-12-02 07:30:00',                    -- Thời điểm phát hiện
   NULL, 
    'https://res.cloudinary.com/dfwljv9iw/video/upload/v1764624923/fall_events/videos/Ezviz1_ID2_20251202_043517.mp4'  
);