// React, useEffect, useState
// 함수형 컴포넌트를 만들고, state·effect를 사용하기 위한 기본 import.

// useTheme
// ThemeContext에서 제공하는 커스텀 훅. 현재 테마(light/dark)와 테마 전환 함수(toggleTheme)를 가져오기 위해 사용.

// useNavigate
// react-router-dom의 훅. navigate('/')처럼 호출해서 다른 라우트로 이동할 수 있음.

// mypage.css
// 이 컴포넌트에 사용하는 스타일들.
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import '../../styles/mypage.css'


// localStorage.getItem(key)로 문자열을 꺼내고 JSON.parse로 객체로 변환.
// 만약:
// 값이 null이거나
// JSON 형식이 잘못되었거나
// → 에러가 나도 catch에서 fallback 값을 돌려줌.
// 즉, "로컬스토리지에서 안전하게 JSON 읽기" 용 함수.
function safeParse(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback
    } catch {
        return fallback
    }
}

// users 배열을 JSON.stringify해서 'users' 키에 저장.
// 저장 과정에서 에러가 나도 무시.
function saveUsers(users) {
    try {
        localStorage.setItem('users', JSON.stringify(users))
    } catch (e) {
        // ignore
    }
}


// useTheme()
// theme: 현재 테마 문자열 (예: 'light' / 'dark')

// toggleTheme: 테마를 토글하는 함수

// useNavigate()
// 다른 페이지로 이동하기 위한 함수 리턴.

// user 상태
// { name: '', email: '' } 기본값.
// 로컬스토리지에서 현재 로그인한 유저 정보를 읽어와서 채울 예정.

// prefs 상태
// { notify: true, autosave: true } 기본값.
// 알림 사용 여부, 자동 저장 여부.

const Settings = () =>{
        const { theme, toggleTheme } = useTheme()
        const navigate = useNavigate()

        const [user, setUser] = useState({ name: '', email: '' })
        const [prefs, setPrefs] = useState({ notify: true, autosave: true })

        useEffect(() => {
            // 1 currentUser 키를 먼저 읽음.
            const cur = safeParse('currentUser', null)
            // 2 cur가 존재하고 cur.name이 있으면:
            if (cur && cur.name) {
                setUser({ name: cur.name, email: cur.email || '' })
            }
              // 그렇지 않으면(else):
            // users 배열을 safeParse('users', [])로 가져옴. 
            //현재 로그인한 유저 정보로 상태 설정.
            // 배열에 무언가 있다면 users[0]을 기본 유저로 보고 user 상태 설정.
            // ⇒ 우선순위: currentUser → 없으면 users[0].
            else {
                const users = safeParse('users', [])
                if (users.length > 0) {
                    setUser({ name: users[0].name || '', email: users[0].email || '' })
                }
            }


            // appSettings에서 설정을 읽어서 prefs를 덮어씀.
            // !!s.notify처럼 불리언 강제 변환을 해서 true/false만 남도록 함.
            const s = safeParse('appSettings', null)
            if (s) setPrefs({ notify: !!s.notify, autosave: !!s.autosave })
        }, [])

        //로컬스토리지에서 currentUser를 삭제해서 로그인 상태를 해제.
        // 이후 navigate('/')로 홈(또는 로그인) 페이지로 이동.
        // 현재 JSX에서는 handleLogout 버튼은 없지만, 나중에 로그아웃 버튼을 붙이면 사용할 수 있음.
        const handleLogout = () => {
            localStorage.removeItem('currentUser')
            navigate('/')
        }
            // showModal: 프로필 수정 모달 열림 여부.
            // form: 모달 안에서 사용하는 입력 값들.
            const [showModal, setShowModal] = useState(false)
            const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })

            // 현재 user 상태를 바탕으로 폼 초기값 세팅.
            // 모달을 열기 위해 setShowModal(true).
            const handleEditProfile = () => {
                setForm({ name: user.name || '', email: user.email || '', password: '', passwordConfirm: '' })
                setShowModal(true)
            }
            // 간단한 정규식으로 이메일 형식인지 확인.
            // something@something.something 정도만 체크하는 아주 러프한 검사.
            const validateEmail = (e) => /.+@.+\..+/.test(e)

            // 1. 이름이 비었으면 경고.
            // 2. 이메일 형식이 잘못됐으면 경고.
            // 3.비밀번호를 입력한 경우 길이가 8자 미만이면 경고.
            // 4. 비밀번호와 확인란이 다르면 경고.
            // 이 중 하나라도 걸리면 return으로 함수 종료.
            const submitProfile = () => {
                if (!form.name) return alert('이름을 입력하세요')
                if (!validateEmail(form.email)) return alert('올바른 이메일을 입력하세요')
                if (form.password && form.password.length < 8) return alert('비밀번호는 8자 이상이어야 합니다')
                if (form.password && form.password !== form.passwordConfirm) return alert('비밀번호와 확인이 일치하지 않습니다')

                    // 기존 user 객체를 복사한 뒤 이름과 이메일을 폼 값으로 덮어씌운 updated 생성.
                   // 상태 user를 갱신.
                const updated = { ...user, name: form.name, email: form.email }
                setUser(updated)

                // 로컬스토리지의 currentUser와 studyapp_current_user를 새 값으로 저장.
                // window.location.reload()로 페이지 전체를 새로고침해서 홈 등 다른 컴포넌트에서도 이름이 바로 반영되도록 함.
                // (조금 하드한 방식이지만, 전체 상태를 리셋하기 쉬운 방법)
                try {
                    localStorage.setItem('currentUser', JSON.stringify(updated))
                    localStorage.setItem('studyapp_current_user', JSON.stringify(updated));
                    window.location.reload(); // 새로고침으로 Home의 이름 반영   

                   // users 배열을 가져와서:
                   // 기존 user.email과 같은 이메일 가진 유저를 찾음.
                   // 있으면 해당 유저의 name/email을 수정.
                   // 없으면, fallback으로 users[0]를 수정. (첫 번째 유저를 ‘현재 유저’라고 가정한 처리)
                    const users = safeParse('users', [])
                    const idx = users.findIndex(u => u.email === user.email)
                    if (idx >= 0) {
                        users[idx] = { ...users[idx], name: form.name, email: form.email }
                    } else {
                        if (users.length > 0) users[0] = { ...users[0], name: form.name, email: form.email }
                    }

                    // 비밀번호를 입력했으면:
                    // form.email과 일치하는 유저를 찾아서 password 필드 업데이트.
                    // 마지막에 saveUsers(users)로 전체 users 배열을 저장.
                    // 이 부분 주석에도 적혀 있듯, 데모라서 평문 비밀번호를 저장하고 있음(실서비스에선 절대 X).
                    if (form.password) {
                        // update password in users array (note: still plain-text in demo)
                        const targetIdx = users.findIndex(u => u.email === form.email)
                        if (targetIdx >= 0) users[targetIdx].password = form.password
                    }
                    saveUsers(users)
                } catch (e) {
                    console.error('profile save error', e)
                }

                // 같은 브라우저 탭에서 동작 중인 다른 컴포넌트들이 window.addEventListener('user-updated', ...)를 통해 유저 변경을 감지할 수 있도록 커스텀 이벤트 발송.
                // 모달 닫기.
                try { window.dispatchEvent(new CustomEvent('user-updated')) } catch(e){}
                setShowModal(false)
            }

        // notify, autosave 같은 설정을 토글할 때 사용하는 공용 함수.
        // prefs 객체를 복사하고 [key]의 값을 반전시켜 새 객체 next 생성.
        // 상태 업데이트 + 로컬스토리지에 appSettings로 저장.
        const togglePref = (key) => {
            const next = { ...prefs, [key]: !prefs[key] }
            setPrefs(next)
            localStorage.setItem('appSettings', JSON.stringify(next))
        }

        // 다크 모드 토글 버튼에서 호출.
        // ThemeContext에서 받아온 toggleTheme() 실행.
        const handleToggleDark = () => {
            toggleTheme()
        }

        return (
                <div className='settings-root'>
                    <h3>설정</h3>

                    {/* 아바타 부분: 이름이 있으면 첫 글자, 없으면 기본 아이콘 📘.
                    이름/이메일 표시.
                    “프로필 수정” 버튼 → handleEditProfile로 모달 오픈. */}
                    <section className='settings-section profile-section'>
                        <div className='profile-card'>
                            <div className='profile-avatar'>
                                {user.name ? user.name.charAt(0) : '📘' }
                            </div>
                            <div className='profile-info'>
                                <div className='profile-name'>{user.name || '이름 없음'}</div>
                                <div className='profile-email'>{user.email || '이메일 없음'}</div>
                            </div>
                            <div className='profile-actions'>
                                <button className='btn ghost' onClick={handleEditProfile}>프로필 수정</button>
                            </div>
                        </div>
                    </section>

                    {/* prefs.notify 상태에 따라 toggle-switch on 또는 그냥 toggle-switch.
                    버튼 클릭 시 togglePref('notify')로 값 토글 + 저장. */}
                    <section className='settings-section'>
                        <h4>학습 설정</h4>
                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>알림 설정</div>
                                <div className='settings-desc'>학습 리마인더 알림을 받습니다</div>
                            </div>
                            <button className={`toggle-switch ${prefs.notify ? 'on' : ''}`} onClick={() => togglePref('notify')}>
                                <span />
                            </button>
                        </div>

                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>자동 저장</div>
                                <div className='settings-desc'>학습 진도 자동으로 저장합니다</div>
                            </div>
                            <button className={`toggle-switch ${prefs.autosave ? 'on' : ''}`} onClick={() => togglePref('autosave')}>
                                <span />
                            </button>
                        </div>

                    {/* 위와 동일 패턴, prefs.autosave를 토글. */}
                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>다크 모드</div>
                                <div className='settings-desc'>어두운 테마를 사용합니다</div>
                            </div>
                            <button className={`toggle-switch ${theme === 'dark' ? 'on' : ''}`} onClick={handleToggleDark}>
                                <span />
                            </button>
                        </div>
                    </section>
                                {/* showModal === true일 때만 렌더링.
                                    바깥 modal-overlay 클릭하면 모달 닫힘.
                                    안쪽 modal은 e.stopPropagation()으로 이벤트 버블링 막아서 overlay 클릭 취소.
                                    각 input은 form 상태와 연결되어 있음.
                                    “수정 완료” → submitProfile 실행. */}
                                {showModal && (
                                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                                        <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                                            <h3>프로필 수정</h3>
                                            <div className="modal-row">
                                                <label>닉네임</label>
                                                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                                            </div>
                                            <div className="modal-row">
                                                <label>이메일</label>
                                                <input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                                            </div>
                                            <div className="modal-row">
                                                <label>비밀번호</label>
                                                <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="변경할 비밀번호(선택)" />
                                            </div>
                                            <div className="modal-row">
                                                <label>비밀번호 확인</label>
                                                <input type="password" value={form.passwordConfirm} onChange={(e) => setForm(f => ({ ...f, passwordConfirm: e.target.value }))} placeholder="비밀번호 확인" />
                                            </div>
                                            <div className="modal-actions">
                                                <button className='btn ghost' onClick={() => setShowModal(false)}>취소</button>
                                                <button className='btn primary' onClick={submitProfile}>수정 완료</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                    {/* 아직 실제 다운로드 기능은 없고, 그냥 데모용 alert만 띄움. */}
                    <section className='settings-section'>
                        <h4>데이터 관리</h4>
                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>학습 데이터 내보내기</div>
                                <div className='settings-desc'>학습 기록을 JSON 파일로 다운로드</div>
                            </div>
                            <button className='btn ghost' onClick={() => alert('다운로드 (데모)')}>내보내기</button>
                        </div>

                                    {/* appCache, tempData 두 키만 제거해서 부분 캐시 삭제.
                                        전체 localStorage.clear()를 하지 않아서 계정 정보 등은 유지. */}
                                    <div className='settings-row'>
                                        <div>
                                            <div className='settings-label'>캐시 데이터 삭제</div>
                                            <div className='settings-desc'>임시 저장된 데이터를 삭제합니다</div>
                                        </div>
                                        <button className='btn ghost' onClick={() => {
                                            // 안전: 전체 로컬스토리지를 지우지 않고 캐시 관련 키만 제거
                                            try {
                                                localStorage.removeItem('appCache')
                                                localStorage.removeItem('tempData')
                                                alert('캐시 데이터가 삭제되었습니다')
                                            } catch(e) {
                                                console.error(e)
                                                alert('삭제 중 오류가 발생했습니다')
                                            }
                                        }}>삭제</button>
                                    </div>
                        {/*
                            빨간 느낌 경고 버튼 스타일.
                            confirm 창으로 최종 확인.
                            users와 currentUser 삭제 → 사실상 이 앱에서 관리하던 유저/학습 데이터 초기화.
                            */}
                        <div className='danger-row'>
                            <button className='btn' style={{background:'#fff', color:'#ef4444', border:'1px solid rgba(239,68,68,0.12)'}} onClick={() => { if (confirm('모든 학습 기록을 삭제하시겠습니까?')) { localStorage.removeItem('users'); localStorage.removeItem('currentUser'); alert('삭제됨'); } }}>모든 학습 기록 삭제</button>
                        </div>
                    </section>
                </div>
        )
}

export default Settings;