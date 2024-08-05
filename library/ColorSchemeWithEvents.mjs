/** @typedef {import("./ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./ColorSchemeChangeEvent.mjs").ColorSchemeChangeEvent} ColorSchemeChangeEvent */
/** @typedef {import("./ColorSchemeRenderEvent.mjs").ColorSchemeRenderEvent} ColorSchemeRenderEvent */

/**
 * @typedef {ColorScheme & {addEventListener: ((type: "change", callback: (event: ColorSchemeChangeEvent) => void, options?: boolean | AddEventListenerOptions) => void) & ((type: "render", callback: (event: ColorSchemeRenderEvent) => void, options?: boolean | AddEventListenerOptions) => void), removeEventListener: ((type: "change", callback: (event: ColorSchemeChangeEvent) => void, options?: boolean | EventListenerOptions) => void) & ((type: "render", callback: (event: ColorSchemeRenderEvent) => void, options?: boolean | EventListenerOptions) => void)}} ColorSchemeWithEvents
 */
