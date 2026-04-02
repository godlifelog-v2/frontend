import {
  User,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Target,
  Briefcase,
  Edit,
  Save,
  Send,
  Check,
} from "lucide-react";
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
import { useMyProfile } from "../hooks/useMyProfile";

export default function MyProfileForm({ userData, setUserData }) {
  const {
    jobCategories,
    targetCategories,
    editingEmail,
    tempEmail,
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
    showNickModal,
    setShowNickModal,
    tempNickname,
    setTempNickname,
    isUpdatingNick,
    handleNickNameSave,
    showPersonalModal,
    setShowPersonalModal,
    tempPersonalData,
    setTempPersonalData,
    isUpdatingPersonal,
    handlePersonalSave,
    showCareerModal,
    setShowCareerModal,
    tempCareerData,
    setTempCareerData,
    isUpdatingCareer,
    handleCareerSave,
    getJobName,
    getTargetName,
  } = useMyProfile(userData, setUserData);

  return (
    <div className="rounded-2xl shadow-md bg-white overflow-hidden">
      <div className="p-3">
        <div className="space-y-6">
          <div>
            {/* 가입일 */}
            <div className="flex items-center p-4">
              <Calendar className="text-indigo-500 mr-3" size={20} />
              <div>
                <div className="text-sm text-left text-gray-500">가입일</div>
                <div className="font-medium">{userData.userJoin}</div>
              </div>
            </div>

            <div className="border-t border-gray-200 mx-4"></div>

            {/* 닉네임 */}
            <div className="flex items-center p-4">
              <User className="text-indigo-500 mr-3" size={20} />
              <div className="flex-1">
                <div className="text-sm text-left text-gray-500">닉네임</div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{userData.userNick}</span>
                    <span className="ml-1 text-gray-500 text-sm">
                      {userData.nickTag}
                    </span>
                  </div>
                  <AlertDialog
                    open={showNickModal}
                    onOpenChange={setShowNickModal}
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => setTempNickname(userData.userNick)}
                        className="text-indigo-500 hover:text-indigo-700 flex items-center"
                      >
                        <Edit size={16} className="mr-1" />
                        <span className="text-sm">수정하기</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>닉네임 변경</AlertDialogTitle>
                        <AlertDialogDescription>
                          변경할 닉네임을 입력해주세요.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <Input
                          type="text"
                          placeholder="새 닉네임 입력"
                          value={tempNickname}
                          onChange={(e) => setTempNickname(e.target.value)}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdatingNick}>
                          취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleNickNameSave}
                          disabled={isUpdatingNick}
                          className="bg-indigo-500 hover:bg-indigo-600"
                        >
                          {isUpdatingNick ? "처리 중..." : "변경하기"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mx-4" />

            {/* 개인정보 섹션 */}
            <div className="p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-700">개인정보</div>
                <AlertDialog
                  open={showPersonalModal}
                  onOpenChange={setShowPersonalModal}
                >
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() =>
                        setTempPersonalData({
                          userName: userData.userName,
                          userGender: userData.userGender,
                          userPhone: userData.userPhone,
                        })
                      }
                      className="text-indigo-500 hover:text-indigo-700 flex items-center"
                    >
                      <Edit size={16} className="mr-1" />
                      <span className="text-sm">수정하기</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>개인정보 변경</AlertDialogTitle>
                      <AlertDialogDescription>
                        변경할 개인정보를 입력해주세요.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-left font-medium">
                          이름
                        </label>
                        <Input
                          type="text"
                          value={tempPersonalData.userName}
                          onChange={(e) =>
                            setTempPersonalData({
                              ...tempPersonalData,
                              userName: e.target.value,
                            })
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">성별</label>
                        <select
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={tempPersonalData.userGender}
                          onChange={(e) =>
                            setTempPersonalData({
                              ...tempPersonalData,
                              userGender: e.target.value,
                            })
                          }
                        >
                          <option value="남성">남성</option>
                          <option value="여성">여성</option>
                          <option value="선택 안함">선택 안함</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">전화번호</label>
                        <Input
                          type="tel"
                          value={tempPersonalData.userPhone}
                          onChange={(e) =>
                            setTempPersonalData({
                              ...tempPersonalData,
                              userPhone: e.target.value,
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isUpdatingPersonal}>
                        취소
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handlePersonalSave}
                        disabled={isUpdatingPersonal}
                        className="bg-indigo-500 hover:bg-indigo-600"
                      >
                        {isUpdatingPersonal ? "처리 중..." : "변경하기"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center py-2">
                <User className="text-indigo-500 mr-3" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">이름</div>
                  <div className="font-medium">{userData.userName}</div>
                </div>
              </div>
              <div className="flex items-center py-2">
                <UserCheck className="text-indigo-500 mr-3" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">성별</div>
                  <div className="font-medium">{userData.userGender}</div>
                </div>
              </div>
              <div className="flex items-center py-2">
                <Phone className="text-indigo-500 mr-3" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">전화번호</div>
                  <div className="font-medium">{userData.userPhone}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mx-4" />

            {/* 이메일 */}
            <div className="flex items-center p-4">
              <Mail className="text-indigo-500 mr-3" size={20} />
              <div className="flex-1">
                <div className="text-sm text-left text-gray-500">이메일</div>
                {editingEmail ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="email"
                        className="border-b border-indigo-300 bg-transparent mr-2 focus:outline-none flex-1"
                        value={tempEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                      />
                      <button
                        onClick={handleSendVerification}
                        className={`px-2 py-1 text-xs rounded ${
                          emailVerificationSent
                            ? "bg-gray-200 text-gray-500"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                        disabled={emailVerificationSent && emailVerified}
                      >
                        <span className="flex items-center">
                          <Send size={12} className="mr-1" />
                          인증번호 발송
                        </span>
                      </button>
                    </div>

                    {emailVerificationSent && !emailVerified && (
                      <div className="flex items-center mt-2">
                        <input
                          type="text"
                          placeholder="인증번호 6자리 입력"
                          className="border-b border-indigo-300 bg-transparent mr-2 focus:outline-none flex-1"
                          value={inputVerificationCode}
                          onChange={(e) =>
                            setInputVerificationCode(e.target.value)
                          }
                        />
                        <button
                          onClick={handleVerifyCode}
                          disabled={isVerifying}
                          className="px-2 py-1 text-xs rounded bg-indigo-500 text-white hover:bg-indigo-600 mr-1"
                        >
                          {isVerifying ? "확인 중..." : "확인"}
                        </button>
                        <button
                          onClick={handleCancelEmail}
                          disabled={isVerifying}
                          className="px-2 py-1 text-xs rounded bg-gray-500 text-white hover:bg-gray-600"
                        >
                          취소
                        </button>
                      </div>
                    )}

                    {emailVerified && (
                      <div className="flex items-center mt-2">
                        <span className="text-green-500 flex items-center mr-2">
                          <Check size={12} className="mr-1" />
                          인증완료
                        </span>
                        <button
                          onClick={handleEmailUpdate}
                          className="px-2 py-1 text-xs rounded bg-green-500 mr-1"
                        >
                          <span className="flex items-center">
                            <Save size={16} className="mr-1" />
                            변경하기
                          </span>
                        </button>
                        <button
                          onClick={handleCancelEmail}
                          className="px-2 py-1 text-xs rounded bg-gray-500"
                        >
                          취소
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{userData.userEmail}</span>
                    <button
                      onClick={handleEditEmail}
                      className="text-indigo-500 hover:text-indigo-700 flex items-center"
                    >
                      <Edit size={16} className="mr-1" />
                      <span className="text-sm">수정하기</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 mx-4" />

            {/* 커리어 정보 */}
            <div className="p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-700">커리어 정보</div>
                <AlertDialog
                  open={showCareerModal}
                  onOpenChange={setShowCareerModal}
                >
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() =>
                        setTempCareerData({
                          userJob: userData.userJob,
                          targetIdx: userData.targetIdx,
                        })
                      }
                      className="text-indigo-500 hover:text-indigo-700 flex items-center"
                    >
                      <Edit size={16} className="mr-1" />
                      <span className="text-sm">수정하기</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>커리어 정보 변경</AlertDialogTitle>
                      <AlertDialogDescription>
                        변경할 직업과 목표를 선택해주세요.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">직업</label>
                        <select
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={tempCareerData.userJob || ""}
                          onChange={(e) =>
                            setTempCareerData({
                              ...tempCareerData,
                              userJob: e.target.value,
                            })
                          }
                        >
                          {jobCategories.map((category) => (
                            <option
                              key={category.jobIdx}
                              value={category.jobIdx}
                            >
                              {category.jobName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">목표</label>
                        <select
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={tempCareerData.targetIdx || ""}
                          onChange={(e) =>
                            setTempCareerData({
                              ...tempCareerData,
                              targetIdx: e.target.value,
                            })
                          }
                        >
                          {targetCategories.map((category) => (
                            <option
                              key={category.targetIdx}
                              value={category.targetIdx}
                            >
                              {category.targetName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isUpdatingCareer}>
                        취소
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCareerSave}
                        disabled={isUpdatingCareer}
                        className="bg-indigo-500 hover:bg-indigo-600"
                      >
                        {isUpdatingCareer ? "처리 중..." : "변경하기"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center py-2">
                <Briefcase className="text-indigo-500 mr-3" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">직업</div>
                  <div className="font-medium">
                    {getJobName(userData.userJob)}
                  </div>
                </div>
              </div>
              <div className="flex items-center py-2">
                <Target className="text-indigo-500 mr-3" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">목표</div>
                  <div className="font-medium">
                    {getTargetName(userData.targetIdx)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
