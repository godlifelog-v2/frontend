import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useLatestPlans } from '../hooks/useLatestPlans';
import { useLatestChallenges } from '../hooks/useLatestChallenges';
import { useMyPlans } from '../hooks/useMyPlans';
import SwipeCard from '../components/SwipeCard';
import PlanCardContent from '../components/PlanCardContent';
import MyPlanCardContent from '../components/MyPlanCardContent';
import ChallengeCardContent from '../components/ChallengeCardContent';
import LoginPrompt from '../components/LoginPrompt';

function Home() {
  const navigate = useNavigate();
  const { plans, currentPlanIndex, loading: plansLoading, nextPlan, prevPlan, handlePlanClick } = useLatestPlans();
  const { challenges, currentChallengeIndex, loading: challengesLoading, nextChallenge, prevChallenge, handleChallengeClick, getCategoryName } = useLatestChallenges();
  const { myPlans, currentMyPlanIndex, loading: myPlansLoading, isAuthenticated, nextMyPlan, prevMyPlan, handleMyPlanClick } = useMyPlans();

  const loading = plansLoading || challengesLoading || myPlansLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 내 루틴 섹션 */}
        <div className="mb-12">
          {!isAuthenticated ? (
            <LoginPrompt onLoginClick={() => navigate('/user/login')} />
          ) : myPlans.length > 0 ? (
            <div className="w-full overflow-hidden">
              <SwipeCard
                currentIndex={currentMyPlanIndex}
                totalCount={myPlans.length}
                onPrev={prevMyPlan}
                onNext={nextMyPlan}
              >
                <MyPlanCardContent
                  myplan={myPlans[currentMyPlanIndex]}
                  onClick={handleMyPlanClick}
                />
              </SwipeCard>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="mb-4">
                <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">아직 진행중인 루틴이 없습니다</p>
              </div>
              <button
                onClick={() => navigate('/routine/list')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>루틴 둘러보기</span>
              </button>
            </div>
          )}
        </div>

        {/* 공개 루틴 섹션 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">공개 루틴</h2>
          </div>

          {plans.length > 0 ? (
            <div className="w-full overflow-hidden">
              <SwipeCard
                currentIndex={currentPlanIndex}
                totalCount={plans.length}
                onPrev={prevPlan}
                onNext={nextPlan}
              >
                <PlanCardContent plan={plans[currentPlanIndex]} onClick={handlePlanClick} />
              </SwipeCard>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">루틴 데이터가 없습니다.</div>
          )}
        </div>

        {/* 챌린지 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">챌린지</h2>
          </div>

          {challenges.length > 0 ? (
            <div className="w-full overflow-hidden">
              <SwipeCard
                currentIndex={currentChallengeIndex}
                totalCount={challenges.length}
                onPrev={prevChallenge}
                onNext={nextChallenge}
              >
                <ChallengeCardContent
                  challenge={challenges[currentChallengeIndex]}
                  onClick={handleChallengeClick}
                  getCategoryName={getCategoryName}
                />
              </SwipeCard>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">챌린지 데이터가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
