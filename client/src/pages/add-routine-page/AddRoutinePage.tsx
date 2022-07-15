/* eslint-disable jsx-a11y/label-has-associated-control */
import { MouseEventHandler, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { ROUTINE_INITIAL_MESSAGE } from 'common/constants';

import { CustomCarousel } from 'common/components';
import { exerciseState } from 'pages/add-routine-page/states';
import { Header } from './components';
import useExcerciseList from './hooks/useExerciseList';
import AddRoutineModal from './components/AddRoutineModal';

import dragTargetState from './states/dragTargetState';
import userRoutineState from './states/userRoutineState';
import useRoutineAdd from './hooks/useRoutineAdd';

import * as SC from './style';

const isDraggableCarousel = true;
const isUserCustomCarousel = true;

type Idata = {
  name: string;
  count?: string;
  set?: string;
  weight?: string;
};

const AddRoutinePage = () => {
  const navigate = useNavigate();

  const [isCancel, setIsCancel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [dragTarget, setDragTarget] = useRecoilState(dragTargetState);
  const [exercise, setExercise] = useRecoilState(exerciseState);

  const [userRoutine, setUserRoutine] = useRecoilState(userRoutineState);

  const [cache, setCache] = useState<Idata[]>([
    {
      name: ROUTINE_INITIAL_MESSAGE,
    },
  ]);

  const { result, getExcerciseList } = useExcerciseList();
  const { addRoutine } = useRoutineAdd();

  useEffect(() => {
    if (isCancel) {
      setUserRoutine([...cache]);
      setIsCancel(false);
    }
  }, [isCancel]);

  useEffect(() => {
    getExcerciseList();
  }, []);

  useEffect(() => {
    if (result?.status === 200) {
      const excerciseList = result.data.map((item) => item.name);
      setExercise(excerciseList);
    }
  }, [result]);

  const handleAddRoutine: MouseEventHandler<HTMLButtonElement> = (e) => {
    const postData = {
      routine_name: routineName,
      routine_list: userRoutine,
    };
    // 로그인하면 주석해제
    addRoutine(postData);
    navigate('/routine');
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    navigate('/routine');
  };

  return (
    <SC.Wrapper>
      <Header />
      <SC.ContentWrapper>
        <SC.InputWrapper>
          <label htmlFor="routineName">루틴 이름:</label>
          <input
            type="text"
            value={routineName}
            id="routineName"
            onChange={(e) => setRoutineName(e.target.value)}
          />
        </SC.InputWrapper>
        <SC.RoutineWrapper>
          <CustomCarousel
            data={exercise}
            draggable={isDraggableCarousel}
            width={90}
            dragTarget={dragTarget}
            setDragTarget={setDragTarget}
            setData={setExercise}
          />
          <CustomCarousel
            objData={userRoutine}
            setObjData={setUserRoutine}
            draggable={isDraggableCarousel}
            width={90}
            dragTarget={dragTarget}
            setDragTarget={setDragTarget}
            modifyFlag={isUserCustomCarousel}
            setModalView={setIsOpen}
            isCancel={isCancel}
            setIsCancel={setIsCancel}
            objCache={cache}
            setObjCache={setCache}
          />
        </SC.RoutineWrapper>
        <SC.ButtonWrapper>
          <button type="button" onClick={handleAddRoutine}>
            확인
          </button>
          <button type="button" onClick={handleCancel}>
            취소
          </button>
        </SC.ButtonWrapper>
      </SC.ContentWrapper>

      <AddRoutineModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCancel={isCancel}
        setIsCancel={setIsCancel}
      />
    </SC.Wrapper>
  );
};

export default AddRoutinePage;
