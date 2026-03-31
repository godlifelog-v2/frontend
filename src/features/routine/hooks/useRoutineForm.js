import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../components/form/schema";
import { createRoutine } from "../services/routineService";

export const useRoutineForm = ({
  isReadOnly = false,
  routineData = null,
  isEditMode = false,
  onSubmit = null,
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isForkData, setIsForkData] = useState(false);
  const [forkIdx, setForkIdx] = useState(null);

  const originalRoutineDataRef = useRef(null);
  const navigate = useNavigate();

  const defaultValues = routineData
    ? {
        ...routineData,
        activities: routineData.activities.map((a) => ({
          activityIdx: a.activityIdx,
          activityName: a.activityName || "",
          setTime: a.setTime || "08:00",
          description: a.description || "",
          activityImp: a.activityImp ?? 3,
          verified: a.verified ?? false,
        })),
      }
    : {
        planTitle: "",
        userIdx: null,
        endTo: 7,
        targetIdx: null,
        isShared: 0,
        planImp: 5,
        jobIdx: null,
        jobEtcCateDTO: null,
        activities: [],
        repeatDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        forkIdx: null,
        forked: false,
      };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
    shouldUnregister: false,
  });

  // 사용자 정보 및 포크 데이터 로드
  useEffect(() => {
    if (!isReadOnly && !isEditMode) {
      try {
        const forkData = sessionStorage.getItem("forkRoutineData");

        if (forkData) {
          const parsedForkData = JSON.parse(forkData);
          form.reset(parsedForkData);
          form.setValue("planTitle", parsedForkData.planTitle);
          form.setValue("endTo", parsedForkData.endTo);
          form.setValue("targetIdx", parsedForkData.targetIdx);
          form.setValue("isShared", parsedForkData.isShared);
          form.setValue("planImp", parsedForkData.planImp);
          form.setValue("jobIdx", parsedForkData.jobIdx);
          form.setValue("jobEtcCateDTO", parsedForkData.jobEtcCateDTO);
          form.setValue("activities", parsedForkData.activities);
          form.setValue("repeatDays", parsedForkData.repeatDays);

          if (parsedForkData.forkIdx && parsedForkData.forked) {
            setIsForkData(true);
            setForkIdx(parsedForkData.forkIdx);
            form.setValue("forkIdx", parsedForkData.forkIdx);
            form.setValue("forked", parsedForkData.forked);
          }

          const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
          if (userInfo.userIdx) form.setValue("userIdx", userInfo.userIdx);

          sessionStorage.removeItem("forkRoutineData");
          return;
        }

        if (routineData) return;

        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        if (userInfo.userIdx) form.setValue("userIdx", userInfo.userIdx);
        if (userInfo.jobIdx) form.setValue("jobIdx", userInfo.jobIdx);
      } catch (e) {
        console.error("데이터 로딩 실패:", e);
      }
    }
  }, [form, isReadOnly, routineData, isEditMode]);

  // 수정 모드 초기화
  useEffect(() => {
    if (isEditMode && routineData) {
      originalRoutineDataRef.current = {
        ...routineData,
        activities: routineData.activities.map((a) => ({
          activityIdx: a.activityIdx,
          activityName: a.activityName || "",
          setTime: a.setTime || "08:00",
          description: a.description || "",
          activityImp: a.activityImp ?? 3,
          verified: a.verified ?? false,
        })),
      };

      const resetValues = {
        ...routineData,
        activities: routineData.activities.map((a) => ({
          activityIdx: a.activityIdx,
          activityName: a.activityName || "",
          setTime: a.setTime || "08:00",
          description: a.description || "",
          activityImp: a.activityImp ?? 3,
          verified: a.verified ?? false,
        })),
      };

      form.reset(resetValues);
    }
  }, [isEditMode, routineData, form]);

  // 폼 제출 핸들러
  const handleFormSubmit = async (values) => {
    if (isReadOnly) return;

    const deleteActivityIdx = [];
    if (isEditMode && originalRoutineDataRef.current?.activities) {
      const originalIds = originalRoutineDataRef.current.activities
        .map((a) => Number(a.activityIdx))
        .filter((id) => id > 0);

      const currentIds = values.activities
        .filter((a) => a.activityIdx && Number(a.activityIdx) > 0)
        .map((a) => Number(a.activityIdx));

      deleteActivityIdx.push(...originalIds.filter((id) => !currentIds.includes(id)));
    }

    const processedActivities = values.activities.map((activity) => ({
      activityIdx:
        activity.activityIdx !== undefined && activity.activityIdx !== null
          ? Number(activity.activityIdx)
          : 0,
      planIdx: isEditMode ? routineData?.planIdx : null,
      activityName: activity.activityName,
      setTime: activity.setTime,
      description: activity.description || "",
      activityImp: activity.activityImp,
    }));

    if (isEditMode) {
      const requestData = {
        planIdx: routineData?.planIdx,
        planTitle: values.planTitle,
        endTo: values.endTo,
        repeatDays: values.repeatDays || [],
        targetIdx: values.targetIdx,
        jobIdx: values.jobIdx,
        planImp: values.planImp,
        isShared: values.isShared,
        isActive: 0,
        activities: processedActivities,
        deleteActivityIdx,
        jobCateDTO: null,
        jobEtcCateDTO: values.jobIdx === 19 ? values.jobEtcCateDTO : null,
      };

      if (isForkData && forkIdx) {
        requestData.forkIdx = forkIdx;
        requestData.forked = true;
      }

      if (onSubmit) onSubmit(requestData);
      return;
    }

    // 생성 모드
    const processedValues = {
      ...values,
      activities: processedActivities.map((a) => ({
        activityName: a.activityName,
        setTime: a.setTime,
        description: a.description,
        activityImp: a.activityImp,
      })),
      forkIdx: isForkData && forkIdx ? forkIdx : null,
      forked: !!(isForkData && forkIdx),
    };

    setFormData(processedValues);
    setShowCreateDialog(true);
  };

  // 루틴 생성 확인 (다이얼로그에서 호출)
  const handleCreateRoutine = async (startNow) => {
    setShowCreateDialog(false);
    if (!formData) return;

    const requestData = {
      ...formData,
      isActive: startNow ? 1 : 0,
    };

    if (requestData.jobIdx !== 19 && requestData.jobEtcCateDTO) {
      requestData.jobEtcCateDTO = null;
    }

    try {
      await createRoutine(requestData);
      alert(
        startNow
          ? "루틴이 성공적으로 생성되었고 지금부터 시작됩니다!"
          : "루틴이 성공적으로 생성되었습니다. 나중에 시작할 수 있습니다."
      );
      navigate("/routine/mylist");
    } catch (err) {
      console.error("루틴 생성 실패:", err);
      alert(
        err.response?.data?.message
          ? `루틴 생성 실패: ${err.response.data.message}`
          : err.request
          ? "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
          : "요청 중 오류가 발생했습니다."
      );
    }
  };

  return {
    form,
    isForkData,
    forkIdx,
    showCreateDialog,
    setShowCreateDialog,
    handleFormSubmit,
    handleCreateRoutine,
  };
};
