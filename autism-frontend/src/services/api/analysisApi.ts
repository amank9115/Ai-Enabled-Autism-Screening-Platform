import { fetchJson } from "../../api/client"
import {
  behaviorTimeline,
  childProfiles,
  emotionTimeline,
  messages,
  sessionHistory,
  weeklyProgress,
} from "../mock/dataset"

export const analysisApi = {
  getLiveBehaviorTimeline: async () => {
    try {
      return await fetchJson<typeof behaviorTimeline>("/analysis/live-behavior")
    } catch {
      return behaviorTimeline
    }
  },
  getEmotionTimeline: async () => {
    try {
      return await fetchJson<typeof emotionTimeline>("/analysis/emotion-timeline")
    } catch {
      return emotionTimeline
    }
  },
  getWeeklyProgress: async () => {
    try {
      return await fetchJson<typeof weeklyProgress>("/analysis/weekly-progress")
    } catch {
      return weeklyProgress
    }
  },
  getChildProfiles: async () => {
    try {
      return await fetchJson<typeof childProfiles>("/analysis/child-profiles")
    } catch {
      return childProfiles
    }
  },
  getSessionHistory: async () => {
    try {
      return await fetchJson<typeof sessionHistory>("/analysis/session-history")
    } catch {
      return sessionHistory
    }
  },
  getMessages: async () => {
    try {
      return await fetchJson<typeof messages>("/analysis/messages")
    } catch {
      return messages
    }
  },
}
