// src/controllers/doctorAIController.js
import poolMySQL from '../config/database.js';

// Knowledge base về các bệnh thường gặp và triệu chứng
const healthKnowledgeBase = [
  {
    keywords: ['đau đầu', 'nhức đầu', 'đau đầu', 'headache'],
    symptoms: ['đau đầu', 'nhức đầu'],
    condition: 'Đau đầu',
    advice: 'Đau đầu có thể do nhiều nguyên nhân: căng thẳng, thiếu ngủ, mất nước, hoặc thay đổi thời tiết. Bạn nên:\n- Nghỉ ngơi ở nơi yên tĩnh, tối\n- Uống đủ nước (2-3 lít/ngày)\n- Chườm lạnh hoặc ấm lên trán\n- Massage nhẹ vùng thái dương\n- Nếu đau kéo dài hoặc dữ dội, nên đi khám bác sĩ',
    severity: 'nhẹ',
    whenToSeeDoctor: 'Nếu đau đầu kèm sốt cao, cứng cổ, nhìn mờ, hoặc đau đột ngột dữ dội'
  },
  {
    keywords: ['sốt', 'nóng', 'fever', 'sốt cao'],
    symptoms: ['sốt', 'nóng sốt'],
    condition: 'Sốt',
    advice: 'Sốt là phản ứng tự nhiên của cơ thể khi chống lại nhiễm trùng. Bạn nên:\n- Uống nhiều nước để tránh mất nước\n- Nghỉ ngơi đầy đủ\n- Mặc quần áo thoáng mát\n- Có thể dùng thuốc hạ sốt (paracetamol) theo hướng dẫn\n- Đo nhiệt độ thường xuyên\n- Nếu sốt trên 38.5°C kéo dài hơn 3 ngày, nên đi khám',
    severity: 'trung bình',
    whenToSeeDoctor: 'Sốt trên 39°C, kéo dài hơn 3 ngày, hoặc kèm phát ban, đau cổ, khó thở'
  },
  {
    keywords: ['ho', 'cough', 'ho khan', 'ho có đờm'],
    symptoms: ['ho'],
    condition: 'Ho',
    advice: 'Ho có thể do cảm lạnh, dị ứng, hoặc kích ứng. Bạn nên:\n- Uống nhiều nước ấm\n- Súc miệng bằng nước muối\n- Tránh khói thuốc và không khí ô nhiễm\n- Nghỉ ngơi đầy đủ\n- Có thể dùng mật ong pha nước ấm\n- Nếu ho kéo dài hơn 2 tuần hoặc có máu, nên đi khám',
    severity: 'nhẹ',
    whenToSeeDoctor: 'Ho kéo dài hơn 2 tuần, ho có máu, kèm sốt cao, hoặc khó thở'
  },
  {
    keywords: ['đau bụng', 'đau dạ dày', 'đau bụng', 'stomach pain'],
    symptoms: ['đau bụng', 'đau dạ dày'],
    condition: 'Đau bụng',
    advice: 'Đau bụng có thể do nhiều nguyên nhân. Bạn nên:\n- Nghỉ ngơi, tránh vận động mạnh\n- Uống nước ấm từng ngụm nhỏ\n- Tránh thức ăn cay, nóng, dầu mỡ\n- Có thể chườm ấm vùng bụng\n- Nếu đau dữ dội hoặc kèm nôn mửa, sốt, nên đi khám ngay',
    severity: 'trung bình',
    whenToSeeDoctor: 'Đau bụng dữ dội, đau kèm sốt, nôn mửa, hoặc đau kéo dài hơn 24 giờ'
  },
  {
    keywords: ['cảm lạnh', 'cảm cúm', 'sổ mũi', 'nghẹt mũi', 'cold', 'flu'],
    symptoms: ['sổ mũi', 'nghẹt mũi', 'hắt hơi'],
    condition: 'Cảm lạnh/Cảm cúm',
    advice: 'Cảm lạnh thường tự khỏi sau 7-10 ngày. Bạn nên:\n- Nghỉ ngơi đầy đủ\n- Uống nhiều nước ấm\n- Rửa mũi bằng nước muối sinh lý\n- Ăn thức ăn dễ tiêu, bổ dưỡng\n- Giữ ấm cơ thể\n- Rửa tay thường xuyên để tránh lây lan',
    severity: 'nhẹ',
    whenToSeeDoctor: 'Sốt cao trên 38.5°C, khó thở, hoặc triệu chứng kéo dài hơn 10 ngày'
  },
  {
    keywords: ['đau họng', 'viêm họng', 'sore throat'],
    symptoms: ['đau họng', 'nuốt đau'],
    condition: 'Đau họng',
    advice: 'Đau họng thường do viêm nhiễm. Bạn nên:\n- Súc miệng bằng nước muối ấm nhiều lần trong ngày\n- Uống nước ấm, trà mật ong\n- Tránh thức ăn cay, nóng, lạnh\n- Nghỉ ngơi, hạn chế nói nhiều\n- Nếu đau kèm sốt hoặc kéo dài, nên đi khám',
    severity: 'nhẹ',
    whenToSeeDoctor: 'Đau họng kèm sốt cao, khó nuốt, hoặc kéo dài hơn 1 tuần'
  },
  {
    keywords: ['mất ngủ', 'khó ngủ', 'insomnia'],
    symptoms: ['mất ngủ', 'khó ngủ'],
    condition: 'Mất ngủ',
    advice: 'Mất ngủ có thể do căng thẳng, thói quen sinh hoạt. Bạn nên:\n- Tạo thói quen ngủ đúng giờ\n- Tránh dùng điện thoại, TV trước khi ngủ\n- Tạo không gian ngủ yên tĩnh, tối\n- Tránh caffeine và rượu bia trước khi ngủ\n- Tập thể dục nhẹ nhàng vào buổi sáng\n- Thư giãn trước khi ngủ (đọc sách, nghe nhạc nhẹ)',
    severity: 'nhẹ',
    whenToSeeDoctor: 'Mất ngủ kéo dài hơn 1 tháng ảnh hưởng đến cuộc sống hàng ngày'
  },
  {
    keywords: ['đau lưng', 'đau cột sống', 'back pain'],
    symptoms: ['đau lưng'],
    condition: 'Đau lưng',
    advice: 'Đau lưng có thể do tư thế sai, vận động quá sức. Bạn nên:\n- Nghỉ ngơi, tránh vận động mạnh\n- Chườm nóng hoặc lạnh\n- Massage nhẹ nhàng\n- Tập các bài tập kéo giãn nhẹ nhàng\n- Duy trì tư thế đúng khi ngồi, đứng\n- Nếu đau dữ dội hoặc kèm tê chân, nên đi khám',
    severity: 'trung bình',
    whenToSeeDoctor: 'Đau lưng dữ dội, kèm tê chân, hoặc sau chấn thương'
  },
  {
    keywords: ['chóng mặt', 'hoa mắt', 'dizziness'],
    symptoms: ['chóng mặt', 'hoa mắt'],
    condition: 'Chóng mặt',
    advice: 'Chóng mặt có thể do thiếu máu, huyết áp thấp, hoặc mất nước. Bạn nên:\n- Ngồi hoặc nằm xuống ngay khi cảm thấy chóng mặt\n- Uống đủ nước\n- Ăn đủ bữa, không bỏ bữa\n- Đứng dậy từ từ\n- Tránh thay đổi tư thế đột ngột\n- Nếu chóng mặt thường xuyên, nên đi khám',
    severity: 'trung bình',
    whenToSeeDoctor: 'Chóng mặt kèm đau đầu dữ dội, mất thăng bằng, hoặc ngất xỉu'
  },
  {
    keywords: ['mệt mỏi', 'uể oải', 'fatigue'],
    symptoms: ['mệt mỏi'],
    condition: 'Mệt mỏi',
    advice: 'Mệt mỏi có thể do thiếu ngủ, căng thẳng, hoặc thiếu dinh dưỡng. Bạn nên:\n- Ngủ đủ 7-8 giờ mỗi đêm\n- Ăn uống đầy đủ, cân bằng dinh dưỡng\n- Uống đủ nước\n- Tập thể dục đều đặn\n- Giảm căng thẳng, thư giãn\n- Nếu mệt mỏi kéo dài không rõ nguyên nhân, nên đi khám',
    severity: 'nhẹ',
    whenToSeeDoctor: 'Mệt mỏi kéo dài hơn 2 tuần kèm các triệu chứng khác như sốt, sụt cân'
  }
];

// Hàm tìm kiếm và trả lời dựa trên câu hỏi
const findAnswer = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  // Tìm kiếm trong knowledge base
  for (const item of healthKnowledgeBase) {
    for (const keyword of item.keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return {
          condition: item.condition,
          advice: item.advice,
          severity: item.severity,
          whenToSeeDoctor: item.whenToSeeDoctor,
          matched: true
        };
      }
    }
  }
  
  // Nếu không tìm thấy, trả về câu trả lời chung
  return {
    condition: 'Không xác định',
    advice: 'Cảm ơn bạn đã hỏi. Dựa trên mô tả của bạn, tôi khuyên bạn:\n- Nghỉ ngơi đầy đủ\n- Uống đủ nước\n- Theo dõi các triệu chứng\n- Nếu triệu chứng nặng hoặc kéo dài, bạn nên đi khám bác sĩ để được chẩn đoán chính xác\n\nLưu ý: Đây chỉ là tư vấn sơ bộ, không thay thế cho việc khám bác sĩ thực tế.',
    severity: 'không xác định',
    whenToSeeDoctor: 'Nếu triệu chứng nặng, kéo dài, hoặc bạn cảm thấy lo lắng',
    matched: false
  };
};

// Controller: Chat với Doctor AI
export const chatWithDoctorAI = async (req, res) => {
  try {
    const { question, user_id, elderly_id } = req.body;

    // Validate input
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập câu hỏi của bạn'
      });
    }

    console.log('🤖 [Doctor AI] Nhận câu hỏi:', question);
    console.log('👤 User ID:', user_id, 'Elderly ID:', elderly_id);

    // Tìm câu trả lời
    const answer = findAnswer(question);

    // Lưu lịch sử chat vào database (optional)
    try {
      if (user_id || elderly_id) {
        const [result] = await poolMySQL.execute(
          `INSERT INTO doctor_ai_chat_history 
           (user_id, elderly_id, question, answer, condition_name, severity, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [
            user_id || null,
            elderly_id || null,
            question,
            answer.advice,
            answer.condition,
            answer.severity
          ]
        );
        console.log('✅ Đã lưu lịch sử chat:', result.insertId);
      }
    } catch (dbError) {
      // Nếu bảng chưa tồn tại, chỉ log warning, không fail request
      console.warn('⚠️ Không thể lưu lịch sử chat (có thể bảng chưa tồn tại):', dbError.message);
    }

    // Trả về câu trả lời
    return res.status(200).json({
      success: true,
      data: {
        question: question,
        answer: answer.advice,
        condition: answer.condition,
        severity: answer.severity,
        whenToSeeDoctor: answer.whenToSeeDoctor,
        isMatched: answer.matched,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ [Doctor AI] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xử lý câu hỏi',
      error: error.message
    });
  }
};

// Controller: Lấy lịch sử chat
export const getChatHistory = async (req, res) => {
  try {
    const { user_id, elderly_id } = req.query;

    // Validate
    if (!user_id && !elderly_id) {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp user_id hoặc elderly_id'
      });
    }

    const query = elderly_id
      ? `SELECT * FROM doctor_ai_chat_history WHERE elderly_id = ? ORDER BY created_at DESC LIMIT 50`
      : `SELECT * FROM doctor_ai_chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`;
    
    const [rows] = await poolMySQL.execute(query, [elderly_id || user_id]);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error('❌ [Doctor AI] Error getting chat history:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy lịch sử chat',
      error: error.message
    });
  }
};

// Controller: Lấy danh sách các bệnh thường gặp
export const getCommonConditions = async (req, res) => {
  try {
    const conditions = healthKnowledgeBase.map(item => ({
      condition: item.condition,
      symptoms: item.symptoms,
      severity: item.severity
    }));

    return res.status(200).json({
      success: true,
      count: conditions.length,
      data: conditions
    });

  } catch (error) {
    console.error('❌ [Doctor AI] Error getting common conditions:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};




