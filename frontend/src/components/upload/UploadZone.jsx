import { useState, useRef, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadZone({ onFileSelected }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      if (files && files[0]) onFileSelected(files[0]);
    },
    [onFileSelected]
  );

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="zone-icon">
        <UploadCloud />
      </div>
      <h3>Drop a photo here, or click to browse</h3>
      <p>We'll diagnose it in seconds before touching a single pixel.</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/tiff"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
