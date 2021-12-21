"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractorModel = void 0;
const tslib_1 = require("tslib");
class ExtractorModel {
    /**
     * Model for raw Discord Player extractors
     * @param {string} extractorName Name of the extractor
     * @param {object} data Extractor object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(extractorName, data) {
        /**
         * The extractor name
         * @type {string}
         */
        this.name = extractorName;
        /**
         * The raw model
         * @name ExtractorModel#_raw
         * @type {any}
         * @private
         */
        Object.defineProperty(this, "_raw", { value: data, configurable: false, writable: false, enumerable: false });
    }
    /**
     * Method to handle requests from `Player.play()`
     * @param {string} query Query to handle
     * @returns {Promise<ExtractorModelData>}
     */
    handle(query) {
        var _a, _b, _c;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const data = yield this._raw.getInfo(query);
            if (!data)
                return null;
            return {
                playlist: (_a = data.playlist) !== null && _a !== void 0 ? _a : null,
                data: (_c = (_b = data.info) === null || _b === void 0 ? void 0 : _b.map((m) => ({
                    title: m.title,
                    duration: m.duration,
                    thumbnail: m.thumbnail,
                    engine: m.engine,
                    views: m.views,
                    author: m.author,
                    description: m.description,
                    url: m.url,
                    source: m.source || "arbitrary"
                }))) !== null && _c !== void 0 ? _c : []
            };
        });
    }
    /**
     * Method used by Discord Player to validate query with this extractor
     * @param {string} query The query to validate
     * @returns {boolean}
     */
    validate(query) {
        return Boolean(this._raw.validate(query));
    }
    /**
     * The extractor version
     * @type {string}
     */
    get version() {
        var _a;
        return (_a = this._raw.version) !== null && _a !== void 0 ? _a : "0.0.0";
    }
}
exports.ExtractorModel = ExtractorModel;
