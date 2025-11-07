import { Outlet } from "react-router-dom";

export default function DashBoard() {
  return (
    <div className="
      flex flex-col relative
      w-[375px] min-h-screen bg-white shadow-md
      max-[480px]:w-full
    ">
      {/* <header>
        <p>학습 플랫폼</p>
        <p>마이페이지</p>
        <p>로그아웃</p>
      </header>
      <body>
        <p>대시보드</p>
        <p>학습분석</p>
        <p>오답노트</p>
        <p>성취도</p>
        <p>설정</p>
      </body> */}
      <Outlet />
    </div>
  );
}
