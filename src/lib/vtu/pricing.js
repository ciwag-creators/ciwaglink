export function calculateSellingPrice(providerPrice) {
  const price = Number(providerPrice);

  if (price <= 500) {
    return price + 80; // small plans
  }

  if (price <= 2000) {
    return Math.ceil(price * 1.15); // mid plans (15%)
  }

  return Math.ceil(price * 1.2); // big plans (20%)
}