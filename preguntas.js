function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayPreguntas(preguntasJson) {
  const container = document.getElementById("preguntas-container");
  container.innerHTML = "";

  shuffleArray(preguntasJson).forEach((pregunta) => {
    const card = document.createElement("div");
    card.className = "card mb-3";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const preguntaTitulo = document.createElement("h5");
    preguntaTitulo.className = "card-title";
    preguntaTitulo.textContent = pregunta.pregunta;

    cardBody.appendChild(preguntaTitulo);

    const opcionesKeys = shuffleArray(Object.keys(pregunta.opciones));

    opcionesKeys.forEach((key) => {
      const opcionDiv = document.createElement("div");
      opcionDiv.className = "form-check";

      const input = document.createElement("input");
      input.className = "form-check-input";
      input.type = Array.isArray(pregunta.respuestaCorrecta)
        ? "checkbox"
        : "radio";
      input.name = pregunta.id;
      input.id = key;
      input.value = key;

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.htmlFor = key;
      label.textContent = pregunta.opciones[key];

      opcionDiv.appendChild(input);
      opcionDiv.appendChild(label);

      cardBody.appendChild(opcionDiv);

      input.addEventListener("change", () => {
        if (!Array.isArray(pregunta.respuestaCorrecta) || input.checked) {
          handleAnswerSelection(
            pregunta.respuestaCorrecta,
            cardBody,
            pregunta.id
          );
        }
      });
    });

    card.appendChild(cardBody);
    container.appendChild(card);
  });
}

function handleAnswerSelection(correctOptions, cardBody, preguntaId) {
  const selectedOptions = Array.from(
    cardBody.querySelectorAll(`input[name="${preguntaId}"]:checked`)
  ).map((input) => input.id);
  const isCorrect = Array.isArray(correctOptions)
    ? correctOptions.every((option) => selectedOptions.includes(option)) &&
      selectedOptions.every((option) => correctOptions.includes(option))
    : selectedOptions.includes(correctOptions);

  const existingMessage = cardBody.querySelector(".respuesta-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const message = document.createElement("p");
  message.className = "respuesta-message mt-2";
  message.textContent = isCorrect ? "¡Correcto!" : "Incorrecto";
  message.style.color = isCorrect ? "green" : "red";

  cardBody.appendChild(message);
}

fetch("preguntas.json")
  .then((response) => response.json())
  .then((data) => displayPreguntas(data.preguntas))
  .catch((error) => console.error("Error al cargar el archivo JSON:", error));
