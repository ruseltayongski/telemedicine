<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laboratory Request</title>
    <style>
        @page { margin: 20px; }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 9pt;
            color: #212529;
            line-height: 1.3;
            margin: 0;
            padding: 10px;
        }
        .container {
            width: 100%;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #006838;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .logo {
            width: 60px;
            height: auto;
            display: inline-block;
            vertical-align: middle;
        }
        .header-text {
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
        }
        .clinic-name {
            font-size: 14pt;
            font-weight: bold;
            color: #006838;
        }
        .subtext {
            color: #555555;
            font-size: 10pt;
        }
        .form-id {
            float: right;
            text-align: right;
            font-size: 8pt;
            color: #555555;
        }
        .clearfix:after {
            content: "";
            display: table;
            clear: both;
        }
        .section-title {
            font-weight: bold;
            background-color: #f1f1f1;
            padding: 5px;
            margin-bottom: 5px;
            border-left: 4px solid #006838;
            margin-top: 15px;
        }
        .info-box {
            background-color: #f8f9fa;
            padding: 8px;
            border-radius: 3px;
            margin-bottom: 10px;
            border: 1px solid #dee2e6;
        }
        .info-row {
            margin-bottom: 5px;
        }
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 100px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th {
            background-color: #006838;
            color: white;
            padding: 6px;
            text-align: left;
            font-size: 8pt;
        }
        td {
            border: 1px solid #dee2e6;
            padding: 5px;
            font-size: 8pt;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .instructions-box {
            border: 1px solid #dee2e6;
            padding: 8px;
            margin: 10px 0;
            background-color: #f9f9f9;
        }
        .instructions-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .instructions-list {
            margin: 0;
            padding-left: 20px;
            font-size: 8pt;
        }
        .signature-section {
            margin-top: 30px;
        }
        .signature-block {
            display: inline-block;
            width: 45%;
            vertical-align: top;
        }
        .signature-line {
            border-top: 1px solid #333;
            width: 80%;
            margin-bottom: 5px;
        }
        .signature-name {
            font-weight: bold;
            font-size: 8pt;
        }
        .signature-title {
            font-size: 7pt;
            color: #555555;
        }
        .footer {
            text-align: center;
            font-size: 7pt;
            color: #6c757d;
            margin-top: 30px;
            border-top: 1px dotted #dee2e6;
            padding-top: 10px;
        }
        .status-label {
            display: inline-block;
            padding: 2px 5px;
            font-size: 7pt;
            font-weight: bold;
        }
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-completed {
            background-color: #d4edda;
            color: #155724;
        }
        .form-date {
            text-align: right;
            font-size: 7pt;
            margin-bottom: 5px;
            font-style: italic;
        }
        .barcode-area {
            text-align: center;
            margin: 15px 0;
            padding: 5px;
            border: 1px dashed #ccc;
        }
        .barcode-text {
            font-size: 7pt;
            color: #555555;
        }
        .column-left {
            float: left;
            width: 48%;
        }
        .column-right {
            float: right;
            width: 48%;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Form Date -->
        <div class="form-date">Generated: April 20, 2025</div>
        
        <!-- Header -->
        <div class="header clearfix">
            <img src="{{ public_path('assets/images/hospital_logo.png') }}" class="logo" alt="Hospital Logo">
            <div class="header-text">
                <div class="clinic-name">Cebu Doctors' University Hospital</div>
                <div class="subtext">Laboratory Request Form</div>
            </div>
            <div class="form-id">
                <strong>Request ID:</strong> LRF-20250420-001
            </div>
        </div>

        <div class="clearfix">
            <!-- Patient Info -->
            <div class="column-left">
                <div class="section-title">Patient Information</div>
                <div class="info-box">
                    <div class="info-row">
                        <span class="info-label">Name:</span> Maria Santos
                    </div>
                    <div class="info-row">
                        <span class="info-label">Patient ID:</span> P-20250415-789
                    </div>
                    <div class="info-row">
                        <span class="info-label">Age/Sex:</span> 34 / Female
                    </div>
                    <div class="info-row">
                        <span class="info-label">Contact:</span> 0917-123-4567
                    </div>
                    <div class="info-row">
                        <span class="info-label">Booking ID:</span> BK123456789
                    </div>
                </div>
            </div>

            <!-- Request Info -->
            <div class="column-right">
                <div class="section-title">Request Details</div>
                <div class="info-box">
                    <div class="info-row">
                        <span class="info-label">Requested:</span> April 15, 2025
                    </div>
                    <div class="info-row">
                        <span class="info-label">Scheduled:</span> April 20, 2025
                    </div>
                    <div class="info-row">
                        <span class="info-label">Priority:</span> Routine
                    </div>
                    <div class="info-row">
                        <span class="info-label">Insurance:</span> PhilHealth
                    </div>
                    <div class="info-row">
                        <span class="info-label">Policy No:</span> PH-987654321
                    </div>
                </div>
            </div>
        </div>

        <!-- Clinical Notes -->
        <div class="section-title">Clinical Information & Notes</div>
        <div class="info-box">
            Please perform CBC, FBS, and Urinalysis. Patient reports occasional fatigue and minor weight gain over the past 3 months. Family history of diabetes.
        </div>

        <!-- Patient Preparation Instructions -->
        <div class="instructions-box">
            <div class="instructions-title">Patient Preparation Instructions:</div>
            <ul class="instructions-list">
                <li><strong>Fasting Blood Sugar (FBS):</strong> Fast for 8-10 hours prior to test. Water is permitted.</li>
                <li><strong>Urinalysis:</strong> Collect mid-stream sample in the provided container.</li>
                <li><strong>Complete Blood Count:</strong> No special preparation required.</li>
                <li><strong>Lipid Profile:</strong> Fast for 8-10 hours prior to test. Water is permitted.</li>
            </ul>
        </div>

        <!-- Lab Test Table -->
        <div class="section-title">Tests Requested</div>
        <table>
            <thead>
                <tr>
                    <th width="40%">Name of Test</th>
                    <th width="15%">Code</th>
                    <th width="20%">Category</th>
                    <th width="15%">Requires Fasting</th>
                    <th width="10%">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Complete Blood Count</td>
                    <td>CBC001</td>
                    <td>Hematology</td>
                    <td>No</td>
                    <td><span class="status-label status-pending">Pending</span></td>
                </tr>
                <tr>
                    <td>Fasting Blood Sugar</td>
                    <td>FBS002</td>
                    <td>Biochemistry</td>
                    <td>Yes</td>
                    <td><span class="status-label status-pending">Pending</span></td>
                </tr>
                <tr>
                    <td>Urinalysis</td>
                    <td>UR003</td>
                    <td>Clinical Microscopy</td>
                    <td>No</td>
                    <td><span class="status-label status-pending">Pending</span></td>
                </tr>
                <tr>
                    <td>Lipid Profile</td>
                    <td>LIP004</td>
                    <td>Biochemistry</td>
                    <td>Yes</td>
                    <td><span class="status-label status-pending">Pending</span></td>
                </tr>
            </tbody>
        </table>

        <!-- Barcode Area -->
        <div class="barcode-area">
            [BARCODE: LRF-20250420-001]
            <div class="barcode-text">Please scan at laboratory reception</div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section clearfix">
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-name">Dr. Juan Dela Cruz, MD</div>
                <div class="signature-title">License No. 1234567</div>
                <div class="signature-title">Requesting Physician</div>
            </div>
            <div class="signature-block" style="text-align: right;">
                <div class="signature-line" style="margin-left: auto;"></div>
                <div class="signature-name">Maria Santos</div>
                <div class="signature-title">Patient Signature</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This lab request was generated electronically and is valid for 30 days from the requested date.</p>
            <p>Cebu Doctors' University Hospital • 1 Hospital Drive, Cebu City • Tel: (032) 123-4567</p>
        </div>
    </div>
</body>
</html>