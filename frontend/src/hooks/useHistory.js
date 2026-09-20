import { useState, useCallback, useEffect, useContext } from 'react';
import { getHistory } from '../api/history';
import { getResults } from '../api/enhancement';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

// The backend's /history list only returns image records (no score/issues) —
// diagnosis/enhancement data lives at GET /results/{image_id}. Fetch it per
// item so the History page can still show scores like before.
async function enrich(image) {
  try {
    const result = await getResults(image.id);
    return {
      id: image.id,
      filename: image.original_filename,
      createdAt: image.created_at,
      score: Math.round(result.enhancement?.quality_after ?? result.diagnosis?.overall_quality_score ?? 0),
      thumbnailUrl: result.enhancement?.enhanced_storage_url || image.storage_url,
      issues: result.diagnosis?.issues || [],
    };
  } catch {
    // No diagnosis/enhancement yet for this image — show it with what we have.
    return {
      id: image.id,
      filename: image.original_filename,
      createdAt: image.created_at,
      score: 0,
      thumbnailUrl: image.storage_url,
      issues: [],
    };
  }
}

export function useHistory(initialFilters = {}) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { pushToast } = useContext(AppContext);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const images = await getHistory({ status: filters.status });
      const enriched = await Promise.all(images.map(enrich));
      setItems(enriched);
    } catch (err) {
      setError(err.message || 'Could not load your history.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    load();
  }, [load]);

  // The backend doesn't have a delete-image endpoint yet, so there's nothing
  // to actually call. Being upfront about that beats a delete button that
  // looks like it worked but didn't touch the server.
  const removeItem = useCallback(() => {
    pushToast("Deleting isn't supported by the backend yet.", 'error');
  }, [pushToast]);

  return { items, filters, setFilters, loading, error, reload: load, removeItem };
}
