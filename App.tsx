/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Crown, 
  Zap, 
  Flame, 
  Coins, 
  Award, 
  Share2, 
  Settings, 
  User, 
  Trophy, 
  ShoppingBag, 
  Brain, 
  Timer, 
  ChevronRight, 
  Lock, 
  Shield, 
  Activity, 
  CheckCircle2, 
  Home, 
  Play, 
  RotateCw, 
  Info, 
  Volume2, 
  VolumeX, 
  Heart, 
  Terminal, 
  MessageSquare, 
  ExternalLink,
  ChevronLeft,
  X,
  Plus
} from 'lucide-react';

import { ACTIVE_QUESTIONS, RANK_TITLES, ACHIEVEMENT_BADGES, PERSONALITY_TYPES, SAMPLE_LEADERBOARD } from './data/gameData';
import { Question, RankTitle, AchievementBadge, PersonalityType, LeaderboardUser } from './types';

export default function App() {
  // Navigation & Screen Stack States
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'auth' | 'home' | 'quiz' | 'reveal' | 'leaderboard' | 'shop' | 'profile' | 'settings' | 'privacy' | 'terms'>('onboarding');
  
  // User Profile Data
  const [username, setUsername] = useState<string>('Guest_Thinker');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('👾');
  const [xp, setXp] = useState<number>(350);
  const [coins, setCoins] = useState<number>(140);
  const [gems, setGems] = useState<number>(45);
  const [streak, setStreak] = useState<number>(14);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(['first_test']);
  const [isVip, setIsVip] = useState<boolean>(false);
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);

  // Quiz Game Logic States
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answersSelected, setAnswersSelected] = useState<Record<number, string>>({}); // questionId: choiceId
  const [iqScore, setIqScore] = useState<number>(100);
  const [categoryScores, setCategoryScores] = useState({
    science: 80,
    popculture: 75,
    history: 70,
    geography: 75,
    logic: 80,
    speed: 75
  });

  // Daily Challenge & Special Modes
  const [isDailyChallenge, setIsDailyChallenge] = useState<boolean>(false);
  const [dailyCompleted, setDailyCompleted] = useState<boolean>(false);
  const [dailyChanceCounter, setDailyChanceCounter] = useState<number>(1);
  const [spinWheelOpen, setSpinWheelOpen] = useState<boolean>(false);
  const [wheelSpinning, setWheelSpinning] = useState<boolean>(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  
  // Quiz Timer State
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1.0);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [hintVisible, setHintVisible] = useState<boolean>(false);

  // AI Generation & Analysis API states
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    analysis: string;
    quirkyStat: string;
    quote: string;
  } | null>(null);
  const [loadingAiAnalysis, setLoadingAiAnalysis] = useState<boolean>(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);

  // Left Column Simulated Matchmaking / Battle Logs
  const [battleLogs, setBattleLogs] = useState<Array<{ id: number; message: string; sub: string; tag: string; type: 'success' | 'warn' | 'neutral' }>>([
    { id: 1, message: "Alex_GenZ", sub: "Just reached 'Sigma Strategist' rank", tag: "+42XP", type: 'success' },
    { id: 2, message: "CyberLina", sub: "Beat Speed Challenge #244", tag: "+50 Coins", type: 'success' },
    { id: 3, message: "NeoVoid", sub: "Cracked ethical dilemma paradox", tag: "IQ 141", type: 'neutral' },
    { id: 4, message: "Aura_Lord", sub: "Died on Speed Trap Question #12", tag: "Streak Reset", type: 'warn' }
  ]);

  // Audio simulation feedback helper
  const playSimulatedAudio = (type: string) => {
    if (!soundsEnabled) return;
    // We visualize simulated sound cues since actual audio play in sandbox requires local files
    console.log(`[AUDIO EVENT] Played sound: ${type}`);
  };

  const triggerSimulatedHaptic = () => {
    if (!hapticEnabled) return;
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
  };

  // Add periodic live simulated multiplayer battles to left console (TikTok & HQ Trivia live action vibes)
  useEffect(() => {
    const names = ["giga_brain_x", "ZeddAura", "MatrixHacker", "npc_slayer", "SpikeLogician", "KiraMind", "Anya_4D", "quantum_clover"];
    const actions = [
      "Completed visual pattern riddle under 2s",
      "Reached 'Aura Architect' level",
      "Unlocked 'No Hints' Epic custom badge",
      "Failed to calculate Bat & Ball trap",
      "Spin wheel jackpot hit!",
      "Re-evaluated ethical score with Gems"
    ];
    const awards = ["+30XP", "IQ 132 REVEALED", "+100 Gems", "Streak Broken", "+500 Coins", "+12XP"];
    const types: Array<'success' | 'warn' | 'neutral'> = ['success', 'success', 'neutral', 'warn', 'success', 'success'];

    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomAwardIndex = Math.floor(Math.random() * awards.length);
      const randomAward = awards[randomAwardIndex];
      const randomType = types[randomAwardIndex % types.length];

      setBattleLogs(prev => [
        {
          id: Date.now(),
          message: randomName,
          sub: randomAction,
          tag: randomAward,
          type: randomType
        },
        ...prev.slice(0, 4)
      ]);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for active Speed/Time critical questions
  useEffect(() => {
    if (currentScreen !== 'quiz') return;
    
    // We decrement seconds left for active questions
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Time expired! Force-submit next question with a small penalty and trigger haptic
          triggerSimulatedHaptic();
          playSimulatedAudio('time_up');
          handleNextQuestion(null);
          return isDailyChallenge ? 5 : 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, currentQuestionIndex]);

  // Handle onboarding to auth selection
  const skipOrContinueOnboarding = () => {
    playSimulatedAudio('btn_click');
    setCurrentScreen('auth');
  };

  // Authenticate (Guest Mode or Demo user seed)
  const handleAuth = (type: 'guest' | 'google' | 'apple') => {
    playSimulatedAudio('portal_unlock');
    if (type === 'google') {
      setUsername('AuraGamer_G');
    } else if (type === 'apple') {
      setUsername('CloudMind_🍎');
    }
    setCurrentScreen('home');
    unlockAchievement('first_test');
  };

  // Setup specialized test loop
  const startFullTest = () => {
    playSimulatedAudio('game_start');
    // Select 15 intriguing diverse questions from active database
    // We mix some fixed hardcoded ones + standard procedurals
    const setQuestions = ACTIVE_QUESTIONS.slice(0, 15);
    setQuizQuestions(setQuestions);
    setCurrentQuestionIndex(0);
    setAnswersSelected({});
    setComboCount(0);
    setComboMultiplier(1.0);
    setSecondsLeft(30);
    setHintVisible(false);
    setIsDailyChallenge(false);
    setCurrentScreen('quiz');
  };

  const startDailyChallenge = () => {
    if (dailyCompleted) {
      alert("Daily challenge completed! Come back in 24 hours.");
      return;
    }
    playSimulatedAudio('game_start');
    setIsDailyChallenge(true);
    // Find a premium highly difficult speed logic trap
    const dailyQuest = ACTIVE_QUESTIONS.find(q => q.category === 'speed') || ACTIVE_QUESTIONS[1];
    setQuizQuestions([dailyQuest]);
    setCurrentQuestionIndex(0);
    setAnswersSelected({});
    setSecondsLeft(5); // Hard speed challenge: 5 seconds only!
    setHintVisible(false);
    setCurrentScreen('quiz');
  };

  // Process Quiz Answers and evaluate score formulas
  const selectChoice = (choiceId: string) => {
    setAnswersSelected(prev => ({
      ...prev,
      [quizQuestions[currentQuestionIndex].id]: choiceId
    }));
    triggerSimulatedHaptic();
    playSimulatedAudio('swipe_card');
  };

  const unlockHint = () => {
    if (coins < 10) {
      alert("Not enough Cosmic Coins to decrypt hint!");
      return;
    }
    playSimulatedAudio('buy_hint');
    setCoins(prev => prev - 10);
    setHintVisible(true);
  };

  const handleNextQuestion = (forcedChoiceId: string | null = null) => {
    const currentQ = quizQuestions[currentQuestionIndex];
    const chosenId = forcedChoiceId || answersSelected[currentQ.id];
    const isCorrect = chosenId && chosenId.endsWith('b'); // Curated structure maps optimal solutions to endsWith('b') or high parameters

    if (isCorrect) {
      setComboCount(prev => prev + 1);
      setComboMultiplier(prev => Math.min(2.5, prev + 0.3));
      setCoins(prev => prev + 5);
      playSimulatedAudio('streak_combo');
    } else {
      setComboCount(0);
      setComboMultiplier(1.0);
      playSimulatedAudio('wrong_answer');
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSecondsLeft(isDailyChallenge ? 5 : 30);
      setHintVisible(false);
    } else {
      // Completed last question! Compute final strategic parameters
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    playSimulatedAudio('victory_reveal');
    
    if (isDailyChallenge) {
      setDailyCompleted(true);
      setGems(prev => prev + 25);
      setXp(prev => prev + 120);
      alert("⚡ Daily Speed Lock Bypassed! Received +25 Gems & +120 XP! Your strategic multiplier was maximized.");
      setCurrentScreen('home');
      unlockAchievement('perfect_speed');
      return;
    }

    // Process IQ calculation and breakdown metrics based on chosen variables
    let finalIqCalculated = 85; 
    let sumScience = 55;
    let sumPopculture = 50;
    let sumHistory = 50;
    let sumGeography = 55;
    let sumLogic = 60;
    let sumSpeed = 60;

    // Iterate responses to compile scores
    quizQuestions.forEach(q => {
      const selected = answersSelected[q.id];
      if (!selected) return;
      
      const option = q.options.find(opt => opt.id === selected);
      if (!option) return;

      finalIqCalculated += (option.iqValue - 80) * 0.85;
      
      if (option.points?.science) sumScience += option.points.science * 4.5;
      if (option.points?.popculture) sumPopculture += option.points.popculture * 4.5;
      if (option.points?.history) sumHistory += option.points.history * 4.5;
      if (option.points?.geography) sumGeography += option.points.geography * 4.5;
      if (option.points?.logic) sumLogic += option.points.logic * 4.5;
      if (option.points?.speed) sumSpeed += option.points.speed * 4.5;
    });

    // Make parameters clean & proportional
    const roundedIq = Math.min(195, Math.max(65, Math.round(finalIqCalculated)));
    const scienceScore = Math.min(100, Math.round(sumScience));
    const popcultureScore = Math.min(100, Math.round(sumPopculture));
    const historyScore = Math.min(100, Math.round(sumHistory));
    const geographyScore = Math.min(100, Math.round(sumGeography));
    const logicScore = Math.min(100, Math.round(sumLogic));
    const speedScore = Math.min(100, Math.round(sumSpeed));

    setIqScore(roundedIq);
    setCategoryScores({
      science: scienceScore,
      popculture: popcultureScore,
      history: historyScore,
      geography: geographyScore,
      logic: logicScore,
      speed: speedScore
    });

    setXp(prev => prev + 180);
    setCoins(prev => prev + 50);

    // Achievements unlocking logic
    if (roundedIq >= 130) unlockAchievement('high_iq');
    if (scienceScore === 100) unlockAchievement('science_max');
    if (historyScore === 100) unlockAchievement('history_max');
    if (geographyScore === 100) unlockAchievement('geography_max');
    if (logicScore === 100) unlockAchievement('logic_max');

    // Trigger Offline-first Brain Analysis
    fetchAIPersonality(roundedIq, {
      science: scienceScore,
      popculture: popcultureScore,
      history: historyScore,
      geography: geographyScore,
      logic: logicScore,
      speed: speedScore
    });

    setCurrentScreen('reveal');
  };

  // Call the proxy server-side Gemini intelligence API route (Now 100% offline-first logic)
  const fetchAIPersonality = async (calculatedIq: number, categories: typeof categoryScores) => {
    setLoadingAiAnalysis(true);
    setAiAnalysisResult(null);

    // Formulate active Rank
    const currentRank = RANK_TITLES.find(r => calculatedIq >= r.minScore && calculatedIq <= r.maxScore)?.title || "Based Logician";

    setTimeout(() => {
      // Find top scoring category
      let topCategory = "logic";
      let topScore = categories.logic;
      
      if (categories.science > topScore) { topCategory = "science"; topScore = categories.science; }
      if (categories.popculture > topScore) { topCategory = "popculture"; topScore = categories.popculture; }
      if (categories.history > topScore) { topCategory = "history"; topScore = categories.history; }
      if (categories.geography > topScore) { topCategory = "geography"; topScore = categories.geography; }
      if (categories.speed > topScore) { topCategory = "speed"; topScore = categories.speed; }

      const categoryDescriptions: Record<string, string> = {
        science: "Your neurological matrix runs deep with academic facts. You formulate answers on physical mechanics and cosmic laws flawlessly.",
        popculture: "Your social and cultural telemetry registers at absolute peak levels. Media, trends, and history of memes map onto your synaptic patterns with ease.",
        history: "You possess historic archival retention. Timelines, historic regimes, and epochal landmarks are deeply ingrained in your mind vault.",
        geography: "You have a flawless, map-like spatial orientation. Your geographical coordinates are computed inside your head with absolute precision.",
        logic: "Your deductive processor is highly isolated from emotional noise. You compute variables with high focus index and spot traps instantly.",
        speed: "Your rapid motor-sensory reflex quotient is unmatched. You bypass speed traps with sub-second calculations."
      };

      const customAnalysis = `Diagnostic complete. Your brain operates at a majestic ${calculatedIq} IQ level inside the MINDVAULT matrix, matching the profile of a [${currentRank}]. ${categoryDescriptions[topCategory] || "You display high cognitive versatility across all general knowledge sectors."}`;
      const quirkyStat = `Your general knowledge retention tracks at 98.4% compared to standard gamers.`;
      
      const quotes = [
        "Real discovery lies not in seeking new lands, but in seeing with new eyes.",
        "The measure of intelligence is the ability to change.",
        "Information is not knowledge. The only source of knowledge is experience.",
        "Your mind is a vault of ancient light. Open it carefully."
      ];
      const selectedQuote = quotes[calculatedIq % quotes.length];

      setAiAnalysisResult({
        analysis: customAnalysis,
        quirkyStat: quirkyStat,
        quote: selectedQuote
      });
      setLoadingAiAnalysis(false);
    }, 1200);
  };

  // Add achievement function
  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id)) {
      setUnlockedAchievements(prev => [...prev, id]);
      // Trigger user bonus reward for keeping gameplay addictive
      setCoins(prev => prev + 25);
      playSimulatedAudio('achievement_unlocked');
    }
  };

  // Spin Wheel mini game
  const spinTheWheel = () => {
    if (wheelSpinning) return;
    if (coins < 20) {
      alert("Spend 20 Cosmic Coins to engage spin wheel!");
      return;
    }

    setCoins(prev => prev - 20);
    setWheelSpinning(true);
    setWheelResult(null);
    playSimulatedAudio('wheel_active');
    triggerSimulatedHaptic();

    const rewards = [
      "+15 Gems 💎",
      "+100 Coins 🪙",
      "Epic Avatar Frame 🌟",
      "+500 XP Surge ⚡",
      "Premium Mystery Key 🔑",
      "Aura Multiplier Active 🔥"
    ];

    setTimeout(() => {
      const won = rewards[Math.floor(Math.random() * rewards.length)];
      setWheelResult(won);
      setWheelSpinning(false);
      playSimulatedAudio('jackpot_win');
      
      // Update state based on reward won
      if (won.includes("Gems")) setGems(prev => prev + 15);
      if (won.includes("Coins")) setCoins(prev => prev + 100);
      if (won.includes("XP")) setXp(prev => prev + 500);
      if (won.includes("Avatar") || won.includes("Key")) {
        unlockAchievement('spin_wheel');
      }
    }, 2800);
  };

  // Purchase Shop items
  const buyShopItem = (item: 'gems' | 'time' | 'radar' | 'vip') => {
    playSimulatedAudio('buy_hint');
    if (item === 'vip') {
      setIsVip(true);
      setGems(prev => prev + 400);
      setCoins(prev => prev + 2000);
      unlockAchievement('vip_status');
    } else if (item === 'gems') {
      if (coins < 100) {
        alert("Need 100 Coins to convert to Gems!");
        return;
      }
      setCoins(prev => prev - 100);
      setGems(prev => prev + 15);
    } else if (item === 'time') {
      if (gems < 10) {
        alert("Requires 10 Gems!");
        return;
      }
      setGems(prev => prev - 10);
      alert("Purchased Quantum Time Extender item successfully!");
    } else if (item === 'radar') {
      if (gems < 20) {
        alert("Requires 20 Gems!");
        return;
      }
      setGems(prev => prev - 20);
      alert("Purchased Neural Hint Radar permanently!");
    }
  };

  // Viral result template share logic with modern Gen Z TikTok feel
  const shareToTikTokOrSocial = () => {
    playSimulatedAudio('portal_unlock');
    setShareSuccessMsg("Generated TikTok/Instagram Story blueprint successfully ! Copied score link to clipboard.");
    unlockAchievement('referral_badge');
    setTimeout(() => {
      setShareSuccessMsg(null);
    }, 4500);

    // Simple copy to clipboard simulator
    try {
      navigator.clipboard.writeText(`Crack the general knowledge high score in "MindVault"! I achieved IQ ${iqScore}. Challenge me developed by doju.it: ${window.location.href}`);
    } catch (e) {
      // ignore
    }
  };

  // Level Calculation helper
  const currentLevel = Math.floor(xp / 500) + 1;
  const currentRankInfo = RANK_TITLES.find(r => iqScore >= r.minScore && iqScore <= r.maxScore) || RANK_TITLES[5];

  return (
    <div id="mindvault-root" className={`relative min-h-screen w-full bg-[#050508] text-white font-sans overflow-x-hidden p-2 sm:p-5 md:p-8 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 ${screenShake ? 'animate-[shake_0.3s_ease-in-out_infinite]' : ''}`}>
      
      {/* Absolute Dynamic Space Gradients (Sleek Theme Blur Layers) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none"></div>

      {/* LEFT COLUMN: LIVE BATTLES & LATEST RESULT (Width ~80) */}
      <div className="w-full lg:w-80 flex flex-col gap-6 self-stretch justify-between">
        
        {/* LATEST RESULTS WIDGET */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl transition hover:border-purple-500/30">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Latest Diagnostic</h2>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">CORE PROFILE</span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-black tracking-tighter text-white font-display duration-300">
              {iqScore}
            </span>
            <span className="text-xl font-medium text-cyan-400 font-display">IQ</span>
          </div>
          
          <p className="text-lg font-bold text-white/90 leading-tight mb-4 flex items-center gap-1.5">
            <span>{currentRankInfo.badge}</span>
            <span className="neo-gradient-text tracking-wide">{currentRankInfo.title}</span>
          </p>

          {/* Quick Progress category indicators */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                <span>Science & Space</span><span>{categoryScores.science}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${categoryScores.science}%` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                <span>History & Timelines</span><span>{categoryScores.history}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-fuchsia-500 transition-all duration-700" style={{ width: `${categoryScores.history}%` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                <span>Geography & Maps</span><span>{categoryScores.geography}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-700" style={{ width: `${categoryScores.geography}%` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                <span>Deductive Logic</span><span>{categoryScores.logic}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${categoryScores.logic}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE GLOBAL BATTLES / FEED (REAL-TIME ADDICTIVE CURIOSITY LOOPS) */}
        <div className="flex-1 min-h-[250px] bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Live Matchmaking Feed</h2>
            </div>
            <span className="text-[9px] text-white/40 select-none">DUEL NETWORK ACTIVATED</span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 border-t border-white/5 pt-3">
            {battleLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                  {log.message.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{log.message}</p>
                  <p className="text-[10px] text-white/50 truncate font-mono">{log.sub}</p>
                </div>
                <div className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  log.type === 'success' ? 'text-green-400 bg-green-500/10' :
                  log.type === 'warn' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-500/10'
                }`}>
                  {log.tag}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => { playSimulatedAudio('portal_unlock'); startDailyChallenge(); }} 
            className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center active:scale-95 transition-all"
          >
            🔥 Battle Now
          </button>
        </div>
      </div>


      {/* CENTRAL COLUMN: THE MAIN SMARTPHONE SIMULATOR INTERFACE (Designed with exact specifications) */}
      <div className="w-[360px] sm:w-[380px] h-[720px] bg-[#000000] border-[8px] border-[#1b1b22] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col z-10 transition hover:border-[#2e2e38]">
        
        {/* Dynamic iPhone Notch & Status Bar */}
        <div className="h-10 w-full flex items-center justify-between px-8 text-[11px] font-bold text-white/80 select-none pt-2 shrink-0">
          <span className="font-mono">9:41</span>
          <div className="w-24 h-4 bg-black/80 rounded-full border border-white/10 flex items-center justify-center relative">
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-wider scale-95">CORE_SCANNER</span>
          </div>
          <div className="flex gap-1.5 items-center font-mono">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-white/35 rounded-sm px-0.5 py-0.5 flex items-center justify-start">
              <div className="w-2.5 h-full bg-cyan-400 rounded-[1px] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Sub-Header Widget inside Simulator */}
        <div className="flex justify-between items-center px-6 py-1 select-none shrink-0 z-10 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 hover:border-purple-500/30 cursor-pointer">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
            <span className="text-[9px] font-bold tracking-tight text-purple-300">STREAK: {streak} DAYS</span>
          </div>
          
          <div className="flex gap-2 items-center text-[10px] font-black">
            <span className="text-cyan-400 flex items-center gap-1 bg-cyan-400/15 px-2 py-0.5 rounded-full" title="Virtual Gems">
              💎 {gems}
            </span>
            <span className="text-amber-400 flex items-center gap-1 bg-amber-400/15 px-2 py-0.5 rounded-full" title="Cosmic Coins">
              🪙 {coins}
            </span>
            <div 
              onClick={() => setCurrentScreen('profile')}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[11px] border border-white/20 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              {selectedAvatar}
            </div>
          </div>
        </div>


        {/* MIDDLE SCREENS SWITCH CONTAINER */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 flex flex-col relative z-20">

          {/* 1. ONBOARDING WELCOME SCREEN */}
          {currentScreen === 'onboarding' && (
            <div className="flex-1 flex flex-col justify-between pt-2">
              <div className="text-center pt-3">
                <div className="inline-block p-2 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-3 animate-bounce">
                  <Brain className="w-10 h-10 text-purple-400 mx-auto" />
                </div>
                <h1 className="text-4xl font-black mb-1 leading-none tracking-tight font-display">
                  MIND<br/><span className="neo-gradient-text tracking-wide">VAULT</span>
                </h1>
                <p className="text-[10px] font-mono uppercase text-cyan-400/80 tracking-[2px] mt-1">GK Trivia & Intelligence Scan</p>
                <p className="text-[9px] font-mono text-purple-400/80 font-semibold tracking-wider mt-1">developed by doju.it</p>
                <div className="h-[2px] w-20 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-3"></div>
              </div>

              {/* Swiper Content area simulated */}
              <div className="my-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-xs uppercase text-purple-400 tracking-wider font-bold mb-1">COGNITIVE ARCHIVE</p>
                <p className="text-xs font-medium leading-relaxed text-white/90">
                  "Prove your intelligence across general knowledge, science, space, history, and speed. Your decisions profile your deep cognitive capacity."
                </p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <span className="w-4 h-1 rounded bg-purple-500"></span>
                  <span className="w-1.5 h-1 rounded bg-white/30"></span>
                  <span className="w-1.5 h-1 rounded bg-white/30"></span>
                </div>
              </div>

              {/* Onboarding triggers */}
              <div className="space-y-3">
                <button 
                  onClick={skipOrContinueOnboarding}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-purple-600 text-black text-xs font-black rounded-2xl uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-95 duration-200 transition text-white"
                >
                  Unseal My Mind Vault
                </button>
                <div className="text-center">
                  <span className="text-[8px] tracking-[2px] font-mono text-white/30 uppercase">Offline Arcade v2.5.0</span>
                </div>
              </div>
            </div>
          )}


          {/* 2. AUTHENTICATION & PROFILE CREATION SCREEN */}
          {currentScreen === 'auth' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-black font-display tracking-tight text-center mt-2">CREATE IDENTITY</h2>
                <p className="text-center text-xs text-white/40 mb-5">Select a digital mask for leaderboard representation</p>

                {/* Nickname input selection */}
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] font-mono text-purple-400 uppercase tracking-widest pl-1">Gamer Handle</label>
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.slice(0, 18))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold font-mono focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter Matrix Handle..."
                  />
                </div>

                {/* Avatar selectors */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest pl-1">Quantum Avatar</span>
                  <div className="grid grid-cols-4 gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                    {['👾', '👽', '🦄', '🤖', '🦁', '🦊', '🧙', '💀'].map((av) => (
                      <button
                        key={av}
                        onClick={() => { playSimulatedAudio('btn_click'); setSelectedAvatar(av); }}
                        className={`aspect-square text-2xl rounded-xl flex items-center justify-center transition-all ${
                          selectedAvatar === av ? 'bg-purple-500/25 border-2 border-purple-500 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/5 border border-white/10 opacity-70 hover:opacity-100 hover:bg-white/10'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Login option paths */}
              <div className="space-y-2">
                <button 
                  onClick={() => handleAuth('guest')}
                  className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-white-pure active:scale-95 duration-100 transition shadow-lg"
                >
                  ⚡ Access Guest Protocol
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleAuth('google')} 
                    className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <span>Google Secure</span>
                  </button>
                  <button 
                    onClick={() => handleAuth('apple')} 
                    className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <span>Apple Mask</span>
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* 3. HOME SCREEN DASHBOARD (Center of app engagement loop) */}
          {currentScreen === 'home' && (
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Level progression bar */}
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                  <span className="text-cyan-400 font-black font-mono text-sm leading-none">{currentLevel}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold tracking-tight text-white/55 mb-1">
                    <span>LEVEL {currentLevel} PROGRESS</span>
                    <span>{xp % 500} / 500 XP</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 w-[70%]" style={{ width: `${(xp % 500) / 5}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Giant pulsing core Scan button */}
              <div className="my-2 flex-1 flex flex-col items-center justify-center relative">
                
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-purple-600 via-cyan-500 to-pink-500 flex items-center justify-center p-[2px] animate-pulse group">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl scale-95 duration-300"></div>
                  
                  <div className="w-full h-full bg-black hover:bg-zinc-950 rounded-full flex flex-col items-center justify-center text-center p-3 transition-colors duration-200 z-10 cursor-pointer">
                    <p className="text-[8px] uppercase tracking-[4px] text-cyan-400 mb-1 font-mono">NEURAL STATUS: READY</p>
                    <p className="text-xl font-black mb-1 tracking-tight">START CORE<br/>SCAN</p>
                    <span className="text-[9px] text-white/50 text-center max-w-[125px]">Analyze Logic & IQ Traits</span>
                    
                    <button 
                      onClick={startFullTest}
                      className="mt-4 px-5 py-2 bg-gradient-to-r from-purple-500 to-cyan-400 text-black text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 text-white hover:scale-105 active:scale-95 transition"
                    >
                      <Play className="w-3 h-3 fill-white" /> Uncover
                    </button>
                  </div>
                </div>

                {/* Daily Rewards, Spin wheel launcher */}
                <div className="mt-6 grid grid-cols-2 gap-3 w-full shrink-0">
                  <div 
                    onClick={() => { playSimulatedAudio('btn_click'); startDailyChallenge(); }} 
                    className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 text-center cursor-pointer select-none transition group"
                  >
                    <p className="text-[8px] uppercase text-purple-400 tracking-wider font-mono">Daily Lock</p>
                    <p className="text-[11px] font-bold flex items-center justify-center gap-1 group-hover:text-purple-400 transition-colors">
                      <span>⚡</span> <span>+100 Gems</span>
                    </p>
                  </div>

                  <div 
                    onClick={() => { playSimulatedAudio('btn_click'); setSpinWheelOpen(true); }}
                    className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 text-center cursor-pointer select-none transition group"
                  >
                    <p className="text-[8px] uppercase text-cyan-400 tracking-wider font-mono">Neon Wheel</p>
                    <p className="text-[11px] font-bold flex items-center justify-center gap-1 group-hover:text-cyan-400 transition-colors">
                      <span>🎯</span> <span>Spin Reward</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Botton App Navigator triggers */}
              <div className="grid grid-cols-4 gap-1.5 border-t border-white/5 pt-4 mt-2">
                <button onClick={() => setCurrentScreen('home')} className="flex flex-col items-center gap-1 text-purple-400 select-none">
                  <Home className="w-5 h-5 text-purple-400" />
                  <span className="text-[8px] uppercase tracking-wide font-black">Home</span>
                </button>
                <button onClick={() => setCurrentScreen('leaderboard')} className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition select-none">
                  <Trophy className="w-5 h-5" />
                  <span className="text-[8px] uppercase tracking-wide font-bold">Leaderboard</span>
                </button>
                <button onClick={() => setCurrentScreen('shop')} className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition select-none">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-[8px] uppercase tracking-wide font-bold">Shop</span>
                </button>
                <button onClick={() => setCurrentScreen('settings')} className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition select-none font-mono">
                  <Settings className="w-5 h-5" />
                  <span className="text-[8px] uppercase tracking-wide font-bold">Settings</span>
                </button>
              </div>
            </div>
          )}


          {/* 4. ACTIVE INTERACTIVE QUIZ TEST LOOP */}
          {currentScreen === 'quiz' && quizQuestions[currentQuestionIndex] && (
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Question status bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 select-none text-[11px]">
                <div className="flex items-center gap-1 text-white/60 font-mono">
                  <span>Q {currentQuestionIndex + 1}/{quizQuestions.length}</span>
                </div>
                
                {/* Timer feedback */}
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <Timer className={`w-4 h-4 ${secondsLeft < 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} />
                  <span className={secondsLeft < 5 ? 'text-red-500' : 'text-cyan-400'}>{secondsLeft}s</span>
                </div>
              </div>

              {/* Question Prompt */}
              <div className="my-4 flex-1 flex flex-col justify-center">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 relative overflow-hidden">
                  <span className="text-[9px] font-mono uppercase bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded absolute top-3 right-3 select-none">
                    {quizQuestions[currentQuestionIndex].category}
                  </span>
                  
                  {/* Category description labels info */}
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono text-center block mb-2">Diagnostic Input Prompt</span>
                  <h3 className="text-sm sm:text-base font-bold leading-relaxed text-center">
                    {quizQuestions[currentQuestionIndex].text}
                  </h3>
                </div>

                {/* Hint option module */}
                <div className="mt-2 text-center select-none">
                  {hintVisible ? (
                    <p className="text-[11px] text-purple-300 italic p-2 bg-purple-500/10 rounded-lg border border-purple-500/15">
                      💡 {quizQuestions[currentQuestionIndex].hint || "Process logic variables without conformist assumptions!"}
                    </p>
                  ) : (
                    <button 
                      onClick={unlockHint} 
                      className="text-[10px] text-white/40 hover:text-amber-400 font-mono flex items-center gap-1 mx-auto py-1"
                    >
                      💡 Unlock Hint (Requires 10 Cosmic Coins)
                    </button>
                  )}
                </div>
              </div>

              {/* Multiple Choice interactive answers list */}
              <div className="space-y-2 mb-4 shrink-0">
                {quizQuestions[currentQuestionIndex].options.map((opt) => {
                  const isSelected = answersSelected[quizQuestions[currentQuestionIndex].id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectChoice(opt.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition duration-200 block ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-bold text-white' 
                          : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="max-w-[85%]">{opt.text}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Next Question Navigation */}
              <div>
                <button
                  disabled={!answersSelected[quizQuestions[currentQuestionIndex].id]}
                  onClick={() => handleNextQuestion()}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition select-none ${
                    answersSelected[quizQuestions[currentQuestionIndex].id]
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white cursor-pointer active:scale-95'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>{currentQuestionIndex === quizQuestions.length - 1 ? "Evaluate Matrix Profile" : "Next Protocol"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}


          {/* 5. PSYCHOLOGICAL COGNITIVE ANALYSIS REVEAL SCRN */}
          {currentScreen === 'reveal' && (
            <div className="flex-1 flex flex-col justify-between">
              
              <div className="text-center pt-1 scroll-smooth">
                <span className="text-[10px] bg-cyan-400/25 text-cyan-400 px-3 py-1 rounded-full font-mono uppercase tracking-[3px] select-none">
                  Core Scan Unlocked
                </span>

                {/* Score badge indicator */}
                <div className="my-4 relative inline-block">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-purple-500 flex flex-col items-center justify-center bg-black/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Calculated IQ</span>
                    <span className="text-4xl font-black text-white font-display leading-none">{iqScore}</span>
                    <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold mt-1">PERCENTILE 96%</span>
                  </div>
                </div>

                <div className="mb-3 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-2xl">
                  <p className="text-[10px] uppercase text-purple-400 tracking-widest font-mono">Assigned Rank title</p>
                  <p className="text-base font-bold font-display text-white mt-0.5">
                    {currentRankInfo.badge} {currentRankInfo.title}
                  </p>
                </div>

                {/* AI generated personality details */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left min-h-[140px] max-h-[220px] overflow-y-auto relative">
                  <div className="flex items-center gap-1.5 mb-2 border-b border-white/5 pb-1 text-cyan-300 font-mono text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI PSYCH PROFILE ANALYSIS</span>
                  </div>

                  {loadingAiAnalysis ? (
                    <div className="space-y-2 py-4 text-center">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Generating Neuro-matrix Profile...</p>
                    </div>
                  ) : aiAnalysisResult ? (
                    <div className="space-y-3">
                      <p className="text-xs text-white/80 leading-relaxed font-sans">{aiAnalysisResult.analysis}</p>
                      
                      <div className="bg-white/10 p-2.5 rounded-lg border border-white/5 space-y-1">
                        <span className="text-[9px] text-cyan-400 uppercase font-bold font-mono">SHAREABLE STAT</span>
                        <p className="text-xs font-bold text-white">{aiAnalysisResult.quirkyStat}</p>
                      </div>

                      <p className="text-[11px] italic font-mono text-purple-300 mt-2">
                        " {aiAnalysisResult.quote} "
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">Profile data generated successfully. Hit request scan to load interactive assessments.</p>
                  )}
                </div>
              </div>

              {/* Social share actions */}
              <div className="mt-4 pt-2 border-t border-white/5 space-y-2">
                {shareSuccessMsg && (
                  <p className="text-[9px] font-bold text-green-400 text-center uppercase tracking-wide bg-green-500/10 py-1.5 rounded">
                    {shareSuccessMsg}
                  </p>
                )}
                
                <button 
                  onClick={shareToTikTokOrSocial}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Share2 className="w-4 h-4" /> Share to TikTok / Instagram
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { playSimulatedAudio('btn_click'); setCurrentScreen('home'); }}
                    className="py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase rounded-xl"
                  >
                    Home Hub
                  </button>
                  <button 
                    onClick={startFullTest}
                    className="py-2.5 bg-purple-500/25 border border-purple-500/40 hover:bg-purple-500/35 text-[10px] font-bold uppercase text-purple-300 rounded-xl"
                  >
                    Repeat Scan
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* 6. GLOBAL LEADERBOARDS & COUNTRY FILTER */}
          {currentScreen === 'leaderboard' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <button onClick={() => setCurrentScreen('home')} className="text-white/60 hover:text-white p-1">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-lg font-black font-display uppercase">Leaderboard</h2>
                </div>

                {/* Country Filter Ledger Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 border border-white/10 rounded-xl text-center select-none text-[10px] font-bold uppercase tracking-wider mb-4">
                  <span className="p-1.5 bg-purple-500 text-white rounded-lg cursor-pointer">Global</span>
                  <span className="p-1.5 text-white/60 hover:text-white cursor-pointer">Regional</span>
                  <span className="p-1.5 text-white/60 hover:text-white cursor-pointer">Friends</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  
                  {/* Dynamic User Record inserted inside standard ranking list */}
                  <div className="flex items-center gap-3 p-2.5 bg-purple-500/20 border border-purple-500 rounded-xl shadow-[0_0_12px_rgba(168,85,247,0.35)] relative">
                    <span className="text-xs font-black text-purple-300 w-5 text-center">#4</span>
                    <span className="text-xl select-none">{selectedAvatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white truncate">{username} (You)</p>
                      <p className="text-[10px] text-purple-300 uppercase tracking-widest font-mono">Streak: {streak} days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">{iqScore} IQ</p>
                      <p className="text-[9px] text-purple-400 font-bold uppercase">Lvl {currentLevel}</p>
                    </div>
                  </div>

                  {/* Other standard players from match lists */}
                  {SAMPLE_LEADERBOARD.map((user) => (
                    <div key={user.rank} className="flex items-center gap-3 p-2.5 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition">
                      <span className={`text-xs font-black w-5 text-center ${user.rank === 1 ? 'text-amber-400' : 'text-white/40'}`}>
                        #{user.rank >= 4 ? user.rank + 1 : user.rank}
                      </span>
                      <span className="text-xl select-none">{user.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <span>{user.country}</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-mono">Streak: {user.streak} days</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-white/80">{user.iq} IQ</p>
                        <p className="text-[9px] text-white/30 font-bold">Badge {user.badge}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { playSimulatedAudio('portal_unlock'); startFullTest(); }}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-widest rounded-xl transition"
              >
                ⚔️ Rank Up My Profile
              </button>
            </div>
          )}


          {/* 7. REWARD STORE / ITEM SHOP PANEL */}
          {currentScreen === 'shop' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-1 select-none">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentScreen('home')} className="text-white/60 hover:text-white p-1">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h2 className="text-lg font-black font-display uppercase">Item Shop</h2>
                  </div>
                  <span className="text-[9px] text-white/50 tracking-wider">SECURE TRANSACTION</span>
                </div>

                <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                  
                  {/* VIP Premium Upgrade Card (Duolingo visual status style) */}
                  <div className="bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 rounded-2xl p-4 border border-white/10 relative overflow-hidden shadow-xl">
                    <div className="absolute top-1 right-2 select-none text-2xl opacity-15">👑</div>
                    <h3 className="text-base font-black uppercase tracking-wide text-white">Unlock Premium VIP</h3>
                    <p className="text-[10px] text-white/80 leading-relaxed mb-3">
                      Ad-free evaluation, +500 immediate Gems, exclusive Aura status badge, and precise AI scans forever.
                    </p>
                    
                    {isVip ? (
                      <span className="w-full block py-2 bg-green-500/40 text-green-300 border border-green-500 text-[9px] font-black uppercase tracking-widest rounded-lg text-center select-none">
                        VIP Active / Transcended
                      </span>
                    ) : (
                      <button 
                        onClick={() => buyShopItem('vip')} 
                        className="w-full py-2 bg-black text-white hover:bg-[#1a1a2e] text-[9px] font-black uppercase tracking-widest rounded-lg transition active:scale-95"
                      >
                        Buy VIP Pass
                      </button>
                    )}
                  </div>

                  {/* Virtual tokens swap options */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <h4 className="text-[10px] text-white/50 uppercase tracking-widest font-mono mb-2">Matrix Tokens swap</h4>
                    
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-white">
                        <span>🪙 100 Coins</span>
                        <span>➡️</span>
                        <span className="font-bold text-cyan-400">💎 15 Gems</span>
                      </div>
                      <button 
                        onClick={() => buyShopItem('gems')}
                        className="px-3.5 py-1 bg-white text-black text-[10px] font-black uppercase rounded-lg active:scale-95"
                      >
                        Convert
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Items list */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-3">
                    <h4 className="text-[10px] text-white/50 uppercase tracking-widest font-mono">In-Game Perks Boost</h4>
                    
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                      <div className="flex-1">
                        <p className="text-xs font-bold">Quantum Time Extender</p>
                        <p className="text-[9px] text-white/40">+3 seconds on speed riddles</p>
                      </div>
                      <button 
                        onClick={() => buyShopItem('time')}
                        className="px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase rounded-lg active:scale-95"
                      >
                        💎 10
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                      <div className="flex-1">
                        <p className="text-xs font-bold">Neural Hint Radar</p>
                        <p className="text-[9px] text-white/40">Reduce coin cost of hints to 0</p>
                      </div>
                      <button 
                        onClick={() => buyShopItem('radar')}
                        className="px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase rounded-lg active:scale-95"
                      >
                        💎 20
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-2 select-none text-[8px] text-white/45 space-y-0.5 font-mono">
                <p className="font-bold text-cyan-400">developed by doju.it</p>
                <p>MindVault GK Trivia Arcade. Simulated microtransactions only.</p>
              </div>
            </div>
          )}


          {/* 8. DETAILED SYSTEM SETTINGS & COMPLIANCE */}
          {currentScreen === 'settings' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setCurrentScreen('home')} className="text-white/60 hover:text-white p-1">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-lg font-black font-display uppercase">Settings</h2>
                </div>

                <div className="space-y-4">
                  
                  {/* Visual feedback toggle switches */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Sensory feedback</h3>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">Synthesizer Sound FX</span>
                      <button 
                        onClick={() => setSoundsEnabled(!soundsEnabled)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${soundsEnabled ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-500'}`}
                      >
                        {soundsEnabled ? "ON" : "OFF"}
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">Simulated Jitter Haptic</span>
                      <button 
                        onClick={() => setHapticEnabled(!hapticEnabled)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${hapticEnabled ? 'bg-cyan-500 text-black' : 'bg-neutral-800 text-neutral-500'}`}
                      >
                        {hapticEnabled ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>

                  {/* Legal store links to comply with item 13 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5 select-none">
                    <h3 className="text-[10px] text-purple-400 uppercase tracking-widest font-mono">App Store Compliance</h3>
                    
                    <button 
                      onClick={() => setCurrentScreen('privacy')}
                      className="w-full text-left text-xs text-white/80 hover:text-white flex items-center justify-between pb-2 border-b border-white/5"
                    >
                      <span>Privacy Policy Policy</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => setCurrentScreen('terms')}
                      className="w-full text-left text-xs text-white/80 hover:text-white flex items-center justify-between"
                    >
                      <span>Terms of Service agreement</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reset statistics toggle */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setXp(120);
                        setCoins(80);
                        setGems(15);
                        setStreak(1);
                        setUnlockedAchievements(['first_test']);
                        setIqScore(100);
                        alert("Database refreshed. Matrix restarted successfully!");
                        setCurrentScreen('onboarding');
                      }}
                      className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-xs uppercase font-bold tracking-widest transition"
                    >
                      ☢️ Restart Game Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center select-none text-[8px] text-white/40 pt-4 space-y-0.5 font-mono">
                <p className="font-bold text-purple-400">developed by doju.it</p>
                <p>MindVault Version 2.5.0 (Fully Offline GK Trivia Arcade)</p>
              </div>
            </div>
          )}


          {/* 9. STORE COMPLIANT: PRIVACY POLICY PAGE */}
          {currentScreen === 'privacy' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setCurrentScreen('settings')} className="text-white/60 hover:text-white p-1">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-base font-black font-display uppercase">Privacy Policy policy</h2>
                </div>

                <div className="bg-white/5 p-3.5 border border-white/10 rounded-xl max-h-[460px] overflow-y-auto text-[11px] leading-relaxed text-white/70 space-y-3 text-justify">
                  <p className="font-bold text-white uppercase text-center text-[10px] tracking-wider mb-2">Effective: May 23, 2026</p>
                  
                  <p>
                    MINDVAULT ("the App", "we", "our") takes privacy very seriously. We operate a completely decentralized, offline-first client model. Your game inputs, trivia responses, speed times, and estimated IQ coordinates remain isolated inside your personal browser storage container.
                  </p>
                  
                  <p className="font-bold text-white uppercase text-[9px] tracking-widest mb-1">1. DATA CLASSIFICATION</p>
                  <p>
                    The App processes selected option values and total times to calculate logical quotient rankings. These indicators never exit your system and are calculated 100% offline securely on your client browser.
                  </p>

                  <p className="font-bold text-white uppercase text-[9px] tracking-widest mb-1">2. OFFLINE ENGINE</p>
                  <p>
                    Our cognitive scan runs locally at peak accuracy. None of your real names or personal files are attached or read.
                  </p>

                  <p className="font-bold text-white uppercase text-[9px] tracking-widest mb-1">3. EXPORT / DELETION ACTION</p>
                  <p>
                    To clean your complete data trail, simply tap 'Restart Game Profile' in the Settings utility, which completely flushes the client's local records storage.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('settings')}
                className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase rounded-lg tracking-wider transition mt-4"
              >
                Acknowledge Protocol
              </button>
            </div>
          )}


          {/* 10. STORE COMPLIANT: TERMS OF SERVICE PAGE */}
          {currentScreen === 'terms' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setCurrentScreen('settings')} className="text-white/60 hover:text-white p-1">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-base font-black font-display uppercase">Terms of service</h2>
                </div>

                <div className="bg-white/5 p-3.5 border border-white/10 rounded-xl max-h-[460px] overflow-y-auto text-[11px] leading-relaxed text-white/70 space-y-3 text-justify">
                  <p className="font-bold text-white uppercase text-center text-[10px] tracking-wider mb-2">Effective: May 23, 2026</p>
                  
                  <p>
                    Welcome to MINDVAULT. By entering Guest or Authenticated Mode, you agree to comply with our modern gaming parameters.
                  </p>
                  
                  <p className="font-bold text-white uppercase text-[9px] tracking-widest mb-1">1. END USER ACCESS LICENSE</p>
                  <p>
                    We grant users a non-transferable virtual gaming membership index. Any try to decompile our analytical trick logic schemas represents a breach of intellectual boundaries.
                  </p>

                  <p className="font-bold text-white uppercase text-[9px] tracking-widest mb-1">2. COGNITIVE DISCLAIMER</p>
                  <p>
                    "MindVault" represents a general knowledge and logical trivia engine tailored strictly for entertainment and competitive status simulation. The final calculated IQ score does not correspond to standard clinical Wechsler scales.
                  </p>

                  <p className="font-bold text-white uppercase text-[9px] tracking-widest mb-1">3. INTELLECTUAL CURRENCY</p>
                  <p>
                    Virtually accrued Cosmic Coins and Matrix Gems represent in-game performance statistics, which hold zero legal tender equivalents. We do not support cash refunds for virtual keys.
                  </p>

                  <p className="font-bold text-white uppercase text-[9px] tracking-widest mb-1">4. COMMUNITY MODERATION</p>
                  <p>
                    Gamer handles containing racist, profane, or automated expressions will lead to instant server blocklisting on region leaderboards.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('settings')}
                className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase rounded-lg tracking-wider transition mt-4"
              >
                Accept Axioms
              </button>
            </div>
          )}


          {/* 11. PROFILE DETAILS PAGE */}
          {currentScreen === 'profile' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-1">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentScreen('home')} className="text-white/60 hover:text-white p-1">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h2 className="text-lg font-black font-display uppercase">My Profile</h2>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-400/20 px-2 py-0.5 rounded">STATUS: IMMERSIVE</span>
                </div>

                {/* Main profile banner */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center relative overflow-hidden mb-4">
                  <div className="relative inline-block mb-2">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
                    <span className="text-5xl select-none relative z-10 block animate-bounce">{selectedAvatar}</span>
                  </div>

                  <h3 className="text-sm font-black text-white">{username}</h3>
                  <p className="text-[10px] text-white/50 tracking-wider uppercase font-mono mt-0.5">CURRENT LEVEL {currentLevel}</p>

                  <div className="grid grid-cols-3 gap-2 mt-4 select-none">
                    <div className="bg-white/5 p-2 rounded-xl text-center">
                      <span className="text-[14px] block font-black text-cyan-400">{iqScore}</span>
                      <span className="text-[8px] uppercase text-white/40 block">Peak IQ</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl text-center">
                      <span className="text-[14px] block font-black text-purple-400">{streak}d</span>
                      <span className="text-[8px] uppercase text-white/40 block">Max Streak</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl text-center">
                      <span className="text-[14px] block font-black text-amber-400">{unlockedAchievements.length}</span>
                      <span className="text-[8px] uppercase text-white/40 block">Badges</span>
                    </div>
                  </div>
                </div>

                {/* Achievements block inside Profile */}
                <div className="bg-white/5 p-3.5 border border-white/10 rounded-2xl">
                  <span className="text-[9px] text-purple-400 font-mono uppercase tracking-widest pl-1">Collected Badges ({unlockedAchievements.length}/30)</span>
                  
                  <div className="grid grid-cols-4 gap-2.5 mt-2 max-h-[160px] overflow-y-auto pr-1">
                    {ACHIEVEMENT_BADGES.map((badge) => {
                      const isUnlocked = unlockedAchievements.includes(badge.id);
                      return (
                        <div 
                          key={badge.id} 
                          title={`${badge.name}: ${badge.description}`}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 border transition-all ${
                            isUnlocked 
                              ? `bg-gradient-to-br ${badge.color} border-white/10 scale-100` 
                              : 'bg-white/5 border-white/5 opacity-30 select-none'
                          }`}
                        >
                          <span className="text-lg">{isUnlocked ? "🏅" : "🔒"}</span>
                          <span className="text-[7px] font-bold uppercase tracking-tight text-center text-white mt-1 leading-none truncate max-w-full">
                            {badge.name.split(" ")[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition mt-4"
              >
                Return to Dashboard
              </button>
            </div>
          )}

        </div>


        {/* SYSTEM NOTCH BOTTOM CONTROL */}
        <div className="h-6 w-full flex items-center justify-center relative select-none shrink-0 pointer-events-none pb-1.5 bg-black">
          <div className="w-24 h-1 bg-white/30 rounded-full"></div>
        </div>

      </div>


      {/* RIGHT COLUMN: PERMANENT COLLECTIBLE ACHIEVEMENTS & SPECIAL CONSOLE */}
      <div className="w-full lg:w-80 flex flex-col justify-between self-stretch gap-6">
        
        {/* ACHIEVEMENT STATS SHEETS */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between transition hover:border-cyan-500/30">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Achievements Track</h2>
              <span className="text-[9px] text-white/40 font-mono font-bold select-none">30 PROTOCOLS</span>
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-[290px] overflow-y-auto pr-1">
              {ACHIEVEMENT_BADGES.slice(0, 15).map((badge) => {
                const isUnlocked = unlockedAchievements.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all hover:scale-105 select-none ${
                      isUnlocked 
                        ? 'bg-white/10 border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.2)]' 
                        : 'bg-white/[0.02] border-white/5 opacity-45'
                    }`}
                  >
                    <div className="text-xl mb-1">{isUnlocked ? "🏆" : "🔒"}</div>
                    <span className="text-[8px] font-bold text-center uppercase tracking-tight leading-none text-white truncate max-w-full">
                      {badge.name}
                    </span>
                    <span className="text-[7px] text-white/50 text-center font-mono mt-0.5 leading-none">
                      {badge.rarity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono select-none">
            <span className="text-white/45">COMPLETED PROTOCOLS:</span>
            <span className="text-cyan-400 font-bold">{unlockedAchievements.length} / 30</span>
          </div>
        </div>

        {/* GO PREMIUM RETENTION CARD */}
        <div className="bg-gradient-to-br from-purple-800 to-indigo-950 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center border border-white/10 group min-h-[170px]">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full text-[9px] font-mono leading-none font-bold">VIP BONUS</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Upgrade To VIP</h3>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Get 400 extra virtual Gems instantly & enable ad-free intelligence scan limits.
            </p>

            {isVip ? (
              <span className="w-full block py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl text-center select-none shadow-lg">
                👑 VIP Level Active
              </span>
            ) : (
              <button 
                onClick={() => buyShopItem('vip')} 
                className="w-full py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-100 transition active:scale-95 duration-100"
              >
                Go Premium Now
              </button>
            )}
          </div>
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
        </div>

      </div>


      {/* DAILY NEON REWARD SPIN WHEEL FLOATING MODAL SHEET (Interactive gaming logic) */}
      {spinWheelOpen && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="bg-[#0b0b14] border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.25)] w-full max-w-sm rounded-[32px] p-6 relative overflow-hidden">
            
            <button 
              onClick={() => { playSimulatedAudio('btn_click'); setSpinWheelOpen(false); }}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-50 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest bg-cyan-400/20 text-cyan-300 px-2.5 py-1 rounded">Daily Neon Wheel</span>
              <h3 className="text-xl font-black uppercase tracking-tight mt-2">Test Your Fortune</h3>
              <p className="text-xs text-white/50">Spend 20 Cosmic Coins to engage interactive wheel spinner</p>
            </div>

            {/* Simulated spinning wheel geometry */}
            <div className="my-6 relative flex items-center justify-center">
              <div 
                className={`w-44 h-44 rounded-full border-4 border-purple-500 relative flex items-center justify-center bg-zinc-950 transition-transform duration-[2800ms] ease-out ${
                  wheelSpinning ? 'rotate-[1440deg] scale-95' : 'rotate-0'
                }`}
              >
                {/* Sector divider visual tags */}
                <div className="absolute w-[2px] h-full bg-purple-500/45"></div>
                <div className="absolute h-[2px] w-full bg-purple-500/45"></div>
                <div className="absolute w-12 h-12 bg-[#050508] border border-cyan-400 rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                  🎯
                </div>
              </div>
              
              {/* Wheel center cursor peg */}
              <div className="absolute -top-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-cyan-400"></div>
            </div>

            {/* Spin action state button */}
            <div className="space-y-4 text-center">
              {wheelResult && (
                <div className="bg-cyan-500/20 text-cyan-300 p-2.5 rounded-xl border border-cyan-500/30 animate-bounce">
                  <span className="text-[9px] uppercase font-bold tracking-widest font-mono block">CONGRATULATIONS REWARD!</span>
                  <p className="text-sm font-black">{wheelResult}</p>
                </div>
              )}

              <button
                disabled={wheelSpinning}
                onClick={spinTheWheel}
                className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg ${
                  wheelSpinning 
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white cursor-pointer active:scale-95'
                }`}
              >
                {wheelSpinning ? 'Spinning Cognitive Gears...' : '⚡ Spin Wheel for 20 Coins'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
