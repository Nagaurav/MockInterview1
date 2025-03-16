import { pipeline } from '@xenova/transformers';

let speechRecognizer: any = null;

export async function initializeSpeechRecognition() {
  if (!speechRecognizer) {
    speechRecognizer = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
  }
  return speechRecognizer;
}

export async function analyzeSpeech(audioBlob: Blob) {
  const recognizer = await initializeSpeechRecognition();
  
  // Convert blob to array buffer
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioData = new Float32Array(arrayBuffer);

  // Perform speech recognition
  const result = await recognizer(audioData, {
    task: 'transcribe',
    language: 'english',
  });

  // Analyze speech characteristics
  const analysis = await analyzeSpeechCharacteristics(audioData);

  return {
    transcript: result.text,
    ...analysis,
  };
}

async function analyzeSpeechCharacteristics(audioData: Float32Array) {
  // Calculate speech rate
  const speechRate = calculateSpeechRate(audioData);
  
  // Calculate clarity score
  const clarityScore = calculateClarityScore(audioData);
  
  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(audioData);

  return {
    speechRate,
    clarityScore,
    confidenceScore,
  };
}

function calculateSpeechRate(audioData: Float32Array): number {
  // Implement speech rate calculation using zero-crossing rate
  const zeroCrossings = countZeroCrossings(audioData);
  return normalizeScore(zeroCrossings / audioData.length * 1000);
}

function calculateClarityScore(audioData: Float32Array): number {
  // Implement clarity score calculation using signal-to-noise ratio
  const signalPower = calculateSignalPower(audioData);
  const noisePower = estimateNoisePower(audioData);
  const snr = signalPower / (noisePower || 1);
  return normalizeScore(snr);
}

function calculateConfidenceScore(audioData: Float32Array): number {
  // Implement confidence score calculation using amplitude variation
  const amplitudeVariation = calculateAmplitudeVariation(audioData);
  return normalizeScore(amplitudeVariation);
}

function countZeroCrossings(data: Float32Array): number {
  let crossings = 0;
  for (let i = 1; i < data.length; i++) {
    if ((data[i] >= 0 && data[i - 1] < 0) || (data[i] < 0 && data[i - 1] >= 0)) {
      crossings++;
    }
  }
  return crossings;
}

function calculateSignalPower(data: Float32Array): number {
  return data.reduce((sum, val) => sum + val * val, 0) / data.length;
}

function estimateNoisePower(data: Float32Array): number {
  // Estimate noise power using the lowest 10% of amplitudes
  const sortedAmplitudes = Array.from(data).map(Math.abs).sort();
  const noiseWindow = sortedAmplitudes.slice(0, Math.floor(data.length * 0.1));
  return noiseWindow.reduce((sum, val) => sum + val * val, 0) / noiseWindow.length;
}

function calculateAmplitudeVariation(data: Float32Array): number {
  const mean = data.reduce((sum, val) => sum + Math.abs(val), 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(Math.abs(val) - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
}

function normalizeScore(value: number): number {
  return Math.max(0, Math.min(100, value * 100));
}