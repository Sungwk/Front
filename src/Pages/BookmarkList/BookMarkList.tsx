import { useCallback, useEffect, useState } from 'react';
import { GiCancel } from 'react-icons/gi';
import AuthApi from '../../Apis/authApi';
import styled from 'styled-components';
import { ChallengeOwnerUser } from '../../Interfaces';
import ChallengeApi from '../../Apis/challengeApi';

import { useRecoilState } from 'recoil';
import { isAlertModalAtom, alertMessageAtom } from '../../Atoms/modal.atom';
import AlertModal from '../../Components/Modal';

interface Challenge {
  challengeId: number;
  id: number;
  title: string;
  challengeCategory: string;
  challengeLocation: string;
  challengeContent: string;
  challengeDuration: string;
  howManyUsersAreInThisChallenge: number;
  challengeOwnerUser: ChallengeOwnerUser;
  challengeImgUrls: string;
  created_at: string;
}

const ChallengeCard = styled.div`
  width: 300px;
  height: 300px;
  background: var(--color-sky);
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  border-radius: 10px;
`;

const PostContainer = styled.div`
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 50px;
`;

const URL = process.env.REACT_APP_URL;

export default function BookMarkList() {
  const [challengeArray, setChallengeArray] = useState<Challenge[]>([]);

  const [isAlertModal, setIsAlertModal] = useRecoilState<boolean>(isAlertModalAtom);
  const [alertMessage, setAlertMessage] = useRecoilState<string>(alertMessageAtom);

  const getMyBookmarkedChallenge = useCallback(async () => {
    try {
      const { data } = await AuthApi.getMyBookmarkedChallenge();
      console.log(data);
      setChallengeArray(data.content);
    } catch (err: any) {
      setAlertMessage(err.response.data.message || '토큰');
      setIsAlertModal(true);
    }
  }, []);

  useEffect(() => {
    getMyBookmarkedChallenge();
  }, [getMyBookmarkedChallenge]);

  const doDeleteBookmark = async (id: number) => {
    if (window.confirm('해당 챌린지를 북마크에서 제거하시겠습니까?'))
      try {
        await ChallengeApi.deleteBookmark(id);
        await getMyBookmarkedChallenge();
      } catch (err: any) {
        setAlertMessage(err.response.data.message || '토큰');
        setIsAlertModal(true);
      }
  };
  return (
    <>
      {isAlertModal && <AlertModal content={alertMessage} />}
      <div style={{ minHeight: '500px', margin: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
          <div style={{ fontSize: '30px' }}>내가 북마크 한 챌린지</div>
        </div>

        <PostContainer>
          {challengeArray.map((challenge, i) => {
            return (
              <ChallengeCard key={i}>
                <GiCancel
                  style={{ position: 'absolute', top: '3px', right: '3px', zIndex: '1', cursor: 'pointer' }}
                  onClick={() => doDeleteBookmark(challenge.id)}
                ></GiCancel>
                <img
                  src={challenge.challengeImgUrls.length !== 0 ? `${URL}${challenge.challengeImgUrls[0]}` : `/logo.png`}
                  alt="noimage"
                  style={{
                    width: '260px',
                    height: '180px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    marginBottom: '10px',
                  }}
                  onClick={() => (window.location.href = `/challenge/${challenge.challengeId}`)}
                />
                <div
                  style={{
                    maxWidth: '100%',
                    fontSize: '20px',
                    fontWeight: 'bolder',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => (window.location.href = `/challenge/${challenge.challengeId}`)}
                >
                  {challenge.title}
                </div>
                <div
                  style={{
                    maxWidth: '100%',
                    fontSize: '13px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {challenge.challengeContent}
                </div>
              </ChallengeCard>
            );
          })}
        </PostContainer>
      </div>
    </>
  );
}
