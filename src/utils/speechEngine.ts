export interface VoiceConfig {
  name: string;
  lang: string;
  quality: 'premium' | 'high' | 'medium' | 'low';
  provider: 'Google' | 'Microsoft' | 'Apple' | 'System';
  gender: 'male' | 'female';
  accent: 'US' | 'UK' | 'AU' | 'CA';
}

export class EnhancedSpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private _isSupported = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    this._isSupported = typeof window !== 'undefined' && 
                      'speechSynthesis' in window && 
                      'SpeechSynthesisUtterance' in window;
    console.log('دعم نظام النطق:', this._isSupported ? 'متاح' : 'غير متاح');
  }

  private async initializeVoices(): Promise<void> {
    if (!this._isSupported) {
      console.warn('نظام النطق غير مدعوم في هذا المتصفح');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    // إذا كانت الأصوات محملة بالفعل
    if (this.isInitialized && this.voices.length > 0) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const loadVoices = () => {
        try {
          this.voices = window.speechSynthesis.getVoices();
          this.isInitialized = true;
          console.log('تم تحميل الأصوات:', this.voices.length, 'صوت متاح');
          
          if (this.voices.length === 0) {
            console.warn('تم تحميل قائمة أصوات فارغة');
          } else {
            console.log('الأصوات المتاحة:', this.voices.map(v => `${v.name} (${v.lang})`).join(', '));
          }
          
          resolve();
        } catch (error) {
          console.error('خطأ أثناء تحميل الأصوات:', error);
          reject(error);
        }
      };

      try {
        // محاولة تحميل فورية
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          this.voices = voices;
          this.isInitialized = true;
          console.log('تم تحميل الأصوات فوراً:', voices.length);
          resolve();
          return;
        }

        // انتظار تحميل الأصوات
        window.speechSynthesis.onvoiceschanged = loadVoices;
        
        // timeout احتياطي
        setTimeout(() => {
          if (!this.isInitialized) {
            console.log('تحميل الأصوات بالطريقة الاحتياطية');
            loadVoices();
          }
        }, 2000);
      } catch (error) {
        console.error('خطأ أثناء تهيئة الأصوات:', error);
        reject(error);
      }
    });
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    if (!this._isSupported) return null;
    
    if (this.voices.length === 0) {
      console.warn('لا توجد أصوات متاحة');
      return null;
    }

    // البحث عن أفضل صوت إنجليزي
    const englishVoices = this.voices.filter(voice => 
      voice.lang.toLowerCase().includes('en') || 
      voice.lang.toLowerCase().includes('english')
    );

    if (englishVoices.length === 0) {
      console.warn('لا توجد أصوات إنجليزية، استخدام الصوت الافتراضي');
      return this.voices[0];
    }

    // ترتيب الأولوية للأصوات
    const voicePriority = [
      // Google Voices (أفضل جودة)
      { pattern: /google.*us.*female/i, score: 100 },
      { pattern: /google.*uk.*female/i, score: 95 },
      { pattern: /google.*us.*male/i, score: 90 },
      { pattern: /google.*uk.*male/i, score: 85 },
      
      // Microsoft Voices
      { pattern: /microsoft.*zira/i, score: 80 },
      { pattern: /microsoft.*hazel/i, score: 75 },
      { pattern: /microsoft.*david/i, score: 70 },
      
      // Apple Voices
      { pattern: /samantha/i, score: 65 },
      { pattern: /alex/i, score: 60 },
      { pattern: /karen/i, score: 55 },
      
      // أصوات عامة
      { pattern: /.*en-us.*female/i, score: 50 },
      { pattern: /.*en-gb.*female/i, score: 45 },
      { pattern: /.*en-us.*male/i, score: 40 },
      { pattern: /.*en-gb.*male/i, score: 35 },
      { pattern: /.*en-us/i, score: 30 },
      { pattern: /.*en-gb/i, score: 25 },
      { pattern: /.*en/i, score: 20 }
    ];

    let bestVoice: SpeechSynthesisVoice | null = null;
    let bestScore = 0;

    englishVoices.forEach(voice => {
      const voiceInfo = `${voice.name} ${voice.lang}`.toLowerCase();
      
      for (const priority of voicePriority) {
        if (priority.pattern.test(voiceInfo) && priority.score > bestScore) {
          bestVoice = voice;
          bestScore = priority.score;
          break;
        }
      }
    });

    const selectedVoice = bestVoice || englishVoices[0];
    console.log('تم اختيار الصوت:', selectedVoice?.name, selectedVoice?.lang);
    return selectedVoice;
  }

  public async speak(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    slow?: boolean;
    emphasis?: boolean;
  } = {}): Promise<void> {
    if (!this._isSupported) {
      console.error('نظام النطق غير مدعوم في هذا المتصفح');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    if (!this.isInitialized) {
      try {
        console.log('تهيئة نظام النطق...');
        await this.initializeVoices();
      } catch (error) {
        console.error('فشل في تهيئة نظام النطق:', error);
        return Promise.reject(error);
      }
    }

    // إيقاف أي صوت حالي
    this.stop();
    
    // انتظار قصير للتأكد من الإيقاف
    await new Promise(resolve => setTimeout(resolve, 100));

    const bestVoice = this.getBestVoice();
    if (!bestVoice) {
      console.error('لم يتم العثور على صوت مناسب');
      return Promise.reject(new Error('No suitable voice found'));
    }

    const textToSpeak = text.trim();
    console.log(`نطق النص: "${textToSpeak}" باستخدام الصوت: ${bestVoice.name}`);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.voice = bestVoice;
    utterance.lang = bestVoice.lang || 'en-US';
    
    // إعدادات محسنة للوضوح
    utterance.rate = options.slow ? 0.7 : (options.rate || 0.85);
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    this.currentUtterance = utterance;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.warn('انتهت مهلة النطق');
        this.stop();
        reject(new Error('Speech timeout'));
      }, 120000); // Increased timeout to 120 seconds

      utterance.onstart = () => {
        console.log('بدأ النطق');
      };

      utterance.onend = () => {
        console.log('انتهى النطق بنجاح');
        clearTimeout(timeout);
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        clearTimeout(timeout);
        this.currentUtterance = null;
        
        if (event.error === 'interrupted' || event.error === 'canceled') {
          console.log('تم مقاطعة النطق:', event.error);
          resolve(); // اعتبار المقاطعة كعملية ناجحة
        } else {
          console.error('خطأ في النطق:', event.error);
          reject(new Error(`Speech error: ${event.error}`));
        }
      };

      try {
        // تشغيل الصوت
        window.speechSynthesis.speak(utterance);
        
        // حل مشكلة Chrome - التأكد من التشغيل
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            console.log('استئناف النطق المتوقف');
            window.speechSynthesis.resume();
          }
        }, 100);
        
        // فحص دوري للتأكد من التشغيل
        const checkInterval = setInterval(() => {
          if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
            clearInterval(checkInterval);
            if (this.currentUtterance === utterance) {
              console.log('انتهى النطق (فحص دوري)');
              clearTimeout(timeout);
              this.currentUtterance = null;
              resolve();
            }
          }
        }, 500);
        
      } catch (error) {
        clearTimeout(timeout);
        this.currentUtterance = null;
        console.error('خطأ في تشغيل النطق:', error);
        reject(error);
      }
    });
  }

  public stop(): void {
    if (!this._isSupported) return;
    
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      this.currentUtterance = null;
    } catch (error) {
      console.error('خطأ أثناء إيقاف النطق:', error);
    }
  }

  public pause(): void {
    if (!this._isSupported) return;
    
    try {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
      }
    } catch (error) {
      console.error('خطأ أثناء إيقاف مؤقت للنطق:', error);
    }
  }

  public resume(): void {
    if (!this._isSupported) return;
    
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (error) {
      console.error('خطأ أثناء استئناف النطق:', error);
    }
  }

  public isPlaying(): boolean {
    if (!this._isSupported) return false;
    return window.speechSynthesis.speaking;
  }

  public isPaused(): boolean {
    if (!this._isSupported) return false;
    return window.speechSynthesis.paused;
  }

  public isSupported(): boolean {
    return this._isSupported;
  }

  public getBestVoiceInfo(): VoiceConfig | null {
    const bestVoice = this.getBestVoice();
    if (!bestVoice) return null;

    const name = bestVoice.name.toLowerCase();
    let provider: VoiceConfig['provider'] = 'System';
    let quality: VoiceConfig['quality'] = 'medium';
    let gender: VoiceConfig['gender'] = 'female';
    let accent: VoiceConfig['accent'] = 'US';

    if (name.includes('google')) {
      provider = 'Google';
      quality = 'premium';
    } else if (name.includes('microsoft')) {
      provider = 'Microsoft';
      quality = 'high';
    } else if (name.includes('apple')) {
      provider = 'Apple';
      quality = 'high';
    }

    if (name.includes('male') || name.includes('david') || name.includes('alex')) {
      gender = 'male';
    }

    if (bestVoice.lang.includes('gb') || name.includes('uk')) {
      accent = 'UK';
    } else if (bestVoice.lang.includes('au')) {
      accent = 'AU';
    } else if (bestVoice.lang.includes('ca')) {
      accent = 'CA';
    }

    return {
      name: bestVoice.name,
      lang: bestVoice.lang,
      quality,
      provider,
      gender,
      accent
    };
  }

  public async initialize(): Promise<void> {
    if (!this._isSupported) {
      console.warn('نظام النطق غير مدعوم في هذا المتصفح');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    try {
      await this.initializeVoices();
      
      // تشغيل صوت صامت لتفعيل النظام (مطلوب في بعض المتصفحات)
      try {
        const silentUtterance = new SpeechSynthesisUtterance(' ');
        silentUtterance.volume = 0.01;
        silentUtterance.rate = 10;
        window.speechSynthesis.speak(silentUtterance);
        
        // إيقاف الصوت الصامت بعد فترة قصيرة
        setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
        }, 100);
      } catch (e) {
        console.warn('فشل في تشغيل الصوت الصامت للتهيئة:', e);
      }
      
      console.log('تم تهيئة نظام النطق بنجاح');
      return Promise.resolve();
    } catch (error) {
      console.error('فشل في تهيئة نظام النطق:', error);
      return Promise.reject(error);
    }
  }

  // دالة للاختبار السريع
  public async testSpeech(): Promise<boolean> {
    if (!this._isSupported) {
      return false;
    }
    
    try {
      await this.speak('Test', { volume: 0.1, rate: 2 });
      return true;
    } catch (error) {
      console.error('فشل اختبار النطق:', error);
      return false;
    }
  }
}

// إنشاء instance واحد للاستخدام العام
export const speechEngine = new EnhancedSpeechEngine();