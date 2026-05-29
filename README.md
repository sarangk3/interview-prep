# Interview Prep Platform

An AI-powered interview practice platform where users can practice interviews for 5 different tech roles, receive AI-generated feedback from Claude, and track their progress over time.

## Features

### 🎯 Interview Modes
- **Full Mock Interview**: 5 randomly selected questions from a role's question bank
- **Quick Practice**: Single deep-dive question for focused practice

### 👥 Supported Roles
1. **System Design** - Architecture, scalability, distributed systems
2. **DevOps/SRE** - Infrastructure, deployment, monitoring
3. **Backend Engineer** - APIs, databases, microservices
4. **Product Manager** - Strategy, metrics, roadmapping
5. **Technical Program Manager** - Cross-functional coordination, planning

### 🤖 AI Feedback
Each response is evaluated by Claude AI across four dimensions:
- **Technical Depth**: How thorough and correct is the technical content
- **Communication Clarity**: How well was the idea explained
- **Structure**: How organized and logical is the response
- **Problem-Solving Approach**: How did they approach the problem

Feedback includes:
- Individual scores (1-10) for each dimension
- Overall score
- Specific strengths highlighted
- Concrete areas for improvement
- Personalized feedback paragraph

### 📊 Progress Tracking
- View all previous interviews with scores and dates
- Dashboard showing statistics:
  - Total interviews completed
  - Average score across all interviews
  - Practice breakdown by role
  - Recent interview history
- No backend required - all data stored locally in browser

## Project Structure

```
interview-prep/
├── index.html              # HTML entry point
├── package.json           # Dependencies
├── vite.config.js         # Build configuration
├── src/
│   ├── main.jsx          # React app entry point
│   └── InterviewPrepApp.jsx  # Main app component
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md             # This file
```

## Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool (fast development)
- **Lucide React**: Icons
- **Claude AI API**: Feedback generation
- **localStorage**: Data persistence

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Quick Deploy to Vercel
See `DEPLOYMENT.md` for step-by-step instructions to deploy in under 5 minutes.

## How to Use

1. **Sign In**: Enter your email (no password needed)
2. **Select a Role**: Choose which role you want to practice
3. **Pick Interview Mode**:
   - Full Interview: Practice 5 questions
   - Quick Practice: Practice 1 question
4. **Answer Questions**: Type your response to each interview question
5. **Get Feedback**: Receive AI analysis of your response
6. **Track Progress**: View your dashboard to see improvement over time

## Key Features Explained

### Clean, Minimal Design
- Distraction-free interview experience
- Focus on content, not aesthetics
- Responsive design works on mobile and desktop
- Professional appearance suitable for serious practice

### Instant AI Feedback
- No waiting for a human interviewer
- Consistent evaluation criteria
- Detailed, actionable feedback
- Track improvements across attempts

### Privacy-First
- All data stored locally in your browser
- No account required (email optional)
- No data sent to external servers except for feedback generation
- Complete control over your interview history

### Flexible Practice
- Practice full interviews (5 questions) for comprehensive prep
- Practice single questions for focused learning
- Any role, any time
- No time limits

## Customization

### Add New Questions
Edit the `questions` object in `InterviewPrepApp.jsx`:
```javascript
const questions = {
  'Your Role': [
    'Question 1',
    'Question 2',
    // Add more questions
  ]
};
```

### Add New Roles
Update the `roles` array and corresponding questions:
```javascript
const roles = ['Role 1', 'Role 2', 'Your New Role'];
```

### Modify Scoring Criteria
Update the AI feedback prompt in `handleSubmitAnswer()` to evaluate different dimensions or adjust scoring.

## Future Enhancements

- [ ] Real-time scoring indicator
- [ ] Video/audio recording of responses
- [ ] Peer comparison and benchmarking
- [ ] Interview question suggestions based on role
- [ ] Integration with calendar for scheduled practice
- [ ] Export interview history as PDF
- [ ] Mobile app (React Native)
- [ ] Payment system for premium features
- [ ] Live interviewer marketplace

## Deployment

### Vercel (Recommended)
Free, fast, and easy. See `DEPLOYMENT.md` for instructions.

### Other Platforms
- AWS Amplify
- GitHub Pages (static only)
- Netlify
- Firebase Hosting

## API Integration

The app uses the Anthropic Claude API for feedback generation. Currently, the API key is embedded in the frontend (not secure for production).

For production deployment:
1. Create a backend service to handle API requests
2. Store your Anthropic API key securely on the backend
3. Have the frontend call your backend instead of the API directly

Example backend endpoint (Node.js + Express):
```javascript
app.post('/api/feedback', async (req, res) => {
  const { response, question, role } = req.body;
  const feedback = await claude.generateFeedback(response, question, role);
  res.json(feedback);
});
```

## Questions & Support

- Check the browser console (F12 → Console) for errors
- Review Vercel deployment logs if deployment fails
- Ensure all dependencies are installed (`npm install`)
- Verify environment variables are set (if using backend)

## License

This project is provided as-is for educational and commercial use.

---

**Happy interviewing! 🚀**
