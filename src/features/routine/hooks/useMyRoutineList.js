import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRoutineList } from "../services/routineService";

export const useMyRoutineList = () => {
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchRoutines = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyRoutineList();

      if (data && data.status === "success") {
        setRoutines(data.message || []);
      } else {
        setRoutines([]);
      }
    } catch (err) {
      if (err.response?.status === 204) {
        setRoutines([]);
      } else {
        setError("루틴 목록을 불러오는데 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const handleCardClick = (planIdx) => {
    navigate(`/routine/detail/${planIdx}`);
  };

  const handleAddNewRoutine = () => {
    navigate("/routine/create");
  };

  const handleRetry = () => {
    fetchRoutines();
  };

  return {
    routines,
    isLoading,
    error,
    handleCardClick,
    handleAddNewRoutine,
    handleRetry,
  };
};
