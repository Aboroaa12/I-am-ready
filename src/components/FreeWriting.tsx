import React, { useState, useEffect, useRef } from 'react';
import { Save, Trash2, Clock, FileText, Download, Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import spellChecker from '../utils/spellChecker';

interface FreeWritingProps {
  onScore?: (points: number) => void;
  onSave?: (text: string) => void;
}

const FreeWriting: React.FC<FreeWritingProps> = ({ onScore, onSave }) => {
  const [text, setText] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [savedText, setSavedText] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState<boolean>(false);
  const [spellingErrors, setSpellingErrors] = useState<{word: string, suggestions: string[]}[]>([]);
  const [isSpellChecking, setIsSpellChecking] = useState<boolean>(false);
  const [spellCheckerReady, setSpellCheckerReady] = useState<boolean>(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);

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
    
    // If spell check is enabled, check spelling after a short delay
    if (spellCheckEnabled) {
      // Debounce spell checking to avoid performance issues
      const debounceTimeout = setTimeout(() => {
        checkSpelling(e.target.value);
      }, 1000);
      
      return () => clearTimeout(debounceTimeout);
    }
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
      setSpellingErrors(misspelledWords.map(item => ({
        word: item.word,
        suggestions: item.suggestions
      })));
    } catch (error) {
      console.error('Error checking spelling:', error);
    } finally {
      setIsSpellChecking(false);
    }
  };

  // Clear text
  const handleClear = () => {
    if (text.trim() && !window.confirm('هل أنت متأكد من رغبتك في مسح النص؟')) {
      return;
    }
    
    setText('');
    setSpellingErrors([]);
    
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
          
          <label className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>استيراد</span>
            <input 
              type="file" 
              accept=".txt" 
              className="hidden" 
              onChange={handleImport}
            />
          </label>
        </div>

        {/* Spell Check Toggle */}
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
                      {error.suggestions.length > 0 && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-600">اقتراحات: </span>
                          {error.suggestions.slice(0, 3).map((suggestion, i) => (
                            <span 
                              key={i} 
                              className="bg-white px-2 py-1 rounded border border-gray-300 text-blue-600 cursor-pointer hover:bg-blue-50 mr-1"
                              onClick={() => {
                                const newText = text.replace(new RegExp(`\\b${error.word}\\b`, 'g'), suggestion);
                                setText(newText);
                              }}
                            >
                              {suggestion}
                            </span>
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
            <FileText className="w-5 h-5" />
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