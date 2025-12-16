// src/controllers/waterIntakeController.js
import poolMySQL from '../config/database.js';

// Thêm bản ghi uống nước
export const addWaterIntake = async (req, res) => {
  try {
    const { user_id, elderly_id, amount_ml, drink_time } = req.body;

    // Validate
    if (!amount_ml || amount_ml <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Lượng nước phải lớn hơn 0'
      });
    }

    const drinkTime = drink_time ? new Date(drink_time) : new Date();

    // Insert vào database
    const [result] = await poolMySQL.execute(
      `INSERT INTO water_intake_records 
       (user_id, elderly_id, amount_ml, drink_time) 
       VALUES (?, ?, ?, ?)`,
      [
        user_id || null,
        elderly_id || null,
        amount_ml,
        drinkTime
      ]
    );

    console.log('✅ Đã thêm bản ghi uống nước:', result.insertId);

    return res.status(201).json({
      success: true,
      message: 'Đã ghi nhận lượng nước uống',
      data: {
        id: result.insertId,
        user_id: user_id || null,
        elderly_id: elderly_id || null,
        amount_ml,
        drink_time: drinkTime
      }
    });

  } catch (error) {
    console.error('❌ [Water Intake] Error adding record:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm bản ghi',
      error: error.message
    });
  }
};

// Xóa bản ghi uống nước
export const deleteWaterIntake = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, elderly_id } = req.body;

    // Kiểm tra quyền sở hữu
    const [records] = await poolMySQL.execute(
      `SELECT user_id, elderly_id FROM water_intake_records WHERE id = ?`,
      [id]
    );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi'
      });
    }

    const record = records[0];
    if (record.user_id !== user_id && record.elderly_id !== elderly_id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bản ghi này'
      });
    }

    // Xóa bản ghi
    await poolMySQL.execute(
      `DELETE FROM water_intake_records WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Đã xóa bản ghi thành công'
    });

  } catch (error) {
    console.error('❌ [Water Intake] Error deleting record:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa bản ghi',
      error: error.message
    });
  }
};

// Lấy tổng lượng nước uống trong ngày
export const getTodayWaterIntake = async (req, res) => {
  try {
    const { user_id, elderly_id } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let query, params;
    if (elderly_id) {
      query = `
        SELECT 
          COALESCE(SUM(amount_ml), 0) as total_ml,
          COUNT(*) as drink_count,
          MAX(drink_time) as last_drink_time
        FROM water_intake_records
        WHERE elderly_id = ? 
        AND drink_time >= ? 
        AND drink_time < ?
      `;
      params = [elderly_id, today, tomorrow];
    } else if (user_id) {
      query = `
        SELECT 
          COALESCE(SUM(amount_ml), 0) as total_ml,
          COUNT(*) as drink_count,
          MAX(drink_time) as last_drink_time
        FROM water_intake_records
        WHERE user_id = ? 
        AND drink_time >= ? 
        AND drink_time < ?
      `;
      params = [user_id, today, tomorrow];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp user_id hoặc elderly_id'
      });
    }

    const [rows] = await poolMySQL.execute(query, params);

    return res.status(200).json({
      success: true,
      data: {
        total_ml: parseInt(rows[0].total_ml) || 0,
        drink_count: parseInt(rows[0].drink_count) || 0,
        last_drink_time: rows[0].last_drink_time,
        date: today.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('❌ [Water Intake] Error getting today intake:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy dữ liệu',
      error: error.message
    });
  }
};

// Lấy lịch sử uống nước
export const getWaterIntakeHistory = async (req, res) => {
  try {
    const { user_id, elderly_id, start_date, end_date, limit = 50 } = req.query;

    if (!user_id && !elderly_id) {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp user_id hoặc elderly_id'
      });
    }

    let query = `
      SELECT 
        id,
        amount_ml,
        drink_time,
        created_at
      FROM water_intake_records
      WHERE 
    `;

    const params = [];

    if (elderly_id) {
      query += ` elderly_id = ? `;
      params.push(elderly_id);
    } else {
      query += ` user_id = ? `;
      params.push(user_id);
    }

    if (start_date) {
      query += ` AND drink_time >= ? `;
      params.push(new Date(start_date));
    }

    if (end_date) {
      query += ` AND drink_time <= ? `;
      params.push(new Date(end_date));
    }

    query += ` ORDER BY drink_time DESC LIMIT ? `;
    params.push(parseInt(limit));

    const [rows] = await poolMySQL.execute(query, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error('❌ [Water Intake] Error getting history:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy lịch sử',
      error: error.message
    });
  }
};

// Lấy thống kê theo ngày (7 ngày gần nhất)
export const getWaterIntakeStats = async (req, res) => {
  try {
    const { user_id, elderly_id, days = 7 } = req.query;

    if (!user_id && !elderly_id) {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp user_id hoặc elderly_id'
      });
    }

    const daysCount = parseInt(days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);
    startDate.setHours(0, 0, 0, 0);

    let query, params;
    if (elderly_id) {
      query = `
        SELECT 
          DATE(drink_time) as date,
          SUM(amount_ml) as total_ml,
          COUNT(*) as drink_count
        FROM water_intake_records
        WHERE elderly_id = ? 
        AND drink_time >= ?
        GROUP BY DATE(drink_time)
        ORDER BY date DESC
      `;
      params = [elderly_id, startDate];
    } else {
      query = `
        SELECT 
          DATE(drink_time) as date,
          SUM(amount_ml) as total_ml,
          COUNT(*) as drink_count
        FROM water_intake_records
        WHERE user_id = ? 
        AND drink_time >= ?
        GROUP BY DATE(drink_time)
        ORDER BY date DESC
      `;
      params = [user_id, startDate];
    }

    const [rows] = await poolMySQL.execute(query, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error('❌ [Water Intake] Error getting stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê',
      error: error.message
    });
  }
};


