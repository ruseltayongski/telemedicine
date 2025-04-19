import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AgoraVideoCall from '@/Components/AgoraVideoCall';
import React, { useEffect, useRef, useState } from "react";

export default function VideoCall({ appId, channelName, token, uid, patient_id, doctor_id, recipient, booking_id, caller_name, exist_prescription }) {
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    useEffect(() => {
        document.querySelectorAll("[data-dynamic='true']").forEach((el) => el.remove());
        // Check if scripts are already loaded to prevent duplicate loading
        if (document.querySelector("[data-dynamic_guest='true']")) {
            setScriptsLoaded(true);
            return;
        }

        const assetsToLoad = [
            { type: "css", href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" },
            { type: "css", href: "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" },
            { type: "css", href: "assets/css/bootstrap.min.css" },
            { type: "css", href: "assets/css/LineIcons.2.0.css" },
            { type: "css", href: "assets/css/animate.css" },
            { type: "css", href: "assets/css/tiny-slider.css" },
            { type: "css", href: "assets/css/glightbox.min.css" },
            { type: "css", href: "assets/css/main1.css" },
            { type: "css", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" },
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
                link.dataset.dynamic_guest = "true";
                document.head.appendChild(link);
            }
        });

        Promise.all(
            jsToLoad.map(({ src }) => {
                return new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = src;
                    script.async = true;
                    script.dataset.dynamic_guest = "true";
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            })
        ).then(() => {
            setScriptsLoaded(true);
        });
    
        // return () => {
        //     document.querySelectorAll("[data-dynamic_guest='true']").forEach((el) => el.remove());
        // };
    }, []);
    return (
        <>
        <Head title="Video Call" />
            <div className="py-4">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            {/* <h1 className="fs-2 fw-bold mb-4">Video Call</h1> */}
                            <AgoraVideoCall 
                                appId={appId}
                                channelName={channelName}
                                token={token}
                                uid={uid}
                                patient_id={patient_id}
                                doctor_id={doctor_id}
                                recipient={recipient}
                                booking_id={booking_id}
                                caller_name={caller_name}
                                exist_prescription={exist_prescription}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}