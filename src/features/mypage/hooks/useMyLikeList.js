import { useState, useEffect } from "react";
import {
  fetchMyLikeList,
  deleteLikes,
  fetchJobCategories,
  fetchTargetCategories,
} from "../services/mypageService";
import { useSearchHistory } from "./useSearchHistory";

export const useMyLikeList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routineData, setRoutineData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  const [targetCategories, setTargetCategories] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [filters, setFilters] = useState({
    page: 1,
    size: 3,
    target: null,
    job: null,
    order: "desc",
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const searchHistoryProps = useSearchHistory("liked");

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const [targetData, jobData] = await Promise.all([
        fetchTargetCategories(),
        fetchJobCategories(),
      ]);
      setTargetCategories(targetData || []);
      setJobCategories(jobData || []);
    } catch (err) {
      console.error("카테고리 데이터를 불러오는 중 오류 발생:", err);
      setTargetCategories([]);
      setJobCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadLikedRoutines = async (params = filters) => {
    try {
      setLoading(true);
      const data = await fetchMyLikeList(params);
      setRoutineData(data);
      setError(null);
    } catch (err) {
      console.error("좋아요한 루틴 데이터를 불러오는 중 오류 발생:", err);
      setError("좋아요한 루틴 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      Promise.all([loadCategories(), loadLikedRoutines()]);
    } else {
      setError("로그인이 필요합니다.");
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    loadLikedRoutines(updatedFilters);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    loadLikedRoutines(updatedFilters);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      searchHistoryProps.saveHistory(searchInput.trim());
    }
    handleFilterChange({ search: searchInput });
    searchHistoryProps.setShowSearchHistory(false);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    handleFilterChange({ search: "" });
    searchHistoryProps.setShowSearchHistory(false);
  };

  const handleSearchReset = () => {
    setSearchInput("");
    handleFilterChange({ search: "" });
  };

  const handleFiltersReset = () => {
    setSearchInput("");
    const resetFilters = {
      page: 1,
      size: 3,
      target: null,
      job: null,
      order: "desc",
      search: "",
    };
    setFilters(resetFilters);
    loadLikedRoutines(resetFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleHistoryItemClick = (keyword) => {
    setSearchInput(keyword);
    handleFilterChange({ search: keyword });
    searchHistoryProps.setShowSearchHistory(false);
  };

  const deleteSingleLike = async (planIdx) => {
    if (!window.confirm("이 루틴의 좋아요를 취소하시겠습니까?")) return;

    try {
      setDeletingItem(planIdx);
      await deleteLikes(planIdx);
      alert("좋아요가 취소되었습니다.");
      loadLikedRoutines();
    } catch (err) {
      console.error("좋아요 삭제 중 오류 발생:", err);
      alert("좋아요 취소에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeletingItem(null);
    }
  };

  const deleteAllLikes = async () => {
    const allRoutines = routineData ? routineData.plans : [];
    if (allRoutines.length === 0) {
      alert("취소할 좋아요 루틴이 없습니다.");
      return;
    }
    if (
      !window.confirm(
        `현재 페이지의 모든 좋아요(${allRoutines.length}개)를 취소하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      const planIndexes = allRoutines
        .map((routine) => routine.planInfos.planIdx)
        .join(",");
      await deleteLikes(planIndexes);
      alert("모든 좋아요가 취소되었습니다.");
      loadLikedRoutines();
    } catch (err) {
      console.error("전체 좋아요 삭제 중 오류 발생:", err);
      alert("좋아요 취소에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    routineData,
    loading,
    error,
    filters,
    searchInput,
    setSearchInput,
    showFilters,
    setShowFilters,
    deleteLoading,
    deletingItem,
    targetCategories,
    jobCategories,
    categoriesLoading,
    // 검색 기록 (useSearchHistory에서 위임)
    searchHistory: searchHistoryProps.searchHistory,
    searchHistoryLoading: searchHistoryProps.searchHistoryLoading,
    showSearchHistory: searchHistoryProps.showSearchHistory,
    setShowSearchHistory: searchHistoryProps.setShowSearchHistory,
    searchInputRef: searchHistoryProps.searchInputRef,
    searchHistoryRef: searchHistoryProps.searchHistoryRef,
    handleSearchFocus: searchHistoryProps.handleSearchFocus,
    handleDeleteHistoryItem: searchHistoryProps.handleDeleteHistoryItem,
    // 액션
    handleFilterChange,
    handlePageChange,
    handleSearch,
    handleSearchClear,
    handleSearchReset,
    handleFiltersReset,
    handleKeyPress,
    handleHistoryItemClick,
    deleteSingleLike,
    deleteAllLikes,
    fetchLikedRoutines: loadLikedRoutines,
  };
};
