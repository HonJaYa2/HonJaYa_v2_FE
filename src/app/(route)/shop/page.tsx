
'use client';

import ShopNavbar from '@/app/_components/shop/ShopNavbar';
import ZemShop from '@/app/_components/shop/ZemShop';
import { getData } from '@/app/api/api';
import { useEffect } from 'react';


const ShopPage = () => {
  useEffect(() => {
    const getUserData  = async () => {
      const data = await getData(`/users/${localStorage.getItem('user_id')}/profile`, "honjaya")
      console.log(data);
    }
    try {
      if(localStorage.getItem('user_id') && localStorage.getItem('access_token')) {
        getUserData();
      }
    } catch (err) {
      console.log(err);
    }
  })

  return (
    <>
      <ShopNavbar />
      <ZemShop />
    </>
  );
};

export default ShopPage;
