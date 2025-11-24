import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../../styles/mypage.css'; //헤더, 탭, 공통 레이아웃 스타일 적용
// import { useTheme } from '../../contexts/ThemeContext';


const MyPage = () => {
    const navigate = useNavigate();
    // const { theme, toggleTheme } = useTheme();


    return (
        <div className="mypage-container">
            {/* 마이페이지 헤더: 테마 적용된 고유 클래스 사용 */}
            <header className="mypage-header">
                <div className="mypage-header-inner">
                    <button className="mypage-btn-back" aria-label="뒤로가기" onClick={() => navigate(-1)}>← Back</button>
                    {/* <button className="header-btn theme-toggle" onClick={toggleTheme}>
                        {theme === 'dark' ? '☀️라이트' : '🌙 다크'}
                    </button> */}
                    <div className="mypage-brand">
                        <div className="mypage-brand-icon">📘</div>
                        <h1 className="mypage-brand-title">마이페이지</h1>
                    </div>
                    <button className="mypage-btn-home" onClick={() => navigate('/home')}>메인으로</button>
                </div>
            </header>
            {/*상단 탭 메뉴*/}
            <nav className='selectTab'>
                <span onClick={() => navigate("/mypage")}>대시보드</span>
                <span onClick={() => navigate("/mypage/study-anal")}>학습 분석</span>
                <span onClick={() => navigate("/mypage/wrong-note")}>오답 노트</span>
                <span onClick={() => navigate("/mypage/achievment")}>성취도</span>
                <span onClick={() => navigate("/mypage/settings")}>설정</span>
            </nav>

            {/* 하위 페이지 컨텐츠가 여기에 로드됨 */}
            <div className='mypage-content'>
                <Outlet />
            </div>
        </div>
    );
}
export default MyPage;