import { Link, usePage, router } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from "react";

export default function GuestLayout({ children }) {
    const { url } = usePage();
    const isLoginPage = (routeName) => url.startsWith(route(routeName, {}, false));
    // const isActive = (routeName) => url === route(routeName, {}, false);
    const isActive = (routeName) => {
        const currentPath = new URL(window.location.href).pathname; // Get the path without query parameters
        return currentPath === route(routeName, {}, false);
    };

    const user = usePage().props.auth.user;
    const [scriptsLoaded, setScriptsLoaded] = useState(false);

    useEffect(() => {
            // Sticky Navbar and Back to Top
        const handleScroll = () => {
            const headerNavbar = document.querySelector(".navbar-area");
            const backToTop = document.querySelector(".scroll-top");
            
            if (headerNavbar) {
                if (window.pageYOffset > headerNavbar.offsetTop) {
                    headerNavbar.classList.add("sticky");
                } else {
                    headerNavbar.classList.remove("sticky");
                }
            }
            
            if (backToTop) {
                if (window.scrollY > 50) {
                    backToTop.style.display = "flex";
                } else {
                    backToTop.style.display = "none";
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        // setTimeout(() => {
        //     // Initialize WOW.js
        //     new WOW().init();
        // }, 100);
        if (typeof window.WOW !== "undefined") {
            new window.WOW().init();
        }
        
        // Portfolio Filtering
        const filterButtons = document.querySelectorAll(".portfolio-btn-wrapper button");
        filterButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                let filterValue = event.target.getAttribute("data-filter");
                if (window.iso) {
                    window.iso.arrange({ filter: filterValue });
                }
            });
        });

        // Portfolio Button Active State
        const elements = document.getElementsByClassName("portfolio-btn");
        for (let i = 0; i < elements.length; i++) {
            elements[i].onclick = function () {
                [...elements].forEach(el => el.classList.remove("active"));
                this.classList.add("active");
            };
        }

        // Smooth Scrolling for Menu
        const pageLinks = document.querySelectorAll(".page-scroll");
        pageLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                document.querySelector(link.getAttribute("href")).scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        });

        // Mobile Menu Toggle
        const navbarToggler = document.querySelector(".mobile-menu-btn");
        if (navbarToggler) {
            navbarToggler.addEventListener("click", () => {
                navbarToggler.classList.toggle("active");
            });
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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

    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 500);
        
    //     return () => clearTimeout(timer);
    // }, []);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // const bookAppointment = () => {
    //     router.get(route('calendar'));
    // };
    
    return <>{
        scriptsLoaded 
        ? 
        <>
            {/* <div 
                className="preloader" 
                style={{ 
                    opacity: isLoading ? 1 : 0,
                    display: isLoading ? 'block' : 'none',
                    transition: 'opacity 0.5s ease'
                }}
            >
                <div className="preloader-inner">
                    <div className="preloader-icon">
                    <span></span>
                    <span></span>
                    </div>
                </div>
            </div> */}
            {!isLoginPage('login') && !isLoginPage('register') && !isLoginPage('verification.notice') && (
                <header className="header navbar-area">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <div className="nav-inner">
                                    <nav className="navbar navbar-expand-lg">
                                        <a className="navbar-brand cursor-pointer" href={route('home')} style={{ color: "#006838", fontWeight: "600" }}>
                                            <img src="assets/images/online.png" alt="Logo" style={{ width: "40px" }} />
                                            Telemedicine
                                        </a>
                                        <button
                                        className="navbar-toggler mobile-menu-btn"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#navbarSupportedContent"
                                        aria-controls="navbarSupportedContent"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                        >
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                        </button>
                                        <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                            <ul id="nav" className="navbar-nav ms-auto">
                                                <li className="nav-item">
                                                    <Link href={route('home')} className={`sidebar-item ${isActive('home') ? 'active' : ''}`} aria-label="Toggle navigation">Home</Link>
                                                </li>
                                                {user && (
                                                    <li className="nav-item">
                                                        <Link href={route('booked.appointments.index')} className={`sidebar-item ${isActive('booked.appointments.index') ? 'active' : ''}`} aria-label="Toggle navigation">Activity</Link>
                                                    </li>
                                                )}
                                                {/* <li className="nav-item">
                                                    <Link 
                                                        href={route('home')} 
                                                        className={`sidebar-item ${isActive('home') ? 'active' : ''}`} 
                                                        aria-label="Toggle navigation"
                                                        preserveScroll 
                                                        preserveState
                                                    >
                                                        Home
                                                    </Link>
                                                </li>
                                                {user && (
                                                    <li className="nav-item">
                                                        <Link 
                                                            href={route('booked.appointments.index')} 
                                                            className={`sidebar-item ${isActive('booked.appointments.index') ? 'active' : ''}`} 
                                                            aria-label="Toggle navigation"
                                                            preserveScroll 
                                                            preserveState
                                                        >
                                                            Booked Appointments
                                                        </Link>
                                                    </li>
                                                )} */}
                                                {user ? (
                                                    <li className="nav-item d-block d-md-none">
                                                        <a href="#" aria-label="Toggle navigation" onClick={(e) => {
                                                                e.preventDefault();
                                                                handleLogout();
                                                            }}>
                                                            Logout
                                                        </a>
                                                    </li>
                                                ) : (
                                                    <li className="nav-item">
                                                        <Link href={route('login')} aria-label="Toggle navigation">Login</Link>
                                                    </li>
                                                )}
                                                {/* <li className="nav-item">
                                                    <Link href={route('login')} aria-label="Toggle navigation">Login</Link>
                                                </li> */}
                                                {/* <li className="nav-item">
                                                    <Link href={route('register')} aria-label="Toggle navigation">Register</Link>
                                                </li> */}
                                            </ul>
                                        </div>
                                        {/* <div className="button add-list-button">
                                            <a href="#" className="btn cursor-pointer" onClick={bookAppointment}>Book Appointment</a>
                                        </div> */}
                                        {user && (
                                            <>
                                                <a 
                                                    className="nav-link dropdown-toggle d-flex align-items-center gap-2 d-none d-sm-flex" 
                                                    href="#" 
                                                    id="userDropdown" 
                                                    role="button" 
                                                    data-bs-toggle="dropdown" 
                                                    aria-expanded="false"
                                                    style={{ 
                                                        background: "#f0f7ff", 
                                                        borderRadius: "30px", 
                                                        padding: "6px 15px", 
                                                        transition: "all 0.3s ease",
                                                        border: "1px solid #e0e7ff"
                                                    }}
                                                >
                                                    <div 
                                                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                                        style={{ 
                                                            width: "32px", 
                                                            height: "32px", 
                                                            backgroundColor: "#006838", 
                                                            color: "white",
                                                            fontWeight: "600",
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                    </div>
                                                    <span style={{ 
                                                            fontWeight: "500", 
                                                            color: "#333", 
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        {user.name || "User"}
                                                    </span>
                                                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: "12px", color: "#666" }}></i>
                                                </a>
                                                <ul 
                                                    className="dropdown-menu" 
                                                    aria-labelledby="userDropdown"
                                                    style={{
                                                        borderRadius: "12px",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                        border: "1px solid #eaeaea",
                                                        padding: "8px 0",
                                                        minWidth: "200px",
                                                        marginTop: "10px",
                                                        right: 0,
                                                        left: "auto"
                                                    }}
                                                >
                                                    {/* <li>
                                                        <a 
                                                            className="dropdown-item d-flex align-items-center gap-2" 
                                                            href={route('profile.edit')}
                                                            style={{
                                                                padding: "10px 16px",
                                                                fontSize: "14px",
                                                                color: "#333",
                                                                transition: "background-color 0.2s"
                                                            }}
                                                        >
                                                            <i className="fas fa-user" style={{ color: "#666", width: "16px" }}></i>
                                                            Profile
                                                        </a>
                                                    </li> */}
                                                    <li>
                                                        <Link 
                                                            className="dropdown-item d-flex align-items-center gap-2" 
                                                            href={route('booked.appointments.index')}
                                                            style={{
                                                                padding: "10px 16px",
                                                                fontSize: "14px",
                                                                color: "#333",
                                                                transition: "background-color 0.2s"
                                                            }}
                                                        >
                                                            <i className="fas fa-calendar-check" style={{ color: "#666", width: "16px" }}></i>
                                                            Activity
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <hr className="dropdown-divider" style={{ margin: "8px 0", opacity: "0.1" }} />
                                                    </li>
                                                    <li>
                                                        <a 
                                                            className="dropdown-item d-flex align-items-center gap-2" 
                                                            href="#" 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleLogout();
                                                            }}
                                                            style={{
                                                                padding: "10px 16px",
                                                                fontSize: "14px",
                                                                color: "#dc3545",
                                                                transition: "background-color 0.2s"
                                                            }}
                                                        >
                                                            <i className="fas fa-sign-out-alt" style={{ color: "#dc3545", width: "16px" }}></i>
                                                            Logout
                                                        </a>
                                                    </li>
                                                </ul>
                                            </>
                                        )}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}
            {children}

            <footer className="footer overlay">    
                <div className="footer-bottom">
                    <div className="container">
                        <div className="inner">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12">
                            <div className="content">
                                <p className="copyright-text">Designed and Developed by <a href="https://graygrids.com/" rel="nofollow" target="_blank">Rusel Tayong</a></p>
                            </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                            <ul className="extra-link">
                                <li><a href="#">Terms & Conditions</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </footer>

            <a href="#" className="scroll-top">
                <i className="lni lni-chevron-up"></i>
            </a>
        </>
        : 
        <div 
            className="preloader" 
            style={{ 
                opacity: scriptsLoaded ? 1 : 0,
                display: scriptsLoaded ? 'block' : 'none',
                transition: 'opacity 0.5s ease'
            }}
        >
            <div className="preloader-inner">
                <div className="preloader-icon">
                <span></span>
                <span></span>
                </div>
            </div>
        </div>
    }</>;
}