import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PatientForm from './components/PatientForm'
import AnalysisResults from './components/AnalysisResults'
import { PatientDataProvider } from './context/PatientDataContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <PatientDataProvider>
      <Router>
        <Routes>
          <Route path="/survival-analysis/" element={<PatientForm />} />
          <Route path="/survival-analysis/analysis" element={<AnalysisResults />} />
        </Routes>
      </Router>
    </PatientDataProvider>
  )
}

export default App
