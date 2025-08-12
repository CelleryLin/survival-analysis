import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatientData } from '../context/PatientDataContext'
import { SurvivalAnalysisAPI } from './ApiUrl'
import PatientFormResult from './PatientFormResult'
import ShowKm from './ShowKM'
import SurvivalPrediction from './SurvivalPrediction'

const AnalysisResults: React.FC = () => {
  const navigate = useNavigate()
  const { patientData } = usePatientData()
  const [loading, setLoading] = useState(true)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [responseData, setResponseData] = useState<any>(null)

  useEffect(() => {
    if (!patientData) {
      setLoading(false)
      return
    }

    setTimeout(async () => {
      console.log(patientData)
      const response = await fetch(SurvivalAnalysisAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      })
      if (!response.ok) {
        console.error(`Error status: ${response.status}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log(data)
      setResponseData(data)
      
      setLoading(false)
    }, 500)
  }, [patientData])

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
          <div className="col">
            <div className="row-md-8">
              {/* Patient Information Card */}
              <div className="card shadow">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">患者資訊</h5>
                </div>
                <div className="card-body">
                  <PatientFormResult />
                </div>
              </div>
            </div>

            <div className="row-md-8">
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
                    <SurvivalPrediction responseData={responseData}/>
                  </div>

                  <div className="card bg-light">
                    <div className="card-body">
                      <ShowKm responseData={responseData}/>
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
