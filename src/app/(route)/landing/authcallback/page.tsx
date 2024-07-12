'use client'

import { useEffect, useState } from "react";
import { approve, deny, setProfile } from "@/state/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/reducers/rootReducer";
import Loading from "@/app/_components/common/Loading";
import { useRouter } from "next/navigation";
import { getData, postData } from "@/app/api/api";
import qs from 'qs';

const AuthCallBack = () => {
    const [userId, setUserId] = useState<string>("");
    const [username, setUserName] = useState<string>("");
    const dispatch = useDispatch();
    const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined);
    const router = useRouter();


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const auth_code = urlParams.get('code');
        console.log(accessToken);
        console.log(auth_code);
        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            const verifyUser = async () => {
                try {
                    const userData = await getData("/users/current", "honjaya");
                    setUserId(userData.data.id);
                    setUserName(userData.data.name)
                    // if (userData.data.status === "NEW") {
                    //     console.log("deny")
                    //     dispatch(deny());
                    // } else {
                        console.log("approve");
                        dispatch(approve());
                    // }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    router.push('/');
                }
            };
            verifyUser();
        } else {
            const getToken = async () => {
                console.log("ahahahahahahahahahahahaha")
                try {
                    const response = await fetch("https://kauth.kakao.com/oauth/token", {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: qs.stringify({
                            grant_type: 'authorization_code',
                            client_id: 'f80b172c8fd2c4405878f3227740f910',
                            redirect_uri: 'http://localhost:3000/landing/authcallback',
                            code: auth_code,                       
                        }),
                    });
                    console.log(response);
                } catch(e) {
                    console.log(e)
                }
            }
            getToken();
        }
    }, []);

    useEffect(() => {
        const getGender = async () => {
            try {
                const userData = await getData(`/users/${userId}/profile`, "honjaya");
                localStorage.setItem("userGender", userData.data.gender);
            } catch (error) {
                console.log(error)
            }
        }
            if (isLogined === "Y") {
                localStorage.setItem("user_id", userId);
                localStorage.setItem("username", username);
                getGender();
                dispatch(setProfile());
            } 
            // else if (isLogined === "N"){
            //     router.push('/signup');
            // }
            router.push('/');

    }, [isLogined]);

    return (
        <Loading />
    )
};

export default AuthCallBack;
