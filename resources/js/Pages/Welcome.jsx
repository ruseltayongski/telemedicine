import { Head, Link, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React, { useEffect, useRef, useState } from "react";
import { set } from 'firebase/database';

export default function Welcome({ canLogin, canRegister, auth, laravelVersion, phpVersion }) {
    const sliderRef = useRef(null);
    const [loadingFacilities, setLoadingFacilities] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [showHero, setShowHero] = useState(false);
    useEffect(() => {
        // Make sure we only run this once
        let sliderInstance = null;
        
        // Try to initialize the slider if ref is available
        const initializeSlider = () => {
            if (sliderRef.current && !sliderInstance) {
                try {
                    sliderInstance = tns({
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
                    setShowHero(true);
                    console.log("Slider initialized successfully");
                } catch (error) {
                    console.error("Failed to initialize slider:", error);
                }
            }
        };
      
        // Try immediately
        initializeSlider();
        
        // Then try again with a longer delay for production environments
        const timer = setTimeout(initializeSlider, 500);
        
        // If that doesn't work, try with MutationObserver to watch for DOM changes
        const observer = new MutationObserver((mutations, obs) => {
          if (sliderRef.current && !sliderInstance) {
            initializeSlider();
            if (sliderInstance) {
              obs.disconnect(); // Stop observing once initialized
            }
          }
        });
        
        // Start observing with a delay to ensure DOM is ready to be watched
        setTimeout(() => {
          if (document.body && !sliderInstance) {
            observer.observe(document.body, { 
              childList: true, 
              subtree: true 
            });
          }
        }, 100);
        
        // Clean up
        return () => {
          clearTimeout(timer);
          observer.disconnect();
          if (sliderInstance && typeof sliderInstance.destroy === 'function') {
            sliderInstance.destroy();
          }
        };
    }, []);

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

    const { specializations, facilities, doctors, selected, patients } = usePage().props;
    
    const counters = [1250, 350, 2500, 35];
    const [counts, setCounts] = useState([facilities.length, specializations.length, patients.length, 7]);

    const [selectedSpecialization, setSelectedSpecialization] = useState(selected?.specialization ?? '');
    const [selectedType, setSelectedType] = useState(selected?.hospital_type ?? '');
    const [selectedFacility, setSelectedFacility] = useState(selected?.hospital ?? '');
    const [selectedDoctor, setSelectedDoctor] = useState(selected?.doctor ?? '');

    const [filteredFacilities, setFilteredFacilities] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    useEffect(() => {
        const filtered = facilities.filter(facility => {
            const hasDoctorForSpecialization = doctors.some(doctor => doctor.facility_id === facility.id && doctor.specialization_id === Number(selectedSpecialization));

            return facility.type === selectedType && hasDoctorForSpecialization;
        });
        setFilteredFacilities(filtered);

        if (!filtered.find(f => f.id === selectedFacility)) {
            setSelectedFacility('');
        }
    }, [selectedType, selectedSpecialization, facilities, doctors]);

    useEffect(() => {
        const filtered = doctors.filter(doctor => {
            return (
                (!selectedFacility || doctor.facility_id === Number(selectedFacility)) &&
                (!selectedSpecialization || doctor.specialization_id === Number(selectedSpecialization))
            );
        });
        setFilteredDoctors(filtered);

        if (!filtered.find(d => d.id === selectedDoctor)) {
            setSelectedDoctor('');
        }
    }, [selectedFacility, selectedSpecialization, doctors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(auth.user) {
            router.get(route('calendar'), {
                facility: selectedFacility,
                doctor: selectedDoctor,
            });            
        }
        else {
            router.get(route('login'));
        }    
    };

    const selectSpecialization = (doctor_id, facility_id) => {
        if(auth.user) {
            router.get(route('calendar'), {
                facility: facility_id,
                doctor: doctor_id,
            });            
        }
        else {
            router.get(route('login'));
        }    
    };

    const [symptoms, setSymptoms] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
//     const [results, setResults] = useState({
//         "recommended_specializations": [
// {
// "name": "Neurologist",
// "id": 3,
// "reason": "Headaches and dizziness could be related to neurological issues."
// },
// {
// "name": "General Surgeon",
// "id": 8,
// "reason": "In case of severe headaches, it could be due to a serious condition that may require surgical intervention."
// },
// {
// "name": "Endocrinologist",
// "id": 9,
// "reason": "Hormonal imbalances can sometimes cause headaches and dizziness."
// }
// ],
// "confidence_score": 0.7,
// "additional_advice": "It's important to seek immediate medical attention if your symptoms persist or worsen. Stay hydrated and avoid straining your eyes or engaging in strenuous activities until you've seen a doctor.",
// "doctors": [
// {
// "id": 14,
// "name": "Billy Greenholt",
// "email": "doctor9_government_1@gmail.com",
// "address": "4864 Opal Parkways Apt. 091\nNew Evansside, NM 87356",
// "contact": "+1-425-986-5434",
// "sex": "male",
// "dob": "1991-10-27",
// "license_no": "DOC-71465",
// "ptr_number": "PTR-65207",
// "email_verified_at": "2025-04-29T06:34:02.000000Z",
// "specialization_id": 9,
// "facility_id": 16,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:02.000000Z",
// "updated_at": "2025-04-29T06:34:02.000000Z",
// "specialization": {
// "id": 9,
// "name": "Endocrinologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Hormonal imbalances can sometimes cause headaches and dizziness."
// },
// {
// "id": 15,
// "name": "Joshuah Hansen",
// "email": "doctor9_government_2@gmail.com",
// "address": "84144 Torphy Freeway\nJamiemouth, MI 24829",
// "contact": "651.835.6463",
// "sex": "female",
// "dob": "1981-04-21",
// "license_no": "DOC-30366",
// "ptr_number": "PTR-23819",
// "email_verified_at": "2025-04-29T06:34:02.000000Z",
// "specialization_id": 9,
// "facility_id": 20,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:02.000000Z",
// "updated_at": "2025-04-29T06:34:02.000000Z",
// "specialization": {
// "id": 9,
// "name": "Endocrinologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Hormonal imbalances can sometimes cause headaches and dizziness."
// },
// {
// "id": 16,
// "name": "Emily Hermann",
// "email": "doctor9_government_3@gmail.com",
// "address": "1590 Robel Orchard\nPort Gradyfort, SD 00263",
// "contact": "1-678-595-7946",
// "sex": "female",
// "dob": "1980-05-27",
// "license_no": "DOC-38110",
// "ptr_number": "PTR-52031",
// "email_verified_at": "2025-04-29T06:34:02.000000Z",
// "specialization_id": 9,
// "facility_id": 14,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:02.000000Z",
// "updated_at": "2025-04-29T06:34:02.000000Z",
// "specialization": {
// "id": 9,
// "name": "Endocrinologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Hormonal imbalances can sometimes cause headaches and dizziness."
// },
// {
// "id": 17,
// "name": "Bernie Fadel",
// "email": "doctor9_government_4@gmail.com",
// "address": "6837 Kelli Streets\nNew Vellaside, WI 50309-0331",
// "contact": "1-631-257-7470",
// "sex": "male",
// "dob": "1985-05-21",
// "license_no": "DOC-66152",
// "ptr_number": "PTR-09022",
// "email_verified_at": "2025-04-29T06:34:02.000000Z",
// "specialization_id": 9,
// "facility_id": 14,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:02.000000Z",
// "updated_at": "2025-04-29T06:34:02.000000Z",
// "specialization": {
// "id": 9,
// "name": "Endocrinologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Hormonal imbalances can sometimes cause headaches and dizziness."
// },
// {
// "id": 18,
// "name": "Loyal Hansen",
// "email": "doctor9_government_5@gmail.com",
// "address": "14044 Reva Stravenue\nNew Jacksonstad, OR 53763",
// "contact": "407.503.2491",
// "sex": "female",
// "dob": "1973-12-16",
// "license_no": "DOC-04485",
// "ptr_number": "PTR-13872",
// "email_verified_at": "2025-04-29T06:34:03.000000Z",
// "specialization_id": 9,
// "facility_id": 3,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:03.000000Z",
// "updated_at": "2025-04-29T06:34:03.000000Z",
// "specialization": {
// "id": 9,
// "name": "Endocrinologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Hormonal imbalances can sometimes cause headaches and dizziness."
// },
// {
// "id": 19,
// "name": "Baby Rodriguez",
// "email": "doctor8_government_1@gmail.com",
// "address": "6006 Cale Freeway Apt. 544\nNorth Nedra, AK 38123",
// "contact": "+1-872-551-7711",
// "sex": "female",
// "dob": "1965-10-17",
// "license_no": "DOC-95727",
// "ptr_number": "PTR-07994",
// "email_verified_at": "2025-04-29T06:34:03.000000Z",
// "specialization_id": 8,
// "facility_id": 18,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:03.000000Z",
// "updated_at": "2025-04-29T06:34:03.000000Z",
// "specialization": {
// "id": 8,
// "name": "General Surgeon",
// "created_at": null,
// "updated_at": null
// },
// "reason": "In case of severe headaches, it could be due to a serious condition that may require surgical intervention."
// },
// {
// "id": 20,
// "name": "Ebony Morar",
// "email": "doctor8_government_2@gmail.com",
// "address": "1790 Constantin Grove Suite 558\nFarrellchester, AL 65816",
// "contact": "430-427-6333",
// "sex": "male",
// "dob": "1978-02-28",
// "license_no": "DOC-00418",
// "ptr_number": "PTR-77435",
// "email_verified_at": "2025-04-29T06:34:03.000000Z",
// "specialization_id": 8,
// "facility_id": 6,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:03.000000Z",
// "updated_at": "2025-04-29T06:34:03.000000Z",
// "specialization": {
// "id": 8,
// "name": "General Surgeon",
// "created_at": null,
// "updated_at": null
// },
// "reason": "In case of severe headaches, it could be due to a serious condition that may require surgical intervention."
// },
// {
// "id": 21,
// "name": "Lexus Simonis",
// "email": "doctor8_government_3@gmail.com",
// "address": "252 Smitham Forges Apt. 425\nSouth Lavina, RI 58390",
// "contact": "253.834.6768",
// "sex": "male",
// "dob": "1977-08-10",
// "license_no": "DOC-10408",
// "ptr_number": "PTR-91532",
// "email_verified_at": "2025-04-29T06:34:03.000000Z",
// "specialization_id": 8,
// "facility_id": 20,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:03.000000Z",
// "updated_at": "2025-04-29T06:34:03.000000Z",
// "specialization": {
// "id": 8,
// "name": "General Surgeon",
// "created_at": null,
// "updated_at": null
// },
// "reason": "In case of severe headaches, it could be due to a serious condition that may require surgical intervention."
// },
// {
// "id": 22,
// "name": "Jaylin Watsica",
// "email": "doctor8_government_4@gmail.com",
// "address": "662 Ollie Centers\nEdnaberg, MT 95426-8151",
// "contact": "(701) 289-0417",
// "sex": "female",
// "dob": "1986-08-28",
// "license_no": "DOC-11456",
// "ptr_number": "PTR-41932",
// "email_verified_at": "2025-04-29T06:34:04.000000Z",
// "specialization_id": 8,
// "facility_id": 17,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:04.000000Z",
// "updated_at": "2025-04-29T06:34:04.000000Z",
// "specialization": {
// "id": 8,
// "name": "General Surgeon",
// "created_at": null,
// "updated_at": null
// },
// "reason": "In case of severe headaches, it could be due to a serious condition that may require surgical intervention."
// },
// {
// "id": 23,
// "name": "Imogene Durgan",
// "email": "doctor8_government_5@gmail.com",
// "address": "712 Stamm Ports\nEast Soniafurt, CO 35444",
// "contact": "+1 (838) 715-0904",
// "sex": "male",
// "dob": "1998-04-01",
// "license_no": "DOC-73067",
// "ptr_number": "PTR-52452",
// "email_verified_at": "2025-04-29T06:34:04.000000Z",
// "specialization_id": 8,
// "facility_id": 14,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:04.000000Z",
// "updated_at": "2025-04-29T06:34:04.000000Z",
// "specialization": {
// "id": 8,
// "name": "General Surgeon",
// "created_at": null,
// "updated_at": null
// },
// "reason": "In case of severe headaches, it could be due to a serious condition that may require surgical intervention."
// },
// {
// "id": 24,
// "name": "Brayan Reichel",
// "email": "doctor3_government_1@gmail.com",
// "address": "882 Kamryn Mount\nMcGlynnfort, MN 75239-2311",
// "contact": "(320) 615-6544",
// "sex": "female",
// "dob": "1981-09-15",
// "license_no": "DOC-26823",
// "ptr_number": "PTR-04531",
// "email_verified_at": "2025-04-29T06:34:04.000000Z",
// "specialization_id": 3,
// "facility_id": 7,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:04.000000Z",
// "updated_at": "2025-04-29T06:34:04.000000Z",
// "specialization": {
// "id": 3,
// "name": "Neurologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Headaches and dizziness could be related to neurological issues."
// },
// {
// "id": 25,
// "name": "Jody Rippin",
// "email": "doctor3_government_2@gmail.com",
// "address": "6009 Breanna Ports\nRusselville, IN 09574-8638",
// "contact": "762-966-8731",
// "sex": "female",
// "dob": "1973-02-08",
// "license_no": "DOC-61887",
// "ptr_number": "PTR-78918",
// "email_verified_at": "2025-04-29T06:34:04.000000Z",
// "specialization_id": 3,
// "facility_id": 16,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:04.000000Z",
// "updated_at": "2025-04-29T06:34:04.000000Z",
// "specialization": {
// "id": 3,
// "name": "Neurologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Headaches and dizziness could be related to neurological issues."
// },
// {
// "id": 26,
// "name": "Rene Wolff",
// "email": "doctor3_government_3@gmail.com",
// "address": "36820 Brown Divide Suite 100\nPfefferfort, NV 78514",
// "contact": "+1 (216) 886-9221",
// "sex": "male",
// "dob": "1994-05-30",
// "license_no": "DOC-07909",
// "ptr_number": "PTR-84460",
// "email_verified_at": "2025-04-29T06:34:04.000000Z",
// "specialization_id": 3,
// "facility_id": 11,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:04.000000Z",
// "updated_at": "2025-04-29T06:34:04.000000Z",
// "specialization": {
// "id": 3,
// "name": "Neurologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Headaches and dizziness could be related to neurological issues."
// },
// {
// "id": 27,
// "name": "Sammie Block",
// "email": "doctor3_government_4@gmail.com",
// "address": "7751 Philip Prairie\nNew Ayla, MN 04889-9772",
// "contact": "+1 (561) 217-1147",
// "sex": "male",
// "dob": "1980-06-18",
// "license_no": "DOC-19538",
// "ptr_number": "PTR-21077",
// "email_verified_at": "2025-04-29T06:34:05.000000Z",
// "specialization_id": 3,
// "facility_id": 14,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:05.000000Z",
// "updated_at": "2025-04-29T06:34:05.000000Z",
// "specialization": {
// "id": 3,
// "name": "Neurologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Headaches and dizziness could be related to neurological issues."
// },
// {
// "id": 28,
// "name": "Ettie Ernser",
// "email": "doctor3_government_5@gmail.com",
// "address": "304 Johnston Tunnel\nPort Sylvia, GA 58162-6381",
// "contact": "(515) 244-4816",
// "sex": "male",
// "dob": "1984-01-08",
// "license_no": "DOC-00940",
// "ptr_number": "PTR-17849",
// "email_verified_at": "2025-04-29T06:34:05.000000Z",
// "specialization_id": 3,
// "facility_id": 19,
// "role_id": 2,
// "firebase_uid": null,
// "avatar": null,
// "online_status": 0,
// "last_active": null,
// "created_at": "2025-04-29T06:34:05.000000Z",
// "updated_at": "2025-04-29T06:34:05.000000Z",
// "specialization": {
// "id": 3,
// "name": "Neurologist",
// "created_at": null,
// "updated_at": null
// },
// "reason": "Headaches and dizziness could be related to neurological issues."
// }
// ]
//     });
    const [error, setError] = useState(null);
    const { flash } = usePage().props;

    const analyzeSymptoms = async () => {
        if (!symptoms.trim()) {
            setError('Please describe your symptoms first');
            return;
        }

        setAnalyzing(true);
        setError(null);

        try {
            // Using Inertia's axios instance which automatically includes CSRF token and credentials
            const response = await axios.post('/analyze-symptoms', { 
                symptoms 
            });
            
            if (response.data.success) {
                setResults(response.data.data);
            } else {
                setError(response.data.message || 'Failed to analyze symptoms');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'A network error occurred. Please try again later.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    const getSpecialistIcon = (name) => {
        const iconMap = {
            'Neurology': 'brain',
            'ENT': 'ear',
            'Cardiology': 'heart',
            'Pulmonology': 'lungs',
            'Orthopedics': 'bone',
            'Dermatology': 'allergies',
            'Gastroenterology': 'stomach',
            'Ophthalmology': 'eye',
            'Endocrinology': 'syringe',
            'Psychiatry': 'brain',
            'Pediatrics': 'baby',
            'Gynecology': 'female',
            'Urology': 'kidneys',
            // Add more specializations as needed
        };

        // Default icon if specialization not found in map
        return iconMap[name] || 'stethoscope';
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
                            <div className="container" style={{ display: showHero ? 'block' : 'none' }}>
                                <div className="row">
                                    <div className="col-lg-6 col-md-12 col-12">
                                        <div className="hero-text wow fadeInLeft" data-wow-delay=".3s">
                                            <div className="section-heading" id='hero-section-heading' style={{ marginTop: '-100px' }}>
                                                <h2>{slide.title}</h2>
                                                <p>{slide.text}</p>
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
                            <div className="col-lg-12">
                            <div className="appointment-title text-center mb-4">
                                <span className="badge bg-primary-soft mb-3">Find Your Doctor</span>
                                <h2>Book An Appointment</h2>
                                <p className="lead">Choose your preferred method to find the right specialist</p>
                            </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <ul className="nav nav-tabs appointment-tabs mb-4" id="appointmentTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="filter-tab" data-bs-toggle="tab" data-bs-target="#filter" type="button" role="tab">
                                <i className="fas fa-filter me-2"></i>Filter by Specialization
                            </button>
                            </li>
                            <li className="nav-item" role="presentation">
                            <button className="nav-link" id="ai-tab" data-bs-toggle="tab" data-bs-target="#ai" type="button" role="tab">
                                <i className="fas fa-robot me-2"></i>AI Symptom Checker
                            </button>
                            </li>
                        </ul>

                        <div className="tab-content" id="appointmentTabsContent">
                            {/* Traditional Filter Tab */}
                            <div className="tab-pane fade show active" id="filter" role="tabpanel">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="specialization"
                                                value={selectedSpecialization}
                                                onChange={(e) => setSelectedSpecialization(e.target.value)}
                                                required
                                            >
                                                <option value="">Select...</option>
                                                {specializations.map(spec => (
                                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="specialization"><i className="fas fa-stethoscope me-2"></i>Specialization</label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-floating">
                                            <select 
                                                className="form-select"
                                                id="hospital_type" 
                                                onChange={(e) => setSelectedType(e.target.value)}
                                                required
                                            >
                                                <option value="">Select...</option>
                                                <option value="government">Government</option>
                                                <option value="private">Private</option>
                                            </select>
                                            <label htmlFor="hospital_type"><i className="fas fa-hospital me-2"></i>Hospital Type</label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-floating">
                                            <select 
                                                className="form-select"
                                                id="hospital" 
                                                onChange={(e) => setSelectedFacility(Number(e.target.value))}
                                                required
                                            >
                                                <option value="">Select...</option>
                                                {filteredFacilities.map(facility => (
                                                <option key={facility.id} value={facility.id}>{facility.name}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="hospital"><i className="fas fa-clinic-medical me-2"></i>Hospital</label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-floating">
                                            <select 
                                                className="form-select"
                                                id="doctor" 
                                                onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                                                required
                                            >
                                                <option value="">Select...</option>
                                                {filteredDoctors.map(doctor => (
                                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="doctor"><i className="fas fa-user-md me-2"></i>Doctor</label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-12 text-center mt-3">
                                        <button className="btn btn-success btn-lg px-5" type="submit">
                                        <i className="fas fa-calendar-check me-2"></i>Book Appointment
                                        </button>
                                    </div>
                                    </div>
                                </form>
                            </div>

                            <div className="tab-pane fade" id="ai" role="tabpanel">
                                <div className="row g-4">
                                    <div className="col-lg-7">
                                        <div className="card h-100 border-0 shadow-sm">
                                            <div className="card-body p-4">
                                                <h4 className="mb-4">
                                                    <i className="fas fa-comment-medical text-primary me-2"></i>
                                                    Describe Your Symptoms
                                                </h4>
                                                
                                                {error && (
                                                    <div className="alert alert-danger mb-3">
                                                        <i className="fas fa-exclamation-circle me-2"></i>
                                                        {error}
                                                    </div>
                                                )}
                                                
                                                {flash?.message && (
                                                    <div className={`alert alert-${flash.type || 'info'} mb-3`}>
                                                        <i className="fas fa-info-circle me-2"></i>
                                                        {flash.message}
                                                    </div>
                                                )}
                                                
                                                <div className="form-floating mb-4">
                                                    <textarea
                                                        className="form-control"
                                                        id="symptoms"
                                                        style={{ height: "150px" }}
                                                        placeholder="Describe your symptoms here..."
                                                        value={symptoms}
                                                        onChange={(e) => setSymptoms(e.target.value)}
                                                        disabled={analyzing}
                                                    ></textarea>
                                                    <label htmlFor="symptoms">Example: "I've had persistent headaches and dizziness for 3 days..."</label>
                                                </div>
                                                
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <button 
                                                        className="btn btn-success px-4" 
                                                        onClick={analyzeSymptoms}
                                                        disabled={analyzing || !symptoms.trim()}
                                                    >
                                                        {analyzing ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Analyzing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-search me-2"></i>
                                                                Analyze Symptoms
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                {results?.additional_advice && (
                                                    <div className="mt-4 pt-3 border-top">
                                                        <h5 className="mb-3">
                                                            <i className="fas fa-info-circle text-info me-2"></i>
                                                            Additional Information
                                                        </h5>
                                                        <p className="mb-0">{results.additional_advice}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-5">
                                        <div className="card h-100 border-0 shadow-sm">
                                            <div className="card-body p-4 d-flex flex-column">
                                                <h4 className="mb-4">
                                                    <i className="fas fa-lightbulb text-warning me-2"></i>
                                                    Recommended Specialists
                                                </h4>
                                                
                                                {!results && !analyzing && (
                                                    <div className="alert alert-success mb-4">
                                                        <i className="fas fa-success-circle me-2"></i>
                                                        Describe your symptoms to get personalized recommendations.
                                                    </div>
                                                )}
                                                
                                                {analyzing && (
                                                    <div className="text-center py-5">
                                                        <div className="spinner-border text-success" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <p className="mt-3">Analyzing your symptoms...</p>
                                                    </div>
                                                )}
                                                
                                                {results && (
                                                    <>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <p className="text-muted mb-0 small">
                                                                <i className="fas fa-chart-bar me-1"></i>
                                                                Analysis confidence: {Math.round(results.confidence_score * 100)}%
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="specialist-results flex-grow-1" style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                                            {results.doctors.map((specialist, index) => (
                                                                <div key={index} className="specialist-result mb-3 p-3 bg-light rounded">
                                                                    <div className="d-flex align-items-start">
                                                                        <div className="flex-shrink-0 bg-primary-soft p-2 rounded me-3">
                                                                            <i className='lni lni-sthethoscope' style={{ fontSize: '1.5rem' }}></i>
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="mb-1">{specialist.name}</h5>
                                                                            <span className="badge text-uppercase ms-2 bg-success text-white mt-2 mb-2">{specialist.specialization.name}</span>
                                                                            <p className="small text-muted mb-2">{specialist.reason}</p>
                                                                            <button 
                                                                                className="btn btn-sm btn-outline-success"
                                                                                onClick={() => selectSpecialization(specialist.id, specialist.facility_id)}
                                                                            >
                                                                                Select & Continue
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                                                                         
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                            <p>{["Hospitals", "Specialist Doctors", "Happy Patients", "Years of Experience"][index]}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
