import React from 'react';
import styled from 'styled-components';
import PopularChallenge from '../Components/PopularChallenge';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaMedal } from 'react-icons/fa';
import useScrollFadeIn from '../Hooks/useScrollFadeIn';
import CONSTANT_INFO from '../Constant/Constant';

function Home() {
  const Category = ['공부', '봉사', '운동', '경제', '건강'];
  const medal = ['gold', 'silver', '#964b00'];
  const URL = process.env.REACT_APP_URL;

  const IMAGE_URL = CONSTANT_INFO.IMAGE_URL;
  const navigate = useNavigate();
  const [popularChallenge, setPopularChallenge] = useState<Challenge[]>([]);
  const [myChallengeList, setMyChallengeList] = useState<ChallengeList[]>([]);

  const ChallengeBox = styled.div`
    border: 3px solid var(--color-sky);
    background: rgba(219, 226, 239, 0.3);
    border-radius: 8px;
    width: 90%;
    height: 60px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  `;

  const CursorDiv = styled.div`
    width: 40px;
    height: 40px;
    &:hover {
      cursor: pointer;
    }
  `;
  interface ChallengeList {
    challengeId: number;
    challengeTitle: string;
    challengeContent: string;
    challengeStatus: string;
  }

  const getMyChallenge = useCallback(async () => {
    const config = {
      method: 'get',
      url: `${URL}/user/participate`,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    await axios(config)
      .then((res) => {
        setMyChallengeList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onClickCheck = (status: string, id: number) => {
    let config = {};
    if (status === 'SUCCESS') {
      config = {
        method: 'post',
        url: `${URL}/challenge/${id}/pause`,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
    } else {
      config = {
        method: 'post',
        url: `${URL}/challenge/${id}/success`,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
    }
    axios(config)
      .then(() => {
        getMyChallenge();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMyChallenge();
  }, [getMyChallenge]);

  const getPopularChallenge = async () => {
    const config = {
      method: 'get',
      url: `${URL}/challenge?size=4&page=0&sort=popular`,
    };
    await axios(config).then((res) => {
      setPopularChallenge(res.data.content);
    });
  };

  const replaceDateFormat = (date: string): string => {
    let day = date.split(' ')[0];
    let time = date.split(' ')[1].slice(0, 8);
    return day + ' ' + time;
  };

  const animatedItem: any = {
    0: useScrollFadeIn('up', 0, 0),
    1: useScrollFadeIn('up', 1, 0.2),
    2: useScrollFadeIn('up', 1, 0.3),
    3: useScrollFadeIn('up', 1, 0.4),
    4: useScrollFadeIn('up', 1, 0.5),
    5: useScrollFadeIn('up', 1, 0.6),
  };

  useEffect(() => {
    getPopularChallenge();
  }, []);
  return (
    <div>
      {localStorage.getItem('token') ? (
        <Card background="var(--color-white)" height="70vh">
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'black',
            }}
          >
            <div
              style={{
                fontSize: '30px',
                fontWeight: 'bolder',
              }}
            >
              ⭐️오늘의 챌린지⭐️
            </div>
            <div
              style={{
                width: '70vw',
                height: '400px',
                marginTop: '20px',
                border: '2px solid var(--color-blue)',
                background: 'white',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '30px',
              }}
            >
              {myChallengeList.map((challenge) => {
                return (
                  <ChallengeBox>
                    <div style={{ fontSize: '20px' }}>{challenge.challengeTitle}</div>
                    <CursorDiv
                      onClick={() => {
                        onClickCheck(challenge.challengeStatus, challenge.challengeId);
                      }}
                    >
                      {challenge.challengeStatus == 'SUCCESS' ? (
                        <img style={{ width: '40px' }} src={IMAGE_URL.CHECK_YES_URL} />
                      ) : (
                        <img style={{ width: '40px' }} src={IMAGE_URL.CHECK_NO_URL} />
                      )}
                    </CursorDiv>
                  </ChallengeBox>
                );
              })}
              {myChallengeList[0] ? (
                <ChallengeBox
                  style={{
                    background: 'var(--color-blue)',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bolder',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate('/my-page');
                  }}
                >
                  자세히보기
                </ChallengeBox>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      marginTop: '60px',
                    }}
                  >
                    챌린지가 없습니다!
                  </div>
                  <ChallengeBox
                    style={{
                      background: 'var(--color-blue)',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bolder',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate('/challengelist');
                    }}
                  >
                    챌린지 추가하기
                  </ChallengeBox>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card background="url('/main.jpg')" height="90vh">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              margin: '200px',
              color: 'black',
              fontSize: '70px',
            }}
          >
            <div>타인에게 공유하는</div>
            <div>나만의 챌린지</div>
            <div style={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }}>나만의 데일리 챌린지를</div>
            <div style={{ fontSize: '20px', color: 'black', fontWeight: 'bold' }}>사람들에게 공유하세요!</div>
          </div>
        </Card>
      )}
      <Card background="white" height="50vh" {...animatedItem[0]}>
        <div
          {...animatedItem[0]}
          style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {Category.map((category, index) => (
            <CategoryBtn
              {...animatedItem[index + 1]}
              onClick={() => {
                navigate(`/challengelist//${category}`);
              }}
            >
              {category}
            </CategoryBtn>
          ))}
        </div>
      </Card>
      <Card background="var(--color-white)" height="600px">
        <div style={{ width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>인기 챌린지</div>
          <div style={{ width: '100%', display: 'flex', marginTop: '50px', justifyContent: 'space-around' }}>
            {popularChallenge.map((challenge, i) => {
              return (
                <Challenge key={i} onClick={() => (window.location.href = `/challenge/${challenge.id}`)}>
                  {i <= 2 ? (
                    <FaMedal
                      style={{
                        zIndex: '1',
                        width: '30px',
                        height: '30px',
                        position: 'absolute',
                        left: '5px',
                        top: '5px',
                        color: medal[i],
                      }}
                    />
                  ) : null}
                  <img
                    src={
                      challenge.challengeImgUrls.length != 0
                        ? `${URL}` + `${challenge.challengeImgUrls[0]}`
                        : `/logo.png`
                    }
                    alt="noimage"
                    style={{ width: '260px', height: '180px', objectFit: 'cover' }}
                  />
                  <div style={{ fontSize: '20px', fontWeight: 'bolder' }}>{challenge.title}</div>
                  <div
                    style={{
                      fontSize: '13px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      position: 'absolute',
                      bottom: '20px',
                    }}
                  >
                    <div style={{ fontSize: '15px' }}>{challenge.challengeOwnerUser.userName}</div>
                    <div>{replaceDateFormat(challenge.created_at)}</div>
                  </div>
                </Challenge>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Home;

type Challenge = {
  id: number;
  title: string;
  challengeCategory: string;
  challengeLocation: string;
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

const Card = styled.div<{ background: string; height: string }>`
  width: 100%;
  height: ${(props) => props.height};
  background: ${(props) => props.background};
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  background-size: cover;
`;
const CategoryBtn = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0ecec;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    background: var(--color-sky);
    font-size: 25px;
  }
`;

const Challenge = styled.div`
  width: 300px;
  height: 300px;
  background: var(--color-sky);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  border-radius: 10px;
  :hover {
    cursor: pointer;
  }
`;
