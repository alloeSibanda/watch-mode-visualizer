import React from 'react';
import { AuthProvider } from './context/AuthContext';
import WorkspaceContainer from './components/WorkspaceContainer';

function App() {
  return (
    <AuthProvider>
      <WorkspaceContainer />
    </AuthProvider>
  );
}

export default App;