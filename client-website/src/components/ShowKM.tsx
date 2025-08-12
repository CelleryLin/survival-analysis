import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js';
import type { Layout } from 'plotly.js';
import type { ResponseData } from '../context/ResponseDataContext';

interface ShowKmProps {
  responseData: ResponseData;
}

const ShowKm: React.FC<ShowKmProps> = ({ responseData }) => {

  const [style, setStyle] = useState<Partial<Layout>>({
    margin: { t: 10, b: 10, l: 10, r: 10,},
    yaxis: {
      title: {
        text: 'Probability',
        font: { size: 12 },
      },
      tickfont: { size: 10 },
      automargin: true,
      ticklabelposition: "inside top",
    },
    xaxis: {
      title: {
        text: 'Time (months)',
        font: { size: 12 }
      },
      tickfont: { size: 10 },
      automargin: true,
    },
    legend: {
      itemclick: false,
      itemdoubleclick: false,
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      xanchor: "auto",
      x: 0,
      bgcolor: 'rgba(255, 255, 255, 0.3)',
      font: { size: 10 }
    },
  });

  // Generate colors for each treatment
  const treatmentColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];

  const [treatmentVis, setTreatmentVis] = useState<{ [key: string]: boolean }>({});
  const [plotData, setPlotData] = useState<any[]>([]);

  // Initialize treatmentVis state based on responseData
  useEffect(() => {
    if (!responseData?.Treatments) {
      return;
    }

    const initialVis: { [key: string]: boolean } = {};
    responseData.Treatments.forEach((treatment) => {
      initialVis[treatment] = true;
      initialVis[treatment + '_ci'] = true;
    });
    setTreatmentVis(initialVis);
  }, [responseData]);
  
  // Create plot data from responseData
  useEffect(() => {
    if (!responseData?.KM_curves || !responseData?.Treatments) {
      return;
    }

    const newPlotData: any[] = [];

    responseData.KM_curves.forEach((curve, index) => {
      const treatment = responseData.Treatments[index];
      const color = treatmentColors[index % treatmentColors.length];

      // Confidence interval (fill area)
      newPlotData.push({
        x: [...curve.x, ...curve.x.slice().reverse()],
        y: [...curve.Upper_CI, ...curve.Lower_CI.slice().reverse()],
        type: 'scatter',
        mode: 'lines',
        fill: 'toself',
        fillcolor: color + '33', // 20% opacity
        line: { color: 'transparent' },
        name: `${treatment} CI`,
        showlegend: false,
        visible: treatmentVis[treatment + '_ci'] ? true : false,
      });

      // Main KM curve
      newPlotData.push({
        x: curve.x,
        y: curve.KM_estimate,
        type: 'scatter',
        mode: 'lines',
        name: treatment,
        line: { color: color, width: 2 },
        visible: treatmentVis[treatment] ? true : 'legendonly',
      });
    });

    setPlotData(newPlotData);

  }, [treatmentVis]);

  useEffect(() => {
    const updateChartSize = () => {
      const chartBox = document.getElementById("chart_box");
      if (chartBox) {
        setStyle((prev) => ({
          ...prev,
          width: chartBox.offsetWidth * 0.95,
          height: chartBox.offsetWidth * 0.6,
        }));
      }
    };

    // Initial size update with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateChartSize, 100);

    // Update on window resize
    window.addEventListener('resize', updateChartSize);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateChartSize);
    };
  }, []);

  // Additional effect to update size when responseData changes
  useEffect(() => {
    const updateChartSize = () => {
      const chartBox = document.getElementById("chart_box");
      if (chartBox) {
        setStyle((prev) => ({
          ...prev,
          width: chartBox.offsetWidth * 0.95,
          height: chartBox.offsetWidth * 0.6,
        }));
      }
    };

    if (responseData?.KM_curves) {
      // Use a small delay to ensure the DOM has updated
      const timeoutId = setTimeout(updateChartSize, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [responseData]);

  const handleLegendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTreatmentVis((prev) => ({
      ...prev,
      [name]: checked,
      [name + "_ci"]: checked,
    }));
  };

  const handleSelectAll = () => {
    const newVis: { [key: string]: boolean } = {};
    Object.keys(treatmentVis).forEach((key) => {
      newVis[key] = true;
    });
    setTreatmentVis(newVis);
  };

  const handleSelectNone = () => {
    const newVis: { [key: string]: boolean } = {};
    Object.keys(treatmentVis).forEach((key) => {
      newVis[key] = false;
    });
    setTreatmentVis(newVis);
  };

  if (!responseData?.KM_curves || !responseData?.Treatments) {
    return (
      <div className="p-3">
        <p className="text-muted">No KM curve data available</p>
      </div>
    );
  }

  return (
    <div
      id="chart_box"
      className="d-flex flex-column gap-3 p-3 border rounded"
      style={{ width: '100%' }}
    >
      <div className="output_container">
        <h5 className="mb-3" style={{fontSize: "14px"}}>KM Curves</h5>
        <div className="chart_container" id="chart_container">
          <Plot
            data={plotData}
            layout={style}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
            config={{
              responsive: true,
              displayModeBar: false,
            }}
          />
        </div>
        <div className="border rounded p-3 mt-3">
          <div className="btn-group mb-3" role="group" aria-label="Chart controls">
            <button 
              type="button" 
              className="btn btn-outline-primary btn-sm"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button 
              type="button" 
              className="btn btn-outline-primary btn-sm"
              onClick={handleSelectNone}
            >
              Select None
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {responseData.Treatments.map((treatment, index) => {
              const color = treatmentColors[index % treatmentColors.length];
              return (
                <div key={"legvis" + treatment} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`checkbox-${treatment}`}
                    name={treatment}
                    style={{ accentColor: color }}
                    onChange={handleLegendChange}
                    checked={treatmentVis[treatment] || false}
                  />
                  <label 
                    className="form-check-label" 
                    htmlFor={`checkbox-${treatment}`}
                    style={{ color: color, fontSize: '0.9rem' }}
                  >
                    {treatment.replace(/_/g, ' ')}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowKm;