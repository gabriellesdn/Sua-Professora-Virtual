# Sua Professora Virtual

Uma companheira de estudos com IA. Você conversa por voz ou por texto e ela monta o plano de estudos, marca provas no calendário, cria flashcards e acompanha o seu progresso. É uma **aplicação web** (web app): roda direto no navegador, sem instalar nada, e foi feita com HTML, CSS e JavaScript, sem servidor, usando a API gratuita do Gemini.

## O que ela faz

- **Conversa:** fale pelo microfone ou escreva. A resposta aparece na tela e também é falada. Ela começa com uma entrevista rápida para conhecer a sua rotina e o seu jeito de estudar.
- **Seu perfil:** plano de estudos em blocos de horário, provas com os conteúdos que vão cair e calendário de compromissos.
- **Foco:** Pomodoro com ritmos prontos ou personalizados, Modo foco em tela escura, tarefas do dia e meta diária.
- **Revisão:** flashcards com repetição espaçada, criados pela IA, e anotações por matéria.
- **Progresso:** tempo estudado, dias seguidos, gráficos da semana, notas, média e limite de faltas.

## Tecnologias

HTML, CSS e JavaScript · API do Gemini · Web Speech API (voz) 

## Como usar

Você precisa do navegador **Chrome** ou **Edge** e de uma conta Google (gratuita).

**1. Baixe o projeto**
Nesta página do GitHub, clique no botão verde **Code** e depois em **Download ZIP**. Quando terminar, clique com o botão direito no arquivo baixado e escolha **Extrair tudo**.

**2. Abra o app**
Dentro da pasta extraída, dê dois cliques no arquivo **index.html**. Ele abre no navegador.

**3. Crie a sua chave gratuita**
Acesse [aistudio.google.com](https://aistudio.google.com/), entre com a sua conta Google e procure a opção **Get API key** (obter chave de API). Crie uma chave e copie o código que aparece.

**4. Cole a chave no app**
No app, clique no botão **Chave da API**, cole o código e salve. Pronto: é só falar ou escrever.

A chave fica guardada só na aba aberta. Se fechar a aba, é preciso colar de novo.

Se aparecer o aviso "Modelo não encontrado", o Google trocou o nome do modelo de IA. Nesse caso, abra uma *issue* aqui no GitHub avisando.

## Privacidade

- A chave da API não fica no código: cada pessoa cola a própria, e ela some quando a aba é fechada.
- Os dados ficam só no navegador. Dá para exportar e importar um backup, e também apagar tudo na aba **Seu perfil**.
- A conversa e um resumo do seu perfil, calendário e plano são enviados ao Gemini. No plano gratuito do Google, isso pode ser usado para melhorar os produtos, então evite dados sensíveis.

## Limitações

- Os avisos só funcionam com a página aberta.
- Os dados não sincronizam entre aparelhos.
- O reconhecimento de voz funciona melhor no Chrome e no Edge.
- A IA pode errar: vale conferir planos e flashcards.

## Para quem publica o projeto

Envie os arquivos para um repositório no GitHub. Depois vá em **Settings > Pages**, escolha a branch `main` e a pasta `/ (root)` e salve. Em alguns minutos o link do site aparece nessa mesma tela.

## Estrutura

```
index.html--                 --telas
style.css--                  --visual
app.js--                     --toda a lógica
professora-virtual.html--    --os três arquivos juntos em um só
```

## Em breve uma versão melhor e adaptada para diversos modelos de IA.