import{r as s,K as g,j as e,$ as c,S as N}from"./app-Gh4GXqGQ.js";s.createContext();function E({header:h,children:x}){const{url:v}=g(),d=r=>v.startsWith(route(r,{},!1)),l=g().props.auth.user,[j,p]=s.useState(!1);s.useEffect(()=>{if(document.querySelectorAll("[data-dynamic_guest='true']").forEach(t=>t.remove()),document.querySelector("[data-dynamic='true']")){p(!0);return}const r=[{type:"css",href:"https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap"},{type:"css",href:"admin/assets/css/bootstrap.css"},{type:"css",href:"admin/assets/vendors/iconly/bold.css"},{type:"css",href:"admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.css"},{type:"css",href:"admin/assets/vendors/bootstrap-icons/bootstrap-icons.css"},{type:"css",href:"admin/assets/css/app.css"}],n=[{type:"js",src:"admin/assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js"},{type:"js",src:"admin/assets/js/bootstrap.bundle.min.js"},{type:"js",src:"admin/assets/vendors/apexcharts/apexcharts.js"}];r.forEach(({type:t,href:b,src:i})=>{if(t==="css"){const o=document.createElement("link");o.rel="stylesheet",o.href=b,o.dataset.dynamic="true",document.head.appendChild(o)}});const a=document.createElement("style");a.dataset.dynamic="true",a.textContent=`
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
        `,document.head.appendChild(a),Promise.all(n.map(({src:t})=>new Promise(b=>{const i=document.createElement("script");i.src=t,i.async=!0,i.dataset.dynamic="true",i.onload=b,document.body.appendChild(i)}))).then(()=>{p(!0)})},[]);const[u,m]=s.useState(!0),[w,S]=s.useState({}),y=s.useRef(null);s.useRef({}),s.useRef([]),s.useEffect(()=>{const r=()=>{window.innerWidth<1200?m(!1):m(!0)};r(),window.addEventListener("resize",r);const n=document.querySelector(".sidebar-item.active");if(n&&n.scrollIntoView(!1),typeof PerfectScrollbar=="function"){const a=document.querySelector(".sidebar-wrapper");a&&new PerfectScrollbar(a,{wheelPropagation:!1})}return()=>{window.removeEventListener("resize",r)}},[]);const f=()=>{m(!u)},k=()=>{N.post(route("logout"))};return e.jsx(e.Fragment,{children:j?e.jsxs("div",{id:"app",children:[e.jsx("div",{id:"sidebar",className:u?"active":"",ref:y,children:e.jsxs("div",{className:"sidebar-wrapper active",children:[e.jsx("div",{className:"sidebar-header",children:e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{className:"logo",style:{lineHeight:1.4},children:[e.jsx(c,{href:route("home"),style:{fontSize:"1.5rem",fontWeight:"700",color:"#006838",display:"block",textDecoration:"none"},children:l.name}),e.jsx("span",{style:{fontSize:"1.1rem",color:"#004025",fontWeight:"500",display:"block",marginTop:"0.2rem"},children:l.facility.name}),e.jsx("span",{style:{fontSize:"1rem",color:"#3c9f63",fontWeight:"400",display:"block",marginTop:"0.1rem"},children:l.specialization.name})]}),e.jsx("div",{className:"toggler",children:e.jsx("a",{href:"#",className:"sidebar-hide d-xl-none d-block",onClick:r=>{r.preventDefault(),f()},children:e.jsx("i",{className:"bi bi-x bi-middle"})})})]})}),e.jsx("div",{className:"sidebar-menu",style:{marginTop:"-20px"},children:e.jsxs("ul",{className:"menu",children:[e.jsx("li",{className:"sidebar-title",children:"Menu"}),e.jsx("li",{className:`sidebar-item ${d("dashboard")?"active":""}`,children:e.jsxs(c,{href:route("dashboard"),className:"sidebar-link",children:[e.jsx("i",{className:"bi bi-grid-fill"}),e.jsx("span",{children:"Dashboard"})]})}),e.jsx("li",{className:`sidebar-item ${d("appointments.index")?"active":""}`,children:e.jsxs(c,{href:route("appointments.index"),className:"sidebar-link",children:[e.jsx("i",{className:"bi bi-calendar-check-fill"}),e.jsx("span",{children:"Manage Appointment"})]})}),e.jsx("li",{className:`sidebar-item ${d("doctor.manage.booking")?"active":""}`,children:e.jsxs(c,{href:route("doctor.manage.booking"),className:"sidebar-link",children:[e.jsx("i",{className:"bi bi-journal-medical"}),e.jsx("span",{children:"Manage Booking"})]})}),e.jsx("li",{className:"sidebar-item",children:e.jsxs("a",{href:"#",className:"sidebar-link",onClick:r=>{r.preventDefault(),k()},children:[e.jsx("i",{className:"bi bi-box-arrow-right"}),e.jsx("span",{children:"Logout"})]})})]})})]})}),e.jsxs("div",{id:"main",children:[e.jsx("header",{className:"mb-3",children:e.jsx("a",{href:"#",className:"burger-btn d-block d-xl-none",onClick:f,children:e.jsx("i",{className:"bi bi-justify fs-3"})})}),h&&e.jsx("div",{className:"page-heading",children:e.jsx("div",{className:"page-title",children:e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-12",children:h})})})}),e.jsx("div",{className:"page-content",children:x}),e.jsx("footer",{children:e.jsxs("div",{className:"footer clearfix mb-0 text-muted",children:[e.jsx("div",{className:"float-start",children:e.jsx("p",{children:"2025 © DOH"})}),e.jsx("div",{className:"float-end",children:e.jsxs("p",{children:["Crafted by",e.jsx("a",{href:"#",children:" Rusel Tayong"})]})})]})})]})]}):e.jsxs("div",{className:"loading-container",style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",backgroundColor:"#f8fdf9"},children:[e.jsx("div",{className:"spinner",style:{width:"50px",height:"50px",border:"5px solid #e8f5e9",borderTop:"5px solid #006838",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `})]})})}export{E as A};
