/**
 * Formate un montant centimes en valeur lisible
 */
export function formatMoney(
  amountInCents: number,
  currency: string = "XOF",
  locale: string = "fr-FR"
): string {
  const amount = amountInCents / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString(locale)} ${currency}`;
  }
}

/**
 * Convertit un montant en centimes
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convertit des centimes en montant décimal
 */
export function fromCents(cents: number): number {
  return cents / 100;
}

/**
 * Calcule un pourcentage de variation entre deux valeurs
 */
export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}
