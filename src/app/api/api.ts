const baseURL = "http://localhost:8080/api";
const kakaoURL = "https://dapi.kakao.com/v2";
const groupChatURL = "http://localhost:8081";

const setHeaders = (dest: any) => {
  const token = localStorage.getItem("access_token");
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
    const response = await fetch(
      `${
        dest !== "groupChat"
          ? dest === "honjaya"
            ? `${baseURL}${endpoint}`
            : `${kakaoURL}${endpoint}`
          : `${groupChatURL}${endpoint}`
      }`, 
      {
        method: "GET",
        headers: setHeaders(dest),
      }
    );
    console.log(response);
    // if (!response.ok) {
    //   throw new Error(
    //     `Failed to get data from ${endpoint}: ${response.statusText}`
    //   );
    // }
    return await response.json();
  } catch (error) {
    console.log(`Failed to get data from ${endpoint}:`, error);
  }
};

export const postData = async (endpoint: any, data: any, dest: any) => {
  try {
    if(data !== "") {
      const response = await fetch(
        `${
          dest !== "groupChat"
            ? dest === "honjaya"
              ? `${baseURL}${endpoint}`
              : `${kakaoURL}${endpoint}`
            : `${groupChatURL}${endpoint}`
        }`,
        {
          method: "POST",
          headers: setHeaders(dest),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to post data to ${endpoint}: ${response.statusText}`
        );
      }
      return await response.json();
    } else {
      const response = await fetch(
        `${
          dest !== "groupChat"
            ? dest === "honjaya"
              ? `${baseURL}${endpoint}`
              : `${kakaoURL}${endpoint}`
            : `${groupChatURL}${endpoint}`
        }`,
        {
          method: "POST",
          headers: setHeaders(dest),
          credentials: "include",

        }
      );
      // if (!response.ok) {
      //   throw new Error(
      //     `Failed to post data to ${endpoint}: ${response.statusText}`
      //   );
      // }
      return await response.json();
    }



  } catch (error) {
    console.log(`Failed to post data to ${endpoint}:`, error);
  }
};

export const putData = async (endpoint: any, data: any, dest: any) => {
  try {
    const response = await fetch(
      `${
        dest !== "groupChat"
          ? dest === "honjaya"
            ? `${baseURL}${endpoint}`
            : `${kakaoURL}${endpoint}`
          : `${groupChatURL}${endpoint}`
      }`,
      {
        method: "PUT",
        headers: setHeaders(dest),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to put data to ${endpoint}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.log(`Failed to put data to ${endpoint}:`, error);
  }
};

export const deleteData = async (endpoint: any, data:any, dest: any) => {
  try {
    const response = await fetch(
      `${
        dest !== "groupChat"
          ? dest === "honjaya"
            ? `${baseURL}${endpoint}`
            : `${kakaoURL}${endpoint}`
          : `${groupChatURL}${endpoint}`
      }`,
      {
        method: "DELETE",
        headers: setHeaders(dest),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete data to ${endpoint}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete data to ${endpoint}:`, error);
  }
};



