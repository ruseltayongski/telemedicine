<!-- doctor_report.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Doctor Report</title>
    <style>
        @page { margin: 0; }
        :root {
            --dark-green: #004025;
            --medium-green: #006838;
            --light-green: #3c9f63;
        }
        
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--medium-green);
            background-color: #f3f9f5;
            padding: 20px;
            border-radius: 5px;
        }
        
        .header h1 {
            color: var(--dark-green);
            margin-bottom: 5px;
        }
        
        .header p {
            color: var(--medium-green);
            margin-top: 0;
        }
        
        .section {
            margin-bottom: 25px;
            padding: 0 5px;
        }
        
        .section-title {
            color: var(--dark-green);
            border-bottom: 1px solid var(--light-green);
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-weight: bold;
        }
        
        .stats-container {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -10px;
        }
        
        .stat-box {
            background-color: #f3f9f5;
            border: 1px solid #d7e6dd;
            border-left: 4px solid var(--medium-green);
            border-radius: 5px;
            padding: 15px;
            margin: 10px;
            width: 135px;
            box-sizing: border-box;
            text-align: center;
            float: left;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: var(--dark-green);
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: var(--medium-green);
            font-size: 12px;
            font-weight: 500;
        }
        
        .appointments-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .appointments-table th {
            background-color: var(--dark-green);
            padding: 12px 10px;
            text-align: left;
            font-weight: normal;
            color: white;
            font-size: 12px;
            text-transform: uppercase;
        }
        
        .appointments-table tr:nth-child(even) {
            background-color: #f3f9f5;
        }
        
        .appointments-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
        }
        
        .status {
            padding: 3px 8px;
            border-radius: 20px;
            font-size: 11px;
            background-color: #d7e6dd;
            color: var(--dark-green);
            display: inline-block;
        }
        
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        
        .chart {
            width: 100%;
            margin-top: 15px;
            background-color: #f9fdfb;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #e2e8f0;
        }
        
        .chart-container {
            width: 48%;
            float: left;
            margin-right: 2%;
            margin-bottom: 20px;
            background-color: #f9fdfb;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #e2e8f0;
        }
        
        .chart-container h3 {
            color: var(--medium-green);
            margin-top: 0;
            border-bottom: 1px solid #d7e6dd;
            padding-bottom: 10px;
            font-size: 16px;
        }
        
        .bar {
            height: 25px;
            background-color: var(--light-green);
            margin-bottom: 8px;
            border-radius: 3px;
        }
        
        .bar-label {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #555;
            margin-bottom: 2px;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: var(--medium-green);
            border-top: 1px solid #d7e6dd;
            padding-top: 20px;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 15px;
        }
        
        .logo-text {
            font-size: 22px;
            font-weight: bold;
            color: var(--dark-green);
            letter-spacing: 1px;
        }
        
        .summary-container {
            background-color: #f9fdfb;
            border: 1px solid #d7e6dd;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .summary-title {
            font-size: 16px;
            color: var(--dark-green);
            margin-top: 0;
            margin-bottom: 15px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #edf2f7;
            padding: 10px 0;
        }
        
        .summary-label {
            color: #64748b;
            font-size: 14px;
        }
        
        .summary-value {
            font-weight: bold;
            color: var(--medium-green);
        }

    </style>
</head>
<body>
    <div class="header">
        <h1>Doctor Performance Report</h1>
        <p>Dr. {{ $data['doctorName'] }} - {{ $data['doctorSpecialty'] }}</p>
        <p>Generated on: {{ date('F j, Y') }}</p>
    </div>
    
    <div class="section">
        <h2 class="section-title">Performance Summary</h2>
        <div class="stats-container clearfix">
            <div class="stat-box">
                <div class="stat-number">{{ $data['totalPatients'] }}</div>
                <div class="stat-label">Total Patients</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">{{ $data['newPatients'] }}</div>
                <div class="stat-label">New Patients</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">{{ $data['appointmentsToday'] }}</div>
                <div class="stat-label">Today's Appointments</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">{{ $data['completedAppointments'] }}</div>
                <div class="stat-label">Completed</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">Appointment Analytics</h2>
        <table width="100%" style="margin-bottom: 25px;">
            <tr>
                <td style="width: 50%; padding-right: 10px;">
                    <div style="
                        background-color: #f3f9f5;
                        border-radius: 5px;
                        padding: 15px;
                        text-align: center;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    ">
                        <div style="font-size: 28px; font-weight: bold; color: #2f855a; margin-bottom: 5px;">
                            {{ $data['appointmentsByType']['new'] }}
                        </div>
                        <div style="color: #38a169; font-size: 14px;">
                            New Consultations
                        </div>
                    </div>
                </td>
                <td style="width: 50%; padding-left: 10px;">
                    <div style="
                        background-color: #f3f9f5;
                        border-radius: 5px;
                        padding: 15px;
                        text-align: center;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    ">
                        <div style="font-size: 28px; font-weight: bold; color: #2f855a; margin-bottom: 5px;">
                            {{ $data['appointmentsByType']['followUp'] }}
                        </div>
                        <div style="color: #38a169; font-size: 14px;">
                            Follow-up Consultations
                        </div>
                    </div>
                </td>
            </tr>
        </table>        
        
        <div class="chart">
            <h3>Monthly Appointments (Last 12 Months)</h3>
            @php
                $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                $maxValue = max($data['appointmentsByMonth']);
            @endphp
            
            @foreach($data['appointmentsByMonth'] as $index => $value)
                <div class="bar-label">
                    <span>{{ $months[$index] }}</span>
                    <span>{{ $value }}</span>
                </div>
                <div class="bar" style="width: {{ ($value / $maxValue) * 100 }}%;"></div>
            @endforeach
        </div>
    </div>
    
    <div class="section clearfix">
        <h2 class="section-title">Patient Demographics</h2>
        
        <div class="chart-container">
            <h3>Age Distribution</h3>
            @php
                $maxAge = max($data['patientDemographics']['age']['data']);
            @endphp
            
            @foreach($data['patientDemographics']['age']['labels'] as $index => $label)
                <div class="bar-label">
                    <span>{{ $label }}</span>
                    <span>{{ $data['patientDemographics']['age']['data'][$index] }}</span>
                </div>
                <div class="bar" style="width: {{ ($data['patientDemographics']['age']['data'][$index] / $maxAge) * 100 }}%;"></div>
            @endforeach
        </div>
        
        <div class="chart-container">
            <h3>Gender Distribution</h3>
            @php
                $maxGender = max($data['patientDemographics']['gender']['data']);
            @endphp
            
            @foreach($data['patientDemographics']['gender']['labels'] as $index => $label)
                <div class="bar-label">
                    <span>{{ $label }}</span>
                    <span>{{ $data['patientDemographics']['gender']['data'][$index] }}</span>
                </div>
                <div class="bar" style="width: {{ ($data['patientDemographics']['gender']['data'][$index] / $maxGender) * 100 }}%;"></div>
            @endforeach
        </div>
    </div>
    
    <div class="page-break"></div>
    
    <div class="section">
        <h2 class="section-title">Today's Appointments</h2>
        <table class="appointments-table">
            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Type</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['upcomingAppointments'] as $appointment)
                <tr>
                    <td>{{ $appointment['patientName'] }}</td>
                    <td>{{ $appointment['patientAge'] }}</td>
                    <td>{{ $appointment['appointmentType'] }}</td>
                    <td>{{ $appointment['time'] }}</td>
                    <td>{{ $appointment['reason'] }}</td>
                    <td><span class="status">{{ ucfirst($appointment['status']) }}</span></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2 class="section-title">Additional Statistics</h2>
        
        <div class="summary-container">
            <h3 class="summary-title">Medical Workflow Statistics</h3>
            <div class="summary-row">
                <span class="summary-label">Total Prescriptions</span>
                <span class="summary-value">{{ $data['prescriptionStats']['total'] }}</span>
            </div>
            
            <div class="summary-row">
                <span class="summary-label">Prescriptions This Month</span>
                <span class="summary-value">{{ $data['prescriptionStats']['thisMonth'] }}</span>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>This report was automatically generated for Dr. {{ $data['doctorName'] }}.</p>
    </div>
</body>
</html>