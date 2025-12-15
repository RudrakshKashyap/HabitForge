import { AuthProvider, useAuth } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { user } = useAuth();
  // Redirecting to Dashboard after login 
  return user ? <Dashboard /> : <Login />;
};

function App() {
  return (
    // every consumer component re-renders when the context value changes
    <AuthProvider>
      <HabitProvider>
        <AppContent />
      </HabitProvider>
    </AuthProvider>
  );
}

export default App;