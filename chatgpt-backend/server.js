const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Allow Cross-Origin requests


app.get('/', (req, res) => {
    res.send('anh binh dep trai!');
});
// Route để xử lý yêu cầu từ frontend
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body; // Lấy prompt từ frontend

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Gửi yêu cầu đến OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Hoặc model bạn muốn sử dụng
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Trả kết quả từ OpenAI API về cho frontend
    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Khởi chạy server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
