import React from 'react';
import {
  Briefcase,
  Code,
  Users,
  Brain,
  Gauge,
  Eye,
  Languages,
  Clock,
  Mic,
  Video,
  MessageSquare,
  Settings,
} from 'lucide-react';

function CustomModes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Custom Interview Modes</h1>
        <p className="text-muted-foreground mt-2">
          Customize your interview experience based on your needs and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Interview Types */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Interview Type</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
              <span>General</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
              <Code className="h-5 w-5" />
              <span>Technical</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
              <Users className="h-5 w-5" />
              <span>Behavioral</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
              <Brain className="h-5 w-5" />
              <span>Case Study</span>
            </button>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Difficulty Level</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
              <Gauge className="h-5 w-5" />
              <span>Entry Level</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">
              <Gauge className="h-5 w-5" />
              <span>Intermediate</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
              <Gauge className="h-5 w-5" />
              <span>Advanced</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors">
              <Gauge className="h-5 w-5" />
              <span>Expert</span>
            </button>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Eye Tracking</span>
                </span>
                <div className="w-10 h-6 bg-accent rounded-full relative">
                  <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
                </div>
              </label>
              <p className="text-sm text-muted-foreground">
                Monitor eye contact during the interview
              </p>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span>Multilingual Support</span>
                </span>
                <div className="w-10 h-6 bg-accent rounded-full relative">
                  <div className="absolute left-0 w-6 h-6 bg-primary rounded-full" />
                </div>
              </label>
              <p className="text-sm text-muted-foreground">
                Enable interview questions in multiple languages
              </p>
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Timed Responses</span>
                </span>
                <div className="w-10 h-6 bg-accent rounded-full relative">
                  <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
                </div>
              </label>
              <p className="text-sm text-muted-foreground">
                Set time limits for each question
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Selection */}
      <div className="bg-secondary rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Select Industry</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
            Technology
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            Finance
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            Healthcare
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            Education
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            Marketing
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            Sales
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            Design
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            Consulting
          </button>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">AI Features</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Real-time Feedback</span>
              </span>
              <div className="w-10 h-6 bg-accent rounded-full relative">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Assistant</span>
              </span>
              <div className="w-10 h-6 bg-accent rounded-full relative">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Adaptive Difficulty</span>
              </span>
              <div className="w-10 h-6 bg-accent rounded-full relative">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
              </div>
            </label>
          </div>
        </div>

        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Recording Options</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Video Recording</span>
              </span>
              <div className="w-10 h-6 bg-accent rounded-full relative">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Audio Recording</span>
              </span>
              <div className="w-10 h-6 bg-accent rounded-full relative">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Transcription</span>
              </span>
              <div className="w-10 h-6 bg-accent rounded-full relative">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-4" />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="flex justify-end">
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium">
          Start Custom Interview
        </button>
      </div>
    </div>
  );
}

export default CustomModes;