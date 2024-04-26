
export function formatCurrency(value) {
  // Format the value as currency here, for example, using toLocaleString()
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};