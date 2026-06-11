import { useState } from 'react'
import {
  calculateRisk,
  VIOLENCE_LEVELS,
  VIOLENTOMETRO_QUESTIONS
} from '../lib/violentometro-data'

export const useTestViolentometro = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = VIOLENTOMETRO_QUESTIONS[currentQuestionIndex] || null

  const currentLevel = currentQuestion
    ? VIOLENCE_LEVELS.find((l) => l.id === currentQuestion.level)
    : VIOLENCE_LEVELS[0]

  const progress =
    ((currentQuestionIndex + 1) / VIOLENTOMETRO_QUESTIONS.length) * 100

  const handleAnswer = (option) => {
    if (isTransitioning || !currentQuestion) return

    setIsTransitioning(true)

    const newAnswers = { ...answers, [currentQuestion.id]: option }
    setAnswers(newAnswers)

    if (currentQuestionIndex < VIOLENTOMETRO_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
        setIsTransitioning(false)
      }, 200)
    } else {
      const riskResult = calculateRisk(newAnswers)
      setResult(riskResult)
      setIsCompleted(true)
      setIsTransitioning(false)
    }
  }

  const resetAssessment = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setIsCompleted(false)
    setResult(null)
    setIsTransitioning(false)
  }

  return {
    isCompleted,
    currentQuestion,
    currentLevel,
    progress,
    result,
    VIOLENTOMETRO_QUESTIONS,
    currentQuestionIndex,
    handleAnswer,
    resetAssessment,
    isTransitioning
  }
}
