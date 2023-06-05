const API_URL = 'https://swapi.dev/api';

async function getCharacter(id) {
  try {
    const res = await fetch(`${API_URL}/people/${id}`);
    const character = await res.json();
    return character;
  } catch (error) {
    return { notFound: 'not found', error };
  }
}

const list = {
  principalCharacters: { min: 1, max: 5 },
  secondaryCharacters: { min: 6, max: 10 },
  otherCharacters: { min: 11, max: 15 },
};

async function* charactersByRange({ min, max }) {
  for (let i = min; i <= max; i++) {
    const character = await getCharacter(i);
    yield character;
  }
}

async function printCharacters(event) {
  const card = event.target;
  const li = card.parentNode;
  const sectionId = li.getAttribute('data-range');
  const range = list[sectionId];
  const section = document.getElementById(sectionId);

  if (!section) {
    console.error(`Invalid sectionId or section not found: ${sectionId}`);
    return;
  }

  // Eliminar elementos previos en la sección
  section.innerHTML = '';

  const generator = charactersByRange(range);
  let count = 0; // Contador para controlar la cantidad de resultados

  while (count < 5) {
    const { value, done } = await generator.next();

    if (done) break;

    const card = document.createElement('div');
    const circle = document.createElement('div');
    const div = document.createElement('div');
    const h2 = document.createElement('h4');
    const p = document.createElement('p');

    card.classList.add('card');
    circle.classList.add('circle');
    h2.innerText = value.name;
    p.innerText = `Altura: ${value.height}, Peso: ${value.mass}`;

    div.append(h2, p);
    card.append(circle, div);

    section.append(card);

    count++; // Incrementar el contador de resultados
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const firstCardsBySection = document.querySelectorAll('.section .card:first-child');

  firstCardsBySection.forEach((card) => {
    card.addEventListener('mouseover', printCharacters);
  });
});

