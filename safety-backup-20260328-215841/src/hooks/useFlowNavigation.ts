import { useNavigate, useLocation } from 'react-router-dom';

export function useFlowNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Try to determine current flow and step from URL or state
  const pathname = location.pathname;
  const isFlow = pathname.includes('/umzugsofferten') || pathname.includes('/vergleich');
  
  // Very basic step extraction if path has /step/3
  const stepMatch = pathname.match(/\/step\/(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;
  const totalSteps = 5; // Assumed total steps

  const goBack = () => {
    navigate(-1);
  };

  const restartFlow = () => {
    navigate('/vergleich');
  };

  const goHome = () => {
    navigate('/');
  };

  return {
    isFlow,
    currentStep,
    totalSteps,
    goBack,
    restartFlow,
    goHome,
    currentPath: pathname
  };
}