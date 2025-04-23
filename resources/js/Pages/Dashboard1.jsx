import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function DoctorDashboard({ doctorStats = {} }) {
    // Provide default values for doctor stats
    const defaultDoctorStats = {
        doctorName: "Dr. Robert Johnson",
        doctorSpecialty: "Cardiology",
        totalPatients: 248,
        newPatients: 12,
        appointmentsToday: 8,
        appointmentsTomorrow: 6,
        completedAppointments: 842,
        averageRating: 4.8,
        totalReviews: 156,
        upcomingLeave: {
            start: "2025-05-15",
            end: "2025-05-18",
            reason: "Conference"
        },
        recentReviews: [
            {
                patientName: "Jane Smith",
                rating: 5,
                comment: "Dr. Johnson is very thorough and takes time to explain everything.",
                date: "2025-04-18",
                patientImg: "admin/assets/images/faces/5.jpg"
            },
            {
                patientName: "Michael Brown",
                rating: 4,
                comment: "Great doctor, but had to wait a bit longer than expected.",
                date: "2025-04-16",
                patientImg: "admin/assets/images/faces/3.jpg"
            },
            {
                patientName: "Sarah Wilson",
                rating: 5,
                comment: "Excellent care and follow-up. Highly recommended!",
                date: "2025-04-12",
                patientImg: "admin/assets/images/faces/4.jpg"
            }
        ],
        appointmentsByMonth: [65, 58, 70, 72, 75, 68, 80, 82, 78, 76, 72, 68],
        appointmentsByType: {
            new: 320,
            followUp: 522
        },
        patientDemographics: {
            age: {
                labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
                data: [42, 78, 65, 45, 18]
            },
            gender: {
                labels: ["Male", "Female", "Other"],
                data: [115, 130, 3]
            }
        },
        upcomingAppointments: [
            {
                patientName: "Jane Smith",
                patientAge: 42,
                appointmentType: "Follow-up",
                time: "09:00 AM",
                date: "2025-04-22",
                status: "confirmed",
                reason: "Hypertension follow-up",
                patientImg: "admin/assets/images/faces/5.jpg"
            },
            {
                patientName: "Thomas Anderson",
                patientAge: 35,
                appointmentType: "New",
                time: "10:30 AM",
                date: "2025-04-22",
                status: "confirmed",
                reason: "Chest pain evaluation",
                patientImg: "admin/assets/images/faces/1.jpg"
            },
            {
                patientName: "Emily Parker",
                patientAge: 56,
                appointmentType: "Follow-up",
                time: "11:45 AM",
                date: "2025-04-22",
                status: "confirmed",
                reason: "Medication review",
                patientImg: "admin/assets/images/faces/2.jpg"
            },
            {
                patientName: "Michael Brown",
                patientAge: 48,
                appointmentType: "Follow-up",
                time: "02:15 PM",
                date: "2025-04-22",
                status: "confirmed",
                reason: "Post-procedure checkup",
                patientImg: "admin/assets/images/faces/3.jpg"
            },
            {
                patientName: "Sarah Wilson",
                patientAge: 33,
                appointmentType: "New",
                time: "03:30 PM",
                date: "2025-04-22",
                status: "confirmed",
                reason: "Heart palpitations",
                patientImg: "admin/assets/images/faces/4.jpg"
            }
        ],
        referrals: {
            sent: 35,
            received: 22
        },
        prescriptionStats: {
            total: 785,
            thisMonth: 45
        },
        labRequestStats: {
            total: 420,
            pending: 12,
            completed: 408
        }
    };

    // Merge provided stats with default stats
    const mergedDoctorStats = { ...defaultDoctorStats, ...doctorStats };
    
    const chartsRef = useRef({
        monthlyAppointmentsChart: null,
        appointmentTypesChart: null,
        patientAgeChart: null,
        patientGenderChart: null,
        ratingChart: null
    });

    useEffect(() => {
        // Monthly Appointments Chart
        const optionsMonthlyAppointments = {
            annotations: {
                position: 'back'
            },
            dataLabels: {
                enabled: false
            },
            chart: {
                type: 'line',
                height: 300
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            grid: {
                padding: {
                    right: 30,
                    left: 20
                }
            },
            series: [{
                name: 'Appointments',
                data: mergedDoctorStats.appointmentsByMonth
            }],
            colors: ['#435ebe'],
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            },
        };
        
        // Appointment Types Chart
        const optionsAppointmentTypes = {
            series: [
                mergedDoctorStats.appointmentsByType.new,
                mergedDoctorStats.appointmentsByType.followUp
            ],
            labels: ['New Patients', 'Follow-ups'],
            colors: ['#435ebe', '#55c6e8'],
            chart: {
                type: 'donut',
                width: '100%',
                height: '350px'
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
        };
        
        // Patient Age Demographics Chart
        const optionsPatientAge = {
            series: [{
                name: "Patients",
                data: mergedDoctorStats.patientDemographics.age.data
            }],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                }
            },
            colors: ['#435ebe'],
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: mergedDoctorStats.patientDemographics.age.labels,
            }
        };

        // Patient Gender Chart
        const optionsPatientGender = {
            series: mergedDoctorStats.patientDemographics.gender.data,
            labels: mergedDoctorStats.patientDemographics.gender.labels,
            colors: ['#435ebe', '#55c6e8', '#ffc107'],
            chart: {
                type: 'pie',
                width: '100%',
                height: '350px'
            },
            legend: {
                position: 'bottom'
            }
        };
        
        // Rating Chart
        const optionsRatingChart = {
            series: [{
                name: "Rating",
                data: [mergedDoctorStats.averageRating]
            }],
            chart: {
                height: 150,
                type: 'bar',
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "/5";
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            colors: ['#198754'],
            xaxis: {
                categories: ["Average Rating"],
                position: 'bottom',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                tooltip: {
                    enabled: false,
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                },
                max: 5
            }
        };

        setTimeout(() => {
            if (!chartsRef.current.monthlyAppointmentsChart) {
                chartsRef.current.monthlyAppointmentsChart = new ApexCharts(
                    document.querySelector("#chart-monthly-appointments"), 
                    optionsMonthlyAppointments
                );
                chartsRef.current.appointmentTypesChart = new ApexCharts(
                    document.querySelector("#chart-appointment-types"), 
                    optionsAppointmentTypes
                );
                chartsRef.current.patientAgeChart = new ApexCharts(
                    document.querySelector("#chart-patient-age"), 
                    optionsPatientAge
                );
                chartsRef.current.patientGenderChart = new ApexCharts(
                    document.querySelector("#chart-patient-gender"), 
                    optionsPatientGender
                );
                chartsRef.current.ratingChart = new ApexCharts(
                    document.querySelector("#chart-rating"), 
                    optionsRatingChart
                );
    
                chartsRef.current.monthlyAppointmentsChart.render();
                chartsRef.current.appointmentTypesChart.render();
                chartsRef.current.patientAgeChart.render();
                chartsRef.current.patientGenderChart.render();
                chartsRef.current.ratingChart.render();
            }
        }, 100);

        return () => {
            Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
        };

    }, [mergedDoctorStats]);
    
    const renderStars = (rating) => {
        const stars = [];
        for(let i = 1; i <= 5; i++) {
            if(i <= rating) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
            } else if(i - 0.5 <= rating) {
                stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-warning"></i>);
            }
        }
        return stars;
    };
    
    return (
        <AuthenticatedLayout
            header={
                <div className="page-heading">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>Doctor Dashboard</h3>
                        <button className="btn btn-primary">
                            <i className="bi bi-calendar-plus me-2"></i>
                            Add Appointment
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Doctor Dashboard" />
            
            {/* Doctor Profile and Status */}
            <section className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body py-4 px-5">
                            <div className="d-flex align-items-center">
                                <div className="avatar avatar-xl">
                                    <img src="admin/assets/images/faces/2.jpg" alt="Doctor" />
                                </div>
                                <div className="ms-3 name">
                                    <h2 className="font-bold">{mergedDoctorStats.doctorName}</h2>
                                    <h5 className="text-muted mb-0">{mergedDoctorStats.doctorSpecialty}</h5>
                                </div>
                                <div className="ms-auto text-end">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="me-3">
                                            {renderStars(mergedDoctorStats.averageRating)}
                                        </div>
                                        <h5 className="mb-0">{mergedDoctorStats.averageRating}/5 ({mergedDoctorStats.totalReviews} reviews)</h5>
                                    </div>
                                    {mergedDoctorStats.upcomingLeave && (
                                        <div className="badge bg-light-warning p-2">
                                            <i className="bi bi-calendar-x me-1"></i>
                                            Leave Scheduled: {mergedDoctorStats.upcomingLeave.start} to {mergedDoctorStats.upcomingLeave.end}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Key Statistics Cards */}
            <section className="row">
                <div className="col-12">
                    <div className="row">
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
                                            <h6 className="text-muted font-semibold">Total Patients</h6>
                                            <h6 className="font-extrabold mb-0">{mergedDoctorStats.totalPatients}</h6>
                                            <p className="text-muted text-sm mb-0">
                                                <span className="text-success">+{mergedDoctorStats.newPatients}</span> new this month
                                            </p>
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
                                            <div className="stats-icon purple">
                                                <i className="iconly-boldCalendar"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold">Today's Appointments</h6>
                                            <h6 className="font-extrabold mb-0">{mergedDoctorStats.appointmentsToday}</h6>
                                            <p className="text-muted text-sm mb-0">
                                                <span className="text-info">{mergedDoctorStats.appointmentsTomorrow}</span> scheduled tomorrow
                                            </p>
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
                                                <i className="iconly-boldTicket"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold">Completed</h6>
                                            <h6 className="font-extrabold mb-0">{mergedDoctorStats.completedAppointments}</h6>
                                            <p className="text-muted text-sm mb-0">
                                                Total completed appointments
                                            </p>
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
                                                <i className="iconly-boldDocument"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold">Prescriptions</h6>
                                            <h6 className="font-extrabold mb-0">{mergedDoctorStats.prescriptionStats.total}</h6>
                                            <p className="text-muted text-sm mb-0">
                                                <span className="text-primary">{mergedDoctorStats.prescriptionStats.thisMonth}</span> this month
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts and Tables */}
            <section className="row">
                <div className="col-12 col-xl-8">
                    {/* Today's Appointments Table */}
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <h4>Today's Appointments</h4>
                            <div>
                                <button className="btn btn-sm btn-outline-primary">View All</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Patient</th>
                                        <th>Age</th>
                                        <th>Type</th>
                                        <th>Reason</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {mergedDoctorStats.upcomingAppointments.map((appointment, index) => (
                                        <tr key={index}>
                                            <td>{appointment.time}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar avatar-sm">
                                                        <img src={appointment.patientImg} alt={appointment.patientName} />
                                                    </div>
                                                    <p className="font-bold ms-2 mb-0">{appointment.patientName}</p>
                                                </div>
                                            </td>
                                            <td>{appointment.patientAge}</td>
                                            <td>
                                                <span className={`badge bg-${appointment.appointmentType === 'New' ? 'primary' : 'info'}`}>
                                                    {appointment.appointmentType}
                                                </span>
                                            </td>
                                            <td>{appointment.reason}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-primary">
                                                        <i className="bi bi-file-medical"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-success">
                                                        <i className="bi bi-check-circle"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-secondary">
                                                        <i className="bi bi-clock"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="row">
                        <div className="col-12">
                            {/* Monthly Appointments Chart */}
                            <div className="card">
                                <div className="card-header">
                                    <h4>Monthly Appointments</h4>
                                </div>
                                <div className="card-body">
                                    <div id="chart-monthly-appointments"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Demographics Charts */}
                    <div className="row">
                        <div className="col-12 col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4>Age Distribution</h4>
                                </div>
                                <div className="card-body">
                                    <div id="chart-patient-age"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4>Gender Distribution</h4>
                                </div>
                                <div className="card-body">
                                    <div id="chart-patient-gender"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    {/* Rating Chart Card */}
                    <div className="card">
                        <div className="card-header">
                            <h4>Rating</h4>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center">
                            <div id="chart-rating" className="w-100"></div>
                            <p className="text-center mt-2">Based on {mergedDoctorStats.totalReviews} patient reviews</p>
                        </div>
                    </div>

                    {/* Appointment Types Chart */}
                    <div className="card">
                        <div className="card-header">
                            <h4>Appointment Types</h4>
                        </div>
                        <div className="card-body">
                            <div id="chart-appointment-types"></div>
                        </div>
                    </div>
                    
                    {/* Recent Patient Reviews */}
                    <div className="card">
                        <div className="card-header">
                            <h4>Recent Reviews</h4>
                        </div>
                        <div className="card-content pb-4">
                            {mergedDoctorStats.recentReviews.map((review, index) => (
                                <div key={index} className="px-4 py-3 border-bottom">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="avatar avatar-sm me-2">
                                            <img src={review.patientImg} alt={review.patientName} />
                                        </div>
                                        <div>
                                            <h6 className="mb-0">{review.patientName}</h6>
                                            <p className="text-muted text-sm mb-0">{review.date}</p>
                                        </div>
                                        <div className="ms-auto">
                                            <div className="d-flex">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">{review.comment}</p>
                                </div>
                            ))}
                            <div className="px-4 py-3 text-center">
                                <button className="btn btn-sm btn-outline-primary">View All Reviews</button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="card">
                        <div className="card-header">
                            <h4>Medical Activities</h4>
                        </div>
                        <div className="card-content pb-4">
                            <div className="px-4 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="text-muted">Referrals Sent</h6>
                                    <h5 className="font-bold">{mergedDoctorStats.referrals.sent}</h5>
                                </div>
                            </div>
                            <div className="px-4 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="text-muted">Referrals Received</h6>
                                    <h5 className="font-bold">{mergedDoctorStats.referrals.received}</h5>
                                </div>
                            </div>
                            <div className="px-4 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="text-muted">Lab Requests</h6>
                                    <h5 className="font-bold">{mergedDoctorStats.labRequestStats.total}</h5>
                                </div>
                                <div className="progress progress-sm mt-2">
                                    <div 
                                        className="progress-bar bg-success" 
                                        role="progressbar" 
                                        style={{ width: `${(mergedDoctorStats.labRequestStats.completed / mergedDoctorStats.labRequestStats.total) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <small>{mergedDoctorStats.labRequestStats.completed} completed</small>
                                    <small>{mergedDoctorStats.labRequestStats.pending} pending</small>
                                </div>
                            </div>
                            <div className="px-4 py-3 text-center">
                                <button className="btn btn-sm btn-primary">Generate Medical Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}