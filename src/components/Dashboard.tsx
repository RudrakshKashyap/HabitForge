import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHabit } from '../context/HabitContext';
import { LogOut, Trash2 } from 'lucide-react';

import type { FormEvent } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { habits, addHabit, toggleDay, deleteHabit } = useHabit();
  
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [color, setColor] = useState<string>(COLORS[0]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    addHabit(name, category, color); 
    setName('');
    setCategory('');
  };

  if (!user) return null; // Should not happen 

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">HabitForge</h1>
          <p className="text-gray-600">Welcome, {user.mobile}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:text-red-800">
          <LogOut size={20} /> Logout
        </button>
      </header>

      {/* Add Habit Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Habit</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Habit Name</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)} 
              className="w-full p-2 border rounded" placeholder="e.g. Exercise" 
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <input 
              value={category} onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-2 border rounded" placeholder="e.g. Health" 
            />
          </div>
          <div>
             <label className="block text-sm text-gray-600 mb-1">Color</label>
             <div className="flex gap-2">
               {COLORS.map(c => (
                 <button 
                   type="button" 
                   key={c}
                   onClick={() => setColor(c)}
                   className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-black' : 'border-transparent'}`}
                   style={{ backgroundColor: c }}
                 />
               ))}
             </div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Add
          </button>
        </form>
      </div>

      {/* Habits List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {habits.length === 0 ? (
          <p className="text-center text-gray-500">No habits found. Start by adding one!</p>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="w-4 h-12 rounded-full" style={{ backgroundColor: habit.color }}></div>
                <div>
                  <h3 className="font-bold text-lg">{habit.name}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{habit.category}</span>
                </div>
              </div>

              {/* 7-Day Grid */}
              <div className="flex gap-2">
                {DAYS.map((day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">{day}</span>
                    <button
                      onClick={() => toggleDay(habit.id, index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        habit.completedDays[index] 
                          ? 'text-white' 
                          : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                      }`}
                      style={{ backgroundColor: habit.completedDays[index] ? habit.color : undefined }}
                    >
                      {habit.completedDays[index] ? '✓' : ''}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                   <p className="text-xs text-gray-500">Streak</p>
                   {/* Streak calculation */}
                   <p className="font-bold">{habit.completedDays.filter(Boolean).length}</p>
                </div>
                <button onClick={() => deleteHabit(habit.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}