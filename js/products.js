const catID = localStorage.getItem("catID");
const min = document.getElementById("rangeFilterCountMin");
const max = document.getElementById("rangeFilterCountMax");
let userSearch;
let currentCategoryName = "";
let currentProductsArray = [];

function sortBy(sortFormat) {
  if (sortFormat === "expensive") {
    return currentProductsArray.sort((a, b) => b.cost - a.cost);
  } else if (sortFormat === "cheap") {
    return currentProductsArray.sort((a, b) => a.cost - b.cost);
  } else if (sortFormat === "relevance") {
    return currentProductsArray.sort((a, b) => b.soldCount - a.soldCount);
  }
}

function showCategoryName() {
  let content = `Verás aquí todos los productos de la categoria ${currentCategoryName}.`;
  document.querySelector(".lead").innerHTML = content;
}

function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

function showProductsList(productArray = currentProductsArray) {
  let htmlContentToAppend = "";

  if (currentProductsArray.length) {
    for (let i = 0; i < productArray.length; i++) {
      const product = productArray[i];
  
      // Condición según valores min y max
      if (!(product.cost < parseInt(min.value)) && !(product.cost > parseInt(max.value))) {
        // Condición según valor del input de búsqueda
        if (product.name.toLowerCase().includes(userSearch) || userSearch === undefined) {
          htmlContentToAppend += `
          <div onclick="setProductID(${product.id})" class="list-group-item m-2 m-md-0 border list-group-item-action cursor-active">
          <div class="row">
            <div class="col-12 col-md-3">
              <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
            </div>
            <div class="col">
              <div class="d-flex w-100 mt-2 mt-md-0 justify-content-between">
                <h4 class="mb-1">${product.name} | <span class="d-block d-md-inline">${product.currency} ${product.cost}</span></h4>
                <small class="text-muted">${product.soldCount} artículos</small>
              </div>
                <p class="mb-1">${product.description}</p>
              </div>
            </div>
          </div>
          `;
        }
      }
    }
  } else {
    htmlContentToAppend = `
    <div class="d-flex flex-column align-items-center mt-5">
      <h4>Actualmente no hay Artículos</h4>
      <button onclick="window.location = 'categories.html'" class="btn btn-primary mt-2">Volver</button>
    </div>
    `;
    
    document.querySelectorAll(".row").forEach(element => {
      element.classList.add("d-none")
    });
    document.querySelector(".lead").innerHTML = htmlContentToAppend;
  }

  document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(PRODUCTS_URL + catID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsArray = resultObj.data.products;
      currentCategoryName = resultObj.data.catName;
      showCategoryName();
      showProductsList();
    }
  });

  // Escucha de Evento para modificar la variable userSeach, con el contenido ingresado por el usuario
  document.getElementById("userSearch").addEventListener("input", function () {
    userSearch = this.value.toLowerCase();
    showProductsList();
  });

  // Escucha de Evento para modificar el Array ajustandolo al Precio minimo y/o maximo que ingrese el usuario
  document.getElementById("rangeFilterCount").addEventListener("click", () => {
    showProductsList();
  });

  // Escucha de Evento para eliminar min y max ingresado por el usuario
  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    min.value = null;
    max.value = null;
    showProductsList();
  });

  // Escucha de Evento para ordenar los productos en función al precio más alto primero
  document.getElementById("sortExpensive").addEventListener("click", () => {
    showProductsList(sortBy("expensive"));
  });

  // Escucha de Evento para ordenar los productos en función al precio más bajo primero
  document.getElementById("sortCheap").addEventListener("click", () => {
    showProductsList(sortBy("cheap"));
  });

  // Escucha de Evento para ordenar los productos en función a la relevancia
  document.getElementById("sortRelevance").addEventListener("click", () => {
    showProductsList(sortBy("relevance"));
  });
});
