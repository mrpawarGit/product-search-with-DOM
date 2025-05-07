let productGrid = document.getElementById('productGrid');
let errorMessage = document.getElementById('errorMessage');
let searchInput = document.getElementById('searchInput');
let categoryFilter = document.getElementById('categoryFilter');
let sortSelect = document.getElementById('sortSelect');
let productCount = document.getElementById('productCount');

let allProducts = [];

async function fetchProducts() {
  try {
    let response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    let products = await response.json();
    allProducts = products;
    fetchCategories();
    applyFilters();
  } catch (error) {
    errorMessage.textContent = 'Failed to fetch products. Please try again later.';
  }
}

async function fetchCategories() {
  try {
    let res = await fetch('https://fakestoreapi.com/products/categories');
    let categories = await res.json();
    categories.forEach(cat => {
      let option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  } catch (err) {
    console.log('Failed to fetch categories');
  }
}

function applyFilters() {
  let filtered = [...allProducts];

  let keyword = searchInput.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword));
  }

  let category = categoryFilter.value;
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  let sortBy = sortSelect.value;
  if (sortBy === 'asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  productCount.textContent = `${filtered.length} product(s) found`;
  displayProducts(filtered);
}

function displayProducts(products) {
  productGrid.innerHTML = '';
  products.forEach(product => {
    let div = document.createElement('div');
    div.className = 'product';

    let img = document.createElement('img');
    img.src = product.image;

    let title = document.createElement('h3');
    title.textContent = product.title;

    let price = document.createElement('p');
    price.textContent = `Price: $${product.price}`;

    let button = document.createElement('button');
    button.textContent = 'View Details';
    button.addEventListener('click', () => {
      alert(`Product ID: ${product.id}\nTitle: ${product.title}\nPrice: $${product.price}`);
    });

    div.append(img, title, price, button);
    productGrid.appendChild(div);
  });
}

searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

fetchProducts();