function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&#39;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    // Добавьте больше сущностей при необходимости
  };
  return text.replace(
    /&#39;|&amp;|&lt;|&gt;|&quot;/g,
    (match) => entities[match] || match
  );
}

export default decodeHTMLEntities;
