import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { url } = usePage();
    const isActive = (routeName) => url.startsWith(route(routeName, {}, false));
    const user = usePage().props.auth.user;
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    useEffect(() => {
        document.querySelectorAll("[data-dynamic_guest='true']").forEach((el) => el.remove());
        // Check if scripts are already loaded to prevent duplicate loading
        if (document.querySelector("[data-dynamic='true']")) {
            setScriptsLoaded(true);
            return;
        }

        const assetsToLoad = [
            { type: "css", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" },
            { type: "css", href: "admin/assets/css/bootstrap.css" },
            { type: "css", href: "admin/assets/vendors/iconly/bold.css" },
            { type: "css", href: "admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.css" },
            { type: "css", href: "admin/assets/vendors/bootstrap-icons/bootstrap-icons.css" },
            { type: "css", href: "admin/assets/css/app.css" },
        ];

        const jsToLoad = [
            { type: "js", src: "admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js" },
            { type: "js", src: "admin/assets/js/bootstrap.bundle.min.js" },
            { type: "js", src: "admin/assets/vendors/apexcharts/apexcharts.js" },
            // { type: "js", src: "admin/assets/js/pages/dashboard.js" },
            //{ type: "js", src: "admin/assets/js/main.js" },
        ];

        assetsToLoad.forEach(({ type, href, src }) => {
            if (type === "css") {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = href;
                link.dataset.dynamic = "true";
                document.head.appendChild(link);
            }
        });

        // Add custom styles for the green theme
        const customStyles = document.createElement("style");
        customStyles.dataset.dynamic = "true";
        customStyles.textContent = `
            :root {
                --dark-green: #004025;
                --medium-green: #006838;
                --light-green: #3c9f63;
                --very-light-green: #e8f5e9;
                --sidebar-bg: #f8fdf9;
                --active-menu-bg: #e8f5e9;
                --hover-menu-bg: #f0f9f2;
            }
            
            #sidebar .sidebar-wrapper {
                background-color: var(--sidebar-bg);
                box-shadow: 0 0 10px rgba(0, 104, 56, 0.1);
            }
            
            #sidebar .sidebar-header .logo a {
                color: var(--medium-green) !important;
            }
            
            .sidebar-menu .menu .sidebar-title {
                color: var(--dark-green);
                font-weight: 600;
            }
            
            .sidebar-menu .menu .sidebar-item a {
                color: var(--dark-green);
            }
            
            .sidebar-menu .menu .sidebar-item.active a {
                background-color: var(--active-menu-bg);
                color: var(--medium-green);
                font-weight: 600;
                border-left: 3px solid var(--medium-green);
            }
            
            .sidebar-menu .menu .sidebar-item a:hover {
                background-color: var(--hover-menu-bg);
                color: var(--medium-green);
            }
            
            .bi {
                color: white;
            }
            
            .sidebar-item.active .bi {
                color: var(--medium-green);
            }
            
            footer p {
                color: var(--dark-green);
            }
            
            footer a {
                color: var(--medium-green);
                font-weight: 600;
                text-decoration: none;
            }
            
            footer a:hover {
                color: var(--light-green);
                text-decoration: underline;
            }
            
            .card {
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 104, 56, 0.08);
                border: none;
            }
            
            .card-header {
                background-color: #fff;
                border-bottom: 2px solid var(--very-light-green);
                font-weight: 600;
                color: var(--medium-green);
            }
            
            .btn-primary {
                background-color: var(--medium-green) !important;
                border-color: var(--medium-green) !important;
            }
            
            .btn-primary:hover {
                background-color: var(--dark-green) !important;
                border-color: var(--dark-green) !important;
            }
            
            .page-item.active .page-link {
                background-color: var(--medium-green) !important;
                border-color: var(--medium-green) !important;
            }
            
            .page-link {
                color: var(--medium-green) !important;
            }
            
            .page-link:hover {
                color: var(--dark-green) !important;
            }
            .sidebar-item active {
                background-color: var(--active-menu-bg) !important;
            }
            .sidebar-link {
                color: var(--medium-green) !important;
            }
            .sidebar-link:hover {
                color: var(--dark-green) !important;
            }
            .sidebar-wrapper .menu .sidebar-item.active .sidebar-link {
                background-color: #006838 !important;
            }
        `;
        document.head.appendChild(customStyles);

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
    
        // return () => {
        //     document.querySelectorAll("[data-dynamic='true']").forEach((el) => el.remove());
        // };

    }, []);


    const slideToggle = (element, duration, callback, isDown) => {
        if (!element) return;
        
        const slideAnimation = (timestamp) => {
          if (start === undefined) start = timestamp;
          const elapsed = timestamp - start;
          
          if (isDown) {
            element.style.height = (height * Math.min(elapsed / duration, 1)) + 'px';
            element.style.paddingTop = (paddingTop * Math.min(elapsed / duration, 1)) + 'px';
            element.style.paddingBottom = (paddingBottom * Math.min(elapsed / duration, 1)) + 'px';
            element.style.marginTop = (marginTop * Math.min(elapsed / duration, 1)) + 'px';
            element.style.marginBottom = (marginBottom * Math.min(elapsed / duration, 1)) + 'px';
          } else {
            element.style.height = (height - (height * Math.min(elapsed / duration, 1))) + 'px';
            element.style.paddingTop = (paddingTop - (paddingTop * Math.min(elapsed / duration, 1))) + 'px';
            element.style.paddingBottom = (paddingBottom - (paddingBottom * Math.min(elapsed / duration, 1))) + 'px';
            element.style.marginTop = (marginTop - (marginTop * Math.min(elapsed / duration, 1))) + 'px';
            element.style.marginBottom = (marginBottom - (marginBottom * Math.min(elapsed / duration, 1))) + 'px';
          }
          
          if (elapsed >= duration) {
            element.style.height = '';
            element.style.paddingTop = '';
            element.style.paddingBottom = '';
            element.style.marginTop = '';
            element.style.marginBottom = '';
            element.style.overflow = '';
            
            if (!isDown) element.style.display = 'none';
            
            if (typeof callback === 'function') callback();
            return;
          }
          
          window.requestAnimationFrame(slideAnimation);
        };
      
        // Set up initial values
        element.style.overflow = 'hidden';
        if (isDown) element.style.display = 'block';
        
        const computedStyle = window.getComputedStyle(element);
        const height = parseFloat(computedStyle.getPropertyValue('height'));
        const paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top'));
        const paddingBottom = parseFloat(computedStyle.getPropertyValue('padding-bottom'));
        const marginTop = parseFloat(computedStyle.getPropertyValue('margin-top'));
        const marginBottom = parseFloat(computedStyle.getPropertyValue('margin-bottom'));
        
        let start;
        window.requestAnimationFrame(slideAnimation);
    };

    const [isSidebarActive, setIsSidebarActive] = useState(true);
    const [submenuStates, setSubmenuStates] = useState({});
    
    // Refs for DOM elements
    const sidebarRef = useRef(null);
    const submenuRefs = useRef({});
    const sidebarItemsRef = useRef([]);
    
    // Initialize on component mount
    useEffect(() => {
        // Handle initial window size
        const handleWindowSize = () => {
            if (window.innerWidth < 1200) {
                setIsSidebarActive(false);
            } else {
                setIsSidebarActive(true);
            }
        };
        
        handleWindowSize();
        window.addEventListener('resize', handleWindowSize);
        
        // Scroll into active sidebar item
        const activeSidebarItem = document.querySelector('.sidebar-item.active');
        if (activeSidebarItem) {
            activeSidebarItem.scrollIntoView(false);
        }
        
        // Perfect Scrollbar init
        if (typeof PerfectScrollbar === 'function') {
            const container = document.querySelector('.sidebar-wrapper');
            if (container) {
                const ps = new PerfectScrollbar(container, {
                wheelPropagation: false
                });
            }
        }
        
        return () => {
            window.removeEventListener('resize', handleWindowSize);
        };
    }, []);
    
    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarActive(!isSidebarActive);
    };
    
    // Toggle submenu with animation
    const toggleSubmenu = (index) => {
        const submenu = submenuRefs.current[index];
        if (!submenu) return;
        
        setSubmenuStates(prev => {
            const newState = !prev[index];
            
            // Apply animation
            if (newState) {
                // Opening the submenu
                if (submenu.style.display === 'none' || !submenu.style.display) {
                    submenu.classList.add('active');
                    slideToggle(submenu, 300, null, true);
                }
            } else {
                // Closing the submenu
                submenu.classList.remove('active');
                slideToggle(submenu, 300);
            }
            
            return { ...prev, [index]: newState };
        });
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };
    
    return (
        <>
            {
                scriptsLoaded 
                ?
                <div id="app">
                    <div id="sidebar" className={isSidebarActive ? "active" : ""} ref={sidebarRef}>
                        <div className="sidebar-wrapper active">
                            <div className="sidebar-header">
                                <div className="d-flex justify-content-between">
                                    <div className="logo" style={{ lineHeight: 1.4 }}>
                                        <Link
                                            href={route('home')}
                                            style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            color: '#006838', // Medium green
                                            display: 'block',
                                            textDecoration: 'none',
                                            }}
                                        >
                                            {user.name}
                                        </Link>
                                        <span
                                            style={{
                                            fontSize: '1.1rem',
                                            color: '#004025', // Dark green
                                            fontWeight: '500',
                                            display: 'block',
                                            marginTop: '0.2rem',
                                            }}
                                        >
                                            {user.facility.name}
                                        </span>
                                        <span
                                            style={{
                                            fontSize: '1rem',
                                            color: '#3c9f63', // Light green
                                            fontWeight: '400',
                                            display: 'block',
                                            marginTop: '0.1rem',
                                            }}
                                        >
                                            {user.specialization.name}
                                        </span>
                                    </div>
                                    <div className="toggler">
                                        <a 
                                        href="#" 
                                        className="sidebar-hide d-xl-none d-block"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSidebar();
                                        }}
                                        >
                                        <i className="bi bi-x bi-middle"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='sidebar-menu' style={{ marginTop: '-20px' }}>
                                <ul className='menu'>
                                    <li className="sidebar-title">Menu</li>
                                    <li className={`sidebar-item ${isActive('dashboard') ? 'active' : ''}`}>
                                        <Link href={route('dashboard')} className='sidebar-link'>
                                            <i className="bi bi-grid-fill"></i>
                                            <span>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li className={`sidebar-item ${isActive('appointments.index') ? 'active' : ''}`}>
                                        <Link href={route('appointments.index')} className='sidebar-link'>
                                            <i className="bi bi-calendar-check-fill"></i>
                                            <span>Manage Appointment</span>
                                        </Link>
                                    </li>
                                    <li className={`sidebar-item ${isActive('doctor.manage.booking') ? 'active' : ''}`}>
                                        <Link href={route('doctor.manage.booking')} className='sidebar-link'>
                                            <i className="bi bi-journal-medical"></i>
                                            <span>Manage Booking</span>
                                        </Link>
                                    </li>
                                    <li className="sidebar-item">
                                        <a 
                                            href="#" 
                                            className='sidebar-link'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleLogout();
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-right"></i>
                                            <span>Logout</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div id="main">
                        <header className="mb-3">
                            <a href="#" className="burger-btn d-block d-xl-none" onClick={toggleSidebar}>
                                <i className="bi bi-justify fs-3"></i>
                            </a>
                        </header>
                        {header && (
                            <div className="page-heading">
                                <div className="page-title">
                                    <div className="row">
                                        <div className="col-12">
                                            {header}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="page-content">
                            {children}
                        </div>

                        <footer>
                            <div className="footer clearfix mb-0 text-muted">
                                <div className="float-start">
                                    <p>2025 &copy; DOH</p>
                                </div>
                                <div className="float-end">
                                    <p>
                                    Crafted by
                                    <a href="#"> Rusel Tayong</a>
                                    </p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
                :
                <div className="loading-container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f8fdf9'
                }}>
                    <div className="spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid #e8f5e9',
                        borderTop: '5px solid #006838',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            }
        </>
    );
}

// import ApplicationLogo from '@/Components/ApplicationLogo';
// import Dropdown from '@/Components/Dropdown';
// import NavLink from '@/Components/NavLink';
// import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
// import { Link, usePage, router } from '@inertiajs/react';
// import { useState, useEffect, useRef } from 'react';

// export default function AuthenticatedLayout({ header, children }) {
//     const { url } = usePage();
//     const isActive = (routeName) => url.startsWith(route(routeName, {}, false));
//     const user = usePage().props.auth.user;
//     const [scriptsLoaded, setScriptsLoaded] = useState(false);
//     useEffect(() => {
//         document.querySelectorAll("[data-dynamic_guest='true']").forEach((el) => el.remove());
//         // Check if scripts are already loaded to prevent duplicate loading
//         if (document.querySelector("[data-dynamic='true']")) {
//             setScriptsLoaded(true);
//             return;
//         }

//         const assetsToLoad = [
//             { type: "css", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swapp" },
//             { type: "css", href: "admin/assets/css/bootstrap.css" },
//             { type: "css", href: "admin/assets/vendors/iconly/bold.css" },
//             { type: "css", href: "admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.css" },
//             { type: "css", href: "admin/assets/vendors/bootstrap-icons/bootstrap-icons.css" },
//             { type: "css", href: "admin/assets/css/app.css" },
//         ];

//         const jsToLoad = [
//             { type: "js", src: "admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js" },
//             { type: "js", src: "admin/assets/js/bootstrap.bundle.min.js" },
//             { type: "js", src: "admin/assets/vendors/apexcharts/apexcharts.js" },
//             // { type: "js", src: "admin/assets/js/pages/dashboard.js" },
//             //{ type: "js", src: "admin/assets/js/main.js" },
//         ];

//         assetsToLoad.forEach(({ type, href, src }) => {
//             if (type === "css") {
//                 const link = document.createElement("link");
//                 link.rel = "stylesheet";
//                 link.href = href;
//                 link.dataset.dynamic = "true";
//                 document.head.appendChild(link);
//             }
//         });

//         Promise.all(
//             jsToLoad.map(({ src }) => {
//                 return new Promise((resolve) => {
//                     const script = document.createElement("script");
//                     script.src = src;
//                     script.async = true;
//                     script.dataset.dynamic = "true";
//                     script.onload = resolve;
//                     document.body.appendChild(script);
//                 });
//             })
//         ).then(() => {
//             setScriptsLoaded(true); // Mark scripts as loaded
//         });
    
//         // return () => {
//         //     document.querySelectorAll("[data-dynamic='true']").forEach((el) => el.remove());
//         // };

//     }, []);


//     const slideToggle = (element, duration, callback, isDown) => {
//         if (!element) return;
        
//         const slideAnimation = (timestamp) => {
//           if (start === undefined) start = timestamp;
//           const elapsed = timestamp - start;
          
//           if (isDown) {
//             element.style.height = (height * Math.min(elapsed / duration, 1)) + 'px';
//             element.style.paddingTop = (paddingTop * Math.min(elapsed / duration, 1)) + 'px';
//             element.style.paddingBottom = (paddingBottom * Math.min(elapsed / duration, 1)) + 'px';
//             element.style.marginTop = (marginTop * Math.min(elapsed / duration, 1)) + 'px';
//             element.style.marginBottom = (marginBottom * Math.min(elapsed / duration, 1)) + 'px';
//           } else {
//             element.style.height = (height - (height * Math.min(elapsed / duration, 1))) + 'px';
//             element.style.paddingTop = (paddingTop - (paddingTop * Math.min(elapsed / duration, 1))) + 'px';
//             element.style.paddingBottom = (paddingBottom - (paddingBottom * Math.min(elapsed / duration, 1))) + 'px';
//             element.style.marginTop = (marginTop - (marginTop * Math.min(elapsed / duration, 1))) + 'px';
//             element.style.marginBottom = (marginBottom - (marginBottom * Math.min(elapsed / duration, 1))) + 'px';
//           }
          
//           if (elapsed >= duration) {
//             element.style.height = '';
//             element.style.paddingTop = '';
//             element.style.paddingBottom = '';
//             element.style.marginTop = '';
//             element.style.marginBottom = '';
//             element.style.overflow = '';
            
//             if (!isDown) element.style.display = 'none';
            
//             if (typeof callback === 'function') callback();
//             return;
//           }
          
//           window.requestAnimationFrame(slideAnimation);
//         };
      
//         // Set up initial values
//         element.style.overflow = 'hidden';
//         if (isDown) element.style.display = 'block';
        
//         const computedStyle = window.getComputedStyle(element);
//         const height = parseFloat(computedStyle.getPropertyValue('height'));
//         const paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top'));
//         const paddingBottom = parseFloat(computedStyle.getPropertyValue('padding-bottom'));
//         const marginTop = parseFloat(computedStyle.getPropertyValue('margin-top'));
//         const marginBottom = parseFloat(computedStyle.getPropertyValue('margin-bottom'));
        
//         let start;
//         window.requestAnimationFrame(slideAnimation);
//     };

//     const [isSidebarActive, setIsSidebarActive] = useState(true);
//     const [submenuStates, setSubmenuStates] = useState({});
    
//     // Refs for DOM elements
//     const sidebarRef = useRef(null);
//     const submenuRefs = useRef({});
//     const sidebarItemsRef = useRef([]);
    
//     // Initialize on component mount
//     useEffect(() => {
//         // Handle initial window size
//         const handleWindowSize = () => {
//             if (window.innerWidth < 1200) {
//                 setIsSidebarActive(false);
//             } else {
//                 setIsSidebarActive(true);
//             }
//         };
        
//         handleWindowSize();
//         window.addEventListener('resize', handleWindowSize);
        
//         // Scroll into active sidebar item
//         const activeSidebarItem = document.querySelector('.sidebar-item.active');
//         if (activeSidebarItem) {
//             activeSidebarItem.scrollIntoView(false);
//         }
        
//         // Perfect Scrollbar init
//         if (typeof PerfectScrollbar === 'function') {
//             const container = document.querySelector('.sidebar-wrapper');
//             if (container) {
//                 const ps = new PerfectScrollbar(container, {
//                 wheelPropagation: false
//                 });
//             }
//         }
        
//         return () => {
//             window.removeEventListener('resize', handleWindowSize);
//         };
//     }, []);
    
//     // Toggle sidebar
//     const toggleSidebar = () => {
//         setIsSidebarActive(!isSidebarActive);
//     };
    
//     // Toggle submenu with animation
//     const toggleSubmenu = (index) => {
//         const submenu = submenuRefs.current[index];
//         if (!submenu) return;
        
//         setSubmenuStates(prev => {
//             const newState = !prev[index];
            
//             // Apply animation
//             if (newState) {
//                 // Opening the submenu
//                 if (submenu.style.display === 'none' || !submenu.style.display) {
//                     submenu.classList.add('active');
//                     slideToggle(submenu, 300, null, true);
//                 }
//             } else {
//                 // Closing the submenu
//                 submenu.classList.remove('active');
//                 slideToggle(submenu, 300);
//             }
            
//             return { ...prev, [index]: newState };
//         });
//     };

//     const handleLogout = () => {
//         router.post(route('logout'));
//     };
    
//     return (
//         <>
//             {
//                 scriptsLoaded 
//                 ?
//                 <div id="app">
//                     <div id="sidebar" className={isSidebarActive ? "active" : ""} ref={sidebarRef}>
//                         <div className="sidebar-wrapper active">
//                             <div className="sidebar-header">
//                                 <div className="d-flex justify-content-between">
//                                     <div className="logo" style={{ lineHeight: 1.4 }}>
//                                         <Link
//                                             href={route('home')}
//                                             style={{
//                                             fontSize: '1.5rem',
//                                             fontWeight: '600',
//                                             color: '#3b5bdb', // A calm blue
//                                             display: 'block',
//                                             textDecoration: 'none',
//                                             }}
//                                         >
//                                             {user.name}
//                                         </Link>
//                                         <span
//                                             style={{
//                                             fontSize: '1.1rem',
//                                             color: '#444',
//                                             fontWeight: '500',
//                                             display: 'block',
//                                             marginTop: '0.2rem',
//                                             }}
//                                         >
//                                             {user.facility.name}
//                                         </span>
//                                         <span
//                                             style={{
//                                             fontSize: '1rem',
//                                             color: '#666',
//                                             fontWeight: '400',
//                                             display: 'block',
//                                             marginTop: '0.1rem',
//                                             }}
//                                         >
//                                             {user.specialization.name}
//                                         </span>
//                                     </div>
//                                     <div className="toggler">
//                                         <a 
//                                         href="#" 
//                                         className="sidebar-hide d-xl-none d-block"
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             toggleSidebar();
//                                         }}
//                                         >
//                                         <i className="bi bi-x bi-middle"></i>
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='sidebar-menu' style={{ marginTop: '-20px' }}>
//                                 <ul className='menu'>
//                                     <li className="sidebar-title">Menu</li>
//                                     <li className={`sidebar-item ${isActive('dashboard') ? 'active' : ''}`}>
//                                         <Link href={route('dashboard')} className='sidebar-link'>
//                                             <i className="bi bi-grid-fill"></i>
//                                             <span>Dashboard</span>
//                                         </Link>
//                                     </li>
//                                     <li className={`sidebar-item ${isActive('appointments.index') ? 'active' : ''}`}>
//                                         <Link href={route('appointments.index')} className='sidebar-link'>
//                                             <i className="bi bi-grid-1x2-fill"></i>
//                                             <span>Manage Appointment</span>
//                                         </Link>
//                                     </li>
//                                     <li className={`sidebar-item ${isActive('doctor.manage.booking') ? 'active' : ''}`}>
//                                         <Link href={route('doctor.manage.booking')} className='sidebar-link'>
//                                             <i className="bi bi-grid-1x2-fill"></i>
//                                             <span>Manage Booking</span>
//                                         </Link>
//                                     </li>
//                                     <li className="sidebar-item">
//                                         <a 
//                                             href="#" 
//                                             className='sidebar-link'
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 handleLogout();
//                                             }}
//                                         >
//                                             <i className="bi bi-box-arrow-right"></i>
//                                             <span>Logout</span>
//                                         </a>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div id="main">
//                         <header className="mb-3">
//                             <a href="#" className="burger-btn d-block d-xl-none" onClick={toggleSidebar}>
//                                 <i className="bi bi-justify fs-3"></i>
//                             </a>
//                         </header>
//                         {header}

//                         <div className="page-content">
//                             {children}
//                         </div>

//                         <footer>
//                             <div className="footer clearfix mb-0 text-muted">
//                             <div className="float-start">
//                                 <p>2025 &copy; DOH</p>
//                             </div>
//                             <div className="float-end">
//                                 <p>
//                                 Crafted by
//                                 <a href="#"> Rusel Tayong</a>
//                                 </p>
//                             </div>
//                             </div>
//                         </footer>

//                     </div>
//                 </div>
//                 :
//                 null
//             }
//         </>
//     );
// }


{/* <li 
    className="sidebar-item has-sub"
    ref={el => sidebarItemsRef.current[0] = el}
>
    <a 
        href="#" 
        className='sidebar-link'
        onClick={(e) => {
            e.preventDefault();
            toggleSubmenu(0);
        }}
    >
    <i className="bi bi-stack"></i>
    <span>Components</span>
    </a>
    <ul 
        className={`submenu ${submenuStates[0] ? 'active' : ''}`}
        ref={el => submenuRefs.current[0] = el}
        style={{ display: submenuStates[0] ? 'block' : 'none' }}
    >
        <li className="submenu-item">
            <a href="component-alert.html">Alert</a>
        </li>
        <li className="submenu-item">
            <a href="component-badge.html">Badge</a>
        </li>
        <li className="submenu-item">
            <a href="component-breadcrumb.html">Breadcrumb</a>
        </li>
    </ul>
</li> */}
