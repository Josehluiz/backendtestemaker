import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.json());
app.use(express.static('public'));

app.post('/api/resposta', async (req, res) => {
    const { mensagem } = req.body;
    try {
        res.json(completion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});