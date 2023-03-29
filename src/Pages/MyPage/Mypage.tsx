import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import AuthApi from '../../Apis/authApi';
import Progressbar from '../../Components/Progressbar';
import ChallengeItem from './ChallengeItem';

import { useRecoilState } from 'recoil';
import { alertMessageAtom, isAlertModalAtom } from '../../Atoms/modal.atom';
import AlertModal from '../../Components/Modal';

const Container = styled.div`
  text-align: left;
  justify-content: center;
  // margin: auto 0;
  display: inline-block;
  width: 1200px;
`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  border: 3px solid black;
  border-radius: 50%;
`;

interface ChallengeList {
  challengeId: number;
  challengeTitle: string;
  challengeContent: string;
  challengeStatus: string;
  weeklyAchievement: boolean[];
}

export default function Mypage() {
  const URL = process.env.REACT_APP_URL;
  const [myChallengeList, setMyChallengeList] = useState<ChallengeList[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);

  const [checkedArr, setCheckedArr] = useState<Array<number>>([]);

  const [isAlertModal, setIsAlertModal] = useRecoilState<boolean>(isAlertModalAtom);
  const [alertMessage, setAlertMessage] = useRecoilState<string>(alertMessageAtom);

  const getMyChallenge = useCallback(async () => {
    try {
      const res = await AuthApi.getMyParticipatedChallenge();
      let countCompleted = 0;
      res.data.map((challenge: ChallengeList) => {
        if (challenge.challengeStatus === 'SUCCESS') {
          countCompleted += 1;
        }
      });
      setCompleted(countCompleted);
      setMyChallengeList(res.data);
      setTotal(res.data.length);
    } catch (err: any) {
      setAlertMessage(err.response.data.message || '토큰');
      setIsAlertModal(true);
    }
  }, []);

  const pushChallenge = (id: number, status: string) => {
    let copyArray = [...checkedArr];

    // 자식 컴포넌트에서 체크박스를 체크했을 경우
    if (status === 'add') {
      console.log('o');
      setCompleted(completed + 1);
      copyArray.push(id);
      setCheckedArr(copyArray);
    } else if (status === 'delete') {
      setCompleted(completed - 1);
      // 자식 컴포넌트에서 체크박스를 해체했을 경우
      copyArray.map((value) => {
        if (value === id) {
          const deleteIdx = copyArray.indexOf(value);
          setCheckedArr(copyArray.splice(deleteIdx, 1));
        }
      });
    }
  };

  useEffect(() => {
    getMyChallenge();
  }, []);

  return (
    <>
      {isAlertModal && <AlertModal content={alertMessage} />}
      <div style={{ marginTop: '40px' }}>
        <Container>
          <div>
            <div style={{ color: 'var(--color-dark-blue)', fontWeight: 600, fontSize: '30px' }}>마이페이지</div>
          </div>
          <div style={{ marginTop: '50px', display: 'flex' }}>
            <div style={{ display: 'inline-block' }}>
              <Image
                src={
                  localStorage.getItem('imageUrl')?.split('/')[1] === 'images'
                    ? URL + `${localStorage.getItem('imageUrl')}` ?? ''
                    : localStorage.getItem('imageUrl') ?? ''
                }
              ></Image>
            </div>
            <div style={{ display: 'inline-block', height: '140px', padding: '10px 30px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ fontSize: '28px', fontWeight: '600', display: 'inline-block' }}>
                  {localStorage.getItem('userName')} 님
                </div>
                <div style={{ padding: '8px 30px', display: 'inline-block' }}>
                  {/* <EditButton>프로필 수정</EditButton> */}
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>{localStorage.getItem('info') ?? '아직 자기소개가 없어요!🏃🏻'}</div>
            </div>
          </div>
          <div style={{ height: '30px' }}></div>
          <div>
            <Progressbar now={completed} total={total} />
          </div>
          <div style={{ marginTop: '15px' }}>
            {total ? (
              <div style={{ display: 'inline-block', float: 'right', fontWeight: '600', fontSize: '20px' }}>
                <span>{`오늘은 ${total}개 중에 `}</span>
                <span style={{ color: 'rgb(228, 15, 15)' }}>{`${completed}`}</span>
                <span>개를 완료하셨어요!</span>
              </div>
            ) : (
              <div style={{ display: 'inline-block', float: 'right', fontWeight: '600', fontSize: '20px' }}>
                <span>진행 중인 챌린지가 없습니다.</span>
              </div>
            )}
            <div style={{ height: '30px' }}></div>
            <div>
              {myChallengeList.map((challenge) => {
                return (
                  <ChallengeItem
                    id={challenge.challengeId}
                    title={challenge.challengeTitle}
                    content={challenge.challengeContent}
                    pushChallenge={pushChallenge}
                    status={challenge.challengeStatus}
                    weeklyAchievement={challenge.weeklyAchievement}
                    getMyChallenge={getMyChallenge}
                  />
                );
              })}
            </div>
          </div>
          <div style={{ height: '45px' }}></div>
        </Container>
      </div>
    </>
  );
}
