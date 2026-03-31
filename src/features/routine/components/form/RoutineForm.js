import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import { GitFork } from "lucide-react";
import { useRoutineForm } from "../../hooks/useRoutineForm";
import { useCategories } from "../../hooks/useCategories";
import useFormSections from "./FormSections";
import CreateRoutineDialog from "./dialogs/CreateRoutineDialog";

export default function RoutineForm({
  isReadOnly = false,
  routineData = null,
  isActive = false,
  certifiedActivities = {},
  onCertifyActivity = null,
  onSubmit = null,
  isEditMode = false,
}) {
  const navigate = useNavigate();
  const { jobs, targets, jobIcons, isLoading, reloadFromLocalStorage } = useCategories();

  const {
    form,
    isForkData,
    forkIdx,
    showCreateDialog,
    setShowCreateDialog,
    handleFormSubmit,
    handleCreateRoutine,
  } = useRoutineForm({ isReadOnly, routineData, isEditMode, onSubmit });

  // 수정 모드 전환 시 localStorage에서 아이콘 데이터 재로드
  useEffect(() => {
    if (!isReadOnly) {
      reloadFromLocalStorage();
    }
  }, [isReadOnly, reloadFromLocalStorage]);

  const {
    TitleSectionCard,
    JobSectionCard,
    DurationAndImportanceSection,
    RepeatDaysCard,
    InterestSectionCard,
    ShareSettingsCard,
    ActivitiesSectionCard,
  } = useFormSections({
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
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6" lang="ko">
        {isForkData && forkIdx && (
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-md text-purple-700 text-sm">
            <GitFork className="inline-block w-4 h-4 mr-1 mb-1" />
            다른 사용자의 루틴을 포크하여 작성 중입니다. 루틴을 저장하면 원본 루틴의 포크 카운트가 증가합니다.
          </div>
        )}

        {TitleSectionCard}
        {JobSectionCard}
        {DurationAndImportanceSection}
        {RepeatDaysCard}
        {InterestSectionCard}
        {!isReadOnly && ShareSettingsCard}
        {ActivitiesSectionCard}

        {!isReadOnly && (
          <div className="flex gap-3">
            <Button type="button" onClick={() => navigate(-1)} variant="outline" className="flex-1">취소</Button>
            <Button type="submit" className="w-1/2 bg-blue-500">
              {isEditMode ? "루틴 저장하기" : "루틴 생성하기"}
            </Button>
          </div>
        )}
      </form>

      {!isEditMode && (
        <CreateRoutineDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onConfirm={handleCreateRoutine}
        />
      )}
    </Form>
  );
}
