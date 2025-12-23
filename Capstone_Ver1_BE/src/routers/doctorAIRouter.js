// src/routers/doctorAIRouter.js
import express from 'express';
import { 
  chatWithDoctorAI, 
  getChatHistory, 
  getCommonConditions 
} from '../controllers/doctorAIController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// POST /api/doctor-ai/chat - Chat với Doctor AI
router.post('/chat', chatWithDoctorAI);

// GET /api/doctor-ai/history - Lấy lịch sử chat (có thể yêu cầu authentication)
router.get('/history', getChatHistory);

// GET /api/doctor-ai/conditions - Lấy danh sách các bệnh thường gặp
router.get('/conditions', getCommonConditions);

export default router;





