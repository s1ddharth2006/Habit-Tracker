import React, { useState } from 'react';
import {
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Code,
  Layers,
  CheckCircle,
  Copy,
  ExternalLink,
  Flame,
  Sparkles,
  Presentation,
  Check
} from 'lucide-react';

const SLIDES = [
  {
    slideNumber: 1,
    title: 'TASK 2: INTERACTIVE REACTJS APPLICATION',
    subtitle: 'Group 2 - Problem Statement 13: Personal Habit Tracker',
    content: {
      type: 'title-slide',
      course: 'Full Stack Web Development',
      taskType: 'Individual Self-Learning Assignment – 60 Problem Statements',
      section: '58 - III CSE - A Section',
      date: '01.10.2026',
      highlights: [
        'Interactive ReactJS Application built with ES6 and CSS3',
        'State Management using React useState and useEffect hooks',
        'GitHub-Style Contribution Heatmap with dynamic streak calculation',
        'Multi-view Single Page Architecture with CRUD and Form Validation'
      ]
    }
  },
  {
    slideNumber: 2,
    title: 'Problem Statement & Scope',
    subtitle: 'Group 2 (Daily Life & Productivity Applications) – Statement 13',
    content: {
      type: 'problem-scope',
      problemDescription: 'Track daily habits such as reading, exercise, water intake, and meditation.',
      objectives: [
        'Enable individuals to form positive daily routines through consistent tracking.',
        'Track daily habits: Reading (pages), Exercise (mins), Water Intake (glasses/ml), and Meditation (mins).',
        'Calculate continuous daily streaks and reward milestones.',
        'Provide a GitHub-style green contribution heatmap visualizing historical intensity and adherence.'
      ],
      userNeed: 'Research in behavioral psychology shows that visual habit tracking and streak gamification increase long-term adherence by over 70% compared to unmonitored routines.'
    }
  },
  {
    slideNumber: 3,
    title: 'Technology Stack & Architecture',
    subtitle: 'Adherence to Academic & Modern Web Standards',
    content: {
      type: 'tech-stack',
      items: [
        { name: 'ReactJS (v18+)', role: 'Component-based UI, JSX, virtual DOM rendering' },
        { name: 'Hooks (useState, useEffect)', role: 'Reactive state management, lifecycle sync, and LocalStorage persistence' },
        { name: 'JavaScript (ES6+)', role: 'Arrow functions, destructuring, modules, Set/Map, date manipulation algorithms' },
        { name: 'Vanilla CSS3', role: 'CSS custom properties (tokens), responsive Flexbox & Grid, glassmorphism, micro-animations' },
        { name: 'GitHub Heatmap Engine', role: 'Custom matrix generation algorithm with 5-level intensity scaling (0 to 4)' },
        { name: 'Lucide Icons & Canvas Confetti', role: 'Visual cues, iconography, and completion celebration effects' }
      ]
    }
  },
  {
    slideNumber: 4,
    title: 'Core Features & Client-Side Validation',
    subtitle: 'Fulfilling Functional & Interactive Assignment Requirements',
    content: {
      type: 'features-validation',
      features: [
        'Interactive Checklists & Counters: Instant completion toggle with animated micro-feedback and progress bars.',
        'Dedicated Water Intake Station: Interactive 8-glass visualizer with instant ml calculation (250ml/glass).',
        'Full Habit CRUD Operations: Add, Edit, and Delete habits with real-time updates across all views.',
        'Real-time Search & Multi-Category Filtering: Filter by Reading, Exercise, Water, Meditation, Productivity, or Completion Status.'
      ],
      validationRules: [
        'Habit Title: Required, 3–60 chars, duplicate prevention against existing active habits.',
        'Daily Goal Target: Required, numeric validation (> 0 and <= 1000).',
        'Unit of Measure: Required (e.g., pages, mins, glasses, km).',
        'Real-time Touched & Error feedback preventing form submission on invalid inputs.'
      ]
    }
  },
  {
    slideNumber: 5,
    title: 'GitHub Heatmap & Streak Logic',
    subtitle: 'Algorithmic Implementation of Contribution Visualization',
    content: {
      type: 'algorithm',
      points: [
        {
          title: 'Contiguous Streak Algorithm',
          desc: 'Checks today and yesterday for active check-ins. Iterates backwards through historical dates to calculate unbroken consecutive daily streaks.'
        },
        {
          title: 'Heatmap Matrix Generation',
          desc: 'Dynamically calculates 28 weeks (196 days) aligned with Sunday-to-Saturday columns, matching authentic GitHub contribution matrices.'
        },
        {
          title: '5-Level Green Intensity Scaling',
          desc: 'Level 0 (0 habits), Level 1 (1 habit), Level 2 (2 habits), Level 3 (3 habits), Level 4 (4+ habits completed).'
        },
        {
          title: 'Interactive Day Inspector',
          desc: 'Hover tooltips displaying completed habits, and click-to-inspect modals allowing toggling habits on past dates.'
        }
      ]
    }
  },
  {
    slideNumber: 6,
    title: 'Application Workflow & Live Evaluation Guide',
    subtitle: 'Step-by-Step Flow for Evaluation Demonstration',
    content: {
      type: 'workflow-demo',
      steps: [
        'Step 1: Dashboard Overview - Show top stats cards (Current Streak, Longest Streak, Progress %, Active Days).',
        'Step 2: GitHub Heatmap Interaction - Hover over green boxes to show tooltips; click a date to inspect and toggle habits.',
        'Step 3: Track Today\'s Habits - Toggle Reading or Meditation done; click water glasses in the Water Intake widget.',
        'Step 4: Form Validation & Adding a Habit - Click "New Habit", demonstrate client-side errors (empty title, 0 target), then create a valid habit.',
        'Step 5: Habit Management & Edit/Delete - Navigate to "Manage Habits" view, edit a habit target, and show search/filter.',
        'Step 6: Analytics & Milestones - Navigate to "Streak & Heatmap" view to review weekly bar chart and unlocked achievement badges.'
      ]
    }
  }
];

export default function PresentationView() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const copySlideText = () => {
    const text = `Slide ${currentSlide.slideNumber}: ${currentSlide.title}\n${currentSlide.subtitle}\n\n` +
      JSON.stringify(currentSlide.content, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="presentation-view-container">
      {/* Header bar */}
      <div className="view-header-row">
        <div>
          <div className="view-badge">Academic Presentation Deck (5-8 Slides)</div>
          <h2 className="view-title">Project Presentation & Viva Deck</h2>
          <p className="view-subtitle">
            Prepared for Full Stack Web Development Task 2 Evaluation. Use this interactive deck for your live demonstration or PowerPoint slides!
          </p>
        </div>

        <button
          type="button"
          className="btn-outline-action"
          onClick={copySlideText}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Slide Copied!' : 'Copy Slide Text'}</span>
        </button>
      </div>

      {/* Slide Carousel Viewer */}
      <div className="presentation-deck-card">
        {/* Slide Topbar */}
        <div className="slide-deck-topbar">
          <div className="slide-deck-indicator">
            <Presentation size={18} className="slide-icon-active" />
            <span>
              Slide {currentSlideIndex + 1} of {SLIDES.length}
            </span>
          </div>

          <div className="slide-deck-nav-buttons">
            <button
              type="button"
              className="slide-nav-btn"
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              title="Previous Slide"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`slide-dot-btn ${currentSlideIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              type="button"
              className="slide-nav-btn"
              onClick={handleNext}
              disabled={currentSlideIndex === SLIDES.length - 1}
              title="Next Slide"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slide Canvas */}
        <div className="slide-canvas">
          <div className="slide-header">
            <span className="slide-number-pill">Slide {currentSlide.slideNumber}</span>
            <h1 className="slide-main-title">{currentSlide.title}</h1>
            <p className="slide-sub-title">{currentSlide.subtitle}</p>
          </div>

          <div className="slide-content-body">
            {/* Slide 1 Content */}
            {currentSlide.content.type === 'title-slide' && (
              <div className="slide-content-title">
                <div className="academic-meta-grid">
                  <div className="meta-box">
                    <span className="meta-label">Course:</span>
                    <span className="meta-val">{currentSlide.content.course}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">Task Type:</span>
                    <span className="meta-val">{currentSlide.content.taskType}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">Class Section:</span>
                    <span className="meta-val">{currentSlide.content.section}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">Assessment Date:</span>
                    <span className="meta-val">{currentSlide.content.date}</span>
                  </div>
                </div>

                <div className="highlights-box">
                  <h4 className="highlights-heading">Assignment Key Deliverables</h4>
                  <ul className="slide-bullets-list">
                    {currentSlide.content.highlights.map((h, i) => (
                      <li key={i}>
                        <CheckCircle size={16} className="bullet-check" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Slide 2 Content */}
            {currentSlide.content.type === 'problem-scope' && (
              <div className="slide-content-problem">
                <div className="problem-highlight-callout">
                  <strong>Assigned Statement: </strong>
                  <span>"{currentSlide.content.problemDescription}"</span>
                </div>

                <h4 className="slide-section-heading">Core Objectives:</h4>
                <ul className="slide-bullets-list">
                  {currentSlide.content.objectives.map((obj, i) => (
                    <li key={i}>
                      <CheckCircle size={16} className="bullet-check" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>

                <div className="psychology-note">
                  <strong>💡 Behavioral Rationale: </strong>
                  <span>{currentSlide.content.userNeed}</span>
                </div>
              </div>
            )}

            {/* Slide 3 Content */}
            {currentSlide.content.type === 'tech-stack' && (
              <div className="slide-content-tech">
                <div className="tech-stack-cards-grid">
                  {currentSlide.content.items.map((item, i) => (
                    <div key={i} className="tech-item-card">
                      <div className="tech-item-header">
                        <Code size={18} className="tech-icon-glow" />
                        <h4 className="tech-item-name">{item.name}</h4>
                      </div>
                      <p className="tech-item-desc">{item.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slide 4 Content */}
            {currentSlide.content.type === 'features-validation' && (
              <div className="slide-content-features">
                <div className="features-two-col">
                  <div>
                    <h4 className="slide-section-heading">Functional Features</h4>
                    <ul className="slide-bullets-list">
                      {currentSlide.content.features.map((f, i) => (
                        <li key={i}>
                          <CheckCircle size={16} className="bullet-check" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="slide-section-heading">Client-Side Validation</h4>
                    <ul className="slide-bullets-list">
                      {currentSlide.content.validationRules.map((v, i) => (
                        <li key={i}>
                          <span className="validation-bullet-dot"></span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 5 Content */}
            {currentSlide.content.type === 'algorithm' && (
              <div className="slide-content-algo">
                <div className="algo-cards-grid">
                  {currentSlide.content.points.map((p, i) => (
                    <div key={i} className="algo-card">
                      <h4 className="algo-card-title">{p.title}</h4>
                      <p className="algo-card-desc">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slide 6 Content */}
            {currentSlide.content.type === 'workflow-demo' && (
              <div className="slide-content-workflow">
                <h4 className="slide-section-heading">Demonstration Flow for Evaluators:</h4>
                <div className="workflow-steps-list">
                  {currentSlide.content.steps.map((st, i) => (
                    <div key={i} className="workflow-step-item">
                      <span className="step-badge">{i + 1}</span>
                      <span className="step-text">{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
