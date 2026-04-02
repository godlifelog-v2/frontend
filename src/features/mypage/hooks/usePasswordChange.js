import { useState } from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import { changePassword } from "../services/mypageService";

export const usePasswordChange = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    setPasswordError("");
    setIsUpdating(true);

    try {
      await changePassword({
        originalPw: currentPassword,
        userPw: newPassword,
        userPwConfirm: confirmPassword,
      });

      toast({
        title: "비밀번호가 업데이트되었습니다",
        description: "성공적으로 비밀번호가 변경되었습니다.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordDialog(false);
    } catch (err) {
      console.error("비밀번호 업데이트 중 오류 발생:", err);
      setPasswordError(
        err.response?.data?.message ||
          "비밀번호를 업데이트하는 데 문제가 발생했습니다."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowPasswordDialog(false);
  };

  return {
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
  };
};
