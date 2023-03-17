import { COLOR_SCHEME_DARK } from "../COLOR_SCHEME.mjs";

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
     * @returns {Promise<MediaQueryList>}
     */
    async getSystemColorSchemeDetector() {
        return matchMedia(`(prefers-color-scheme:${COLOR_SCHEME_DARK})`);
    }
}
