import { VARIABLE_BACKGROUND, VARIABLE_FOREGROUND } from "../../../Adapter/ColorScheme/VARIABLE.mjs";

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
     * @returns {string[]}
     */
    getVariables(only_default = false) {
        return [
            ...new Set([
                VARIABLE_BACKGROUND,
                VARIABLE_FOREGROUND,
                ...(!only_default ? this.#additional_variables : null) ?? []
            ])
        ];
    }
}
