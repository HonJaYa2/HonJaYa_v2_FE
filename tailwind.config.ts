import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: { 
       '1/10': '10%',
       '2/10': '20%',
       '3/10': '30%',
       '4/10': '40%',
       '5/10': '50%',
       '6/10': '60%',
       '7/10': '70%',
       '8/10': '80%',
       '9/10': '90%',
      },
      height: { 
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
       },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "couple-image-1": "url(/couple1.png)",
        "couple-image-2": "url(/couple2.png)",
        "kakao-logo": "url('https://statics.goorm.io/images/social/logo/kakaoLogo.svg')",
        "right-arrow": "url(/right-arrow.png)",
        "left-arrow": "url(/left-arrow.png)",
        "filter": "url(/filter.png)",
        "balloons": "url(/balloonBackground.png)",
      },
      colors: {
        "main-color": "#EE9D95",
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down-left': {
          '0%': { opacity: '0', transform: 'translateY(-10px) translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateX(0)' },
        },       
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out-up': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
      },
      animation: {
        slide: 'slide 10s linear infinite',
        'fade-in-down': 'fade-in-down 0.3s ease-out',
        'fade-in-down-left': 'fade-in-down-left 0.3s ease-out',
        'fade-in-up': 'fade-in-up 1s ease-out',
        'fade-out-up': 'fade-out-up 1s ease-out',
      },
      fontFamily: {
        jua: ['Jua', 'sans-serif'],
      }, 


      

    },
  },
  plugins: [],
};

export default config;
