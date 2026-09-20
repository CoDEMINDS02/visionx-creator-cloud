import { http } from './http';
import { ENDPOINTS } from './config';

/**
 * Backend: GET /history?status=&limit=&offset=  -> ImageOut[]
 * Note: the backend does NOT currently support per-item GET or DELETE on
 * history — those endpoints don't exist yet. Filtering by issue type / score
 * range (from the old local-only build) also isn't supported server-side.
 */
export function getHistory({ status, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams(
    Object.entries({ status, limit, offset }).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  return http.get(`${ENDPOINTS.history}${params ? `?${params}` : ''}`);
}

export const historyApi = { getHistory };
export default historyApi;
