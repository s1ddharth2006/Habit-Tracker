# HabitPulse — Personal Habit Tracker with GitHub Activity Heatmap & Streaks

> **Course:** Full Stack Web Development  
> **Task Type:** Individual Self-Learning Activity — Task 2  
> **Assigned Problem Statement:** Group 2 (Daily Life and Productivity Applications) — **Statement 13: Personal Habit Tracker**  
> **Statement Scope:** *"Track daily habits such as reading, exercise, water intake, and meditation."*

---

## 🌟 Overview & Key Highlights

**HabitPulse** is an interactive, responsive ReactJS web application designed to help users build and maintain consistent daily routines. Built following clean ES6+ modular architecture, React Hooks (`useState`, `useEffect`, `useMemo`), and pure Vanilla CSS3 styling, it introduces an authentic **GitHub-style Contribution Activity Heatmap** alongside real-time streak gamification.

### 🎯 Core Problem Statement Coverage
- 📖 **Reading Tracker:** Log daily pages read (default target: 20 pages) with quick increment/decrement and progress bars.
- 🏋️ **Physical Exercise Tracker:** Log workout and stretching minutes (target: 30 mins) with completion streaks.
- 💧 **Dedicated Water Intake Station:** Interactive 8-glass visualizer (250ml per glass = 2,000ml goal) with instant fluid level animation and quick hydrate buttons.
- 🧘 **Mindful Meditation:** Track meditation minutes (target: 15 mins) with calming visual cues.
- 💻 **Productivity & Custom Habits:** Add any custom habit with custom targets, units, colors, and category icons.

---

## 🚀 Key Features

### 1. GitHub-Style Contribution Heatmap
- **28-Week Historical Activity Matrix:** 7-row calendar grid representing days of the week (Sun–Sat) with Mon, Wed, Fri labels.
- **5-Level Green Shade Intensity:**
  - `Level 0`: No habits completed (`#161b22` in dark mode / `#ebedf0` in light mode)
  - `Level 1`: 1 habit completed (`#0e4429` / `#9be9a8`)
  - `Level 2`: 2 habits completed (`#006d32` / `#40c463`)
  - `Level 3`: 3 habits completed (`#26a641` / `#30a14e`)
  - `Level 4`: 4+ habits completed (`#39d353` / `#216e39`) with emerald neon glow!
- **Interactive Day Inspector:** Click any square to open a detailed breakdown modal showing which habits were completed and toggle them for past dates.
- **Dynamic Tooltips:** Hover over any square to see exact date, completion count, and habit list.
- **Habit Filter Dropdown:** View the heatmap across all habits or isolate it for a single habit (e.g. Reading only, Exercise only).

### 2. Contiguous Streak Engine
- **Current Active Daily Streak:** Calculates consecutive active days leading up to today (with yesterday grace period).
- **Longest Streak Record:** All-time unbroken streak calculation.
- **Per-Habit Individual Streaks:** Track individual discipline for each routine.
- **Visual Flame Animation:** Pulsing fire glow with celebratory confetti when all daily goals are reached.

### 3. Interactive Habit Management & Form Validation
- **Add & Edit Modal:** Full form with strict client-side validation:
  - Title: Required, 3–60 characters, duplicate title check.
  - Category: Category chips (Reading, Exercise, Water, Meditation, Productivity, Wellness, Custom).
  - Target Goal: Numeric check (> 0 and <= 1,000).
  - Unit of Measure: Required (pages, mins, glasses, km, reps).
  - Time of Day: Morning, Afternoon, Evening, Anytime.
  - Visual Theme Picker: Color swatch selector and icon picker.
  - Touched state and field-level error messages.
- **Delete Confirmation Modal:** Safe deletion dialog preventing accidental data loss.
- **Search & Multi-Filter Toolbar:** Instant search by name or motivation, category filtering, and status filtering (All / Pending / Completed).

### 4. At Least 3 Functional Views (Routing / Views)
1. **🎯 Today's Tracker (Dashboard):** Daily habit checklist, quick counters, water station, stats overview, and GitHub heatmap.
2. **📋 Manage Habits:** Library of all configured habits, per-habit streak metrics, edit and delete controls.
3. **📊 Streak & Heatmap Analytics:** Deep-dive analytics, 7-day consistency bar chart, category distribution, and unlocked achievement badges.
4. **🎓 Academic Presentation Deck:** Built-in 6-slide presentation viewer specifically tailored for the Task 2 college evaluation.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **ReactJS 18** | Functional components, JSX, reactive UI |
| **React Hooks** | `useState`, `useEffect`, `useMemo` for state & persistence |
| **JavaScript (ES6+)** | Arrow functions, destructuring, Set/Map, streak algorithms |
| **Vanilla CSS3** | Custom properties (CSS variables), Flexbox, CSS Grid, Glassmorphism |
| **Vite** | Lightning-fast development & production bundler |
| **LocalStorage** | Automatic persistence of habits and logs across browser reloads |
| **Lucide Icons** | Featherweight SVG iconography |
| **Canvas Confetti** | Milestone and daily completion celebrations |

---

## 📦 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Steps
1. Navigate to the project directory:
   ```bash
   cd c:/Users/csidd/Downloads/fullstk
   ```
2. Install dependencies (already pre-installed):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit:
   ```
   http://localhost:5173/
   ```
5. To test the production build:
   ```bash
   npm run build
   ```

---

## 📑 Presentation Slides Breakdown (For College Viva / Evaluation)

A dedicated slide deck is integrated into the web application under the **"Academic Slides"** navigation tab:
- **Slide 1:** Project Title, Student Details, Course (Full Stack Web Development Task 2)
- **Slide 2:** Problem Statement 13 (Personal Habit Tracker) & Behavioral Rationale
- **Slide 3:** Technology Stack & System Architecture (React, ES6, CSS3, Vite)
- **Slide 4:** Functional Features & Client-Side Validation Rules
- **Slide 5:** GitHub Heatmap Matrix & Contiguous Streak Algorithm
- **Slide 6:** Live Demonstration Flow for Evaluators
