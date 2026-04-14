// LandingPage.tsx
// Beautiful landing page with LARGE peachy blobs and illustrations

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="landing-page">
      {/* LARGE Peachy Blobs - Like Presentation */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
      </div>

      {/* Floating Illustrations */}
      <div className="floating-illustration illustration-1">
        <FryingPanSVG />
      </div>
      <div className="floating-illustration illustration-2">
        <KnifeSVG />
      </div>
      <div className="floating-illustration illustration-3">
        <RollingPinSVG />
      </div>
      <div className="floating-illustration illustration-4">
        <SpoonSVG />
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className={`hero-content ${isVisible ? 'fade-in-up' : ''}`}>
          <h1>Welcome to Fleet HQ</h1>
    
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
            Streamline your food truck operations with FleetHQ. Manage trucks, menus, 
            orders, and schedules all in one beautiful, easy-to-use platform.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Get Started
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// SVG Illustrations (Simple hand-drawn style)
const FryingPanSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Frying Pan */}
    <circle cx="50" cy="50" r="35" stroke="#D87B2A" strokeWidth="3" fill="#FFF5EB"/>
    <circle cx="50" cy="50" r="25" stroke="#D87B2A" strokeWidth="2" fill="none" strokeDasharray="2 2"/>
    {/* Egg */}
    <ellipse cx="50" cy="50" rx="18" ry="20" fill="#FFFFFF" stroke="#333" strokeWidth="2"/>
    <circle cx="50" cy="50" r="8" fill="#FFB347"/>
    {/* Handle */}
    <rect x="80" y="48" width="35" height="4" rx="2" fill="#C62828"/>
    <path d="M 80 45 L 80 55" stroke="#C62828" strokeWidth="2"/>
  </svg>
);

const KnifeSVG = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blade */}
    <path d="M 30 30 L 70 50 L 30 70 Z" fill="#E0E0E0" stroke="#666" strokeWidth="2"/>
    {/* Handle */}
    <rect x="15" y="45" width="20" height="10" rx="2" fill="#C62828"/>
    <rect x="20" y="45" width="3" height="10" fill="#A02020"/>
  </svg>
);

const RollingPinSVG = () => (
  <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Handles */}
    <rect x="5" y="25" width="15" height="10" rx="5" fill="#D87B2A"/>
    <rect x="100" y="25" width="15" height="10" rx="5" fill="#D87B2A"/>
    {/* Roller */}
    <rect x="20" y="20" width="80" height="20" rx="10" fill="#F4A460"/>
    <line x1="30" y1="20" x2="30" y2="40" stroke="#D87B2A" strokeWidth="1"/>
    <line x1="50" y1="20" x2="50" y2="40" stroke="#D87B2A" strokeWidth="1"/>
    <line x1="70" y1="20" x2="70" y2="40" stroke="#D87B2A" strokeWidth="1"/>
    <line x1="90" y1="20" x2="90" y2="40" stroke="#D87B2A" strokeWidth="1"/>
  </svg>
);

const SpoonSVG = () => (
  <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bowl */}
    <ellipse cx="40" cy="25" rx="20" ry="25" fill="#F4A460" stroke="#D87B2A" strokeWidth="2"/>
    {/* Handle */}
    <rect x="37" y="40" width="6" height="70" rx="3" fill="#F4A460" stroke="#D87B2A" strokeWidth="2"/>
    {/* Decorative rings */}
    <circle cx="40" cy="55" r="4" fill="none" stroke="#D87B2A" strokeWidth="1"/>
    <circle cx="40" cy="75" r="4" fill="none" stroke="#D87B2A" strokeWidth="1"/>
  </svg>
);