import { http } from './http';
import { ENDPOINTS } from './config';

export function getDiagnosis(imageId) {
  return http.get(ENDPOINTS.diagnosis(imageId));
}

export function runDiagnosis(imageId) {
  return http.post(ENDPOINTS.runDiagnosis(imageId));
}

export const diagnosisApi = { getDiagnosis, runDiagnosis };
export default diagnosisApi;
