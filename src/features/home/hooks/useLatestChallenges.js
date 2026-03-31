import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLatestChallenges, fetchChallengeCategories } from '../services/homeService';

export const useLatestChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [challengeCategories, setChallengeCategories] = useState([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [challengeResponse, categoryResponse] = await Promise.all([
        fetchLatestChallenges(),
        fetchChallengeCategories(),
      ]);

      // 방어적 파싱: 응답 구조가 다양할 수 있음
      let challengeData = [];
      if (challengeResponse && typeof challengeResponse === 'object') {
        if (challengeResponse.content && Array.isArray(challengeResponse.content)) {
          challengeData = challengeResponse.content;
        } else if (Array.isArray(challengeResponse)) {
          challengeData = challengeResponse;
        } else {
          const possibleArrays = ['challenges', 'data', 'items', 'list'];
          for (const field of possibleArrays) {
            if (Array.isArray(challengeResponse[field])) {
              challengeData = challengeResponse[field];
              break;
            }
          }
        }
      }
      setChallenges(challengeData);

      let categoryData = [];
      if (Array.isArray(categoryResponse)) {
        categoryData = categoryResponse;
      } else if (categoryResponse && Array.isArray(categoryResponse.data)) {
        categoryData = categoryResponse.data;
      } else if (categoryResponse && Array.isArray(categoryResponse.content)) {
        categoryData = categoryResponse.content;
      }

      const categoryOptions = categoryData
        .map((category, index) => ({
          value: index.toString(),
          label: category.challName || '이름 없음',
        }))
        .filter((option) => option.label && option.label.trim() !== '');

      setChallengeCategories(categoryOptions);
    } catch (err) {
      setChallenges([]);
      setChallengeCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const nextChallenge = () =>
    setCurrentChallengeIndex((prev) => (prev + 1) % challenges.length);
  const prevChallenge = () =>
    setCurrentChallengeIndex((prev) => (prev - 1 + challenges.length) % challenges.length);

  const handleChallengeClick = (challenge) => {
    const challIdx = challenge.challIdx;
    if (challIdx) navigate(`/challenge/detail/${challIdx}`);
  };

  const getCategoryName = (categoryValue) => {
    if (!categoryValue && categoryValue !== 0) return '미분류';
    const category = challengeCategories.find((cat) => cat.value === categoryValue.toString());
    return category ? category.label : `카테고리 ${categoryValue}`;
  };

  return {
    challenges,
    currentChallengeIndex,
    loading,
    nextChallenge,
    prevChallenge,
    handleChallengeClick,
    getCategoryName,
  };
};
