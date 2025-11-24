import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TrialDaysContextType {
  trialDays: number;
  setTrialDays: (days: number) => void;
}

const TrialDaysContext = createContext<TrialDaysContextType | undefined>(undefined);

export function TrialDaysProvider({ children }: { children: ReactNode }) {
  // Siempre usar 7 días como valor por defecto
  const [trialDays, setTrialDaysState] = useState<number>(7);

  // Inicializar y forzar el valor a 7 días
  useEffect(() => {
    // Forzar actualización a 7 días al inicio
    localStorage.setItem('trialDays', '7');
    setTrialDaysState(7);
  }, []);

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('trialDays', String(trialDays));
  }, [trialDays]);

  const setTrialDays = (days: number) => {
    setTrialDaysState(days);
  };

  return (
    <TrialDaysContext.Provider value={{ trialDays, setTrialDays }}>
      {children}
    </TrialDaysContext.Provider>
  );
}

export function useTrialDays() {
  const context = useContext(TrialDaysContext);
  if (context === undefined) {
    throw new Error('useTrialDays must be used within a TrialDaysProvider');
  }
  return context;
}