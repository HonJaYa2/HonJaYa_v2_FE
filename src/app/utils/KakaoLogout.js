// import axios from 'axios';

// export const kakaoLogout = async (accessToken) => {
//   try {
//     await axios({
//       method: 'POST',
//       url: 'https://kapi.kakao.com/v1/user/logout',
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Authorization": `Bearer ${accessToken}`
//       },
//     });
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("user_id");
//     localStorage.removeItem("userGender");
//     localStorage.removeItem("username");
//     window.location.href = '/landing';
//   } catch (e) {
//     console.log('e : ', e);
//     if (e.response && e.response.data && e.response.data.code === -401) {
//       window.location.href = '/landing';
//     }
//   }
// };
