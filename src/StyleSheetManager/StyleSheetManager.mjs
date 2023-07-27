/**
 * @typedef {{addRoot: (root: Document | ShadowRoot) => Promise<void>, addStyleSheet: (style_sheet: CSSStyleSheet, beginning: boolean) => Promise<void>, generateVariableStyleSheet: (prefix: string, variables: {[key: string]: string}, beginning: boolean) => Promise<void>}} StyleSheetManager
 */
