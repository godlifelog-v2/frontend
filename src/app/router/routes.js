import { QNA_ROUTES } from "./featureRouters/qnaRoutes";
import { ROUTINE_ROUTES } from "./featureRouters/routineRoutes";
import { USER_ROUTES } from "./featureRouters/userRoutes";
import { MYPAGE_ROUTES } from "./featureRouters/mypageRoutes";
import { CHALLENGE_ROUTES } from "./featureRouters/challengeRoutes";
import { FAQ_ROUTES } from "./featureRouters/faqRoutes";
import { NOTICE_ROUTES } from "./featureRouters/noticeRoutes";
import { ADMIN_ROUTES } from "./featureRouters/adminRoutes";
import { HOME_ROUTES } from "./featureRouters/homeRoutes";

export const ALL_ROUTES = [
  ...HOME_ROUTES,
  ...QNA_ROUTES,
  ...ROUTINE_ROUTES,
  ...USER_ROUTES,
  ...MYPAGE_ROUTES,
  ...NOTICE_ROUTES,
  ...FAQ_ROUTES,
  ...CHALLENGE_ROUTES,
  ...ADMIN_ROUTES,
];
