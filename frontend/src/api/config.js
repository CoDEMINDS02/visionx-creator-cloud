export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// These must match backend/app/api/routes/*.py exactly.
export const ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login',
  me: '/auth/me',

  upload: '/upload',

  // Backend: POST /diagnosis/{image_id} runs it, GET /diagnosis/{image_id} fetches the latest.
  diagnosis: (imageId) => `/diagnosis/${imageId}`,
  runDiagnosis: (imageId) => `/diagnosis/${imageId}`,

  // Backend: POST /enhancement/{image_id} runs it SYNCHRONOUSLY and returns the
  // finished result directly — there is no job queue/polling endpoint.
  runEnhancement: (imageId) => `/enhancement/${imageId}`,

  results: (imageId) => `/results/${imageId}`,

  // Backend only supports `status`, `limit`, `offset` query params — no
  // issueType/minScore/date-range filtering (that lived in the old local-only build).
  history: '/history',
};
