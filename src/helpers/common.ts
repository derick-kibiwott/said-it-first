/**
 * Returns the initials of a full name.
 * Example: "Steve Jobs" => "SJ"
 */
export function getInitials(name: string): string {
  if (!name) return "";

  // Split the name by spaces and filter out empty strings
  const words = name.trim().split(/\s+/);

  // Take the first character of each word, uppercase it, and join
  const initials = words.map((word) => word[0].toUpperCase()).join("");

  return initials;
}
