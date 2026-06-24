const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo Gemini với Key từ file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { message, imageBase64 } = req.body;

        // Sử dụng model gemini-1.5-flash: Rất nhanh, miễn phí và hỗ trợ cả ảnh + text
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `Bạn là NutriBae AI, trợ lý dinh dưỡng chuyên về ẩm thực Việt Nam. 
        - Trả lời ngắn gọn, thân thiện, dùng biểu tượng cảm xúc.
        - Nếu người dùng hỏi thực đơn, hãy gợi ý các món như Bún riêu (350 cal), Cơm tấm (620 cal)...
        - Nếu người dùng gửi ảnh, hãy phân tích xem đó là món gì, ước tính lượng calo và các chất dinh dưỡng (Protein, Carbs, Fat).`;

        let result;

        // Nếu người dùng có gửi kèm hình ảnh
        if (imageBase64) {
            // Tách phần data khỏi chuỗi Base64 gửi từ Frontend
            const base64Data = imageBase64.split(',')[1]; 
            const mimeType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));

            const imageParts = [{
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }];

            const prompt = message 
                ? `${systemPrompt}\n\nCâu hỏi của người dùng: ${message}` 
                : `${systemPrompt}\n\nHãy phân tích món ăn trong ảnh này.`;
            
            result = await model.generateContent([prompt, ...imageParts]);
        } 
        // Nếu người dùng chỉ chat chữ bình thường
        else {
            const prompt = `${systemPrompt}\n\nCâu hỏi của người dùng: ${message}`;
            result = await model.generateContent(prompt);
        }

        // Lấy câu trả lời từ Gemini
        const text = result.response.text();
        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "NutriBae AI đang gặp sự cố kết nối với Google. Bạn thử lại nhé!" });
    }
});

module.exports = router;