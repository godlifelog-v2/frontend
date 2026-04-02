import {
  CheckCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trash2,
  Square,
  CheckSquare,
  Lock,
  Unlock,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMyRoutineList } from "../hooks/useMyRoutineList";
import SearchHistoryDropdown from "./SearchHistoryDropdown";

const STATUS_OPTIONS = [
  { value: 0, label: "전체" },
  { value: 1, label: "진행중" },
  { value: 2, label: "대기중" },
  { value: 3, label: "완료" },
  { value: 4, label: "조기종료" },
  { value: 5, label: "진행+대기" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "등록일" },
  { value: "view", label: "조회수" },
  { value: "like", label: "추천수" },
  { value: "fork", label: "포크수" },
  { value: "fire", label: "불꽃 경험치" },
];

export default function RoutineTabContent() {
  const {
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
    handleKeyPress,
    handleHistoryItemClick,
    toggleRoutineSelection,
    toggleAllSelection,
    deleteSelectedRoutines,
    toggleRoutinePrivacy,
    fetchMyRoutines,
  } = useMyRoutineList();

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">루틴을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center">
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <button
          onClick={() => fetchMyRoutines()}
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
  const currentPagePlanIds = allRoutines.map(
    (routine) => routine.planInfos.planIdx
  );
  const allCurrentPageSelected =
    currentPagePlanIds.length > 0 &&
    currentPagePlanIds.every((id) => selectedRoutines.includes(id));

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
                  상태
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ status: parseInt(e.target.value) })
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  정렬
                </label>
                <div className="flex space-x-1">
                  <select
                    value={filters.sort}
                    onChange={(e) =>
                      handleFilterChange({ sort: e.target.value })
                    }
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.order}
                    onChange={(e) =>
                      handleFilterChange({ order: e.target.value })
                    }
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="desc">↓</option>
                    <option value="asc">↑</option>
                  </select>
                </div>
              </div>
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
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value={3}>3개</option>
                <option value={5}>5개</option>
                <option value={7}>7개</option>
                <option value={10}>10개</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {allRoutines.length === 0 ? (
        <div className="p-5 text-center">
          <CheckCircle size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {filters.search ? "검색 결과가 없습니다." : "아직 등록된 루틴이 없습니다."}
          </p>
          {!filters.search && (
            <button className="mt-3 text-xs px-3 py-1 bg-blue-600 text-white rounded-lg">
              루틴 만들기
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleAllSelection}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {allCurrentPageSelected ? (
                  <CheckSquare size={16} className="text-blue-600" />
                ) : (
                  <Square size={16} />
                )}
                <span>전체 선택</span>
              </button>
            </div>

            {selectedRoutines.length > 0 && (
              <button
                onClick={deleteSelectedRoutines}
                disabled={deleteLoading}
                className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
                <span>
                  {deleteLoading
                    ? "삭제 중..."
                    : `삭제 (${selectedRoutines.length})`}
                </span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {allRoutines.map((routine) => {
              const planIdx = routine.planInfos.planIdx;
              const isSelected = selectedRoutines.includes(planIdx);
              const isShared = routine.planInfos.isShared;
              const isPrivacyToggling = privacyLoading[planIdx];

              return (
                <div
                  key={planIdx}
                  className={`bg-white border rounded-lg p-4 hover:shadow-sm transition-all ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleRoutineSelection(planIdx)}
                      className="flex-shrink-0 self-center"
                    >
                      {isSelected ? (
                        <CheckSquare size={18} className="text-blue-600" />
                      ) : (
                        <Square
                          size={18}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="mb-2 flex justify-start">
                        <span
                          className="text-xs text-white px-2 py-1 rounded"
                          style={{ backgroundColor: routine.targetInfos.color }}
                        >
                          {routine.targetInfos.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-start mb-3">
                        <Link
                          to={`/routine/detail/${planIdx}`}
                          className="font-medium text-gray-800 flex-1 hover:text-blue-600 transition-colors"
                        >
                          {routine.planInfos.planTitle}
                        </Link>

                        <button
                          onClick={() => toggleRoutinePrivacy(planIdx)}
                          disabled={isPrivacyToggling}
                          className={`ml-3 p-1 rounded hover:bg-gray-100 transition-colors ${
                            isPrivacyToggling
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            isShared
                              ? "공개 상태 (클릭시 비공개)"
                              : "비공개 상태 (클릭시 공개)"
                          }
                        >
                          {isPrivacyToggling ? (
                            <div className="animate-spin w-4 h-4 border border-gray-400 border-t-transparent rounded-full" />
                          ) : isShared ? (
                            <Unlock size={16} className="text-green-600" />
                          ) : (
                            <Lock size={16} className="text-gray-400" />
                          )}
                        </button>
                      </div>

                      <div className="text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>
                            등록일:{" "}
                            {new Date(
                              routine.planInfos.planSubDate
                            ).toLocaleDateString("ko-KR")}
                          </span>
                          <span>조회수 {routine.planInfos.viewCount}</span>
                          <span
                            className={isShared ? "text-green-600" : "text-gray-400"}
                          >
                            {isShared ? "공개" : "비공개"}
                          </span>
                        </div>
                      </div>
                    </div>
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
