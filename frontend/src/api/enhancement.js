import { http } from './http';
import { ENDPOINTS } from './config';

/**
 * payload: { operations?: string[], preset?: string }
 * Backend runs this SYNCHRONOUSLY and returns the finished EnhancementOut
 * directly — there's no job id to poll.
 */
export function runEnhancement(imageId, payload) {
  return http.post(ENDPOINTS.runEnhancement(imageId), payload);
}

export function getResults(imageId) {
  return http.get(ENDPOINTS.results(imageId));
}

export const enhancementApi = { runEnhancement, getResults };
export default enhancementApi;
