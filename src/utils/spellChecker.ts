import nspell from 'nspell';

interface SpellCheckerOptions {
  language: string;
  customDictionary?: string[];
}

class SpellChecker {
  private checker: any = null;
  private isLoading: boolean = false;
  private loadPromise: Promise<void> | null = null;
  private customWords: Set<string> = new Set();
  private language: string = 'en';

  constructor(options: SpellCheckerOptions = { language: 'en' }) {
    this.language = options.language;
    if (options.customDictionary) {
      options.customDictionary.forEach(word => this.customWords.add(word.toLowerCase()));
    }
  }

  async initialize(): Promise<void> {
    if (this.checker) return Promise.resolve();
    if (this.loadPromise) return this.loadPromise;

    this.isLoading = true;
    this.loadPromise = new Promise(async (resolve, reject) => {
      try {
        const [affData, dicData] = await Promise.all([
          fetch(`/dictionaries/${this.language}/index.aff`).then(r => r.text()),
          fetch(`/dictionaries/${this.language}/index.dic`).then(r => r.text())
        ]);

        this.checker = nspell(affData, dicData);
        
        // Add custom words to the dictionary
        this.customWords.forEach(word => {
          this.checker.add(word);
        });

        this.isLoading = false;
        resolve();
      } catch (error) {
        console.error('Failed to load dictionary files:', error);
        this.isLoading = false;
        reject(error);
      }
    });

    return this.loadPromise;
  }

  async isInitialized(): Promise<boolean> {
    return !!this.checker;
  }

  async checkWord(word: string): Promise<boolean> {
    if (!this.checker && !this.isLoading) {
      await this.initialize();
    }

    if (!this.checker) {
      console.warn('Spell checker not initialized yet');
      return true; // Assume correct if checker isn't ready
    }

    // Skip checking for empty strings, numbers, or very short words
    if (!word || word.length <= 1 || /^\d+$/.test(word)) {
      return true;
    }

    // Remove punctuation for checking
    const cleanWord = word.replace(/[.,!?;:'"()[\]{}]/g, '');
    
    // Skip if the word is now empty after cleaning
    if (!cleanWord) return true;

    return this.checker.correct(cleanWord);
  }

  async getSuggestions(word: string): Promise<string[]> {
    if (!this.checker && !this.isLoading) {
      await this.initialize();
    }

    if (!this.checker) {
      console.warn('Spell checker not initialized yet');
      return [];
    }

    // Remove punctuation for checking
    const cleanWord = word.replace(/[.,!?;:'"()[\]{}]/g, '');
    
    // Skip if the word is now empty after cleaning
    if (!cleanWord) return [];

    return this.checker.suggest(cleanWord);
  }

  async checkText(text: string): Promise<{
    misspelledWords: { word: string; index: number; suggestions: string[] }[];
    text: string;
  }> {
    if (!this.checker && !this.isLoading) {
      await this.initialize();
    }

    if (!this.checker) {
      console.warn('Spell checker not initialized yet');
      return { misspelledWords: [], text };
    }

    const words = text.split(/\s+/);
    const misspelledWords: { word: string; index: number; suggestions: string[] }[] = [];
    
    let currentIndex = 0;
    for (const word of words) {
      // Skip checking for empty strings, numbers, or very short words
      if (!word || word.length <= 1 || /^\d+$/.test(word)) {
        currentIndex += word.length + 1; // +1 for the space
        continue;
      }

      // Remove punctuation for checking
      const cleanWord = word.replace(/[.,!?;:'"()[\]{}]/g, '');
      
      // Skip if the word is now empty after cleaning
      if (!cleanWord) {
        currentIndex += word.length + 1;
        continue;
      }

      if (!this.checker.correct(cleanWord)) {
        const suggestions = this.checker.suggest(cleanWord);
        misspelledWords.push({
          word,
          index: currentIndex,
          suggestions: suggestions.slice(0, 5) // Limit to top 5 suggestions
        });
      }

      currentIndex += word.length + 1; // +1 for the space
    }

    return { misspelledWords, text };
  }

  addWord(word: string): void {
    if (this.checker) {
      this.checker.add(word);
    }
    this.customWords.add(word.toLowerCase());
  }
}

// Create a singleton instance
const spellChecker = new SpellChecker();

// Initialize in the background
spellChecker.initialize().catch(error => {
  console.warn('Failed to initialize spell checker:', error);
});

export default spellChecker;