<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Prescription</title>
    <style>
        @page { margin: 20px; }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            margin: 0px;
            padding: 10px;
            font-size: 8pt;
            line-height: 1;
        }
        .prescription-container {
            width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 2px solid #F1F8E8;
        }
        .logo {
            width: 60px;
            height: 60px;
            background-color: #0d6efd;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .patient-info {
            background-color: #f8f9fa;
            border-radius: 6px;
            margin-bottom: 15px;
            border-left: 4px solid #006838;
            display: flex;
            flex-wrap: wrap;
            width: auto;
            padding: 10px;
        }
        .patient-info-left {
            flex: 1;
            min-width: 50%;
        }
        .patient-info-right {
            flex: 1;
            min-width: 50%;
            text-align: right;
        }
        .rx-header {
            display: flex;
            align-items: center;
            margin: 15px 0 10px 0;
        }
        .rx-symbol {
            color: #0d6efd;
            font-size: 28px;
            font-weight: bold;
            margin-right: 10px;
        }
        .medication {
            background-color: #f8f9fa;
            /* padding-top: 12px;
            padding-bottom: 12px; */
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 3px solid #006838;
        }
        .signature {
            text-align: right;
            margin-top: 40px;
        }
        .signature-line {
            border-top: 1px solid #333;
            width: 150px;
            display: inline-block;
            margin-bottom: 5px;
        }
        .footer {
            padding-top: 15px;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .security-note {
            font-size: 10px;
            text-align: center;
            color: #666;
            margin-top: 50px;
        }
        .text-primary {
            color: #0d6efd;
        }
        .text-muted {
            color: #6c757d;
        }
        .fw-bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="prescription-container">
        <!-- Header -->
        <div class="header">
            {{-- <div class="logo">❤</div> --}}
            <img src="assets/images/doh_logo.png" alt="Logo" style="width: 60px;" />
            <h2 class="fw-bold" style="color:#006838;">Dr. {{ $doctorName }}</h2>
            <p class="text-muted">{{ $specialty }}</p>
            <p class="fw-bold mb-1">{{ $clinicName }}</p>
            <p class="mb-1">{{ $location }}</p>
            <p class="mb-0">{{ $phone }}</p>       
        </div>
        
        <!-- Patient Information -->
        <div class="patient-info">
            <table width="100%">
                <tr>
                    <td>
                        <div class="patient-info-left">
                            <p class="mb-2"><span class="fw-bold">NAME:</span> {{ $patientName }}</p>
                            <p class="mb-2"><span class="fw-bold">AGE:</span> {{ $age }}</p>
                            <p class="mb-0"><span class="fw-bold">ADDRESS:</span> {{ $address }}</p>
                        </div>
                    </td>
                    <td>
                        <div class="patient-info-right">
                            <p class="mb-2"><span class="fw-bold">DATE OF BIRTH:</span> <span style="color:#006838;">{{ $dob }}</span></p>
                            <p class="mb-2"><span class="fw-bold">SEX:</span> {{ $gender }}</p>
                            <p class="mb-0"><span class="fw-bold">PRESCRIPTION #:</span> <span style="color: #006838;">{{ $prescriptionNumber }}</span></p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        
        <!-- Prescription -->
        <div class="rx-header">
            <span class="rx-symbol">Rx</span>
            <h4 class="mb-0">Medication Prescription</h4>
        </div>
        
        <div class="medication">
            {!! $content !!}
        </div>
        
        <!-- Signature -->
        <div class="signature">
            <div class="signature-line"></div>
            <p class="fw-bold mb-0">{{ $doctorName }}, MD</p>
            <p class="mb-0">License No.: {{ $licenseNumber }}</p>
            <p>PTR No.: {{ $ptrNumber }}</p>
        </div>
        
        <!-- Footer -->        
        <div class="security-note">
            <p class="mb-0">This is an electronic prescription issued on {{ $date }}. Valid for 30 days from issue date.</p>
            {{-- <p class="mb-0">Security ID: {{ $securityId }}</p> --}}
        </div>
    </div>
</body>
</html>