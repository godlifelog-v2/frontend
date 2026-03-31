import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicRoutineList } from "../services/routineService";

export const useRoutineList = () => {
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    target: "",
    job: "",
    sort: "latest",
    order: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const navigate = useNavigate();

  const fetchRoutines = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        size: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (filters.status && filters.status !== "all") params.status = filters.status;
      if (filters.target && filters.target.trim() !== "") params.target = filters.target;
      if (filters.job && filters.job.trim() !== "") params.job = filters.job;
      if (filters.sort) params.sort = filters.sort;
      if (filters.order) params.order = filters.order;

      const data = await getPublicRoutineList(params);

      if (data && data.plans) {
        setRoutines(data.plans);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      } else {
        setRoutines([]);
        setTotalPages(1);
        setTotalPosts(0);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 204) {
        setRoutines([]);
      } else if (status >= 400) {
        setError("루틴 목록을 불러오는데 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filters]);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const handleSearch = (inputValue) => {
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ status: "all", target: "", job: "", sort: "latest", order: "desc" });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (planIdx) => {
    navigate(`/routine/detail/${planIdx}`);
  };

  const handleAddNewRoutine = () => {
    navigate("/routine/create");
  };

  return {
    routines,
    isLoading,
    error,
    searchTerm,
    filters,
    currentPage,
    totalPages,
    totalPosts,
    handleSearch,
    handleFilterChange,
    handleResetFilters,
    handlePageChange,
    handleCardClick,
    handleAddNewRoutine,
  };
};
