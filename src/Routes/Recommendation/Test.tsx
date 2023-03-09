import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import RecommendationApi from '../../Apis/recommendationApi';
import Loading from './Components/Loading';
import Questionnaire from './Components/Questionnaire';

function TestRecommendation() {
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [answeredList, setAnsweredList] = useState<number[]>([]);
  const [isShowResult, setIsShowResult] = useState<boolean>(false);

  const [results, setResults] = useState<Result[]>([]);

  const questions = {
    challengeLocation: {
      question: '어디서 챌린지를 하고 싶으세요? 밖에서? 집에서?',
      answers: ['밖에서 하는 활동 🏃', '집에서 할 수 있는 활동 🏠'],
    },
    challengeDuration: {
      question: '하루에 챌린지를 위해 보낼 수 있는 시간은요?',
      answers: ['10분 이내', '10~30분', '30분~1시간', '1시간 이상'],
    },
    challengeCategory: {
      question: '마지막으로!, 가장 관심있는 카테고리가 뭔지 알려주세요!',
      answers: ['공부 ✍️', '봉사 🧚', '운동 🏃', '경제 💰', '건강 🏋️'],
    },
  };

  const onNextQuestion = (idx?: number) => {
    console.log('선택됨 -->', idx);
    if (idx !== undefined) setAnsweredList([...answeredList, idx]);
    setQuestionsCount((prev) => prev + 1);
  };

  const submitResult = useCallback(async () => {
    if (questionsCount === 4) {
      try {
        const res = await RecommendationApi.getTestResult({
          challengeLocationIndex: answeredList[0],
          challengeDurationIndex: answeredList[1],
          challengeCategoryIndex: answeredList[2],
        });
        console.log(res);
        setResults(res.data);
      } catch (err) {
        console.log(err);
      }

      setTimeout(async () => {
        console.log({
          challengeLocation: answeredList[0],
          challengeDuration: answeredList[1],
          challengeCategory: answeredList[2],
        });
        setIsShowResult(true);
      }, 4000);
    }
  }, [questionsCount]);

  useEffect(() => {
    submitResult();
  }, [submitResult]);

  return (
    <S.Wrapper>
      <S.Container>
        {questionsCount === 0 && (
          <>
            <S.Title>총 3개의 문항으로 추천해드릴게요</S.Title>
            <S.Button onClick={() => onNextQuestion()}>시작하기</S.Button>
          </>
        )}
        {questionsCount === 1 && (
          <Questionnaire
            question={questions.challengeLocation.question}
            answers={questions.challengeLocation.answers}
            onNext={onNextQuestion}
          />
        )}
        {questionsCount === 2 && (
          <Questionnaire
            question={questions.challengeDuration.question}
            answers={questions.challengeDuration.answers}
            onNext={onNextQuestion}
          />
        )}
        {questionsCount === 3 && (
          <Questionnaire
            question={questions.challengeCategory.question}
            answers={questions.challengeCategory.answers}
            onNext={onNextQuestion}
          />
        )}
        {questionsCount === 4 &&
          (!isShowResult ? (
            <>
              <div>모든 응답이 끝났어요! 무슨 챌린지가 나올까요?</div>
              <Loading />
            </>
          ) : (
            <div>RESULT</div>
          ))}
      </S.Container>
    </S.Wrapper>
  );
}
export default TestRecommendation;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80vh;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  height: 90%;
  margin-top: 100px;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 130px;
`;

const Button = styled.button`
  border: none;
  width: 70%;
  margin: 0 auto;
  height: 70px;
  margin-top: 30px;
  font-weight: bold;
  font-size: 30px;
  background-color: var(--color-sky);
  :hover {
    cursor: pointer;
    background-color: #afc3e9;
    transition: all 0.1s ease-in-out;
  }
`;

const S = { Wrapper, Container, Title, Button };

interface Result {
  id: number;
  title: string;
  content: string;
  challengeImgUrls: string[];
}
