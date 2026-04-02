const TABS = [
  { value: "routines", label: "루틴" },
  { value: "likes", label: "좋아요" },
  { value: "mypage", label: "내 프로필" },
  { value: "chat", label: "1:1 문의" },
];

export default function MyPageTabs({ activeSideTab, setActiveSideTab }) {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200 mb-4">
        <ul className="flex text-xs whitespace-nowrap -mb-px justify-center">
          {TABS.map((tab) => (
            <li key={tab.value} className="mr-2">
              <button
                className={`whitespace-nowrap py-2 px-3 border-b-2 ${
                  activeSideTab === tab.value
                    ? "text-blue-600 border-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveSideTab(tab.value)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
