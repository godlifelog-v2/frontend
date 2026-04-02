import { useState, useEffect } from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  updateNickname,
  updateEmail,
  updatePersonalInfo,
  updateJobTarget,
  fetchJobCategories,
  fetchTargetCategories,
  sendVerificationEmail,
  verifyEmailCode,
} from "../services/mypageService";

const getGenderCode = (genderText) => {
  switch (genderText) {
    case "남성":
      return 1;
    case "여성":
      return 2;
    case "선택 안함":
      return 3;
    default:
      return 0;
  }
};

export const useMyProfile = (userData, setUserData) => {
  const { toast } = useToast();

  // 카테고리
  const [jobCategories, setJobCategories] = useState([]);
  const [targetCategories, setTargetCategories] = useState([]);

  // 이메일 인증
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 닉네임 모달
  const [showNickModal, setShowNickModal] = useState(false);
  const [tempNickname, setTempNickname] = useState("");
  const [isUpdatingNick, setIsUpdatingNick] = useState(false);

  // 개인정보 모달
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [tempPersonalData, setTempPersonalData] = useState({
    userName: userData.userName || "",
    userGender: userData.userGender || "",
    userPhone: userData.userPhone || "",
  });
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);

  // 커리어 모달
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [tempCareerData, setTempCareerData] = useState({
    userJob: userData.userJob || "",
    targetIdx: userData.targetIdx || "",
  });
  const [isUpdatingCareer, setIsUpdatingCareer] = useState(false);

  // 이메일 편집 상태
  const [editingEmail, setEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  useEffect(() => {
    const loadJobCategories = async () => {
      try {
        const data = await fetchJobCategories();
        const categories = data.map((item) => ({
          jobIdx: item.idx,
          jobName: item.name,
        }));
        setJobCategories(categories);

        if (userData.userJob && categories.length > 0) {
          const currentJob = categories.find(
            (job) => job.jobIdx.toString() === userData.userJob.toString()
          );
          if (currentJob) {
            setUserData((prev) => ({ ...prev, userJobName: currentJob.jobName }));
          }
        }
      } catch (err) {
        console.error("직업 카테고리 로드 실패:", err);
      }
    };
    loadJobCategories();
  }, [userData.userJob]);

  useEffect(() => {
    const loadTargetCategories = async () => {
      try {
        const data = await fetchTargetCategories();
        const categories = data.map((item) => ({
          targetIdx: item.idx,
          targetName: item.name,
        }));
        setTargetCategories(categories);

        if (userData.targetIdx && categories.length > 0) {
          const currentTarget = categories.find(
            (t) => t.targetIdx.toString() === userData.targetIdx.toString()
          );
          if (currentTarget) {
            setUserData((prev) => ({
              ...prev,
              targetName: currentTarget.targetName,
            }));
          }
        }
      } catch (err) {
        console.error("관심사 카테고리 로드 실패:", err);
      }
    };
    loadTargetCategories();
  }, [userData.targetIdx]);

  const handleEditEmail = () => {
    setTempEmail(userData.userEmail);
    setEmailVerificationSent(false);
    setEmailVerified(false);
    setInputVerificationCode("");
    setEditingEmail(true);
  };

  const handleCancelEmail = () => {
    setEditingEmail(false);
    setEmailVerificationSent(false);
    setEmailVerified(false);
    setInputVerificationCode("");
  };

  const handleEmailChange = (value) => {
    setTempEmail(value);
    setEmailVerified(false);
    setEmailVerificationSent(false);
  };

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail(tempEmail);
      setEmailVerificationSent(true);
      toast({
        title: "인증번호 전송 완료",
        description: "이메일로 인증번호가 발송되었습니다. 메일함을 확인해주세요.",
      });
    } catch (err) {
      console.error("이메일 인증번호 발송 중 오류:", err);
      toast({
        variant: "destructive",
        title: "인증번호 발송 실패",
        description:
          err.response?.data?.message ||
          "인증번호를 발송하는 데 문제가 발생했습니다.",
      });
    }
  };

  const handleVerifyCode = async () => {
    if (!inputVerificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    setIsVerifying(true);
    try {
      await verifyEmailCode(tempEmail, inputVerificationCode);
      setEmailVerified(true);
      setInputVerificationCode("");
      toast({
        title: "이메일 인증 완료",
        description:
          "이메일 인증이 성공적으로 완료되었습니다. 변경하기 버튼을 눌러 이메일을 변경하세요.",
      });
    } catch (err) {
      console.error("이메일 인증코드 확인 중 오류:", err);
      toast({
        variant: "destructive",
        title: "인증코드 확인 실패",
        description:
          err.response?.data?.message || "인증번호가 일치하지 않습니다.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!emailVerified) {
      toast({
        variant: "destructive",
        title: "이메일 인증 필요",
        description: "이메일 변경을 위해 먼저 인증을 완료해주세요.",
      });
      return;
    }
    try {
      await updateEmail(tempEmail);
      setUserData({ ...userData, userEmail: tempEmail });
      setEditingEmail(false);
      setEmailVerificationSent(false);
      setEmailVerified(false);
      toast({
        title: "이메일 변경 완료",
        description: "이메일이 성공적으로 변경되었습니다.",
      });
    } catch (err) {
      console.error("이메일 업데이트 중 오류:", err);
      toast({
        variant: "destructive",
        title: "이메일 변경 실패",
        description:
          err.response?.data?.message ||
          "이메일을 변경하는 데 문제가 발생했습니다.",
      });
    }
  };

  const handleNickNameSave = async () => {
    setIsUpdatingNick(true);
    try {
      await updateNickname(tempNickname);
      setUserData({ ...userData, userNick: tempNickname });
      setShowNickModal(false);

      const storedInfo = localStorage.getItem("userInfo");
      if (storedInfo) {
        const parsed = JSON.parse(storedInfo);
        parsed.userNick = tempNickname;
        localStorage.setItem("userInfo", JSON.stringify(parsed));
      }

      toast({
        title: "닉네임 변경 완료",
        description: "닉네임이 성공적으로 변경되었습니다.",
      });
    } catch (err) {
      console.error("닉네임 업데이트 중 오류:", err);
      toast({
        variant: "destructive",
        title: "닉네임 변경 실패",
        description:
          err.response?.data?.message ||
          "닉네임을 변경하는 데 문제가 발생했습니다.",
      });
    } finally {
      setIsUpdatingNick(false);
    }
  };

  const handlePersonalSave = async () => {
    setIsUpdatingPersonal(true);
    try {
      await updatePersonalInfo({
        userName: tempPersonalData.userName,
        userGender: getGenderCode(tempPersonalData.userGender),
        userPhone: tempPersonalData.userPhone,
      });

      setUserData({
        ...userData,
        userName: tempPersonalData.userName,
        userGender: tempPersonalData.userGender,
        userPhone: tempPersonalData.userPhone,
      });

      setShowPersonalModal(false);
      toast({
        title: "개인정보 변경 완료",
        description: "개인정보가 성공적으로 변경되었습니다.",
      });
    } catch (err) {
      console.error("개인정보 업데이트 중 오류:", err);
      toast({
        variant: "destructive",
        title: "업데이트 실패",
        description: "개인정보를 업데이트하는 데 문제가 발생했습니다.",
      });
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  const handleCareerSave = async () => {
    setIsUpdatingCareer(true);
    try {
      const jobIdxValue = Number(tempCareerData.userJob || userData.userJob);
      const targetIdxValue = Number(
        tempCareerData.targetIdx || userData.targetIdx
      );

      await updateJobTarget({
        jobIdx: jobIdxValue,
        targetIdx: targetIdxValue,
      });

      const updatedJobName =
        jobCategories.find(
          (job) => job.jobIdx.toString() === jobIdxValue.toString()
        )?.jobName || userData.userJobName;

      const updatedTargetName =
        targetCategories.find(
          (t) => t.targetIdx.toString() === targetIdxValue.toString()
        )?.targetName || userData.targetName;

      setUserData({
        ...userData,
        userJob: jobIdxValue.toString(),
        targetIdx: targetIdxValue.toString(),
        userJobName: updatedJobName,
        targetName: updatedTargetName,
      });

      setShowCareerModal(false);
      toast({
        title: "커리어정보 변경 완료",
        description: "커리어정보가 성공적으로 변경되었습니다.",
      });
    } catch (err) {
      console.error("커리어정보 업데이트 중 오류:", err);
      toast({
        variant: "destructive",
        title: "업데이트 실패",
        description:
          err.message || "커리어정보를 업데이트하는 데 문제가 발생했습니다.",
      });
    } finally {
      setIsUpdatingCareer(false);
    }
  };

  const getJobName = (jobIdx) => {
    if (!jobCategories.length && userData.userJob) {
      return userData.userJobName || userData.userJob;
    }
    if (!jobIdx) return "직업을 선택하세요";
    const job = jobCategories.find(
      (j) => j.jobIdx.toString() === jobIdx.toString()
    );
    return job ? job.jobName : userData.userJobName || "직업을 선택하세요";
  };

  const getTargetName = (targetIdx) => {
    if (!targetCategories.length && userData.targetIdx) {
      return userData.targetName || `목표 ${userData.targetIdx}`;
    }
    if (!targetIdx) return "목표를 선택하세요";
    const target = targetCategories.find(
      (t) => t.targetIdx.toString() === targetIdx.toString()
    );
    return target
      ? target.targetName
      : userData.targetName || "목표를 선택하세요";
  };

  return {
    jobCategories,
    targetCategories,
    // 이메일
    editingEmail,
    tempEmail,
    setTempEmail,
    emailVerificationSent,
    emailVerified,
    isVerifying,
    inputVerificationCode,
    setInputVerificationCode,
    handleEditEmail,
    handleCancelEmail,
    handleEmailChange,
    handleSendVerification,
    handleVerifyCode,
    handleEmailUpdate,
    // 닉네임
    showNickModal,
    setShowNickModal,
    tempNickname,
    setTempNickname,
    isUpdatingNick,
    handleNickNameSave,
    // 개인정보
    showPersonalModal,
    setShowPersonalModal,
    tempPersonalData,
    setTempPersonalData,
    isUpdatingPersonal,
    handlePersonalSave,
    // 커리어
    showCareerModal,
    setShowCareerModal,
    tempCareerData,
    setTempCareerData,
    isUpdatingCareer,
    handleCareerSave,
    // 유틸
    getJobName,
    getTargetName,
  };
};
