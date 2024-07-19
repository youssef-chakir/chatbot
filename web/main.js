import { streamGemini } from './gemini-api.js';

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (message) {
      appendMessage('user', message);
      userInput.value = '';
      
      try {
        let contents = [
          {
            type: "text",
            text: message,
          }
        ];

        let stream = streamGemini({
          model: 'gemini-pro',
          contents,
        });

        let buffer = [];
        let md = new markdownit();
        for await (let chunk of stream) {
          buffer.push(chunk);
          const botMessage = md.render(buffer.join(''));
          appendMessage('bot', botMessage);
        }
      } catch (e) {
        appendMessage('bot', 'Error: ' + e.message);
      }
    }
  });

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerHTML = message; // Using innerHTML to render markdown content
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
