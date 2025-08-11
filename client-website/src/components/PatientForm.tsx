import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatientData } from '../context/PatientDataContext'
import type { PatientData, TreatmentMethods } from '../context/PatientDataContext'

const PatientForm: React.FC = () => {
  const navigate = useNavigate()
  const { setPatientData } = usePatientData()
  const [formData, setFormData] = useState<PatientData>({
    name: '',
    Hospital: '',
    Age: '',
    Sex: '',
    BMI: '',
    PS: '',
    AFP: '',
    Total_bilirubin: '',
    INR: '',
    Albumin: '',
    GPT: '',
    Creatine: '',
    Hemoglobin: '',
    Platelet_count: '',
    Maximal_tumor_size: '',
    Tumor_number: '',
    Tumor_distribution: '',
    EHSM: '',
    MVI: '',
    Lymphonodules: '',
    Metastasis: '',
    BCLC_stage: '',
    HBV: '',
    HCV: '',
    Cirrhosis: '',
    ChildPugh_class: '',
    Ascites: '',
    Encephalopathy: '',
    DM: '',
    HTN: '',
    ESRD: '',
    CKD: '',
    Treatments: [],
    // Liver_transplantation: '0',
    // Surgical_resection: '0',
    // Radiofrequency: '0',
    // TACE: '0',
    // Target_therapy: '0',
    // Immunotherapy: '0',
    // HAIC: '0',
    // Radiotherapy: '0',
    // Best_support_care: '0',
  })

  const [treatmentMethods, setTreatmentMethods] = useState<TreatmentMethods>({
    Liver_transplantation: '0',
    Surgical_resection: '0',
    Radiofrequency: '0',
    TACE: '0',
    Target_therapy: '0',
    Immunotherapy: '0',
    HAIC: '0',
    Radiotherapy: '0',
    Best_support_care: '0',
  })

  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [language, setLanguage] = useState('zh')

  const translations = {
    zh: {
      title: 'HCC 肝癌存活分析系統 - 資料輸入',
      subtitle: '肝癌存活分析系統',
      home: '首頁',
      analysisResults: '分析結果',
      about: '關於系統',
      patientInfo: '患者基本資料',
      name: '姓名',
      age: '年齡',
      sex: '性別',
      male: '男性',
      female: '女性',
      bmi: 'BMI',
      liverFunction: 'Liver Function (肝功能)',
      cirrhosis: 'Cirrhosis (肝硬化)',
      childpugh_class: 'Child-Pugh Class (Child-Pugh分級)',
      ascites: 'Ascites (腹水)',
      encephalopathy: 'Encephalopathy (肝性腦病)',
      laboratoryValues: 'Laboratory Values (實驗室數值)',
      afp: 'AFP (甲型胎兒蛋白) ng/mL',
      total_bilirubin: 'Total Bilirubin (總膽紅素) mg/dL',
      inr: 'INR (國際標準化比值)',
      albumin: 'Albumin (白蛋白) g/dL',
      gpt: 'GPT (麩丙酮酸轉胺酶) U/L',
      creatinine: 'Creatinine (肌酸酐) mg/dL',
      hemoglobin: 'Hemoglobin (血紅素) g/dL',
      platelet_count: 'Platelet Count (血小板計數) ×10³/μL',
      comorbidities: 'Comorbidities (共病症)',
      dm: 'DM (糖尿病)',
      htn: 'HTN (高血壓)',
      esrd: 'ESRD (末期腎病)',
      ckd: 'CKD (慢性腎病)',
      treatmentMethods: 'Treatment Methods (治療方式) *',
      liver_transplantation: 'Liver Transplantation (肝臟移植)',
      surgical_resection: 'Surgical Resection (手術切除)',
      radiofrequency: 'Radiofrequency Ablation (射頻消融)',
      tace: 'TACE (經導管動脈化療栓塞)',
      target_therapy: 'Target Therapy (標靶治療)',
      immunotherapy: 'Immunotherapy (免疫治療)',
      haic: 'HAIC (肝動脈灌注化療)',
      radiotherapy: 'Radiotherapy (放射治療)',
      best_support_care: 'Best Supportive Care (最佳支持治療)',
      hospital: 'Hospital (醫院)',
      yes: '是',
      no: '否',
      startAnalysis: '開始分析',
      loading: '分析中，請稍候...',
      requiredFieldNote: '* 表示必填欄位 (年齡、性別、治療方式)',
      instructions: '使用說明',
      confirm: '確認',
      cancel: '取消',
      submit: '確認提交'
    },
    en: {
      title: 'HCC Survival Analysis System - Data Input',
      subtitle: 'HCC Survival Analysis System',
      home: 'Home',
      analysisResults: 'Analysis Results',
      about: 'About System',
      patientInfo: 'Patient Basic Information',
      name: 'Name',
      age: 'Age',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      bmi: 'BMI',
      liverFunction: 'Liver Function',
      cirrhosis: 'Cirrhosis',
      childpugh_class: 'Child-Pugh Class',
      ascites: 'Ascites',
      encephalopathy: 'Encephalopathy',
      laboratoryValues: 'Laboratory Values',
      afp: 'AFP ng/mL',
      total_bilirubin: 'Total Bilirubin mg/dL',
      inr: 'INR',
      albumin: 'Albumin g/dL',
      gpt: 'GPT U/L',
      creatinine: 'Creatinine mg/dL',
      hemoglobin: 'Hemoglobin g/dL',
      platelet_count: 'Platelet Count ×10³/μL',
      comorbidities: 'Comorbidities',
      dm: 'DM',
      htn: 'HTN',
      esrd: 'ESRD',
      ckd: 'CKD',
      treatmentMethods: 'Treatment Methods *',
      liver_transplantation: 'Liver Transplantation',
      surgical_resection: 'Surgical Resection',
      radiofrequency: 'Radiofrequency Ablation',
      tace: 'TACE',
      target_therapy: 'Target Therapy',
      immunotherapy: 'Immunotherapy',
      haic: 'HAIC',
      radiotherapy: 'Radiotherapy',
      best_support_care: 'Best Supportive Care',
      hospital: 'Hospital',
      yes: 'Yes',
      no: 'No',
      startAnalysis: 'Start Analysis',
      loading: 'Analyzing, please wait...',
      requiredFieldNote: '* Required fields (Age, Sex)',
      instructions: 'Instructions',
      confirm: 'Confirm',
      cancel: 'Cancel',
      submit: 'Confirm Submit'
    }
  }

  const t = translations[language as keyof typeof translations]

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleTreatmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setTreatmentMethods(prevState => ({
      ...prevState,
      [name]: checked ? "1" : "0"
    }));
    
  };

  useEffect(() => {
    const treatments = Object.keys(treatmentMethods).filter(key => treatmentMethods[key] === "1");
    // or use (Object.keys(treatmentMethods) as (keyof TreatmentMethods)[]) to avoid type issues
    setFormData(prev => ({
      ...prev,
      Treatments: treatments
    }))
  }, [treatmentMethods]);
  
  const validateNumericInput = (value: string, min: number, max: number): boolean => {
    if (value === '') return true // Allow empty values
    const numValue = parseFloat(value)
    return !isNaN(numValue) && numValue >= min && numValue <= max
  }

  const checkMissingFields = (): string[] => {
    const missing: string[] = []
    const allFields = Object.keys(formData).filter(key => key !== 'name')
    
    allFields.forEach(field => {
      if (!formData[field as keyof PatientData] || formData[field as keyof PatientData] === '') {
        missing.push(field)
      }
    })
    
    return missing
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.Age || !formData.Sex) {
      alert('請填寫必填欄位：年齡和性別')
      return
    }

    if (formData.Age && !validateNumericInput(formData.Age, 0, 150)) {
      alert('年齡必須在 0-150 之間')
      return
    }

    if (formData.BMI && !validateNumericInput(formData.BMI, 10, 50)) {
      alert('BMI必須在 10-50 之間')
      return
    }

    // Check missing fields
    const missing = checkMissingFields()
    const totalFields = Object.keys(formData).length - 2 // Exclude name, treatments
    const missingPercentage = (missing.length / totalFields) * 100

    if (formData.Treatments.length === 0) {
      alert('請至少選擇一種治療方式')
      return
    }
    
    if (missingPercentage > 50) {
      setMissingFields(missing)
      setShowConfirmModal(true)
      return
    }
    submitForm()
  }

  const submitForm = () => {
    setLoading(true)
    setPatientData(formData)
    navigate('/analysis')
  }


  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <div className="mt-2">{t.loading}</div>
          </div>
        </div>
      )}

      <div className="bg-light min-vh-100">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#125497' }}>
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#" style={{ position: 'relative', paddingLeft: '60px' }}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{
                  position: 'absolute',
                  left: '-45px',
                  width: '140px',
                  height: '140px',
                  objectFit: 'contain'
                }}
              />
              <span style={{ marginTop: '10px' }}>{t.subtitle}</span>
            </a>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link active" href="#">{t.home}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={() => setShowAboutModal(true)}>{t.about}</a>
                </li>
                <li className="nav-item">
                  <select 
                    className="form-select form-select-sm ms-2" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                  </select>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card shadow">
                <div className="card-header text-white" style={{ backgroundColor: '#125497' }}>
                  <h4 className="mb-0">{t.patientInfo}</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* Patient Basic Information */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.name}</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.hospital}</label>
                        <input type="text" name="Hospital" className="form-control" value={formData.Hospital || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label required-field">{t.age}</label>
                        <input
                          type="number"
                          name="Age"
                          className="form-control"
                          value={formData.Age}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label required-field">{t.sex}</label>
                        <select
                          name="Sex"
                          className="form-select"
                          value={formData.Sex}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">請選擇</option>
                          <option value="M">{t.male}</option>
                          <option value="F">{t.female}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.bmi}</label>
                        <input
                          type="number"
                          name="BMI"
                          className="form-control"
                          step="0.1"
                          value={formData.BMI || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Liver Function */}
                    <div className="category-header" style={{
                      background: 'linear-gradient(135deg, #1979d9, #8ac4ff)',
                      color: 'white',
                      padding: '10px 15px',
                      margin: '20px 0 15px 0',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}>
                      <h5 className="mb-0">{t.liverFunction}</h5>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.cirrhosis}</label>
                        <select name="Cirrhosis" className="form-select" value={formData.Cirrhosis || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.childpugh_class}</label>
                        <select name="ChildPugh_class" className="form-select" value={formData.ChildPugh_class || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.ascites}</label>
                        <select name="Ascites" className="form-select" value={formData.Ascites || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.encephalopathy}</label>
                        <select name="Encephalopathy" className="form-select" value={formData.Encephalopathy || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                    </div>

                    {/* Laboratory Values */}
                    <div className="category-header" style={{
                      background: 'linear-gradient(135deg, #1979d9, #8ac4ff)',
                      color: 'white',
                      padding: '10px 15px',
                      margin: '20px 0 15px 0',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}>
                      <h5 className="mb-0">{t.laboratoryValues}</h5>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.afp}</label>
                        <input type="number" name="AFP" className="form-control" step="0.01" value={formData.AFP || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.total_bilirubin}</label>
                        <input type="number" name="Total_bilirubin" className="form-control" step="0.01" value={formData.Total_bilirubin || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.inr}</label>
                        <input type="number" name="INR" className="form-control" step="0.01" value={formData.INR || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.albumin}</label>
                        <input type="number" name="Albumin" className="form-control" step="0.1" value={formData.Albumin || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.gpt}</label>
                        <input type="number" name="GPT" className="form-control" value={formData.GPT || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.creatinine}</label>
                        <input type="number" name="Creatine" className="form-control" step="0.01" value={formData.Creatine || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.hemoglobin}</label>
                        <input type="number" name="Hemoglobin" className="form-control" step="0.1" value={formData.Hemoglobin || ''} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.platelet_count}</label>
                        <input type="number" name="Platelet_count" className="form-control" value={formData.Platelet_count || ''} onChange={handleInputChange} />
                      </div>
                    </div>

                    {/* Comorbidities */}
                    <div className="category-header" style={{
                      background: 'linear-gradient(135deg, #1979d9, #8ac4ff)',
                      color: 'white',
                      padding: '10px 15px',
                      margin: '20px 0 15px 0',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}>
                      <h5 className="mb-0">{t.comorbidities}</h5>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.dm}</label>
                        <select name="DM" className="form-select" value={formData.DM || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.htn}</label>
                        <select name="HTN" className="form-select" value={formData.HTN || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.esrd}</label>
                        <select name="ESRD" className="form-select" value={formData.ESRD || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.ckd}</label>
                        <select name="CKD" className="form-select" value={formData.CKD || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                    </div>

                    {/* Treatment Methods */}
                    <div className="category-header" style={{
                      background: 'linear-gradient(135deg, #1979d9, #8ac4ff)',
                      color: 'white',
                      padding: '10px 15px',
                      margin: '20px 0 15px 0',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}>
                      <h5 className="mb-0">{t.treatmentMethods}</h5>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="Liver_transplantation" 
                            id="liver_transplantation"
                            checked={treatmentMethods.Liver_transplantation === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="liver_transplantation">
                            {t.liver_transplantation}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="Surgical_resection" 
                            id="surgical_resection"
                            checked={treatmentMethods.Surgical_resection === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="surgical_resection">
                            {t.surgical_resection}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="Radiofrequency" 
                            id="radiofrequency"
                            checked={treatmentMethods.Radiofrequency === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="radiofrequency">
                            {t.radiofrequency}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="TACE" 
                            id="tace"
                            checked={treatmentMethods.TACE === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="tace">
                            {t.tace}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="Target_therapy" 
                            id="target_therapy"
                            checked={treatmentMethods.Target_therapy === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="target_therapy">
                            {t.target_therapy}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="Immunotherapy" 
                            id="immunotherapy"
                            checked={treatmentMethods.Immunotherapy === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="immunotherapy">
                            {t.immunotherapy}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="HAIC" 
                            id="haic"
                            checked={treatmentMethods.HAIC === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="haic">
                            {t.haic}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="Radiotherapy" 
                            id="radiotherapy"
                            checked={treatmentMethods.Radiotherapy === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="radiotherapy">
                            {t.radiotherapy}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="Best_support_care" 
                            id="best_support_care"
                            checked={treatmentMethods.Best_support_care === "1"}
                            onChange={handleTreatmentChange}
                          />
                          <label className="form-check-label" htmlFor="best_support_care">
                            {t.best_support_care}
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* <div className="category-header" style={{
                      background: 'linear-gradient(135deg, #1979d9, #8ac4ff)',
                      color: 'white',
                      padding: '10px 15px',
                      margin: '20px 0 15px 0',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}>
                      <h5 className="mb-0">{t.treatmentMethods}</h5>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.liver_transplantation}</label>
                        <select name="Liver_transplantation" className="form-select" value={formData.Liver_transplantation || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.surgical_resection}</label>
                        <select name="Surgical_resection" className="form-select" value={formData.Surgical_resection || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.radiofrequency}</label>
                        <select name="Radiofrequency" className="form-select" value={formData.Radiofrequency || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.tace}</label>
                        <select name="TACE" className="form-select" value={formData.TACE || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.target_therapy}</label>
                        <select name="Target_therapy" className="form-select" value={formData.Target_therapy || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.immunotherapy}</label>
                        <select name="Immunotherapy" className="form-select" value={formData.Immunotherapy || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.haic}</label>
                        <select name="HAIC" className="form-select" value={formData.HAIC || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.radiotherapy}</label>
                        <select name="Radiotherapy" className="form-select" value={formData.Radiotherapy || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.best_support_care}</label>
                        <select name="Best_support_care" className="form-select" value={formData.Best_support_care || ''} onChange={handleInputChange}>
                          <option value="">請選擇</option>
                          <option value="0">{t.no}</option>
                          <option value="1">{t.yes}</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.hospital}</label>
                        <input type="text" name="Hospital" className="form-control" value={formData.Hospital || ''} onChange={handleInputChange} />
                      </div>
                    </div> */}

                    <hr />
                    <p className="text-muted small">{t.requiredFieldNote}</p>

                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary btn-lg">
                        {t.startAnalysis}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card bg-light mt-4">
                <div className="card-body">
                  <h5>{t.instructions}</h5>
                  <ul>
                    <li>請填寫患者的基本資料和相關檢驗數值</li>
                    <li>年齡和性別為必填欄位</li>
                    <li>其他欄位可選填，但填寫越完整預測結果越準確</li>
                    <li>數值欄位請輸入有效範圍內的數字</li>
                    <li>完成後點擊「開始分析」按鈕進行預測</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-white mt-4 py-3" style={{ backgroundColor: '#125497' }}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="mb-0">© 2025 肝癌存活分析系統</p>
              </div>
              <div className="col-md-6 text-md-end">
                <p className="mb-0">僅供醫療專業人員使用</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">確認提交</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>您有超過50%的欄位未填寫，這可能影響預測準確性。是否要繼續分析？</p>
                <p>未填寫欄位數量：{missingFields.length}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                  {t.cancel}
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  setShowConfirmModal(false)
                  submitForm()
                }}>
                  {t.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">關於肝癌存活分析系統</h5>
                <button type="button" className="btn-close" onClick={() => setShowAboutModal(false)}></button>
              </div>
              <div className="modal-body">
                <h6>系統概述</h6>
                <p>肝癌存活分析系統是一個基於機器學習演算法開發的臨床決策輔助工具，旨在協助醫療專業人員評估肝癌患者的預後情況。</p>
                
                <h6>模型說明</h6>
                <p>此預測模型使用40項臨床指標作為輸入變數，包括：年齡、性別、BMI、腫瘤大小、AFP值、肝功能指標等。</p>
                
                <h6>注意事項</h6>
                <p>本系統僅作為臨床決策的輔助工具，不應替代專業醫師的診斷和治療建議。</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAboutModal(false)}>
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .required-field::after {
          content: " *";
          color: red;
        }
        
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
      `}</style>
    </>
  )
}

export default PatientForm
