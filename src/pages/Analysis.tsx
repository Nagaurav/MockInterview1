import React, { useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  Video,
  Brain,
  Download,
  Share2,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAnalytics } from '../lib/hooks/useAnalytics';
import { useAuth } from '../App';
import { format } from 'date-fns';
import { cn, formatDuration } from '../lib/utils';

const COLORS = ['#4f46e5', '#3b82f6', '#6366f1', '#8b5cf6'];

function Analysis() {
  const { user } = useAuth();
  const { data: analytics, loading, error } = useAnalytics(30); // Last 30 days

  useEffect(() => {
    document.title = 'Performance Analysis | InterviewAI';
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load analytics data: {error}</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">
            Complete some interviews to see your performance analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Performance Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Detailed breakdown of your interview performance and AI-driven insights
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-secondary flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latest Score</p>
              <p className="text-2xl font-semibold">
                {analytics.scoreHistory[analytics.scoreHistory.length - 1]?.score || 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="text-2xl font-semibold">
                {formatDuration(analytics.totalDuration)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Interviews</p>
              <p className="text-2xl font-semibold">{analytics.totalInterviews}</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Improvement</p>
              <p className={cn(
                "text-2xl font-semibold",
                analytics.improvementRate > 0 ? "text-green-500" : "text-red-500"
              )}>
                {analytics.improvementRate > 0 ? '+' : ''}
                {analytics.improvementRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Performance Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.scoreHistory}>
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

        {/* Skills Distribution */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Skills Distribution</h2>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.skillsDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.skillsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--secondary))',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {analytics.skillsDistribution.map((skill, index) => (
              <div key={skill.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-secondary rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.skillsDistribution.map((skill) => (
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

      {/* Latest Interview */}
      {analytics.latestRecording && (
        <div className="bg-secondary rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Latest Interview Recording</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 text-primary">
                <Share2 className="h-5 w-5" />
                Share
              </button>
              <a
                href={analytics.latestRecording.video_url}
                download
                className="flex items-center gap-2 text-primary"
              >
                <Download className="h-5 w-5" />
                Download
              </a>
            </div>
          </div>
          <div className="aspect-video bg-background rounded-lg">
            <video
              className="w-full h-full rounded-lg object-cover"
              src={analytics.latestRecording.video_url}
              controls
            />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(analytics.latestRecording.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{analytics.latestRecording.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>{analytics.latestRecording.score}% Score</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {analytics.latestRecording.title}
            </p>
          </div>
        </div>
      )}
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

export default Analysis;