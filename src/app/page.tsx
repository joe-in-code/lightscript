import { AppProvider, useApp } from './AppContext';
import StorySelection from '@/components/StorySelection';
import CustomizationForm from '@/components/CustomizationForm';
import StoryResult from '@/components/StoryResult';
import type { BibleStory, AppliedModification } from '@/types';
import { customizationSchema } from '@/data/stories';

function AppContent() {
  const { state, setStep, selectStory, setResult } = useApp();

  const handleSelectStory = (story: BibleStory) => {
    selectStory(story);
  };

  const handleSubmitCustomizations = async (
    customizations: Record<string, string>
  ) => {
    if (!state.selectedStory) return;

    const response = await fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId: state.selectedStory.id,
        customizations,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors?.join(', ') || 'Failed to transform story');
    }

    const data = await response.json();
    setResult({
      narrative: data.narrative,
      modifications: data.modifications as AppliedModification[],
    });
  };

  const handleRegenerate = () => {
    setStep('customize');
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {state.step === 'select' && (
        <StorySelection onSelect={handleSelectStory} />
      )}

      {state.step === 'customize' && state.selectedStory && (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setStep('select')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to stories
          </button>
          <CustomizationForm
            story={state.selectedStory}
            schema={customizationSchema}
            onSubmit={handleSubmitCustomizations}
          />
        </div>
      )}

      {state.step === 'result' && state.result && state.selectedStory && (
        <div className="space-y-6">
          <button
            type="button"
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to customization
          </button>
          <StoryResult
            result={state.result}
            story={state.selectedStory}
            onRegenerate={handleRegenerate}
          />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
