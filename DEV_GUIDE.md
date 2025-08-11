# HCC Survival Analysis System - Backend API Development Guide

## Overview

This guide helps you develop and implement the backend API for the HCC (Hepatocellular Carcinoma) Survival Analysis System. The frontend is already complete and sends patient data to your API endpoints. Your job is to implement the actual survival analysis logic and return accurate predictions.

## Current Backend Status

The basic Flask application structure is already set up in `example_endpoint()` function in `api/app.py`. Currently, it returns random survival rates for testing. You need to replace this with real survival analysis algorithms.

## Your Development Tasks
- Load model(s) for HCC survival prediction **at the start of server**
- Process the input patient data from the frontend request
- Calculate KM curves respective to the treatment options
- Return the response according to the given format

Please see section [Frontend Data Contract](#frontend-data-contract-do-not-change) for the exact request and response structure.

## Frontend Data Contract (DO NOT CHANGE)

The frontend sends this exact JSON structure. Your API must accept this format:

```python
# Example of the frontend request
data = {
    "name": "John Doe",
    "Hospital": "Taiwan University Hospital",
    "Age": "65", # Required - string format
    "Sex": "M", # Required - "M" or "F"
    "BMI": "24.5",
    "AFP": "150.5",
    "Total_bilirubin": "1.2",
    "INR": "1.1",
    "Albumin": "3.8",
    "GPT": "45",
    "Creatine": "1.0",
    "Hemoglobin": "12.5",
    "Platelet_count": "180",
    # ... more fields (see complete list below)
    "Treatments": ["Surgical_resection", "TACE"]  # Required - array of strings
}
```

**Your API must return exactly this format:**
```python
response = {
    "Treatments": ["Surgical_resection", "TACE"],  # Echo back treatments
    "KM_curves": [
    {
        "x": [0.0, 0.17, 0.47, ...], 
        "KM_estimate": [1.0, 0.994, 0.988, ...], 
        "Lower_CI": [1.0, 0.958, 0.953, ...], 
        "Upper_CI": [1.0, 0.999, 0.997, ...]
    },
    {
        "x": [0.0, 0.17, 0.47, ...], 
        "KM_estimate": [1.0, 0.994, 0.988, ...], 
        "Lower_CI": [1.0, 0.958, 0.953, ...], 
        "Upper_CI": [1.0, 0.999, 0.997, ...]
    },
    ]
}
```

## Complete Input Data Fields

Here are all the fields the frontend can send. Handle missing/empty values gracefully:

**Patient Demographics**
- `name` (string, optional) - Patient name
- `Hospital` (string, optional) - Hospital name  
- `Age` (string, required) - Patient age in years
- `Sex` (string, required) - "M" or "F"
- `BMI` (string, optional) - Body Mass Index

**Laboratory Values (all optional, string format)**
- `AFP` - Alpha-fetoprotein (ng/mL)
- `Total_bilirubin` - Total bilirubin (mg/dL)
- `INR` - International normalized ratio
- `Albumin` - Albumin level (g/dL)
- `GPT` - Glutamic pyruvic transaminase (U/L)
- `Creatine` - Creatinine (mg/dL)
- `Hemoglobin` - Hemoglobin (g/dL)
- `Platelet_count` - Platelet count (×10³/μL)

**Tumor Characteristics (all optional)**
- `Maximal_tumor_size` (string)
- `Tumor_number` (string)
- `Tumor_distribution` (string)
- `EHSM` (string)
- `MVI` (string)
- `Lymphonodules` (string)
- `Metastasis` (string)
- `BCLC_stage` (string)

**Medical History (all optional, "0" or "1")**
- `HBV` - Hepatitis B
- `HCV` - Hepatitis C  
- `Cirrhosis` - Liver cirrhosis
- `ChildPugh_class` - "A", "B", or "C"
- `Ascites` - Ascites present
- `Encephalopathy` - Hepatic encephalopathy
- `DM` - Diabetes mellitus
- `HTN` - Hypertension
- `ESRD` - End-stage renal disease
- `CKD` - Chronic kidney disease

**Treatments (required)**
- `Treatments` (string[]) - List of treatment types

## Implementation Steps

1. Set Up Your Development Environment
2. Implement Data Preprocessing
  - Convert frontend data to ML-ready format
3. Implement Survival Analysis

## Treatment Options Reference

The `Treatments` array can contain these values:
- `"Liver_transplantation"`
- `"Surgical_resection"`
- `"Radiofrequency"`
- `"TACE"`
- `"Target_therapy"`
- `"Immunotherapy"`
- `"HAIC"`
- `"Radiotherapy"`
- `"Best_support_care"`

## Test Your API with Postman

1. **Install Postman**
  - Go to [Postman](https://www.postman.com/)

2. **Set Up a New Request**
  - Open Postman and create a new request
  - Set the request type to `POST`
  - Enter your API URL (e.g., `http://your-public-ip/your-endpoint`)

3. **Configure Request Headers**
  - Add header: `Content-Type: application/json`

4. **Create Request Body**
  - Select the "Body" tab
  - Choose "raw" and "JSON" format
  - Enter a test payload using this template:
  ```json
  {
     "name": "Test Patient",
     "Hospital": "Test Hospital",
     "Age": "65",
     "Sex": "M",
     "BMI": "24.5",
     "AFP": "150.5",
     "Total_bilirubin": "1.2",
     "Treatments": ["Surgical_resection", "TACE"]
  }
  ```

1. **Send Request and Analyze Response**
  - Click "Send" to make the request
  - Verify the response format matches the expected structure
  - Check that all KM curves data is present and properly formatted

2. **Test Error Handling**
  - Test with missing required fields (e.g., omit "Age" or "Sex")
  - Test with invalid treatment options
  - Ensure your API returns appropriate error messages

3. **Save Your Tests**
  - Save the request to a collection for future testing
  - Consider creating multiple test cases with different patient profiles
---

**Development Contact**: Cellery Lin
**Last Updated**: August 11, 2025
