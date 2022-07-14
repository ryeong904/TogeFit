/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import Slider, { Settings } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useEffect, useRef, useState } from 'react';
import ArrowButton from 'common/components/arrow-button/ArrowButton';
import { ROUTINE_INITIAL_MESSAGE } from 'common/constants';
import { usePrevious } from 'common/hooks';
import {
  getMiddlePointX,
  isCursorLeftX,
} from 'common/utils/getElementLocationInfo';
import routineModifyState from 'pages/routine-page/states/routineModifyState';
import currentTargetState from 'pages/add-routine-page/states/currentTargetState';
import exerciseModifyState from 'pages/routine-page/states/exerciseModifyState';
import { routinesState } from 'pages/routine-page/states';
import { useRecoilState } from 'recoil';

import { IRoutinesExerciseInfo } from 'types/interfaces';

import * as SC from './style';

type Idata = {
  name: string;
  count?: string;
  set?: string;
  weight?: string;
};

interface sliderProps {
  /** 슬라이더 아이템 요소 */
  data?: Array<string | number | null>;
  setData?: React.Dispatch<React.SetStateAction<Array<string | number | null>>>;
  objData?: Array<IRoutinesExerciseInfo>;
  setObjData?: React.Dispatch<
    React.SetStateAction<Array<IRoutinesExerciseInfo>>
  >;
  /** 커스텀 클래스 */
  className?: string;
  /** 자동재생 (속도 설정시 number 타입으로) */
  autoplay?: boolean | number;
  /** 슬라이더 속도 */
  speed?: number;
  /** 반복 여부 */
  loop?: boolean;
  // draggable
  draggable?: boolean;

  width?: number;
  dragTarget?: string | number | null;
  setDragTarget?: React.Dispatch<React.SetStateAction<string | number | null>>;
  modifyFlag?: boolean;
  setModalView?: React.Dispatch<React.SetStateAction<boolean>>;
  isCancel?: boolean;
  setIsCancel?: React.Dispatch<React.SetStateAction<boolean>>;
  cache?: Array<string | number | null> | Array<IRoutinesExerciseInfo>;
  setCache?: React.Dispatch<
    React.SetStateAction<
      Array<string | number | null> | Array<IRoutinesExerciseInfo>
    >
  >;
  objCache?: Array<IRoutinesExerciseInfo>;
  setObjCache?: React.Dispatch<
    React.SetStateAction<Array<IRoutinesExerciseInfo>>
  >;
  isModify?: boolean;
  index?: number;
  setIsModify?: () => void;
}

const CustomCarousel = ({
  data = [],
  setData,
  objData = [],
  setObjData,
  className = 'test',
  autoplay = true,
  speed = 500,
  loop = false,
  draggable = false,
  width = 80,
  dragTarget,
  setDragTarget,
  modifyFlag = false,
  setModalView,
  isCancel,
  setIsCancel,
  setCache,
  cache,
  objCache,
  setObjCache,
  isModify = false,
  setIsModify,
  index,
}: sliderProps) => {
  const configureOnlyOneContent = (dataLength: number, showCount: number) =>
    dataLength < showCount ? dataLength : showCount;
  const settings = {
    dots: true,
    infinite: draggable,
    speed,
    slidesToShow: configureOnlyOneContent(data.length || objData.length, 5),
    slidesToScroll: 5,
    initialSlide: 0,
    arrows: true,
    draggable: false,
    nextArrow: <ArrowButton className="arrow-button" />,
    prevArrow: <ArrowButton className="arrow-button" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: configureOnlyOneContent(
            data.length || objData.length,
            4
          ),
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: configureOnlyOneContent(
            data.length || objData.length,
            3
          ),
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: configureOnlyOneContent(
            data.length || objData.length,
            2
          ),
          slidesToScroll: 2,
        },
      },
    ],
  };
  const [currentTarget, setCurrentTarget] = useRecoilState(currentTargetState);
  const [modifyRoutine, setModifyRoutine] = useRecoilState(routineModifyState);
  const [routines, setRoutines] = useRecoilState(routinesState);

  const [exerciseModify, setExerciseModify] =
    useRecoilState(exerciseModifyState);

  const dragOver = (e: any) => {
    e.preventDefault();
  };

  const dragLeave = (e: any) => {
    e.preventDefault();
  };
  const dragStart = (e: any) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', dragTarget);
    if (modifyFlag) return;

    if (setDragTarget) {
      setDragTarget(data[e.currentTarget.dataset.index]);
    }
  };

  const dragEnd = (e: any) => {
    e.currentTarget.style.display = 'block';
  };

  const dragDrop = (e: any) => {
    if (!dragTarget || !modifyFlag) return;

    const cachedData = [...objData];
    const dropTargetIndex = Number(e.currentTarget.dataset.index);
    const isInitial =
      objData[dropTargetIndex].name === ROUTINE_INITIAL_MESSAGE ||
      data[dropTargetIndex] === ROUTINE_INITIAL_MESSAGE;

    if (setObjCache) setObjCache([...cachedData]);

    if (setData) {
      if (isInitial) {
        data.splice(dropTargetIndex, 1, dragTarget);
        setCurrentTarget(dropTargetIndex);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isCursorLeftX(e)) {
          data.splice(dropTargetIndex, 0, dragTarget);
          setCurrentTarget(dropTargetIndex);
        } else {
          data.splice(dropTargetIndex + 1, 0, dragTarget);
          setCurrentTarget(dropTargetIndex + 1);
        }
      }
      setData([...data]);
    } else if (setObjData) {
      const tempData = objData.slice();

      if (isInitial) {
        tempData.splice(dropTargetIndex, 1, {
          name: String(dragTarget),
          count: '',
          set: '',
          weight: '',
        });
        setCurrentTarget(dropTargetIndex);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isCursorLeftX(e)) {
          tempData.splice(dropTargetIndex, 0, {
            name: String(dragTarget),
            count: '',
            set: '',
            weight: '',
          });
          setCurrentTarget(dropTargetIndex);
        } else {
          tempData.splice(dropTargetIndex + 1, 0, {
            name: String(dragTarget),
            count: '',
            set: '',
            weight: '',
          });
          setCurrentTarget(dropTargetIndex + 1);
        }
      }

      setObjData([...tempData]);
    }

    // if (setDragTarget) setDragTarget('');
    if (setModalView) setModalView(true);
  };

  const handleModify = (modifyData: IRoutinesExerciseInfo, i: number) => {
    if (setIsModify) setIsModify();
    setExerciseModify(modifyData);
    let temp;
    if (routines) {
      console.log('custom modifyRoutine', modifyRoutine);
      temp = { ...routines[index || 0], index: i };
      console.log('custom temp', temp);
      setModifyRoutine(temp);
    }
  };
  return (
    <SC.Wrapper width={width} className="CustomCarousel">
      <Slider {...settings}>
        {data &&
          data.map((item, i) => (
            <SC.Slide
              key={i}
              data-index={i}
              draggable={draggable}
              onDragOver={dragOver}
              onDragLeave={dragLeave}
              onDragStart={dragStart}
              onDragEnd={dragEnd}
              onDrop={dragDrop}
            >
              <h3>{item}</h3>
            </SC.Slide>
          ))}

        {objData &&
          !isModify &&
          objData.map((item, i) => (
            <SC.Slide
              key={i}
              data-index={i}
              draggable={draggable}
              onDragOver={dragOver}
              onDragLeave={dragLeave}
              onDragStart={dragStart}
              onDragEnd={dragEnd}
              onDrop={dragDrop}
            >
              <h3>{item.name}</h3>

              {item.set && (
                <p data-type="">
                  세트:
                  <span>{item.set}</span>
                </p>
              )}

              {item.count && <p>개수: {item.count}</p>}
              {item.weight && <p>무게: {item.weight}</p>}
            </SC.Slide>
          ))}

        {objData &&
          isModify &&
          objData.map((item, i) => (
            <SC.Slide
              key={i}
              onClick={(e) => handleModify(item, i)}
              className="exerciseInfo"
              data-index={i}
            >
              <h3>{item.name}</h3>
              {item.set && (
                <p>
                  세트:
                  {item.set}
                </p>
              )}
              {item.count && <p>개수: {item.count}</p>}
              {item.weight && <p>무게: {item.weight}</p>}
            </SC.Slide>
          ))}
      </Slider>
    </SC.Wrapper>
  );
};

export default CustomCarousel;
