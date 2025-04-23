import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function DoctorDashboard({ doctorStats = {}, data }) {
    const defaultDoctorStats = data;
    // Provide default values for doctor stats
    // const defaultDoctorStats = {
    //     doctorName: "Dr. Robert Johnson",
    //     doctorSpecialty: "Cardiology",
    //     totalPatients: 248,
    //     newPatients: 12,
    //     appointmentsToday: 8,
    //     appointmentsTomorrow: 6,
    //     completedAppointments: 842,
    //     appointmentsByMonth: [65, 58, 70, 72, 75, 68, 80, 82, 78, 76, 72, 68],
    //     appointmentsByType: {
    //         new: 320,
    //         followUp: 522
    //     },
    //     patientDemographics: {
    //         age: {
    //             labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
    //             data: [42, 78, 65, 45, 18]
    //         },
    //         gender: {
    //             labels: ["Male", "Female", "Other"],
    //             data: [115, 130, 3]
    //         }
    //     },
    //     upcomingAppointments: [
    //         {
    //             patientName: "Jane Smith",
    //             patientAge: 42,
    //             appointmentType: "Follow-up",
    //             time: "09:00 AM",
    //             date: "2025-04-22",
    //             status: "confirmed",
    //             reason: "Hypertension follow-up",
    //             patientImg: "admin/assets/images/faces/5.jpg"
    //         },
    //         {
    //             patientName: "Thomas Anderson",
    //             patientAge: 35,
    //             appointmentType: "New",
    //             time: "10:30 AM",
    //             date: "2025-04-22",
    //             status: "confirmed",
    //             reason: "Chest pain evaluation",
    //             patientImg: "admin/assets/images/faces/1.jpg"
    //         },
    //         {
    //             patientName: "Emily Parker",
    //             patientAge: 56,
    //             appointmentType: "Follow-up",
    //             time: "11:45 AM",
    //             date: "2025-04-22",
    //             status: "confirmed",
    //             reason: "Medication review",
    //             patientImg: "admin/assets/images/faces/2.jpg"
    //         },
    //         {
    //             patientName: "Michael Brown",
    //             patientAge: 48,
    //             appointmentType: "Follow-up",
    //             time: "02:15 PM",
    //             date: "2025-04-22",
    //             status: "confirmed",
    //             reason: "Post-procedure checkup",
    //             patientImg: "admin/assets/images/faces/3.jpg"
    //         },
    //         {
    //             patientName: "Sarah Wilson",
    //             patientAge: 33,
    //             appointmentType: "New",
    //             time: "03:30 PM",
    //             date: "2025-04-22",
    //             status: "confirmed",
    //             reason: "Heart palpitations",
    //             patientImg: "admin/assets/images/faces/4.jpg"
    //         }
    //     ],
    //     referrals: {
    //         sent: 35,
    //         received: 22
    //     },
    //     prescriptionStats: {
    //         total: 785,
    //         thisMonth: 45
    //     },
    //     labRequestStats: {
    //         total: 420,
    //         pending: 12,
    //         completed: 408
    //     }
    // };

    // Merge provided stats with default stats
    const mergedDoctorStats = { ...defaultDoctorStats, ...doctorStats };
    
    // Define the theme color
    const themeColor = '#006838'; // Deep green theme color
    const secondaryColor = '#4CAF50'; // Lighter green for contrast
    const accentColor = '#8BC34A'; // Light green accent
    const darkText = '#004025'; // Darker shade for text
    const mediumText = '#006838'; // Main theme for headings
    const lightText = '#3c9f63'; // Lighter shade for subheadings
    
    const chartsRef = useRef({
        monthlyAppointmentsChart: null,
        appointmentTypesChart: null,
        patientAgeChart: null,
        patientGenderChart: null,
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
            colors: [themeColor], // Using the theme color
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            },
            theme: {
                mode: 'light',
                palette: 'palette1',
                monochrome: {
                    enabled: true,
                    color: themeColor,
                    shadeTo: 'light',
                    shadeIntensity: 0.65
                }
            }
        };
        
        // Appointment Types Chart
        const optionsAppointmentTypes = {
            series: [
                mergedDoctorStats.appointmentsByType.new,
                mergedDoctorStats.appointmentsByType.followUp
            ],
            labels: ['New Patients', 'Follow-ups'],
            colors: [themeColor, secondaryColor], // Theme color and secondary color
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
            colors: [themeColor], // Using the theme color
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
            colors: [themeColor, secondaryColor, accentColor], // Theme colors
            chart: {
                type: 'pie',
                width: '100%',
                height: '350px'
            },
            legend: {
                position: 'bottom'
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
    
                chartsRef.current.monthlyAppointmentsChart.render();
                chartsRef.current.appointmentTypesChart.render();
                chartsRef.current.patientAgeChart.render();
                chartsRef.current.patientGenderChart.render();
            }
        }, 100);

        return () => {
            Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
        };

    }, [mergedDoctorStats]);
    
    // Custom CSS styles
    const styles = {
        pageHeader: {
            color: darkText
        },
        cardHeader: {
            color: mediumText,
            borderBottom: `1px solid ${themeColor}20`
        },
        statTitle: {
            color: lightText
        },
        statValue: {
            color: darkText,
            fontWeight: 'bold'
        },
        tableHeader: {
            backgroundColor: `${themeColor}10`,
            color: darkText
        },
        patientName: {
            color: mediumText,
            fontWeight: '600'
        },
        sectionTitle: {
            color: darkText,
            borderLeft: `4px solid ${themeColor}`,
            paddingLeft: '10px'
        },
        chartContainer: {
            padding: '15px',
            backgroundColor: '#ffffff'
        }
    };

    const handleGenerateReport = () => {
        const url = route('doctor.report'); // Assuming `route()` is globally available, like via Ziggy
        window.open(url, '_blank');
      };
    
    return (
        <AuthenticatedLayout
            header={
                <div className="page-heading">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 style={styles.pageHeader}>Doctor Dashboard</h3>
                        <button onClick={handleGenerateReport} className="btn btn-primary" style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                            <i class="bi bi-file-earmark" style={{ marginRight: '5px',}}></i>
                            Generate Report
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Doctor Dashboard" />
            
            {/* Key Statistics Cards */}
            <section className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-6 col-lg-3 col-md-6">
                            <div className="card">
                                <div className="card-body px-3 py-4-5">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="stats-icon" style={{ backgroundColor: themeColor }}>
                                                <i className="iconly-boldProfile"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold" style={styles.statTitle}>Total Patients</h6>
                                            <h6 className="font-extrabold mb-0" style={styles.statValue}>{mergedDoctorStats.totalPatients}</h6>
                                            <p className="text-sm mb-0">
                                                <span style={{ color: secondaryColor, fontWeight: 'bold' }}>+{mergedDoctorStats.newPatients}</span> new this month
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
                                            <div className="stats-icon" style={{ backgroundColor: secondaryColor }}>
                                                <i className="iconly-boldCalendar"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold" style={styles.statTitle}>Today's Appointments</h6>
                                            <h6 className="font-extrabold mb-0" style={styles.statValue}>{mergedDoctorStats.appointmentsToday}</h6>
                                            <p className="text-sm mb-0">
                                                <span style={{ color: themeColor, fontWeight: 'bold' }}>{mergedDoctorStats.appointmentsTomorrow}</span> scheduled tomorrow
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
                                            <div className="stats-icon" style={{ backgroundColor: accentColor }}>
                                                <i className="iconly-boldTicket"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold" style={styles.statTitle}>Completed</h6>
                                            <h6 className="font-extrabold mb-0" style={styles.statValue}>{mergedDoctorStats.completedAppointments}</h6>
                                            <p className="text-sm mb-0" style={{ color: '#666' }}>
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
                                            <div className="stats-icon" style={{ backgroundColor: themeColor }}>
                                                <i className="iconly-boldDocument"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold" style={styles.statTitle}>Prescriptions</h6>
                                            <h6 className="font-extrabold mb-0" style={styles.statValue}>{mergedDoctorStats.prescriptionStats.total}</h6>
                                            <p className="text-sm mb-0">
                                                <span style={{ color: secondaryColor, fontWeight: 'bold' }}>{mergedDoctorStats.prescriptionStats.thisMonth}</span> this month
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
                        <div className="card-header d-flex justify-content-between" style={styles.cardHeader}>
                            <h4 style={{ color: darkText }}>Today's Appointments</h4>
                            <div>
                                <Link href={route('doctor.manage.booking')} className="btn btn-sm btn-outline-primary" style={{ borderColor: themeColor, color: themeColor }}>View All</Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead style={styles.tableHeader}>
                                    <tr>
                                        <th>Time</th>
                                        <th>Patient</th>
                                        <th>Age</th>
                                        <th>Type</th>
                                        <th>Reason</th>
                                        {/* <th>Actions</th> */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {mergedDoctorStats.upcomingAppointments.map((appointment, index) => (
                                        <tr key={index}>
                                            <td style={{ color: lightText, fontWeight: '500' }}>{appointment.time}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar avatar-sm">
                                                        <img src={appointment.patientImg} alt={appointment.patientName} />
                                                    </div>
                                                    <p className="font-bold ms-2 mb-0" style={styles.patientName}>{appointment.patientName}</p>
                                                </div>
                                            </td>
                                            <td>{appointment.patientAge}</td>
                                            <td>
                                                <span className={`badge`} 
                                                      style={{ 
                                                          backgroundColor: appointment.appointmentType === 'New' ? themeColor : secondaryColor,
                                                          color: 'white'
                                                      }}>
                                                    {appointment.appointmentType}
                                                </span>
                                            </td>
                                            <td style={{ color: '#555' }}>{appointment.reason}</td>
                                            {/* <td>
                                                <div className="btn-group">
                                                    <button className="btn btn-sm" style={{ backgroundColor: themeColor, color: 'white' }}>
                                                        <i className="bi bi-file-medical"></i>
                                                    </button>
                                                    <button className="btn btn-sm" style={{ backgroundColor: secondaryColor, color: 'white' }}>
                                                        <i className="bi bi-check-circle"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-secondary">
                                                        <i className="bi bi-clock"></i>
                                                    </button>
                                                </div>
                                            </td> */}
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
                                <div className="card-header" style={styles.cardHeader}>
                                    <h4 style={{ color: darkText }}>Monthly Appointments</h4>
                                </div>
                                <div className="card-body" style={styles.chartContainer}>
                                    <div id="chart-monthly-appointments"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header" style={styles.cardHeader}>
                                    <h4 style={{ color: darkText }}>Age Distribution</h4>
                                </div>
                                <div className="card-body" style={styles.chartContainer}>
                                    <div id="chart-patient-age"></div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>

                <div className="col-12 col-xl-4">

                    {/* Appointment Types Chart */}
                    <div className="card">
                        <div className="card-header" style={styles.cardHeader}>
                            <h4 style={{ color: darkText }}>Appointment Types</h4>
                        </div>
                        <div className="card-body" style={styles.chartContainer}>
                            <div id="chart-appointment-types"></div>
                        </div>
                    </div>
                    
                    
                    {/* Quick Stats */}
                    <div className="card">
                        <div className="card-header" style={styles.cardHeader}>
                            <h4 style={{ color: darkText }}>Medical Activities</h4>
                        </div>
                        <div className="card-content pb-4">
                            {/* <div className="px-4 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 style={{ color: mediumText }}>Referrals Sent</h6>
                                    <h5 className="font-bold" style={{ color: darkText }}>{mergedDoctorStats.referrals.sent}</h5>
                                </div>
                            </div>
                            <div className="px-4 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 style={{ color: mediumText }}>Referrals Received</h6>
                                    <h5 className="font-bold" style={{ color: darkText }}>{mergedDoctorStats.referrals.received}</h5>
                                </div>
                            </div> */}
                            <div className="px-4 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 style={{ color: mediumText }}>Lab Requests</h6>
                                    <h5 className="font-bold" style={{ color: darkText }}>{mergedDoctorStats.labRequestStats.total}</h5>
                                </div>
                                <div className="progress progress-sm mt-2">
                                    <div 
                                        className="progress-bar" 
                                        role="progressbar" 
                                        style={{ 
                                            width: `${(mergedDoctorStats.labRequestStats.completed / mergedDoctorStats.labRequestStats.total) * 100}%`,
                                            backgroundColor: themeColor 
                                        }}
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <small style={{ color: secondaryColor }}>{mergedDoctorStats.labRequestStats.completed} completed</small>
                                    <small style={{ color: '#888' }}>{mergedDoctorStats.labRequestStats.pending} pending</small>
                                </div>
                            </div>
                            {/* <div className="px-4 py-3 text-center">
                                <button className="btn btn-sm" style={{ backgroundColor: themeColor, color: 'white' }}>Generate Medical Report</button>
                            </div> */}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card">
                            <div className="card-header" style={styles.cardHeader}>
                                <h4 style={{ color: darkText }}>Gender Distribution</h4>
                            </div>
                            <div className="card-body" style={styles.chartContainer}>
                                <div id="chart-patient-gender"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </AuthenticatedLayout>
    );
}