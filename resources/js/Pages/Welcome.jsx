import { Head, Link, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect, useRef, useState } from "react";

export default function Welcome({ canLogin, canRegister, auth, laravelVersion, phpVersion }) {
    console.log(canLogin);
    console.log(canRegister);
    console.log(auth);
    console.log(laravelVersion);
    console.log(phpVersion);
    const sliderRef = useRef(null);
    const [loadingFacilities, setLoadingFacilities] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
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
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //     setCounts((prevCounts) =>
    //         prevCounts.map((count, index) =>
    //         count < counters[index] ? count + Math.ceil(counters[index] / 50) : counters[index]
    //         )
    //     );
    //     }, 50);

    //     return () => clearInterval(interval);
    // }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const bookAppointment = () => {
        router.get(route('calendar'));
    };


    const { specializations, facilities, doctors } = usePage().props;

    const [selectedType, setSelectedType] = useState('');
    const [filteredFacilities, setFilteredFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    useEffect(() => {
        setFilteredFacilities(facilities.filter(facility => facility.type === selectedType));
        setSelectedFacility('');
    }, [selectedType]);

    useEffect(() => {
        setFilteredDoctors(doctors.filter(doctor => doctor.facility_id === selectedFacility));
    }, [selectedFacility]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");
    };
    
    return (
        <GuestLayout>
            <Head title="Welcome" />
            <section className="hero-area">
                <div className="shapes">
                    <img src="assets/images/hero/05.svg" className="shape1" alt="#" />
                    <img src="assets/images/hero/01.svg" className="shape2" alt="#" />
                </div>
                <div className="hero-slider" ref={sliderRef}>
                    {[
                        {
                            title: "Find A Doctor & Book Appointment",
                            text: "Telemedicine tackles key healthcare challenges by providing virtual access to medical care, reducing wait times, and offering cost-effective alternatives.",
                            img: "assets/images/hero/02.png"
                        }
                        , 
                        {
                            title: "No need to go to the hospital to conduct a consultation",
                            text: "It connects patients with specialists",
                            img: "assets/images/hero/slider-2.png"
                        }
                        , 
                        {
                            title: "Superior solutions that help you to shine.",
                            text: "Offers user-friendly platforms, making healthcare more accessible and efficient.",
                            img: "assets/images/hero/slider-3.png"
                        }
                    ].map((slide, index) => (
                        <div className="single-slider" key={index} style={{ 
                            height: "50vh",
                        }}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12 col-12">
                                        <div className="hero-text wow fadeInLeft" data-wow-delay=".3s">
                                            <div className="section-heading" style={{ marginTop: '-100px' }}>
                                                <h2>{slide.title}</h2>
                                                <p>{slide.text}</p>
                                                {/* <div className="button">
                                                    <a href="#" onClick={bookAppointment} className="btn">Book Appointment</a>
                                                    <a href="about-us.html" className="btn">About Us</a>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-12">
                                        <div className="hero-image" style={{ 
                                            top: "1px",
                                            transform: "scale(0.5)",
                                        }}>
                                            <img src={slide.img} alt="#"
                                            />
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
                                <p>Select your preferred specialization, hospital, and doctor to book an appointment.</p>
                            </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* <div className="col-lg-3 col-md-6 col-12 p-0">
                                    <div className="appointment-input">
                                    <label htmlFor="name"><i className="lni lni-user"></i></label>
                                    <input type="text" name="name" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                </div> */}
                                {/* <div className="col-lg-3 col-md-6 col-12 p-0">
                                    <div className="appointment-input">
                                    <label htmlFor="email"><i className="lni lni-envelope"></i></label>
                                    <input type="email" name="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div> */}
                                <div className="col-lg col-md-6 col-12 p-0">
                                    <div className="appointment-input">
                                        <label htmlFor="specialization"><i className="lni lni-notepad"></i></label>
                                        <select name="specialization" id="specialization" required>
                                            <option value="">Select Specialization</option>
                                            {specializations.map(spec => (
                                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg col-md-6 col-12 p-0">
                                    <div className="appointment-input">
                                        <label htmlFor="hospital_type"><i className="lni lni-hospital"></i></label>
                                        <select 
                                            name="hospital_type" 
                                            id="hospital_type" 
                                            required 
                                            onChange={(e) => setSelectedType(e.target.value)}
                                        >
                                            <option value="">Select Hospital Type</option>
                                            <option value="government">Government</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg col-md-6 col-12 p-0">
                                    <div className="appointment-input">
                                        <label htmlFor="hospital"><i className="lni lni-hospital"></i></label>
                                        <select 
                                            name="hospital" 
                                            id="hospital" 
                                            required 
                                            onChange={(e) => setSelectedFacility(Number(e.target.value))}
                                        >
                                            <option value="">Select Hospital Name</option>
                                            {filteredFacilities.map(facility => (
                                                <option key={facility.id} value={facility.id}>{facility.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg col-md-6 col-12 p-0">
                                    <div className="appointment-input">
                                        <label htmlFor="doctor"><i className="lni lni-user"></i></label>
                                        <select name="doctor" id="doctor" required>
                                            <option value="">Select Doctor</option>
                                            {filteredDoctors.map(doctor => (
                                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg col-md-6 col-12 custom-padding">
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
        </GuestLayout>
    );
}
