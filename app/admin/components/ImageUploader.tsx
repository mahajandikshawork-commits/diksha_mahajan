'use client';

import { useState } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { Upload, X, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabaseBrowser, CLIENT_DIARIES_BUCKET } from '@/lib/supabase-browser';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
}

// Visually-lossless compression settings: resize to max 1920px and re-encode
// as WebP at high quality before uploading to Supabase Storage.
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp' as const,
  initialQuality: 0.92,
};

export default function ImageUploader({ images, onChange, folder }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);

    const fileArray = Array.from(files);
    setProgress({ done: 0, total: fileArray.length });

    const uploaded: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
        const fileName = `${folder}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.webp`;

        const { error: uploadError } = await supabaseBrowser.storage
          .from(CLIENT_DIARIES_BUCKET)
          .upload(fileName, compressed, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: false,
          });

        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`);
          continue;
        }

        const { data } = supabaseBrowser.storage
          .from(CLIENT_DIARIES_BUCKET)
          .getPublicUrl(fileName);

        uploaded.push(data.publicUrl);
      } catch (err: any) {
        setError(err?.message || 'Failed to process image');
      } finally {
        setProgress({ done: i + 1, total: fileArray.length });
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    setProgress(null);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      {/* Existing images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-[3/4] rounded-md overflow-hidden border border-gray-200 group bg-gray-100"
            >
              <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" sizes="200px" />
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-[#DCC898] text-black text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 bg-white/90 rounded text-black disabled:opacity-30"
                  aria-label="Move left"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 rounded text-white"
                  aria-label="Remove"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === images.length - 1}
                  className="p-1.5 bg-white/90 rounded text-black disabled:opacity-30"
                  aria-label="Move right"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <label
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-8 px-4 cursor-pointer hover:border-[#DCC898] transition-colors ${
          uploading ? 'pointer-events-none opacity-70' : ''
        }`}
      >
        {uploading ? (
          <>
            <Loader2 size={24} className="animate-spin text-[#DCC898]" />
            <span className="text-sm text-gray-500">
              Compressing &amp; uploading
              {progress ? ` (${progress.done}/${progress.total})` : '…'}
            </span>
          </>
        ) : (
          <>
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload images
            </span>
            <span className="text-xs text-gray-400">
              Auto-compressed to WebP · max 1920px · first image is the cover
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </label>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
