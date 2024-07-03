'use client'

// import Main from "./(route)/main/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {

  const router = useRouter();

  useEffect(() => {
    router.push('/landing')
  }, [router])
  
  return null;
}

export default Home;