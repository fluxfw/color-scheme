/**
 * @typedef {{addRoot: (root: Document | ShadowRoot) => Promise<void>, addRootStyleSheet: (style_sheet: CSSStyleSheet, beginning: boolean) => Promise<void>, addShadowStyleSheet: (style_sheet: CSSStyleSheet, beginning: boolean) => Promise<void>, addStyleSheetsToShadow: (shadow: ShadowRoot) => Promise<void>, generateVariablesRootStyleSheet: (prefix: string, variables: {[key: string]: string}, beginning: boolean) => Promise<void>}} StyleSheetManager
 */
