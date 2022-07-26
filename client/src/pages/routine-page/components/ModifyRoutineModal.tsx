/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IRoutinesExerciseInfo } from 'types/interfaces';
import useExcerciseModify from '../hooks/useExerciseModify';
import { routinesState } from '../states';
import exerciseModifyState from '../states/exerciseModifyState';
import routineModifyState from '../states/routineModifyState';
import * as SC from './ModifyRoutineModalStyle';

interface Iprops {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCancel?: boolean;
  setIsCancel?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModifyRoutineModal = ({
  isOpen,
  setIsOpen,
  isCancel,
  setIsCancel,
}: Iprops) => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<IRoutinesExerciseInfo>();
  const modifyRoutine = useRecoilValue(routineModifyState);
  const exerciseModify = useRecoilValue(exerciseModifyState);
  const [routines, setRoutines] = useRecoilState(routinesState);
  const { modifyExercise, result } = useExcerciseModify();

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    setIsOpen(false);
    if (setIsCancel) setIsCancel(true);
  };

  const handleConfirm = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const handleDivClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    const routine = { ...modifyRoutine };
    const routineList = [...routine.routine_list];

    routineList[routine.exerciseIndex] = {
      name: data.name || exerciseModify?.name || undefined,
      count: Number(data.count) || Number(exerciseModify?.count) || undefined,
      set: Number(data.set) || Number(exerciseModify?.set) || undefined,
      weight:
        Number(data.weight) || Number(exerciseModify?.weight) || undefined,
    };
    const temp = { ...routine, routine_list: routineList };

    const sendData = {
      routineId: temp._id,
      ...temp,
    };
    const cachedData = {
      ...temp,
    };
    // 전체 데이터 호출하지 않고 저장 후 표현
    let routinesTemp;

    if (typeof routines === 'object') {
      routinesTemp = [...routines];
      routinesTemp[cachedData.routineIndex] = {
        routine_name: cachedData.routine_name,
        routine_list: cachedData.routine_list,
        _id: cachedData._id,
      };
    }

    modifyExercise(sendData);

    setRoutines(routinesTemp);

    setIsOpen(false);
  };
  useEffect(() => {
    if (!exerciseModify) return;

    resetField('count', { defaultValue: exerciseModify.count ?? 0 });
    resetField('set', { defaultValue: exerciseModify.set ?? 0 });
    resetField('weight', { defaultValue: exerciseModify.weight ?? 0 });
  }, [exerciseModify, isOpen]);

  return (
    <SC.Wrapper view={isOpen} onClick={handleCancel}>
      <form onSubmit={handleSubmit(onSubmit)} onClick={handleDivClick}>
        <h3>루틴 수정</h3>
        <div>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            {...register('name', { required: true })}
            unselectable="on"
            defaultValue={exerciseModify?.name}
          />
        </div>
        <div>
          <label htmlFor="set">세트</label>
          <input
            type="number"
            {...register('set', { min: 0, pattern: /^[0-9]/g })}
          />
          {errors.set && errors.set.type === 'min' && (
            <p>0 이상의 수를 입력하세요.</p>
          )}
          {errors.set && errors.set.type === 'pattern' && (
            <p>숫자만 입력해주세요.</p>
          )}
        </div>
        <div>
          <label htmlFor="count">개수</label>
          <input
            type="number"
            {...register('count', { min: 0, pattern: /^[0-9]/g })}
          />
          {errors.count && errors.count.type === 'min' && (
            <p>0 이상의 수를 입력하세요.</p>
          )}
          {errors.count && errors.count.type === 'pattern' && (
            <p>숫자만 입력해주세요.</p>
          )}
        </div>
        <div>
          <label htmlFor="weight">무게</label>
          <input
            type="number"
            {...register('weight', { min: 0, pattern: /^[0-9]/g })}
          />
          {errors.weight && errors.weight.type === 'min' && (
            <p>0 이상의 수를 입력하세요.</p>
          )}
          {errors.weight && errors.weight.type === 'pattern' && (
            <p>숫자만 입력해주세요.</p>
          )}
        </div>
        <div>
          <button type="submit">확인</button>
          <button type="button" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </SC.Wrapper>
  );
};

export default ModifyRoutineModal;
