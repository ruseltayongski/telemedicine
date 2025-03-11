import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from "react";

export default function GuestLayout({ children }) {
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    useEffect(() => {
        document.querySelectorAll("[data-dynamic='true']").forEach((el) => el.remove());
        const assetsToLoad = [
            { type: "css", href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" },
            { type: "css", href: "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" },
            { type: "css", href: "assets/css/bootstrap.min.css" },
            { type: "css", href: "assets/css/LineIcons.2.0.css" },
            { type: "css", href: "assets/css/animate.css" },
            { type: "css", href: "assets/css/tiny-slider.css" },
            { type: "css", href: "assets/css/glightbox.min.css" },
            { type: "css", href: "assets/css/main.css" },
        ]

        const jsToLoad = [
            { type: "js", src: "assets/js/bootstrap.min.js" },
            { type: "js", src: "assets/js/wow.min.js" },
            { type: "js", src: "assets/js/tiny-slider.js" },
            { type: "js", src: "assets/js/glightbox.min.js" },
            { type: "js", src: "assets/js/count-up.min.js" },
            { type: "js", src: "assets/js/imagesloaded.min.js" },
            { type: "js", src: "assets/js/isotope.min.js" },
        ]

        assetsToLoad.forEach(({ type, href, src }) => {
            if (type === "css") {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = href;
                link.dataset.dynamic = "true";
                document.head.appendChild(link);
            }
        });

        // jsToLoad.forEach(({ type, href, src }) => {
        //     if (type === "js") {
        //         const script = document.createElement("script");
        //         script.src = src;
        //         script.async = true;
        //         script.dataset.dynamic = "true";
        //         document.body.appendChild(script);
        //     }
        // });

        Promise.all(
            jsToLoad.map(({ src }) => {
                return new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = src;
                    script.async = true;
                    script.dataset.dynamic = "true";
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            })
        ).then(() => {
            setScriptsLoaded(true); // Mark scripts as loaded
        });
    
        return () => {
            // Remove previously loaded assets to prevent conflictsasd
            document.querySelectorAll("[data-dynamic='true']").forEach((el) => el.remove());
        };
    }, []);

    // return (
    //     <>   
    //         {children}
    //     </>
    // );
    return <>{scriptsLoaded ? children : null}</>;
}