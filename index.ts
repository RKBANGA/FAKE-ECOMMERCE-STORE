interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

const productGrid = document.getElementById("productGrid") as HTMLElement;
const loadingElement = document.getElementById("loading") as HTMLElement;
const errorElement = document.getElementById("error") as HTMLElement;
const categoryFilter = document.getElementById("categoryFilter") as HTMLSelectElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const priceRange = document.getElementById("priceRange") as HTMLInputElement;
const priceValue = document.getElementById("priceValue") as HTMLElement;
const productDetailModal = document.getElementById("productDetailModal") as HTMLElement;
const closeModal = document.getElementById("closeModal") as HTMLElement;
const productTitle = document.getElementById("productTitle") as HTMLElement;
const productImage = document.getElementById("productImage") as HTMLImageElement;
const productDescription = document.getElementById("productDescription") as HTMLElement;
const productPrice = document.getElementById("productPrice") as HTMLElement;
const relatedProducts = document.getElementById("relatedProducts") as HTMLElement;


let products: Product[] = [];
let filteredProducts: Product[] = [];

// Fetch products from the API
const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products: Product[] = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Render products to the DOM
const renderProducts = (products: Product[]) => {
    const productList = document.getElementById('product-list') as HTMLElement;

    products.forEach((product) => {
        // Create product card
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="category">${product.category.toUpperCase()}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>
                <span class="discount">50%</span>
                <span class="old-price">$${(product.price * 2).toFixed(2)}</span>
            </p>
            <div class="actions">
                <button class="btn">Add to cart</button>
                <button class="btn">Details</button>
            </div>
        `;

        // Append product card to the product list
        productList.appendChild(productCard);
    });
};

// Initialize app
const initializeApp = async () => {
    try {
        const products = await fetchProducts();
        renderProducts(products);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
};

initializeApp();
 