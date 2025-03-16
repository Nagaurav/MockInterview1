import React from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  Brain,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../App';
import { useProfile } from '../lib/hooks/useProfile';
import { useAnalytics } from '../lib/hooks/useAnalytics';
import { format, subDays } from 'date-fns';

function Dashboard() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { data: analytics, loading: analyticsLoading, error } = useAnalytics(30); // Last 30 days

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load dashboard data</span>
        </div>
      </div>
    );
  }

  if (profileLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
        </h1>
        <Link
          to="/video-bot"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
        >
          Start Interview
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Interviews</p>
              <p className="text-2xl font-semibold">{analytics?.totalInterviews || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Practice Hours</p>
              <p className="text-2xl font-semibold">
                {(analytics?.totalDuration / 60).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Score</p>
              <p className="text-2xl font-semibold">{analytics?.averageScore || 0}%</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Improvement</p>
              <p className="text-2xl font-semibold">
                {analytics?.improvementRate > 0 ? '+' : ''}
                {analytics?.improvementRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-secondary rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Weekly Progress</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.scoreHistory || []}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--secondary))',
                }}
                formatter={(value: number) => [`${value}%`, 'Score']}
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-secondary rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">AI Recommendations</h2>
        <div className="space-y-4">
          {analytics?.skillsDistribution.map((skill, index) => (
            <div key={skill.name} className="flex items-start gap-3">
              <Brain className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="font-medium">{skill.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(skill.value)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {getSkillRecommendation(skill.name, skill.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/custom-modes"
          className="bg-secondary rounded-2xl p-6 hover:bg-accent transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">Custom Interview</h3>
          <p className="text-sm text-muted-foreground">
            Create a personalized interview session tailored to your needs
          </p>
        </Link>
        <Link
          to="/analysis"
          className="bg-secondary rounded-2xl p-6 hover:bg-accent transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">View Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Get detailed insights into your interview performance
          </p>
        </Link>
        <Link
          to="/recordings"
          className="bg-secondary rounded-2xl p-6 hover:bg-accent transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">Past Recordings</h3>
          <p className="text-sm text-muted-foreground">
            Review your previous interview sessions
          </p>
        </Link>
      </div>
    </div>
  );
}

function getSkillRecommendation(skillName: string, value: number): string {
  if (value >= 90) {
    return `Excellent ${skillName.toLowerCase()}! Keep maintaining this high standard.`;
  }
  if (value >= 75) {
    return `Good ${skillName.toLowerCase()}, but there's room for minor improvements.`;
  }
  if (value >= 60) {
    return `Your ${skillName.toLowerCase()} needs some work. Consider focusing on this area.`;
  }
  return `Improvement needed in ${skillName.toLowerCase()}. This should be a priority focus area.`;
}

export default Dashboard;