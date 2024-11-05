/**
 * This function receives an string. If the length of the given string is larger than 'nameCharacterLimit'
 * the string will be splitted and '...' will be added in the middle.
 * If the string is shorter than 'nameCharacterLimit' the original string will be returned.
 *
 * @param name - The string to normalize.
 * @returns - The normalized string.
 */
export function normalizeName(name: string) {
  const nameCharacterLimit = 35;
  const maxCharactersBeforeCut = 26;
  const maxCharactersAfterCut = nameCharacterLimit - maxCharactersBeforeCut;

  if (name.length <= nameCharacterLimit) {
    return name;
  }

  const shortName =
    name.slice(0, maxCharactersBeforeCut) +
    "..." +
    name.slice(name.length - maxCharactersAfterCut, name.length);

  return shortName;
}
