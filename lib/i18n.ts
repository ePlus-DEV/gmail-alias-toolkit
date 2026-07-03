type MessageSubstitution = string | string[];

/** Returns a localized extension message, falling back to the message key. */
export function t(messageName: string, substitutions?: MessageSubstitution) {
  try {
    return (
      browser.i18n.getMessage(messageName as never, substitutions) ||
      messageName
    );
  } catch {
    return messageName;
  }
}
