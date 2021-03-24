export function capitalize(str) {
  return str.length > 0 && str.replace(/^\w/, str[0].toUpperCase());
}
