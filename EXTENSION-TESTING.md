# Resume Plan AI Extension Testing Guide

## 🚀 Step 1: Load the Extension

### Chrome/Edge

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Navigate to: `/home/code/resume-plan-ai/extension/dist`
5. Select the `dist` folder and click "Select Folder"
6. The extension should now appear in your extensions list

### Verify Installation

- You should see "Resume Plan AI" extension in the list
- Check that the extension icon appears in the browser toolbar (may need to pin it)

## 🧪 Step 2: Test Job Analysis

### Option A: Test with Mock Page

1. Open the test file: `file:///home/code/resume-plan-ai/test-job-page.html`
2. Wait for the page to load
3. Click the Resume Plan AI extension icon
4. You should see analysis results with:
   - Match score percentage
   - Matching skills
   - Missing skills
   - Suggestions

### Option B: Test with Real Job Sites

1. Go to a real job listing on:
   - LinkedIn: `https://www.linkedin.com/jobs/view/[job-id]`
   - Indeed: `https://www.indeed.com/viewjob?jk=[job-id]`
   - Glassdoor: `https://www.glassdoor.com/job-listing/[job-title]`

2. Click the extension icon to see analysis

## 🎯 Step 3: Test Resume Generation

1. While on a job page, click the extension icon
2. Click "Generate Tailored Resume" button
3. This should:
   - Send data to the backend API
   - Open a new tab with the Resume Plan AI app
   - Show the generated resume or resume builder

## 🔧 Step 4: Debug Issues

### Check Extension Console

1. Go to `chrome://extensions/`
2. Find "Resume Plan AI" extension
3. Click "Inspect views: service worker" (for background script)
4. Check console for errors

### Check Content Script

1. On a job page, press F12 to open DevTools
2. Go to Console tab
3. Look for extension messages and errors

### Check API Connectivity

1. Ensure the Resume Plan AI server is running at `http://localhost:3001`
2. Test API endpoint: `curl http://localhost:3001/api/resume/health`

## 📋 Expected Behavior

### ✅ What Should Work

- Extension icon shows in toolbar
- Popup opens when clicked on job pages
- Job data is extracted and analyzed
- Match score and skills are displayed
- "Generate Resume" opens the main app
- Error handling for unsupported pages

### ❌ Common Issues

- **No popup appears**: Check if you're on a supported job site
- **"Could not analyze page" error**: Verify job site URL format
- **API errors**: Ensure backend server is running
- **Resume generation fails**: Check server logs for API errors

## 🐛 Troubleshooting Commands

```bash
# Check if main app is running
curl http://localhost:3001/api/health

# Check resume API
curl http://localhost:3001/api/resume/health

# View extension logs
# Open chrome://extensions/ → Resume Plan AI → Inspect views

# Restart extension development server
cd /home/code/resume-plan-ai/extension
bun run dev

# Restart main app
cd /home/code/resume-plan-ai
bun run dev
```

## 🎉 Success Criteria

The extension is working correctly if:

1. ✅ Loads without errors in Chrome extensions page
2. ✅ Detects job pages automatically
3. ✅ Shows analysis popup with match score
4. ✅ Extracts job data (title, company, description)
5. ✅ Displays skills comparison
6. ✅ "Generate Resume" opens main app
7. ✅ Handles errors gracefully

Happy testing! 🚀
