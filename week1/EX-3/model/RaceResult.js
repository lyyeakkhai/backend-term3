import { Duration } from "./Duration.js";
/**
 * This class handle a single race time for a given particicpant and sport type
 */
export class RaceResult {

  /**
   * Creates a new RaceResult.
   * @param {string} participantId - The participant ID.
   * @param {string} sport - The sport name.
   * @param {Duration} duration - The race duration.
   */
  constructor(participantId, sport, duration) {
    this.setParticipantId = participantId;
    this.setSport = sport;
    this.setDuration = duration;
  }

  /**
   * Sets and validates the participant ID.
   * @param {string} id - The participant ID.
   */
  set setParticipantId(id) {
    if (typeof id !== "string" || id.trim() === "") {
      throw new Error("Participant ID must be a non-empty string");
    }
    this.participantId = id;
  }

  /**
   * Gets the participant ID.
   * @returns {string} The participant ID.
   */
  get getParticipantId() {
    return this.participantId;
  }

  /**
   * Sets and validates the sport name.
   * @param {string} sport - The sport name.
   */
  set setSport(sport) {
    if (typeof sport !== "string" || sport.trim() === "") {
      throw new Error("Sport must be a non-empty string");
    }
    this.sport = sport;
  }

  /**
   * Gets the sport name.
   * @returns {string} The sport name.
   */
  get getSport() {
    return this.sport;
  }

  /**
   * Sets and validates the duration.
   * @param {Duration} duration - The race duration.
   */
  set setDuration(duration) {
    if (!(duration instanceof Duration)) {
      throw new Error("Duration must be an instance of the Duration class");
    }
    this.duration = duration;
  }

  /**
   * Gets the duration.
   * @returns {Duration} The race duration.
   */
  get getDuration() {
    return this.duration;
  }


  toString() {
    return `${this.participantId} - ${this.sport}: ${this.duration.toString()}`;
  }
}