import { describe, it, expect, beforeEach } from 'vitest';
import { RheologicalModeSwitcher, ViscosityMode } from './rheologyService';

describe('RheologicalModeSwitcher', () => {
  let rms: RheologicalModeSwitcher;

  beforeEach(() => {
    rms = new RheologicalModeSwitcher();
  });

  it('should default to CRYSTAL mode', () => {
    expect(rms.getCurrentMode()).toBe(ViscosityMode.CRYSTAL);
  });

  it('should evaluate telemetry and switch to CRYSTAL mode on high semantic entropy', () => {
    // Force to cloud first
    rms.forceMode(ViscosityMode.CLOUD);
    expect(rms.getCurrentMode()).toBe(ViscosityMode.CLOUD);

    const calibration = rms.evaluateTelemetry({ semanticEntropy: 0.05, repetitionLoopDetected: false });

    expect(rms.getCurrentMode()).toBe(ViscosityMode.CRYSTAL);
    expect(calibration.temperature).toBe(0.0);
    expect(calibration.topP).toBe(0.10);
    expect(calibration.pydanticSchemaEnforcement).toBe(true);
  });

  it('should evaluate telemetry and switch to CLOUD mode on repetition loop detection', () => {
    // Defaults to crystal
    expect(rms.getCurrentMode()).toBe(ViscosityMode.CRYSTAL);

    const calibration = rms.evaluateTelemetry({ semanticEntropy: 0.01, repetitionLoopDetected: true });

    expect(rms.getCurrentMode()).toBe(ViscosityMode.CLOUD);
    expect(calibration.temperature).toBe(0.85);
    expect(calibration.topP).toBe(0.90);
    expect(calibration.pydanticSchemaEnforcement).toBe(false);
  });

  it('should prioritize Sisyphus Loop (decrease viscosity) over Entropy Spike', () => {
    // If both are true, it should heat up to escape the loop
    const calibration = rms.evaluateTelemetry({ semanticEntropy: 0.05, repetitionLoopDetected: true });

    expect(rms.getCurrentMode()).toBe(ViscosityMode.CLOUD);
    expect(calibration.temperature).toBe(0.85);
  });

  it('should force mode correctly', () => {
    const cloudCalibration = rms.forceMode(ViscosityMode.CLOUD);
    expect(rms.getCurrentMode()).toBe(ViscosityMode.CLOUD);
    expect(cloudCalibration.temperature).toBe(0.85);

    const crystalCalibration = rms.forceMode(ViscosityMode.CRYSTAL);
    expect(rms.getCurrentMode()).toBe(ViscosityMode.CRYSTAL);
    expect(crystalCalibration.temperature).toBe(0.0);
  });
});
