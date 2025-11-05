import React from 'react';
import ResultsCard from './ResultsCard';
import '../../styles/problem.css';

export default function ResultsPageComponent({ results, onRetry, onHome, theme }) {
  return (
    <div className={`problem-page ${theme}`}>
      <header className="problem-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">🎉</div>
            <div className="brand-title">학습 완료!</div>
          </div>
          <button 
            className="link-home"
            onClick={onHome}
          >
            메인으로
          </button>
        </div>
      </header>

      <main className="results-container">
        {/* ResultsCard 컴포넌트로 결과 표시 */}
        <ResultsCard results={results} />
      </main>

      <footer className="results-footer">
        <div className="results-footer-inner">
          <div className="results-actions">
            <button
              className="action-button primary" 
              onClick={onRetry}
            >
              다시 학습하기
            </button>
            <button
              className="action-button secondary"
              onClick={onHome}
            >
              메인으로
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
