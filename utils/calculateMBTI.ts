import { Question } from '@/data/questions'

export function calculateMBTI(questions: Question[], answers: Record<number, 'A' | 'B'>): string {
  let E = 0,
    I = 0,
    S = 0,
    N = 0,
    T = 0,
    F = 0,
    J = 0,
    P = 0

  questions.forEach((question) => {
    // 跳过INFO类型的问题
    if (question.dimension === 'INFO') return

    const answer = answers[question.id]
    if (!answer) return

    if (question.dimension === 'E' || question.dimension === 'I') {
      if (answer === 'A') {
        question.dimension === 'E' ? E++ : I++
      } else {
        question.dimension === 'E' ? I++ : E++
      }
    } else if (question.dimension === 'S' || question.dimension === 'N') {
      if (answer === 'A') {
        question.dimension === 'S' ? S++ : N++
      } else {
        question.dimension === 'S' ? N++ : S++
      }
    } else if (question.dimension === 'T' || question.dimension === 'F') {
      if (answer === 'A') {
        question.dimension === 'T' ? T++ : F++
      } else {
        question.dimension === 'T' ? F++ : T++
      }
    } else if (question.dimension === 'J' || question.dimension === 'P') {
      if (answer === 'A') {
        question.dimension === 'J' ? J++ : P++
      } else {
        question.dimension === 'J' ? P++ : J++
      }
    }
  })

  const mbtiType = `${E >= I ? 'E' : 'I'}${S >= N ? 'S' : 'N'}${T >= F ? 'T' : 'F'}${J >= P ? 'J' : 'P'}`
  return mbtiType
}
