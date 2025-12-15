import { AuthProvider, useAuth } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { user } = useAuth();
  // Redirect to Dashboard after login 
  return user ? <Dashboard /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <AppContent />
      </HabitProvider>
    </AuthProvider>
  );
}

export default App;