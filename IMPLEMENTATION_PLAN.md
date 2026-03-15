# AI Questionnaire - Implementation Plan

## Overview

Build a questionnaire app with Firebase backend and GitHub Pages hosting to assess AI adoption among T-Mobile developers before training.

## Prerequisites

- Firebase project created ✓
- GitHub account
- Code editor (VS Code)
- Local web server (Python, Node, or VS Code Live Server)

## Implementation Phases

### Phase 1: Project Setup & Firebase Configuration (15 min)

**Tasks:**

1. **Get Firebase credentials**
   - Go to Firebase Console → Project Settings
   - Under "Your apps", add a Web App
   - Copy the Firebase config object

2. **Create firebase-config.js**
   ```javascript
   // Firebase configuration
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

3. **Set Firestore security rules**
   - Go to Firestore Database → Rules
   - Set public read/write (for this simple use case):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /responses/{document=**} {
         allow read: if true;
         allow write: if true;
       }
     }
   }
   ```

4. **Create Firestore database**
   - Go to Firestore Database
   - Create database in production mode
   - Select region (europe-west)

**Deliverables:**
- firebase-config.js file
- Firestore database created
- Security rules configured

---

### Phase 2: Build Questionnaire Form (45 min)

**Tasks:**

1. **Create HTML structure (index.html)**
   - Form with 9 questions
   - Conditional fields (show/hide based on answers)
   - Validation attributes
   - Submit button

2. **Create form logic (questionnaire.js)**
   - Initialize Firebase
   - Handle form submission
   - Collect form data
   - Save to Firestore
   - Show success message
   - Handle conditional field visibility

3. **Implement conditional logic**
   - Question 7 (satisfaction) shows only if uses AI for work
   - Question 8 (work usage) shows only if uses AI
   - Question 9 (use cases) shows only if uses AI

**Files to create:**
- index.html (questionnaire form)
- questionnaire.js (form logic)

**Key features:**
- Client-side validation
- Real-time conditional field display
- Firebase save with error handling
- Success confirmation

---

### Phase 3: Build Dashboard (60 min)

**Tasks:**

1. **Create dashboard HTML (dashboard.html)**
   - Header with title
   - Overview metrics section (cards)
   - Chart containers (multiple sections)
   - Raw data table (collapsible)

2. **Create dashboard logic (dashboard.js)**
   - Initialize Firebase
   - Fetch all responses from Firestore
   - Calculate metrics
   - Aggregate data for charts
   - Render all visualizations

3. **Implement Chart.js visualizations**

   **Overview Metrics (4 cards):**
   - Total responses
   - AI adoption rate
   - Average satisfaction
   - Most popular tool

   **Distribution Charts:**
   - Team distribution (pie)
   - Position distribution (pie)
   - Tool usage (horizontal bar)
   - Usage frequency (donut)
   - Work tool preferences (bar)
   - Use cases (horizontal bar)
   - AI satisfaction (donut)

   **Correlation Charts:**
   - AI adoption by team (grouped bar)
   - AI adoption by position (grouped bar)
   - AI adoption by seniority (stacked bar)
   - Tool preference by team (stacked bar)
   - Satisfaction by team (grouped bar)
   - Satisfaction by position (grouped bar)

4. **Implement data table**
   - Display all responses in table format
   - Make it collapsible
   - Add basic export functionality (copy to clipboard)

**Files to create:**
- dashboard.html
- dashboard.js

**Key features:**
- Real-time data loading
- Responsive charts
- Color-coded visualizations
- Interactive tooltips

---

### Phase 4: Styling (30 min)

**Tasks:**

1. **Create unified stylesheet (style.css)**
   - Modern, clean design
   - Mobile-responsive layout
   - Form styling (inputs, radio, checkbox, buttons)
   - Chart container styling
   - Metric cards styling
   - Color scheme (T-Mobile magenta accents?)

2. **Responsive design**
   - Mobile breakpoints
   - Tablet optimization
   - Desktop layout

3. **Accessibility**
   - Proper labels
   - Focus states
   - Color contrast
   - Keyboard navigation

**Files to create:**
- style.css

**Design principles:**
- Clean, minimal interface
- Easy to read on mobile
- Professional appearance
- Consistent spacing

---

### Phase 5: Testing (20 min)

**Tasks:**

1. **Local testing**
   - Start local web server
   - Test questionnaire submission
   - Verify data saves to Firestore
   - Test dashboard data loading
   - Test all chart renderings

2. **Cross-browser testing**
   - Chrome
   - Firefox
   - Safari
   - Edge

3. **Mobile testing**
   - Test on phone/tablet
   - Check responsive layout
   - Test form submission on mobile

4. **Edge case testing**
   - Submit with minimal data
   - Submit with all options selected
   - Test conditional field logic
   - Test with no responses in database

**Checklist:**
- [ ] Form submits successfully
- [ ] Data appears in Firestore
- [ ] Dashboard loads data
- [ ] All charts render correctly
- [ ] Responsive on mobile
- [ ] No console errors

---

### Phase 6: Deployment to GitHub Pages (15 min)

**Tasks:**

1. **Create GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "feat: ai questionnaire app"
   git branch -M main
   git remote add origin https://github.com/[username]/ai-questionnaire.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

3. **Wait for deployment** (~2 min)
   - GitHub Actions will build and deploy
   - Check Actions tab for progress

4. **Test live site**
   - Visit: https://[username].github.io/ai-questionnaire/
   - Test questionnaire submission
   - Test dashboard: https://[username].github.io/ai-questionnaire/dashboard.html

**Deliverables:**
- Live questionnaire URL
- Live dashboard URL

---

### Phase 7: Documentation & Handoff (10 min)

**Tasks:**

1. **Create README.md**
   - Project description
   - Links to questionnaire and dashboard
   - How to view results
   - Technical details

2. **Share with team**
   - Send questionnaire link to colleagues
   - Share dashboard link for results
   - Set deadline for responses

**Files to create:**
- README.md

---

## File Structure Summary

```
ai-questionnaire/
├── index.html              # Questionnaire form
├── dashboard.html          # Results visualization
├── questionnaire.js        # Form submission logic
├── dashboard.js            # Data fetching and charts
├── firebase-config.js      # Firebase credentials
├── style.css              # Unified styles
├── README.md              # Documentation
├── SPEC.md                # Technical specification
└── IMPLEMENTATION_PLAN.md # This file
```

## Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: Firebase Setup | 15 min | 15 min |
| Phase 2: Questionnaire | 45 min | 60 min |
| Phase 3: Dashboard | 60 min | 120 min |
| Phase 4: Styling | 30 min | 150 min |
| Phase 5: Testing | 20 min | 170 min |
| Phase 6: Deployment | 15 min | 185 min |
| Phase 7: Documentation | 10 min | 195 min |

**Total estimated time: ~3 hours**

## Dependencies

### External Libraries (CDN - no install needed)

**Firebase SDK:**
```html
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
```

**Chart.js:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

## Next Steps

1. **Start with Phase 1** - Configure Firebase
2. **Build incrementally** - Complete one phase before moving to next
3. **Test frequently** - Test after each phase
4. **Deploy early** - Deploy to GitHub Pages after Phase 5 to test live

## Success Metrics

- [ ] Questionnaire loads without errors
- [ ] Form submissions save to Firestore
- [ ] Dashboard displays all charts correctly
- [ ] App works on mobile devices
- [ ] Deployment successful on GitHub Pages
- [ ] Colleagues can access and submit questionnaire
- [ ] Results update in real-time on dashboard

## Notes

- Keep firebase-config.js in the repo (safe for public repo - only allows writes to one collection)
- Consider adding `.gitignore` if you have local test files
- Dashboard updates in real-time as new responses come in
- Can reset data by deleting Firestore collection
