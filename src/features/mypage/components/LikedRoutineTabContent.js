import {
  Heart,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMyLikeList } from "../hooks/useMyLikeList";
import SearchHistoryDropdown from "./SearchHistoryDropdown";

export default function LikedRoutineTabContent() {
  const {
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
    searchHistory,
    searchHistoryLoading,
    showSearchHistory,
    searchInputRef,
    searchHistoryRef,
    handleSearchFocus,
    handleDeleteHistoryItem,
    handleFilterChange,
    handlePageChange,
    handleSearch,
    handleSearchClear,
    handleFiltersReset,
    handleKeyPress,
    handleHistoryItemClick,
    deleteSingleLike,
    deleteAllLikes,
    fetchLikedRoutines,
  } = useMyLikeList();

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">좋아요한 루틴을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center">
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <button
          onClick={() => fetchLikedRoutines()}
          className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const allRoutines = routineData ? routineData.plans : [];
  const totalPages = routineData ? routineData.totalPages : 1;
  const currentPage = routineData ? routineData.currentPage : 1;

  const targetOptions = [
    { value: "", label: "전체" },
    ...targetCategories.map((c) => ({ value: c.idx, label: c.name })),
  ];
  const jobOptions = [
    { value: "", label: "전체" },
    ...jobCategories.map((c) => ({ value: c.idx, label: c.name })),
  ];

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleSearchFocus}
              className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchInput && (
              <button
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}

            {showSearchHistory && (
              <SearchHistoryDropdown
                searchHistoryRef={searchHistoryRef}
                searchHistory={searchHistory}
                searchHistoryLoading={searchHistoryLoading}
                onItemClick={handleHistoryItemClick}
                onDeleteItem={handleDeleteHistoryItem}
              />
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            검색
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <Filter size={16} />
          <span>{showFilters ? "필터 숨기기" : "고급 필터"}</span>
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  목표 분야
                </label>
                <select
                  value={filters.target || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      target:
                        e.target.value === "" ? null : parseInt(e.target.value),
                    })
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  disabled={categoriesLoading}
                >
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  직업
                </label>
                <select
                  value={filters.job || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      job:
                        e.target.value === "" ? null : parseInt(e.target.value),
                    })
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  disabled={categoriesLoading}
                >
                  {jobOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  정렬 순서
                </label>
                <select
                  value={filters.order}
                  onChange={(e) =>
                    handleFilterChange({ order: e.target.value })
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="desc">최신순</option>
                  <option value="asc">오래된순</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  페이지당 항목 수
                </label>
                <select
                  value={filters.size}
                  onChange={(e) =>
                    handleFilterChange({ size: parseInt(e.target.value) })
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value={3}>3개</option>
                  <option value={5}>5개</option>
                  <option value={7}>7개</option>
                  <option value={10}>10개</option>
                </select>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={handleFiltersReset}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {allRoutines.length === 0 ? (
        <div className="p-5 text-center">
          <Heart size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {filters.search
              ? "검색 결과가 없습니다."
              : "아직 좋아요한 루틴이 없습니다."}
          </p>
          {!filters.search && (
            <Link
              to="/routines"
              className="inline-block mt-3 text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              루틴 둘러보기
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              onClick={deleteAllLikes}
              disabled={deleteLoading}
              className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{deleteLoading ? "취소 중..." : "모두 삭제"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {allRoutines.map((routine) => {
              const planIdx = routine.planInfos.planIdx;
              const isDeleting = deletingItem === planIdx;

              return (
                <div
                  key={planIdx}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 text-left">
                        <span
                          className="text-xs text-white px-2 py-1 rounded"
                          style={{ backgroundColor: routine.targetInfos.color }}
                        >
                          {routine.targetInfos.name}
                        </span>
                      </div>

                      <div className="mb-3 text-left">
                        <Link
                          to={`/routine/detail/${planIdx}`}
                          className="font-medium text-gray-800 hover:text-blue-600"
                        >
                          {routine.planInfos.planTitle}
                        </Link>
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-5">
                          <span>
                            등록일:{" "}
                            {routine.likedDate
                              ? new Date(routine.likedDate).toLocaleDateString(
                                  "ko-KR"
                                )
                              : new Date(
                                  routine.planInfos.planSubDate
                                ).toLocaleDateString("ko-KR")}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Heart size={18} className="text-pink-500" />
                            <span>
                              좋아요 {routine.planInfos.likeCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSingleLike(planIdx)}
                      disabled={isDeleting}
                      className="flex-shrink-0 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <X size={25} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
                이전
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                다음
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
