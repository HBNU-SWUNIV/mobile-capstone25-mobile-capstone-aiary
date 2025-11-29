export interface EmotionScores {
  joy: number;
  sadness: number;
  anger: number;
  anxiety: number;
  tiredness: number;
  calm: number;
}

export interface EmotionReportResponse {
  diaryId: string;
  emotions: EmotionScores;
  dominantEmotion: string;
  overallMoodScore: number;
  recommendation: string;
  analyzedAt: string;
  createdAt: string;
}
