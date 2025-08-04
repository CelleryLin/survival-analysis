import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatientData } from '../context/PatientDataContext'
import type { PatientData } from '../context/PatientDataContext'

const AnalysisResults: React.FC = () => {
  const navigate = useNavigate()
  const { patientData } = usePatientData()
  const [loading, setLoading] = useState(true)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showDetailedInfo, setShowDetailedInfo] = useState(false)
  const [survivalRate, setSurvivalRate] = useState(0)
  const [riskLevel, setRiskLevel] = useState('')
  const [riskBadgeClass, setRiskBadgeClass] = useState('')
  const [comparisonText, setComparisonText] = useState('')
  const [activeTab, setActiveTab] = useState('survivalCurve')

  useEffect(() => {
    if (!patientData) {
      setLoading(false)
      return
    }

    // Simulate loading and analysis
    setTimeout(() => {
      const rate = simulatePrediction(patientData)
      setSurvivalRate(rate)
      
      // Set risk level
      if (rate >= 75) {
        setRiskLevel('低風險')
        setRiskBadgeClass('bg-success')
      } else if (rate >= 50) {
        setRiskLevel('中等風險')
        setRiskBadgeClass('bg-warning text-dark')
      } else {
        setRiskLevel('高風險')
        setRiskBadgeClass('bg-danger')
      }

      // Set comparison text
      if (rate >= 70) {
        setComparisonText('顯著高於平均水平')
      } else if (rate >= 55) {
        setComparisonText('高於平均水平')
      } else if (rate >= 45) {
        setComparisonText('接近平均水平')
      } else if (rate >= 30) {
        setComparisonText('低於平均水平')
      } else {
        setComparisonText('顯著低於平均水平')
      }

      setLoading(false)
    }, 1500)
  }, [patientData])

  // Simulate prediction (same logic as in original HTML)
  const simulatePrediction = (data: PatientData): number => {
    const age = parseFloat(data.Age) || 50
    const tumorSize = parseFloat(data.Maximal_tumor_size || '') || 3
    const afp = parseFloat(data.AFP || '') || 20
    const bmi = parseFloat(data.BMI || '') || 23

    let baseRate = 75
    if (age > 65) baseRate -= 10
    if (tumorSize > 5) baseRate -= 15
    if (afp > 400) baseRate -= 20
    if (bmi < 18.5 || bmi > 30) baseRate -= 5
    if (data.Cirrhosis === '1' || data.Cirrhosis === 'Yes') baseRate -= 10
    if (data.BCLC_stage === 'C' || data.BCLC_stage === 'D') baseRate -= 20
    if (data.Metastasis === '1' || data.Metastasis === 'Yes') baseRate -= 15

    return Math.max(5, Math.min(95, Math.round(baseRate)))
  }

  const generateClinicalAdvice = (): React.ReactElement => {
    if (!patientData) return <></>

    let advice: React.ReactElement[] = []

    if (survivalRate >= 75) {
      advice.push(
        <div key="high-survival">
          <p><strong>良好預後：</strong> 患者具有良好的5年存活預期，建議持續定期追蹤。</p>
          <p><strong>建議追蹤頻率：</strong> 每3-6個月進行一次檢查。</p>
          <p><strong>生活品質維護：</strong> 維持良好的生活習慣和營養狀況。</p>
        </div>
      )
    } else if (survivalRate >= 50) {
      advice.push(
        <div key="moderate-survival">
          <p><strong>中等預後：</strong> 需要密切監控病情變化，考慮調整治療策略。</p>
          <p><strong>建議追蹤頻率：</strong> 每2-3個月進行一次檢查。</p>
          <p><strong>治療優化：</strong> 評估是否需要更積極的治療方案。</p>
        </div>
      )
    } else {
      advice.push(
        <div key="poor-survival">
          <p><strong>需要關注：</strong> 建議考慮更積極的治療方案或緩解性照護。</p>
          <p><strong>建議追蹤頻率：</strong> 每1-2個月進行一次檢查。</p>
          <p><strong>症狀管理：</strong> 重點關注症狀控制和生活品質改善。</p>
        </div>
      )
    }

    // Add specific recommendations based on risk factors
    if (parseFloat(patientData.AFP || '') > 400) {
      advice.push(<p key="afp"><strong>特別注意：</strong> AFP數值明顯升高，建議密切監測腫瘤動態變化。</p>)
    }

    if (patientData.Cirrhosis === '1' || patientData.Cirrhosis === 'Yes') {
      advice.push(<p key="cirrhosis"><strong>重要提示：</strong> 肝硬化存在，應加強肝功能保護及併發症預防。</p>)
    }

    if (patientData.Metastasis === '1' || patientData.Metastasis === 'Yes') {
      advice.push(<p key="metastasis"><strong>注意事項：</strong> 存在轉移情況，需要全身治療方案。</p>)
    }

    if (parseFloat(patientData.Total_bilirubin || '') > 2) {
      advice.push(<p key="bilirubin"><strong>肝功能監測：</strong> 總膽紅素偏高，需密切監測肝功能變化。</p>)
    }

    return <div>{advice}</div>
  }

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
        'Hospital': '醫院'
      }
    }

    const dataMap = sections[section as keyof typeof sections] || {}
    const items: React.ReactElement[] = []

    Object.entries(dataMap).forEach(([key, label]) => {
      const value = patientData[key as keyof PatientData] || '-'
      items.push(
        <div key={key} className="info-row d-flex justify-content-between">
          <span>{label}：</span>
          <span>{value}</span>
        </div>
      )
    })

    return items
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    alert('報告下載功能將在此處實現')
  }

  if (!patientData && !loading) {
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">無患者資料</h5>
            </div>
            <div className="modal-body">
              <p>找不到患者資料，請重新填寫資料後再進行分析。</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
                返回輸入頁面
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
            <div className="mt-2">正在分析資料，請稍候...</div>
          </div>
        </div>
      )}

      <div className="bg-light min-vh-100">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <a className="navbar-brand" href="#">肝癌存活分析系統</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={() => navigate('/')}>首頁</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="#">分析結果</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={() => setShowAboutModal(true)}>關於系統</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container py-4">
          <div className="row">
            <div className="col-md-4">
              {/* Patient Information Card */}
              <div className="card shadow">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">患者資訊</h5>
                </div>
                <div className="card-body">
                  {/* Basic Info */}
                  <div id="basicInfo">
                    <table className="table table-borderless table-sm">
                      <tbody>
                        <tr>
                          <td><strong>姓名：</strong></td>
                          <td>{patientData?.name || '未命名患者'}</td>
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
                        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
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
                        生理指標
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
                        腫瘤相關
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
                        病史與疾病狀況
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
                        治療方式
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
                </div>
              </div>

              {/* Clinical Advice Card */}
              <div className="card shadow">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">臨床建議</h5>
                </div>
                <div className="card-body">
                  <div id="clinicalAdvice">
                    {generateClinicalAdvice()}
                  </div>
                  <p className="text-muted small mt-3">
                    此分析結果及建議僅供醫療參考，實際治療方案請諮詢專業醫師。
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              {/* Results Card */}
              <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">預測結果</h5>
                  <div>
                    <button className="btn btn-sm btn-light me-2 no-print" onClick={handlePrint}>
                      列印報告
                    </button>
                    <button className="btn btn-sm btn-light no-print" onClick={handleDownload}>
                      下載PDF
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {/* Survival Rate Alert */}
                  <div className="alert alert-info">
                    <h5>存活率預測</h5>
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <div className="text-center">
                          <div className="h2">{survivalRate}%</div>
                          <div>5年存活率</div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <p>
                          依據模型分析，此患者的5年存活機率為 <strong>{survivalRate}%</strong>。
                          相比於類似條件的患者群體，此患者的存活機率<strong>{comparisonText}</strong>。
                        </p>
                        <p>
                          風險等級: <span className={`badge ${riskBadgeClass}`}>{riskLevel}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chart Tabs */}
                  <div className="mb-3">
                    <ul className="nav nav-tabs nav-fill no-print">
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'survivalCurve' ? 'active' : ''}`}
                          onClick={() => setActiveTab('survivalCurve')}
                        >
                          存活曲線
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'riskFactors' ? 'active' : ''}`}
                          onClick={() => setActiveTab('riskFactors')}
                        >
                          風險因子分析
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'comparisonChart' ? 'active' : ''}`}
                          onClick={() => setActiveTab('comparisonChart')}
                        >
                          比較分析
                        </button>
                      </li>
                    </ul>

                    <div className="p-3 border border-top-0">
                      {/* Chart Containers */}
                      {activeTab === 'survivalCurve' && (
                        <div className="chart-container" style={{
                          minHeight: '300px',
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '0.25rem'
                        }}>
                          <p>存活曲線圖表將顯示在此處</p>
                        </div>
                      )}

                      {activeTab === 'riskFactors' && (
                        <div className="chart-container" style={{
                          minHeight: '300px',
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '0.25rem'
                        }}>
                          <p>風險因子分析圖表將顯示在此處</p>
                        </div>
                      )}

                      {activeTab === 'comparisonChart' && (
                        <div className="chart-container" style={{
                          minHeight: '300px',
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '0.25rem'
                        }}>
                          <p>比較分析圖表將顯示在此處</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Model Description */}
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>模型說明</h6>
                      <p className="small mb-0">
                        此預測模型基於肝癌患者臨床資料所開發，通過分析多種風險因子來估計患者的5年存活率。
                        模型考慮了年齡、腫瘤大小、AFP值等多項臨床指標。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-dark text-white mt-4 py-3">
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
        .info-row {
          padding: 4px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .rotate-180 {
          transform: rotate(180deg);
        }
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default AnalysisResults
