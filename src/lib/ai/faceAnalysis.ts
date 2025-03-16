import * as faceapi from 'face-api.js';

let isInitialized = false;

async function initializeFaceAPI() {
  if (isInitialized) return;

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  ]);

  isInitialized = true;
}

export async function analyzeFaceMetrics(videoElement: HTMLVideoElement) {
  await initializeFaceAPI();

  const detection = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  if (!detection) return null;

  const { expressions, landmarks } = detection;
  
  // Calculate eye contact score based on face position
  const eyeContactScore = calculateEyeContactScore(landmarks.positions);
  
  // Calculate engagement score based on expressions
  const engagementScore = calculateEngagementScore(expressions);

  return {
    eyeContactScore,
    engagementScore,
    expressions,
  };
}

function calculateEyeContactScore(landmarks: faceapi.Point[]): number {
  // Calculate deviation from center
  const centerX = landmarks[27].x; // Nose bridge point
  const idealX = 0.5; // Center of frame
  const deviation = Math.abs(centerX - idealX);
  
  // Convert to 0-100 score
  return Math.max(0, Math.min(100, 100 * (1 - deviation * 2)));
}

function calculateEngagementScore(expressions: faceapi.FaceExpressions): number {
  // Weight different expressions
  const weights = {
    happy: 1.0,
    neutral: 0.7,
    surprised: 0.5,
    angry: -0.5,
    disgusted: -0.5,
    fearful: -0.3,
    sad: -0.3,
  };

  let score = 0;
  let totalWeight = 0;

  Object.entries(expressions).forEach(([expression, value]) => {
    const weight = weights[expression as keyof typeof weights] || 0;
    score += value * weight;
    totalWeight += Math.abs(weight);
  });

  // Normalize to 0-100
  return Math.max(0, Math.min(100, (score / totalWeight) * 100));
}