# 다크/라이트 모드 테마 시스템 구현 문서

## 📋 목차
1. [개요](#개요)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [핵심 구성 요소](#핵심-구성-요소)
4. [주요 기능](#주요-기능)
5. [CSS 변수 시스템](#css-변수-시스템)
6. [구현 세부사항](#구현-세부사항)
7. [사용 가이드](#사용-가이드)

---

## 개요

### 프로젝트 정보
- **구현 날짜**: 2025년 11월 3일
- **리포지토리**: https://github.com/khy1121/StudyProgram
- **브랜치**: `feat/hy_change` → `main` 병합 완료

### 구현 목적
사용자 경험 개선을 위한 다크/라이트 모드 테마 전환 시스템 구축
- 전역 테마 상태 관리
- 모든 페이지에 일관된 테마 적용
- localStorage를 통한 사용자 선호도 저장
- 부드러운 테마 전환 애니메이션

### 주요 변경사항
- **11개 파일 수정** (625줄 추가, 141줄 삭제)
- **4개 신규 파일 생성**
- Home, SelectPage, Welcome 페이지 테마 적용

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────┐
│           React Application Root            │
│              (main.jsx)                     │
├─────────────────────────────────────────────┤
│          ThemeProvider (Context)            │
│  - 테마 상태 관리 (dark/light)              │
│  - localStorage 연동                         │
│  - data-theme 속성 설정                      │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┴──────────┬──────────────┐
    │                     │              │
┌───▼────┐         ┌─────▼─────┐   ┌───▼────┐
│  Home  │         │ SelectPage│   │ Welcome│
│ (테마적용)│        │  (테마적용)│   │(테마적용)│
└────────┘         └───────────┘   └────────┘
    │                     │              │
    └──────────┬──────────┴──────────────┘
               │
        ┌──────▼──────┐
        │  theme.css  │
        │ CSS 변수 정의│
        └─────────────┘
```

---

## 핵심 구성 요소

### 1. ThemeContext (테마 컨텍스트)
**파일**: `src/contexts/ThemeContext.jsx`

#### 주요 기능
- 전역 테마 상태 관리
- localStorage와 자동 동기화
- document.documentElement에 `data-theme` 속성 설정

#### 코드 구조
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // localStorage에서 테마 설정 가져오기, 기본값은 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  // 테마 변경 시 localStorage 저장 및 document에 클래스 적용
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### 사용된 React Hooks
- **useState**: 테마 상태 관리 (dark/light)
- **useEffect**: 테마 변경 감지 및 DOM/localStorage 업데이트
- **useContext**: 컴포넌트에서 테마 접근

---

### 2. Theme CSS Variables (테마 CSS 변수)
**파일**: `src/styles/theme.css`

#### CSS 변수 시스템
속성 선택자 `[data-theme="dark"]` 및 `[data-theme="light"]`를 사용하여 테마별 CSS 변수 정의

#### 다크 모드 변수
```css
:root[data-theme="dark"] {
  /* 배경 */
  --bg-primary: #0b1020;
  --bg-gradient-1: rgba(37, 99, 235, 0.12);
  --bg-gradient-2: rgba(168, 85, 247, 0.12);
  
  /* 카드/컨테이너 */
  --card-bg-from: rgba(255, 255, 255, 0.08);
  --card-bg-to: rgba(255, 255, 255, 0.04);
  --card-border: rgba(255, 255, 255, 0.12);
  --card-hover-bg-from: rgba(255, 255, 255, 0.12);
  --card-hover-bg-to: rgba(255, 255, 255, 0.06);
  
  /* 텍스트 */
  --text-primary: #f9fafb;
  --text-secondary: #e5e7eb;
  --text-tertiary: #cbd5e1;
  --text-muted: #9ca3af;
  
  /* 버튼 */
  --btn-bg: rgba(255, 255, 255, 0.06);
  --btn-border: rgba(255, 255, 255, 0.18);
  --btn-hover-bg: rgba(255, 255, 255, 0.1);
  --btn-hover-border: rgba(255, 255, 255, 0.24);
  
  /* 아이콘 배경 */
  --icon-blue-bg: rgba(59, 130, 246, 0.2);
  --icon-blue-color: #93c5fd;
  --icon-green-bg: rgba(34, 197, 94, 0.2);
  --icon-green-color: #86efac;
  --icon-orange-bg: rgba(251, 146, 60, 0.2);
  --icon-orange-color: #fdba74;
  
  /* 슬라이더 */
  --slider-track-bg: rgba(255, 255, 255, 0.1);
  --slider-thumb-bg: #2563eb;
  --slider-thumb-border: #93c5fd;
  --time-value-color: #93c5fd;
  
  /* 그림자 */
  --shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.3);
}
```

#### 라이트 모드 변수
```css
:root[data-theme="light"] {
  /* 배경 */
  --bg-primary: #f9fafb;
  --bg-gradient-1: transparent;
  --bg-gradient-2: transparent;
  
  /* 카드/컨테이너 */
  --card-bg-from: #ffffff;
  --card-bg-to: #ffffff;
  --card-border: #e5e7eb;
  --card-hover-bg-from: #f9fafb;
  --card-hover-bg-to: #f9fafb;
  
  /* 텍스트 */
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-tertiary: #6b7280;
  --text-muted: #9ca3af;
  
  /* 버튼 */
  --btn-bg: #ffffff;
  --btn-border: #e5e7eb;
  --btn-hover-bg: #f9fafb;
  --btn-hover-border: #d1d5db;
  
  /* 아이콘 배경 */
  --icon-blue-bg: #dbeafe;
  --icon-blue-color: #2563eb;
  --icon-green-bg: #d1fae5;
  --icon-green-color: #059669;
  --icon-orange-bg: #fed7aa;
  --icon-orange-color: #ea580c;
  
  /* 슬라이더 */
  --slider-track-bg: #e5e7eb;
  --slider-thumb-bg: #2563eb;
  --slider-thumb-border: #ffffff;
  --time-value-color: #2563eb;
  
  /* 그림자 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

---

### 3. Application Root 설정
**파일**: `src/main.jsx`

#### ThemeProvider 적용
```jsx
import "./styles/reset.css";
import "./styles/style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

#### 구조 설명
- `ThemeProvider`로 전체 앱을 감싸 모든 컴포넌트에서 테마 접근 가능
- React Strict Mode 내부에 배치하여 개발 모드 체크 활성화

---

## 주요 기능

### 1. Home 페이지 테마 토글
**파일**: `src/components/Home/Home.jsx`

#### 테마 버튼 구현
```jsx
import { useTheme } from '../../contexts/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">📘</div>
            <h1 className="brand-title">학습 플랫폼</h1>
          </div>
          <div className="header-actions">
            {/* 테마 토글 버튼 */}
            <button className="header-btn theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ 라이트' : '🌙 다크'}
            </button>
            {/* 기타 버튼들 */}
          </div>
        </div>
      </header>
      {/* 메인 컨텐츠 */}
    </div>
  );
}
```

#### 주요 클래스
- `.home-container`: 페이지 전체 컨테이너
- `.header-btn.theme-toggle`: 테마 전환 버튼
- 동적 아이콘: 다크 모드(☀️), 라이트 모드(🌙)

---

### 2. Home 페이지 스타일링
**파일**: `src/styles/home.css`

#### CSS 변수 적용 예시
```css
@import './theme.css';

.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(1200px 600px at 10% 10%, var(--bg-gradient-1), rgba(255, 255, 255, 0) 60%),
              radial-gradient(1000px 500px at 90% 0%, var(--bg-gradient-2), rgba(255, 255, 255, 0) 60%),
              var(--bg-primary);
  color: var(--text-secondary);
  transition: background 0.3s ease, color 0.3s ease;
}

.stat-card {
  background: linear-gradient(180deg, var(--card-bg-from), var(--card-bg-to));
  border: 1px solid var(--card-border);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.stat-card:hover {
  background: linear-gradient(180deg, var(--card-hover-bg-from), var(--card-hover-bg-to));
  box-shadow: var(--shadow-md);
}
```

#### 레이아웃 개선
```css
/* 통계 카드 - 3개 가로 배치 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

/* 액션 카드 - 3개 가로 배치 */
.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 48px;
}

/* 반응형: 1024px 이하에서 1열로 */
@media (max-width: 1024px) {
  .stats-grid,
  .action-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 3. SelectPage 테마 적용
**파일**: `src/styles/select.css`

#### 주요 컴포넌트 스타일
```css
@import './theme.css';

/* 과목 선택 카드 */
.subject-card {
  background: linear-gradient(180deg, var(--card-bg-from), var(--card-bg-to));
  border: 2px solid var(--card-border);
  transition: all 0.2s;
}

.subject-title {
  font-weight: 600;
  color: var(--text-primary);
}

/* 난이도 선택 카드 */
.pill-title {
  color: var(--text-primary);
}

.pill-desc {
  color: var(--text-tertiary);
}

/* 학습 시간 슬라이더 */
.time-range {
  background: var(--slider-track-bg);
}

.time-range::-webkit-slider-thumb {
  background: var(--slider-thumb-bg);
  border: 2px solid var(--slider-thumb-border);
  box-shadow: 0 0 0 3px var(--slider-thumb-shadow);
}

.time-value {
  color: var(--time-value-color);
}
```

#### 슬라이더 가독성 개선
- **다크 모드**: 반투명 흰색 트랙, 연한 파란색 시간 표시
- **라이트 모드**: 회색 트랙, 진한 파란색 시간 표시

---

### 4. LandingPage 컴포넌트
**파일**: `src/pages/SelectCourse/LandingPage.jsx`

#### 주석 해제 및 활성화
```jsx
import { useNavigate } from "react-router-dom";
import SelectPage from "../../components/SelectCourse/selectPage";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStart = (payload) => {
    // TODO: /quiz 또는 /exam으로 이동
    console.log('학습 시작:', payload);
    // navigate("/exam", { state: payload });
  };

  return <SelectPage onStart={handleStart} />;
}
```

#### 라우팅 연결
- Home → `/select-course` → LandingPage → SelectPage
- SelectPage에서 과목/난이도/모드 선택 UI 제공

---

## CSS 변수 시스템

### 변수 카테고리

#### 1. 배경 (Background)
| 변수명 | 다크 모드 | 라이트 모드 | 용도 |
|--------|-----------|-------------|------|
| `--bg-primary` | `#0b1020` | `#f9fafb` | 페이지 기본 배경 |
| `--bg-gradient-1` | `rgba(37, 99, 235, 0.12)` | `transparent` | 그라데이션 효과 1 |
| `--bg-gradient-2` | `rgba(168, 85, 247, 0.12)` | `transparent` | 그라데이션 효과 2 |

#### 2. 카드/컨테이너 (Cards)
| 변수명 | 다크 모드 | 라이트 모드 | 용도 |
|--------|-----------|-------------|------|
| `--card-bg-from` | `rgba(255, 255, 255, 0.08)` | `#ffffff` | 카드 배경 시작색 |
| `--card-bg-to` | `rgba(255, 255, 255, 0.04)` | `#ffffff` | 카드 배경 종료색 |
| `--card-border` | `rgba(255, 255, 255, 0.12)` | `#e5e7eb` | 카드 테두리 |

#### 3. 텍스트 (Text)
| 변수명 | 다크 모드 | 라이트 모드 | 용도 |
|--------|-----------|-------------|------|
| `--text-primary` | `#f9fafb` | `#111827` | 주요 텍스트 |
| `--text-secondary` | `#e5e7eb` | `#374151` | 보조 텍스트 |
| `--text-tertiary` | `#cbd5e1` | `#6b7280` | 부가 설명 |
| `--text-muted` | `#9ca3af` | `#9ca3af` | 흐린 텍스트 |

#### 4. 인터랙티브 요소 (Interactive)
| 변수명 | 다크 모드 | 라이트 모드 | 용도 |
|--------|-----------|-------------|------|
| `--btn-bg` | `rgba(255, 255, 255, 0.06)` | `#ffffff` | 버튼 배경 |
| `--btn-border` | `rgba(255, 255, 255, 0.18)` | `#e5e7eb` | 버튼 테두리 |
| `--btn-hover-bg` | `rgba(255, 255, 255, 0.1)` | `#f9fafb` | 버튼 호버 배경 |

#### 5. 슬라이더 (Slider)
| 변수명 | 다크 모드 | 라이트 모드 | 용도 |
|--------|-----------|-------------|------|
| `--slider-track-bg` | `rgba(255, 255, 255, 0.1)` | `#e5e7eb` | 슬라이더 트랙 |
| `--slider-thumb-bg` | `#2563eb` | `#2563eb` | 슬라이더 썸 |
| `--time-value-color` | `#93c5fd` | `#2563eb` | 시간 값 색상 |

---

## 구현 세부사항

### 테마 전환 메커니즘

#### 1. 초기화 과정
```
사용자 접속
    ↓
ThemeProvider 마운트
    ↓
localStorage에서 'theme' 읽기
    ↓
값 있음? → 해당 값 사용
값 없음? → 'dark' 기본값
    ↓
document.documentElement.setAttribute('data-theme', theme)
    ↓
CSS 변수 활성화
```

#### 2. 테마 전환 흐름
```
사용자가 테마 버튼 클릭
    ↓
toggleTheme() 실행
    ↓
setState('dark' ↔ 'light')
    ↓
useEffect 트리거
    ↓
localStorage.setItem('theme', newTheme)
    ↓
document.documentElement.setAttribute('data-theme', newTheme)
    ↓
CSS transition 애니메이션 (0.3s ease)
    ↓
화면 전체 테마 변경 완료
```

### 파일 구조
```
src/
├── contexts/
│   └── ThemeContext.jsx          # 테마 컨텍스트 (신규)
├── components/
│   ├── Home/
│   │   └── Home.jsx               # 테마 버튼 추가
│   └── SelectCourse/
│       └── selectPage.jsx         # 테마 변수 적용
├── pages/
│   └── SelectCourse/
│       └── LandingPage.jsx        # 주석 해제 활성화
├── styles/
│   ├── theme.css                  # CSS 변수 정의 (신규)
│   ├── home.css                   # 테마 변수 적용
│   ├── select.css                 # 테마 변수 적용
│   ├── home_origin               # 백업 파일
│   └── select_origin             # 백업 파일
└── main.jsx                       # ThemeProvider 적용
```

---

## 사용 가이드

### 새로운 컴포넌트에 테마 적용하기

#### 1. React 컴포넌트에서 테마 사용
```jsx
import { useTheme } from '../../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>현재 테마: {theme}</p>
      <button onClick={toggleTheme}>테마 전환</button>
    </div>
  );
}
```

#### 2. CSS에서 테마 변수 사용
```css
@import './theme.css';

.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
  transition: background 0.3s ease, color 0.3s ease;
}

.my-card {
  background: linear-gradient(180deg, var(--card-bg-from), var(--card-bg-to));
  box-shadow: var(--shadow-md);
}
```

#### 3. 새로운 CSS 변수 추가
`src/styles/theme.css`에 변수 추가:
```css
:root[data-theme="dark"] {
  --my-custom-color: #your-dark-color;
}

:root[data-theme="light"] {
  --my-custom-color: #your-light-color;
}
```

### 테마 전환 애니메이션 커스터마이징
```css
.my-element {
  /* 기본: 0.3s ease */
  transition: background 0.3s ease, color 0.3s ease;
  
  /* 더 빠르게 */
  transition: background 0.15s ease, color 0.15s ease;
  
  /* 더 부드럽게 */
  transition: background 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 테마별 조건부 렌더링
```jsx
function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div>
      {theme === 'dark' ? (
        <img src="/dark-logo.png" alt="Logo" />
      ) : (
        <img src="/light-logo.png" alt="Logo" />
      )}
    </div>
  );
}
```

---

## 브라우저 호환성

### 지원 브라우저
- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

### 사용된 웹 표준
- **CSS Custom Properties (변수)**: 모든 모던 브라우저 지원
- **CSS Transitions**: 완전 지원
- **localStorage API**: 완전 지원
- **React Context API**: React 16.3+

---

## 성능 최적화

### 1. 메모이제이션
- ThemeContext의 값이 변경될 때만 리렌더링
- `useCallback`, `useMemo` 활용 가능

### 2. Transition 최적화
```css
/* GPU 가속 활용 */
.card {
  transition: transform 0.2s ease;
  will-change: transform;
}

/* 불필요한 transition 제거 */
.text {
  /* transition 없음 - 즉시 변경 */
  color: var(--text-primary);
}
```

### 3. localStorage 접근 최소화
- 초기 로드 시 1회만 읽기
- 변경 시에만 쓰기

---

## 향후 개선 방안

### 1. 시스템 테마 감지
```jsx
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  
  // 시스템 테마 감지
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};
```

### 2. 추가 테마 지원
```jsx
// Auto, Dark, Light 3가지 모드
const [themeMode, setThemeMode] = useState('auto'); // auto, dark, light
```

### 3. 테마별 이미지 최적화
```jsx
const getThemedImage = (baseName) => {
  return theme === 'dark' 
    ? `/images/${baseName}-dark.png`
    : `/images/${baseName}-light.png`;
};
```

### 4. Welcome 페이지 테마 적용
현재 Home, SelectPage에만 적용됨. Welcome 페이지도 동일하게 적용 필요.

---

## 트러블슈팅

### 문제 1: 테마가 저장되지 않음
**원인**: localStorage 권한 또는 Private 모드
**해결**: 
```jsx
try {
  localStorage.setItem('theme', theme);
} catch (e) {
  console.warn('localStorage not available');
}
```

### 문제 2: 페이지 로드 시 깜빡임
**원인**: CSS 변수 적용 전 렌더링
**해결**: 인라인 스크립트로 즉시 테마 적용
```html
<script>
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
</script>
```

### 문제 3: CSS 변수가 적용되지 않음
**원인**: `@import './theme.css'` 누락
**해결**: 모든 테마 적용 CSS 파일 상단에 import 추가

---

## 참고 자료

### 공식 문서
- [React Context API](https://react.dev/reference/react/useContext)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### 디자인 참고
- 다크 모드: 어두운 배경 + 밝은 텍스트 (기존 Welcome 페이지 스타일)
- 라이트 모드: 밝은 배경 (#f9fafb) + 어두운 텍스트 (Material Design 가이드라인)

### 커밋 이력
- 브랜치: `feat/hy_change`
- 커밋: `70315d2` (feat: 다크/라이트 모드 테마 전환 기능 추가)
- 리포지토리: https://github.com/khy1121/StudyProgram

---

## 라이선스 및 기여

이 프로젝트는 학습 플랫폼의 일부이며, 모든 변경사항은 StudyProgram 리포지토리에서 관리됩니다.

**작성일**: 2025년 11월 3일  
**버전**: 1.0.0  
**작성자**: khy1121
