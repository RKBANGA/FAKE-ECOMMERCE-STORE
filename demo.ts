interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

let products: Product[] = [];
let filteredProducts: Product[] = [];

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

const showLoadingState = (): void => {
    loadingElement.style.display = "block";
    productGrid.style.display = "none";
};

const hideLoadingState = (): void => {
    loadingElement.style.display = "none";
    productGrid.style.display = "grid";
};

const fetchProducts = async (): Promise<void> => {
    showLoadingState();
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        products = data;
        filteredProducts = data;
        renderProducts(filteredProducts);
        hideLoadingState();
    } catch (error: unknown) {
        hideLoadingState();
        if (error instanceof Error) {
            errorElement.textContent = `Error: ${error.message}`;
        }
    }
};

const renderProducts = (products: Product[]): void => {
    productGrid.innerHTML = "";
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p><strong>$${product.price}</strong></p>
            <button onclick="showProductDetail(${product.id})">Details</button>
        `;
        productGrid.appendChild(productCard);
    });
};

const showProductDetail = (productId: number): void => {
    const product = products.find(p => p.id === productId);
    if (product) {
        productTitle.textContent = product.title;
        productImage.src = product.image;
        productDescription.textContent = product.description;
        productPrice.textContent = `$${product.price}`;

        const related = products.filter(p => p.category === product.category && p.id !== productId);
        relatedProducts.innerHTML = "";
        related.forEach(p => {
            const relatedCard = document.createElement("div");
            relatedCard.innerHTML = `
                <img src="${p.image}" alt="${p.title}" />
                <p>${p.title}</p>
            `;
            relatedProducts.appendChild(relatedCard);
        });

        productDetailModal.style.display = "block";
    }
};

closeModal.addEventListener("click", () => {
    productDetailModal.style.display = "none";
});

const filterProducts = (): void => {
    const category = categoryFilter.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();
    const maxPrice = parseFloat(priceRange.value);

    filteredProducts = products.filter(product => {
        const matchesCategory = category ? product.category.toLowerCase().includes(category) : true;
        const matchesName = product.title.toLowerCase().includes(searchTerm);
        const matchesPrice = product.price <= maxPrice;

        return matchesCategory && matchesName && matchesPrice;
    });

    priceValue.textContent = `$${maxPrice}`;
    renderProducts(filteredProducts);
};

categoryFilter.addEventListener("change", filterProducts);
searchInput.addEventListener("input", filterProducts);
priceRange.addEventListener("input", filterProducts);

fetchProducts();
