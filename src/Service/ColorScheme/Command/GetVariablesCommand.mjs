import { VARIABLE_ACCENT, VARIABLE_ACCENT_FOREGROUND, VARIABLE_ACCENT_FOREGROUND_RGB, VARIABLE_ACCENT_RGB, VARIABLE_BACKGROUND, VARIABLE_BACKGROUND_RGB, VARIABLE_FOREGROUND, VARIABLE_FOREGROUND_RGB } from "../../../Adapter/ColorScheme/VARIABLE.mjs";

export class GetVariablesCommand {
    /**
     * @type {string[] | null}
     */
    #additional_variables;

    /**
     * @param {string[] | null} additional_variables
     * @returns {GetVariablesCommand}
     */
    static new(additional_variables = null) {
        return new this(
            additional_variables
        );
    }

    /**
     * @param {string[] | null} additional_variables
     * @private
     */
    constructor(additional_variables) {
        this.#additional_variables = additional_variables;
    }

    /**
     * @param {boolean} only_default
     * @returns {Promise<string[]>}
     */
    async getVariables(only_default = false) {
        return [
            ...new Set([
                VARIABLE_ACCENT,
                VARIABLE_ACCENT_FOREGROUND,
                VARIABLE_ACCENT_FOREGROUND_RGB,
                VARIABLE_ACCENT_RGB,
                VARIABLE_BACKGROUND,
                VARIABLE_BACKGROUND_RGB,
                VARIABLE_FOREGROUND,
                VARIABLE_FOREGROUND_RGB,
                ...(!only_default ? this.#additional_variables : null) ?? []
            ])
        ];
    }
}
