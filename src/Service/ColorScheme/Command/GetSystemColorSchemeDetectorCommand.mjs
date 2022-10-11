import { COLOR_SCHEME_DARK } from "../../../Adapter/ColorScheme/COLOR_SCHEME.mjs";

export class GetSystemColorSchemeDetectorCommand {
    /**
     * @returns {GetSystemColorSchemeDetectorCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @returns {MediaQueryList}
     */
    getSystemColorSchemeDetector() {
        return matchMedia(`(prefers-color-scheme:${COLOR_SCHEME_DARK})`);
    }
}
