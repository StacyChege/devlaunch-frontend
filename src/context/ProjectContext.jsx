/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

// Shares the active project name with the Topbar without passing
// it as props through DashboardLayout
const ProjectContext = createContext(null);

/**
 * Global Context Wrapper Provider Component.
 * Wraps your application's layout route structures so child components 
 * can globally track or update the currently active project environment.
 */
export function ProjectProvider({ children }) {
  const [currentProjectName, setCurrentProjectName] = useState(null);

  return (
    <ProjectContext.Provider value={{ currentProjectName, setCurrentProjectName }}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Custom hook to safely grab project context values.
 * 💡 If this name is still underlined in red, make sure you save the file, 
 * then import and use it in another file like Topbar.jsx. 
 */
export function useProject() {
  const context = useContext(ProjectContext);
  
  // Safety Guard Breakpoint: Ensures developers don't call this hook
  // outside of the parent <ProjectProvider /> tree hierarchy wrapper block.
  if (!context) {
    throw new Error('useProject must be used inside a ProjectProvider');
  }
  return context;
}