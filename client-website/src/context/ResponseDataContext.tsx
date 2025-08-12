interface KMCurveData {
  x: number[];
  KM_estimate: number[];
  Lower_CI: number[];
  Upper_CI: number[];
}

export interface ResponseData {
  Treatments: string[];
  KM_curves: KMCurveData[];
}