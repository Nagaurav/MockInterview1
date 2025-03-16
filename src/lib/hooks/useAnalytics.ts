import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../App';
import { format, subDays } from 'date-fns';

interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  totalDuration: number;
  improvementRate: number;
  performanceByType: Record<string, number>;
  scoreHistory: Array<{ date: string; score: number }>;
  skillsDistribution: Array<{ name: string; value: number }>;
}

export function useAnalytics(days: number = 30) {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');

        // Fetch interviews data with feedback
        const { data: interviews, error: interviewsError } = await supabase
          .from('interviews')
          .select(`
            *,
            feedback (
              confidence_score,
              clarity_score,
              eye_contact_score,
              engagement_score,
              speech_rate,
              response_quality,
              answer_structure
            )
          `)
          .eq('user_id', user.id)
          .gte('created_at', startDate)
          .order('created_at', { ascending: true });

        if (interviewsError) throw interviewsError;

        // Calculate analytics
        const analytics = calculateAnalytics(interviews);
        setData(analytics);

        // Set up real-time subscription for updates
        const subscription = supabase
          .channel('analytics_changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'interviews',
            filter: `user_id=eq.${user.id}`,
          }, async () => {
            // Refresh analytics when data changes
            const { data: updatedInterviews } = await supabase
              .from('interviews')
              .select(`
                *,
                feedback (
                  confidence_score,
                  clarity_score,
                  eye_contact_score,
                  engagement_score,
                  speech_rate,
                  response_quality,
                  answer_structure
                )
              `)
              .eq('user_id', user.id)
              .gte('created_at', startDate)
              .order('created_at', { ascending: true });

            if (updatedInterviews) {
              setData(calculateAnalytics(updatedInterviews));
            }
          })
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, days]);

  return { data, loading, error };
}

function calculateAnalytics(interviews: any[]): AnalyticsData {
  // Calculate total interviews
  const totalInterviews = interviews.length;

  // Calculate average score
  const scores = interviews.map(i => i.score).filter(Boolean);
  const averageScore = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;

  // Calculate total duration in minutes
  const totalDuration = interviews.reduce((total, interview) => {
    if (!interview.duration) return total;
    const matches = interview.duration.match(/(\d+):(\d+):(\d+)/);
    if (!matches) return total;
    const [, hours, minutes, seconds] = matches;
    return total + parseInt(hours) * 60 + parseInt(minutes) + parseInt(seconds) / 60;
  }, 0);

  // Calculate improvement rate
  const improvementRate = calculateImprovementRate(interviews);

  // Calculate performance by type
  const performanceByType = calculatePerformanceByType(interviews);

  // Calculate score history
  const scoreHistory = interviews.map(interview => ({
    date: interview.created_at,
    score: interview.score || 0,
  }));

  // Calculate skills distribution from feedback
  const skillsDistribution = calculateSkillsDistribution(interviews);

  return {
    totalInterviews,
    averageScore,
    totalDuration,
    improvementRate,
    performanceByType,
    scoreHistory,
    skillsDistribution,
  };
}

function calculateImprovementRate(interviews: any[]): number {
  if (interviews.length < 2) return 0;

  const firstFive = interviews.slice(0, 5);
  const lastFive = interviews.slice(-5);

  const firstAvg = firstFive.reduce((sum, i) => sum + (i.score || 0), 0) / firstFive.length;
  const lastAvg = lastFive.reduce((sum, i) => sum + (i.score || 0), 0) / lastFive.length;

  return ((lastAvg - firstAvg) / firstAvg) * 100;
}

function calculatePerformanceByType(interviews: any[]): Record<string, number> {
  const typeScores: Record<string, number[]> = {};

  interviews.forEach(interview => {
    if (!interview.score) return;
    
    if (!typeScores[interview.type]) {
      typeScores[interview.type] = [];
    }
    typeScores[interview.type].push(interview.score);
  });

  return Object.fromEntries(
    Object.entries(typeScores).map(([type, scores]) => [
      type,
      scores.reduce((a, b) => a + b, 0) / scores.length,
    ])
  );
}

function calculateSkillsDistribution(interviews: any[]): Array<{ name: string; value: number }> {
  const skills = [
    { name: 'Communication', keys: ['clarity_score', 'speech_rate'] },
    { name: 'Confidence', keys: ['confidence_score'] },
    { name: 'Engagement', keys: ['eye_contact_score', 'engagement_score'] },
    { name: 'Technical Knowledge', keys: ['response_quality'] },
    { name: 'Structure', keys: ['answer_structure'] },
  ];

  return skills.map(skill => {
    let totalScore = 0;
    let count = 0;

    interviews.forEach(interview => {
      if (!interview.feedback || interview.feedback.length === 0) return;

      skill.keys.forEach(key => {
        interview.feedback.forEach((feedback: any) => {
          if (feedback[key] !== null) {
            totalScore += feedback[key];
            count++;
          }
        });
      });
    });

    return {
      name: skill.name,
      value: count > 0 ? totalScore / (count * skill.keys.length) : 0,
    };
  });
}