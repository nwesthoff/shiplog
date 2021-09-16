export function shortFormatDistance(sinceString: string) {
  const shortString = sinceString
    .replace(/\b(seconds?|minutes?|hours?|days?|weeks?|years?)\b/, (_match, p1) =>
      p1.substr(0, 1)
    )
    .replace(/\b(months?)\b/, 'mo')
    .replace(' ', '');

  return shortString;
}
