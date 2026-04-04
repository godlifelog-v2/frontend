import { useState, useEffect, useRef } from "react";
import {
  fetchSearchHistory,
  saveSearchHistory,
  deleteSearchHistoryItem,
} from "../services/mypageService";

export const useSearchHistory = (type) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchHistoryLoading, setSearchHistoryLoading] = useState(false);

  const searchInputRef = useRef(null);
  const searchHistoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        searchHistoryRef.current &&
        !searchHistoryRef.current.contains(event.target)
      ) {
        setShowSearchHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadSearchHistory = async () => {
    try {
      setSearchHistoryLoading(true);
      const data = await fetchSearchHistory(type);
      if (data && Array.isArray(data.message)) {
        setSearchHistory(data.message);
      } else {
        setSearchHistory([]);
      }
    } catch (err) {
      console.error("검색 기록 조회 중 오류 발생:", err);
      setSearchHistory([]);
    } finally {
      setSearchHistoryLoading(false);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchHistory(true);
    loadSearchHistory();
  };

  const handleHistoryItemClick = (keyword, onSelect) => {
    setShowSearchHistory(false);
    if (onSelect) onSelect(keyword);
  };

  const handleDeleteHistoryItem = async (logIdx) => {
    try {
      await deleteSearchHistoryItem(logIdx);
      loadSearchHistory();
    } catch (err) {
      console.error("검색 기록 삭제 중 오류 발생:", err);
    }
  };

  const saveHistory = async (keyword) => {
    if (!keyword.trim()) return;
    try {
      await saveSearchHistory(keyword, type);
    } catch (err) {
      console.error("검색 기록 저장 중 오류 발생:", err);
    }
  };

  return {
    searchHistory,
    searchHistoryLoading,
    showSearchHistory,
    setShowSearchHistory,
    searchInputRef,
    searchHistoryRef,
    handleSearchFocus,
    handleHistoryItemClick,
    handleDeleteHistoryItem,
    saveHistory,
  };
};
