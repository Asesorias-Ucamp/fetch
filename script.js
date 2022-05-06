const requestTarget = document.querySelector('#request-target');
const itemContainer = document.querySelector('#item-container');
const intersectionOptions = {
  //Porcentaje del elemento que necesita ser visible para disparar el callback de IntersectionObserver
  threshold: 1
}

let apiUrl = 'https://rickandmortyapi.com/api/character';
let loading = false;

//Función Callback que recibe un array de entrys y donde solo necesitamos la primera porque solo hay una intersección posible
const onIntersect = ([entry]) => {
  if (apiUrl && !loading && entry.isIntersecting)
    makeRequest();
  console.log(entry);
}

const makeRequest = async() => {
  loading = true;
  await fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      cleanUp(data.info.next);
      renderItems(data.results);
  });
}

//Para que el usuario pueda hacer otra request cuando llame a la función makeRequest
const cleanUp = nextPage => {
  //apiUrl cambia para hacer una nueva request de personajes distintos
  apiUrl = nextPage;
  loading = false;
}

const renderItems = results => {
  results.forEach(item => {
    //Crea un nuevo elemento con la función createItem(y le pasamos la variable item)
    itemContainer.appendChild(createItem(item));
  });
}

const createItem = item => {
  const newItem = document.createElement('div');
  newItem.innerHTML = (
    `
    <div class="card" style="width: 8rem;">
    <img src=${item.image} class="card-img-top" />
    <div class="card-body">
      <h5 class="card-title">${item.name}</h5>
      <p class="card-text">${item.species}</p>
      <p>${item.id}</p>
    </div>
    </div>
    `
  );
  return newItem;
}

let observer = new IntersectionObserver(onIntersect, intersectionOptions);

observer.observe(requestTarget);