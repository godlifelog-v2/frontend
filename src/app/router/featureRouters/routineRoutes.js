import { MyRoutineList, RoutineDetailPage, RoutineCreatePage, RoutineListPage } from "@/features/routine";

export const ROUTINE_ROUTES = [
  { path: "/routine/list", element: <RoutineListPage /> },
  { path: "/routine/mylist", element: <MyRoutineList /> },
  { path: "/routine/detail/:planIdx", element: <RoutineDetailPage /> },
  { path: "/routine/create", element: <RoutineCreatePage />, protected: true },
];
