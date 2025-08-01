/**
 * Escapes single quotes (') and backslashes (\) in a given string
 * by prefixing them with a backslash. This is useful for safely
 * embedding the string in contexts like shell commands where
 * these characters have special meanings.
 *
 * Example:
 * escapePath("O'Reilly\\Docs") => "O\'Reilly\\Docs"
 */
export function escapePath(text: string) {
  return text.replace(/['\\]/g, "\\$&");
}
