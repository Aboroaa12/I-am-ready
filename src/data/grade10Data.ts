import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 10 Vocabulary - Complete curriculum with all units
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
  
  // Unit 2: Technology and Innovation
  { english: "technology", arabic: "تكنولوجيا", unit: "Technology and Innovation", pronunciation: "/tekˈnɒlədʒi/", grade: 10, partOfSpeech: "noun", exampleSentence: "Technology has changed our daily lives." },
  { english: "innovation", arabic: "ابتكار", unit: "Technology and Innovation", pronunciation: "/ˌɪnəˈveɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Innovation drives economic growth." },
  { english: "artificial intelligence", arabic: "ذكاء اصطناعي", unit: "Technology and Innovation", pronunciation: "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", grade: 10, partOfSpeech: "noun", exampleSentence: "Artificial intelligence is transforming industries." },
  { english: "robotics", arabic: "علم الروبوتات", unit: "Technology and Innovation", pronunciation: "/rəʊˈbɒtɪks/", grade: 10, partOfSpeech: "noun", exampleSentence: "Robotics is an exciting field of study." },
  { english: "automation", arabic: "أتمتة", unit: "Technology and Innovation", pronunciation: "/ˌɔːtəˈmeɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Automation has improved efficiency in factories." },
  { english: "digital", arabic: "رقمي", unit: "Technology and Innovation", pronunciation: "/ˈdɪdʒɪtl/", grade: 10, partOfSpeech: "adjective", exampleSentence: "We live in a digital age." },
  { english: "software", arabic: "برمجيات", unit: "Technology and Innovation", pronunciation: "/ˈsɒftweə/", grade: 10, partOfSpeech: "noun", exampleSentence: "The software helps us organize our work." },
  { english: "hardware", arabic: "أجهزة", unit: "Technology and Innovation", pronunciation: "/ˈhɑːdweə/", grade: 10, partOfSpeech: "noun", exampleSentence: "Computer hardware includes the processor and memory." },

  // Unit 3: Environmental Issues
  { english: "environment", arabic: "بيئة", unit: "Environmental Issues", pronunciation: "/ɪnˈvaɪrənmənt/", grade: 10, partOfSpeech: "noun", exampleSentence: "We must protect our environment." },
  { english: "pollution", arabic: "تلوث", unit: "Environmental Issues", pronunciation: "/pəˈluːʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Air pollution is a serious problem." },
  { english: "climate change", arabic: "تغير المناخ", unit: "Environmental Issues", pronunciation: "/ˈklaɪmət tʃeɪndʒ/", grade: 10, partOfSpeech: "noun", exampleSentence: "Climate change affects the whole planet." },
  { english: "renewable energy", arabic: "طاقة متجددة", unit: "Environmental Issues", pronunciation: "/rɪˈnjuːəbl ˈenədʒi/", grade: 10, partOfSpeech: "noun", exampleSentence: "Solar power is a type of renewable energy." },
  { english: "sustainability", arabic: "استدامة", unit: "Environmental Issues", pronunciation: "/səˌsteɪnəˈbɪləti/", grade: 10, partOfSpeech: "noun", exampleSentence: "Sustainability is important for future generations." },
  { english: "recycling", arabic: "إعادة التدوير", unit: "Environmental Issues", pronunciation: "/riːˈsaɪklɪŋ/", grade: 10, partOfSpeech: "noun", exampleSentence: "Recycling helps reduce waste." },
  { english: "conservation", arabic: "حفظ", unit: "Environmental Issues", pronunciation: "/ˌkɒnsəˈveɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Wildlife conservation is essential." },
  { english: "ecosystem", arabic: "نظام بيئي", unit: "Environmental Issues", pronunciation: "/ˈiːkəʊsɪstəm/", grade: 10, partOfSpeech: "noun", exampleSentence: "The forest ecosystem is very complex." },

  // Unit 4: Health and Lifestyle
  { english: "lifestyle", arabic: "نمط الحياة", unit: "Health and Lifestyle", pronunciation: "/ˈlaɪfstaɪl/", grade: 10, partOfSpeech: "noun", exampleSentence: "A healthy lifestyle includes regular exercise." },
  { english: "nutrition", arabic: "تغذية", unit: "Health and Lifestyle", pronunciation: "/njuːˈtrɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Good nutrition is important for health." },
  { english: "exercise", arabic: "تمرين", unit: "Health and Lifestyle", pronunciation: "/ˈeksəsaɪz/", grade: 10, partOfSpeech: "noun", exampleSentence: "Regular exercise keeps you fit." },
  { english: "wellness", arabic: "عافية", unit: "Health and Lifestyle", pronunciation: "/ˈwelnəs/", grade: 10, partOfSpeech: "noun", exampleSentence: "Mental wellness is as important as physical health." },
  { english: "balanced diet", arabic: "نظام غذائي متوازن", unit: "Health and Lifestyle", pronunciation: "/ˈbælənst ˈdaɪət/", grade: 10, partOfSpeech: "noun", exampleSentence: "A balanced diet includes fruits and vegetables." },
  { english: "fitness", arabic: "لياقة", unit: "Health and Lifestyle", pronunciation: "/ˈfɪtnəs/", grade: 10, partOfSpeech: "noun", exampleSentence: "Physical fitness improves quality of life." },
  { english: "stress", arabic: "ضغط", unit: "Health and Lifestyle", pronunciation: "/stres/", grade: 10, partOfSpeech: "noun", exampleSentence: "Too much stress can affect your health." },
  { english: "relaxation", arabic: "استرخاء", unit: "Health and Lifestyle", pronunciation: "/ˌriːlækˈseɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Relaxation techniques help reduce stress." },

  // Unit 5: Travel and Culture
  { english: "culture", arabic: "ثقافة", unit: "Travel and Culture", pronunciation: "/ˈkʌltʃə/", grade: 10, partOfSpeech: "noun", exampleSentence: "Every country has its own unique culture." },
  { english: "tradition", arabic: "تقليد", unit: "Travel and Culture", pronunciation: "/trəˈdɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "This is an old family tradition." },
  { english: "heritage", arabic: "تراث", unit: "Travel and Culture", pronunciation: "/ˈherɪtɪdʒ/", grade: 10, partOfSpeech: "noun", exampleSentence: "We should preserve our cultural heritage." },
  { english: "customs", arabic: "عادات", unit: "Travel and Culture", pronunciation: "/ˈkʌstəmz/", grade: 10, partOfSpeech: "noun", exampleSentence: "Different countries have different customs." },
  { english: "tourism", arabic: "سياحة", unit: "Travel and Culture", pronunciation: "/ˈtʊərɪzəm/", grade: 10, partOfSpeech: "noun", exampleSentence: "Tourism is important for the economy." },
  { english: "destination", arabic: "وجهة", unit: "Travel and Culture", pronunciation: "/ˌdestɪˈneɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Paris is a popular tourist destination." },
  { english: "adventure", arabic: "مغامرة", unit: "Travel and Culture", pronunciation: "/ədˈventʃə/", grade: 10, partOfSpeech: "noun", exampleSentence: "Traveling is always an adventure." },
  { english: "exploration", arabic: "استكشاف", unit: "Travel and Culture", pronunciation: "/ˌekspləˈreɪʃn/", grade: 10, partOfSpeech: "noun", exampleSentence: "Space exploration fascinates many people." },

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
    title: "المستقبل التام والمستمر (Future Perfect and Future Continuous)",
    explanation: "نستخدم المستقبل التام (will have + past participle) للتعبير عن حدث سيكتمل قبل وقت محدد في المستقبل، ونستخدم المستقبل المستمر (will be + -ing) للتعبير عن حدث سيكون مستمراً في وقت محدد في المستقبل.",
    examples: [
      "By this time next year, I will have graduated from university. - بحلول هذا الوقت من العام القادم، سأكون قد تخرجت من الجامعة",
      "This time tomorrow, I will be flying to London. - في هذا الوقت غداً، سأكون أطير إلى لندن",
      "By 2030, scientists will have found a cure for many diseases. - بحلول عام 2030، سيكون العلماء قد وجدوا علاجاً للكثير من الأمراض",
      "At 8 PM tonight, we will be watching the football match. - في الساعة 8 مساءً الليلة، سنكون نشاهد مباراة كرة القدم"
    ],
    unit: "Future Aspirations",
    grade: 10
  },
  {
    title: "المبني للمجهول مع الأزمنة المختلفة (Passive Voice with Different Tenses)",
    explanation: "يمكن استخدام المبني للمجهول مع أزمنة مختلفة للتركيز على الحدث بدلاً من الفاعل.",
    examples: [
      "Present: The experiment is conducted by scientists. - يتم إجراء التجربة من قبل العلماء",
      "Past: The discovery was made last year. - تم الاكتشاف العام الماضي",
      "Present Perfect: The theory has been challenged by new evidence. - تم تحدي النظرية بأدلة جديدة",
      "Future: The results will be published next month. - ستُنشر النتائج الشهر القادم",
      "Modal: The problem can be solved with this approach. - يمكن حل المشكلة بهذا النهج"
    ],
    unit: "Technology and Innovation",
    grade: 10
  },
  {
    title: "جمل الوصل المحددة وغير المحددة (Relative Clauses)",
    explanation: "نستخدم جمل الوصل لإعطاء معلومات إضافية عن الاسم. الجمل الوصفية المحددة تعطي معلومات ضرورية، بينما الجمل الوصفية غير المحددة تعطي معلومات إضافية غير ضرورية.",
    examples: [
      "The woman who lives next door is a doctor. - المرأة التي تعيش في الجوار طبيبة (محددة)",
      "My brother, who lives in London, is visiting next week. - أخي، الذي يعيش في لندن، سيزورنا الأسبوع القادم (غير محددة)",
      "The book that I bought yesterday is very interesting. - الكتاب الذي اشتريته أمس مثير جداً (محددة)",
      "Paris, which is the capital of France, is famous for its architecture. - باريس، التي هي عاصمة فرنسا، مشهورة بعمارتها (غير محددة)"
    ],
    unit: "Environmental Issues",
    grade: 10
  },
  {
    title: "الجمل الشرطية المختلطة (Mixed Conditionals)",
    explanation: "نستخدم الجمل الشرطية المختلطة عندما يكون الشرط في زمن والنتيجة في زمن آخر.",
    examples: [
      "If I had studied medicine, I would be a doctor now. - لو درست الطب، لكنت طبيباً الآن",
      "If I were rich, I would have traveled around the world. - لو كنت غنياً، لكنت سافرت حول العالم",
      "If we hadn't polluted the environment, we wouldn't be facing climate change now. - لو لم نلوث البيئة، لما واجهنا تغير المناخ الآن",
      "If I spoke French, I would have applied for that job. - لو كنت أتحدث الفرنسية، لكنت تقدمت لتلك الوظيفة"
    ],
    unit: "Health and Lifestyle",
    grade: 10
  },
  {
    title: "أفعال الاستنتاج (Modals of Deduction)",
    explanation: "نستخدم الأفعال المساعدة للتعبير عن الاستنتاج أو التخمين في الحاضر والماضي.",
    examples: [
      "He must be tired. - لابد أنه متعب (تأكيد قوي)",
      "She might be at home. - ربما تكون في المنزل (احتمال)",
      "They must have missed the train. - لابد أنهم فاتتهم القطار (تأكيد قوي عن الماضي)",
      "He can't have forgotten the meeting. - لا يمكن أن يكون قد نسي الاجتماع (نفي قوي)"
    ],
    unit: "Travel and Culture",
    grade: 10
  }
];

// Grade 10 Quiz Questions
export const grade10Questions: QuizQuestion[] = [
  {
    question: "By this time next year, I _____ from university.",
    options: ["will complete", "will be completing", "will have completed", "complete"],
    correct: 2,
    explanation: "نستخدم المستقبل التام (will have completed) للتعبير عن حدث سيكتمل قبل وقت محدد في المستقبل",
    unit: "Future Aspirations",
    grade: 10
  },
  {
    question: "At 8 PM tomorrow, we _____ the football match.",
    options: ["will watch", "will be watching", "will have watched", "watch"],
    correct: 1,
    explanation: "نستخدم المستقبل المستمر (will be watching) للتعبير عن حدث سيكون مستمراً في وقت محدد في المستقبل",
    unit: "Future Aspirations",
    grade: 10
  },
  {
    question: "The new technology _____ by our team last year.",
    options: ["is developed", "was developed", "has developed", "develops"],
    correct: 1,
    explanation: "نستخدم المبني للمجهول في الماضي البسيط (was developed) للتعبير عن حدث تم في الماضي",
    unit: "Technology and Innovation",
    grade: 10
  },
  {
    question: "The results _____ in next month's report.",
    options: ["will publish", "will be publishing", "will be published", "are published"],
    correct: 2,
    explanation: "نستخدم المبني للمجهول في المستقبل البسيط (will be published) للتعبير عن حدث سيتم في المستقبل",
    unit: "Technology and Innovation",
    grade: 10
  },
  {
    question: "The scientist _____ discovered this method is famous.",
    options: ["who", "which", "whose", "whom"],
    correct: 0,
    explanation: "نستخدم 'who' في جملة الوصل المحددة عندما نشير إلى شخص",
    unit: "Environmental Issues",
    grade: 10
  },
  {
    question: "Regular exercise _____ improve your health significantly.",
    options: ["must", "can", "should", "might"],
    correct: 1,
    explanation: "نستخدم 'can' للتعبير عن القدرة أو الإمكانية",
    unit: "Health and Lifestyle",
    grade: 10
  }
];