import express from 'express';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos da pasta 'public'

app.post('/api/resposta', async (req, res) => {
    const { mensagem, contador } = req.body;
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Sua função é apenas criar questões para avaliações em português Brasil."
                },
                {
                    role: "system",
                    content: "Antes de fazer as questões, verifique se o conteúdo é apropriado para a avaliação, se não for, não faça a questão."
                },
                {
                    role: "system",
                    content:"toda vez que você gerar questões sobre qualquer conteúdo gere o gabarito da própria questão embaixo dela desta maneira 'Gabarito: C'"
                },
                {
                    role: "system",
                    content: `Se o conteúdo for válido, use este modelo de estrutura de pergunta para montar as questões sobre o que o usuário vai pedir: '1) Pergunta 1? A) alternativa A B) alternativa B C) alternativa C D) alternativa D E) alternativa E'. Faça ${contador} questões.`
                },
                {
                    role: "user",
                    content: mensagem
                }
            ],
            max_tokens: 1000,
        });
        res.json(completion.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});