import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

import type { ReactNode } from 'react';


// --- Types ---
export interface Habit {
  id: number;
  userMobile: string;
  name: string;
  category: string;
  color: string;
  completedDays: boolean[]; // Array of 7 booleans (Mon-Sun)
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, category: string, color: string) => void;
  toggleDay: (habitId: number, dayIndex: number) => void;
  deleteHabit: (habitId: number) => void;
}

// --- Hook ---
export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

// --- Context ---
const HabitContext = createContext<HabitContextType | undefined>(undefined);


// --- Provider ---
export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load all habits from LocalStorage on mount
  // * ignore the warning coming from linter, or just move the code to above useState
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
    }
  }, []);

  // Save habits to LocalStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) { // Only save if we have initialized
        localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Filter habits for the current user only
  const userHabits = user ? habits.filter(h => h.userMobile === user.mobile) : [];

  const addHabit = (name: string, category: string, color: string) => {
    if (!user) return;
    const newHabit: Habit = {
      id: Date.now(),
      userMobile: user.mobile,
      name,
      category,
      color,
      completedDays: [false, false, false, false, false, false, false], // Mon-Sun
    };
    // Update global habits state by appending new habit
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleDay = (habitId: number, dayIndex: number) => {
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completedDays];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        return { ...habit, completedDays: newCompleted };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: number) => {
     setHabits(prev => prev.filter(h => h.id !== habitId));
  }

  return (
    <HabitContext.Provider value={{ habits: userHabits, addHabit, toggleDay, deleteHabit }}>
      {children}
    </HabitContext.Provider>
  );
};