// Kept in sync with backend's ALLOWED_IMAGE_TYPES (.env) — TIFF was accepted
// here before but the backend rejects it, so a TIFF upload would pass this
// check and then fail on the server with a confusing error.
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_MB = Number(import.meta.env.VITE_MAX_UPLOAD_MB || 10);
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function isAcceptedImageType(file) {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
}

export function isWithinSizeLimit(file) {
  return file.size <= MAX_FILE_SIZE_BYTES;
}

export function validateImageFile(file) {
  const errors = [];
  if (!file) {
    errors.push('No file selected.');
    return { valid: false, errors };
  }
  if (!isAcceptedImageType(file)) {
    errors.push('Unsupported file type. Use JPEG, PNG, or WEBP.');
  }
  if (!isWithinSizeLimit(file)) {
    errors.push(`File is larger than the ${MAX_FILE_SIZE_MB}MB limit.`);
  }
  return { valid: errors.length === 0, errors };
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
