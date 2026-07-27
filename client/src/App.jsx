import AppRoutes from './routes/AppRoutes.jsx';

// One-time migration: clear old malformed auth storage so refresh works correctly
try {
  const raw = localStorage.getItem('userInfo');
  if (raw) {
    const parsed = JSON.parse(raw);
    // Old format had nested { success, data: { user, accessToken } }
    // If it still has the old nested shape, clear it so user re-logs in fresh
    if (parsed?.success !== undefined || parsed?.data !== undefined) {
      localStorage.removeItem('userInfo');
    }
  }
} catch {
  localStorage.removeItem('userInfo');
}

function App() {
  return <AppRoutes />;
}

export default App;
