import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLatestPlans } from '../services/homeService';

export const useLatestPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLatestPlans();
      setPlans(data.plans || []);
    } catch (err) {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const nextPlan = () => setCurrentPlanIndex((prev) => (prev + 1) % plans.length);
  const prevPlan = () => setCurrentPlanIndex((prev) => (prev - 1 + plans.length) % plans.length);

  const handlePlanClick = (plan) => {
    const planIdx = plan.planInfos?.planIdx;
    if (planIdx) navigate(`/routine/detail/${planIdx}`);
  };

  return { plans, currentPlanIndex, loading, nextPlan, prevPlan, handlePlanClick };
};
