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


        .custom-section-title {
            font-weight: bold;
            background-color: #f1f1f1;
            padding: 5px;
            margin-bottom: 5px;
            border-left: 4px solid #006838;
            margin-top: 20px;
        }

    </style>
</head>
<body>
    <div class="container">

        <!-- Header -->
        <div class="header">
            <img src="{{ public_path('assets/images/doh_logo.png') }}" class="logo" alt="DOH Logo">
            <div class="clinic-name">Cebu Doctors' University Hospital</div>
            <div class="subtext">Laboratory Request Form</div>
        </div>

        {{-- <div class="rx-symbol">℞</div> --}}

        <!-- Patient Info -->
        <div class="section-title">Patient Information</div>
        <div class="info-box">
            <p><strong>Name:</strong> Maria Santos</p>
            <p><strong>Age / Sex:</strong> 34 / Female</p>
            <p><strong>Contact:</strong> 0917-123-4567</p>
            <p><strong>Booking ID:</strong> BK123456789</p>
            <p><strong>Requested Date:</strong> April 15, 2025</p>
            <p><strong>Scheduled Date:</strong> April 20, 2025</p>
        </div>

        <!-- Doctor Notes -->
        <div class="section-title">Doctor's Notes</div>
        <div class="info-box">
            Please perform CBC, FBS, and Urinalysis. Patient must fast for 8 hours before blood tests.
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
                <tr>
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
                </tr>
            </tbody>
        </table>

        <!-- Result -->
        <div class="section-title">Result Summary</div>
        <div class="info-box">
            <p><strong>Updated At:</strong> April 20, 2025</p>
            <p><strong>Result:</strong> Test completed. Results indicate slightly elevated cholesterol.</p>
            <p><strong>Result Comments:</strong> Recommend low-fat diet and follow-up in 3 months.</p>
            <p><strong>Is Abnormal:</strong> Yes</p>
        </div>

        <!-- Doctor Signature -->
        <div class="signature-section">
            <div class="signature-line"></div>
            <p><strong>Dr. Juan Dela Cruz</strong></p>
            <p>License No. 1234567</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            This lab request was generated electronically on April 20, 2025.
        </div>
    </div>
</body>
</html>
