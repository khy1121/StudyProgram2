import React, { useMemo, useState } from "react";
import "./select.css";

/**
 * 학습 과목 선택 페이지 (단독 파일 버전)
 * - 과목 선택
 * - 난이도 선택 (HIDE 토글)
 * - 학습 모드 선택 (HIDE 토글)
 * - 학습 시간 슬라이더 (HIDE 토글)
 * - [학습 시작] 버튼 (선택 조건 충족 시 활성화)
 *
 * onStart(optional): (payload) => void
 *  payload = { subject, difficulty, mode, studyTimeMin }
 */
export default function SelectPage({ onStart }) {
  // 섹션 표시 토글(HIDE ON/OFF)
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [showMode, setShowMode] = useState(true);
  const [showTime, setShowTime] = useState(true);

  // 선택 상태
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [mode, setMode] = useState(null);
  const [studyTime, setStudyTime] = useState(30); // 분 (10~120)

  // 유효성
  const canStart = useMemo(() => {
    return !!subject && (!!difficulty || !showDifficulty) && (!!mode || !showMode);
  }, [subject, difficulty, mode, showDifficulty, showMode]);

  const handleStart = () => {
    if (!canStart) return;
    const payload = {
      subject,
      difficulty: showDifficulty ? difficulty : null,
      mode: showMode ? mode : null,
      studyTimeMin: showTime ? Number(studyTime) : null,
    };
    if (typeof onStart === "function") onStart(payload);
    else console.log("START:", payload);
  };

  // 키보드: Enter로 시작
  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canStart, subject, difficulty, mode, studyTime, showDifficulty, showMode, showTime]);

  return (
    <div className="select-root">
      {/* HEADER */}
      <header className="select-header">
        <div className="header-inner">
          <button className="icon-back" aria-label="뒤로가기" onClick={() => history.back()}>
            ←
          </button>
          <div className="brand">
            <div className="brand-icon">📘</div>
            <h1 className="brand-title">학습 플랫폼</h1>
          </div>
          <a className="link-home" href="/">메인으로</a>
        </div>
      </header>

      {/* BODY */}
      <main className="select-body">
        <section className="container">
          {/* 타이틀 */}
          <div className="section-head">
            <h2 className="title">과목 선택</h2>
            <p className="subtitle">학습할 과목과 설정을 선택하세요</p>
          </div>

          {/* 과목 선택 */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">과목 선택</h3>
            </div>
            <div className="card-grid">
              <SubjectCard
                active={subject === "os"}
                color="blue"
                title="운영체제"
                onClick={() => setSubject("os")}
              />
              <SubjectCard
                active={subject === "ds"}
                color="green"
                title="자료구조"
                onClick={() => setSubject("ds")}
              />
              <SubjectCard
                active={subject === "web"}
                color="purple"
                title="웹프레임워크"
                onClick={() => setSubject("web")}
              />
            </div>
          </div>

          {/* 난이도 (HIDE 토글) */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">난이도 선택</h3>
              <HideToggle on={showDifficulty} onToggle={() => setShowDifficulty(v => !v)} />
            </div>
            {showDifficulty && (
              <div className="pill-grid">
                <Pill
                  active={difficulty === "초급"}
                  onClick={() => setDifficulty("초급")}
                  title="초급"
                  desc="기본 개념 중심"
                />
                <Pill
                  active={difficulty === "중급"}
                  onClick={() => setDifficulty("중급")}
                  title="중급"
                  desc="응용 문제 포함"
                />
                <Pill
                  active={difficulty === "고급"}
                  onClick={() => setDifficulty("고급")}
                  title="고급"
                  desc="심화 문제 중심"
                />
              </div>
            )}
          </div>

          {/* 학습 모드 (HIDE 토글) */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">학습 모드</h3>
              <HideToggle on={showMode} onToggle={() => setShowMode(v => !v)} />
            </div>
            {showMode && (
              <div className="mode-grid">
                <ModeCard
                  active={mode === "quiz"}
                  highlight
                  title="퀴즈 모드"
                  desc="정답 즉시 확인"
                  onClick={() => setMode("quiz")}
                />
                <ModeCard
                  active={mode === "exam"}
                  title="시험 모드"
                  desc="전체 완료 후 채점"
                  onClick={() => setMode("exam")}
                />
              </div>
            )}
          </div>

          {/* 학습 시간 (HIDE 토글) */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">학습 시간 설정</h3>
              <HideToggle on={showTime} onToggle={() => setShowTime(v => !v)} />
            </div>
            {showTime && (
              <div className="time-box">
                <div className="time-row">
                  <span className="time-label">학습 시간</span>
                  <span className="time-value">{studyTime}분</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={studyTime}
                  onChange={(e) => setStudyTime(e.target.value)}
                  className="time-range"
                />
                <div className="time-minmax">
                  <span>10분</span>
                  <span>120분</span>
                </div>
              </div>
            )}
          </div>

          {/* 시작 버튼 */}
          <div className="action-row">
            <button
              className={`btn-start ${canStart ? "on" : "off"}`}
              disabled={!canStart}
              onClick={handleStart}
            >
              ▶ 학습 시작
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ------- Sub Components ------- */

function SubjectCard({ active, color, title, onClick }) {
  return (
    <button
      className={`subject-card ${active ? "active" : ""} color-${color}`}
      onClick={onClick}
      type="button"
    >
      <div className={`subject-icon ${color}`}>{/* icon placeholder */}</div>
      <div className="subject-title">{title}</div>
    </button>
  );
}

function Pill({ active, title, desc, onClick }) {
  return (
    <button className={`pill ${active ? "active" : ""}`} onClick={onClick} type="button">
      <div className="pill-title">{title}</div>
      <div className="pill-desc">{desc}</div>
    </button>
  );
}

function ModeCard({ active, title, desc, onClick, highlight = false }) {
  return (
    <button
      className={`mode-card ${active ? "active" : ""} ${highlight ? "highlight" : ""}`}
      onClick={onClick}
      type="button"
    >
      <div className="mode-title">{title}</div>
      <div className="mode-desc">{desc}</div>
    </button>
  );
}

function HideToggle({ on, onToggle }) {
  return (
    <button
      type="button"
      className={`hide-toggle ${on ? "on" : "off"}`}
      onClick={onToggle}
      aria-pressed={on}
      title="HIDE ON/OFF"
    >
      {on ? "HIDE: OFF" : "HIDE: ON"}
    </button>
  );
}
