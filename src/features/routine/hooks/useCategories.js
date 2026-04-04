import { useState, useEffect, useCallback } from "react";
import { getJobCategories, getTargetCategories, getIconCategories } from "../services/routineService";

export const useCategories = () => {
  const [jobs, setJobs] = useState([]);
  const [targets, setTargets] = useState([]);
  const [jobIcons, setJobIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getFromLocalStorage = () => {
    try {
      const jobsFromStorage = JSON.parse(localStorage.getItem("jobCategories") || "[]");
      const targetsFromStorage = JSON.parse(localStorage.getItem("targetCategories") || "[]");
      const iconsFromStorage = JSON.parse(localStorage.getItem("jobIcons") || "[]");

      if (jobsFromStorage.length > 0) setJobs(jobsFromStorage);
      if (targetsFromStorage.length > 0) setTargets(targetsFromStorage);
      if (iconsFromStorage.length > 0) setJobIcons(iconsFromStorage);

      return jobsFromStorage.length > 0 && targetsFromStorage.length > 0 && iconsFromStorage.length > 0;
    } catch (error) {
      console.error("로컬 스토리지에서 카테고리 데이터 가져오기 실패:", error);
      return false;
    }
  };

  const fetchCategoryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const hasLocalData = getFromLocalStorage();

      if (!hasLocalData) {
        const [jobsData, targetsData, iconsData] = await Promise.all([
          getJobCategories(),
          getTargetCategories(),
          getIconCategories(),
        ]);

        setJobs(jobsData);
        setTargets(targetsData);
        setJobIcons(iconsData);

        localStorage.setItem("jobCategories", JSON.stringify(jobsData));
        localStorage.setItem("targetCategories", JSON.stringify(targetsData));
        localStorage.setItem("jobIcons", JSON.stringify(iconsData));
      }
    } catch (error) {
      console.error("카테고리 데이터 로드 실패:", error);
      getFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  const reloadFromLocalStorage = useCallback(() => {
    try {
      const jobsFromStorage = JSON.parse(localStorage.getItem("jobCategories") || "[]");
      const targetsFromStorage = JSON.parse(localStorage.getItem("targetCategories") || "[]");
      const iconsFromStorage = JSON.parse(localStorage.getItem("jobIcons") || "[]");

      if (jobsFromStorage.length > 0) setJobs(jobsFromStorage);
      if (targetsFromStorage.length > 0) setTargets(targetsFromStorage);
      if (iconsFromStorage.length > 0) setJobIcons(iconsFromStorage);
    } catch (error) {
      console.error("localStorage에서 데이터 로드 실패:", error);
    }
  }, []);

  return { jobs, targets, jobIcons, isLoading, reloadFromLocalStorage };
};
