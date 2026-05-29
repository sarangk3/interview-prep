import React, { useState, useEffect } from 'react';
import { Zap, LogOut, Home, BarChart3, Plus, ChevronRight } from 'lucide-react';

const InterviewPrepApp = () => {
  // User State
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('login'); // login, home, interview, results, dashboard

  // Interview State
  const [selectedRole, setSelectedRole] = useState(null);
  const [interviewMode, setInterviewMode] = useState(null); // 'full' or 'deep'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [allResponses, setAllResponses] = useState([]);

  // Questions Database
  const questions = {
    'System Design': [
      "Design a URL shortening service like bit.ly. How would you handle scale?",
      "Design a real-time chat application. What are the key components?",
      "Design a news feed system like Twitter. How would you rank posts?",
      "Design a distributed cache. What eviction policies would you implement?",
      "Design a video streaming platform. How would you handle bandwidth?"
    ],
    'DevOps/SRE': [
      "Describe your approach to setting up CI/CD pipelines. What tools do you prefer?",
      "How would you design a monitoring and alerting system for production services?",
      "Walk me through your strategy for managing infrastructure as code.",
      "How do you approach incident response and post-mortem processes?",
      "Design a disaster recovery strategy for a critical service."
    ],
    'Backend Engineer': [
      "Design a payment processing system. How would you ensure reliability?",
      "How would you optimize a slow database query affecting production?",
      "Design an API rate limiting system. What algorithms would you use?",
      "How would you implement distributed transactions across microservices?",
      "Design a queue system for asynchronous job processing."
    ],
    'Product Manager': [
      "Walk me through how you'd prioritize features for a product roadmap.",
      "How would you measure success for a new feature launch?",
      "Describe your approach to competitive analysis and market research.",
      "How do you balance technical constraints with user needs?",
      "Walk me through a product decision where you had to say no to stakeholders."
    ],
    'TPM': [
      "How do you manage cross-functional dependencies across multiple teams?",
      "Walk me through how you'd track and communicate progress on a complex program.",
      "Describe your approach to risk management and mitigation planning.",
      "How do you balance speed to market with quality and technical debt?",
      "Walk me through a program where you had to replan due to unexpected blockers."
    ]
  };

  const roles = ['System Design', 'DevOps/SRE', 'Backend Engineer', 'Product Manager', 'TPM'];

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('interviewPrepUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('home');
    }
  }, []);

  // Login handler
  const handleLogin = () => {
    if (email.trim()) {
      const newUser = {
        email,
        joinedDate: new Date().toISOString(),
        interviews: []
      };
      setUser(newUser);
      localStorage.setItem('interviewPrepUser', JSON.stringify(newUser));
      setCurrentPage('home');
      setEmail('');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setSelectedRole(null);
    setInterviewMode(null);
  };

  // Start interview
  const startInterview = (role, mode) => {
    setSelectedRole(role);
    setInterviewMode(mode);
    setCurrentQuestionIndex(0);
    setAllResponses([]);
    setUserResponse('');
    setFeedback(null);
    setCurrentPage('interview');
  };

  // Get questions for current mode
  const getQuestionsForMode = (role, mode) => {
    const roleQuestions = questions[role];
    if (mode === 'full') return roleQuestions;
    return [roleQuestions[Math.floor(Math.random() * roleQuestions.length)]];
  };

  // Submit answer and get feedback
  const handleSubmitAnswer = async () => {
    if (!userResponse.trim()) return;

    const currentQuestions = getQuestionsForMode(selectedRole, interviewMode);
    const currentQuestion = currentQuestions[currentQuestionIndex];

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are an expert interviewer evaluating a candidate's response to a ${selectedRole} interview question.

Question: "${currentQuestion}"

Candidate's Response: "${userResponse}"

Evaluate this response across these dimensions (1-10 scale for each):
1. Technical Depth: How thorough and technically sound is the answer?
2. Communication Clarity: How well was the answer explained?
3. Structure: How well organized was the response?
4. Problem-Solving Approach: How did they approach the problem?

Respond in this exact JSON format:
{
  "technical_depth": 8,
  "communication_clarity": 7,
  "structure": 8,
  "approach": 8,
  "overall": 8,
  "strengths": ["Point 1", "Point 2"],
  "improvements": ["Point 1", "Point 2"],
  "feedback": "Brief overall feedback paragraph"
}`
            }
          ]
        })
      });

      const data = await response.json();
      const feedbackText = data.content[0].text;
      
      let parsedFeedback;
      try {
        const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
        parsedFeedback = JSON.parse(jsonMatch ? jsonMatch[0] : feedbackText);
      } catch (e) {
        parsedFeedback = {
          technical_depth: 7,
          communication_clarity: 7,
          structure: 7,
          approach: 7,
          overall: 7,
          strengths: ["Clear explanation", "Good approach"],
          improvements: ["More depth", "Better structure"],
          feedback: "Solid response with room for improvement."
        };
      }

      const newResponse = {
        question: currentQuestion,
        answer: userResponse,
        feedback: parsedFeedback
      };

      setAllResponses([...allResponses, newResponse]);

      const currentQuestions = getQuestionsForMode(selectedRole, interviewMode);
      if (currentQuestionIndex + 1 < currentQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserResponse('');
      } else {
        // Interview complete
        finishInterview([...allResponses, newResponse]);
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
      alert('Error getting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finish interview and save
  const finishInterview = (responses) => {
    const scores = responses.map(r => r.feedback.overall);
    const averageScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);

    const interview = {
      id: Date.now(),
      role: selectedRole,
      mode: interviewMode,
      date: new Date().toISOString(),
      score: averageScore,
      responses: responses
    };

    const updatedUser = {
      ...user,
      interviews: [...(user.interviews || []), interview]
    };

    setUser(updatedUser);
    localStorage.setItem('interviewPrepUser', JSON.stringify(updatedUser));
    setFeedback(responses);
    setCurrentPage('results');
  };

  // Calculate stats for dashboard
  const getStats = () => {
    if (!user || !user.interviews) return null;
    const interviews = user.interviews;
    const avgScore = Math.round(
      interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length
    );
    const byRole = {};
    interviews.forEach(i => {
      byRole[i.role] = (byRole[i.role] || 0) + 1;
    });
    return { totalInterviews: interviews.length, avgScore, byRole };
  };

  // Render Pages
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-slate-900" />
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Interview Prep</h1>
          </div>
          <p className="text-slate-600 text-sm">Practice interviews with AI feedback</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            Get Started
          </button>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          No account required. Interviews saved locally.
        </p>
      </div>
    </div>
  );

  const HomePage = () => {
    const stats = getStats();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-light text-slate-900">Interview Prep</h1>
              <p className="text-slate-600 text-sm mt-1">Hi, {user.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm text-slate-600"
              >
                <BarChart3 className="w-4 h-4" />
                Progress
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm text-slate-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {stats && stats.totalInterviews > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1">Total Interviews</p>
                <p className="text-2xl font-light text-slate-900">{stats.totalInterviews}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1">Average Score</p>
                <p className="text-2xl font-light text-slate-900">{stats.avgScore}/10</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1">Most Practiced</p>
                <p className="text-2xl font-light text-slate-900">
                  {Object.keys(stats.byRole).length > 0
                    ? Object.keys(stats.byRole).sort((a, b) => stats.byRole[b] - stats.byRole[a])[0].split(' ')[0]
                    : 'N/A'}
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-light text-slate-900 mb-4">Select a Role</h2>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => startInterview(role, 'full')}
                  className="p-6 bg-white rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group text-left"
                >
                  <p className="text-sm font-medium text-slate-900">{role}</p>
                  <p className="text-xs text-slate-500 mt-2">Full Interview</p>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 mt-3 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-light text-slate-900 mb-4">Quick Practice</h2>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={`deep-${role}`}
                  onClick={() => startInterview(role, 'deep')}
                  className="p-6 bg-white rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group text-left"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">{role}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Single Question</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InterviewPage = () => {
    const currentQuestions = getQuestionsForMode(selectedRole, interviewMode);
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => {
                setCurrentPage('home');
                setSelectedRole(null);
                setInterviewMode(null);
              }}
              className="text-sm text-slate-600 hover:text-slate-900 mb-6 flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>

            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-light text-slate-900">{selectedRole}</h1>
              <span className="text-sm text-slate-600">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1">
              <div
                className="bg-slate-900 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 border border-slate-200 mb-6">
            <p className="text-slate-600 text-lg leading-relaxed mb-8">{currentQuestion}</p>

            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type your answer here. Take your time to think through the problem..."
              className="w-full h-64 p-4 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-sm"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !userResponse.trim()}
                className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Getting Feedback...' : isLastQuestion ? 'Finish Interview' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResultsPage = () => {
    const avgScore = Math.round(
      feedback.reduce((sum, r) => sum + r.feedback.overall, 0) / feedback.length
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-sm text-slate-600 hover:text-slate-900 mb-8 flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>

          <div className="bg-white rounded-lg p-8 border border-slate-200 mb-8">
            <h1 className="text-3xl font-light text-slate-900 mb-2">Interview Complete</h1>
            <p className="text-slate-600 mb-6">{selectedRole} • {interviewMode === 'full' ? 'Full Interview' : 'Single Question'}</p>

            <div className="bg-slate-50 rounded-lg p-8 text-center mb-8">
              <p className="text-slate-600 text-sm mb-2">Overall Score</p>
              <p className="text-5xl font-light text-slate-900">{avgScore}/10</p>
            </div>
          </div>

          {feedback.map((response, idx) => (
            <div key={idx} className="bg-white rounded-lg p-8 border border-slate-200 mb-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Question {idx + 1}</h3>
              <p className="text-slate-600 italic mb-6">{response.question}</p>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 mb-2 font-medium">Your Answer</p>
                <p className="text-sm text-slate-900">{response.answer}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Technical Depth</p>
                  <p className="text-2xl font-light text-slate-900">{response.feedback.technical_depth}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Communication</p>
                  <p className="text-2xl font-light text-slate-900">{response.feedback.communication_clarity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Structure</p>
                  <p className="text-2xl font-light text-slate-900">{response.feedback.structure}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Approach</p>
                  <p className="text-2xl font-light text-slate-900">{response.feedback.approach}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-slate-900 mb-3">Strengths</p>
                <ul className="space-y-2">
                  {response.feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-green-600 font-bold">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-slate-900 mb-3">Areas to Improve</p>
                <ul className="space-y-2">
                  {response.feedback.improvements.map((i, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-amber-600 font-bold">→</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4">{response.feedback.feedback}</p>
            </div>
          ))}

          <button
            onClick={() => setCurrentPage('home')}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            Practice Another
          </button>
        </div>
      </div>
    );
  };

  const DashboardPage = () => {
    const stats = getStats();
    const interviews = user?.interviews || [];
    const recentInterviews = [...interviews].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-sm text-slate-600 hover:text-slate-900 mb-8 flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>

          <h1 className="text-3xl font-light text-slate-900 mb-8">Your Progress</h1>

          {stats && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <p className="text-slate-600 text-sm mb-2">Total Interviews</p>
                  <p className="text-3xl font-light text-slate-900">{stats.totalInterviews}</p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <p className="text-slate-600 text-sm mb-2">Average Score</p>
                  <p className="text-3xl font-light text-slate-900">{stats.avgScore}/10</p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <p className="text-slate-600 text-sm mb-2">Roles Practiced</p>
                  <p className="text-3xl font-light text-slate-900">{Object.keys(stats.byRole).length}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200 mb-8">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Practice by Role</h2>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role} className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">{role}</p>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-slate-900 h-2 rounded-full"
                            style={{
                              width: `${((stats.byRole[role] || 0) / Math.max(...Object.values(stats.byRole), 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-sm font-medium text-slate-900 w-6">{stats.byRole[role] || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Recent Interviews</h2>
                <div className="space-y-3">
                  {recentInterviews.length > 0 ? (
                    recentInterviews.map((interview) => (
                      <div key={interview.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{interview.role}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(interview.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-light text-slate-900">{interview.score}/10</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {interview.mode === 'full' ? 'Full' : 'Quick'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">No interviews yet. Start practicing!</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render based on current page
  return (
    <div className="font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'home' && user && <HomePage />}
      {currentPage === 'interview' && <InterviewPage />}
      {currentPage === 'results' && <ResultsPage />}
      {currentPage === 'dashboard' && user && <DashboardPage />}
    </div>
  );
};

export default InterviewPrepApp;
