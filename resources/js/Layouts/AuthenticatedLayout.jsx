import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const chartsRef = useRef({
        profileVisit: null,
        visitorsProfile: null,
        europe: null,
        america: null,
        indonesia: null,
    });
    useEffect(() => {
        const assetsToLoad = [
            { type: "css", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swapp" },
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
            var optionsProfileVisit = {
                annotations: {
                    position: 'back'
                },
                dataLabels: {
                    enabled:false
                },
                chart: {
                    type: 'bar',
                    height: 300
                },
                fill: {
                    opacity:1
                },
                plotOptions: {
                },
                series: [{
                    name: 'sales',
                    data: [9,20,30,20,10,20,30,20,10,20,30,20]
                }],
                colors: '#435ebe',
                xaxis: {
                    categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul", "Aug","Sep","Oct","Nov","Dec"],
                },
            }
            let optionsVisitorsProfile  = {
                series: [70, 30],
                labels: ['Male', 'Female'],
                colors: ['#435ebe','#55c6e8'],
                chart: {
                    type: 'donut',
                    width: '100%',
                    height:'350px'
                },
                legend: {
                    position: 'bottom'
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '30%'
                        }
                    }
                }
            }
            
            var optionsEurope = {
                series: [{
                    name: 'series1',
                    data: [310, 800, 600, 430, 540, 340, 605, 805,430, 540, 340, 605]
                }],
                chart: {
                    height: 80,
                    type: 'area',
                    toolbar: {
                        show:false,
                    },
                },
                colors: ['#5350e9'],
                stroke: {
                    width: 2,
                },
                grid: {
                    show:false,
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z","2018-09-19T07:30:00.000Z","2018-09-19T08:30:00.000Z","2018-09-19T09:30:00.000Z","2018-09-19T10:30:00.000Z","2018-09-19T11:30:00.000Z"],
                    axisBorder: {
                        show:false
                    },
                    axisTicks: {
                        show:false
                    },
                    labels: {
                        show:false,
                    }
                },
                show:false,
                yaxis: {
                    labels: {
                        show:false,
                    },
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            };
            
            let optionsAmerica = {
                ...optionsEurope,
                colors: ['#008b75'],
            }
            let optionsIndonesia = {
                ...optionsEurope,
                colors: ['#dc3545'],
            }

            setScriptsLoaded(true); // Mark scripts as loaded

            setTimeout(() => {
                if (!chartsRef.current.profileVisit) {
                    chartsRef.current.profileVisit = new ApexCharts(document.querySelector("#chart-profile-visit"), optionsProfileVisit);
                    chartsRef.current.visitorsProfile = new ApexCharts(document.querySelector("#chart-visitors-profile"), optionsVisitorsProfile);
                    chartsRef.current.europe = new ApexCharts(document.querySelector("#chart-europe"), optionsEurope);
                    chartsRef.current.america = new ApexCharts(document.querySelector("#chart-america"), optionsAmerica);
                    chartsRef.current.indonesia = new ApexCharts(document.querySelector("#chart-indonesia"), optionsIndonesia);
        
                    chartsRef.current.profileVisit.render();
                    chartsRef.current.visitorsProfile.render();
                    chartsRef.current.europe.render();
                    chartsRef.current.america.render();
                    chartsRef.current.indonesia.render();
                }
            }, 100);

            return () => {
                // chartIndonesia.destroy();
                // chartAmerica.destroy();
                // chartEurope.destroy();
                // chartProfileVisit.destroy();
                // chartVisitorsProfile.destroy();
                Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
            };
        });
    
        return () => {
            // Remove previously loaded assets to prevent conflictsasd
            document.querySelectorAll("[data-dynamic='true']").forEach((el) => el.remove());
        };

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
                scriptsLoaded ?
                <div id="app">
                    <div id="sidebar" className={isSidebarActive ? "active" : ""} ref={sidebarRef}>
                        <div className="sidebar-wrapper active">
                            <div className="sidebar-header">
                                <div className="d-flex justify-content-between">
                                <div className="logo">
                                    <a href="index.html">
                                        <img src="admin/assets/images/logo/logo.png" alt="Logo" />
                                    </a>
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
                            <div className='sidebar-menu'>
                                <ul className='menu'>
                                    <li className="sidebar-title">Menu</li>
                                    <li className="sidebar-item active">
                                        <a href="index.html" className='sidebar-link'>
                                        <i className="bi bi-grid-fill"></i>
                                        <span>Dashboard</span>
                                        </a>
                                    </li>
                                    <li 
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
                                            <li className="submenu-item">
                                                <a href="component-button.html">Button</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-card.html">Card</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-carousel.html">Carousel</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-dropdown.html">Dropdown</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-list-group.html">List Group</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-modal.html">Modal</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-navs.html">Navs</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-pagination.html">Pagination</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-progress.html">Progress</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-spinner.html">Spinner</a>
                                            </li>
                                            <li className="submenu-item">
                                                <a href="component-tooltip.html">Tooltip</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="sidebar-item  ">
                                        <a href="table.html" className='sidebar-link'>
                                            <i className="bi bi-grid-1x2-fill"></i>
                                            <span>Table</span>
                                        </a>
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

                        <div className="page-heading">
                            <h3>Profile Statistics</h3>
                        </div>
                        
                        <div className="page-content">
                            <section className="row">
                                <div className="col-12 col-lg-9">
                                    <div className="row">
                                        <div className="col-6 col-lg-3 col-md-6">
                                            <div className="card">
                                                <div className="card-body px-3 py-4-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="stats-icon purple">
                                                                <i className="iconly-boldShow"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <h6 className="text-muted font-semibold">Profile Views</h6>
                                                            <h6 className="font-extrabold mb-0">112,000</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-lg-3 col-md-6">
                                            <div className="card">
                                                <div className="card-body px-3 py-4-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="stats-icon blue">
                                                                <i className="iconly-boldProfile"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <h6 className="text-muted font-semibold">Followers</h6>
                                                            <h6 className="font-extrabold mb-0">183,000</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-lg-3 col-md-6">
                                            <div className="card">
                                                <div className="card-body px-3 py-4-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="stats-icon green">
                                                                <i className="iconly-boldAdd-User"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <h6 className="text-muted font-semibold">Following</h6>
                                                            <h6 className="font-extrabold mb-0">80,000</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-lg-3 col-md-6">
                                            <div className="card">
                                                <div className="card-body px-3 py-4-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="stats-icon red">
                                                                <i className="iconly-boldBookmark"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <h6 className="text-muted font-semibold">Saved Post</h6>
                                                            <h6 className="font-extrabold mb-0">112</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h4>Profile Visit</h4>
                                                </div>
                                                <div className="card-body">
                                                    <div id="chart-profile-visit"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-xl-4">
                                            <div className="card">
                                            <div className="card-header">
                                                <h4>Profile Visit</h4>
                                            </div>
                                            <div className="card-body">
                                                {[
                                                { region: "Europe", visits: 862, chartId: "chart-europe", color: "text-primary" },
                                                { region: "America", visits: 375, chartId: "chart-america", color: "text-success" },
                                                { region: "Indonesia", visits: 1025, chartId: "chart-indonesia", color: "text-danger" }
                                                ].map((item, index) => (
                                                <div className="row" key={index}>
                                                    <div className="col-6">
                                                    <div className="d-flex align-items-center">
                                                        <svg className={`bi ${item.color}`} width="32" height="32" fill="blue" style={{ width: "10px" }}>
                                                        <use xlinkHref="admin/assets/vendors/bootstrap-icons/bootstrap-icons.svg#circle-fill" />
                                                        </svg>
                                                        <h5 className="mb-0 ms-3">{item.region}</h5>
                                                    </div>
                                                    </div>
                                                    <div className="col-6">
                                                    <h5 className="mb-0">{item.visits}</h5>
                                                    </div>
                                                    <div className="col-12">
                                                    <div id={item.chartId}></div>
                                                    </div>
                                                </div>
                                                ))}
                                            </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-xl-8">
                                            <div className="card">
                                            <div className="card-header">
                                                <h4>Latest Comments</h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                <table className="table table-hover table-lg">
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Comment</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {[
                                                        { name: "Si Cantik", comment: "Congratulations on your graduation!", img: "admin/assets/images/faces/5.jpg" },
                                                        { name: "Si Ganteng", comment: "Wow amazing design! Can you make another tutorial for this design?", img: "admin/assets/images/faces/2.jpg" }
                                                    ].map((user, index) => (
                                                        <tr key={index}>
                                                        <td className="col-3">
                                                            <div className="d-flex align-items-center">
                                                            <div className="avatar avatar-md">
                                                                <img src={user.img} alt={user.name} />
                                                            </div>
                                                            <p className="font-bold ms-3 mb-0">{user.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="col-auto">
                                                            <p className="mb-0">{user.comment}</p>
                                                        </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-3">
                                    <div className="card">
                                        <div className="card-body py-4 px-5">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar avatar-xl">
                                                    <img src="admin/assets/images/faces/1.jpg" alt="Face 1" />
                                                </div>
                                                <div className="ms-3 name">
                                                    <h5 className="font-bold">John Duck</h5>
                                                    <h6 className="text-muted mb-0">@johnducky</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header">
                                            <h4>Recent Messages</h4>
                                        </div>
                                        <div className="card-content pb-4">
                                            <div className="recent-message d-flex px-4 py-3">
                                                <div className="avatar avatar-lg">
                                                <img src="admin/assets/images/faces/4.jpg" alt="Hank Schrader" />
                                                </div>
                                                <div className="name ms-4">
                                                <h5 className="mb-1">Hank Schrader</h5>
                                                <h6 className="text-muted mb-0">@johnducky</h6>
                                                </div>
                                            </div>
                                            <div className="recent-message d-flex px-4 py-3">
                                                <div className="avatar avatar-lg">
                                                <img src="admin/assets/images/faces/5.jpg" alt="Dean Winchester" />
                                                </div>
                                                <div className="name ms-4">
                                                <h5 className="mb-1">Dean Winchester</h5>
                                                <h6 className="text-muted mb-0">@imdean</h6>
                                                </div>
                                            </div>
                                            <div className="recent-message d-flex px-4 py-3">
                                                <div className="avatar avatar-lg">
                                                <img src="admin/assets/images/faces/1.jpg" alt="John Dodol" />
                                                </div>
                                                <div className="name ms-4">
                                                <h5 className="mb-1">John Dodol</h5>
                                                <h6 className="text-muted mb-0">@dodoljohn</h6>
                                                </div>
                                            </div>
                                            <div className="px-4">
                                                <button className="btn btn-block btn-xl btn-light-primary font-bold mt-3">
                                                Start Conversation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header">
                                            <h4>Visitors Profile</h4>
                                        </div>
                                        <div className="card-body">
                                            <div id="chart-visitors-profile"></div>
                                        </div>
                                    </div>

                                </div>
                            </section>
                        </div>

                        <footer>
                            <div className="footer clearfix mb-0 text-muted">
                            <div className="float-start">
                                <p>2021 &copy; Mazer</p>
                            </div>
                            <div className="float-end">
                                <p>
                                Crafted with <span className="text-danger"><i className="bi bi-heart"></i></span> by
                                <a href="http://ahmadsaugi.com"> A. Saugi</a>
                                </p>
                            </div>
                            </div>
                        </footer>

                    </div>
                </div>
                :
                null
            }
        </>
    );
}
