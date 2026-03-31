import React from "react";
import RoutineCardList from "../components/list/RoutineCardList";
import { useMyRoutineList } from "../hooks/useMyRoutineList";

const MyRoutineList = () => {
  const { routines, isLoading, error, handleCardClick, handleAddNewRoutine, handleRetry } = useMyRoutineList();

  return (
    <RoutineCardList
      routines={routines}
      isLoading={isLoading}
      error={error}
      onCardClick={handleCardClick}
      onAddNewRoutine={handleAddNewRoutine}
      onRetry={handleRetry}
      isMyRoutine={true}
    />
  );
};

export default MyRoutineList;
