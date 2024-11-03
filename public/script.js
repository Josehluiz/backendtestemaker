document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("mensagem");
    const contador = document.getElementById("contador");
    const formulario = document.getElementById("formulario");

    async function botaoEnviar() {
        const mensagem = input.value;
        const contadorValue = contador.innerText;
        try {
            const response = await fetch('/api/resposta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mensagem, contador: contadorValue })
            });
            const data = await response.json();
            console.log(data);
            gerarFormulario(data);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function gerarFormulario(data) {
        formulario.innerHTML = ''; // Limpa o formulário anterior
        const gabaritoRespostas = {}; // Objeto para armazenar as respostas do gabarito

        data.choices.forEach((choice, index) => {
            const texto = choice.message?.content || '';
            const perguntas = texto.split(/\d+\)\s/).filter(Boolean); // Divide o texto em perguntas

            perguntas.forEach((perguntaTexto, perguntaIndex) => {
                const perguntaContainer = document.createElement('div'); // Cria uma nova div para cada pergunta
                perguntaContainer.classList.add('pergunta'); // Adiciona a classe CSS 'pergunta'

                // Extrair o gabarito da pergunta
                const gabaritoMatch = perguntaTexto.match(/Gabarito:\s([A-E])/);
                if (gabaritoMatch) {
                    gabaritoRespostas[`pergunta${index}_${perguntaIndex}`] = gabaritoMatch[1].trim(); // Armazena apenas a letra
                    perguntaTexto = perguntaTexto.replace(/Gabarito:\s[A-E]/, ''); // Remove o gabarito do texto
                }

                const [pergunta, ...alternativasTexto] = perguntaTexto.split(/\s(?=[A-E]\))/);
                const perguntaParagrafo = document.createElement('p');
                perguntaParagrafo.innerHTML = `${perguntaIndex + 1}) ${pergunta.trim()}`;
                perguntaContainer.appendChild(perguntaParagrafo);

                const form = document.createElement('form'); // Cria um novo formulário para cada pergunta
                alternativasTexto.forEach((alternativa, i) => {
                    const label = document.createElement('label');
                    label.innerHTML = `<input type="radio" name="pergunta${index}_${perguntaIndex}" value="${alternativa.trim()}"> ${alternativa.trim()}`;
                    form.appendChild(label);
                    form.appendChild(document.createElement('br'));
                });
                perguntaContainer.appendChild(form);

                formulario.appendChild(perguntaContainer);
                formulario.appendChild(document.createElement('br')); // Adiciona uma quebra de linha entre as perguntas
            });
        });

        // Adicionar botão para submeter as respostas
        const submitButton = document.createElement('button');
        submitButton.innerText = 'Submeter Respostas';
        submitButton.addEventListener('click', () => corrigirRespostas(gabaritoRespostas));
        formulario.appendChild(submitButton);

        // Adicionar botão para mostrar o gabarito
        const gabaritoButton = document.createElement('button');
        gabaritoButton.innerText = 'Mostrar Gabarito';
        gabaritoButton.addEventListener('click', () => mostrarGabarito(gabaritoRespostas));
        formulario.appendChild(gabaritoButton);
    }

    function armazenarRespostas() {
        const respostas = {};
        const forms = formulario.querySelectorAll('form');
        forms.forEach((form) => {
            const perguntaKey = form.querySelector('input[type="radio"]').name;
            const respostaSelecionada = form.querySelector('input[type="radio"]:checked');
            if (respostaSelecionada) {
                respostas[perguntaKey] = respostaSelecionada.value.charAt(0); // Armazena apenas a letra da resposta
            }
        });
        return respostas;
    }

    function corrigirRespostas(gabaritoRespostas) {
        const respostas = armazenarRespostas(); // Coleta as respostas do usuário
        let acertos = 0;
        let total = 0;
        for (const [pergunta, resposta] of Object.entries(respostas)) {
            total++;
            const respostaCorreta = gabaritoRespostas[pergunta].trim(); // Remove espaços em branco
            if (resposta === respostaCorreta) {
                acertos++;
            }
        }
        alert(`Você acertou ${acertos} de ${total} perguntas.`);
    }

    function mostrarGabarito(gabaritoRespostas) {
        const forms = formulario.querySelectorAll('form');
        forms.forEach((form, index) => {
            const perguntaKey = form.querySelector('input[type="radio"]').name;
            const respostaCorreta = gabaritoRespostas[perguntaKey];
            const respostaLabel = document.createElement('p');
            respostaLabel.innerText = `Resposta correta: ${respostaCorreta}`;
            form.appendChild(respostaLabel);
        });
    }

    document.getElementById("Enviar").addEventListener("click", botaoEnviar);

    // Contador
    const plus = document.getElementById("plus");
    const minus = document.getElementById("minus");

    const updateCounter = () => {
        contador.innerHTML = count;
    };

    let count = 0;  
    let intervalId = 0;

    plus.addEventListener("mousedown", () => {
       intervalId = setInterval(() => {
            count++;
            updateCounter();
        }, 100);
    });

    minus.addEventListener("mousedown", () => {
        intervalId = setInterval(() => {
            count--;
            updateCounter();
        }, 100);
    });

    plus.addEventListener("mouseup", () => {
        clearInterval(intervalId);
    });

    minus.addEventListener("mouseup", () => {
        clearInterval(intervalId);
    });
});
