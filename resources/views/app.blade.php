<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.svg" />

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Web Font -->
        {{-- <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

        <link
            href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
            rel="stylesheet">

        <link rel="stylesheet" href="assets/css/bootstrap.min.css" />    
        <link rel="stylesheet" href="assets/css/LineIcons.2.0.css" />
        <link rel="stylesheet" href="assets/css/animate.css" />
        <link rel="stylesheet" href="assets/css/tiny-slider.css" />
        <link rel="stylesheet" href="assets/css/glightbox.min.css" />
        <link rel="stylesheet" href="assets/css/main.css" /> --}}
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body >
        @inertia

        {{-- <div class="preloader">
            <div class="preloader-inner">
                <div class="preloader-icon">
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div> --}}

        {{-- <header class="header navbar-area">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-12">
                        <div class="nav-inner">
                            <nav class="navbar navbar-expand-lg">
                                <a class="navbar-brand" href="index.html">
                                    <img src="assets/images/online.png" alt="Logo" style="width: 40px;">
                                    Telemedicine
                                </a>
                                <button class="navbar-toggler mobile-menu-btn" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="toggler-icon"></span>
                                    <span class="toggler-icon"></span>
                                    <span class="toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                    <ul id="nav" class="navbar-nav ms-auto">
                                        <li class="nav-item">
                                            <a href="index.html" class="active" aria-label="Toggle navigation">Home</a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="login.html" aria-label="Toggle navigation">Login</a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="register.html" aria-label="Toggle navigation">Register</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="button add-list-button">
                                    <a href="javascript:void(0)" class="btn">Book Appointment</a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header> --}}

        {{-- <section class="hero-area ">
            <div class="shapes">
                <img src="assets/images/hero/05.svg" class="shape1" alt="#">
                <img src="assets/images/hero/01.svg" class="shape2" alt="#">
            </div>
            <div class="hero-slider">
                <div class="single-slider">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6 col-md-12 col-12">
                                <div class="hero-text">
                                    <div class="section-heading">
                                        <h2 class="wow fadeInLeft" data-wow-delay=".3s">Find A Doctor & <br>Book Appointment
                                        </h2>
                                        <p class="wow fadeInLeft" data-wow-delay=".5s">Telemedicine tackles key healthcare challenges by providing virtual access to
                                            medical care, reducing wait times, and offering cost-effective alternatives.</p>
                                        <div class="button wow fadeInLeft" data-wow-delay=".7s">
                                            <a href="appointment.html" class="btn">Book Appointment</a>
                                            <a href="about-us.html" class="btn">About Us</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12 col-12">
                                <div class="hero-image wow fadeInRight" data-wow-delay=".5s">
                                    <img src="assets/images/hero/02.png" alt="#">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="single-slider">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6 col-md-12 col-12">
                                <div class="hero-text wow fadeInLeft" data-wow-delay=".3s">
                                    <div class="section-heading">
                                        <h2>No need to <br> go to the hospital to conduct a consultation</h2>
                                        <p class="wow fadeInLeft" data-wow-delay=".5s">It
                                            connects patients with specialists</p>
                                        <div class="button">
                                            <a href="appointment.html" class="btn">Book Appointment</a>
                                            <a href="about-us.html" class="btn">About Us</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12 col-12">
                                <div class="hero-image">
                                    <img src="assets/images/hero/slider-2.png" alt="#">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="single-slider">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6 col-md-12 col-12">
                                <div class="hero-text wow fadeInLeft" data-wow-delay=".3s">
                                    <div class="section-heading">
                                        <h2>Superior solutions that <br> help you to shine.</h2>
                                        <p class="wow fadeInLeft" data-wow-delay=".5s">Offers user-friendly
                                            platforms, making healthcare more accessible and efficient.</p>
                                        <div class="button">
                                            <a href="appointment.html" class="btn">Book Appointment</a>
                                            <a href="about-us.html" class="btn">About Us</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12 col-12">
                                <div class="hero-image">
                                    <img src="assets/images/hero/slider-3.png" alt="#">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> --}}

        {{-- <section class="appointment">
            <div class="container">
                <!-- Appointment Form -->
                <div class="appointment-form">
                    <div class="row">
                        <div class="col-lg-6 col-12">
                            <div class="appointment-title">
                                <span>Appointment</span>
                                <h2>Book An Appointment</h2>
                                <p>Please feel welcome to contact our friendly reception staff with any general or medical
                                    enquiry. Our doctors will receive or return any urgent calls.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-3 col-md-6 col-12 p-0">
                            <div class="appointment-input">
                                <label for="name"><i class="lni lni-user"></i></label>
                                <input type="text" name="name" id="name" placeholder="Your Name">
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 p-0">
                            <div class="appointment-input">
                                <label for="email"><i class="lni lni-envelope"></i></label>
                                <input type="email" name="email" id="email" placeholder="Your Email">
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 p-0">
                            <div class="appointment-input">
                                <label for="department"><i class="lni lni-notepad"></i></label>
                                <select name="department" id="department">
                                    <option value="none" selected disabled>Department</option>
                                    <option value="none">General Surgery</option>
                                    <option value="none">Gastroenterology</option>
                                    <option value="none">Nutrition & Dietetics</option>
                                    <option value="none">Cardiology</option>
                                    <option value="none">Neurology</option>
                                    <option value="none">Pediatric</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 custom-padding">
                            <div class="appointment-btn button">
                                <button class="btn">Get Appointment</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End Appointment Form -->
            </div>
        </section> --}}

        {{-- <section class="about-us section">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 col-md-12 col-12">
                        <div class="content-left wow fadeInLeft" data-wow-delay=".3s">
                            <img src="assets/images/about/about.png" alt="#">
                            <a href="https://www.youtube.com/watch?v=r44RKWyfcFw&fbclid=IwAR21beSJORalzmzokxDRcGfkZA1AtRTE__l5N4r09HcGS5Y6vOluyouM9EM"
                                class="glightbox video"><i class="lni lni-play"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12 col-12">
                        <div class="content-right wow fadeInRight" data-wow-delay=".5s">
                            <span class="sub-heading">About</span>
                            <h2>Thousands of specialties for any type of diagnostic care.</h2>
                            <p>We provide a wide range of diagnostic services designed to meet the diverse needs of our patients. From routine health checkups to specialized exams, our team is committed to delivering the best possible care. With advanced technology and expert practitioners, we ensure accurate and timely diagnoses for all our patients.</p>
                            <div class="row">
                                <div class="col-lg-6 col-12">
                                    <ul class="list">
                                        <li><i class="lni lni-checkbox"></i>Conducts virtual health consultations</li>
                                        <li><i class="lni lni-checkbox"></i>Offers remote diagnostic services</li>
                                        <li><i class="lni lni-checkbox"></i>Manages minor illnesses via telemedicine</li>
                                    </ul>
                                </div>
                                <div class="col-lg-6 col-12">
                                    <ul class="list">
                                        <li><i class="lni lni-checkbox"></i>Provides specialist video consultations</li>
                                        <li><i class="lni lni-checkbox"></i>Prescribes and monitors treatments online</li>
                                        <li><i class="lni lni-checkbox"></i>Delivers remote follow-up care</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="button">
                                <a href="about-us.html" class="btn">More About Us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> --}}

        {{-- <section class="our-achievement section">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-12">
                        <div class="single-achievement wow fadeInUp" data-wow-delay=".2s">
                            <i class="lni lni-apartment"></i>
                            <h3 class="counter"><span id="secondo1" class="countup" cup-end="1250">1250</span></h3>
                            <p>Hospital Rooms</p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-3 col-12">
                        <div class="single-achievement wow fadeInUp" data-wow-delay=".4s">
                            <i class="lni lni-sthethoscope"></i>
                            <h3 class="counter"><span id="secondo2" class="countup" cup-end="350">350</span></h3>
                            <p>Specialist Doctors</p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-3 col-12">
                        <div class="single-achievement wow fadeInUp" data-wow-delay=".6s">
                            <i class="lni lni-emoji-smile"></i>
                            <h3 class="counter"><span id="secondo3" class="countup" cup-end="2500">2500</span></h3>
                            <p>Happy Patients</p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-3 col-12">
                        <div class="single-achievement wow fadeInUp" data-wow-delay=".6s">
                            <i class="lni lni-certificate"></i>
                            <h3 class="counter"><span id="secondo3" class="countup" cup-end="35">35</span></h3>
                            <p>Years of Experience</p>
                        </div>
                    </div>
                </div>
            </div>
        </section> --}}

        {{-- <footer class="footer overlay">    
            <div class="footer-bottom">
                <div class="container">
                    <div class="inner">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-12">
                                <div class="content">
                                    <p class="copyright-text">Designed and Developed by <a href="https://graygrids.com/"
                                            rel="nofollow" target="_blank">Rusel Tayong</a>
                                    </p>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-12">
                                <ul class="extra-link">
                                    <li><a href="javascript:void(0)">Terms & Conditions</a></li>
                                    <li><a href="javascript:void(0)">FAQ</a></li>
                                    <li><a href="javascript:void(0)">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer> --}}

        {{-- <a href="#" class="scroll-top">
            <i class="lni lni-chevron-up"></i>
        </a> --}}
    </body>
    {{-- <script src="assets/js/jquery.min.js"></script> --}}
    {{-- <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <script src="assets/js/tiny-slider.js"></script>
    <script src="assets/js/glightbox.min.js"></script>
    <script src="assets/js/count-up.min.js"></script>
    <script src="assets/js/imagesloaded.min.js"></script>
    <script src="assets/js/isotope.min.js"></script> --}}
    {{-- <script src="assets/js/main.js"></script> --}}
</html>
