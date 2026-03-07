import {
  behaviorTimeline,
  childProfiles,
  emotionTimeline,
  messages,
  sessionHistory,
  weeklyProgress,
} from "../mock/dataset"

export const analysisApi = {
  getLiveBehaviorTimeline: async () => Promise.resolve(behaviorTimeline),
  getEmotionTimeline: async () => Promise.resolve(emotionTimeline),
  getWeeklyProgress: async () => Promise.resolve(weeklyProgress),
  getChildProfiles: async () => Promise.resolve(childProfiles),
  getSessionHistory: async () => Promise.resolve(sessionHistory),
  getMessages: async () => Promise.resolve(messages),
}
