import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import TitleSection from "./TitleSection";
import ShareSetSection from "./ShareSetSection";
import ActivitySection from "./activity/ActivitySection";
import BadgeSelector from "@/components/common/badge-selector";
import DateInput from "@/components/common/dateInput/DateInput";
import StarRating from "@/components/common/starRating/StarRating";
import DaySelector from "@/components/common/daySelector/DaySelector";

export default function useFormSections({
  form,
  isReadOnly,
  isActive,
  certifiedActivities,
  onCertifyActivity,
  routineData,
  jobs,
  targets,
  jobIcons,
  isLoading,
}) {
  const handleJobChange = useMemo(() => (jobIdx) => {
    if (jobIdx !== 19) form.setValue("jobEtcCateDTO", null);
  }, [form]);

  const handleCustomJobSelected = useMemo(() => (jobEtcData) => {
    if (jobEtcData) {
      form.setValue("jobIdx", 19);
      form.setValue("jobEtcCateDTO", jobEtcData);
    }
  }, [form]);

  const TitleSectionCard = useMemo(() => () => {
    if (isReadOnly) return null;
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>루틴 제목{!isReadOnly && <span className="text-red-500 ml-1">*</span>}</CardTitle>
          <CardDescription>{isReadOnly ? "루틴 제목" : "루틴에 적절한 제목을 입력해주세요."}</CardDescription>
        </CardHeader>
        <CardContent>
          <TitleSection control={form.control} required={!isReadOnly} readOnly={isReadOnly} />
        </CardContent>
      </Card>
    );
  }, [form.control, isReadOnly]);

  const JobSectionCard = useMemo(() => () => (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>추천 직업</CardTitle>
        <CardDescription>{isReadOnly ? "이 루틴의 추천 직업" : "루틴에 맞는 직업을 선택하면 다른 사람들이 루틴을 찾아보기 좋아요!"}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : (
          <BadgeSelector
            control={form.control}
            name="jobIdx"
            options={jobs}
            availableIcons={jobIcons}
            maxVisible={10}
            onCustomJobSelected={handleCustomJobSelected}
            onChange={handleJobChange}
            readOnly={isReadOnly}
            key={`job-selector-${isReadOnly}`}
          />
        )}
      </CardContent>
    </Card>
  ), [form.control, isReadOnly, jobs, jobIcons, isLoading, handleJobChange, handleCustomJobSelected]);

  const DurationAndImportanceSection = useMemo(() => () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>루틴 지속 기간(일)</CardTitle>
          <CardDescription>{isReadOnly ? "루틴의 지속 기간" : "루틴을 지속할 기간을 설정해 주세요."}</CardDescription>
        </CardHeader>
        <CardContent>
          <DateInput control={form.control} name="endTo" min={7} required={!isReadOnly} readOnly={isReadOnly} />
        </CardContent>
      </Card>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>루틴 중요도</CardTitle>
          <CardDescription>{isReadOnly ? "루틴의 중요도" : "루틴의 중요도를 선택하세요"}</CardDescription>
        </CardHeader>
        <CardContent>
          <StarRating control={form.control} name="planImp" maxRating={10} required={!isReadOnly} readOnly={isReadOnly} />
        </CardContent>
      </Card>
    </div>
  ), [form.control, isReadOnly]);

  const RepeatDaysCard = useMemo(() => () => (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>반복 요일</CardTitle>
        <CardDescription>{isReadOnly ? "루틴의 반복 요일" : "루틴의 반복 주기를 선택하세요"}</CardDescription>
      </CardHeader>
      <CardContent>
        <DaySelector control={form.control} name="repeatDays" required={!isReadOnly} readOnly={isReadOnly} />
      </CardContent>
    </Card>
  ), [form.control, isReadOnly]);

  const InterestSectionCard = useMemo(() => () => (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>추천 관심사{!isReadOnly && <span className="text-red-500 ml-1">*</span>}</CardTitle>
        <CardDescription>{isReadOnly ? "이 루틴의 추천 관심사" : "루틴에 맞는 관심사를 선택해주세요"}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : (
          <BadgeSelector
            control={form.control}
            name="targetIdx"
            options={targets}
            availableIcons={jobIcons}
            maxVisible={10}
            required={true}
            readOnly={isReadOnly}
            allowCustomInput={false}
            key={`interest-selector-${isReadOnly}`}
          />
        )}
      </CardContent>
    </Card>
  ), [form.control, isReadOnly, targets, jobIcons, isLoading]);

  const ShareSettingsCard = useMemo(() => () => (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>공유설정</CardTitle>
        <CardDescription>다른 사용자에게 루틴을 공유하고 싶다면 switch on 해주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <ShareSetSection control={form.control} />
      </CardContent>
    </Card>
  ), [form.control]);

  const ActivitiesSectionCard = useMemo(() => () => (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>활동 목록{!isReadOnly && <span className="text-red-500 ml-1">*</span>}</CardTitle>
        <CardDescription>{isReadOnly ? "이 루틴에 포함된 활동들" : "루틴에 포함할 활동들을 추가해주세요"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivitySection
          control={form.control}
          readOnly={isReadOnly}
          isActive={isActive}
          certifiedActivities={certifiedActivities}
          onCertifyActivity={onCertifyActivity}
          routineData={routineData}
          isEditMode={!isReadOnly}
        />
      </CardContent>
    </Card>
  ), [form.control, isReadOnly, isActive, certifiedActivities, onCertifyActivity, routineData]);

  return {
    TitleSectionCard,
    JobSectionCard,
    DurationAndImportanceSection,
    RepeatDaysCard,
    InterestSectionCard,
    ShareSettingsCard,
    ActivitiesSectionCard,
  };
}
