
import { Duration } from "../model/Duration.js";
import { RaceResult } from "../model/RaceResult.js";
import fs from "node:fs";
/**
 * This class handle the race results management system.
 */
export class RaceResultsService {
  /**
   * The list of race results.
   * @type {Array<RaceResult>}
   * @private
   */
  _raceResults = [];


  get raceResults() {
    return [...this._raceResults];
  }

  /**
   * Adds a new race result to the race list.
   * @param {RaceResult} result - The race result.
   */
  addRaceResult(result) {
    if (!(result instanceof RaceResult)) {
      throw new Error("Result must be an instance of RaceResult");
    }
    this._raceResults.push(result);
  }

  /**
   * Saves the race results list to a JSON file.
   * @param {string} filePath - The path to the file where data should be saved.
   */
  saveToFile(filePath) {
    if (typeof filePath !== "string" || filePath.trim() === "") {
      throw new Error("filePath must be a non-empty string");
    }

     try {
       const serializableResults = this._raceResults.map((result) => ({
         participantId: result.participantId,
         sport: result.sport,
         totalSeconds: result.duration.totalSeconds,
       }));
      const data = JSON.stringify(serializableResults, null, 2);
      fs.writeFileSync(filePath, data, "utf-8");
    } catch (error) {
      console.error("Error saving race results to file:", error);
    }
  }

  /**
   * Loads the race results list from a JSON file.
   * @param {string} filePath - The path to the file to load data from.
   * @returns {boolean} True if loading was successful, false otherwise.
   */
  loadFromFile(filePath) {
    // Validate filePath
    if (typeof filePath !== "string" || filePath.trim() === "") {
      throw new Error("filePath must be a non-empty string");
    }

    // we try to read the file and parse the data, if any error occurs we catch it and return false
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(data);

      // Validate that the parsed data is an array
      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid data format: expected an array");
      }

      // we map the parsed data to RaceResult instances, validating the totalSeconds value
      this._raceResults = jsonData.map((item) => {
        const totalSeconds = Number(
          item.totalSeconds ?? item.duration?._totalSeconds ?? item.duration
        );

        if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
          throw new Error("Invalid duration value in race result data");
        }

        return new RaceResult(item.participantId, item.sport, new Duration(totalSeconds));
      });
      return true;
    } catch (error) {
      console.error("Error loading race results from file:", error);
      return false;
    }
  }

  /**
   * Retrieves the race time for a given participant and sport.
   * @param {string} participantId - Participant ID.
   * @param {string} sport - Sport name.
   * @returns {Duration|null} Duration if found, else null.
   */


  getTimeForParticipant(participantId, sport) {
    if (typeof participantId !== "string" || participantId.trim() === "") {
      throw new Error("participantId must be a non-empty string");
    }
    if (typeof sport !== "string" || sport.trim() === "") {
      throw new Error("sport must be a non-empty string");
    }

    const result = this._raceResults.find(
      (raceResult) => raceResult.participantId === participantId && raceResult.sport === sport
    );
    return result ? result.duration : null;
  }

  /**
   * Computes the total time for a given participant by summing their race times.
   * @param {string} participantId - The ID of the participant.
   * @returns {Duration|null} The total Duration object if found, otherwise null.
   */



  getTotalTimeForParticipant(participantId) {
    if (typeof participantId !== "string" || participantId.trim() === "") {
      throw new Error("participantId must be a non-empty string");
    }

    const participantResults = this._raceResults.filter(
      (raceResult) => raceResult.participantId === participantId
    );

    if (participantResults.length === 0) {
      return null;
    }

    const totalTime = participantResults.reduce(
      (total, result) => total.plus(result.duration),
      new Duration(0)
    );
    return totalTime;
  }
}
