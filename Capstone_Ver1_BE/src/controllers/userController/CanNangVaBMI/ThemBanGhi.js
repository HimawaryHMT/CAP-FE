import db from '../../../config/database.js';

const ThemBanGhi = async (req, res) => {
  try {
    // Lấy user_id từ token 
    const userId = req.user.user_id;
    // Kiểm tra xem  có user_id trong token không 
    if (!userId) {
      return res.status(400).json({ message: "Thiếu user_id trong token" });
    }
    const { weight, height } = req.body;

    // Kiểm tra dữ liệu hợp lệ
    if (!weight || !height || weight > 400 || height > 250) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    if (isNaN(weight) || isNaN(height)) {
  return res.status(400).json({ message: "Dữ liệu phải là số" });
}

    // ✅ Lấy elderly_id từ bảng elderly_users
    const [elderlyRows] = await db.query(
      "SELECT elderly_id FROM elderly_users WHERE user_id = ?",
      [userId]
    );

    if (elderlyRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy elderly_id của user" });
    }

    const elderly_id = elderlyRows[0].elderly_id;

    // ✅ Lấy cnvb_id cuối cùng, tạo ID mới
    const [lastIdRows] = await db.query(`
      SELECT cnvb_id 
      FROM cannangvabmis 
      ORDER BY CAST(SUBSTRING_INDEX(cnvb_id, '-', -1) AS UNSIGNED) DESC 
      LIMIT 1
    `);

    let newId;
    if (lastIdRows.length > 0) {
      const lastId = lastIdRows[0].cnvb_id;
      const numPart = parseInt(lastId.split('-')[1]);
      newId = `cnvb-${numPart + 1}`;
    } else {
      newId = "cnvb-1";
    }

    // Đổi chiều cao từ cm => m 
    const heightDaDoi = height / 100

    // Tính BMI
    const bmi = weight / (heightDaDoi * heightDaDoi);
    const bmiValue = parseFloat(bmi.toFixed(2));

    console.log("✅ Dữ liệu nhận:", { weight, height, bmi });

    // ✅ INSERT dữ liệu vào DB
    await db.query(
      `INSERT INTO cannangvabmis (cnvb_id, elderly_id, cannang, chieucao, bmi, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [newId, elderly_id, weight, heightDaDoi, bmiValue]
    );

    console.log("✅ Insert thành công:", { newId, elderly_id, weight, heightDaDoi, bmi : bmiValue });


    // Trả về cho client
     return res.status(201).json({
      message: "Thêm bản ghi thành công",
      data: {
        cnvb_id: newId,
        elderly_id,
        weight,
        height: `${height} cm`,
        bmi: bmiValue
      }
    });

  } catch (error) {
    console.error("❌ Lỗi khi thêm bản ghi:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};


const getAll_BMI = async (req, res) => {
  try {
    // ✅ Lấy user_id từ token
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu user_id trong token" });
    }

    // Lấy dữ liệu BMI theo elderly_id của user
    const [rows] = await db.query(`
      SELECT cvb.bmi,
       DATE_FORMAT(cvb.created_at, '%b') AS month
FROM cannangvabmis cvb
JOIN elderly_users eu ON cvb.elderly_id = eu.elderly_id
WHERE eu.user_id = ?
ORDER BY cvb.created_at ASC
LIMIT 5
    ` , [userId]
    );

    if (rows.length === 0) {
      console.log("UserId la :", userId); // ✅ Log ra userId
      return res.status(404).json({ message: "Không có dữ liệu BMI" });
    }

    // Lấy danh sách BMI
    const values = rows.map(row => parseFloat(row.bmi));
    const labels = rows.map(row => row.month);

    // Tính toán thống kê
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = (
      values.reduce((sum, v) => sum + v, 0) / values.length
    ).toFixed(1);

    // Gửi kết quả về client
    return res.status(200).json({
      message: "Lấy dữ liệu BMI thành công",
      data: { max, min, avg, values, labels },
    });

  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu BMI:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getAll_CanNang = async (req, res) => {
  try {
    // ✅ Lấy user_id từ token
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu user_id trong token" });
    }

    // Lấy dữ liệu Cân nặng theo elderly_id của user
    const [rows] = await db.query(`
      SELECT cvb.cannang,
       DATE_FORMAT(cvb.created_at, '%b') AS month
FROM cannangvabmis cvb
JOIN elderly_users eu ON cvb.elderly_id = eu.elderly_id
WHERE eu.user_id = ?
ORDER BY cvb.created_at ASC
LIMIT 5
    ` , [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không có dữ liệu cannang" });
    }

    // Lấy danh sách BMI
    const values = rows.map(row => parseFloat(row.cannang));
    const labels = rows.map(row => row.month);

    // Tính toán thống kê
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = (
      values.reduce((sum, v) => sum + v, 0) / values.length
    ).toFixed(1);

    // Gửi kết quả về client
    return res.status(200).json({
      message: "Lấy dữ liệu cân nặng thành công",
      data: { max, min, avg, values, labels },
    });

  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu cân nặng :", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};


const getDetail_CN_BMI = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu user_id trong token" });
    }

    // ✅ Lấy thông tin mới nhất: cân nặng, chiều cao, BMI và ngày giờ rõ ràng
    const [rows] = await db.query(`
  SELECT 
    cvb.cannang AS weight,
    cvb.chieucao AS height,
    cvb.bmi,
    DATE_FORMAT(cvb.created_at, '%Y-%m-%d %H:%i:%s') AS date_time
  FROM cannangvabmis cvb
  JOIN elderly_users eu ON cvb.elderly_id = eu.elderly_id
  WHERE eu.user_id = ?
  ORDER BY cvb.created_at DESC
  LIMIT 1
`, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không có dữ liệu cân nặng mới nhất" });
    }

    const latest = rows[0];

    return res.status(200).json({
      message: "Lấy dữ liệu mới nhất thành công",
      data: {
        weight: parseFloat(latest.weight),
        height: parseFloat(latest.height),
        bmi: parseFloat(latest.bmi),
        dateTime: latest.date_time
      }
    });

  } catch (error) {
    console.error("❌ Lỗi API:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};


export { ThemBanGhi, getAll_BMI, getAll_CanNang , getDetail_CN_BMI};