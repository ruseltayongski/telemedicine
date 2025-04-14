<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electronic Prescription</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .prescription-header {
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 15px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .prescription-header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 24px;
        }
        
        .prescription-logo {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .prescription-info {
            background-color: #f9f9f9;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        
        .prescription-content {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .prescription-footer {
            font-size: 12px;
            text-align: center;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        
        .doctor-signature {
            margin-top: 30px;
            border-top: 1px dashed #ccc;
            padding-top: 10px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .prescription-content {
                border: none;
            }
        }
    </style>
</head>
<body>
    <div class="prescription-header">
        <div>
            <h1>Electronic Prescription</h1>
            <p>Rx #: <span id="prescription-id">12345</span></p>
        </div>
        <div class="prescription-logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="45" fill="#3498db" />
                <circle cx="50" cy="50" r="40" fill="white" />
                
                <!-- Rx Symbol -->
                <path d="M32 30 L32 70" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" />
                <path d="M32 40 L48 40" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" />
                <path d="M48 40 L65 30" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" />
                <path d="M48 40 L65 70" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" />
                
                <!-- Decorative elements -->
                <path d="M28 30 L36 30" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" />
                <path d="M32 30 Q20 40 32 50" stroke="#2c3e50" stroke-width="3" fill="none" />
            </svg>
        </div>
    </div>
    
    <div class="prescription-info">
        <p><strong>Date:</strong> <span id="prescription-date">April 14, 2025</span></p>
        <p><strong>Patient:</strong> <span id="patient-name">Patient Name</span></p>
        <p><strong>DOB:</strong> <span id="patient-dob">MM/DD/YYYY</span></p>
    </div>
    
    <div class="prescription-content">
        {!! $prescription->content !!}
    </div>
    
    <div class="doctor-signature">
        <p><strong>Doctor:</strong> <span id="doctor-name">Dr. Name</span></p>
        <p><strong>License #:</strong> <span id="doctor-license">12345</span></p>
        <p><strong>DEA #:</strong> <span id="doctor-dea">AB1234567</span></p>
    </div>
    
    <div class="prescription-footer">
        <p>This is an electronic prescription issued on <span id="issue-date">April 14, 2025</span>.</p>
        <p>Please contact the issuing doctor's office for verification if needed.</p>
    </div>
    
    <script>
        // You can add JavaScript to populate dynamic fields if needed
        document.getElementById('prescription-date').textContent = new Date().toLocaleDateString();
        document.getElementById('issue-date').textContent = new Date().toLocaleDateString();
    </script>
</body>
</html>