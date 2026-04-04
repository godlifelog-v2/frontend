import { useState } from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import { deleteAccount } from "../services/mypageService";

export const useAccountDeletion = () => {
  const { toast } = useToast();
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeletePasswordError("비밀번호를 입력해주세요.");
      return;
    }

    setIsDeleting(true);
    setDeletePasswordError("");

    try {
      await deleteAccount(deletePassword);

      toast({
        title: "회원탈퇴 완료",
        description: "계정이 성공적으로 삭제되었습니다.",
      });

      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("회원탈퇴 중 오류 발생:", err);
      const errorMessage =
        err.response?.data?.message || "회원탈퇴 처리 중 문제가 발생했습니다.";

      setDeletePasswordError(errorMessage);

      toast({
        variant: "destructive",
        title: "회원탈퇴 실패",
        description: errorMessage,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmDialog(false);
    }
  };

  return {
    deletePassword,
    setDeletePassword,
    deletePasswordError,
    isDeleting,
    showDeleteConfirmDialog,
    setShowDeleteConfirmDialog,
    handleDeleteAccount,
  };
};
