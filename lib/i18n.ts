type MessageSubstitution = string | string[];

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
