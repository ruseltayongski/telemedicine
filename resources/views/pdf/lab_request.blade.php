<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laboratory Request</title>
    <style>
        @page { margin: 20px; }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 7.5pt;
            color: #212529;
            line-height: 1.5;
            margin: 0;
            padding: 10px;
        }
        .container {
            width: 100%;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .logo {
            width: 60px;
        }
        .clinic-name {
            font-size: 16pt;
            font-weight: bold;
            color: #006838;
        }
        .subtext {
            color: #6c757d;
            font-size: 10pt;
        }
        .rx-symbol {
            font-size: 30pt;
            color: #006838;
            font-weight: bold;
            float: right;
        }
        .section-title {
            font-weight: bold;
            background-color: #f1f1f1;
            padding: 5px;
            margin-bottom: 5px;
            border-left: 4px solid #006838;
            margin-top: 20px;
        }
        /* .info-box {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
            border-left: 4px solid #006838;
        } */
        .info-box {
            background-color: #f8f9fa;
            padding: 8px;
            border-radius: 3px;
            margin-bottom: 10px;
            border: 1px solid #dee2e6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        th {
            background-color: #006838;
            color: white;
            padding: 6px;
            text-align: left;
        }
        td {
            border: 1px solid #dee2e6;
            padding: 6px;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .signature-section {
            margin-top: 40px;
            text-align: right;
        }
        .signature-line {
            border-top: 1px solid #333;
            width: 180px;
            margin-bottom: 5px;
        }
        .footer {
            text-align: center;
            font-size: 8pt;
            color: #6c757d;
            margin-top: 40px;
        }

    </style>
</head>
<body>
    <div class="container">

        <!-- Header -->
        <div class="header">
            <img src="{{ public_path('assets/images/doh_logo.png') }}" class="logo" alt="DOH Logo">
            <div class="clinic-name">{{ $lab_request->doctor->facility->name }}</div>
            <div class="subtext">Laboratory Request Form</div>
        </div>

        {{-- <div class="rx-symbol">℞</div> --}}

        <!-- Patient Info -->
        <div class="section-title">Patient Information</div>
        <div class="info-box">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border: none;">
                <tr>
                    <td style="border: none;">
                        <p><strong>Name:</strong> {{ $lab_request->patient->name }}</p>
                        <p><strong>Age / Sex:</strong> {{ $lab_request->patient->age }} / {{ $lab_request->patient->sex }}</p>
                        <p><strong>Contact:</strong> {{ $lab_request->patient->contact }}</p>
                    </td>
                    <td style="text-align: right;border: none;">
                        <p><strong>Booking ID:</strong> {{ $lab_request->booking->booking_code }}</p>
                        <p><strong>Requested Date:</strong> {{ date('F d, Y', strtotime($lab_request->requested_date)) }}</p>
                        <p><strong>Scheduled Date:</strong> {{ date('F d, Y', strtotime($lab_request->scheduled_date)) }}</p>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Doctor Notes -->
        <div class="section-title">Doctor's Notes</div>
        <div class="info-box">
            {{ $lab_request->doctor_notes }}
        </div>

        <!-- Lab Test Table -->
        <div class="section-title">Tests Requested</div>
        <table>
            <thead>
                <tr>
                    <th>Name of Test</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Requires Fasting</th>
                </tr>
            </thead>
            <tbody>
                @foreach($lab_request->labTests as $lab_test)
                <tr>
                    <td>{{ $lab_test->name }}</td>
                    <td>{{ $lab_test->code }}</td>
                    <td>{{ $lab_test->category }}</td>
                    <td>{{ $lab_test->requires_fasting ? 'Yes' : 'No' }}</td>
                </tr>
                @endforeach
                {{-- <tr>
                    <td>Complete Blood Count</td>
                    <td>CBC001</td>
                    <td>Hematology</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Fasting Blood Sugar</td>
                    <td>FBS002</td>
                    <td>Biochemistry</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Urinalysis</td>
                    <td>UR003</td>
                    <td>Clinical Microscopy</td>
                    <td>No</td>
                </tr> --}}
            </tbody>
        </table>

        <!-- Result -->
        <div class="section-title">Result Summary</div>
        <div class="info-box">
            <p><strong>Updated At:</strong> N/A</p>
            <p><strong>Result:</strong> Test has been requested. Results are not yet available.</p>
            <p><strong>Result Comments:</strong> N/A</p>
            <p><strong>Is Abnormal:</strong> N/A</p>
        </div>

        <!-- Doctor Signature -->
        <div class="signature-section">
            <div class="signature-line"></div>
            <p><strong>{{ $lab_request->doctor->name }}, MD</strong></p>
            <p>License No. {{ $lab_request->doctor->license_no }}</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            This lab request was generated electronically on April 20, 2025.
        </div>
    </div>
</body>
</html>
