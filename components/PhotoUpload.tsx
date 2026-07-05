'use client'

import { useEffect, useRef, useState } from 'react'
import { ACCEPTED_IMAGE_TYPES, MAX_PHOTO_SIZE } from '@/lib/validations'

export function PhotoUpload({
  value,
  onChange,
  error,
}: {
  value: File | null
  onChange: (file: File | null) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  function handleFile(file: File | undefined) {
    if (!file) return
    onChange(file)
  }

  return (
    <div>
      <span className="fco-label">
        Photo de profil <span className="text-erreur">*</span>
      </span>

      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-nuit/20 bg-ciel/50">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Aperçu"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl text-nuit/30">📷</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="fco-btn-ghost px-4 py-2 text-sm"
          >
            {value ? 'Changer la photo' : 'Choisir une photo'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
              className="text-left text-sm font-medium text-erreur hover:underline"
            >
              Retirer
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error ? (
        <p className="fco-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="fco-hint">
          JPEG, PNG ou WebP — {Math.round(MAX_PHOTO_SIZE / (1024 * 1024))} Mo
          maximum.
        </p>
      )}
    </div>
  )
}
