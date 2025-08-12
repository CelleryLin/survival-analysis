import React, { useState, useEffect } from "react";
import type { ResponseData } from '../context/ResponseDataContext';

interface SurvivalPredictionProps {
  responseData: ResponseData;
}

interface TreatmentSurvival {
  treatment: string;
  medianSurvival: number | null; // months to 50% survival
  maxTime: number; // maximum time point in the curve
  displayName: string;
}

const SurvivalPrediction: React.FC<SurvivalPredictionProps> = ({ responseData }) => {
  const [treatmentSurvivals, setTreatmentSurvivals] = useState<TreatmentSurvival[]>([]);
  const [bestTreatment, setBestTreatment] = useState<TreatmentSurvival | null>(null);

  // Function to calculate median survival (months to 50% survival rate)
  const calculateMedianSurvival = (curve: any): { medianSurvival: number | null; maxTime: number } => {
    const maxTime = Math.max(...curve.x);
    
    // Find the point where survival probability drops to or below 0.5
    for (let i = 0; i < curve.KM_estimate.length; i++) {
      if (curve.KM_estimate[i] <= 0.5) {
        return { medianSurvival: curve.x[i], maxTime };
      }
    }
    // If survival never drops to 50%, return null (not reached)
    return { medianSurvival: null, maxTime };
  };

  useEffect(() => {
    if (!responseData || !responseData.KM_curves || !responseData.Treatments) {
      return;
    }

    const survivalData: TreatmentSurvival[] = responseData.KM_curves.map((curve, index) => {
      const treatment = responseData.Treatments[index];
      const { medianSurvival, maxTime } = calculateMedianSurvival(curve);
      
      return {
        treatment,
        medianSurvival,
        maxTime,
        displayName: treatment.replace(/_/g, ' ')
      };
    });

    // Sort by median survival (descending - higher is better)
    // Treatments that don't reach 50% mortality get highest priority
    const sortedSurvivals = survivalData.sort((a, b) => {
      if (a.medianSurvival === null && b.medianSurvival === null) return 0;
      if (a.medianSurvival === null) return -1; // null means better (didn't reach 50% mortality)
      if (b.medianSurvival === null) return 1;
      return b.medianSurvival - a.medianSurvival; // Higher months = better
    });

    setTreatmentSurvivals(sortedSurvivals);
    setBestTreatment(sortedSurvivals[0]);
  }, [responseData]);

  const formatSurvivalTime = (months: number | null, maxTime: number): string => {
    if (months === null) {
      return `>${maxTime.toFixed(0)}個月`;
    }
    else {
      return `${months.toFixed(1)} 個月`;
    }
  };

  const getRiskLevel = (months: number | null): { level: string; class: string } => {
    if (months === null) {
      return { level: "極低風險", class: "bg-success" };
    }
    if (months >= 36) {
      return { level: "低風險", class: "bg-success" };
    } else if (months >= 24) {
      return { level: "中等風險", class: "bg-warning text-dark" };
    } else if (months >= 12) {
      return { level: "中高風險", class: "bg-warning text-dark" };
    } else {
      return { level: "高風險", class: "bg-danger" };
    }
  };

  if (!bestTreatment) {
    return (
      <div className="text-center text-muted p-4">
        <p>無法計算存活率數據</p>
      </div>
    );
  }

  const bestRisk = getRiskLevel(bestTreatment.medianSurvival);

  return (
    <>
      <h5>存活率中位數預測</h5>
      
      {/* Best Treatment - Featured Display */}
      <div className="card mb-4 border-primary">
        <div className="card-header bg-primary text-white">
          <h6 className="mb-0">
            <div className="d-flex justify-content-between align-items-start">
              <h6 style={{margin: "auto 0", fontWeight: 900}}>推薦治療方案: {bestTreatment.displayName}</h6>
              <span className={`badge ${bestRisk.class} small`} style={{margin: "auto 0"}}>{bestRisk.level}</span>
            </div>
          </h6>
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="text-center">
                <div className="h2 text-primary">
                  {formatSurvivalTime(bestTreatment.medianSurvival, bestTreatment.maxTime)}
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <p className="mb-2">
                <strong>{bestTreatment.displayName}</strong> 治療方案顯示最佳的存活率表現。
                {bestTreatment.medianSurvival === null 
                  ? "在觀察期內，患者存活率未曾低於50%。"
                  : `預計患者在 ${formatSurvivalTime(bestTreatment.medianSurvival, bestTreatment.maxTime)} 前有高於50%的存活率。`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Treatments Comparison */}
      {treatmentSurvivals.length > 1 && (
        <div className="card">
          <div className="card-header">
            <h6 style={{margin: "auto 0", fontWeight: 900}}>其他治療方案比較</h6>
          </div>
          <div className="card-body">
            {treatmentSurvivals.slice(1).map((treatment) => {
              const risk = getRiskLevel(treatment.medianSurvival);
              return (
                <div key={treatment.treatment} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="me-2">{treatment.displayName}</span>
                    <span className={`badge ${risk.class} small`}>{risk.level}</span>
                  </div>
                  <div className="h6 mb-0">
                    {formatSurvivalTime(treatment.medianSurvival, treatment.maxTime)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-3">
        <small className="text-muted">
          <strong>說明：</strong>「存活率中位數」 表示患者預計在多少個月前，仍有高於50%的存活率。
          數值越大表示治療效果越好。
        </small>
      </div>
    </>
  );
}

export default SurvivalPrediction;