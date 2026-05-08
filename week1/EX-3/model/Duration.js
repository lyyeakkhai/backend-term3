/**
 * Represents a duration of time, stored internally as total seconds.
 * Immutable: all operations return a new instance.
 */

export class Duration {
    /**
     * Total duration in seconds.
     * @type {number}
     */
        // this fild should be private and not accessible outside the class, so we use # to make it private
    #totalSeconds;

    /**
     * Validates that a value is a finite, non-negative integer.
     * @param {number} value
     * @param {string} name
     */
    // validation logic is repeated in multiple places, so we can extract it to a private static method to avoid code duplication and improve maintainability
    static #assertValidSeconds(value, name = "value") {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error(`${name} must be a finite number`);
        }

        if (!Number.isInteger(value)) {
            throw new Error(`${name} must be an integer`);
        }

        if (value < 0) {
            throw new Error(`${name} cannot be negative`);
        }
    }

    /**
     * Creates a new Duration object.
     * @param {number} [seconds=0] - The number of seconds.
     */
    constructor(seconds = 0) {
        Duration.#assertValidSeconds(seconds, "Duration");
        this.#totalSeconds = seconds;
    }

    /**
     * Gets the total duration in seconds.
     * @returns {number} The total duration in seconds.
     */
    get totalSeconds() {
        return this.#totalSeconds;
    }

    /**
     * Creates a new Duration from a number of minutes and seconds.
     * @param {number} [minutes=0] - The number of minutes.
     * @param {number} [seconds=0] - The number of seconds.
     * @returns {Duration} A new Duration instance.
     */
    static fromMinutesAndSeconds(minutes = 0, seconds = 0) {
        Duration.#assertValidSeconds(minutes, "minutes");
        Duration.#assertValidSeconds(seconds, "seconds");

        return new Duration(minutes * 60 + seconds);
    }

    /**
     * Returns a new Duration by adding another duration.
     * @param {Duration} other - Another duration to add.
     * @returns {Duration} A new Duration representing the sum.
     */
    plus(other) {
        return new Duration(this.#totalSeconds + other.totalSeconds);
    }

    /**
     * Returns a new Duration by subtracting another duration.
     * Negative results are clamped to zero.
     * @param {Duration} other - Another duration to subtract.
     * @returns {Duration} A new Duration representing the difference.
     */
    minus(other) {
        return new Duration(Math.max(0, this.#totalSeconds - other.totalSeconds));
    }

    /**
     * Converts the duration into a human-readable string, e.g., "2m 30s".
     * @returns {string} The formatted duration string.
     */
    toString() {
        const minutes = Math.floor(this.#totalSeconds / 60);
        const seconds = this.#totalSeconds % 60;
        return `${minutes}m ${seconds}s`;
    }
}
