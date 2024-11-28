var Cart = /** @class */ (function () {
    function Cart() {
        this.items = [];
    }
    Cart.prototype.addItem = function (product) {
        // Check if the product already exists in the cart
        var existingItem = this.items.find(function (item) { return item.id === product.id; });
        if (!existingItem) {
            // If it doesn't exist, set initial quantity for new items
            product.quantity = 1;
            this.items.push(product);
        }
        // No need to increment existingItem.quantity here
        this.updateCartSummary();
    };
    Cart.prototype.removeItem = function (productId) {
        this.items = this.items.filter(function (item) { return item.id !== productId; });
        this.updateCartSummary();
    };
    Cart.prototype.updateQuantity = function (productId, newQuantity) {
        var item = this.items.find(function (item) { return item.id === productId; });
        if (item) {
            item.quantity = newQuantity;
        }
        this.updateCartSummary();
    };
    Cart.prototype.getTotalPrice = function () {
        return this.items.reduce(function (total, item) { return total + (item.price * (item.quantity || 0)); }, 0);
    };
    Cart.prototype.getItemCount = function () {
        return this.items.reduce(function (count, item) { return count + (item.quantity || 0); }, 0);
    };
    Cart.prototype.updateCartSummary = function () {
        var cartCount = document.getElementById("cart-count");
        var cartTotal = document.getElementById("cart-total");
        if (cartCount) {
            cartCount.textContent = this.getItemCount().toString();
        }
        if (cartTotal) {
            cartTotal.textContent = "Total: $".concat(this.getTotalPrice().toFixed(2));
        }
        this.renderCartItems();
    };
    Cart.prototype.renderCartItems = function () {
        var _this = this;
        var cartItems = document.getElementById("cart-items");
        if (!cartItems) {
            console.error("Cart items element not found");
            return; // Exit the function if cartItems is not found
        }
        cartItems.innerHTML = ''; // Clear existing items
        this.items.forEach(function (item) {
            var _a;
            // Create a container for each item
            var itemContainer = document.createElement('div');
            itemContainer.className = 'cart-item'; // Optional: Add a class for styling
            // Create elements for item name and price
            var itemName = document.createElement('span');
            itemName.textContent = item.name;
            var itemPrice = document.createElement('span');
            itemPrice.textContent = "$".concat(item.price.toFixed(2));
            var quantityCell = document.createElement('span');
            // Add quantity input for editing
            var quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = ((_a = item.quantity) === null || _a === void 0 ? void 0 : _a.toString()) || '1'; // Default to '1' if quantity is undefined
            quantityInput.min = '1';
            quantityInput.addEventListener('change', function () {
                var newQuantity = parseInt(quantityInput.value);
                if (newQuantity > 0) {
                    _this.updateQuantity(item.id, newQuantity);
                }
                else {
                    console.error("Quantity must be greater than 0");
                }
            });
            quantityCell.appendChild(quantityInput);
            // Add remove button
            var removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function () {
                _this.removeItem(item.id);
            });
            // Append all elements to the item container
            itemContainer.appendChild(itemName);
            itemContainer.appendChild(itemPrice);
            itemContainer.appendChild(quantityCell);
            itemContainer.appendChild(removeButton);
            // Append the item container to the cart items
            cartItems.appendChild(itemContainer);
        });
    };
    return Cart;
}());
