'use client';

import { useMemo, useState } from 'react';
import type {
  BibleStory,
  CustomizationOption,
  CustomizationSchema,
} from '../types';
import { validateCustomizations } from '../lib/guardrails';

type CustomizationFormProps = {
  story: BibleStory;
  schema: CustomizationSchema;
  onSubmit: (customizations: Record<string, string>) => void;
};

type FieldStatus = 'pristine' | 'valid' | 'invalid';

function getInitialValue(
  option: CustomizationOption,
  story: BibleStory
): string {
  const field = option.storyField;
  if (field === 'character.name') return story.characters[0]?.name ?? '';
  if (field === 'character.role') return story.characters[0]?.role ?? '';
  if (field === 'setting') return story.setting.environment;
  if (field === 'timePeriod') return story.timePeriod;
  if (field === 'symbol') return story.keySymbols[0] ?? '';
  return '';
}

function StatusIcon({ status }: { status: FieldStatus }) {
  if (status === 'valid') {
    return (
      <span
        aria-label="Valid"
        className="ml-2 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }
  if (status === 'invalid') {
    return (
      <span
        aria-label="Invalid"
        className="ml-2 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm-.75 7.5a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }
  return null;
}

function FieldInput({
  option,
  value,
  onChange,
  status,
}: {
  option: CustomizationOption;
  value: string;
  onChange: (value: string) => void;
  status: FieldStatus;
}) {
  const borderClass =
    status === 'valid'
      ? 'border-green-500 focus:ring-green-500'
      : status === 'invalid'
        ? 'border-red-500 focus:ring-red-500'
        : 'border-zinc-300 focus:ring-zinc-400 dark:border-zinc-700';

  const baseClass = `w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-zinc-100 ${borderClass}`;

  const inputId = `customization-${option.id}`;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="flex items-center text-sm font-medium text-zinc-800 dark:text-zinc-200"
      >
        <span>{option.label}</span>
        <StatusIcon status={status} />
      </label>
      {option.type === 'textarea' ? (
        <textarea
          id={inputId}
          name={option.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={baseClass}
          placeholder={`Enter ${option.label.toLowerCase()}`}
        />
      ) : option.type === 'select' && option.options ? (
        <select
          id={inputId}
          name={option.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        >
          {option.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          name={option.id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
          placeholder={`Enter ${option.label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

export default function CustomizationForm({
  story,
  schema,
  onSubmit,
}: CustomizationFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of schema) {
      initial[option.id] = getInitialValue(option, story);
    }
    return initial;
  });
  const [dirty, setDirty] = useState<Record<string, boolean>>({});

  const { valid, errors, fieldErrors } = useMemo(() => {
    const result = validateCustomizations(values, story, schema);
    const perField: Record<string, string[]> = {};
    for (const error of result.errors) {
      const match = error.match(/"([^"]+)"/);
      if (!match) continue;
      const fieldId = match[1];
      const option = schema.find((opt) => opt.id === fieldId);
      if (!option) continue;
      if (!perField[fieldId]) perField[fieldId] = [];
      perField[fieldId].push(error);
    }
    return {
      valid: result.valid,
      errors: result.errors,
      fieldErrors: perField,
    };
  }, [values, story, schema]);

  const hasAnyModification = useMemo(
    () => Object.values(dirty).some(Boolean),
    [dirty]
  );

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setDirty((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !hasAnyModification) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Customize {story.title}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Adjust the surface elements of this story. Guardrails protect the
          doctrinal core from being altered.
        </p>
      </div>

      <div className="space-y-5">
        {schema.map((option) => {
          const isDirty = !!dirty[option.id];
          const fieldErrorList = fieldErrors[option.id] ?? [];
          let status: FieldStatus = 'pristine';
          if (isDirty) {
            status = fieldErrorList.length > 0 ? 'invalid' : 'valid';
          }
          return (
            <div key={option.id} className="space-y-1">
              <FieldInput
                option={option}
                value={values[option.id] ?? ''}
                onChange={(value) => handleChange(option.id, value)}
                status={status}
              />
              {status === 'invalid' && fieldErrorList.length > 0 && (
                <ul className="space-y-1 pl-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrorList.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {errors.length > 0 && Object.values(dirty).some(Boolean) && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <p className="font-medium">
            {errors.length === 1
              ? '1 guardrail issue must be resolved'
              : `${errors.length} guardrail issues must be resolved`}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {!hasAnyModification
            ? 'Edit at least one field to enable submit.'
            : valid
              ? 'All guardrails satisfied.'
              : 'Resolve guardrail issues to enable submit.'}
        </p>
        <button
          type="submit"
          disabled={!valid || !hasAnyModification}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
        >
          Generate narrative
        </button>
      </div>
    </form>
  );
}
