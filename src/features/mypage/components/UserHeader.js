import { Award, Save, X } from "lucide-react";

export default function UserHeader({
  userData,
  editing,
  tempData,
  handleEdit,
  handleCancel,
  handleChange,
  handleSave,
}) {
  return (
    <div className="text-center md:text-left">
      <div className="flex items-center justify-center mb-2">
        {editing.userNick ? (
          <div className="flex items-center">
            <input
              type="text"
              className="text-2xl font-bold text-indigo-700 border-b border-indigo-300 bg-transparent mr-2 focus:outline-none"
              value={tempData.userNick}
              onChange={(e) => handleChange("userNick", e.target.value)}
            />
            <div className="flex space-x-1">
              <button
                onClick={() => handleSave("userNick")}
                className="text-green-500"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => handleCancel("userNick")}
                className="text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-600">
              {userData.userNick}
            </h2>
            <span className="ml-2 text-gray-500 text-sm">{userData.nickTag}</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-center text-gray-500 mb-4">
        ID: {userData.userId}
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">
            레벨 {userData.userLv}
          </span>
          <span className="text-sm text-gray-500">
            {userData.userExp}/{userData.maxExp} EXP
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: `${(userData.userExp / userData.maxExp) * 100}%`,
            }}
          ></div>
        </div>

        {userData.combo > 0 && (
          <div className="mt-4 flex items-center justify-center bg-indigo-100 p-2 rounded-lg">
            <Award className="text-yellow-500 mr-2" size={20} />
            <span className="font-bold">{userData.combo}일 연속 달성!</span>
          </div>
        )}
      </div>
    </div>
  );
}
