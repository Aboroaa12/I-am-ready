import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 10 Vocabulary - Based on the curriculum
export const grade10Vocabulary: VocabularyWord[] = [
  // Unit 1: Future Aspirations
  { english: "aspiration", arabic: "طموح", unit: "Future Aspirations", pronunciation: "/ˌæspəˈreɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "She has aspirations to become a doctor." },
  { english: "ambition", arabic: "طموح", unit: "Future Aspirations", pronunciation: "/æmˈbɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "His ambition is to start his own business." },
  { english: "goal", arabic: "هدف", unit: "Future Aspirations", pronunciation: "/ɡəʊl/", grade: 10, partOfSpeech: "noun", exampleSentence: "Setting clear goals helps you achieve success." },
  { english: "achievement", arabic: "إنجاز", unit: "Future Aspirations", pronunciation: "/əˈtʃiːvmənt/", grade: 10, partOfSpeech: "noun", exampleSentence: "Graduating from university was a significant achievement." },
  { english: "determination", arabic: "عزيمة", unit: "Future Aspirations", pronunciation: "/dɪˌtɜːmɪˈneɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Success requires hard work and determination." },
  { english: "perseverance", arabic: "مثابرة", unit: "Future Aspirations", pronunciation: "/ˌpɜːsɪˈvɪərəns/", grade: 10, partOfSpeech: "noun", exampleSentence: "Perseverance is essential when facing challenges." },
  { english: "opportunity", arabic: "فرصة", unit: "Future Aspirations", pronunciation: "/ˌɒpəˈtjuːnəti/", grade: 10, partOfSpeech: "noun", exampleSentence: "Education provides opportunities for a better future." },
  { english: "potential", arabic: "إمكانية", unit: "Future Aspirations", pronunciation: "/pəˈtenʃl/", grade: 10, partOfSpeech: "noun", exampleSentence: "The teacher saw great potential in her students." },
  
  // Unit 2: Science and Discovery
  { english: "discovery", arabic: "اكتشاف", unit: "Science and Discovery", pronunciation: "/dɪˈskʌvəri/", grade: 10, partOfSpeech: "noun", exampleSentence: "The discovery of penicillin changed medicine forever." },
  { english: "research", arabic: "بحث", unit: "Science and Discovery", pronunciation: "/rɪˈsɜːtʃ/", grade: 10, partOfSpeech: "noun", exampleSentence: "Scientific research is essential for progress." },
  { english: "experiment", arabic: "تجربة", unit: "Science and Discovery", pronunciation: "/ɪkˈsperɪmənt/", grade: 10, partOfSpeech: "noun", exampleSentence: "The students conducted an experiment in the laboratory." },
  { english: "hypothesis", arabic: "فرضية", unit: "Science and Discovery", pronunciation: "/haɪˈpɒθəsɪs/", grade: 10, partOfSpeech: "noun", exampleSentence: "A scientist develops a hypothesis before testing it." },
  { english: "innovation", arabic: "ابتكار", unit: "Science and Discovery", pronunciation: "/ˌɪnəˈveɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Technological innovation has transformed our lives." },
  { english: "breakthrough", arabic: "اختراق", unit: "Science and Discovery", pronunciation: "/ˈbreɪkθruː/", grade: 10, partOfSpeech: "noun", exampleSentence: "The team made a breakthrough in cancer research." },
  { english: "analyze", arabic: "يحلل", unit: "Science and Discovery", pronunciation: "/ˈænəlaɪz/", grade: 10, partOfSpeech: "verb", exampleSentence: "Scientists analyze data to draw conclusions." },
  { english: "theory", arabic: "نظرية", unit: "Science and Discovery", pronunciation: "/ˈθɪəri/", grade: 10, partOfSpeech: "noun", exampleSentence: "Einstein's theory of relativity revolutionized physics." },
  
  // Unit 3: Media and Communication
  { english: "media", arabic: "وسائل الإعلام", unit: "Media and Communication", pronunciation: "/ˈmiːdiə/", grade: 10, partOfSpeech: "noun", exampleSentence: "Social media has changed how we communicate." },
  { english: "communication", arabic: "تواصل", unit: "Media and Communication", pronunciation: "/kəˌmjuːnɪˈkeɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Effective communication is key to success." },
  { english: "journalism", arabic: "صحافة", unit: "Media and Communication", pronunciation: "/ˈdʒɜːnəlɪzəm/", grade: 10, partOfSpeech: "noun", exampleSentence: "She studied journalism at university." },
  { english: "broadcast", arabic: "بث", unit: "Media and Communication", pronunciation: "/ˈbrɔːdkɑːst/", grade: 10, partOfSpeech: "noun", exampleSentence: "The broadcast reached millions of viewers." },
  { english: "advertisement", arabic: "إعلان", unit: "Media and Communication", pronunciation: "/ədˈvɜːtɪsmənt/", grade: 10, partOfSpeech: "noun", exampleSentence: "The company launched a new advertisement campaign." },
  { english: "influence", arabic: "تأثير", unit: "Media and Communication", pronunciation: "/ˈɪnfluəns/", grade: 10, partOfSpeech: "noun", exampleSentence: "The media has a significant influence on public opinion." },
  { english: "audience", arabic: "جمهور", unit: "Media and Communication", pronunciation: "/ˈɔːdiəns/", grade: 10, partOfSpeech: "noun", exampleSentence: "The show attracted a large audience." },
  { english: "publish", arabic: "ينشر", unit: "Media and Communication", pronunciation: "/ˈpʌblɪʃ/", grade: 10, partOfSpeech: "verb", exampleSentence: "The newspaper will publish the article tomorrow." },
  
  // Unit 4: Global Challenges
  { english: "challenge", arabic: "تحدي", unit: "Global Challenges", pronunciation: "/ˈtʃælɪndʒ/", grade: 10, partOfSpeech: "noun", exampleSentence: "Climate change is one of the biggest challenges we face." },
  { english: "poverty", arabic: "فقر", unit: "Global Challenges", pronunciation: "/ˈpɒvəti/", grade: 10, partOfSpeech: "noun", exampleSentence: "Many organizations work to reduce poverty worldwide." },
  { english: "inequality", arabic: "عدم مساواة", unit: "Global Challenges", pronunciation: "/ˌɪnɪˈkwɒləti/", grade: 10, partOfSpeech: "noun", exampleSentence: "Social inequality remains a problem in many countries." },
  { english: "climate change", arabic: "تغير المناخ", unit: "Global Challenges", pronunciation: "/ˈklaɪmət tʃeɪndʒ/", grade: 10, partOfSpeech: "noun", exampleSentence: "We need to take action against climate change." },
  { english: "solution", arabic: "حل", unit: "Global Challenges", pronunciation: "/səˈluːʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Finding solutions to global problems requires cooperation." },
  { english: "crisis", arabic: "أزمة", unit: "Global Challenges", pronunciation: "/ˈkraɪsɪs/", grade: 10, partOfSpeech: "noun", exampleSentence: "The country is facing an economic crisis." },
  { english: "awareness", arabic: "وعي", unit: "Global Challenges", pronunciation: "/əˈweənəs/", grade: 10, partOfSpeech: "noun", exampleSentence: "Raising awareness about environmental issues is important." },
  { english: "impact", arabic: "تأثير", unit: "Global Challenges", pronunciation: "/ˈɪmpækt/", grade: 10, partOfSpeech: "noun", exampleSentence: "Human activities have a significant impact on the environment." },
  
  // Unit 5: Arts and Culture
  { english: "culture", arabic: "ثقافة", unit: "Arts and Culture", pronunciation: "/ˈkʌltʃə/", grade: 10, partOfSpeech: "noun", exampleSentence: "Different countries have different cultures." },
  { english: "heritage", arabic: "تراث", unit: "Arts and Culture", pronunciation: "/ˈherɪtɪdʒ/", grade: 10, partOfSpeech: "noun", exampleSentence: "We should preserve our cultural heritage." },
  { english: "tradition", arabic: "تقليد", unit: "Arts and Culture", pronunciation: "/trəˈdɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "This festival is an important tradition in our country." },
  { english: "exhibition", arabic: "معرض", unit: "Arts and Culture", pronunciation: "/ˌeksɪˈbɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "The art exhibition attracted many visitors." },
  { english: "masterpiece", arabic: "تحفة فنية", unit: "Arts and Culture", pronunciation: "/ˈmɑːstəpiːs/", grade: 10, partOfSpeech: "noun", exampleSentence: "The Mona Lisa is considered a masterpiece." },
  { english: "creativity", arabic: "إبداع", unit: "Arts and Culture", pronunciation: "/ˌkriːeɪˈtɪvəti/", grade: 10, partOfSpeech: "noun", exampleSentence: "Art classes encourage creativity in students." },
  { english: "architecture", arabic: "هندسة معمارية", unit: "Arts and Culture", pronunciation: "/ˈɑːkɪtektʃə/", grade: 10, partOfSpeech: "noun", exampleSentence: "Islamic architecture is known for its beautiful designs." },
  { english: "preserve", arabic: "يحافظ", unit: "Arts and Culture", pronunciation: "/prɪˈzɜːv/", grade: 10, partOfSpeech: "verb", exampleSentence: "It's important to preserve historical buildings." }
];

// Grade 10 Grammar Rules
export const grade10Grammar: GrammarRule[] = [
  {
    title: "Future Perfect and Future Continuous",
    explanation: "نستخدم المستقبل التام للتعبير عن حدث سيكتمل قبل وقت محدد في المستقبل، ونستخدم المستقبل المستمر للتعبير عن حدث سيكون مستمراً في وقت محدد في المستقبل.",
    examples: [
      "By this time next year, I will have graduated from university. (Future Perfect)",
      "This time tomorrow, I will be flying to London. (Future Continuous)",
      "By 2030, scientists will have found a cure for many diseases. (Future Perfect)",
      "At 8 PM tonight, we will be watching the football match. (Future Continuous)"
    ],
    unit: "Future Aspirations",
    grade: 10
  },
  {
    title: "Passive Voice with Different Tenses",
    explanation: "يمكن استخدام المبني للمجهول مع أزمنة مختلفة للتركيز على الحدث بدلاً من الفاعل.",
    examples: [
      "Present: The experiment is conducted by scientists. (الحاضر)",
      "Past: The discovery was made last year. (الماضي)",
      "Present Perfect: The theory has been challenged by new evidence. (المضارع التام)",
      "Future: The results will be published next month. (المستقبل)",
      "Modal: The problem can be solved with this approach. (الأفعال المساعدة)"
    ],
    unit: "Science and Discovery",
    grade: 10
  },
  {
    title: "Relative Clauses (Defining and Non-defining)",
    explanation: "نستخدم جمل الوصل لإعطاء معلومات إضافية عن الاسم. الجمل الوصفية المحددة تعطي معلومات ضرورية، بينما الجمل الوصفية غير المحددة تعطي معلومات إضافية غير ضرورية.",
    examples: [
      "The woman who lives next door is a doctor. (Defining - محددة)",
      "My brother, who lives in London, is visiting next week. (Non-defining - غير محددة)",
      "The book that I bought yesterday is very interesting. (Defining - محددة)",
      "Paris, which is the capital of France, is famous for its architecture. (Non-defining - غير محددة)"
    ],
    unit: "Media and Communication",
    grade: 10
  },
  {
    title: "Mixed Conditionals",
    explanation: "نستخدم الجمل الشرطية المختلطة عندما يكون الشرط في زمن والنتيجة في زمن آخر.",
    examples: [
      "If I had studied medicine (past), I would be a doctor now (present).",
      "If I were rich (present), I would have traveled around the world (past).",
      "If we hadn't polluted the environment (past), we wouldn't be facing climate change now (present).",
      "If I spoke French (present), I would have applied for that job (past)."
    ],
    unit: "Global Challenges",
    grade: 10
  },
  {
    title: "Modals of Deduction (Present and Past)",
    explanation: "نستخدم الأفعال المساعدة للتعبير عن الاستنتاج أو التخمين في الحاضر والماضي.",
    examples: [
      "Present: He must be tired. (لابد أنه متعب - تأكيد قوي)",
      "Present: She might be at home. (ربما تكون في المنزل - احتمال)",
      "Past: They must have missed the train. (لابد أنهم فاتتهم القطار - تأكيد قوي عن الماضي)",
      "Past: He can't have forgotten the meeting. (لا يمكن أن يكون قد نسي الاجتماع - نفي قوي)"
    ],
    unit: "Arts and Culture",
    grade: 10
  }
];

// Grade 10 Quiz Questions
export const grade10Questions: QuizQuestion[] = [
  {
    question: "By this time next year, I _____ my studies.",
    options: ["will complete", "will be completing", "will have completed", "complete"],
    correct: 2,
    explanation: "نستخدم المستقبل التام (will have completed) للتعبير عن حدث سيكتمل قبل وقت محدد في المستقبل",
    unit: "Future Aspirations",
    grade: 10
  },
  {
    question: "At 8 PM tomorrow, we _____ to the conference.",
    options: ["will drive", "will be driving", "will have driven", "drive"],
    correct: 1,
    explanation: "نستخدم المستقبل المستمر (will be driving) للتعبير عن حدث سيكون مستمراً في وقت محدد في المستقبل",
    unit: "Future Aspirations",
    grade: 10
  },
  {
    question: "The new vaccine _____ by scientists last month.",
    options: ["is developed", "was developed", "has developed", "develops"],
    correct: 1,
    explanation: "نستخدم المبني للمجهول في الماضي البسيط (was developed) للتعبير عن حدث تم في الماضي",
    unit: "Science and Discovery",
    grade: 10
  },
  {
    question: "The results of the experiment _____ in the next issue of the journal.",
    options: ["will publish", "will be publishing", "will be published", "are published"],
    correct: 2,
    explanation: "نستخدم المبني للمجهول في المستقبل البسيط (will be published) للتعبير عن حدث سيتم في المستقبل",
    unit: "Science and Discovery",
    grade: 10
  },
  {
    question: "The woman _____ won the Nobel Prize is my professor.",
    options: ["who", "which", "whose", "whom"],
    correct: 0,
    explanation: "نستخدم 'who' في جملة الوصل المحددة عندما نشير إلى شخص",
    unit: "Media and Communication",
    grade: 10
  },
  {
    question: "My hometown, _____ is in the south, is famous for its beaches.",
    options: ["that", "who", "which", "where"],
    correct: 2,
    explanation: "نستخدم 'which' في جملة الوصل غير المحددة عندما نشير إلى مكان أو شيء",
    unit: "Media and Communication",
    grade: 10
  },
  {
    question: "If I had known about the problem earlier, I _____ it by now.",
    options: ["would solve", "would have solved", "will solve", "solved"],
    correct: 1,
    explanation: "نستخدم 'would have solved' في الجملة الشرطية الثالثة للتعبير عن نتيجة في الماضي لشرط لم يتحقق",
    unit: "Global Challenges",
    grade: 10
  },
  {
    question: "If we _____ more sustainable energy sources, we wouldn't be facing such severe climate change now.",
    options: ["use", "used", "had used", "would use"],
    correct: 2,
    explanation: "نستخدم 'had used' في الجملة الشرطية المختلطة للتعبير عن شرط في الماضي ونتيجة في الحاضر",
    unit: "Global Challenges",
    grade: 10
  },
  {
    question: "She _____ be at home. Her car is outside.",
    options: ["must", "might", "can't", "should"],
    correct: 0,
    explanation: "نستخدم 'must' للتعبير عن استنتاج قوي في الحاضر",
    unit: "Arts and Culture",
    grade: 10
  },
  {
    question: "He _____ the message. He just replied to it.",
    options: ["must have received", "might have received", "can't have received", "should have received"],
    correct: 0,
    explanation: "نستخدم 'must have received' للتعبير عن استنتاج قوي في الماضي",
    unit: "Arts and Culture",
    grade: 10
  }
];