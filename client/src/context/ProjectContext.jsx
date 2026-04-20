import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0 && !activeProject) {
        setActiveProject(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoadingProjects(false);
    }
  }, [activeProject]);

  const createProject = async (data) => {
    const res = await api.post('/projects', data);
    setProjects(prev => [res.data, ...prev]);
    setActiveProject(res.data);
    return res.data;
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p._id !== id));
    if (activeProject?._id === id) {
      setActiveProject(null);
    }
  };

  const fetchTickets = useCallback(async (projectId, filters = {}) => {
    try {
      const params = { projectId, ...filters };
      const res = await api.get('/tickets', { params });
      setTickets(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to load tickets', err);
    }
  }, []);

  const createTicket = async (data) => {
    const res = await api.post('/tickets', data);
    setTickets(prev => [res.data, ...prev]);
    return res.data;
  };

  const updateTicket = async (id, data) => {
    const res = await api.put(`/tickets/${id}`, data);
    setTickets(prev => prev.map(t => t._id === id ? res.data : t));
    return res.data;
  };

  const deleteTicket = async (id) => {
    await api.delete(`/tickets/${id}`);
    setTickets(prev => prev.filter(t => t._id !== id));
  };

  const generateAiDescription = async (title) => {
    const res = await api.post('/ai/generate-description', { title });
    return res.data.description;
  };

  return (
    <ProjectContext.Provider value={{
      projects, activeProject, setActiveProject,
      tickets, setTickets,
      loadingProjects,
      fetchProjects, createProject, deleteProject,
      fetchTickets, createTicket, updateTicket, deleteTicket,
      generateAiDescription
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProject() {
  return useContext(ProjectContext);
}
