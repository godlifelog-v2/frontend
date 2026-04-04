import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import RoutineForm from "../components/form/RoutineForm";

const RoutineCreatePage = () => {
  const [forkedRoutineData, setForkedRoutineData] = useState(null);
  const [pageTitle, setPageTitle] = useState("새 루틴 만들기");
  const [pageSubtitle, setPageSubtitle] = useState("새로운 루틴으로 규칙적인 생활을 시작하세요");

  useEffect(() => {
    const forkedData = sessionStorage.getItem("forkRoutineData");

    if (forkedData) {
      try {
        const parsedData = JSON.parse(forkedData);
        setForkedRoutineData(parsedData);
        setPageTitle("Fork한 루틴 만들기");
        setPageSubtitle(`'${parsedData.planTitle}' 루틴을 기반으로 나만의 루틴을 만들어보세요`);
        sessionStorage.removeItem("forkRoutineData");
      } catch (error) {
        console.error("Fork된 루틴 데이터 파싱 오류:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="opacity-90 mt-2 text-blue-100">{pageSubtitle}</p>
          </div>
          <CardContent className="p-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">루틴 설정</h2>
              <RoutineForm initialData={forkedRoutineData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoutineCreatePage;
