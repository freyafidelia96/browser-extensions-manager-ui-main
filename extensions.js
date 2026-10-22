const grid = document.querySelector('.extensions-grid');
const filterButtons = {
  all: document.querySelector('.all'),
  active: document.querySelector('.active'),
  inactive: document.querySelector('.inactive'),
};

let extensions = JSON.parse(localStorage.getItem('extensionData'))
  ?? await fetch('data.json').then((response) => response.json());
let filter = 'all';

function cardHtml(extension) {
  return `
      <div class="extension">
        <div class="logo-description">
          <img src="${extension.logo}" alt="logo-plus">
          <div class="extension-description">
            <h3>${extension.name}</h3>
            <p>${extension.description}</p>
          </div>
        </div>
        <div class="remove-toggle">
          <div class="button-container">
            <button class="remove" data-name="${extension.name}">Remove</button>
          </div>
          <label class="switch">
            <input class="input" type="checkbox" ${extension.isActive ? "checked" : ""} data-name="${extension.name}">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `;
}

function render() {
  const visible = extensions.filter((extension) => filter === 'all' || extension.isActive === (filter === 'active'));
  grid.innerHTML = visible.map(cardHtml).join('');
}

function save() {
  localStorage.setItem('extensionData', JSON.stringify(extensions));
  render();
}

function setFilter(name) {
  filter = name;
  Object.entries(filterButtons).forEach(([buttonName, button]) => {
    button.classList.toggle('isActive', buttonName === name);
  });
  render();
}

Object.entries(filterButtons).forEach(([name, button]) => {
  button.addEventListener('click', () => setFilter(name));
});

grid.addEventListener('change', (event) => {
  const extension = extensions.find((ext) => ext.name === event.target.dataset.name);
  extension.isActive = event.target.checked;
  save();
});

grid.addEventListener('click', (event) => {
  if (!event.target.matches('.remove')) return;
  extensions = extensions.filter((extension) => extension.name !== event.target.dataset.name);
  save();
});

function toggleTheme() {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');

  if (document.body.classList.contains('dark')) {
    document.querySelector('.image-container').innerHTML += `<div class="image-text">Extensions</div>`;
    document.querySelector('.toggle-buttons').innerHTML = `
      <button class="button-dark"><img src="assets/images/icon-sun.svg" alt="Sun image"></button>
    `;
  } else {
    document.querySelector('.image-text')?.remove();
    document.querySelector('.toggle-buttons').innerHTML = `
      <button class="button-dark"><img src="assets/images/icon-moon.svg" alt="Moon image"></button>
    `;
  }

  document.querySelector('.button-dark').addEventListener('click', toggleTheme);
}

document.querySelector('.button-dark').addEventListener('click', toggleTheme);

setFilter('all');
