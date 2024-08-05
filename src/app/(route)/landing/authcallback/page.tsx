'use client'

import { useEffect, useState } from "react";
import { approve, deny, setProfile } from "@/state/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/reducers/rootReducer";
import Loading from "@/app/components/common/Loading";
import { useRouter } from "next/navigation";
import { getData, postData } from "@/app/api/api";
import qs from 'qs';

const AuthCallBack = () => {
    const [userId, setUserId] = useState<string>("");
    const [username, setUserName] = useState<string>("");
    const [isSignedUp, setIsSignedUp] = useState<boolean>(false)
    const dispatch = useDispatch();
    const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined);
    const router = useRouter();


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const auth_code = urlParams.get('code');
        const accessToken = localStorage.getItem('accesstoken');
        console.log(accessToken);
        console.log(auth_code);
        if (accessToken) {
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
                }
            };
            verifyUser();
            router.push('/');
        } else {
            const getUserInfoWithToken = async () => {
                try {
                    const response = await fetch("http://localhost:8080/token", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ auth_code: auth_code}),
                    });
                    const jsonResponse = await response.json();
                    localStorage.setItem('access_token', jsonResponse.access_token);
                    localStorage.setItem('userId', jsonResponse.userInfo.userId);
                    // console.log(jsonResponse.access_token);
                    // console.log(jsonResponse.userInfo);
                    if(jsonResponse.userInfo.birthday) {
                        dispatch(setProfile())
                    }
                    dispatch(approve())
                    router.push('/landing')
                } catch(e) {
                    console.log(e)
                }
            }
            getUserInfoWithToken();
        }
    }, []);

    return (
        <Loading />
    )
};

export default AuthCallBack;
