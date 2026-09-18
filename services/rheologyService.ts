/**
 * @fileoverview Implements Cognitive Rheology & Variable Viscosity Prompting.
 */

import { RheologicalController, ZoneCalibration } from '../types';

export enum ViscosityMode {
  CRYSTAL = 'CRYSTAL',
  CLOUD = 'CLOUD'
}

export interface TelemetryData {
  semanticEntropy: number;
  repetitionLoopDetected: boolean;
}

/**
 * Default calibration for the Rheological Controller.
 */
const DEFAULT_CALIBRATION = {
  crystalZone: {
    temperature: 0.0,
    topP: 0.10,
    adjectivalBound: 0,
    pydanticSchemaEnforcement: true,
    grammarConstraints: "GBNF_STRICT_JSON",
    saltedTags: ["<data_x9f2>", "</data_x9f2>"]
  },
  cloudZone: {
    temperature: 0.85,
    topP: 0.90,
    adjectivalBound: 3,
    pydanticSchemaEnforcement: false,
    structuralRedundancyRatio: 0.15,
    navigationalBallast: "explicit_re_priming_tokens"
  }
};

/**
 * The Rheological Mode Switcher (RMS).
 * Monitors telemetry and autonomous switches inference modes.
 */
export class RheologicalModeSwitcher {
  private currentMode: ViscosityMode = ViscosityMode.CRYSTAL;
  private entropyThreshold = 0.04;

  /**
   * Processes telemetry and determines the correct operating mode.
   *
   * @param {TelemetryData} telemetry - Real-time execution telemetry.
   * @returns {ZoneCalibration} The determined zone calibration to use.
   */
  public evaluateTelemetry(telemetry: TelemetryData): ZoneCalibration {
    // Sisyphus Loop detected: decrease viscosity (heat up to Cloud Mode)
    if (telemetry.repetitionLoopDetected) {
      this.currentMode = ViscosityMode.CLOUD;
      return DEFAULT_CALIBRATION.cloudZone;
    }

    // Semantic Entropy spike detected (Performance Collapse Zone): increase viscosity (cool down to Crystal Mode)
    if (telemetry.semanticEntropy > this.entropyThreshold) {
      this.currentMode = ViscosityMode.CRYSTAL;
      return DEFAULT_CALIBRATION.crystalZone;
    }

    // Default fallback based on current mode
    return this.currentMode === ViscosityMode.CRYSTAL
      ? DEFAULT_CALIBRATION.crystalZone
      : DEFAULT_CALIBRATION.cloudZone;
  }

  /**
   * Forcibly sets the operating mode (used for specific tasks where mode is known apriori).
   *
   * @param {ViscosityMode} mode - The mode to set.
   * @returns {ZoneCalibration}
   */
  public forceMode(mode: ViscosityMode): ZoneCalibration {
    this.currentMode = mode;
    return mode === ViscosityMode.CRYSTAL ? DEFAULT_CALIBRATION.crystalZone : DEFAULT_CALIBRATION.cloudZone;
  }

  public getCurrentMode(): ViscosityMode {
      return this.currentMode;
  }
}
