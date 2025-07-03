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
  private properNouns: Set<string> = new Set([
    'oman', 'omani', 'jabal', 'muscat', 'dubai', 'abu dhabi', 'saudi', 'qatar', 'kuwait', 'bahrain', 
    'uae', 'emirates', 'middle east', 'asia', 'africa', 'europe', 'america', 'australia',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
  ]);
  
  // Common words that should always be considered correct
  private commonWords: Set<string> = new Set([
    'an', 'a', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must', 'am', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its',
    'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'this', 'that',
    'these', 'those', 'who', 'whom', 'whose', 'which', 'what', 'where', 'when',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'many', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'but', 'and', 'or', 'if', 'else', 'for', 'as', 'by', 'to', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'guy', 'man', 'woman', 'person', 'people', 'friend', 'friends', 'family', 'found',
    'saw', 'met', 'went', 'came', 'said', 'told', 'asked', 'gave', 'took', 'made',
    'knew', 'thought', 'felt', 'wanted', 'needed', 'liked', 'loved', 'hated', 'saw',
    'heard', 'found', 'got', 'put', 'took', 'brought', 'came', 'went', 'left', 'stayed',
    'lived', 'worked', 'played', 'studied', 'learned', 'taught', 'helped', 'tried',
    'called', 'answered', 'asked', 'said', 'told', 'spoke', 'talked', 'wrote', 'read',
    'friendly', 'nice', 'kind', 'good', 'bad', 'happy', 'sad', 'angry', 'excited',
    'tired', 'hungry', 'thirsty', 'hot', 'cold', 'big', 'small', 'tall', 'short',
    'long', 'wide', 'high', 'low', 'new', 'old', 'young', 'beautiful', 'pretty',
    'handsome', 'ugly', 'clean', 'dirty', 'easy', 'difficult', 'hard', 'simple',
    'complex', 'important', 'necessary', 'possible', 'impossible', 'right', 'wrong',
    'true', 'false', 'correct', 'incorrect', 'same', 'different', 'similar', 'various',
    'several', 'few', 'many', 'much', 'more', 'most', 'less', 'least', 'other', 'another',
    'next', 'last', 'first', 'second', 'third', 'fourth', 'fifth', 'final', 'early', 'late',
    'soon', 'now', 'then', 'today', 'tomorrow', 'yesterday', 'tonight', 'day', 'night',
    'morning', 'afternoon', 'evening', 'week', 'month', 'year', 'time', 'date', 'moment',
    'second', 'minute', 'hour', 'always', 'never', 'sometimes', 'often', 'rarely', 'usually',
    'normally', 'generally', 'occasionally', 'frequently', 'seldom', 'ever', 'already', 'yet',
    'still', 'almost', 'nearly', 'quite', 'rather', 'somewhat', 'enough', 'too', 'very',
    'extremely', 'really', 'actually', 'certainly', 'definitely', 'probably', 'possibly',
    'perhaps', 'maybe', 'indeed', 'absolutely', 'completely', 'totally', 'entirely',
    'fully', 'quite', 'rather', 'somewhat', 'slightly', 'hardly', 'scarcely', 'barely',
    'just', 'only', 'even', 'also', 'too', 'either', 'neither', 'both', 'all', 'any',
    'some', 'few', 'little', 'much', 'many', 'lot', 'plenty', 'several', 'few', 'most',
    'none', 'no', 'every', 'each', 'either', 'neither', 'both', 'all', 'any', 'some',
    'few', 'little', 'much', 'many', 'lot', 'plenty', 'several', 'few', 'most', 'none',
    'no', 'every', 'each', 'either', 'neither', 'both', 'all', 'any', 'some', 'few',
    'little', 'much', 'many', 'lot', 'plenty', 'several', 'few', 'most', 'none', 'no',
    'every', 'each', 'either', 'neither', 'both', 'all', 'any', 'some', 'few', 'little',
    'much', 'many', 'lot', 'plenty', 'several', 'few', 'most', 'none', 'no', 'every',
    'each', 'either', 'neither', 'both', 'all', 'any', 'some', 'few', 'little', 'much',
    'many', 'lot', 'plenty', 'several', 'few', 'most', 'none', 'no', 'every', 'each',
    'so', 'who', 'whom', 'whose', 'which', 'what', 'where', 'when', 'why', 'how'
  ]);

  constructor(options: SpellCheckerOptions = { language: 'en' }) {
    this.language = options.language;
    if (options.customDictionary) {
      options.customDictionary.forEach(word => this.customWords.add(word.toLowerCase()));
    }
    
    // Add common place names and proper nouns
    this.properNouns.forEach(word => this.customWords.add(word.toLowerCase()));
    
    // Add common words
    this.commonWords.forEach(word => this.customWords.add(word.toLowerCase()));
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
    
    // Skip checking for proper nouns (capitalized words)
    if (word.charAt(0) === word.charAt(0).toUpperCase() && word.length > 1) {
      return true;
    }
    
    // Skip checking for words in our custom proper nouns list
    if (this.properNouns.has(word.toLowerCase())) {
      return true;
    }
    
    // Skip checking for common words
    if (this.commonWords.has(word.toLowerCase())) {
      return true;
    }

    // Remove punctuation for checking
    const cleanWord = word.replace(/[.,!?;:'"()[\]{}]/g, '');
    
    // Skip if the word is now empty after cleaning
    if (!cleanWord) return true;
    
    // Special case for plural forms
    if (cleanWord.endsWith('s') && this.checker.correct(cleanWord.slice(0, -1))) {
      return true;
    }

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
    
    // Skip suggestions for proper nouns
    if (word.charAt(0) === word.charAt(0).toUpperCase() && word.length > 1) {
      return [];
    }
    
    // Skip suggestions for words in our custom proper nouns list
    if (this.properNouns.has(word.toLowerCase())) {
      return [];
    }
    
    // Skip suggestions for common words
    if (this.commonWords.has(word.toLowerCase())) {
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
      
      // Skip checking for proper nouns (capitalized words)
      if (word.charAt(0) === word.charAt(0).toUpperCase() && word.length > 1) {
        currentIndex += word.length + 1;
        continue;
      }
      
      // Skip checking for words in our custom proper nouns list
      if (this.properNouns.has(word.toLowerCase())) {
        currentIndex += word.length + 1;
        continue;
      }
      
      // Skip checking for common words
      if (this.commonWords.has(word.toLowerCase())) {
        currentIndex += word.length + 1;
        continue;
      }

      // Remove punctuation for checking
      const cleanWord = word.replace(/[.,!?;:'"()[\]{}]/g, '');
      
      // Skip if the word is now empty after cleaning
      if (!cleanWord) {
        currentIndex += word.length + 1;
        continue;
      }
      
      // Special case for plural forms
      if (cleanWord.endsWith('s') && this.checker.correct(cleanWord.slice(0, -1))) {
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
  
  addProperNoun(word: string): void {
    this.properNouns.add(word.toLowerCase());
    if (this.checker) {
      this.checker.add(word.toLowerCase());
    }
  }
  
  addCommonWord(word: string): void {
    this.commonWords.add(word.toLowerCase());
    if (this.checker) {
      this.checker.add(word.toLowerCase());
    }
  }
}

// Create a singleton instance
const spellChecker = new SpellChecker();

// Initialize in the background
spellChecker.initialize().catch(error => {
  console.warn('Failed to initialize spell checker:', error);
});

// Add common place names and geographical terms
const commonPlaceNames = [
  'oman', 'omani', 'jabal', 'muscat', 'dubai', 'abu dhabi', 'saudi', 'qatar', 'kuwait', 'bahrain', 
  'uae', 'emirates', 'middle east', 'asia', 'africa', 'europe', 'america', 'australia',
  'alakhdar', 'akhdar', 'salalah', 'nizwa', 'sohar', 'sur', 'ibri', 'buraimi',
  'london', 'paris', 'tokyo', 'new york', 'cairo', 'riyadh', 'jeddah', 'mecca', 'medina'
];

commonPlaceNames.forEach(place => {
  spellChecker.addProperNoun(place);
});

export default spellChecker;