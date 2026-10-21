/** Render the current catalog brand without rewriting legacy saved food snapshots. */
export function foodSourceLabel(source: string): string {
  return source.replace(/^Form\s?Fuel(?= starter catalog\b)/i, 'VAJRYA');
}
