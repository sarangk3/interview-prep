# Interview Prep Platform - Setup Guide

## 📁 What You Have

I've created a complete React app with:
- ✅ Interactive interview UI (text-based)
- ✅ Full mock interview mode (5 questions)
- ✅ Quick practice mode (1 random question)
- ✅ AI-powered feedback using Claude API
- ✅ User progress tracking (localStorage)
- ✅ 5 roles: System Design, DevOps/SRE, Backend Engineer, Product Manager, TPM
- ✅ Clean, minimal design
- ✅ Responsive (mobile + desktop)

All files are in `/mnt/user-data/outputs/`

## 🚀 Deploy to Vercel (3 Steps, ~5 minutes)

### Step 1: Download Files & Set Up Git
```bash
# Create a folder for your project
mkdir interview-prep
cd interview-prep

# Copy all files from outputs to this folder
# Then initialize git
git init
git add .
git commit -m "Initial commit - interview prep platform"
git branch -M main
```

### Step 2: Create GitHub Repository
1. Go to github.com (sign in or create account)
2. Click "+" → "New repository"
3. Name it: `interview-prep`
4. Click "Create repository" (don't add anything yet)
5. Copy the URL it gives you

### Step 3: Push to GitHub & Deploy
```bash
# In your interview-prep folder, run:
git remote add origin https://github.com/YOUR_USERNAME/interview-prep.git
git push -u origin main
```

Then:
1. Go to vercel.com (sign up with GitHub account)
2. Click "New Project"
3. Find and select `interview-prep` repository
4. Click "Deploy"
5. Wait 2-3 minutes
6. Your live URL appears at the top (e.g., `interview-prep-abc.vercel.app`)

**That's it! You have a live, public website.** ✨

---

## 🔑 Important: API Key Setup

The app calls Claude API for feedback. You need to handle this securely.

### Current Setup (Development)
The app makes direct API calls from the browser. This works but **exposes your API key** if you put it in the code.

### For Production (Recommended)
You have a few options:

#### Option A: Add Environment Variable to Vercel (Simplest)
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add: `VITE_ANTHROPIC_API_KEY` = `your-api-key-here`
4. The code will automatically use it

Then update the fetch call in `src/InterviewPrepApp.jsx` line ~320:
```javascript
// Change this:
headers: {
  'Content-Type': 'application/json',
}

// To this:
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
}
```

#### Option B: Create a Backend (More Secure)
Create a simple Node.js backend that:
1. Receives the interview response from the frontend
2. Calls Claude API with YOUR API key
3. Returns feedback to the frontend

Example:
```javascript
// Simple Express backend
app.post('/api/feedback', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY, // Secure!
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...})
  });
  res.json(await response.json());
});
```

#### Option C: Use a Service (Easiest for Now)
For testing/MVP, you could use a third-party API service, but not recommended for production.

---

## 📊 What Users See

### Login Page
- Enter email to start
- No password needed
- Data saved locally (no backend)

### Home Page
- Pick a role (System Design, DevOps, Backend, PM, TPM)
- Choose mode (Full Interview or Quick Practice)

### Interview Page
- Read question
- Type answer in text area
- Submit for AI feedback
- Progress bar shows which question you're on

### Results Page
- Overall score (1-10)
- Per-question scores across 4 dimensions
- Strengths & improvements for each answer
- Option to practice another

### Dashboard
- Total interviews completed
- Average score
- Practice breakdown by role
- Recent interview history

---

## 🎨 Customizing

### Add Questions
Edit `src/InterviewPrepApp.jsx`, find the `questions` object (~line 50):
```javascript
const questions = {
  'System Design': [
    'Your question here',
    'Another question',
    // ...
  ],
  // Add more
};
```

### Change Roles
Edit the `roles` array (~line 55):
```javascript
const roles = ['System Design', 'Your New Role', 'Another Role'];
```

### Modify Feedback Criteria
Find `handleSubmitAnswer()` function (~line 320) and update the Claude prompt to evaluate different things.

---

## 📈 Next Steps After Launch

1. **Test it** - Try an interview yourself
2. **Get feedback** - Share the link with friends, get their thoughts
3. **Refine questions** - Update questions based on what's most useful
4. **Add features** - Video recording, more roles, leaderboards, etc.
5. **Promote** - Share on Twitter, Reddit, Product Hunt, LinkedIn

---

## 🚨 Troubleshooting

### "npm not installed"
Download Node.js from nodejs.org (includes npm)

### "Vercel deployment failed"
- Check GitHub is connected
- Look at Vercel deployment logs
- Make sure all files are uploaded

### "API calls failing"
- Check you have a valid Anthropic API key
- Verify API key has credits
- Check browser console (F12) for errors

### "Data not saving"
- Ensure localStorage is enabled (not in private/incognito mode)
- Check browser DevTools → Application → Local Storage

---

## 💡 Pro Tips

1. **Test locally first**:
   ```bash
   npm install
   npm run dev
   # Visit http://localhost:3000
   ```

2. **Share your live link**:
   - You now have a public URL anyone can visit
   - Share on social media, add to portfolio, etc.

3. **Analytics** (optional):
   - Add Vercel analytics to track usage
   - Add Posthog or Mixpanel for user behavior

4. **Custom domain**:
   - Buy a domain (namecheap.com, godaddy.com, etc.)
   - Add it to Vercel (Settings → Domains)
   - Free SSL certificate included

---

## 📞 Questions?

Check these files for more info:
- `README.md` - Full feature documentation
- `DEPLOYMENT.md` - More detailed deployment guide
- `src/InterviewPrepApp.jsx` - The main code (well-commented)

---

**You're ready to launch! 🎉 Go deploy it and share the link.**
