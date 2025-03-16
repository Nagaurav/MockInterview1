import React, { useState } from 'react';
import {
  Mic,
  Video,
  Brain,
  MessageSquare,
  Volume2,
  Settings,
  Eye,
  Timer,
  BarChart3,
  Languages,
  AlertCircle,
  X,
  Send,
  Camera,
  Sliders,
  Keyboard,
  Maximize2,
  VolumeX,
} from 'lucide-react';

function VideoBot() {
  const [isRecording, setIsRecording] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', message: 'Hi! I\'m your AI interview assistant. How can I help you today?' },
  ]);

  // Simulated real-time metrics (would be updated from AI API)
  const metrics = {
    confidence: 85,
    clarity: 78,
    eyeContact: 92,
    engagement: 88,
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatHistory([
      ...chatHistory,
      { role: 'user', message: chatMessage },
      { role: 'assistant', message: 'Thank you for your question! I\'m analyzing your interview performance and will provide specific feedback to help you improve.' }
    ]);
    setChatMessage('');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">AI Interview Session</h1>
          <p className="text-muted-foreground mt-2">
            Practice with our AI-powered interviewer and receive real-time feedback
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-lg bg-secondary flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span>Session: 15:30</span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
            End Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Interviewer Video */}
          <div className="bg-secondary rounded-2xl p-6">
            <div className="aspect-video bg-background rounded-lg relative overflow-hidden">
              <video
                className="w-full h-full object-cover rounded-lg"
                poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200"
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-sm p-3 rounded-full">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-full ${
                    isRecording ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-3 rounded-full bg-primary text-primary-foreground">
                  <Mic className="h-5 w-5" />
                </button>
                <button className="p-3 rounded-full bg-accent">
                  <Volume2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`p-3 rounded-full ${
                    showTranscript ? 'bg-primary text-primary-foreground' : 'bg-accent'
                  }`}
                >
                  <Languages className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-3 rounded-full bg-accent"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              {/* Question Counter */}
              <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm">
                Question {currentQuestion} of 10
              </div>
            </div>
          </div>

          {/* Current Question & Transcription */}
          <div className="bg-secondary rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Current Question</h2>
            <p className="text-muted-foreground mb-6">
              "Can you describe a challenging project you've worked on and how you handled the technical obstacles that arose during development?"
            </p>
            
            {showTranscript && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Live Transcription
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    "One particularly challenging project I worked on was developing a real-time data processing system..."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="space-y-6">
          {/* Real-time Metrics */}
          <div className="bg-secondary rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Real-time Analysis</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Confidence</span>
                  <span className="text-primary">{metrics.confidence}%</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${metrics.confidence}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Speech Clarity</span>
                  <span className="text-primary">{metrics.clarity}%</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${metrics.clarity}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Eye Contact</span>
                  <span className="text-primary">{metrics.eyeContact}%</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${metrics.eyeContact}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Engagement</span>
                  <span className="text-primary">{metrics.engagement}%</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${metrics.engagement}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-secondary rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">AI Feedback</h2>
              <button
                onClick={() => setShowChat(true)}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Brain className="h-6 w-6 text-primary mt-1" />
                <div>
                  <p className="font-medium">Great Eye Contact</p>
                  <p className="text-sm text-muted-foreground">
                    You're maintaining consistent eye contact with the camera, which shows confidence.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div>
                  <p className="font-medium">Speaking Pace</p>
                  <p className="text-sm text-muted-foreground">
                    Try slowing down slightly when explaining technical concepts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="h-6 w-6 text-primary mt-1" />
                <div>
                  <p className="font-medium">Answer Structure</p>
                  <p className="text-sm text-muted-foreground">
                    Good use of the STAR method. Continue providing specific examples.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-secondary rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Interview Tips</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Maintain natural eye contact
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Use concrete examples
              </p>
              <p className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Keep responses under 2 minutes
              </p>
              <p className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Quantify achievements when possible
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-secondary rounded-2xl p-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Interview Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Video Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Video Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5" />
                      <span>Camera</span>
                    </div>
                    <select className="bg-secondary rounded-lg px-3 py-2">
                      <option>Webcam HD</option>
                      <option>External Camera</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Maximize2 className="h-5 w-5" />
                      <span>Resolution</span>
                    </div>
                    <select className="bg-secondary rounded-lg px-3 py-2">
                      <option>1080p</option>
                      <option>720p</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Audio Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mic className="h-5 w-5" />
                      <span>Microphone</span>
                    </div>
                    <select className="bg-secondary rounded-lg px-3 py-2">
                      <option>Built-in Mic</option>
                      <option>External Mic</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5" />
                      <span>Speaker</span>
                    </div>
                    <select className="bg-secondary rounded-lg px-3 py-2">
                      <option>Built-in Speakers</option>
                      <option>External Speakers</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <VolumeX className="h-5 w-5" />
                      <span>Noise Cancellation</span>
                    </div>
                    <div className="w-11 h-6 bg-accent rounded-full relative cursor-pointer">
                      <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">AI Assistant Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5" />
                      <span>AI Feedback Level</span>
                    </div>
                    <select className="bg-secondary rounded-lg px-3 py-2">
                      <option>Detailed</option>
                      <option>Balanced</option>
                      <option>Minimal</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sliders className="h-5 w-5" />
                      <span>Interview Difficulty</span>
                    </div>
                    <select className="bg-secondary rounded-lg px-3 py-2">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Keyboard className="h-5 w-5" />
                      <span>Auto-Transcription</span>
                    </div>
                    <div className="w-11 h-6 bg-accent rounded-full relative cursor-pointer">
                      <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-secondary rounded-2xl p-6 w-full max-w-xl h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">AI Interview Assistant</h2>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    chat.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      chat.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask for interview advice..."
                className="flex-1 px-4 py-2 rounded-lg bg-secondary"
              />
              <button
                onClick={sendMessage}
                className="p-2 rounded-lg bg-primary text-primary-foreground"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoBot;