import { X } from "lucide-react";

export default function SearchHistoryDropdown({
  searchHistoryRef,
  searchHistory,
  searchHistoryLoading,
  onItemClick,
  onDeleteItem,
}) {
  return (
    <div
      ref={searchHistoryRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
    >
      {searchHistoryLoading ? (
        <div className="p-3 text-center text-sm text-gray-500">
          검색 기록을 불러오는 중...
        </div>
      ) : Array.isArray(searchHistory) && searchHistory.length === 0 ? (
        <div className="p-3 text-center text-sm text-gray-500">
          최근 검색어가 없습니다.
        </div>
      ) : (
        <div className="py-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-100">
            최근 검색어
          </div>
          {Array.isArray(searchHistory) &&
            searchHistory.map((item) => (
              <div
                key={item.logIdx}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 group"
              >
                <button
                  onClick={() => onItemClick(item.searchKeyword)}
                  className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900"
                >
                  {item.searchKeyword}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.logIdx);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                >
                  <X size={12} className="text-gray-400" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
