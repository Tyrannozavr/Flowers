import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 480;
const TABLET_BREAKPOINT = 780;

const useViewport = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= MOBILE_BREAKPOINT);
            setIsTablet(width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT);
            setIsDesktop(width > TABLET_BREAKPOINT);
            console.log('Window width:', width, 'isMobile:', width <= MOBILE_BREAKPOINT, 'isTablet:', width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT, 'isDesktop:', width > TABLET_BREAKPOINT);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { isMobile, isTablet, isDesktop };
};

export default useViewport;