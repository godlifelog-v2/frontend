import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/shared/components/ui/use-toast";
import { fetchMyAccount, updateNickname } from "../services/mypageService";

const MAX_RETRY_COUNT = 3;

const getGenderText = (genderCode) => {
  switch (genderCode) {
    case 1:
      return "남성";
    case 2:
      return "여성";
    case 3:
      return "선택 안함";
    default:
      return "정보 없음";
  }
};

export const useMyAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const errorNotifiedRef = useRef(false);
  const retryCountRef = useRef(0);

  const [userData, setUserData] = useState({
    userId: "",
    userNick: "",
    nickTag: "",
    userExp: 0,
    maxExp: "",
    combo: 0,
    userLv: 1,
    userName: "",
    userEmail: "",
    userJoin: "",
    userPhone: "",
    userGender: "",
    userJob: "",
    targetIdx: "",
  });

  const getInitialTab = () => {
    const tabParam = searchParams.get("tab");
    return tabParam || "routines";
  };

  const [activeSideTab, setActiveSideTab] = useState(getInitialTab());
  const [editing, setEditing] = useState({ userNick: false });
  const [tempData, setTempData] = useState({ ...userData });

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyAccount();
      const apiData = data.message || data;

      setUserData((prevData) => ({
        ...prevData,
        userId: apiData.userId || prevData.userId,
        userEmail: apiData.userEmail || prevData.userEmail,
        userJoin: apiData.userJoin || prevData.userJoin,
        userPhone: apiData.userPhone || prevData.userPhone,
        userGender: getGenderText(apiData.userGender),
        userJob: apiData.jobInfos?.idx?.toString() || "",
        targetIdx: apiData.targetInfos?.idx?.toString() || "",
        maxExp: apiData.maxExp || prevData.maxExp,
      }));

      setError(null);
      errorNotifiedRef.current = false;
      retryCountRef.current = 0;
      setLoading(false);
    } catch (err) {
      console.error("사용자 정보를 불러오는 중 오류 발생:", err);

      const is500Error = err.response?.status === 500;

      if (is500Error && retryCountRef.current < MAX_RETRY_COUNT) {
        retryCountRef.current += 1;
        setTimeout(() => {
          loadUserData();
        }, 1000);
        return;
      }

      let errorMessage = "사용자 정보를 불러오는 데 실패했습니다.";
      if (is500Error) {
        errorMessage = `서버 오류: 최대 시도 횟수(${MAX_RETRY_COUNT}회)에 도달했습니다.`;
      } else if (err.response?.status === 401) {
        errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
      } else if (err.response?.status === 403) {
        errorMessage = "접근 권한이 없습니다.";
      } else if (err.response?.status === 404) {
        errorMessage = "사용자 정보를 찾을 수 없습니다.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "요청 시간이 초과되었습니다.";
      }

      setError(errorMessage);

      if (!errorNotifiedRef.current) {
        toast({
          variant: "destructive",
          title: "데이터 로딩 오류",
          description: errorMessage,
        });
        errorNotifiedRef.current = true;
      }

      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast({
        variant: "destructive",
        title: "로그인이 필요합니다",
        description: "마이페이지 접근을 위해 로그인해주세요.",
      });
      navigate("/user/login");
      return;
    }

    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    if (userInfo) {
      setUserData((prevData) => ({
        ...prevData,
        userId: userInfo.userIdx || "",
        userNick: userInfo.userNick || "",
        nickTag: userInfo.nickTag || "",
        userExp: userInfo.userExp || 0,
        combo: userInfo.combo || 0,
        userLv: userInfo.userLv || 1,
        userName: userInfo.userName || "",
        maxExp: userInfo.maxExp || 0,
      }));
    }

    retryCountRef.current = 0;
    loadUserData();
  }, [loadUserData, navigate, toast]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveSideTab(tabParam);
    }
  }, [searchParams]);

  const handleEdit = (field) => {
    setEditing({ ...editing, [field]: true });
    setTempData({ ...userData });
  };

  const handleCancel = (field) => {
    setEditing({ ...editing, [field]: false });
    setTempData({ ...userData });
  };

  const handleChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handleSave = async (field) => {
    try {
      if (field === "userNick") {
        await updateNickname(tempData.userNick);

        const storedInfo = localStorage.getItem("userInfo");
        if (storedInfo) {
          const parsed = JSON.parse(storedInfo);
          parsed.userNick = tempData.userNick;
          localStorage.setItem("userInfo", JSON.stringify(parsed));
        }
      }

      setUserData({ ...userData, [field]: tempData[field] });
      setEditing({ ...editing, [field]: false });

      toast({
        title: "정보가 업데이트되었습니다",
        description: "성공적으로 변경사항이 저장되었습니다.",
      });
    } catch (err) {
      console.error("정보 업데이트 중 오류 발생:", err);
      toast({
        variant: "destructive",
        title: "업데이트 실패",
        description: "정보를 업데이트하는 데 문제가 발생했습니다.",
      });
    }
  };

  const handleRetry = () => {
    errorNotifiedRef.current = false;
    retryCountRef.current = 0;
    loadUserData();
  };

  return {
    userData,
    setUserData,
    loading,
    error,
    retryCount: retryCountRef.current,
    maxRetryCount: MAX_RETRY_COUNT,
    activeSideTab,
    setActiveSideTab,
    editing,
    tempData,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave,
    handleRetry,
  };
};
