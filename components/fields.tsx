'use client'

import { useFormContext } from 'react-hook-form'
import type { ReactNode } from 'react'

function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext()
  const err = (errors as Record<string, { message?: string }>)[name]
  return err?.message
}

function FieldShell({
  name,
  label,
  required,
  hint,
  children,
}: {
  name: string
  label: string
  required?: boolean
  hint?: ReactNode
  children: ReactNode
}) {
  const error = useFieldError(name)
  return (
    <div>
      <label htmlFor={name} className="fco-label">
        {label} {required && <span className="text-erreur">*</span>}
      </label>
      {children}
      {error ? (
        <p className="fco-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="fco-hint">{hint}</p>
      ) : null}
    </div>
  )
}

export function TextField({
  name,
  label,
  required,
  hint,
  type = 'text',
  placeholder,
  inputMode,
}: {
  name: string
  label: string
  required?: boolean
  hint?: ReactNode
  type?: string
  placeholder?: string
  inputMode?: 'text' | 'tel' | 'email' | 'url'
}) {
  const { register } = useFormContext()
  const error = useFieldError(name)
  return (
    <FieldShell name={name} label={label} required={required} hint={hint}>
      <input
        id={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        className={`fco-input ${error ? 'fco-input-error' : ''}`}
        {...register(name)}
      />
    </FieldShell>
  )
}

export function TextareaField({
  name,
  label,
  required,
  hint,
  placeholder,
  rows = 4,
  minLength,
}: {
  name: string
  label: string
  required?: boolean
  hint?: ReactNode
  placeholder?: string
  rows?: number
  minLength?: number
}) {
  const { register, watch } = useFormContext()
  const error = useFieldError(name)
  const value: string = watch(name) ?? ''
  const counter =
    minLength != null ? (
      <span className={value.length >= minLength ? 'text-succes' : ''}>
        {value.length} / {minLength} caractères minimum
      </span>
    ) : (
      hint
    )
  return (
    <FieldShell name={name} label={label} required={required} hint={counter}>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={`fco-input resize-y ${error ? 'fco-input-error' : ''}`}
        {...register(name)}
      />
    </FieldShell>
  )
}

export function SelectField({
  name,
  label,
  options,
  required,
  hint,
  placeholder = 'Sélectionner…',
}: {
  name: string
  label: string
  options: readonly string[]
  required?: boolean
  hint?: ReactNode
  placeholder?: string
}) {
  const { register } = useFormContext()
  const error = useFieldError(name)
  return (
    <FieldShell name={name} label={label} required={required} hint={hint}>
      <select
        id={name}
        defaultValue=""
        className={`fco-input ${error ? 'fco-input-error' : ''}`}
        {...register(name)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function CheckboxField({
  name,
  label,
}: {
  name: string
  label: ReactNode
}) {
  const { register } = useFormContext()
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-nuit/15 bg-white p-4 transition hover:bg-ciel/50">
      <input
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-nuit/30 text-madeb accent-madeb focus:ring-madeb/40"
        {...register(name)}
      />
      <span className="text-sm text-nuit">{label}</span>
    </label>
  )
}

export function CheckboxGroup({
  name,
  label,
  options,
  hint,
}: {
  name: string
  label: string
  options: readonly string[]
  hint?: ReactNode
}) {
  const { register } = useFormContext()
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-nuit/15 bg-white px-3 py-2.5 text-sm transition hover:bg-ciel/50"
          >
            <input
              type="checkbox"
              value={opt}
              className="h-4 w-4 rounded border-nuit/30 accent-madeb"
              {...register(name)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </FieldShell>
  )
}
