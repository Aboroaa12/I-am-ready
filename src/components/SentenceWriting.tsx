import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Trophy, Target, Clock, Zap, Star, Award, BookOpen, Edit, ArrowRight } from 'lucide-react';
import { VocabularyWord } from '../types';
import spellChecker from '../utils/spellChecker';

interface SentenceWritingProps {
  words: VocabularyWord[];
  onScore: (points: number) => void;
  onStreak: (increment: boolean) => void;
}

interface WritingPrompt {
  word: VocabularyWord;
  prompt: string;
  hints: string[];
  sampleSentences: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const SentenceWriting: React.FC<SentenceWritingProps> = ({ words, onScore, onStreak }) => {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [userSentence, setUserSentence] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per sentence
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [samplesUsed, setSamplesUsed] = useState(0);
  const [grammarFeedback, setGrammarFeedback] = useState<string | null>(null);
  const [capitalizationError, setCapitalizationError] = useState(false);
  const [punctuationError, setPunctuationError] = useState(false);
  const [spellingErrors, setSpellingErrors] = useState<{word: string, correction: string}[]>([]);
  const [spellCheckerReady, setSpellCheckerReady] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const totalPrompts = Math.min(8, words.length);

  useEffect(() => {
    generatePrompts();
    
    // Initialize spell checker
    const initSpellChecker = async () => {
      try {
        await spellChecker.initialize();
        setSpellCheckerReady(true);
        console.log('Spell checker initialized successfully');
      } catch (error) {
        console.error('Failed to initialize spell checker:', error);
      }
    };
    
    initSpellChecker();
  }, [words, difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !sessionComplete && !feedbackVisible && prompts.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedbackVisible && prompts.length > 0) {
      handleTimeout();
    }
  }, [timeLeft, sessionComplete, feedbackVisible, prompts.length]);

  const generatePrompts = () => {
    if (words.length === 0) return;

    const selectedWords = words
      .filter(word => word.exampleSentence)
      .sort(() => Math.random() - 0.5)
      .slice(0, totalPrompts);

    const generatedPrompts: WritingPrompt[] = selectedWords.map(word => {
      const prompts = generatePromptsForWord(word);
      const hints = generateHintsForWord(word);
      const samples = generateSampleSentences(word);
      
      return {
        word,
        prompt: prompts[Math.floor(Math.random() * prompts.length)],
        hints,
        sampleSentences: samples,
        difficulty: getDifficultyLevel(word)
      };
    });

    setPrompts(generatedPrompts);
  };

  const generatePromptsForWord = (word: VocabularyWord): string[] => {
    const basePrompts = [
      `اكتب جملة تستخدم فيها كلمة "${word.english}" (${word.arabic})`,
      `أنشئ جملة إبداعية تحتوي على كلمة "${word.english}"`,
      `اكتب جملة تشرح معنى "${word.english}" من خلال السياق`,
      `استخدم "${word.english}" في جملة تصف موقفاً من حياتك`,
      `اكتب جملة تُظهر أهمية "${word.english}" في الحياة اليومية`
    ];

    // Add specific prompts based on part of speech
    if (word.partOfSpeech === 'verb') {
      basePrompts.push(`اكتب جملة تُظهر كيف تقوم بـ "${word.english}"`);
    } else if (word.partOfSpeech === 'adjective') {
      basePrompts.push(`اكتب جملة تصف شيئاً بأنه "${word.english}"`);
    } else if (word.partOfSpeech === 'noun') {
      basePrompts.push(`اكتب جملة تتحدث عن "${word.english}" المفضل لديك`);
    }

    return basePrompts;
  };

  const generateHintsForWord = (word: VocabularyWord): string[] => {
    const hints = [
      `معنى الكلمة: ${word.arabic}`,
      `نوع الكلمة: ${word.partOfSpeech}`,
      `الوحدة: ${word.unit}`
    ];

    if (word.pronunciation) {
      hints.push(`النطق: ${word.pronunciation}`);
    }

    // Add contextual hints
    if (word.partOfSpeech === 'verb') {
      hints.push('تذكر: الأفعال تعبر عن الأعمال والحركات');
    } else if (word.partOfSpeech === 'adjective') {
      hints.push('تذكر: الصفات تصف الأشياء والأشخاص');
    } else if (word.partOfSpeech === 'noun') {
      hints.push('تذكر: الأسماء تشير إلى الأشخاص والأشياء والأماكن');
    }

    return hints;
  };

  const generateSampleSentences = (word: VocabularyWord): string[] => {
    const samples = [];
    
    if (word.exampleSentence) {
      samples.push(word.exampleSentence);
    }

    // Generate additional sample sentences based on the word
    const templates = {
      verb: [
        `I ${word.english} every day.`,
        `She likes to ${word.english}.`,
        `We ${word.english} together.`
      ],
      noun: [
        `The ${word.english} is beautiful.`,
        `I have a ${word.english}.`,
        `This ${word.english} is special.`
      ],
      adjective: [
        `The cat is very ${word.english}.`,
        `She looks ${word.english} today.`,
        `This book is ${word.english}.`
      ]
    };

    const wordTemplates = templates[word.partOfSpeech as keyof typeof templates] || templates.noun;
    samples.push(...wordTemplates.slice(0, 2));

    return samples;
  };

  const getDifficultyLevel = (word: VocabularyWord): 'easy' | 'medium' | 'hard' => {
    if (word.english.length <= 5) return 'easy';
    if (word.english.length <= 8) return 'medium';
    return 'hard';
  };

  const handleTimeout = () => {
    setFeedback('⏰ انتهى الوقت! حاول في المرة القادمة أن تكتب بشكل أسرع.');
    setFeedbackVisible(true);
    setStreak(0);
    onStreak(false);
  };

  // Helper function to check for common spelling variations (American vs British)
  const checkSpellingVariations = (word: string, targetWord: string): boolean => {
    // Convert both to lowercase for comparison
    const wordLower = word.toLowerCase();
    const targetLower = targetWord.toLowerCase();
    
    // Direct match
    if (wordLower === targetLower) return true;
    
    // Common American/British spelling variations
    const commonVariations: {[key: string]: string[]} = {
      'favorite': ['favourite'],
      'favourite': ['favorite'],
      'color': ['colour'],
      'colour': ['color'],
      'center': ['centre'],
      'centre': ['center'],
      'theater': ['theatre'],
      'theatre': ['theater'],
      'analyze': ['analyse'],
      'analyse': ['analyze'],
      'organize': ['organise'],
      'organise': ['organize'],
      'realize': ['realise'],
      'realise': ['realize'],
      'dialog': ['dialogue'],
      'dialogue': ['dialog'],
      'catalog': ['catalogue'],
      'catalogue': ['catalog'],
      'program': ['programme'],
      'programme': ['program'],
      'traveling': ['travelling'],
      'travelling': ['traveling'],
      'defense': ['defence'],
      'defence': ['defense'],
      'license': ['licence'],
      'licence': ['license'],
      'practice': ['practise'],
      'practise': ['practice'],
      'gray': ['grey'],
      'grey': ['gray'],
      'humor': ['humour'],
      'humour': ['humor'],
      'labor': ['labour'],
      'labour': ['labor'],
      'neighbor': ['neighbour'],
      'neighbour': ['neighbor'],
      'soccer': ['football'],
      'football': ['soccer']
    };
    
    // Check if the word has variations and if the target matches any of them
    if (commonVariations[wordLower] && commonVariations[wordLower].includes(targetLower)) {
      return true;
    }
    
    // Check the reverse as well
    if (commonVariations[targetLower] && commonVariations[targetLower].includes(wordLower)) {
      return true;
    }
    
    return false;
  };

  const checkSentence = async () => {
    if (!userSentence.trim()) {
      setFeedback('❌ يرجى كتابة جملة قبل التحقق!');
      setFeedbackVisible(true);
      return;
    }

    const currentWord = prompts[currentPrompt].word;
    const sentence = userSentence.toLowerCase().trim();
    const targetWord = currentWord.english.toLowerCase();
    
    // Reset errors
    setCapitalizationError(false);
    setPunctuationError(false);
    setGrammarFeedback(null);
    setSpellingErrors([]);

    // Check if the sentence contains the target word or its variations
    const containsWord = sentence.includes(targetWord) || 
                         sentence.split(/\s+/).some(word => 
                           checkSpellingVariations(word.replace(/[.,!?;:]/g, ''), targetWord)
                         );
    
    // Basic grammar checks
    const hasCapital = userSentence.charAt(0) === userSentence.charAt(0).toUpperCase();
    const hasPunctuation = /[.!?]$/.test(userSentence.trim());
    const hasMinLength = userSentence.trim().split(' ').length >= 4;
    
    // Set capitalization and punctuation errors
    setCapitalizationError(!hasCapital);
    setPunctuationError(!hasPunctuation);
    
    // Check for common grammar errors
    let grammarErrors = [];
    
    // Check for "is having" with non-action nouns
    if (/is having \w+/.test(sentence) && currentWord.partOfSpeech === 'noun' && 
        !['party', 'meeting', 'conversation', 'discussion', 'argument'].includes(targetWord)) {
      grammarErrors.push("استخدام 'is having' غير صحيح مع الأسماء غير الإجرائية. استخدم 'has' بدلاً من ذلك.");
    }
    
    // Check for incorrect plural forms
    if (sentence.includes('floor') && sentence.includes('3') && !sentence.includes('floors')) {
      grammarErrors.push("الأعداد أكبر من 1 تتطلب جمع الاسم: 'floors' وليس 'floor'");
    }
    
    // Check for subject-verb agreement
    if (/house are/.test(sentence)) {
      grammarErrors.push("'house' مفرد ويتطلب فعل مفرد: 'is' وليس 'are'");
    }
    
    // Set grammar feedback if errors found
    if (grammarErrors.length > 0) {
      setGrammarFeedback(grammarErrors.join(' '));
    }

    // Check for spelling errors using nspell
    if (spellCheckerReady) {
      try {
        const words = sentence.split(/\s+/).map(w => w.replace(/[.,!?;:]/g, ''));
        const spellingErrorsFound: {word: string, correction: string}[] = [];
        
        for (const word of words) {
          // Skip checking the target word or its variations
          if (word.length <= 2 || checkSpellingVariations(word, targetWord)) {
            continue;
          }
          
          const isCorrect = await spellChecker.checkWord(word);
          if (!isCorrect) {
            const suggestions = await spellChecker.getSuggestions(word);
            if (suggestions.length > 0) {
              spellingErrorsFound.push({
                word: word,
                correction: suggestions[0]
              });
            }
          }
        }
        
        setSpellingErrors(spellingErrorsFound);
      } catch (error) {
        console.error('Error checking spelling:', error);
      }
    }

    let points = 0;
    let feedbackMessage = '';

    if (containsWord) {
      points += 15; // Base points for using the word
      feedbackMessage = '✅ ممتاز! استخدمت الكلمة بشكل صحيح. ';
      
      if (hasCapital) {
        points += 5;
        feedbackMessage += 'بدأت الجملة بحرف كبير. ';
      } else {
        feedbackMessage += '⚠️ تذكر أن تبدأ الجملة بحرف كبير. ';
      }
      
      if (hasPunctuation) {
        points += 5;
        feedbackMessage += 'أنهيت الجملة بعلامة ترقيم. ';
      } else {
        feedbackMessage += '⚠️ تذكر أن تنهي الجملة بعلامة ترقيم. ';
      }
      
      if (hasMinLength) {
        points += 5;
        feedbackMessage += 'الجملة طويلة ومفيدة. ';
      } else {
        feedbackMessage += '⚠️ حاول كتابة جمل أطول (4 كلمات على الأقل). ';
      }

      // Difficulty bonus
      if (currentWord.difficulty === 'hard') points += 5;
      else if (currentWord.difficulty === 'medium') points += 3;

      // Penalty for using hints/samples
      points -= hintsUsed * 2;
      points -= samplesUsed * 3;
      
      // Grammar errors penalty
      if (grammarErrors.length > 0) {
        points -= 5;
        feedbackMessage += '⚠️ لكن هناك أخطاء نحوية. ';
      }
      
      // Spelling errors penalty
      if (spellingErrors.length > 0) {
        points -= spellingErrors.length * 2;
        feedbackMessage += `⚠️ يوجد ${spellingErrors.length} أخطاء إملائية. `;
      }

      // Streak bonus
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
      if (newStreak >= 3) points += newStreak;

      onStreak(true);
    } else {
      feedbackMessage = `❌ لم تستخدم كلمة "${currentWord.english}" في جملتك. حاول مرة أخرى!`;
      setStreak(0);
      onStreak(false);
    }

    points = Math.max(0, points); // Ensure points don't go below 0
    setScore(score + points);
    setFeedback(feedbackMessage + (points > 0 ? ` (+${points} نقطة)` : ''));
    setFeedbackVisible(true);
    
    if (isGameTimerActive) {
      setRemainingTime(timeLimit);
    }
  };

  // Helper function to generate corrected sentence
  const generateCorrectedSentence = (originalSentence: string): string => {
    let corrected = originalSentence;
    
    // Fix capitalization
    if (capitalizationError) {
      corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    }
    
    // Fix punctuation
    if (punctuationError) {
      corrected = corrected.trim();
      if (!corrected.match(/[.!?]$/)) {
        corrected += '.';
      }
    }
    
    // Fix spelling errors
    spellingErrors.forEach(error => {
      const regex = new RegExp(`\\b${error.word}\\b`, 'gi');
      corrected = corrected.replace(regex, error.correction);
    });
    
    // Fix common grammar errors
    if (grammarFeedback) {
      // Fix "is having" -> "has"
      corrected = corrected.replace(/is having ([a-zA-Z]+)/gi, 'has $1');
      
      // Fix plural errors
      corrected = corrected.replace(/(\d+)\s+floor\b/gi, '$1 floors');
      
      // Fix subject-verb agreement
      corrected = corrected.replace(/house are/gi, 'house is');
    }
    
    return corrected;
  };

  // Helper function to highlight errors in the original sentence
  const highlightErrors = (sentence: string): JSX.Element => {
    const words = sentence.split(/(\s+)/); // Keep spaces in the split
    const highlightedWords = words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
      
      // Check if this word has a spelling error
      const hasSpellingError = spellingErrors.some(error => 
        error.word.toLowerCase() === cleanWord
      );
      
      if (hasSpellingError) {
        return (
          <span 
            key={index} 
            className="bg-red-200 text-red-800 px-1 rounded border-b-2 border-red-400"
            title="خطأ إملائي"
          >
            {word}
          </span>
        );
      }
      
      return <span key={index}>{word}</span>;
    });
    
    return (
      <span>
        {/* Highlight capitalization error */}
        {capitalizationError && (
          <span 
            className="bg-yellow-200 text-yellow-800 px-1 rounded border-b-2 border-yellow-400"
            title="يجب أن يبدأ بحرف كبير"
          >
            {highlightedWords[0]}
          </span>
        )}
        {!capitalizationError && highlightedWords[0]}
        
        {/* Rest of the sentence */}
        {highlightedWords.slice(1, -1)}
        
        {/* Highlight punctuation error */}
        {punctuationError && highlightedWords.length > 1 && (
          <span>
            {highlightedWords[highlightedWords.length - 1]}
            <span 
              className="bg-orange-200 text-orange-800 px-1 rounded border-b-2 border-orange-400 ml-1"
              title="مطلوب علامة ترقيم"
            >
              ؟
            </span>
          </span>
        )}
        {!punctuationError && highlightedWords.length > 1 && highlightedWords[highlightedWords.length - 1]}
      </span>
    );
  };

  const nextPrompt = () => {
    // Clear feedback
    setFeedbackVisible(false);
    setFeedback(null);
    setGrammarFeedback(null);
    setCapitalizationError(false);
    setPunctuationError(false);
    setSpellingErrors([]);
    
    if (currentPrompt + 1 >= prompts.length) {
      setSessionComplete(true);
    } else {
      setCurrentPrompt(prev => prev + 1);
      setUserSentence('');
      setShowHints(false);
      setShowSamples(false);
      setTimeLeft(120);
      
      // Focus on textarea for next prompt
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  };

  const restartSession = () => {
    setCurrentPrompt(0);
    setUserSentence('');
    setFeedback(null);
    setFeedbackVisible(false);
    setGrammarFeedback(null);
    setCapitalizationError(false);
    setPunctuationError(false);
    setSpellingErrors([]);
    setScore(0);
    setStreak(0);
    setShowHints(false);
    setShowSamples(false);
    setSessionComplete(false);
    setTimeLeft(120);
    setHintsUsed(0);
    setSamplesUsed(0);
    generatePrompts();
  };

  const toggleHints = () => {
    if (!showHints) {
      setHintsUsed(prev => prev + 1);
    }
    setShowHints(!showHints);
  };

  const toggleSamples = () => {
    if (!showSamples) {
      setSamplesUsed(prev => prev + 1);
    }
    setShowSamples(!showSamples);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (prompts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحضير التمارين...</p>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = totalPrompts > 0 ? (score / (totalPrompts * 30)) * 100 : 0;
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">🎉 انتهت جلسة الكتابة!</h3>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm opacity-80">النقاط الإجمالية</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
              <div className="text-sm opacity-80">الأداء</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{bestStreak}</div>
              <div className="text-sm opacity-80">أفضل سلسلة</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalPrompts}</div>
              <div className="text-sm opacity-80">جمل مكتوبة</div>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-6">
            {accuracy >= 90 ? (
              <p className="text-2xl text-pink-600 font-bold">🏆 كاتب محترف!</p>
            ) : accuracy >= 80 ? (
              <p className="text-2xl text-blue-600 font-bold">🎉 كتابة ممتازة!</p>
            ) : accuracy >= 70 ? (
              <p className="text-2xl text-green-600 font-bold">👍 كتابة جيدة!</p>
            ) : accuracy >= 60 ? (
              <p className="text-2xl text-yellow-600 font-bold">📚 تحتاج مراجعة!</p>
            ) : (
              <p className="text-2xl text-red-600 font-bold">💪 راجع القواعد!</p>
            )}
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
          
          <button
            onClick={restartSession}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            جلسة كتابة جديدة
          </button>
        </div>
      </div>
    );
  }

  const currentPromptData = prompts[currentPrompt];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">✍️ كتابة الجمل الإبداعية</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{score}</div>
              <div className="text-xs opacity-80">النقاط</div>
            </div>
            {streak > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {streak}
                </div>
                <div className="text-xs opacity-80">سلسلة</div>
              </div>
            )}
            <div className="text-center">
              <div className={`text-lg font-bold flex items-center gap-1 ${timeLeft <= 30 ? 'text-red-300 animate-pulse' : ''}`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs opacity-80">وقت</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm opacity-90">
          <span>التمرين {currentPrompt + 1} / {totalPrompts}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            currentPromptData.difficulty === 'easy' ? 'bg-green-500' :
            currentPromptData.difficulty === 'medium' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {currentPromptData.difficulty === 'easy' ? 'سهل' : currentPromptData.difficulty === 'medium' ? 'متوسط' : 'صعب'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPrompt + 1) / totalPrompts) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-xl p-8">
        {/* Word Display */}
        <div className="text-center mb-8">
          <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
            <h4 className="text-xl font-bold text-pink-800 mb-4">الكلمة المطلوبة:</h4>
            <div className="text-3xl font-bold mb-2" dir="ltr">{currentPromptData.word.english}</div>
            <div className="text-lg text-gray-600 mb-2">{currentPromptData.word.arabic}</div>
            {currentPromptData.word.pronunciation && (
              <div className="text-sm text-gray-500 font-mono">{currentPromptData.word.pronunciation}</div>
            )}
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">📝 المطلوب:</h4>
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-gray-700 text-lg">{currentPromptData.prompt}</p>
          </div>
        </div>

        {/* Writing Area */}
        <div className="mb-6">
          <label htmlFor="sentence" className="block text-lg font-semibold text-gray-800 mb-3">
            ✍️ اكتب جملتك هنا:
          </label>
          <textarea
            id="sentence"
            ref={textareaRef}
            value={userSentence}
            onChange={(e) => setUserSentence(e.target.value)}
            placeholder="اكتب جملة إبداعية تحتوي على الكلمة المطلوبة..."
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg resize-none"
            dir="ltr"
            disabled={feedbackVisible}
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>عدد الكلمات: {userSentence.trim().split(' ').filter(word => word.length > 0).length}</span>
            <span>الحد الأدنى: 4 كلمات</span>
          </div>
        </div>

        {/* Helper Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleHints}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {showHints ? 'إخفاء التلميحات' : 'إظهار تلميحات'}
          </button>
          <button
            onClick={toggleSamples}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {showSamples ? 'إخفاء الأمثلة' : 'إظهار أمثلة'}
          </button>
        </div>

        {/* Hints */}
        {showHints && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
            <h5 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              تلميحات مفيدة:
            </h5>
            <ul className="space-y-2">
              {currentPromptData.hints.map((hint, index) => (
                <li key={index} className="text-yellow-700 flex items-start gap-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Sentences */}
        {showSamples && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <h5 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              أمثلة للاستئناس:
            </h5>
            <div className="space-y-2">
              {currentPromptData.sampleSentences.map((sentence, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-700 font-mono" dir="ltr">{sentence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Check Button */}
        {!feedbackVisible && (
          <div className="text-center mb-6">
            <button
              onClick={checkSentence}
              disabled={!userSentence.trim()}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              تحقق من الجملة
            </button>
          </div>
        )}

        {/* Enhanced Feedback with Error Highlighting */}
        {feedbackVisible && feedback && (
          <div className={`p-6 rounded-xl border-2 mb-6 ${
            feedback.includes('✅') 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-red-100 text-red-800 border-red-300'
          }`}>
            <p className="text-lg mb-6 font-semibold text-center">{feedback}</p>
            
            {/* Show sentence comparison if there are any errors */}
            {(capitalizationError || punctuationError || spellingErrors.length > 0 || grammarFeedback) && userSentence && (
              <div className="space-y-4 mb-6">
                
                {/* Original sentence with highlighted errors */}
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <h5 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-red-500">❌</span>
                    جملتك (مع تحديد الأخطاء):
                  </h5>
                  
                  {/* Color legend */}
                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    {capitalizationError && (
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded border">
                        🟡 حرف كبير
                      </span>
                    )}
                    {punctuationError && (
                      <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded border">
                        🟠 علامة ترقيم
                      </span>
                    )}
                    {spellingErrors.length > 0 && (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded border">
                        🔴 خطأ إملائي
                      </span>
                    )}
                  </div>
                  
                  <div className="text-lg font-mono p-3 bg-gray-50 rounded border" dir="ltr">
                    {highlightErrors(userSentence)}
                  </div>
                </div>

                {/* Corrected sentence */}
                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <h5 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    الجملة المُصححة:
                  </h5>
                  <div className="text-lg font-mono p-3 bg-green-50 rounded border" dir="ltr">
                    <span className="text-green-800 font-semibold">
                      {generateCorrectedSentence(userSentence)}
                    </span>
                  </div>
                </div>

                {/* Error explanations */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span>💡</span>
                    شرح الأخطاء والتصحيحات:
                  </h5>
                  <div className="space-y-3 text-sm">
            
                    {/* Capitalization Error */}
                    {capitalizationError && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                          حرف كبير
                        </span>
                        <div>
                          <p className="font-semibold text-yellow-800">يجب أن تبدأ الجملة بحرف كبير</p>
                          <p className="text-yellow-700">
                            <span className="line-through">{userSentence.charAt(0)}</span>
                            <span className="mx-2">→</span>
                            <span className="font-bold">{userSentence.charAt(0).toUpperCase()}</span>
                          </p>
                        </div>
                      </div>
                    )}
            
                    {/* Punctuation Error */}
                    {punctuationError && (
                      <div className="flex items-start gap-3 p-3 bg-orange-50 rounded border border-orange-200">
                        <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-bold">
                          ترقيم
                        </span>
                        <div>
                          <p className="font-semibold text-orange-800">يجب إنهاء الجملة بعلامة ترقيم</p>
                          <p className="text-orange-700">
                            أضف <span className="font-bold">نقطة (.)</span> أو <span className="font-bold">علامة تعجب (!)</span> أو <span className="font-bold">علامة استفهام (?)</span>
                          </p>
                        </div>
                      </div>
                    )}
            
                    {/* Spelling Errors */}
                    {spellingErrors.length > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200">
                        <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-bold">
                          إملاء
                        </span>
                        <div>
                          <p className="font-semibold text-red-800 mb-2">أخطاء إملائية:</p>
                          <div className="space-y-1">
                            {spellingErrors.map((error, index) => (
                              <p key={index} className="text-red-700">
                                <span className="line-through font-mono">{error.word}</span>
                                <span className="mx-2">→</span>
                                <span className="font-bold font-mono">{error.correction}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
            
                    {/* Grammar Feedback */}
                    {grammarFeedback && (
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded border border-purple-200">
                        <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-bold">
                          نحو
                        </span>
                        <div>
                          <p className="font-semibold text-purple-800">ملاحظات نحوية:</p>
                          <p className="text-purple-700">{grammarFeedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* If no errors, show the clean sentence */}
            {!(capitalizationError || punctuationError || spellingErrors.length > 0 || grammarFeedback) && userSentence && (
              <div className="bg-white rounded-lg p-4 border-2 border-green-200 mb-6">
                <h5 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  جملتك الممتازة:
                </h5>
                <div className="text-lg font-mono p-3 bg-green-50 rounded border" dir="ltr">
                  <span className="text-green-800 font-semibold">{userSentence}</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button 
                onClick={nextPrompt}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                الانتقال للجملة التالية
              </button>
            </div>
          </div>
        )}

        {/* Writing Tips */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mt-6">
          <h5 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            نصائح للكتابة الجيدة:
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>ابدأ الجملة بحرف كبير</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>أنه الجملة بعلامة ترقيم</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>استخدم الكلمة المطلوبة بوضوح</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>اكتب جملة مفيدة ومفهومة</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>استخدم 4 كلمات على الأقل</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>كن مبدعاً في التعبير</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>انتبه للأخطاء النحوية الشائعة</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>استخدم الجمع مع الأعداد أكبر من 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentenceWriting;