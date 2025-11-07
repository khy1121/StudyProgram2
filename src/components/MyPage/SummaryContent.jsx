const SummaryContent = () => {
    return (
        <div>
            {/*인사, 전체 정답률 탭*/}
            <section className='welcomeTab'>
                <div className='text'>
                    <p className="welcome">안녕하세요, 김학생님!</p>
                    <p className='sub'>오늘도 열심히 학습하고 계시네요!</p>
                </div>
                <div className='progress'>
                    <span>79%</span>
                    <p>전체 정답률</p>
                </div>
            </section>

            {/*요약 탭 */}
            <section className='summaryTab'>
                <div className='card'>
                    <p>총 문제 수</p>
                    <h3>156</h3>
                </div>
                <div className='card'>
                    <p>정답 수</p>
                    <h3>124</h3>
                </div>
                <div className='card'>
                    <p>평균 시간</p>
                    <h3>45초</h3>
                </div>
                <div className='card'>
                    <p>연속 학습</p>
                    <h3>5일</h3>
                </div>
            </section>

            {/*직무 추천 탭 */}
            <section className='recommandTab'>
                <h4>직무 추천</h4>
                <p>학습 데이터 기반으로 직무 추천</p>
            </section>
        </div>
    );
}

export default SummaryContent;