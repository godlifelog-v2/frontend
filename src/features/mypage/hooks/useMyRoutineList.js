import { useState, useEffect, useCallback } from "react";
import {
  fetchMyRoutineList,
  deleteRoutines,
  toggleRoutineShared,
} from "../services/mypageService";
import { useSearchHistory } from "./useSearchHistory";

const INITIAL_FILTERS = {
  page: 1,
  size: 3,
  status: 0,
  target: null,
  job: null,
  sort: "latest",
  order: "desc",
  search: "",
};

export const useMyRoutineList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routineData, setRoutineData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState({});
  const [selectedRoutines, setSelectedRoutines] = useState([]);

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const searchHistoryProps = useSearchHistory("routine");

  const loadMyRoutines = useCallback(async (params = INITIAL_FILTERS) => {
    try {
      setLoading(true);
      const data = await fetchMyRoutineList(params);
      setRoutineData(data);
      setError(null);
    } catch (err) {
      console.error("루틴 데이터를 불러오는 중 오류 발생:", err);
      setError("루틴 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      loadMyRoutines();
    } else {
      setError("로그인이 필요합니다.");
      setLoading(false);
    }
  }, [loadMyRoutines]);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    setSelectedRoutines([]);
    loadMyRoutines(updatedFilters);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    loadMyRoutines(updatedFilters);
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

  const toggleRoutineSelection = (planIdx) => {
    setSelectedRoutines((prev) =>
      prev.includes(planIdx)
        ? prev.filter((id) => id !== planIdx)
        : [...prev, planIdx]
    );
  };

  const toggleAllSelection = () => {
    const allRoutines = routineData ? routineData.plans : [];
    const currentPagePlanIds = allRoutines.map(
      (routine) => routine.planInfos.planIdx
    );
    const allSelected = currentPagePlanIds.every((id) =>
      selectedRoutines.includes(id)
    );

    if (allSelected) {
      setSelectedRoutines((prev) =>
        prev.filter((id) => !currentPagePlanIds.includes(id))
      );
    } else {
      setSelectedRoutines((prev) => {
        const newSelections = currentPagePlanIds.filter(
          (id) => !prev.includes(id)
        );
        return [...prev, ...newSelections];
      });
    }
  };

  const deleteSelectedRoutines = async () => {
    if (selectedRoutines.length === 0) {
      alert("삭제할 루틴을 선택해주세요.");
      return;
    }
    if (
      !window.confirm(
        `선택된 ${selectedRoutines.length}개의 루틴을 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteRoutines(selectedRoutines);
      alert("선택된 루틴이 삭제되었습니다.");
      setSelectedRoutines([]);
      loadMyRoutines();
    } catch (err) {
      console.error("루틴 삭제 중 오류 발생:", err);
      alert("루틴 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleRoutinePrivacy = async (planIdx) => {
    try {
      setPrivacyLoading((prev) => ({ ...prev, [planIdx]: true }));
      await toggleRoutineShared([planIdx]);
      loadMyRoutines();
    } catch (err) {
      console.error("루틴 공개/비공개 전환 중 오류 발생:", err);
      alert("공개/비공개 설정 변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setPrivacyLoading((prev) => ({ ...prev, [planIdx]: false }));
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
    selectedRoutines,
    deleteLoading,
    privacyLoading,
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
    handleKeyPress,
    handleHistoryItemClick,
    toggleRoutineSelection,
    toggleAllSelection,
    deleteSelectedRoutines,
    toggleRoutinePrivacy,
    fetchMyRoutines: loadMyRoutines,
  };
};
