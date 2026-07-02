import React from 'react';
import { AuthProvider } from './context/AuthContext'; // ◄ Verify this file was fully replaced with the Supabase code!
import WorkspaceContainer from './components/WorkspaceContainer';

function App() {
  return (
    <AuthProvider>
      <WorkspaceContainer />
    </AuthProvider>
  );
}

export default App;