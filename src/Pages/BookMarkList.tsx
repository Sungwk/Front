import { useCallback, useEffect, useState } from 'react';
import { GiCancel } from 'react-icons/gi';
import AuthApi from '../Apis/authApi';
import styled from 'styled-components';

type Challenge = {
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
};
type ChallengeOwnerUser = {
  userName: string;
  userId: number;
  email: string;
};

const Challenge = styled.div`
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

export default function BookMarkList() {
  const URL = process.env.REACT_APP_URL;
  const [challengeArray, setChallengeArray] = useState<Challenge[]>([]);
  const getMyBookmarkedChallenge = useCallback(async () => {
    try {
      const { data } = await AuthApi.getMyBookmarkedChallenge();
      console.log(data);
      setChallengeArray(data.content);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getMyBookmarkedChallenge();
  }, [getMyBookmarkedChallenge]);

  const doDeleteBookmark = async (id: number) => {
    if (window.confirm('해당 챌린지를 북마크에서 제거하시겠습니까?'))
      try {
        await AuthApi.deleteMyBookmarkedChallenge(id);
        await getMyBookmarkedChallenge();
      } catch (err) {
        console.log(err);
      }
  };
  return (
    <div style={{ minHeight: '500px', width: '1200px', margin: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
        <div style={{ fontSize: '30px' }}>내가 북마크 한 챌린지</div>
      </div>

      <PostContainer>
        {challengeArray.map((challenge, i) => {
          return (
            <Challenge key={i}>
              <GiCancel
                style={{ position: 'absolute', top: '3px', right: '3px', zIndex: '1', cursor: 'pointer' }}
                onClick={() => doDeleteBookmark(challenge.id)}
              ></GiCancel>
              <img
                src={challenge.challengeImgUrls.length !== 0 ? `${URL}${challenge.challengeImgUrls[0]}` : `/logo.png`}
                alt="noimage"
                style={{ width: '260px', height: '180px', objectFit: 'cover', cursor: 'pointer', marginBottom: '10px' }}
                onClick={() => (window.location.href = `/challenge/${challenge.challengeId}`)}
              />
              <div
                style={{ fontSize: '20px', fontWeight: 'bolder', cursor: 'pointer', marginBottom: '4px' }}
                onClick={() => (window.location.href = `/challenge/${challenge.challengeId}`)}
              >
                {challenge.title}
              </div>
              <div style={{ fontSize: '13px', cursor: 'pointer' }}>{challenge.challengeContent}</div>
            </Challenge>
          );
        })}
      </PostContainer>
    </div>
  );
}
