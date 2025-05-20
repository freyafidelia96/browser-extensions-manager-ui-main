function extensionSummary() {

  const extensionsData = JSON.parse(localStorage.getItem("extensionData"));

  if (!extensionsData) {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("extensionData", JSON.stringify(data));
      })
      .catch(error => console.error('Error loading JSON:', error));
  }

  let extensionHtml = '';
  let isActiveHtml = '';
  let inActiveHtml = '';

  extensionsData.forEach((extension) => {
    let html = `
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
    if (extension.isActive) {
      isActiveHtml += html;
    } else {
      inActiveHtml += html;
    }
    extensionHtml += html;
  });

  let isClicked = false;

  document.querySelector('.all').addEventListener('click',
    () => {
      document.querySelector('.extensions-grid').innerHTML = extensionHtml;
      isClicked = true;
      document.querySelector('.active').classList.remove('isActive');
      document.querySelector('.inactive').classList.remove('isActive');
    });

  document.querySelector('.active').addEventListener('click',
    () => {
      document.querySelector('.extensions-grid').innerHTML = isActiveHtml;
      isClicked = true;
      document.querySelector('.all').classList.remove('isActive');
      document.querySelector('.inactive').classList.remove('isActive')
      document.querySelector('.active').classList.add('isActive')

    });

  document.querySelector('.inactive').addEventListener('click',
    () => {
      document.querySelector('.extensions-grid').innerHTML = inActiveHtml;
      isClicked = true;
      document.querySelector('.all').classList.remove('isActive');
      document.querySelector('.inactive').classList.add('isActive')
      document.querySelector('.active').classList.remove('isActive')

    });

  if (!isClicked) {
    document.querySelector('.extensions-grid').innerHTML = extensionHtml;
    document.querySelector('.all').classList.add('isActive');
  }

  let allInputs = document.querySelectorAll('.input');

  allInputs.forEach((input) => {
    input.addEventListener('change', () => {
      let extensionName = input.dataset.name;

      extensionsData.forEach((extension) => {
        if (extension.name === extensionName) {
          extension.isActive = input.checked;
          localStorage.setItem("extensionData", JSON.stringify(extensionsData));
          extensionSummary();
        }
      });
    });
  });

  document.querySelectorAll('.remove').forEach((removeButton) => {
    removeButton.addEventListener('click', () => {
      let extensionName = removeButton.dataset.name;
      let updatedExtensionsData = extensionsData.filter((extension) => extension.name != extensionName);
      localStorage.setItem('extensionData', JSON.stringify(updatedExtensionsData));

      console.log(updatedExtensionsData);
      extensionSummary();
    })
  })


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

}


extensionSummary();