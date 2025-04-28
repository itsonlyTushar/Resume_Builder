import { Fab } from '@mui/material';
import React, { useState, useEffect } from 'react';


function FabScroll() {
    const [scroll, setScroll] = useState(false);

    const scrollVisible = () => {

        
        if (window.scrollY > 200) {
            setScroll(true);
        } else {
            setScroll(false);
        }
    };

    useEffect(() => {




        window.addEventListener('scroll', scrollVisible);
        return () => {
            window.removeEventListener('scroll', scrollVisible);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({top:0, behavior:"smooth"});
    };

    return (
        <>
        {scroll &&
            <Fab
            color="black"
            onClick={scrollToTop}
            style={{
                position:"fixed",
                bottom:"20px",
                right:"20px",
                zIndex:1000,
                transition: "all",
                
            }}
            >
                <i className="ri-arrow-up-circle-line text-5xl"></i>
            </Fab>
        }
        </>
    )
}

export default FabScroll;