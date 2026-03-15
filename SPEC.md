# AI Training Survey - Technical Specification

## Purpose

1. Assess AI adoption levels across T-Mobile development teams before training
2. Understand which tools and workflows developers currently use
3. Demonstrate how easy it is to build apps with AI assistance

## Architecture

### Technology Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Hosting:** GitHub Pages
- **Backend:** Firebase Firestore (NoSQL database)
- **Charts:** Chart.js library

### Application Flow

```
User fills form (index.html)
    ↓
Submit button → questionnaire.js
    ↓
Save to Firebase Firestore
    ↓
Dashboard (dashboard.html) reads from Firebase
    ↓
Render charts with Chart.js
```

### File Structure

```
ai-questionnaire/
├── index.html              # Survey form
├── dashboard.html          # Results visualization
├── questionnaire.js        # Form submission logic
├── dashboard.js            # Data fetching and chart rendering
├── style.css              # Shared styles
├── firebase-config.js     # Firebase initialization
└── README.md              # Setup instructions
```

## Data Model

### Firestore Collection: `responses`

Each document contains:

```javascript
{
    timestamp: Date,
    team: String,           // "digital" | "omnichannel"
    position: String,       // "developer" | "analyst" | "qa" | "business"
    seniority: String,      // "junior" | "mid" | "senior" | "lead"
    usesAI: String,         // "yes-work" | "yes-personal" | "yes-both" | "no"
    tools: Array<String>,   // ["claude", "gemini", "chatgpt", "copilot", "none"]
    frequency: String,      // "daily" | "weekly" | "monthly" | "rarely" | "tried-gave-up" | "never"
    satisfaction: String,   // "very-helpful" | "helpful" | "neutral" | "not-helpful" | "na"
    workUsage: Array<String>, // ["web-interface", "ide-extensions", "cli", "m365", "none"]
    useCases: Array<String>,  // ["coding", "debugging", "test-cases", "data-analysis", "requirements", "reports", "research", etc.]
    taskComplexity: String  // "snippets" | "small-tasks" | "moderate" | "complex" | "na"
}
```

## Questionnaire Design

### Questions (10 total - keep it simple)

1. **Which team are you on?**
   - Digital
   - Omnichannel

2. **What is your role?**
   - Developer
   - Analyst
   - QA Engineer
   - Business/Product

3. **What is your seniority level?**
   - Junior
   - Mid
   - Senior
   - Lead/Principal

4. **Do you use AI tools?**
   - Yes, for work
   - Yes, for personal projects/learning
   - Yes, both work and personal
   - No, I don't use AI tools

5. **Which AI tools have you used?** (multi-select)
   - Claude
   - Gemini
   - ChatGPT
   - GitHub Copilot
   - Other
   - None

6. **How often do you use AI tools for work?**
   - Daily
   - Weekly
   - Monthly
   - Rarely
   - I tried it but gave up
   - Never

7. **Do you think AI tools help you with your work?** (shown if uses AI for work)
   - Very helpful - significant productivity boost
   - Helpful - makes some tasks easier
   - Neutral - sometimes helpful, sometimes not
   - Not helpful - doesn't improve my work
   - N/A - I don't use AI for work

8. **How do you use AI for work?** (multi-select, shown if using AI)
   - Chat interface (web browser)
   - IDE extensions (Cline, GitHub Copilot)
   - CLI tools (Claude Code, etc.)
   - M365 Copilot (Word, Excel, PowerPoint)
   - I don't use AI for work

9. **What do you use AI for?** (multi-select, shown if using AI)
   - Code/script generation
   - Debugging & troubleshooting
   - Writing/reviewing test cases
   - Data analysis & SQL queries
   - Writing documentation
   - Requirements & specifications
   - Learning new concepts
   - Report generation
   - Research & information gathering
   - Other

10. **What level of tasks do you typically use AI for?** (shown if using AI)
    - Quick answers and simple tasks (closely supervised)
    - Complete discrete tasks (carefully verified)
    - Multi-step workflows (some guidance)
    - Complex end-to-end work (minimal supervision)

## Dashboard Visualizations

### Overview Section

**Key Metrics Cards:**
- Total responses
- AI adoption rate (percentage using AI)
- Most popular tool
- Most common frequency
- Average satisfaction (percentage who find AI helpful/very helpful)

### Distribution Charts

1. **Team Distribution** (Pie Chart)
   - Digital vs Omnichannel

2. **Position Distribution** (Pie Chart)
   - Developer, Analyst, QA, Business

3. **AI Tool Usage** (Horizontal Bar Chart)
   - Shows count for each tool (Claude, Gemini, ChatGPT, etc.)

4. **Usage Frequency** (Donut Chart)
   - Daily, Weekly, Monthly, Rarely, Never

5. **Work Tool Preferences** (Bar Chart)
   - Cline vs Claude Code CLI vs Web Interface

6. **Use Cases** (Horizontal Bar Chart)
   - What people use AI for (coding, debugging, etc.)

7. **AI Satisfaction/Usefulness** (Donut Chart)
   - Very helpful, Helpful, Neutral, Not helpful
   - Shows overall perception of AI value

### Correlation Analysis

8. **AI Adoption by Team** (Grouped Bar Chart)
   - Digital vs Omnichannel
   - Shows: daily users, weekly users, non-users per team

9. **AI Adoption by Position** (Grouped Bar Chart)
   - Developer, Analyst, QA, Business
   - Shows: uses AI vs doesn't use AI per position

10. **AI Adoption by Seniority** (Stacked Bar Chart)
    - Junior, Mid, Senior, Lead
    - Shows frequency distribution per seniority level

11. **Tool Preference by Team** (Stacked Bar Chart)
    - Digital vs Omnichannel
    - Which tools each team prefers

12. **AI Satisfaction by Team** (Grouped Bar Chart)
    - Digital vs Omnichannel
    - Shows satisfaction levels per team

13. **AI Satisfaction by Position** (Grouped Bar Chart)
    - Developer, Analyst, QA, Business
    - Shows satisfaction levels per position

### Data Table

- Raw data view (collapsible)
- Shows all responses in tabular format
- Can be exported as CSV

## Technical Requirements

### Firebase Setup

1. Create Firebase project
2. Enable Firestore database
3. Set security rules (public write, public read for this use case)
4. Get Firebase config credentials

### Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /responses/{document=**} {
      allow read: if true;  // Public dashboard
      allow write: if true; // Public survey (consider rate limiting in production)
    }
  }
}
```

### Dependencies

- **Chart.js** (v4.x) - Charting library
- **Firebase SDK** (v10.x) - Database connection
- No build tools needed - pure HTML/CSS/JS

## Deployment

### Steps

1. Set up Firebase project and get config
2. Add firebase-config.js with credentials
3. Test locally (live server or `python -m http.server`)
4. Push to GitHub repository
5. Enable GitHub Pages in repo settings
6. Share questionnaire URL with team

### GitHub Pages URL

```
https://[username].github.io/ai-questionnaire/
https://[username].github.io/ai-questionnaire/dashboard.html
```

## Non-Functional Requirements

- **Mobile responsive** - Works on phones/tablets
- **Accessibility** - Proper labels, keyboard navigation
- **Performance** - Dashboard loads in < 2 seconds
- **Browser support** - Modern browsers (Chrome, Firefox, Safari, Edge)

## Success Criteria

1. Developers can fill survey in < 2 minutes
2. Responses save automatically to Firebase
3. Dashboard shows real-time results
4. Charts are clear and easy to interpret
5. Deployment takes < 30 minutes total

## Future Enhancements (Optional)

- Export results as PDF report
- Anonymous vs named responses toggle
- Admin panel to clear/reset data
- Email notifications on new response
- Time-series analysis (track changes over time)
