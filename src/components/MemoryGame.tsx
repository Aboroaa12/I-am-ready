import React, { useState, useEffect } from 'react';
import { Clock, Trophy, RotateCcw, Play, Pause, Settings, Shuffle, Volume2, Award, Star, Zap, CheckCircle, XCircle, AlertTriangle, HelpCircle, Lightbulb } from 'lucide-react';
import { VocabularyWord } from '../types';
import { speechEngine } from '../utils/speechEngine';

interface MemoryGameProps {
  words: VocabularyWord[];
  onScore: (points: number) => void;
}

interface GameCard {
  id: number;
  text: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'english' | 'arabic';
  pronunciation?: string;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ words, onScore }) => {
  const [settings, setSettings] = useState<{
    wordCount: number;
    showHints: boolean;
    playAudioOnStart: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
    shuffleWords: boolean;
    showProgress: boolean;
    allowSkip: boolean;
    theme: 'standard' | 'colorful' | 'minimal';
    cardSize: 'small' | 'medium' | 'large';
    matchType: 'english-arabic' | 'english-english' | 'arabic-arabic';
  }>({
    wordCount: 10,
    showHints: true,
    playAudioOnStart: true,
    difficulty: 'medium',
    timeLimit: 120,
    shuffleWords: true,
    showProgress: true,
    allowSkip: false,
    theme: 'colorful',
    cardSize: 'medium',
    matchType: 'english-arabic'
  });

  const [exerciseWords, setExerciseWords] = useState<VocabularyWord[]>([]);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showCombo, setShowCombo] = useState(false);
  const [difficultyFactor, setDifficultyFactor] = useState(1);
  const [forceUpdate, setForceUpdate] = useState(0);

  const difficultySettings = {
    easy: { pairs: 6, time: 180, factor: 0.8 },
    medium: { pairs: 8, time: 120, factor: 1 },
    hard: { pairs: 12, time: 90, factor: 1.5 }
  };

  const totalPairs = difficultySettings[settings.difficulty].pairs;

  // Setup the game
  useEffect(() => {
    if (words.length > 0) {
      setupExercise();
    }
  }, [words, settings.difficulty, settings.matchType]);

  // Initialize speech engine
  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        await speechEngine.initialize();
        setSpeechSupported(speechEngine.isSupported());
      } catch (error) {
        setSpeechSupported(false);
        console.error('Error initializing speech engine:', error);
      }
    };
    initializeSpeech();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gamePaused && timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && settings.timeLimit > 0 && !gameComplete) {
      setGameComplete(true);
    }
  }, [timeLeft, gameStarted, gameComplete, gamePaused, settings.timeLimit]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setGameComplete(true);
      // Bonus for completing
      const completionBonus = calculateCompletionBonus();
      onScore(completionBonus);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [matchedPairs, totalPairs, settings.difficulty, onScore]);

  // Cleanup effect to handle any stuck states
  useEffect(() => {
    if (isChecking && flippedCards.length === 0) {
      // If checking but no flipped cards, reset the checking state
      setIsChecking(false);
    }
  }, [isChecking, flippedCards]);

  // Debug effect to monitor game state (can be removed in production)
  useEffect(() => {
    console.log('Memory Game State:', {
      flippedCards: flippedCards.length,
      isChecking,
      matchedPairs,
      gameStarted,
      gameComplete
    });
  }, [flippedCards, isChecking, matchedPairs, gameStarted, gameComplete]);

  // Combo multiplier effect
  useEffect(() => {
    if (lastMatchTime > 0) {
      const now = Date.now();
      const timeDiff = now - lastMatchTime;
      
      // If matched within 3 seconds, increase combo
      if (timeDiff < 3000) {
        const newMultiplier = Math.min(comboMultiplier + 0.5, 4);
        setComboMultiplier(newMultiplier);
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1500);
      } else {
        setComboMultiplier(1);
      }
    }
  }, [matchedPairs]);

  const setupExercise = () => {
    let selectedWords = [...words];
    
    // Apply difficulty filter
    if (settings.difficulty === 'easy') {
      selectedWords = selectedWords.filter(word => word.english.length <= 6);
    } else if (settings.difficulty === 'hard') {
      selectedWords = selectedWords.filter(word => word.english.length >= 7);
    }

    // Shuffle if needed
    if (settings.shuffleWords) {
      selectedWords = selectedWords.sort(() => Math.random() - 0.5);
    }

    // Select the number of words based on pairs
    const finalWords = selectedWords.slice(0, Math.min(totalPairs, selectedWords.length));
    setExerciseWords(finalWords);
    setDifficultyFactor(difficultySettings[settings.difficulty].factor);

    // Create card pairs based on match type
    const gameCards: GameCard[] = [];
    
    if (settings.matchType === 'english-arabic') {
      finalWords.forEach((word, index) => {
        gameCards.push({
          id: index * 2,
          text: word.english,
          pairId: index,
          isFlipped: false,
          isMatched: false,
          type: 'english',
          pronunciation: word.pronunciation
        });
        gameCards.push({
          id: index * 2 + 1,
          text: word.arabic,
          pairId: index,
          isFlipped: false,
          isMatched: false,
          type: 'arabic'
        });
      });
    } else if (settings.matchType === 'english-english') {
      finalWords.forEach((word, index) => {
        gameCards.push({
          id: index * 2,
          text: word.english,
          pairId: index,
          isFlipped: false,
          isMatched: false,
          type: 'english',
          pronunciation: word.pronunciation
        });
        gameCards.push({
          id: index * 2 + 1,
          text: word.english,
          pairId: index,
          isFlipped: false,
          isMatched: false,
          type: 'english',
          pronunciation: word.pronunciation
        });
      });
    } else if (settings.matchType === 'arabic-arabic') {
      finalWords.forEach((word, index) => {
        gameCards.push({
          id: index * 2,
          text: word.arabic,
          pairId: index,
          isFlipped: false,
          isMatched: false,
          type: 'arabic'
        });
        gameCards.push({
          id: index * 2 + 1,
          text: word.arabic,
          pairId: index,
          isFlipped: false,
          isMatched: false,
          type: 'arabic'
        });
      });
    }

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setMatchedPairs(0);
    setAttempts(0);
    setTimeLeft(difficultySettings[settings.difficulty].time);
    setGameComplete(false);
    setGameStarted(false);
    setFlippedCards([]);
    setScore(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setHintsUsed(0);
    setComboMultiplier(1);
    setLastMatchTime(0);
  };

  const startGame = () => {
    // Reset all game states to ensure clean start
    setFlippedCards([]);
    setIsChecking(false);
    setMatchedPairs(0);
    setAttempts(0);
    setScore(0);
    setCurrentStreak(0);
    setHintsUsed(0);
    setComboMultiplier(1);
    setGameComplete(false);
    setGamePaused(false);
    
    // Set up the game
    setGameStarted(true);
    setTimeLeft(difficultySettings[settings.difficulty].time);
    
    // Ensure all cards are in the correct initial state
    setCards(prev => prev.map(card => ({
      ...card,
      isFlipped: false,
      isMatched: false
    })));

    console.log('🎮 Memory Game Started!');
  };

  const pauseGame = () => {
    setGamePaused(!gamePaused);
  };

  const flipCard = (cardId: number) => {
    console.log(`🎯 flipCard called for card ${cardId}`);
    
    if (!gameStarted || gamePaused || isChecking || gameComplete) {
      console.log('❌ flipCard blocked: gameStarted:', gameStarted, 'gamePaused:', gamePaused, 'isChecking:', isChecking, 'gameComplete:', gameComplete);
      return;
    }
    
    const card = cards.find(c => c.id === cardId);
    if (!card) {
      console.log('❌ Card not found:', cardId);
      return;
    }
    
    if (card.isFlipped || card.isMatched) {
      console.log('❌ Card already flipped/matched:', { id: cardId, isFlipped: card.isFlipped, isMatched: card.isMatched });
      return;
    }

    // If already two cards flipped, don't allow flipping more
    if (flippedCards.length >= 2) {
      console.log('❌ Too many cards already flipped:', flippedCards.length);
      return;
    }

    console.log(`✅ Flipping card ${cardId} (${card.text})`);
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => {
      const newCards = prev.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      );
      console.log(`🃏 Card ${cardId} state updated to flipped:`, newCards.find(c => c.id === cardId));
      return newCards;
    });

    // Play pronunciation if it's an English card and audio is available
    if (card.type === 'english' && speechSupported && settings.playAudioOnStart) {
      playCardAudio(card.text);
    }

    console.log('📋 Current flipped cards:', newFlippedCards);

    if (newFlippedCards.length === 2) {
      console.log('🔍 Two cards flipped, starting match check in 1.2 seconds...');
      setIsChecking(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => checkMatch(newFlippedCards), 1200);
    }
  };

  const playCardAudio = async (text: string) => {
    if (!speechSupported) return;
    
    try {
      setIsPlaying(true);
      await speechEngine.speak(text, {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
        emphasis: true
      });
      setIsPlaying(false);
    } catch (error) {
      setIsPlaying(false);
      console.error('Error playing audio:', error);
    }
  };

  const checkMatch = (flippedIds: number[]) => {
    if (flippedIds.length !== 2) {
      setIsChecking(false);
      return;
    }

    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (!firstCard || !secondCard) {
      setFlippedCards([]);
      setIsChecking(false);
      return;
    }

    if (firstCard.pairId === secondCard.pairId) {
      setCards(prev => prev.map(c =>
        (c.id === firstId || c.id === secondId)
          ? { ...c, isMatched: true, isFlipped: true }
          : c
      ));
      setMatchedPairs(prev => prev + 1);
      setFlippedCards([]);
      setIsChecking(false);
    } else {
      const idsToFlipBack = [firstId, secondId];
      setTimeout(() => {
        setCards(prev => {
          const newCards = prev.map(c => {
            if (idsToFlipBack.includes(c.id) && !c.isMatched) {
                return { ...c, isFlipped: false };
            }
            return c;
          });
          console.log('Flipping back cards:', idsToFlipBack, newCards);
          return [...newCards];
        });
        setFlippedCards([]);
        setCurrentStreak(0);
        setIsChecking(false);
        setForceUpdate(f => f + 1);
      }, 1500);
    }
  };

  const calculatePoints = () => {
    let basePoints = 10;
    
    // Bonus based on difficulty
    basePoints = Math.round(basePoints * difficultyFactor);
    
    // Combo multiplier
    basePoints = Math.round(basePoints * comboMultiplier);
    
    // Time bonus
    if (settings.timeLimit > 0 && timeLeft > settings.timeLimit * 0.5) {
      basePoints += 5;
    }
    
    // Streak bonus
    if (currentStreak >= 3) {
      basePoints += currentStreak;
    }
    
    // Penalty for hints
    basePoints = Math.max(5, basePoints - (hintsUsed * 2));
    
    return basePoints;
  };

  const calculateCompletionBonus = () => {
    const baseBonus = settings.difficulty === 'easy' ? 30 : 
                     settings.difficulty === 'medium' ? 50 : 70;
    
    // Time factor - more time left = higher bonus
    const timeRatio = settings.timeLimit > 0 ? 
                     Math.max(0, timeLeft / difficultySettings[settings.difficulty].time) : 0.5;
    
    // Attempts factor - fewer attempts = higher bonus
    const perfectScore = totalPairs * 2; // Minimum possible attempts
    const attemptsRatio = Math.max(0, 1 - ((attempts - perfectScore) / (perfectScore * 2)));
    
    // Calculate final bonus
    const finalBonus = Math.round(baseBonus * (1 + timeRatio * 0.5 + attemptsRatio * 0.5));
    
    return finalBonus;
  };

  const showHint = () => {
    if (!settings.showHints) return;
    
    // Find unmatched cards
    const unmatchedCards = cards.filter(card => !card.isMatched && !card.isFlipped);
    if (unmatchedCards.length === 0) return;
    
    // Find a pair that hasn't been matched yet
    const unmatchedPairIds = [...new Set(unmatchedCards.map(card => card.pairId))];
    if (unmatchedPairIds.length === 0) return;
    
    // Select a random pair
    const randomPairId = unmatchedPairIds[Math.floor(Math.random() * unmatchedPairIds.length)];
    
    // Find the first card of this pair
    const hintCard = unmatchedCards.find(card => card.pairId === randomPairId);
    if (!hintCard) return;
    
    // Flash the card briefly
    const newCards = [...cards];
    const cardIndex = newCards.findIndex(c => c.id === hintCard.id);
    
    if (cardIndex !== -1) {
      // Flash effect
      newCards[cardIndex] = { ...newCards[cardIndex], isFlipped: true };
      setCards(newCards);
      
      // Flip back after a moment
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === hintCard.id ? { ...c, isFlipped: false } : c
        ));
      }, 1000);
      
      setHintsUsed(prev => prev + 1);
      showNotification('💡 Hint used! A card was briefly revealed.', 'info');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translate(-50%, -100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracy = () => {
    if (attempts === 0) return 100;
    return Math.round((matchedPairs / attempts) * 100);
  };

  const getPerformanceMessage = () => {
    const accuracy = getAccuracy();
    const timeUsed = difficultySettings[settings.difficulty].time - timeLeft;
    const avgTimePerPair = matchedPairs > 0 ? timeUsed / matchedPairs : 0;
    
    if (accuracy >= 90 && avgTimePerPair < 8) return "🏆 Exceptional performance! Your memory is outstanding!";
    if (accuracy >= 80 && avgTimePerPair < 10) return "🎉 Excellent work! You have a great memory!";
    if (accuracy >= 70) return "👍 Good job! Keep practicing to improve further!";
    if (accuracy >= 50) return "💪 Nice effort! Try to focus more on card positions!";
    return "🧠 Memory games take practice. Keep trying!";
  };

  const getCardSize = () => {
    const sizes = {
      small: 'h-16 w-16 text-xs',
      medium: 'h-24 w-24 text-sm',
      large: 'h-32 w-32 text-base'
    };
    return sizes[settings.cardSize];
  };

  const getCardStyle = (card: GameCard) => {
    const baseStyle = `${getCardSize()} rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-center p-2 font-semibold transform perspective-1000`;
    
    if (card.isMatched) {
      if (settings.theme === 'colorful') {
        return `${baseStyle} bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg scale-105`;
      } else if (settings.theme === 'minimal') {
        return `${baseStyle} bg-white border-2 border-green-500 text-green-700 shadow-lg scale-105`;
      } else {
        return `${baseStyle} bg-green-100 border-2 border-green-500 text-green-800 shadow-lg scale-105`;
      }
    }
    
    if (card.isFlipped) {
      if (settings.theme === 'colorful') {
        return `${baseStyle} ${card.type === 'english' ? 'bg-gradient-to-br from-blue-400 to-purple-500' : 'bg-gradient-to-br from-orange-400 to-red-500'} text-white shadow-lg`;
      } else if (settings.theme === 'minimal') {
        return `${baseStyle} bg-white border-2 ${card.type === 'english' ? 'border-blue-500 text-blue-700' : 'border-orange-500 text-orange-700'} shadow-lg`;
      } else {
        return `${baseStyle} ${card.type === 'english' ? 'bg-blue-100 border-2 border-blue-500 text-blue-800' : 'bg-orange-100 border-2 border-orange-500 text-orange-800'} shadow-lg`;
      }
    }
    
    if (settings.theme === 'colorful') {
      return `${baseStyle} bg-gradient-to-br from-gray-400 to-gray-600 text-white hover:from-gray-500 hover:to-gray-700 hover:scale-105`;
    } else if (settings.theme === 'minimal') {
      return `${baseStyle} bg-white border-2 border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:scale-105`;
    } else {
      return `${baseStyle} bg-gray-100 border-2 border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-700 hover:scale-105`;
    }
  };

  const getGridLayout = () => {
    const pairCount = totalPairs;
    
    if (pairCount <= 6) return 'grid-cols-3 md:grid-cols-4';
    if (pairCount <= 8) return 'grid-cols-4';
    if (pairCount <= 12) return 'grid-cols-4 md:grid-cols-6';
    return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8';
  };

  if (words.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد كلمات متاحة</h3>
        <p className="text-gray-600">يرجى اختيار وحدة تحتوي على كلمات للعب</p>
      </div>
    );
  }

  if (gameComplete) {
    const timeUsed = difficultySettings[settings.difficulty].time - timeLeft;
    const success = matchedPairs === totalPairs;
    const accuracy = getAccuracy();
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className={`text-white p-8 text-center ${
          success 
            ? 'bg-gradient-to-r from-green-500 to-teal-500' 
            : 'bg-gradient-to-r from-red-500 to-pink-500'
        }`}>
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">
            {success ? '🎊 تهانينا!' : '⏰ انتهى الوقت!'}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <div className="text-2xl font-bold">{matchedPairs}</div>
              <div className="text-sm opacity-80">أزواج مطابقة</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{accuracy}%</div>
              <div className="text-sm opacity-80">دقة</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{attempts}</div>
              <div className="text-sm opacity-80">محاولات</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatTime(timeUsed)}</div>
              <div className="text-sm opacity-80">الوقت المستغرق</div>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-xl mb-6 font-semibold">{getPerformanceMessage()}</p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                مستوى الصعوبة
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) => setSettings({...settings, difficulty: e.target.value as any})}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">صعب</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                نوع المطابقة
              </label>
              <select
                value={settings.matchType}
                onChange={(e) => setSettings({...settings, matchType: e.target.value as any})}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="english-arabic">إنجليزي-عربي</option>
                <option value="english-english">إنجليزي-إنجليزي</option>
                <option value="arabic-arabic">عربي-عربي</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                المظهر
              </label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value as any})}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="standard">قياسي</option>
                <option value="colorful">ملون</option>
                <option value="minimal">بسيط</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              الإعدادات
            </button>
            
            <button
              onClick={setupExercise}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              لعب مرة أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" />
              إعدادات اللعبة
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  مستوى الصعوبة
                </label>
                <select
                  value={settings.difficulty}
                  onChange={(e) => setSettings({...settings, difficulty: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="easy">سهل (6 أزواج - 3 دقائق)</option>
                  <option value="medium">متوسط (8 أزواج - 2 دقيقة)</option>
                  <option value="hard">صعب (12 زوج - 1.5 دقيقة)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نوع المطابقة
                </label>
                <select
                  value={settings.matchType}
                  onChange={(e) => setSettings({...settings, matchType: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="english-arabic">إنجليزي-عربي (الكلمة وترجمتها)</option>
                  <option value="english-english">إنجليزي-إنجليزي (نفس الكلمة مرتين)</option>
                  <option value="arabic-arabic">عربي-عربي (نفس الترجمة مرتين)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المظهر
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="standard">قياسي</option>
                  <option value="colorful">ملون</option>
                  <option value="minimal">بسيط</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  حجم البطاقات
                </label>
                <select
                  value={settings.cardSize}
                  onChange={(e) => setSettings({...settings, cardSize: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="small">صغير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">كبير</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.showHints}
                    onChange={(e) => setSettings({...settings, showHints: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">إظهار التلميحات</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.playAudioOnStart}
                    onChange={(e) => setSettings({...settings, playAudioOnStart: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">تشغيل الصوت تلقائياً</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.shuffleWords}
                    onChange={(e) => setSettings({...settings, shuffleWords: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">خلط ترتيب الكلمات</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.showProgress}
                    onChange={(e) => setSettings({...settings, showProgress: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">إظهار شريط التقدم</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowSettings(false);
                  setupExercise();
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
              >
                تطبيق
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              كيفية اللعب
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <div className="text-xl">1</div>
                </div>
                <div>
                  <p className="font-semibold">اقلب بطاقتين في كل مرة</p>
                  <p className="text-gray-600">انقر على بطاقتين لقلبهما ومعرفة ما بداخلهما</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <div className="text-xl">2</div>
                </div>
                <div>
                  <p className="font-semibold">ابحث عن الأزواج المتطابقة</p>
                  <p className="text-gray-600">حاول العثور على الكلمة الإنجليزية وما يقابلها بالعربية</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <div className="text-xl">3</div>
                </div>
                <div>
                  <p className="font-semibold">تذكر مواقع البطاقات</p>
                  <p className="text-gray-600">حاول تذكر مكان كل بطاقة لتتمكن من العثور على الأزواج بسرعة</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <div className="text-xl">4</div>
                </div>
                <div>
                  <p className="font-semibold">اجمع النقاط وأكمل اللعبة</p>
                  <p className="text-gray-600">كلما وجدت أزواجاً أكثر بمحاولات أقل، حصلت على نقاط أعلى</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                فهمت!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">🧠 لعبة الذاكرة</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTutorial(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              title="كيفية اللعب"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              title="الإعدادات"
            >
              <Settings className="w-5 h-5" />
            </button>
            {gameStarted && (
              <button
                onClick={pauseGame}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                title={gamePaused ? "استئناف" : "إيقاف مؤقت"}
              >
                {gamePaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{matchedPairs}</div>
            <div className="text-sm opacity-80">أزواج</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold">{attempts}</div>
            <div className="text-sm opacity-80">محاولات</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold">{getAccuracy()}%</div>
            <div className="text-sm opacity-80">دقة</div>
          </div>
          
          <div>
            <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${
              timeLeft <= 20 ? 'text-red-300 animate-pulse' : ''
            }`}>
              <Clock className="w-6 h-6" />
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm opacity-80">وقت</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {settings.showProgress && (
          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-b-xl p-8">
        {!gameStarted ? (
          <div className="text-center py-12">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">
              اعثر على الأزواج المتطابقة!
            </h4>
            <p className="text-gray-600 mb-4">
              {settings.matchType === 'english-arabic' 
                ? 'اقلب البطاقات للعثور على الكلمة الإنجليزية وترجمتها العربية'
                : settings.matchType === 'english-english'
                ? 'اقلب البطاقات للعثور على نفس الكلمة الإنجليزية'
                : 'اقلب البطاقات للعثور على نفس الكلمة العربية'
              }
            </p>
            <p className="text-sm text-gray-500 mb-8">
              المستوى: {settings.difficulty === 'easy' ? 'سهل' : settings.difficulty === 'medium' ? 'متوسط' : 'صعب'} 
              ({totalPairs} أزواج - {formatTime(difficultySettings[settings.difficulty].time)})
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-xl transition-all hover:scale-105 shadow-lg"
            >
              🎮 ابدأ اللعبة
            </button>
          </div>
        ) : gamePaused ? (
          <div className="text-center py-12">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">⏸️ اللعبة متوقفة</h4>
            <button
              onClick={pauseGame}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-xl transition-all hover:scale-105 shadow-lg"
            >
              ▶️ متابعة اللعبة
            </button>
          </div>
        ) : (
          <>
            {/* Combo Multiplier */}
            {showCombo && comboMultiplier > 1 && (
              <div className="text-center mb-4 animate-bounce">
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  🔥 Combo x{comboMultiplier.toFixed(1)}!
                </span>
              </div>
            )}
            
            {/* Game Grid */}
            <div className={`grid gap-4 ${getGridLayout()}`}>
              {cards.map((card) => (
                <div
                  key={`${card.id}-${card.isFlipped}-${card.isMatched}`} // Force re-render on state change
                  onClick={() => flipCard(card.id)}
                  className={getCardStyle(card)}
                >
                  {/* Show card content when flipped or matched */}
                  {(card.isFlipped || card.isMatched) ? (
                    <span 
                      className={`block ${card.type === 'arabic' ? 'text-lg' : 'text-base'}`} 
                      dir={card.type === 'arabic' ? 'rtl' : 'ltr'}
                    >
                      {card.text}
                    </span>
                  ) : (
                    /* Show card back when not flipped and not matched */
                    <span className="text-2xl">🎴</span>
                  )}
                  
                  {/* Debug indicator */}
                  <div className="absolute -top-1 -right-1 text-xs bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-50">
                    {card.id}
                  </div>
                  
                  {/* State indicator for debugging */}
                  <div className="absolute -bottom-1 -left-1 text-xs">
                    {card.isFlipped ? '↗️' : '⬇️'}{card.isMatched ? '✅' : '❌'}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Game Controls */}
            <div className="flex justify-center gap-4 mt-8">
              {settings.showHints && (
                <button
                  onClick={showHint}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-5 h-5" />
                  تلميح
                </button>
              )}
              
              <button
                onClick={pauseGame}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Pause className="w-5 h-5" />
                إيقاف مؤقت
              </button>
              
              <button
                onClick={setupExercise}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Shuffle className="w-5 h-5" />
                خلط جديد
              </button>
            </div>
          </>
        )}
        
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-0 left-1/4 animate-fall-slow">
              <span className="text-4xl">🎉</span>
            </div>
            <div className="absolute top-0 left-1/2 animate-fall-medium">
              <span className="text-4xl">🎊</span>
            </div>
            <div className="absolute top-0 left-3/4 animate-fall-fast">
              <span className="text-4xl">🎈</span>
            </div>
            <div className="absolute top-0 left-1/3 animate-fall-medium delay-300">
              <span className="text-4xl">🏆</span>
            </div>
            <div className="absolute top-0 left-2/3 animate-fall-slow delay-500">
              <span className="text-4xl">⭐</span>
            </div>
            <div className="absolute top-0 left-1/5 animate-fall-fast delay-700">
              <span className="text-4xl">🎯</span>
            </div>
            <div className="absolute top-0 left-4/5 animate-fall-medium delay-1000">
              <span className="text-4xl">🎖️</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;