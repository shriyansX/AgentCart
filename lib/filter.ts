import { Product, ShoppingIntent } from "./ai";

export function filterProducts(products: Product[], intent: ShoppingIntent): Product[] {
  return products.filter((product) => {
    // Check category match (simple includes for now)
    const categoryMatch = product.category.toLowerCase().includes(intent.category.toLowerCase()) || 
                          product.name.toLowerCase().includes(intent.category.toLowerCase());
    
    if (!categoryMatch && intent.category !== "") return false;

    // Check budget
    if (intent.maxBudget && product.price > intent.maxBudget) {
      return false;
    }

    return true;
  }).sort((a, b) => b.rating - a.rating); // Sort by rating by default
}
