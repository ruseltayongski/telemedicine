import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect, useRef, useState } from "react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    console.log('loaded');
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

    const sliderRef = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            if (sliderRef.current) {
                tns({
                    container: sliderRef.current,
                    slideBy: "page",
                    autoplay: true,
                    autoplayButtonOutput: false,
                    mouseDrag: true,
                    gutter: 0,
                    items: 1,
                    nav: false,
                    controls: true,
                    controlsText: [
                    '<i class="lni lni-chevron-left"></i>',
                    '<i class="lni lni-chevron-right"></i>'
                    ],
                    responsive: {
                        1200: { items: 1 },
                        992: { items: 1 },
                        0: { items: 1 }
                    }
                });
            }
        }, 100);
        console.log('slider initialized')
    }, []);

    // useEffect(() => {
    //     if (window.GLightbox) {
    //         const lightbox = window.GLightbox({
    //             selector: ".glightbox",
    //             touchNavigation: true,
    //             loop: true,
    //             autoplayVideos: true,
    //         });
        
    //         return () => lightbox.destroy();
    //     }
    // }, []);

    useEffect(() => {
        // Wait until GLightbox is available and elements exist
        const initGLightbox = () => {
            if (typeof window.GLightbox !== "undefined" && document.querySelector(".glightbox")) {
                const lightbox = window.GLightbox({
                    selector: ".glightbox",
                    touchNavigation: true,
                    loop: true,
                    autoplayVideos: true,
                });
    
                return () => lightbox.destroy();
            }
        };
    
        // Check if script is already loaded
        if (window.GLightbox) {
            initGLightbox();
        } else {
            // Wait for script to load before initializing
            const checkScriptLoaded = setInterval(() => {
                if (window.GLightbox) {
                    clearInterval(checkScriptLoaded);
                    initGLightbox();
                }
            }, 100);
        }
    }, []);
    
    const counters = [1250, 350, 2500, 35];
    const [counts, setCounts] = useState([0, 0, 0, 0]);
    useEffect(() => {
        const interval = setInterval(() => {
        setCounts((prevCounts) =>
            prevCounts.map((count, index) =>
            count < counters[index] ? count + Math.ceil(counters[index] / 50) : counters[index]
            )
        );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Appointment Data:", formData);
    };

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <GuestLayout status={status}>
            <Head title="Welcome" />

            <div 
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
            </div>

            <header className="header navbar-area">
                <div className="container">
                    <div className="row align-items-center">
                    <div className="col-lg-12">
                        <div className="nav-inner">
                        <nav className="navbar navbar-expand-lg">
                            <a className="navbar-brand cursor-pointer" href={route('home')}>
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
                                    <Link href={route('home')} className="active" aria-label="Toggle navigation">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={route('login')} aria-label="Toggle navigation">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={route('register')} aria-label="Toggle navigation">Register</Link>
                                </li>
                            </ul>
                            </div>
                            <div className="button add-list-button">
                            <a href="#" className="btn">Book Appointment</a>
                            </div>
                        </nav>
                        </div>
                    </div>
                    </div>
                </div>
            </header>

            <section className="hero-area">
                <div className="shapes">
                    <img src="assets/images/hero/05.svg" className="shape1" alt="#" />
                    <img src="assets/images/hero/01.svg" className="shape2" alt="#" />
                </div>
                <div className="hero-slider" ref={sliderRef}>
                    {[{
                        title: "Find A Doctor & Book Appointment",
                        text: "Telemedicine tackles key healthcare challenges by providing virtual access to medical care, reducing wait times, and offering cost-effective alternatives.",
                        img: "assets/images/hero/02.png"
                    }, {
                        title: "No need to go to the hospital to conduct a consultation",
                        text: "It connects patients with specialists",
                        img: "assets/images/hero/slider-2.png"
                    }, {
                        title: "Superior solutions that help you to shine.",
                        text: "Offers user-friendly platforms, making healthcare more accessible and efficient.",
                        img: "assets/images/hero/slider-3.png"
                    }].map((slide, index) => (
                        <div className="single-slider" key={index}>
                            <div className="container">
                            <div className="row">
                                <div className="col-lg-6 col-md-12 col-12">
                                <div className="hero-text wow fadeInLeft" data-wow-delay=".3s">
                                    <div className="section-heading">
                                    <h2>{slide.title}</h2>
                                    <p>{slide.text}</p>
                                    <div className="button">
                                        <a href="appointment.html" className="btn">Book Appointment</a>
                                        <a href="about-us.html" className="btn">About Us</a>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-12">
                                <div className="hero-image">
                                    <img src={slide.img} alt="#" />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="appointment">
                <div className="container">
                    <div className="appointment-form">
                    <div className="row">
                        <div className="col-lg-6 col-12">
                        <div className="appointment-title">
                            <span>Appointment</span>
                            <h2>Book An Appointment</h2>
                            <p>Please feel welcome to contact our friendly reception staff with any general or medical enquiry. Our doctors will receive or return any urgent calls.</p>
                        </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                        <div className="col-lg-3 col-md-6 col-12 p-0">
                            <div className="appointment-input">
                            <label htmlFor="name"><i className="lni lni-user"></i></label>
                            <input type="text" name="name" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 p-0">
                            <div className="appointment-input">
                            <label htmlFor="email"><i className="lni lni-envelope"></i></label>
                            <input type="email" name="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 p-0">
                            <div className="appointment-input">
                            <label htmlFor="department"><i className="lni lni-notepad"></i></label>
                            <select name="department" id="department" value={formData.department} onChange={handleChange} required>
                                <option value="" disabled>Select Department</option>
                                <option value="General Surgery">General Surgery</option>
                                <option value="Gastroenterology">Gastroenterology</option>
                                <option value="Nutrition & Dietetics">Nutrition & Dietetics</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Pediatric">Pediatric</option>
                            </select>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 custom-padding">
                            <div className="appointment-btn button">
                            <button className="btn" type="submit">Get Appointment</button>
                            </div>
                        </div>
                        </div>
                    </form>
                    </div>
                </div>
            </section>

            <section className="about-us section">
                <div className="container">
                    <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12 col-12">
                        <div className="content-left">
                        <img src="assets/images/about/about.png" alt="#" />
                        <a 
                            href="https://www.youtube.com/watch?v=r44RKWyfcFw&fbclid=IwAR21beSJORalzmzokxDRcGfkZA1AtRTE__l5N4r09HcGS5Y6vOluyouM9EM" 
                            className="glightbox video"
                        >
                            <i className="lni lni-play"></i>
                        </a>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-12">
                        <div className="content-right">
                        <span className="sub-heading">About</span>
                        <h2>Thousands of specialties for any type of diagnostic care.</h2>
                        <p>
                            We provide a wide range of diagnostic services designed to meet the diverse needs of our patients. From routine health checkups to specialized exams, our team is committed to delivering the best possible care. With advanced technology and expert practitioners, we ensure accurate and timely diagnoses for all our patients.
                        </p>
                        <div className="row">
                            <div className="col-lg-6 col-12">
                            <ul className="list">
                                <li><i className="lni lni-checkbox"></i> Conducts virtual health consultations</li>
                                <li><i className="lni lni-checkbox"></i> Offers remote diagnostic services</li>
                                <li><i className="lni lni-checkbox"></i> Manages minor illnesses via telemedicine</li>
                            </ul>
                            </div>
                            <div className="col-lg-6 col-12">
                            <ul className="list">
                                <li><i className="lni lni-checkbox"></i> Provides specialist video consultations</li>
                                <li><i className="lni lni-checkbox"></i> Prescribes and monitors treatments online</li>
                                <li><i className="lni lni-checkbox"></i> Delivers remote follow-up care</li>
                            </ul>
                            </div>
                        </div>
                        <div className="button">
                            <a href="about-us.html" className="btn">More About Us</a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            <section className="our-achievement section">
                <div className="container">
                    <div className="row">
                        {counters.map((counter, index) => (
                        <div key={index} className="col-lg-3 col-md-3 col-12">
                            <div className="single-achievement">
                            <i className={
                                ["lni lni-apartment", "lni lni-sthethoscope", "lni lni-emoji-smile", "lni lni-certificate"][index]
                            }></i>
                            <h3 className="counter">{counts[index]}</h3>
                            <p>{["Hospital Rooms", "Specialist Doctors", "Happy Patients", "Years of Experience"][index]}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </section>

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
        </GuestLayout>
    );
}
