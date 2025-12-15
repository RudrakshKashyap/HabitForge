import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';

// Component for a single digit input box
const PinInput = ({ index, value, onChange, onKeyDown, setPinRef }: { 
  index: number, 
  value: string, 
  onChange: (index: number, value: string) => void, 
  onKeyDown: (e: KeyboardEvent, index: number) => void,
  setPinRef: (el: HTMLInputElement, index: number) => void; 
}) => (
    <input
      ref={(el: HTMLInputElement) => { setPinRef(el, index); }}
      // type="password"
      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(e, index)}
      onPaste={(e) => { e.preventDefault(); }}
    />
);


export default function Login() {
  const [mobile, setMobile] = useState<string>('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']); // State for 4 separate digits
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  // Creating a single refs[] for the four PIN boxes to manage focus
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setPinRef: (el: HTMLInputElement | null, index: number) => void 
  = (el, index) => {
    if (pinRefs.current) {
        pinRefs.current[index] = el;
    }
  };

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
  };

  // Handler for when a digit box value changes
  const handlePinChange = (index: number, value: string) => {
    // Only allow single digit nubmers
    if (/^\d?$/.test(value)) {
      // Update the state array
          const newPin = [...pin];
          newPin[index] = value;
          setPin(newPin);

          // Auto-advance focus if a digit was successfully entered
          if (value && index < 3) {
            pinRefs.current?.[index + 1]?.focus();
          }
    }
  };

  // Handler for backspace/navigation
  const handlePinKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // If backspace is pressed on an empty box, move focus back
      pinRefs.current?.[index - 1]?.focus();
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Combine the 4 pin digits into a single string for storage/comparison
    const combinedPin = pin.join('');

    if (mobile.length !== 10) return setError("Mobile number must be 10 digits");
    if (combinedPin.length !== 4) return setError("Password must be 4 digits"); 


    // Call the login function from AuthContext
    const result = login(mobile, combinedPin);

    if (!result.success) {
      setError(result.message || "Login failed"); 
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">HabitForge</h2>
        
        {error && <p className="text-red-600 bg-red-100 p-3 text-sm mb-4 rounded-lg text-center border border-red-200">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel" // Suggests a numeric keypad on mobile devices
              inputMode="numeric" // Reinforces the numeric input suggestion
              pattern="[0-9]*" // Restricts input to numbers (though soft)
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={mobile}
              onChange={(e) => handleMobileChange(e)}
              placeholder="10-digit number"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">4-Digit PIN</label>
            <div className="flex justify-between space-x-2">
              {pin.map((digit, index) => (
                <PinInput
                  key={index}
                  index={index}
                  value={digit}
                  setPinRef={setPinRef}
                  onChange={handlePinChange}
                  onKeyDown={handlePinKeyDown}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-semibold p-3 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md transform hover:scale-[1.01]"
          >
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
}