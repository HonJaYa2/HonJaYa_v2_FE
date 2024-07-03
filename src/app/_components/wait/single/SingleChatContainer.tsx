'use client'

import { useEffect, useState } from "react";
import SingleChatRoom from "./SingleChatRoom";

// Props 타입 객체
interface Props {
    objects: any;
    prevSlide: () => void;
    nextSlide: () => void;
    currentPage: number;
    objectsPerPage: number;
}

const SingleChatContainer = ({ objects, prevSlide, nextSlide, currentPage, objectsPerPage }: Props) => {

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [currentObjects, setCurrentObjects] = useState<any[]>([])
    const [placeholders, setPlaceholders] = useState<string[]>([])

    useEffect(() => {
        if(objects){
            const startIndex = currentPage * objectsPerPage;
            const currentObjects = objects.slice(startIndex, startIndex + objectsPerPage);
            setCurrentObjects(currentObjects);
            const emptySlots = objectsPerPage - currentObjects.length;
            const placeholders = Array(emptySlots).fill("");
            setPlaceholders(placeholders);
        }

    }, [currentPage, objects, objectsPerPage])

    return (
        <div
            className="z-10 w-full h-7/10 flex content-around items-center justify-center relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* {isHovered &&
                <button onClick={prevSlide} disabled={currentPage === 0} className="w-10 h-1/10 py-2 bg-main-color text-white rounded disabled:bg-gray-300 box-border bg-left-arrow bg-center bg-cover">
                </button>
            } */}
            <div className="w-4/10 h-full flex flex-wrap items-center justify-center">
                {currentObjects && currentObjects.reverse().map((object, index) => (
                    <SingleChatRoom object={object} key={index}/>
                ))}
                {placeholders && placeholders.map((_, index) => (
                    <div key={`placeholder-${index}`} className="w-4/5 h-4/5 mx-5 py-4 bg-gray-200 box-border shadow-lg rounded-lg"></div>
                ))}
            </div>
            {/* {isHovered &&
                <button onClick={nextSlide} disabled={(currentPage + 1) * objectsPerPage >= objects.length} className="w-10 h-1/10 py-2 bg-main-color text-white rounded disabled:bg-gray-300 box-border bg-right-arrow bg-center bg-cover">
                </button>
            } */}
        </div>
    )
}

export default SingleChatContainer;
