// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import React from 'react'
import '../../styles/mypage.css'

// NOTE: 현재 컴포넌트는 데모/프론트엔드용 목업 데이터를 사용합니다.
// 실제 수치(획득한 성취, 완료율, 경험치 등)는 백엔드 API
// 예: GET /api/user/achievements, /api/user/stats 로 교체해야 합니다.

const achievementsSample = [
    { id: 1, title: '첫 걸음', desc: '첫 문제 풀이 완료', achieved: true, icon: '🥇' },
    { id: 2, title: '연속 학습자', desc: '5일 연속 학습', achieved: true, icon: '🔥' },
    { id: 3, title: '정확한 사수', desc: '정답률 90% 달성', achieved: false, icon: '🎯' },
    { id: 4, title: '속도왕', desc: '평균 15초 이내 답변', achieved: true, icon: '⚡' },
    { id: 5, title: '완벽주의자', desc: '한 과목 100% 정답률', achieved: false, icon: '⭐' },
    { id: 6, title: '도전자', desc: '고급 문제 10개 풀이', achieved: true, icon: '🛡️' },
]

export default function Achievment() {
    // 요약 통계 (예시 데이터)
    const totalAchieved = achievementsSample.filter(a => a.achieved).length
    const completionRate = 67 // 임의값 — 실제는 API 연동
    const exp = 1250

    // 다음 목표 예시(정확한 사수 90% 도달 중) — 진행률 79/90
    const nextGoal = {
        title: '정확한 사수',
        subtitle: '정답률 90% 달성하기',
        progress: 79,
        target: 90,
    }

    return (
        <div className="achievement-root">
            <header className="achievement-header">
                <h2>성취도</h2>
                <p className="achievement-sub">학습 과정에서 달성한 성과들을 확인해보세요</p>
            </header>

            <section className="achievement-stats">
                <div className="stat-box orange">
                    <div className="stat-label">획득한 성취</div>
                    <div className="stat-value">{totalAchieved}</div>
                </div>
                <div className="stat-box purple">
                    <div className="stat-label">완료율</div>
                    <div className="stat-value">{completionRate}%</div>
                </div>
                <div className="stat-box green">
                    <div className="stat-label">경험치</div>
                    <div className="stat-value">{exp.toLocaleString()}</div>
                </div>
            </section>

            <section className="achievement-cards">
                {achievementsSample.map(a => (
                    <div key={a.id} className={`achievement-card ${a.achieved ? 'done' : ''}`}>
                        <div className="achievement-icon">{a.icon}</div>
                        <div className="achievement-body">
                            <div className="achievement-title">{a.title}</div>
                            <div className="achievement-desc">{a.desc}</div>
                        </div>
                        <div className={`achievement-badge ${a.achieved ? 'badge-done' : 'badge-progress'}`}>{a.achieved ? '달성 완료' : '진행 중'}</div>
                    </div>
                ))}
            </section>

            <section className="next-goal">
                <div className="next-head">
                    <h4>다음 목표</h4>
                    <div className="next-meta">
                        <div className="next-title">{nextGoal.title}</div>
                        <div className="next-sub">{nextGoal.subtitle}</div>
                    </div>
                </div>

                <div className="progress-container">
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${(nextGoal.progress / nextGoal.target) * 100}%` }}
                        />
                    </div>
                    <div className="progress-label">{nextGoal.progress}/{nextGoal.target}%</div>
                </div>
            </section>
        </div>
    )
}