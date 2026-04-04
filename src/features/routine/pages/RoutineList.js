import React from "react";
import RoutineCardList from "../components/list/RoutineCardList";
import SearchWrapper from "@/components/common/SearchWrapper";
import { useRoutineList } from "../hooks/useRoutineList";

const RoutineListPage = () => {
  const {
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
  } = useRoutineList();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">공개 루틴 탐색</h1>
      <p className="text-gray-600 mb-6">다른 사용자들의 루틴을 살펴보고 영감을 얻으세요.</p>

      <SearchWrapper
        searchTerm={searchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        totalResults={totalPosts}
        placeholder="루틴 제목, 작성자, 태그 검색..."
        onSearch={handleSearch}
      />

      <RoutineCardList
        routines={routines}
        isLoading={isLoading}
        error={error}
        onCardClick={handleCardClick}
        onAddNewRoutine={handleAddNewRoutine}
        isMyRoutine={false}
        currentPage={currentPage}
        totalPages={totalPages}
        totalPosts={totalPosts}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default RoutineListPage;
