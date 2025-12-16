// src/routers/waterIntakeRouter.js
import express from 'express';
import {
  addWaterIntake,
  deleteWaterIntake,
  getTodayWaterIntake,
  getWaterIntakeHistory,
  getWaterIntakeStats
} from '../controllers/waterIntakeController.js';

const router = express.Router();

// POST /api/water-intake - Thêm bản ghi uống nước
router.post('/', addWaterIntake);

// DELETE /api/water-intake/:id - Xóa bản ghi
router.delete('/:id', deleteWaterIntake);

// GET /api/water-intake/today - Lấy tổng lượng nước hôm nay
router.get('/today', getTodayWaterIntake);

// GET /api/water-intake/history - Lấy lịch sử uống nước
router.get('/history', getWaterIntakeHistory);

// GET /api/water-intake/stats - Lấy thống kê theo ngày
router.get('/stats', getWaterIntakeStats);

export default router;

