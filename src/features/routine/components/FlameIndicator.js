import React, { useState } from "react";
import { Flame, Info, X } from "lucide-react";

const FlameIndicator = ({ certExp }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getFlameInfo = (exp) => {
    let colorType = 0;
    let level = 0;

    if (exp >= 0 && exp < 500) {
      colorType = 1;
      level = Math.min(5, Math.ceil(exp / 100));
    } else if (exp >= 500 && exp < 1000) {
      colorType = 2;
      level = Math.min(5, Math.ceil((exp - 500) / 100));
    } else if (exp >= 1000 && exp < 1500) {
      colorType = 3;
      level = Math.min(5, Math.ceil((exp - 1000) / 100));
    } else if (exp >= 1500 && exp < 2000) {
      colorType = 4;
      level = Math.min(5, Math.ceil((exp - 1500) / 100));
    } else if (exp >= 2000 && exp < 2500) {
      colorType = 5;
      level = Math.min(5, Math.ceil((exp - 2000) / 100));
    } else if (exp >= 2500 && exp < 3000) {
      colorType = 6;
      level = Math.min(5, Math.ceil((exp - 2500) / 100));
    } else if (exp >= 3000) {
      colorType = 7;
      level = 5;
    }

    return { colorType, level };
  };

  const getFlameColor = (colorType, level) => {
    const baseColors = {
      0: "#D1D5DB",
      1: "#FF3333",
      2: "#FF9500",
      3: "#FFCC00",
      4: "#33CC33",
      5: "#3399FF",
      6: "#6633CC",
      7: "#CC33FF",
    };

    if (level === 0 || colorType === 0) {
      return baseColors[0];
    }

    const colorGradients = {
      1: ["#FFCCCC", "#FFB3B3", "#FF9999", "#FF6666", "#FF3333"],
      2: ["#FFECD9", "#FFDBB3", "#FFC98C", "#FFAF59", "#FF9500"],
      3: ["#FFF6CC", "#FFF2B3", "#FFEB8C", "#FFE259", "#FFCC00"],
      4: ["#D9F2D9", "#B3E6B3", "#8CD98C", "#59CC59", "#33CC33"],
      5: ["#CCE6FF", "#B3D9FF", "#8CC6FF", "#59A6FF", "#3399FF"],
      6: ["#E6D9F2", "#D1B3E6", "#B88CD9", "#9159CC", "#6633CC"],
      7: ["#F2CCF2", "#E6B3E6", "#D98CD9", "#CC59CC", "#CC33FF"],
    };

    if (colorGradients[colorType] && colorGradients[colorType][level - 1]) {
      return colorGradients[colorType][level - 1];
    }

    const getGradientColor = (baseColor, level) => {
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      const brightness = 1 + (5 - level) * 0.35;
      const adjustedR = Math.min(255, Math.round(r * brightness));
      const adjustedG = Math.min(255, Math.round(g * brightness));
      const adjustedB = Math.min(255, Math.round(b * brightness));
      return `#${adjustedR.toString(16).padStart(2, "0")}${adjustedG.toString(16).padStart(2, "0")}${adjustedB.toString(16).padStart(2, "0")}`;
    };

    return getGradientColor(baseColors[colorType], level);
  };

  const getFlameTypeName = (colorType) => {
    const typeNames = { 0: "없음", 1: "빨강", 2: "주황", 3: "노랑", 4: "초록", 5: "파랑", 6: "남색", 7: "보라" };
    return typeNames[colorType] || typeNames[0];
  };

  const getExpInfo = (exp) => {
    const flameInfo = getFlameInfo(exp);
    let nextLevelExp = 0;
    let currentLevelMinExp = 0;

    if (flameInfo.colorType === 0) {
      nextLevelExp = 100;
    } else if (flameInfo.level === 5 && flameInfo.colorType < 7) {
      currentLevelMinExp = (flameInfo.colorType - 1) * 500 + flameInfo.level * 100;
      nextLevelExp = flameInfo.colorType * 500;
    } else if (flameInfo.colorType === 7 && flameInfo.level === 5) {
      return { currentExp: exp, currentLevelMinExp: 3000, nextLevelExp: null, progress: 100 };
    } else {
      currentLevelMinExp = (flameInfo.colorType - 1) * 500 + (flameInfo.level - 1) * 100;
      nextLevelExp = (flameInfo.colorType - 1) * 500 + flameInfo.level * 100;
    }

    const progress = nextLevelExp
      ? Math.min(100, ((exp - currentLevelMinExp) / (nextLevelExp - currentLevelMinExp)) * 100)
      : 100;

    return { currentExp: exp, currentLevelMinExp, nextLevelExp, progress };
  };

  const flameInfo = getFlameInfo(certExp);
  const flameColor = getFlameColor(flameInfo.colorType, flameInfo.level);
  const flameTypeName = getFlameTypeName(flameInfo.colorType);
  const expInfo = getExpInfo(certExp);

  return (
    <div className="relative">
      <div
        className="flex items-center py-1 px-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm cursor-pointer"
        onClick={() => setShowTooltip(true)}
      >
        <Flame
          size={18}
          color={flameColor}
          className={flameInfo.level >= 3 ? "animate-pulse" : ""}
          style={{ filter: flameInfo.colorType > 0 ? `drop-shadow(0 0 2px ${flameColor}80)` : "none" }}
        />
        <span className="ml-1 text-xs font-bold text-white">
          {flameInfo.colorType > 0 ? `Lv.${(flameInfo.colorType - 1) * 5 + flameInfo.level}` : "불꽃 없음"}
        </span>
        <Info size={14} className="ml-1 text-white opacity-70" />
      </div>

      {showTooltip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl text-gray-800 text-sm flex flex-col">
            <div className="sticky top-0 p-4 border-b flex justify-between items-center bg-white z-10">
              <h4 className="font-bold flex items-center">
                <Flame size={18} className="mr-2 text-orange-500" />
                무지개 불꽃 레벨 시스템
              </h4>
              <button className="text-gray-400 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}>
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm mb-2">매일 루틴 인증으로 경험치를 쌓고 불꽃을 성장시켜보세요!</p>
                <p className="text-xs text-gray-500">총 7가지 색상, 각 색상마다 5단계의 세부 레벨이 있습니다. (총 35레벨)</p>
              </div>

              <div className="space-y-6 mb-4">
                {[
                  { color: 1, name: "빨간색 단계", bgClass: "bg-red-50" },
                  { color: 2, name: "주황색 단계", bgClass: "bg-orange-50" },
                  { color: 3, name: "노란색 단계", bgClass: "bg-yellow-50" },
                  { color: 4, name: "초록색 단계", bgClass: "bg-green-50" },
                  { color: 5, name: "파란색 단계", bgClass: "bg-blue-50" },
                  { color: 6, name: "남색 단계", bgClass: "bg-indigo-50" },
                  { color: 7, name: "보라색 단계", bgClass: "bg-purple-50" },
                ].map(({ color, name, bgClass }) => (
                  <div key={color} className={`border rounded-lg p-4 ${bgClass}`}>
                    <h5 className="font-medium mb-3">{name}</h5>
                    <div className="w-full h-3 rounded-full mb-4" style={{ background: `linear-gradient(to right, ${getFlameColor(color, 1)}, ${getFlameColor(color, 5)})` }}></div>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} className="flex flex-col items-center">
                          <div className="relative w-10 h-12 flex items-center justify-center">
                            <Flame size={32} className={level >= 3 ? "animate-pulse" : ""} style={{ color: getFlameColor(color, level), filter: `drop-shadow(0 0 3px ${getFlameColor(color, level)})` }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-6 rounded-full" style={{ backgroundColor: getFlameColor(color, level), opacity: 0.3, filter: `blur(2px)` }}></div>
                            </div>
                          </div>
                          <div className="flex justify-center items-center w-6 h-6 rounded-full bg-white shadow-sm mt-1">
                            <span className="text-xs font-bold">{level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-3 bg-white bg-opacity-50 p-2 rounded">
                      {name}: 매일 루틴을 완료할 때마다 레벨이 올라갑니다. 레벨 5에 도달하면 다음 색상이 해금됩니다.
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <Flame size={24} color={flameColor} className="mr-2" />
                  <span className="font-medium">현재: {flameTypeName} Lv.{(flameInfo.colorType - 1) * 5 + flameInfo.level} ({flameInfo.level}단계)</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">총 누적 경험치: {certExp} 포인트</div>
                {expInfo.nextLevelExp !== null ? (
                  <>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full" style={{ width: `${expInfo.progress}%`, background: `linear-gradient(to right, ${getFlameColor(flameInfo.colorType, flameInfo.level)}, ${flameInfo.level === 5 && flameInfo.colorType < 7 ? getFlameColor(flameInfo.colorType + 1, 1) : getFlameColor(flameInfo.colorType, Math.min(5, flameInfo.level + 1))})` }}></div>
                    </div>
                    <div className="text-sm text-gray-500">다음 레벨까지 {expInfo.nextLevelExp - certExp} 경험치 필요</div>
                  </>
                ) : (
                  <div className="text-sm text-purple-600 font-medium">최고 레벨까지 {3000 - certExp > 0 ? `${3000 - certExp} 경험치 남았습니다.` : "도달했습니다. 축하합니다!"}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlameIndicator;
