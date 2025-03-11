import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Dashboard() {
    const chartsRef = useRef({
        profileVisit: null,
        visitorsProfile: null,
        europe: null,
        america: null,
        indonesia: null,
    });

    useEffect(() => {
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
            Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
        };

    }, []);
    return (
        <AuthenticatedLayout
            header={
                <div className="page-heading">
                    <h3>Profile Statistics</h3>
                </div>
            }
        >
            <Head title="Dashboard" />
            
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
            
        </AuthenticatedLayout>
    );
}
