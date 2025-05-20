import React, { useEffect, useRef } from "react";
import { ScrolledContainerProps } from "./props";
import { useLocation } from "react-router-dom";

const ScrolledContainer: React.FC<ScrolledContainerProps> = ({ children, className, scrollDir = 'horisontal' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation()
    
    useEffect(() => {
        if (!scrollRef.current || !location.pathname.includes('/advert/')) return;
        scrollRef.current.scrollLeft = 0 ;
        scrollRef.current.scrollTop = 0;
    }, [location])


    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        const isHorisontal = scrollDir === 'horisontal'
        const start = isHorisontal ? e.pageX : e.pageY;
        const scroll = isHorisontal ? scrollRef.current.scrollLeft : scrollRef.current.scrollTop;

        const handleMouseMove = (event: MouseEvent) => {
            if (!scrollRef.current) return;
            
            const walk = isHorisontal ? event.pageX - start : event.pageY - start;
            const scrollStep = scroll - walk;
        
            if (isHorisontal) {
                scrollRef.current.scrollLeft = scrollStep;
            } else {
                scrollRef.current.scrollTop = scrollStep;
            }
        };
        

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        e.preventDefault()
    };
    return (
        <>
            <div ref={scrollRef} onMouseDown={handleMouseDown} className={`overflow-hidden h-full w-full  whitespace-nowrap  active:cursor-grabbing ${className} `}>
                {children}
            </div>
        </>)
}

export default ScrolledContainer;