import { ENDPOINTS, API_BASE_URL } from './config';
import { getToken } from './http';

/**
 * Uploads an image file with progress reporting.
 * Uses XMLHttpRequest instead of fetch so we can track upload progress.
 * Backend: POST /upload (multipart, field name "file") -> ImageOut.
 */
export function uploadImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}${ENDPOINTS.upload}`);

    const token = getToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        let message = `Upload failed with status ${xhr.status}`;
        try {
          const parsed = JSON.parse(xhr.responseText);
          if (typeof parsed.detail === 'string') message = parsed.detail;
        } catch {
          // ignore parse failure, keep default message
        }
        reject(new Error(message));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export function cancelUpload(xhr) {
  if (xhr) xhr.abort();
}

export const uploadApi = { uploadImage, cancelUpload };
export default uploadApi;
