import { Lock, Edit, Eye, EyeOff } from "lucide-react";
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
import AccountDeletion from "./AccountDeletion";
import { usePasswordChange } from "../hooks/usePasswordChange";

export default function SecuritySettings() {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordError,
    isUpdating,
    showPasswordDialog,
    setShowPasswordDialog,
    handlePasswordSave,
    handleCancel,
  } = usePasswordChange();

  return (
    <div className="rounded-2xl shadow-md bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white">
        <h1 className="text-xl font-bold">보안 설정</h1>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center p-4 text-left">
              <Lock className="text-indigo-500 mr-3" size={20} />
              <div className="flex-1">
                <div className="text-sm text-gray-500">비밀번호</div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">••••••••</span>
                  <AlertDialog
                    open={showPasswordDialog}
                    onOpenChange={setShowPasswordDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <button className="text-indigo-500 hover:text-indigo-700 flex items-center">
                        <Edit size={16} className="mr-1" />
                        <span className="text-sm">수정하기</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>비밀번호 변경</AlertDialogTitle>
                        <AlertDialogDescription>
                          현재 비밀번호와 새로운 비밀번호를 입력해주세요.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="py-4 space-y-4">
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="현재 비밀번호"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={passwordError ? "border-red-500" : ""}
                          />
                          <button
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            type="button"
                          >
                            {showCurrentPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="새 비밀번호"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            type="button"
                          >
                            {showNewPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="새 비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <button
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            type="button"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>

                        {passwordError && (
                          <p className="text-sm text-red-500 mt-1">
                            {passwordError}
                          </p>
                        )}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={handleCancel}
                          disabled={isUpdating}
                        >
                          취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handlePasswordSave}
                          disabled={isUpdating}
                          className="bg-indigo-500 hover:bg-indigo-600"
                        >
                          {isUpdating ? "처리 중..." : "변경하기"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 self-end">
          <AccountDeletion />
        </div>
      </div>
    </div>
  );
}
