import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "http://localhost:8080/api";
const kakaoURL = "https://dapi.kakao.com/v2";
const groupChatURL = "http://localhost:8081";

const setHeaders = (dest: any) => {
  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "",
  };
  if (token && dest !== "groupChat") {
    headers["Authorization"] =
      dest === "honjaya"
        ? `Bearer ${token}`
        : `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`;
  }
  return headers;
};

export const getData = async (endpoint: any, dest: any) => {
  try {
    const url = dest !== "groupChat"
      ? dest === "honjaya"
        ? `${baseURL}${endpoint}`
        : `${kakaoURL}${endpoint}`
      : `${groupChatURL}${endpoint}`;

    console.log(url);
    
    const response = await axios.get(url, {
      headers: setHeaders(dest),
      withCredentials: true,
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(`Failed to get data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async (endpoint: any, data: any, dest: any) => {
  try {
    const url = dest !== "groupChat"
      ? dest === "honjaya"
        ? `${baseURL}${endpoint}`
        : `${kakaoURL}${endpoint}`
      : `${groupChatURL}${endpoint}`;

    const response = await axios.post(url, data, {
      headers: setHeaders(dest),
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(`Failed to post data to ${endpoint}:`, error);
    throw error;
  }
};

export const putData = async (endpoint: any, data: any, dest: any) => {
  try {
    const url = dest !== "groupChat"
      ? dest === "honjaya"
        ? `${baseURL}${endpoint}`
        : `${kakaoURL}${endpoint}`
      : `${groupChatURL}${endpoint}`;

    const response = await axios.put(url, data, {
      headers: setHeaders(dest),
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(`Failed to put data to ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async (endpoint: any, data: any, dest: any) => {
  try {
    const url = dest !== "groupChat"
      ? dest === "honjaya"
        ? `${baseURL}${endpoint}`
        : `${kakaoURL}${endpoint}`
      : `${groupChatURL}${endpoint}`;

    const response = await axios.delete(url, {
      headers: setHeaders(dest),
      data: data,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to delete data from ${endpoint}:`, error);
    throw error;
  }
};
