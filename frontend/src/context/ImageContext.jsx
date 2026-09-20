import { createContext, useState, useCallback } from 'react';

export const ImageContext = createContext(null);

/**
 * Carries the active image through the Upload -> Diagnosis -> Enhancement -> Results flow
 * so pages don't have to re-fetch the same data from each other.
 */
export function ImageProvider({ children }) {
  const [activeImage, setActiveImage] = useState(null); // { id, url, filename, size }
  const [diagnosis, setDiagnosis] = useState(null); // { score, issues[], metrics{} }
  const [enhancementJob, setEnhancementJob] = useState(null); // { id, status, resultUrl }

  const reset = useCallback(() => {
    setActiveImage(null);
    setDiagnosis(null);
    setEnhancementJob(null);
  }, []);

  return (
    <ImageContext.Provider
      value={{
        activeImage,
        setActiveImage,
        diagnosis,
        setDiagnosis,
        enhancementJob,
        setEnhancementJob,
        reset,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
