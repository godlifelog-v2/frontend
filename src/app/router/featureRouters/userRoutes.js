import { Login, Signup, FindId, FindPassword } from "@/features/auth";

export const USER_ROUTES = [
  { path: "/user/login", element: <Login /> },
  { path: "/user/signup", element: <Signup /> },
  { path: "/user/find_id", element: <FindId /> },
  { path: "/user/find_password", element: <FindPassword /> },
];
