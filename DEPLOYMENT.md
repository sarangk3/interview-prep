# Interview Prep Platform - Deployment Guide

## 🚀 Quick Start (Deploy to Vercel)

The easiest way to deploy this app is to Vercel in under 5 minutes.

### Step 1: Prepare Your Code
1. Create a new folder on your computer and copy these files into it:
   ```
   interview-prep/
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── src/
   │   ├── main.jsx
   │   └── InterviewPrepApp.jsx
   ```

### Step 2: Push to GitHub
1. Go to github.com and create a new repository named `interview-prep`
2. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/interview-prep.git
   git push -u origin main
   ```

### Step 3: Deploy to Vercel
1. Go to vercel.com and sign up (free)
2. Click "New Project"
3. Select your `interview-prep` GitHub repository
4. Click "Deploy"
5. Wait ~2 minutes for deployment to complete
6. Your live URL will be displayed (something like `interview-prep-abc123.vercel.app`)

That's it! You now have a live, publicly accessible interview prep platform.

---

## 📋 Features

- **5 Tech Roles**: System Design, DevOps/SRE, Backend Engineer, Product Manager, TPM
- **2 Interview Modes**:
  - **Full Mock Interview**: 5 questions per role
  - **Quick Practice**: 1 random question
- **AI-Powered Feedback**: Claude evaluates each response across:
  - Technical Depth (1-10)
  - Communication Clarity (1-10)
  - Structure (1-10)
  - Problem-Solving Approach (1-10)
- **User Tracking**: 
  - Progress dashboard showing interview history
  - Average scores by role
  - Practice statistics
- **Local Data Storage**: All interviews saved locally in browser (no backend needed)

---

## 🔑 How It Works

### User Authentication
- No login required initially
- Email collected for progress tracking
- All data stored in browser localStorage (private)

### Interview Flow
1. Select role (System Design, DevOps/SRE, etc.)
2. Choose mode (Full interview or Quick practice)
3. Answer interview questions
4. Receive AI feedback for each response
5. View detailed scoring and improvement suggestions
6. Track progress in your personal dashboard

### AI Feedback
- Uses Claude API (via Anthropic)
- Evaluates answers in real-time
- Provides specific strengths and areas for improvement
- Tracks scores over time

---

## 📊 Dashboard

Users can track:
- Total interviews completed
- Average score across all interviews
- Practice by role (chart showing interviews per role)
- Recent interview history with scores and dates
- Trends over time

---

## 🎨 Design

- **Clean, minimal aesthetic** with generous whitespace
- **Professional typography** using system fonts
- **Fast and responsive** on mobile and desktop
- **Smooth transitions** and micro-interactions
- **Dark mode friendly** color scheme

---

## 🔧 Customization

### Add More Questions
Edit `src/InterviewPrepApp.jsx` and update the `questions` object:

```javascript
const questions = {
  'System Design': [
    'Your question here',
    // ...
  ],
  // Add more roles or questions
};
```

### Change Roles
Modify the `roles` array:
```javascript
const roles = ['Your Role 1', 'Your Role 2', /* ... */];
```

### Update Scoring Criteria
Edit the AI feedback prompt in the `handleSubmitAnswer` function to change what's evaluated.

---

## 🌐 Custom Domain (Optional)

Once deployed on Vercel, you can add a custom domain:
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Enter your custom domain (e.g., interviewprep.com)
4. Follow Vercel's DNS instructions

---

## 📦 Local Development

To run locally before deploying:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

To build for production:
```bash
npm run build
```

---

## 🔐 Important Notes

### API Keys
- The app uses the Anthropic API to generate feedback
- **You'll need to add your Anthropic API key** when deploying to Vercel:
  1. Go to Vercel project → Settings → Environment Variables
  2. Add a new variable (you'll need to modify the code to use it)

For now, the API calls will need your key embedded. **Production deployment should use a backend service** to secure the API key.

### Data Privacy
- All user interviews are stored in browser localStorage
- No data is sent to external servers except for AI feedback requests
- Each user's data is completely private

---

## 🚨 Troubleshooting

### "API calls not working"
Make sure you have an Anthropic API key. Update the API call in `InterviewPrepApp.jsx` if needed.

### "Data not saving"
Check that localStorage is enabled in your browser.

### "Deployment failed on Vercel"
- Ensure all files are in the correct directory structure
- Check that `package.json` has all dependencies
- Try redeploying from Vercel dashboard

---

## 📈 Next Steps

After launch, consider:
1. **Backend**: Move to a server-based architecture to secure API keys
2. **More Features**: Video responses, live interviewer matching, progress analytics
3. **Monetization**: Premium features, interview templates, expert feedback tiers
4. **Mobile App**: React Native version for iOS/Android

---

## 📞 Questions?

If you run into issues:
1. Check Vercel logs (Project → Deployments → click deployment → Logs)
2. Review the browser console for errors (F12 → Console)
3. Verify all files are uploaded correctly to GitHub

---

**Good luck with your interview prep platform! 🎯**
