import { AIFeedback } from '../types';
import { analyzeFaceMetrics } from '../ai/faceAnalysis';
import { analyzeSpeech } from '../ai/speechAnalysis';
import { supabase } from '../supabase';

export async function analyzeInterview(
  videoBlob: Blob,
  audioBlob: Blob,
  videoElement: HTMLVideoElement
): Promise<AIFeedback> {
  try {
    // Parallel analysis of face metrics and speech
    const [faceMetrics, speechAnalysis] = await Promise.all([
      analyzeFaceMetrics(videoElement),
      analyzeSpeech(audioBlob),
    ]);

    if (!faceMetrics || !speechAnalysis) {
      throw new Error('Analysis failed');
    }

    const feedback: AIFeedback = {
      confidenceScore: speechAnalysis.confidenceScore,
      clarityScore: speechAnalysis.clarityScore,
      eyeContactScore: faceMetrics.eyeContactScore,
      engagementScore: faceMetrics.engagementScore,
      feedback: generateFeedback(faceMetrics, speechAnalysis),
      timestamp: new Date(),
    };

    return feedback;
  } catch (error) {
    console.error('Interview analysis failed:', error);
    throw error;
  }
}

function generateFeedback(faceMetrics: any, speechAnalysis: any): string[] {
  const feedback: string[] = [];

  // Eye contact feedback
  if (faceMetrics.eyeContactScore < 70) {
    feedback.push('Try to maintain more consistent eye contact with the camera');
  } else if (faceMetrics.eyeContactScore >= 90) {
    feedback.push('Excellent eye contact maintained throughout');
  }

  // Speech clarity feedback
  if (speechAnalysis.clarityScore < 70) {
    feedback.push('Consider speaking more clearly and at a moderate pace');
  } else if (speechAnalysis.clarityScore >= 90) {
    feedback.push('Very clear and well-paced speech');
  }

  // Confidence feedback
  if (speechAnalysis.confidenceScore < 70) {
    feedback.push('Try to speak with more confidence and authority');
  } else if (speechAnalysis.confidenceScore >= 90) {
    feedback.push('Excellent confidence level in your responses');
  }

  // Engagement feedback
  if (faceMetrics.engagementScore < 70) {
    feedback.push('Show more enthusiasm and engagement in your responses');
  } else if (faceMetrics.engagementScore >= 90) {
    feedback.push('Great level of engagement and enthusiasm');
  }

  return feedback;
}

export async function saveFeedback(
  interviewId: string,
  userId: string,
  feedback: AIFeedback
): Promise<void> {
  const { error } = await supabase.from('feedback').insert({
    interview_id: interviewId,
    user_id: userId,
    confidence_score: feedback.confidenceScore,
    clarity_score: feedback.clarityScore,
    eye_contact_score: feedback.eyeContactScore,
    engagement_score: feedback.engagementScore,
    feedback_text: feedback.feedback,
  });

  if (error) throw error;
}