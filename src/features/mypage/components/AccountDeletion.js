import { Input } from "@/shared/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useAccountDeletion } from "../hooks/useAccountDeletion";

export default function AccountDeletion() {
  const {
    deletePassword,
    setDeletePassword,
    deletePasswordError,
    isDeleting,
    showDeleteConfirmDialog,
    setShowDeleteConfirmDialog,
    handleDeleteAccount,
  } = useAccountDeletion();

  return (
    <div className="flex justify-end">
      <AlertDialog
        open={showDeleteConfirmDialog}
        onOpenChange={setShowDeleteConfirmDialog}
      >
        <AlertDialogTrigger asChild>
          <button className="text-sm text-red-500 hover:text-red-700">
            회원 탈퇴
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 본인 확인을 위해 비밀번호를
              입력해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className={deletePasswordError ? "border-red-500" : ""}
            />
            {deletePasswordError && (
              <p className="text-sm text-red-500 mt-1">{deletePasswordError}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "처리 중..." : "탈퇴하기"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
