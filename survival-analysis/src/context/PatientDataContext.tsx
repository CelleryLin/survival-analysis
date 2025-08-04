import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface PatientData {
  name?: string
  Age: string
  Sex: string
  BMI?: string
  PS?: string
  AFP?: string
  Total_bilirubin?: string
  INR?: string
  Albumin?: string
  GPT?: string
  Creatine?: string
  Hemoglobin?: string
  Platelet_count?: string
  Maximal_tumor_size?: string
  Tumor_number?: string
  Tumor_distribution?: string
  EHSM?: string
  MVI?: string
  Lymphonodules?: string
  Metastasis?: string
  BCLC_stage?: string
  HBV?: string
  HCV?: string
  Cirrhosis?: string
  ChildPugh_class?: string
  Ascites?: string
  Encephalopathy?: string
  DM?: string
  HTN?: string
  ESRD?: string
  CKD?: string
  Liver_transplantation?: string
  Surgical_resection?: string
  Radiofrequency?: string
  TACE?: string
  Target_therapy?: string
  Immunotherapy?: string
  HAIC?: string
  Radiotherapy?: string
  Best_support_care?: string
  Hospital?: string
  preferredLanguage?: string
}

interface PatientDataContextType {
  patientData: PatientData | null
  setPatientData: (data: PatientData) => void
  clearPatientData: () => void
}

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined)

export const usePatientData = () => {
  const context = useContext(PatientDataContext)
  if (context === undefined) {
    throw new Error('usePatientData must be used within a PatientDataProvider')
  }
  return context
}

interface PatientDataProviderProps {
  children: ReactNode
}

export const PatientDataProvider: React.FC<PatientDataProviderProps> = ({ children }) => {
  const [patientData, setPatientDataState] = useState<PatientData | null>(null)

  const setPatientData = (data: PatientData) => {
    setPatientDataState(data)
    // Also store in sessionStorage for persistence
    sessionStorage.setItem('patientData', JSON.stringify(data))
  }

  const clearPatientData = () => {
    setPatientDataState(null)
    sessionStorage.removeItem('patientData')
  }

  // Load data from sessionStorage on mount
  React.useEffect(() => {
    const savedData = sessionStorage.getItem('patientData')
    if (savedData) {
      try {
        setPatientDataState(JSON.parse(savedData))
      } catch (error) {
        console.error('Error parsing saved patient data:', error)
      }
    }
  }, [])

  return (
    <PatientDataContext.Provider value={{ patientData, setPatientData, clearPatientData }}>
      {children}
    </PatientDataContext.Provider>
  )
}
