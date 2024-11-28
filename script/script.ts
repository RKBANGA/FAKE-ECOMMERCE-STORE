interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity?: number; // Add quantity to Product interface
}

class Cart {
  private items: Product[] = [];

  addItem(product: Product) {
    // Check if the product already exists in the cart
    let existingItem = this.items.find(item => item.id === product.id);
    if (!existingItem) {
      // If it doesn't exist, set initial quantity for new items
      product.quantity = 1; 
      this.items.push(product);
    }
    // No need to increment existingItem.quantity here
    this.updateCartSummary();
  }

  removeItem(productId: number) {
    this.items = this.items.filter(item => item.id !== productId);
    this.updateCartSummary();
  }

  updateQuantity(productId: number, newQuantity: number) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
    }
    this.updateCartSummary();
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price * (item.quantity || 0)), 0);
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + (item.quantity || 0), 0);
  }

  private updateCartSummary() {
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    if (cartCount) {
      cartCount.textContent = this.getItemCount().toString();
    }
    if (cartTotal) {
      cartTotal.textContent = `Total: $${this.getTotalPrice().toFixed(2)}`;
    }

    this.renderCartItems();
  }

  private renderCartItems() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) {
      console.error("Cart items element not found");
      return; // Exit the function if cartItems is not found
    }

    cartItems.innerHTML = ''; // Clear existing items

    this.items.forEach(item => {
      // Create a container for each item
      const itemContainer = document.createElement('div');
      itemContainer.className = 'cart-item'; // Optional: Add a class for styling

      // Create elements for item name and price
      const itemName = document.createElement('span');
      itemName.textContent = item.name;

      const itemPrice = document.createElement('span');
      itemPrice.textContent = `$${item.price.toFixed(2)}`;

      const quantityCell = document.createElement('span');

      // Add quantity input for editing
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.value = item.quantity?.toString() || '1'; // Default to '1' if quantity is undefined
      quantityInput.min = '1';
      quantityInput.addEventListener('change', () => {
        const newQuantity = parseInt(quantityInput.value);
        if (newQuantity > 0) {
          this.updateQuantity(item.id, newQuantity);
        } else {
          console.error("Quantity must be greater than 0");
        }
      });
      quantityCell.appendChild(quantityInput);

      // Add remove button
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        this.removeItem(item.id);
      });

      // Append all elements to the item container
      itemContainer.appendChild(itemName);
      itemContainer.appendChild(itemPrice);
      itemContainer.appendChild(quantityCell);
      itemContainer.appendChild(removeButton);

      // Append the item container to the cart items
      cartItems.appendChild(itemContainer);
    });
  }
}