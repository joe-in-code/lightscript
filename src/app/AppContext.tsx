'use client';

import type {
  BibleStory,
  TransformResult,
} from '@/types';
import { createContext, useContext, useState } from 'react';

type Step = 'select' | 'customize' | 'result';

type AppState = {
  step: Step;
  selectedStory: BibleStory | null;
  result: TransformResult | null;
};

type AppContextValue = {
  state: AppState;
  setStep: (step: Step) => void;
  selectStory: (story: BibleStory) => void;
  setResult: (result: TransformResult) => void;
  reset: () => void;
};

const initialState: AppState = {
  step: 'select',
  selectedStory: null,
  result: null,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setStep = (step: Step) => {
    setState((prev) => ({ ...prev, step }));
  };

  const selectStory = (story: BibleStory) => {
    setState({
      step: 'customize',
      selectedStory: story,
      result: null,
    });
  };

  const setResult = (result: TransformResult) => {
    setState((prev) => ({
      ...prev,
      step: 'result',
      result,
    }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <AppContext.Provider
      value={{ state, setStep, selectStory, setResult, reset }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
