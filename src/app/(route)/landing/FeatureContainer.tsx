'use client'

import { useEffect, useRef, useState, ReactNode } from 'react';

type Props = {
    index: number;
    imageFirst: boolean;
    imageUrl: string;
    contents: ReactNode; // string에서 ReactNode로 변경
}

const FeatureContainer = ({ index, imageFirst, imageUrl, contents }: Props) => {
    // 지연 렌더링(스크롤 내려야지 하단 특징 컨테이너 렌더링)
    const [showImage, setShowImage] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);

    const imageRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        console.log("imageurl: " + imageUrl);
        const imageObserver = new IntersectionObserver(
            ([entry]) => {
                setShowImage(entry.isIntersecting);
            },
            {
                rootMargin: '0px',
            }
        );

        const contentObserver = new IntersectionObserver(
            ([entry]) => {
                setShowContent(entry.isIntersecting);
            },
            {
                rootMargin: '0px',
                threshold: 0.5,
            }
        );

        if (imageRef.current) {
            imageObserver.observe(imageRef.current);
        }

        if (contentRef.current) {
            contentObserver.observe(contentRef.current);
        }

        return () => {
            if (imageRef.current) {
                imageObserver.unobserve(imageRef.current);
            }
            if (contentRef.current) {
                contentObserver.unobserve(contentRef.current);
            }
        };
    }, [imageRef, contentRef]);

    return (
        <div className='w-full h-6/10 flex justify-between my-20 items-center px-10 mb-40'>
            <div className={`ml-40 ${imageFirst ? '' : 'order-last ml-0 mr-40'}`} ref={imageRef}>
                {showImage && (
                    <img className='rounded-lg' src={imageUrl}
                        width={400}
                        height={550}
                        alt={`${index}`} 
                    />
                )}
            </div>
            <div className='w-1/2 h-full ml-40' ref={contentRef}>
                {showContent && (
                    <div className='text-left p-4 overflow-hidden animate-fade-in-up'>
                        {contents}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeatureContainer;
