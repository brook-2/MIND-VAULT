/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionCategory = 'science' | 'popculture' | 'history' | 'geography' | 'logic' | 'speed';

export interface AnswerChoice {
  id: string;
  text: string;
  iqValue: number; // 0 to 15 impact
  points: {
    science?: number;
    popculture?: number;
    history?: number;
    geography?: number;
    logic?: number;
    speed?: number;
  };
}

export interface Question {
  id: number;
  category: QuestionCategory;
  text: string;
  options: AnswerChoice[];
  timerLimit?: number; // active for speed questions
  hint?: string;
}

export interface RankTitle {
  minScore: number;
  maxScore: number;
  title: string;
  badge: string;
  description: string;
  color: string; // Tailwind neon color border/text
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // name of lucide-react icon
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAtPercent?: number; // logic or level based
  color: string;
  UNLOCKED?: string;
}

export interface PersonalityType {
  code: string;
  name: string;
  description: string;
  emoji: string;
  strengths: string[];
  weaknesses: string[];
  matchesWith: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  country: string;
  avatar: string;
  xp: number;
  iq: number;
  badge: string;
  streak: number;
}
