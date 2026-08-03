'use client';

import { useState } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabaseBrowser, CLIENT_DIARIES_BUCKET } from '@/lib/supabase-browser';

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

interface SingleImageUploadProps {
  value?: string;
  onChange: (image: UploadedImage | null) => void;
  aspect?: string; // tailwind aspect class, e.g. 'aspect-video'
  label?: string;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp' as const,
  initialQuality: 0.92,
};

function readDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 1600, height: 1000 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

// Compact single-image uploader. Images are compressed to WebP and stored in
// the shared `client-diaries` bucket under the `blogs/` folder. The image's
// natural dimensions are returned so the public renderer can reserve space.
export default function SingleImageUpload({
  value,
  onChange,
  aspect = 'aspect-video',
  label = 'Click to upload image',
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      const { width, height } = await readDimensions(compressed);
      const fileName = `blogs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

      const { error: uploadError } = await supabaseBrowser.storage
        .from(CLIENT_DIARIES_BUCKET)
        .upload(fileName, compressed, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        return;
      }

      const { data } = supabaseBrowser.storage
        .from(CLIENT_DIARIES_BUCKET)
        .getPublicUrl(fileName);

      onChange({ url: data.publicUrl, width, height });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  if (value) {
    return (
      <div className={`relative w-full ${aspect} overflow-hidden rounded-md border border-gray-200 bg-gray-100 group`}>
        <Image src={value} alt="Uploaded" fill className="object-cover" sizes="600px" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 rounded bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        className={`flex ${aspect} w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 hover:border-[#DCC898] transition-colors ${
          uploading ? 'pointer-events-none opacity-70' : ''
        }`}
      >
        {uploading ? (
          <>
            <Loader2 size={22} className="animate-spin text-[#DCC898]" />
            <span className="text-sm text-gray-500">Compressing &amp; uploading…</span>
          </>
        ) : (
          <>
            <Upload size={22} className="text-gray-400" />
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-xs text-gray-400">Auto-compressed to WebP</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={uploading}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
