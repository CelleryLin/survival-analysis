import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PatientForm from './components/PatientForm'
import AnalysisResults from './components/AnalysisResults'
import { PatientDataProvider } from './context/PatientDataContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <PatientDataProvider>
      <Router basename="/survival-analysis">
        <Routes>
          <Route path="/" element={<PatientForm />} />
          <Route path="/analysis" element={<AnalysisResults />} />
        </Routes>
      </Router>
    </PatientDataProvider>
  )
}

export default App
