'use client'

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
    index: number;
    imageFirst: boolean;
    imageUrl: string;
    contents: string;
}

const FeatureContainer = ({ index, imageFirst, imageUrl, contents }: Props) => {
    //지연 렌더링(스크롤 내려야지 하단 특징 컨테이너 렌더링)
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
        )

        const contentObserver = new IntersectionObserver(
            ([entry]) => {
                setShowContent(entry.isIntersecting);
            },
            {
                rootMargin: '0px',
                threshold: 0.5,
            }
        )

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
            imageFirst ? (
                <div className='w-full h-8/10 flex justify-around my-4 items-center'>
                    <div ref={imageRef} className=' border-main-color border-4 rounded-lg'>
                        {showImage && (
                            <img src={imageUrl}
                                width={500}
                                height={500}
                                alt={`${index}`} 
                            />
                        )}
                    </div>
                    <div className='w-1/2 h-full' ref={contentRef}>
                        {showContent && (
                            <div className='w-full h-full box-border text-2xl font-jua text-center text-wrap p-4 overflow-hidden animate-fade-in-up'>
                                {contents}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='w-full h-8/10 flex justify-around my-4 items-center'>
                    <div className='w-1/2 h-full' ref={contentRef}>
                        {showContent && (
                            <div className='w-full h-full box-border text-2xl font-jua text-center text-wrap p-4 overflow-hidden animate-fade-in-up'>
                            {contents}
                            </div>
                        )}
                    </div>
                    <div ref={imageRef} className=' border-main-color border-4 rounded-lg'>
                        {showImage && (
                            <img src={imageUrl}
                                width={500}
                                height={500}
                                alt={`${index}`} 
                            />
                        )}
                    </div>
                </div>
            )
    )

}
export default FeatureContainer