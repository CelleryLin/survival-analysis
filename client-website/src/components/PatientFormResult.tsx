import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { usePatientData } from '../context/PatientDataContext'
import type { PatientData } from '../context/PatientDataContext';

const PatientFormResult: React.FC = () => {
  const navigate = useNavigate()
  const { patientData } = usePatientData()
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  const fillDetailedInfo = (section: string) => {
    if (!patientData) return []

    const sections = {
      physiological: {
        'PS': '體能狀態',
        'AFP': '甲型胎兒蛋白',
        'Total_bilirubin': '總膽紅素',
        'INR': '國際標準化比值',
        'Albumin': '白蛋白',
        'GPT': '麩丙酮酸轉胺酶',
        'Creatine': '肌酸酐',
        'Hemoglobin': '血紅素',
        'Platelet_count': '血小板計數'
      },
      tumor: {
        'Maximal_tumor_size': '最大腫瘤大小',
        'Tumor_number': '腫瘤數量',
        'Tumor_distribution': '腫瘤分布',
        'EHSM': '肝外轉移',
        'MVI': '微血管侵犯',
        'Lymphonodules': '淋巴結',
        'Metastasis': '轉移',
        'BCLC_stage': 'BCLC分期'
      },
      medical: {
        'HBV': 'B型肝炎',
        'HCV': 'C型肝炎',
        'Cirrhosis': '肝硬化',
        'ChildPugh_class': 'Child-Pugh分級',
        'Ascites': '腹水',
        'Encephalopathy': '肝性腦病',
        'DM': '糖尿病',
        'HTN': '高血壓',
        'ESRD': '末期腎病',
        'CKD': '慢性腎病'
      },
      treatment: {
        'Liver_transplantation': '肝臟移植',
        'Surgical_resection': '手術切除',
        'Radiofrequency': '射頻消融',
        'TACE': '經導管動脈化療栓塞',
        'Target_therapy': '標靶治療',
        'Immunotherapy': '免疫治療',
        'HAIC': '肝動脈灌注化療',
        'Radiotherapy': '放射治療',
        'Best_support_care': '最佳支持治療',
      }
    }

    const dataMap = sections[section as keyof typeof sections] || {}
    const items: React.ReactElement[] = []
    
    if (section !== 'treatment') {
      Object.entries(dataMap).forEach(([key, label]) => {
        const value = patientData[key as keyof PatientData] || '-'
        items.push(
          <div key={key} className="info-row d-flex justify-content-between">
            <span>{label}：</span>
            <span>{value}</span>
          </div>
        )
      })
    }
    else {
      // Special handling for treatment methods
      patientData.Treatments.forEach((e) => {
        items.push(
          <div key={e} className="info-row">
            <span>{sections.treatment[e as keyof typeof sections.treatment]} ({e.replace('_', ' ')})</span>
          </div>
        )
      })
    }

    return items
  }

  return (
    <>
      {/* Basic Info */}
      <div id="basicInfo">
        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
              <td><strong>姓名：</strong></td>
              <td>{patientData?.name || '未命名患者'}</td>
            </tr>
            <tr>
              <td><strong>醫院：</strong></td>
              <td>{patientData?.Hospital || '-'}</td>
            </tr>
            <tr>
              <td><strong>性別：</strong></td>
              <td>{patientData?.Sex === 'M' ? '男性' : '女性'}</td>
            </tr>
            <tr>
              <td><strong>年齡：</strong></td>
              <td>{patientData?.Age} 歲</td>
            </tr>
            <tr>
              <td><strong>BMI：</strong></td>
              <td>{patientData?.BMI || '-'} kg/m²</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Toggle Button */}
      <div className="d-grid">
        <button
          className="btn btn-sm btn-outline-secondary"
          type="button"
          onClick={() => setShowDetailedInfo(!showDetailedInfo)}
        >
          <span>{showDetailedInfo ? '隱藏完整資料' : '顯示完整資料'}</span>
          <svg
            width="16"
            height="16"
            fill="currentColor"
            className={`bi bi-chevron-down ms-1 ${showDetailedInfo ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            style={{ transition: 'transform 0.3s ease' }}
          >
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>

      {/* Detailed Info */}
      {showDetailedInfo && (
        <div className="patient-info-expanded" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <hr />

          {/* Physiological Indicators */}
          <div className="info-category" style={{
            backgroundColor: '#f8f9fa',
            padding: '8px',
            margin: '8px 0',
            borderRadius: '4px',
            fontWeight: 500
          }}>
            <strong>生理指標</strong>
          </div>
          <div>
            {fillDetailedInfo('physiological')}
          </div>

          {/* Tumor Related */}
          <div className="info-category" style={{
            backgroundColor: '#f8f9fa',
            padding: '8px',
            margin: '8px 0',
            borderRadius: '4px',
            fontWeight: 500
          }}>
            <strong>腫瘤相關</strong>
          </div>
          <div>
            {fillDetailedInfo('tumor')}
          </div>

          {/* Medical History */}
          <div className="info-category" style={{
            backgroundColor: '#f8f9fa',
            padding: '8px',
            margin: '8px 0',
            borderRadius: '4px',
            fontWeight: 500
          }}>
            <strong>病史與疾病狀況</strong>
          </div>
          <div>
            {fillDetailedInfo('medical')}
          </div>

          {/* Treatment Methods */}
          <div className="info-category" style={{
            backgroundColor: '#f8f9fa',
            padding: '8px',
            margin: '8px 0',
            borderRadius: '4px',
            fontWeight: 500
          }}>
            <strong>治療方式</strong>
          </div>
          <div>
            {fillDetailedInfo('treatment')}
          </div>
        </div>
      )}

      <div className="mt-3 no-print">
        <button className="btn btn-secondary btn-sm w-100" onClick={() => navigate('/')}>
          返回修改資料
        </button>
      </div>
    </>
  )

}

export default PatientFormResult;