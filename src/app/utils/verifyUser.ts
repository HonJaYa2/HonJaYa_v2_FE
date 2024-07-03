'use client'

export const verifyUser = () => {
    //accessToken과 user_id 중 둘 중 하나라도 로컬 스토리지에 저장되어있지 않다면, 
    //로컬 스토리지 초기화 후 false 반환
    //둘 다 저장되어있는 경우 true 반환
    if (!localStorage.getItem('access_token') || !localStorage.getItem('user_id')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        return false;
    }
    return true;
}