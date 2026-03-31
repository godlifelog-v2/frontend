import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { fetchMyPlans } from '../services/homeService';

export const useMyPlans = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [myPlans, setMyPlans] = useState([]);
  const [currentMyPlanIndex, setCurrentMyPlanIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMyPlans();
      setMyPlans(data.message || []);
    } catch (err) {
      setMyPlans([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    load();
  }, [load]);

  const nextMyPlan = () =>
    setCurrentMyPlanIndex((prev) => (prev + 1) % myPlans.length);
  const prevMyPlan = () =>
    setCurrentMyPlanIndex((prev) => (prev - 1 + myPlans.length) % myPlans.length);

  const handleMyPlanClick = (myplan) => {
    const planIdx = myplan.myPlanInfos?.planIdx;
    if (planIdx) navigate(`/routine/detail/${planIdx}`);
  };

  return {
    myPlans,
    currentMyPlanIndex,
    loading,
    isAuthenticated,
    nextMyPlan,
    prevMyPlan,
    handleMyPlanClick,
  };
};
