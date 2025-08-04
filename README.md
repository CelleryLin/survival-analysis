# HCC Survival Analysis System Frontend Demo

### Website: [https://cellerylin.github.io/survival-analysis/](https://cellerylin.github.io/survival-analysis/)

A Demo of web-based clinical decision support tool for predicting 5-year survival rates in hepatocellular carcinoma (HCC) patients. This system uses machine learning algorithms to analyze multiple clinical indicators and provide survival probability estimates to assist healthcare professionals in treatment planning.

## 🏥 Overview

The HCC Survival Analysis System is designed to help medical professionals assess the prognosis of liver cancer patients by analyzing up to 40 different clinical parameters including:

- **Patient Demographics**: Age, sex, BMI
- **Liver Function**: Cirrhosis status, Child-Pugh classification, ascites, encephalopathy
- **Laboratory Values**: AFP, bilirubin, INR, albumin, GPT, creatinine, hemoglobin, platelet count
- **Tumor Characteristics**: Size, number, distribution, metastasis status, BCLC staging
- **Comorbidities**: Diabetes, hypertension, renal disease
- **Treatment Methods**: Various therapeutic interventions including surgery, ablation, TACE, targeted therapy

## 🚀 Features

- **Bilingual Support**: Interface available in Traditional Chinese and English
- **Interactive Form**: Comprehensive patient data input with validation
- **Real-time Analysis**: Immediate survival rate prediction upon form submission
- **Detailed Results**: Visual presentation of survival probability with risk categorization
- **Clinical Recommendations**: Automated generation of follow-up suggestions based on risk level
- **Print/Export**: Generate reports for clinical documentation
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 20.19.0 or higher)
- npm (version 10.7.0 or higher)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/CelleryLin/survival-analysis.git
cd survival-analysis
```

2. Navigate to the client website directory:
```bash
cd client-website
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 🎯 Usage

### For Healthcare Professionals

1. **Patient Data Entry**: Fill in the patient information form with available clinical data
2. **Required Fields**: Age and sex are mandatory; other fields are optional but improve prediction accuracy
3. **Analysis**: Click "開始分析" (Start Analysis) to generate survival predictions
4. **Results Review**: Review the 5-year survival rate, risk level, and clinical recommendations
5. **Documentation**: Print or export reports for patient records

### Data Input Guidelines

- **Numeric Fields**: Enter values within the specified ranges
- **Selection Fields**: Choose appropriate options from dropdown menus
- **Optional vs Required**: Age and sex are required; other fields enhance accuracy when provided
- **Data Quality**: More complete data yields more accurate predictions

## ⚠️ Important Disclaimers

- This system is intended as a **clinical decision support tool only**
- Results should **not replace professional medical judgment**
- Always consult with qualified healthcare professionals for treatment decisions
- Predictions are based on statistical models and may not apply to individual cases
- Regular model validation and updates are recommended

## 🔒 Privacy and Security

- Patient data is stored locally in browser session storage
- No data is transmitted to external servers during analysis
- Data is automatically cleared when the browser session ends
- Ensure compliance with local healthcare data protection regulations

## 🙏 Acknowledgments

We would like to thank the following individuals and organizations for their contributions to this project:

*(This section will be updated with specific acknowledgments)*

---

**Note**: This system is designed for use by qualified medical professionals only. Always follow institutional guidelines and regulatory requirements when using clinical decision support tools.
