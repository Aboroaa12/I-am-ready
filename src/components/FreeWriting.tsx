import React, { useState, useEffect, useRef } from 'react';
import { Save, Trash2, Clock, Download, Upload, CheckCircle, XCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import spellChecker from '../utils/spellChecker';

interface FreeWritingProps {
  onScore?: (points: number) => void;
  onSave?: (text: string) => void;
}

interface GrammarError {
  message: string;
  offset: number;
  length: number;
  replacements: string[];
  context: {
    text: string;
    offset: number;
    length: number;
  };
  rule?: {
    id: string;
    description: string;
    category: string;
  };
}

const FreeWriting: React.FC<FreeWritingProps> = ({ onScore, onSave }) => {
  const [text, setText] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [savedText, setSavedText] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState<boolean>(true);
  const [spellingErrors, setSpellingErrors] = useState<{word: string, suggestions: string[], index: number}[]>([]);
  const [grammarErrors, setGrammarErrors] = useState<GrammarError[]>([]);
  const [isSpellChecking, setIsSpellChecking] = useState<boolean>(false);
  const [isGrammarChecking, setIsGrammarChecking] = useState<boolean>(false);
  const [spellCheckerReady, setSpellCheckerReady] = useState<boolean>(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [grammarCheckEnabled, setGrammarCheckEnabled] = useState<boolean>(true);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize spell checker
  useEffect(() => {
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
    
    // Load saved text from localStorage
    const saved = localStorage.getItem('free-writing-text');
    if (saved) {
      setText(saved);
      setSavedText(saved);
      setLastSaved(new Date());
      
      // Update word and character count for loaded text
      const words = saved.trim() ? saved.trim().split(/\s+/) : [];
      setWordCount(words.length);
      setCharCount(saved.length);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update word and character count
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    setWordCount(words.length);
    setCharCount(text.length);
    
    // Auto-save if enabled
    if (autoSaveEnabled && text.trim() && text !== savedText) {
      const autoSaveTimeout = setTimeout(() => {
        handleSave();
      }, 10000); // Auto-save after 10 seconds of inactivity
      
      return () => clearTimeout(autoSaveTimeout);
    }
  }, [text, autoSaveEnabled, savedText]);

  // Check spelling when text changes or spell check is toggled
  useEffect(() => {
    if (spellCheckEnabled && spellCheckerReady && text.trim()) {
      const debounceTimeout = setTimeout(() => {
        checkSpelling(text);
      }, 1000);
      
      return () => clearTimeout(debounceTimeout);
    } else if (!spellCheckEnabled) {
      setSpellingErrors([]);
    }
  }, [text, spellCheckEnabled, spellCheckerReady]);

  // Check grammar when text changes or grammar check is toggled
  useEffect(() => {
    if (grammarCheckEnabled && text.trim()) {
      const debounceTimeout = setTimeout(() => {
        checkGrammar(text);
      }, 1500);
      
      return () => clearTimeout(debounceTimeout);
    } else if (!grammarCheckEnabled) {
      setGrammarErrors([]);
    }
  }, [text, grammarCheckEnabled]);

  // Start/stop timer
  const toggleTimer = () => {
    if (isTimerRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsTimerRunning(false);
    } else {
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setIsTimerRunning(true);
      
      // Focus on textarea when timer starts
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Reset timer
  const resetTimer = () => {
    setTimer(0);
    if (isTimerRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Check spelling
  const checkSpelling = async (textToCheck: string) => {
    if (!spellCheckerReady || !textToCheck.trim()) {
      setSpellingErrors([]);
      return;
    }
    
    setIsSpellChecking(true);
    
    try {
      const { misspelledWords } = await spellChecker.checkText(textToCheck);
      setSpellingErrors(misspelledWords);
    } catch (error) {
      console.error('Error checking spelling:', error);
    } finally {
      setIsSpellChecking(false);
    }
  };

  // Check grammar
  const checkGrammar = async (textToCheck: string) => {
    if (!textToCheck.trim()) {
      setGrammarErrors([]);
      return;
    }
    
    setIsGrammarChecking(true);
    
    try {
      // Simple grammar rules for demonstration
      const errors: GrammarError[] = [];
      
      // Check for capitalization at the beginning of sentences
      const sentences = textToCheck.split(/[.!?]\s+/);
      let currentOffset = 0;
      
      for (const sentence of sentences) {
        if (sentence.trim() && sentence.length > 0) {
          const firstChar = sentence.trim()[0];
          if (firstChar && firstChar === firstChar.toLowerCase() && /[a-z]/.test(firstChar)) {
            errors.push({
              message: "Sentences should start with a capital letter",
              offset: textToCheck.indexOf(sentence, currentOffset),
              length: 1,
              replacements: [sentence.charAt(0).toUpperCase() + sentence.slice(1)],
              context: {
                text: sentence.substring(0, Math.min(20, sentence.length)),
                offset: 0,
                length: 1
              },
              rule: {
                id: "UPPERCASE_SENTENCE_START",
                description: "Capitalize the first word of a sentence",
                category: "CASING"
              }
            });
          }
        }
        currentOffset += sentence.length + 2; // +2 for the punctuation and space
      }
      
      // Check for common grammar issues
      const commonErrors = [
        { pattern: /\bi am\b/gi, message: "Consider capitalizing 'I'", replacement: "I am" },
        { pattern: /\bthey is\b/gi, message: "Use 'they are' instead of 'they is'", replacement: "they are" },
        { pattern: /\bhe are\b/gi, message: "Use 'he is' instead of 'he are'", replacement: "he is" },
        { pattern: /\bshe are\b/gi, message: "Use 'she is' instead of 'she are'", replacement: "she is" },
        { pattern: /\bit are\b/gi, message: "Use 'it is' instead of 'it are'", replacement: "it is" },
        { pattern: /\bwe is\b/gi, message: "Use 'we are' instead of 'we is'", replacement: "we are" },
        { pattern: /\byou is\b/gi, message: "Use 'you are' instead of 'you is'", replacement: "you are" },
        { pattern: /\ba apple\b/gi, message: "Use 'an' before words starting with vowel sounds", replacement: "an apple" },
        { pattern: /\ban book\b/gi, message: "Use 'a' before words starting with consonant sounds", replacement: "a book" },
        { pattern: /\bis you\b/gi, message: "Use 'are you' instead of 'is you'", replacement: "are you" },
        { pattern: /\bthis books\b/gi, message: "Use 'these books' instead of 'this books'", replacement: "these books" },
        { pattern: /\bthese book\b/gi, message: "Use 'this book' instead of 'these book'", replacement: "this book" },
        { pattern: /\bthere is .+ and .+\b/gi, message: "Consider using 'there are' for multiple items", replacement: "there are" },
        { pattern: /\b(he|she|it) don't\b/gi, message: "Use 'doesn't' with he/she/it", replacement: "$1 doesn't" },
        { pattern: /\b(I|you|we|they) doesn't\b/gi, message: "Use 'don't' with I/you/we/they", replacement: "$1 don't" }
      ];
      
      for (const error of commonErrors) {
        let match;
        while ((match = error.pattern.exec(textToCheck)) !== null) {
          errors.push({
            message: error.message,
            offset: match.index,
            length: match[0].length,
            replacements: [error.replacement],
            context: {
              text: textToCheck.substring(Math.max(0, match.index - 10), match.index + match[0].length + 10),
              offset: Math.min(10, match.index),
              length: match[0].length
            },
            rule: {
              id: "GRAMMAR_RULE",
              description: error.message,
              category: "GRAMMAR"
            }
          });
        }
      }
      
      // Check for double spaces
      let spaceMatch;
      const doubleSpacePattern = /\s{2,}/g;
      while ((spaceMatch = doubleSpacePattern.exec(textToCheck)) !== null) {
        errors.push({
          message: "Consider removing extra spaces",
          offset: spaceMatch.index,
          length: spaceMatch[0].length,
          replacements: [" "],
          context: {
            text: textToCheck.substring(Math.max(0, spaceMatch.index - 10), spaceMatch.index + spaceMatch[0].length + 10),
            offset: Math.min(10, spaceMatch.index),
            length: spaceMatch[0].length
          },
          rule: {
            id: "DOUBLE_SPACES",
            description: "Remove extra spaces",
            category: "TYPOGRAPHY"
          }
        });
      }
      
      // Check for missing periods at the end of sentences
      const paragraphs = textToCheck.split('\n');
      let paragraphOffset = 0;
      
      for (const paragraph of paragraphs) {
        if (paragraph.trim() && 
            paragraph.length > 20 && 
            !/[.!?]$/.test(paragraph.trim()) && 
            /[a-zA-Z0-9]$/.test(paragraph.trim())) {
          errors.push({
            message: "Consider adding a period at the end of this sentence",
            offset: paragraphOffset + paragraph.length,
            length: 0,
            replacements: ["."],
            context: {
              text: paragraph.substring(Math.max(0, paragraph.length - 20)),
              offset: Math.min(20, paragraph.length),
              length: 0
            },
            rule: {
              id: "MISSING_PERIOD",
              description: "Add a period at the end of sentences",
              category: "PUNCTUATION"
            }
          });
        }
        paragraphOffset += paragraph.length + 1; // +1 for the newline
      }
      
      setGrammarErrors(errors);
    } catch (error) {
      console.error('Error checking grammar:', error);
    } finally {
      setIsGrammarChecking(false);
    }
  };

  // Clear text
  const handleClear = () => {
    if (text.trim() && !window.confirm('هل أنت متأكد من رغبتك في مسح النص؟')) {
      return;
    }
    
    setText('');
    setSpellingErrors([]);
    setGrammarErrors([]);
    
    // Focus on textarea after clearing
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Save text
  const handleSave = () => {
    localStorage.setItem('free-writing-text', text);
    setSavedText(text);
    setLastSaved(new Date());
    
    if (onSave) {
      onSave(text);
    }
    
    // Award points for saving text
    if (onScore && text.trim().length > 50) {
      onScore(10);
    }
    
    // Show notification
    showNotification('تم حفظ النص بنجاح', 'success');
  };

  // Export text as file
  const handleExport = () => {
    if (!text.trim()) {
      showNotification('لا يوجد نص للتصدير', 'error');
      return;
    }
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `free-writing-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('تم تصدير النص بنجاح', 'success');
  };

  // Import text from file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setText(content);
        showNotification('تم استيراد النص بنجاح', 'success');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Apply spelling correction
  const applySpellingCorrection = (originalWord: string, correction: string) => {
    const newText = text.replace(new RegExp(`\\b${originalWord}\\b`, 'g'), correction);
    setText(newText);
    
    // Remove the corrected error from the list
    setSpellingErrors(prev => prev.filter(error => error.word !== originalWord));
    
    showNotification(`تم تصحيح "${originalWord}" إلى "${correction}"`, 'success');
  };

  // Apply grammar correction
  const applyGrammarCorrection = (error: GrammarError, replacement: string) => {
    if (error.offset >= 0 && error.length > 0) {
      const before = text.substring(0, error.offset);
      const after = text.substring(error.offset + error.length);
      const newText = before + replacement + after;
      setText(newText);
      
      // Remove the corrected error from the list
      setGrammarErrors(prev => prev.filter(e => e !== error));
      
      showNotification('تم تصحيح الخطأ النحوي', 'success');
    }
  };

  // Show notification
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl p-6">
        <h3 className="text-2xl font-bold mb-2">✍️ الكتابة الحرة</h3>
        <p className="opacity-90">اكتب بحرية وعبر عن أفكارك دون قيود</p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-xl p-6 shadow-xl">
        {/* Control Panel */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isTimerRunning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            {isTimerRunning ? 'إيقاف المؤقت' : 'بدء المؤقت'}
          </button>
          
          <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span>{formatTime(timer)}</span>
          </div>
          
          <button
            onClick={resetTimer}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
            title="إعادة ضبط المؤقت"
          >
            <span>↻</span>
          </button>
          
          <div className="flex-1"></div>
          
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ
          </button>
          
          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            مسح
          </button>
          
          <button
            onClick={handleExport}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تصدير
          </button>
          
          <button
            onClick={triggerFileInput}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>استيراد</span>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".txt" 
              className="hidden" 
              onChange={handleImport}
            />
          </button>
        </div>

        {/* Spell Check and Grammar Check Toggles */}
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={spellCheckEnabled}
              onChange={() => setSpellCheckEnabled(!spellCheckEnabled)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">تفعيل التدقيق الإملائي</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer ml-6">
            <input
              type="checkbox"
              checked={grammarCheckEnabled}
              onChange={() => setGrammarCheckEnabled(!grammarCheckEnabled)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-gray-700">تفعيل التدقيق النحوي</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer ml-6">
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span className="text-gray-700">حفظ تلقائي</span>
          </label>
          
          {lastSaved && (
            <span className="text-xs text-gray-500">
              آخر حفظ: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="ابدأ الكتابة هنا..."
            className="w-full h-64 p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none resize-y"
            dir="auto"
          ></textarea>
        </div>

        {/* Word Count and Stats */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
          <div className="bg-gray-100 px-3 py-1 rounded-lg">
            الكلمات: {wordCount}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-lg">
            الأحرف: {charCount}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-lg">
            الوقت: {formatTime(timer)}
          </div>
          {wordCount > 0 && timer > 0 && (
            <div className="bg-gray-100 px-3 py-1 rounded-lg">
              معدل الكتابة: {Math.round((wordCount / (timer / 60)) * 10) / 10} كلمة/دقيقة
            </div>
          )}
        </div>

        {/* Spelling Errors */}
        {spellCheckEnabled && spellingErrors.length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              أخطاء إملائية محتملة ({spellingErrors.length}):
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
              <ul className="space-y-2">
                {spellingErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-1" />
                    <div>
                      <span className="font-mono font-bold">{error.word}</span>
                      {error.suggestions && error.suggestions.length > 0 && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-600">اقتراحات: </span>
                          {error.suggestions.slice(0, 3).map((suggestion, i) => (
                            <button 
                              key={i} 
                              className="bg-white px-2 py-1 rounded border border-gray-300 text-blue-600 cursor-pointer hover:bg-blue-50 mr-1"
                              onClick={() => applySpellingCorrection(error.word, suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Grammar Errors */}
        {grammarCheckEnabled && grammarErrors.length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold text-purple-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              أخطاء نحوية محتملة ({grammarErrors.length}):
            </h4>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-h-40 overflow-y-auto">
              <ul className="space-y-3">
                {grammarErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-purple-800">{error.message}</div>
                      <div className="bg-white p-2 rounded border border-purple-200 my-1 font-mono text-sm">
                        {error.context.text}
                      </div>
                      {error.replacements && error.replacements.length > 0 && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-600">اقتراحات: </span>
                          {error.replacements.slice(0, 3).map((suggestion, i) => (
                            <button 
                              key={i} 
                              className="bg-white px-2 py-1 rounded border border-gray-300 text-purple-600 cursor-pointer hover:bg-purple-50 mr-1"
                              onClick={() => applyGrammarCorrection(error, suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Writing Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            نصائح للكتابة الإبداعية:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div className="flex items-start gap-2">
              <div className="bg-blue-200 p-1 rounded-full text-blue-700 mt-1">1</div>
              <p>اكتب بحرية دون التركيز على الأخطاء في البداية</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-200 p-1 rounded-full text-blue-700 mt-1">2</div>
              <p>استخدم المؤقت لتحفيز نفسك على الكتابة المستمرة</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-200 p-1 rounded-full text-blue-700 mt-1">3</div>
              <p>حاول الكتابة لمدة 15 دقيقة على الأقل يوميًا</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-200 p-1 rounded-full text-blue-700 mt-1">4</div>
              <p>راجع ما كتبت وحسّنه بعد الانتهاء من الكتابة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeWriting;