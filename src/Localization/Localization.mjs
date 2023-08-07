/**
 * @typedef {{addModule: (module: string, localizations: {"fallback-default"?: boolean, "fallback-languages"?: string[], getTexts: () => Promise<{[key: string]: string}>, language: string}[]) => Promise<void>, translate: (module: string, key: string) => Promise<string>}} Localization
 */
