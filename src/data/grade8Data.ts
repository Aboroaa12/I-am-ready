import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 8 Vocabulary - Based on the curriculum image
export const grade8Vocabulary: VocabularyWord[] = [
  // Unit 1: Let's get started!
  { english: "revision", arabic: "مراجعة", unit: "Let's get started!", pronunciation: "/rɪˈvɪʒn/", grade: 8, partOfSpeech: "noun", exampleSentence: "We need to do a revision of last year's material." },
  
  // Unit 1: Our planet
  { english: "environment", arabic: "بيئة", unit: "Our planet", pronunciation: "/ɪnˈvaɪrənmənt/", grade: 8, partOfSpeech: "noun", exampleSentence: "We must protect the environment." },
  { english: "climate change", arabic: "تغير المناخ", unit: "Our planet", pronunciation: "/ˈklaɪmət tʃeɪndʒ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Climate change is affecting our planet." },
  { english: "waste", arabic: "نفايات", unit: "Our planet", pronunciation: "/weɪst/", grade: 8, partOfSpeech: "noun", exampleSentence: "We need to reduce plastic waste." },
  { english: "plastic", arabic: "بلاستيك", unit: "Our planet", pronunciation: "/ˈplæstɪk/", grade: 8, partOfSpeech: "noun", exampleSentence: "Plastic pollution is a serious problem in the sea." },
  { english: "rainforest", arabic: "غابة مطيرة", unit: "Our planet", pronunciation: "/ˈreɪnfɒrɪst/", grade: 8, partOfSpeech: "noun", exampleSentence: "Many species live in the rainforest." },
  { english: "renewable energy", arabic: "طاقة متجددة", unit: "Our planet", pronunciation: "/rɪˈnjuːəbl ˈenədʒi/", grade: 8, partOfSpeech: "noun", exampleSentence: "Solar power is a form of renewable energy." },
  { english: "global warming", arabic: "الاحتباس الحراري", unit: "Our planet", pronunciation: "/ˈɡləʊbl ˈwɔːmɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Global warming is causing sea levels to rise." },
  { english: "cyclone", arabic: "إعصار", unit: "Our planet", pronunciation: "/ˈsaɪkləʊn/", grade: 8, partOfSpeech: "noun", exampleSentence: "The cyclone caused a lot of damage." },
  { english: "hurricane", arabic: "إعصار", unit: "Our planet", pronunciation: "/ˈhʌrɪkən/", grade: 8, partOfSpeech: "noun", exampleSentence: "The hurricane destroyed many buildings." },
  { english: "lightning", arabic: "برق", unit: "Our planet", pronunciation: "/ˈlaɪtnɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "The lightning struck a tree during the storm." },
  { english: "rainstorm", arabic: "عاصفة مطرية", unit: "Our planet", pronunciation: "/ˈreɪnstɔːm/", grade: 8, partOfSpeech: "noun", exampleSentence: "The rainstorm flooded the streets." },
  { english: "heatwave", arabic: "موجة حر", unit: "Our planet", pronunciation: "/ˈhiːtweɪv/", grade: 8, partOfSpeech: "noun", exampleSentence: "The heatwave lasted for two weeks." },
  { english: "drought", arabic: "جفاف", unit: "Our planet", pronunciation: "/draʊt/", grade: 8, partOfSpeech: "noun", exampleSentence: "The drought has affected the farmers' crops." },
  { english: "forest fire", arabic: "حريق غابة", unit: "Our planet", pronunciation: "/ˈfɒrɪst faɪə/", grade: 8, partOfSpeech: "noun", exampleSentence: "The forest fire destroyed thousands of trees." },
  { english: "volcano", arabic: "بركان", unit: "Our planet", pronunciation: "/vɒlˈkeɪnəʊ/", grade: 8, partOfSpeech: "noun", exampleSentence: "The volcano erupted last week." },
  { english: "tsunami", arabic: "تسونامي", unit: "Our planet", pronunciation: "/tsuːˈnɑːmi/", grade: 8, partOfSpeech: "noun", exampleSentence: "The tsunami hit the coastal areas." },
  { english: "flood", arabic: "فيضان", unit: "Our planet", pronunciation: "/flʌd/", grade: 8, partOfSpeech: "noun", exampleSentence: "The flood damaged many homes." },
  { english: "hailstorm", arabic: "عاصفة بَرَد", unit: "Our planet", pronunciation: "/ˈheɪlstɔːm/", grade: 8, partOfSpeech: "noun", exampleSentence: "The hailstorm damaged the car windshields." },
  { english: "snowstorm", arabic: "عاصفة ثلجية", unit: "Our planet", pronunciation: "/ˈsnəʊstɔːm/", grade: 8, partOfSpeech: "noun", exampleSentence: "The snowstorm closed all the schools." },
  
  // Unit 2: Adventure sports
  { english: "rock climbing", arabic: "تسلق الصخور", unit: "Adventure sports", pronunciation: "/rɒk ˈklaɪmɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Rock climbing requires strength and concentration." },
  { english: "horse riding", arabic: "ركوب الخيل", unit: "Adventure sports", pronunciation: "/hɔːs ˈraɪdɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "She enjoys horse riding on weekends." },
  { english: "motor racing", arabic: "سباق السيارات", unit: "Adventure sports", pronunciation: "/ˈməʊtə ˈreɪsɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Motor racing is an exciting but dangerous sport." },
  { english: "go karting", arabic: "سباق سيارات الكارتينغ", unit: "Adventure sports", pronunciation: "/ɡəʊ ˈkɑːtɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Go karting is a fun activity for children and adults." },
  { english: "surfboarding", arabic: "ركوب الأمواج", unit: "Adventure sports", pronunciation: "/ˈsɜːfbɔːdɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Surfboarding is popular in coastal areas." },
  { english: "paragliding", arabic: "الطيران الشراعي", unit: "Adventure sports", pronunciation: "/ˈpærəɡlaɪdɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Paragliding gives you a bird's eye view of the landscape." },
  { english: "diving", arabic: "الغوص", unit: "Adventure sports", pronunciation: "/ˈdaɪvɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Diving allows you to explore underwater life." },
  { english: "abseiling", arabic: "الهبوط بالحبال", unit: "Adventure sports", pronunciation: "/æbˈseɪlɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Abseiling down the cliff was scary but exciting." },
  { english: "water skiing", arabic: "التزلج على الماء", unit: "Adventure sports", pronunciation: "/ˈwɔːtə ˈskiːɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Water skiing is a popular summer activity." },
  { english: "paragliding", arabic: "الطيران الشراعي", unit: "Adventure sports", pronunciation: "/ˈpærəɡlaɪdɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Paragliding requires good weather conditions." },
  { english: "north", arabic: "شمال", unit: "Adventure sports", pronunciation: "/nɔːθ/", grade: 8, partOfSpeech: "noun", exampleSentence: "We're heading north for our hiking trip." },
  { english: "south", arabic: "جنوب", unit: "Adventure sports", pronunciation: "/saʊθ/", grade: 8, partOfSpeech: "noun", exampleSentence: "The beach is to the south of the city." },
  { english: "east", arabic: "شرق", unit: "Adventure sports", pronunciation: "/iːst/", grade: 8, partOfSpeech: "noun", exampleSentence: "The sun rises in the east." },
  { english: "west", arabic: "غرب", unit: "Adventure sports", pronunciation: "/west/", grade: 8, partOfSpeech: "noun", exampleSentence: "They drove west towards the mountains." },
  { english: "sunrise", arabic: "شروق الشمس", unit: "Adventure sports", pronunciation: "/ˈsʌnraɪz/", grade: 8, partOfSpeech: "noun", exampleSentence: "We woke up early to watch the sunrise." },
  { english: "sunset", arabic: "غروب الشمس", unit: "Adventure sports", pronunciation: "/ˈsʌnset/", grade: 8, partOfSpeech: "noun", exampleSentence: "The sunset over the ocean was beautiful." },
  { english: "wood", arabic: "غابة", unit: "Adventure sports", pronunciation: "/wʊd/", grade: 8, partOfSpeech: "noun", exampleSentence: "We went for a walk in the wood." },
  { english: "field", arabic: "حقل", unit: "Adventure sports", pronunciation: "/fiːld/", grade: 8, partOfSpeech: "noun", exampleSentence: "The horses were grazing in the field." },
  { english: "valley", arabic: "وادي", unit: "Adventure sports", pronunciation: "/ˈvæli/", grade: 8, partOfSpeech: "noun", exampleSentence: "The valley was filled with colorful wildflowers." },
  { english: "scenery", arabic: "مناظر طبيعية", unit: "Adventure sports", pronunciation: "/ˈsiːnəri/", grade: 8, partOfSpeech: "noun", exampleSentence: "The scenery along the coast is spectacular." },
  { english: "lake", arabic: "بحيرة", unit: "Adventure sports", pronunciation: "/leɪk/", grade: 8, partOfSpeech: "noun", exampleSentence: "We went swimming in the lake." },
  { english: "bay", arabic: "خليج", unit: "Adventure sports", pronunciation: "/beɪ/", grade: 8, partOfSpeech: "noun", exampleSentence: "The boat was anchored in the bay." },
  
  // Unit 3: Spend or save?
  { english: "on sale", arabic: "للبيع", unit: "Spend or save?", pronunciation: "/ɒn seɪl/", grade: 8, partOfSpeech: "phrase", exampleSentence: "These shoes are on sale this week." },
  { english: "queue", arabic: "طابور", unit: "Spend or save?", pronunciation: "/kjuː/", grade: 8, partOfSpeech: "noun", exampleSentence: "There was a long queue at the checkout." },
  { english: "till", arabic: "صندوق النقد", unit: "Spend or save?", pronunciation: "/tɪl/", grade: 8, partOfSpeech: "noun", exampleSentence: "She works at the till in the supermarket." },
  { english: "coin", arabic: "عملة معدنية", unit: "Spend or save?", pronunciation: "/kɔɪn/", grade: 8, partOfSpeech: "noun", exampleSentence: "I found an old coin in the garden." },
  { english: "banknote", arabic: "ورقة نقدية", unit: "Spend or save?", pronunciation: "/ˈbæŋknəʊt/", grade: 8, partOfSpeech: "noun", exampleSentence: "He paid with a 50 rial banknote." },
  { english: "cash", arabic: "نقد", unit: "Spend or save?", pronunciation: "/kæʃ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Do you want to pay by cash or card?" },
  { english: "exchange", arabic: "تبادل", unit: "Spend or save?", pronunciation: "/ɪksˈtʃeɪndʒ/", grade: 8, partOfSpeech: "verb", exampleSentence: "You can exchange the shirt if it doesn't fit." },
  { english: "shop", arabic: "متجر", unit: "Spend or save?", pronunciation: "/ʃɒp/", grade: 8, partOfSpeech: "noun", exampleSentence: "I need to go to the shop to buy some milk." },
  { english: "assistant", arabic: "مساعد", unit: "Spend or save?", pronunciation: "/əˈsɪstənt/", grade: 8, partOfSpeech: "noun", exampleSentence: "The shop assistant helped me find the right size." },
  { english: "bank", arabic: "بنك", unit: "Spend or save?", pronunciation: "/bæŋk/", grade: 8, partOfSpeech: "noun", exampleSentence: "I need to go to the bank to withdraw some money." },
  { english: "card", arabic: "بطاقة", unit: "Spend or save?", pronunciation: "/kɑːd/", grade: 8, partOfSpeech: "noun", exampleSentence: "I paid with my credit card." },
  { english: "customer", arabic: "زبون", unit: "Spend or save?", pronunciation: "/ˈkʌstəmə/", grade: 8, partOfSpeech: "noun", exampleSentence: "The customer complained about the service." },
  { english: "receipt", arabic: "إيصال", unit: "Spend or save?", pronunciation: "/rɪˈsiːt/", grade: 8, partOfSpeech: "noun", exampleSentence: "Don't forget to keep your receipt." },
  { english: "online shopping", arabic: "تسوق عبر الإنترنت", unit: "Spend or save?", pronunciation: "/ˈɒnlaɪn ˈʃɒpɪŋ/", grade: 8, partOfSpeech: "noun", exampleSentence: "Online shopping is becoming more popular." },
  { english: "imaginary situations", arabic: "مواقف خيالية", unit: "Spend or save?", pronunciation: "/ɪˈmædʒɪnəri ˌsɪtʃuˈeɪʃnz/", grade: 8, partOfSpeech: "phrase", exampleSentence: "We discussed imaginary situations in our creative writing class." },
  { english: "charity", arabic: "جمعية خيرية", unit: "Spend or save?", pronunciation: "/ˈtʃærəti/", grade: 8, partOfSpeech: "noun", exampleSentence: "He donates money to charity every month." },
  { english: "wish", arabic: "أمنية", unit: "Spend or save?", pronunciation: "/wɪʃ/", grade: 8, partOfSpeech: "noun", exampleSentence: "My wish is to travel around the world." },
  { english: "invisible", arabic: "غير مرئي", unit: "Spend or save?", pronunciation: "/ɪnˈvɪzəbl/", grade: 8, partOfSpeech: "adjective", exampleSentence: "He wished he could be invisible for a day." },
  { english: "win", arabic: "يفوز", unit: "Spend or save?", pronunciation: "/wɪn/", grade: 8, partOfSpeech: "verb", exampleSentence: "I hope to win the competition." },
  { english: "cup", arabic: "كأس", unit: "Spend or save?", pronunciation: "/kʌp/", grade: 8, partOfSpeech: "noun", exampleSentence: "The team won the cup last year." },
  
  // WOW Learning Club
  { english: "large numbers", arabic: "أرقام كبيرة", unit: "WOW Learning Club", pronunciation: "/lɑːdʒ ˈnʌmbəz/", grade: 8, partOfSpeech: "phrase", exampleSentence: "We learned how to read large numbers in math class." },
  { english: "hundred", arabic: "مائة", unit: "WOW Learning Club", pronunciation: "/ˈhʌndrəd/", grade: 8, partOfSpeech: "number", exampleSentence: "There are a hundred students in our year." },
  { english: "thousand", arabic: "ألف", unit: "WOW Learning Club", pronunciation: "/ˈθaʊznd/", grade: 8, partOfSpeech: "number", exampleSentence: "The book has over a thousand pages." },
  { english: "environmental problems", arabic: "مشاكل بيئية", unit: "WOW Learning Club", pronunciation: "/ɪnˌvaɪrənˈmentl ˈprɒbləmz/", grade: 8, partOfSpeech: "phrase", exampleSentence: "We discussed environmental problems in class." },
  { english: "gases", arabic: "غازات", unit: "WOW Learning Club", pronunciation: "/ˈɡæsɪz/", grade: 8, partOfSpeech: "noun", exampleSentence: "Greenhouse gases contribute to global warming." },
  { english: "fossil fuels", arabic: "وقود أحفوري", unit: "WOW Learning Club", pronunciation: "/ˈfɒsl ˈfjuːəlz/", grade: 8, partOfSpeech: "noun", exampleSentence: "We need to reduce our dependence on fossil fuels." },
  { english: "cutting down forests", arabic: "قطع الغابات", unit: "WOW Learning Club", pronunciation: "/ˈkʌtɪŋ daʊn ˈfɒrɪsts/", grade: 8, partOfSpeech: "phrase", exampleSentence: "Cutting down forests leads to habitat loss for many animals." },
  { english: "throwing away", arabic: "رمي", unit: "WOW Learning Club", pronunciation: "/ˈθrəʊɪŋ əˈweɪ/", grade: 8, partOfSpeech: "phrase", exampleSentence: "Instead of throwing away plastic, we should recycle it." },
  { english: "using plants", arabic: "استخدام النباتات", unit: "WOW Learning Club", pronunciation: "/ˈjuːzɪŋ plɑːnts/", grade: 8, partOfSpeech: "phrase", exampleSentence: "Using plants to decorate your home improves air quality." },
  { english: "air pollution", arabic: "تلوث الهواء", unit: "WOW Learning Club", pronunciation: "/eə pəˈluːʃn/", grade: 8, partOfSpeech: "noun", exampleSentence: "Air pollution is a major problem in big cities." }
];

// Grade 8 Grammar Rules
export const grade8Grammar: GrammarRule[] = [
  {
    title: "Questions and question words",
    explanation: "نستخدم كلمات الاستفهام (Where, How many, When, Who, What, Why) لطرح أسئلة للحصول على معلومات محددة.",
    examples: [
      "Where do you live? - أين تعيش؟",
      "How many books do you have? - كم كتاباً لديك؟",
      "When does the movie start? - متى يبدأ الفيلم؟",
      "Who is your favorite teacher? - من هو معلمك المفضل؟",
      "What time is it? - كم الساعة؟",
      "Why are you late? - لماذا أنت متأخر؟"
    ],
    unit: "Let's get started!",
    grade: 8
  },
  {
    title: "Modal verbs of obligation",
    explanation: "نستخدم أفعال مثل should/shouldn't و must/mustn't للتعبير عن الالتزام أو الضرورة أو النصيحة.",
    examples: [
      "We shouldn't throw away plastic. - يجب ألا نرمي البلاستيك",
      "We must close doors. - يجب علينا إغلاق الأبواب",
      "We need to switch off the lights when we leave a room. - نحتاج إلى إطفاء الأضواء عندما نغادر الغرفة",
      "You should recycle paper and glass. - يجب عليك إعادة تدوير الورق والزجاج",
      "We must protect the environment. - يجب علينا حماية البيئة",
      "You shouldn't waste water. - يجب ألا تهدر الماء"
    ],
    unit: "Our planet",
    grade: 8
  },
  {
    title: "Reported speech: questions and statements",
    explanation: "نستخدم الكلام المنقول لنقل ما قاله شخص آخر. عند نقل الأسئلة والعبارات، نغير الضمائر وأزمنة الأفعال وبعض الكلمات الأخرى.",
    examples: [
      "Direct: 'I need help.' → Reported: He said (that) he needed help.",
      "Direct: 'What is your name?' → Reported: He asked me what my name was.",
      "Direct: 'Where do you live?' → Reported: She asked me where I lived.",
      "Direct: 'I don't know what a cyclone is.' → Reported: He said (that) he didn't know what a cyclone was.",
      "Direct: 'Are you coming to the party?' → Reported: She asked if I was coming to the party."
    ],
    unit: "Our planet",
    grade: 8
  },
  {
    title: "Reflexive pronouns",
    explanation: "نستخدم الضمائر الانعكاسية (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves) عندما يكون الفاعل والمفعول به هو نفس الشخص أو الشيء.",
    examples: [
      "I fell when I was rock climbing and hurt myself. - سقطت عندما كنت أتسلق الصخور وآذيت نفسي",
      "Did you enjoy yourself? - هل استمتعت بوقتك؟",
      "She made herself a cup of tea. - صنعت لنفسها كوب شاي",
      "The cat cleaned itself. - نظف القط نفسه",
      "We need to protect ourselves from the sun. - نحتاج إلى حماية أنفسنا من الشمس",
      "They built themselves a new house. - بنوا لأنفسهم منزلاً جديداً"
    ],
    unit: "Adventure sports",
    grade: 8
  },
  {
    title: "Past perfect",
    explanation: "نستخدم الماضي التام (had + past participle) للتحدث عن حدث وقع قبل حدث آخر في الماضي.",
    examples: [
      "They had eaten their breakfast, they looked in their guidebook. - كانوا قد تناولوا فطورهم، نظروا في دليلهم",
      "By the time we arrived, the movie had already started. - بحلول الوقت الذي وصلنا فيه، كان الفيلم قد بدأ بالفعل",
      "She had finished her homework before dinner. - كانت قد أنهت واجبها المنزلي قبل العشاء",
      "I realized that I had forgotten my keys. - أدركت أنني كنت قد نسيت مفاتيحي",
      "After they had gone to bed, they heard a strange noise. - بعد أن ذهبوا إلى الفراش، سمعوا صوتاً غريباً"
    ],
    unit: "Adventure sports",
    grade: 8
  },
  {
    title: "Zero and first conditionals (revision)",
    explanation: "نستخدم الشرط الصفري (if + present simple, present simple) للتحدث عن حقائق عامة. ونستخدم الشرط الأول (if + present simple, will + infinitive) للتحدث عن احتمالات مستقبلية واقعية.",
    examples: [
      "If something is big enough, you can return it back. - إذا كان شيء ما كبيراً بما فيه الكفاية، يمكنك إعادته",
      "If we all buy everything online, shops will close. - إذا اشترينا جميعاً كل شيء عبر الإنترنت، ستغلق المتاجر",
      "If it rains, the plants grow. - إذا أمطرت، تنمو النباتات",
      "If you heat water to 100°C, it boils. - إذا سخنت الماء إلى 100 درجة مئوية، يغلي",
      "If you study hard, you will pass the exam. - إذا درست بجد، ستنجح في الامتحان",
      "If I have time, I will visit you tomorrow. - إذا كان لدي وقت، سأزورك غداً"
    ],
    unit: "Spend or save?",
    grade: 8
  },
  {
    title: "Second conditional",
    explanation: "نستخدم الشرط الثاني (if + past simple, would + infinitive) للتحدث عن مواقف خيالية أو غير محتملة في الحاضر أو المستقبل.",
    examples: [
      "If I could travel back in time, I'd go to Ancient Egypt. - لو استطعت السفر عبر الزمن، لذهبت إلى مصر القديمة",
      "If you could become a film character, what character would you choose? - لو استطعت أن تصبح شخصية فيلم، أي شخصية ستختار؟",
      "If I had more money, I would buy a new car. - لو كان لدي المزيد من المال، لاشتريت سيارة جديدة",
      "What would you do if you won the lottery? - ماذا ستفعل لو ربحت اليانصيب؟",
      "If I were you, I would study harder. - لو كنت مكانك، لدرست بجد أكثر",
      "She would travel around the world if she had enough money. - ستسافر حول العالم لو كان لديها ما يكفي من المال"
    ],
    unit: "Spend or save?",
    grade: 8
  },
  {
    title: "Reflexive pronouns (myself)",
    explanation: "نستخدم الضمائر الانعكاسية للإشارة إلى أن الفاعل والمفعول به هما نفس الشخص.",
    examples: [
      "I can't do it by myself. - لا أستطيع القيام بذلك بمفردي",
      "Of course you can't do it by yourself. - بالطبع لا يمكنك القيام بذلك بمفردك",
      "She made herself a sandwich. - صنعت لنفسها شطيرة",
      "They enjoyed themselves at the party. - استمتعوا بأنفسهم في الحفلة",
      "He taught himself how to play the guitar. - علّم نفسه كيفية عزف الجيتار",
      "We need to look after ourselves. - نحتاج إلى الاعتناء بأنفسنا"
    ],
    unit: "WOW Learning Club",
    grade: 8
  }
];

// Grade 8 Quiz Questions
export const grade8Questions: QuizQuestion[] = [
  {
    question: "What is the correct question word? _____ many students are there in your class?",
    options: ["What", "How", "Where", "When"],
    correct: 1,
    explanation: "نستخدم How many للسؤال عن عدد الأشياء المعدودة مثل الطلاب",
    unit: "Let's get started!",
    grade: 8
  },
  {
    question: "We _____ throw away plastic bottles.",
    options: ["should", "shouldn't", "must", "mustn't"],
    correct: 1,
    explanation: "نستخدم shouldn't للتعبير عن النصيحة بعدم القيام بشيء ما",
    unit: "Our planet",
    grade: 8
  },
  {
    question: "She asked me _____ I liked adventure sports.",
    options: ["that", "what", "if", "when"],
    correct: 2,
    explanation: "في الكلام المنقول، نستخدم if لنقل سؤال نعم/لا",
    unit: "Our planet",
    grade: 8
  },
  {
    question: "Be careful! You might hurt _____.",
    options: ["you", "your", "yourself", "yourselves"],
    correct: 2,
    explanation: "نستخدم yourself كضمير انعكاسي عندما يكون الفاعل والمفعول به هو نفس الشخص (أنت)",
    unit: "Adventure sports",
    grade: 8
  },
  {
    question: "By the time we arrived at the cinema, the film _____ started.",
    options: ["has", "have", "had", "was"],
    correct: 2,
    explanation: "نستخدم had + past participle (الماضي التام) للتعبير عن حدث وقع قبل حدث آخر في الماضي",
    unit: "Adventure sports",
    grade: 8
  },
  {
    question: "If you heat ice, it _____.",
    options: ["melts", "will melt", "would melt", "melted"],
    correct: 0,
    explanation: "في الشرط الصفري، نستخدم المضارع البسيط في جملتي الشرط والجواب للتعبير عن حقائق عامة",
    unit: "Spend or save?",
    grade: 8
  },
  {
    question: "If I _____ a million dollars, I would travel around the world.",
    options: ["have", "has", "had", "will have"],
    correct: 2,
    explanation: "في الشرط الثاني، نستخدم الماضي البسيط في جملة الشرط للتعبير عن موقف خيالي أو غير محتمل",
    unit: "Spend or save?",
    grade: 8
  },
  {
    question: "I can't do this homework by _____.",
    options: ["me", "my", "mine", "myself"],
    correct: 3,
    explanation: "نستخدم myself كضمير انعكاسي مع الضمير I",
    unit: "WOW Learning Club",
    grade: 8
  },
  {
    question: "Which of these is NOT an extreme weather condition?",
    options: ["Cyclone", "Heatwave", "Sunrise", "Tsunami"],
    correct: 2,
    explanation: "Sunrise (شروق الشمس) ليس ظاهرة طقس متطرفة، بل هو ظاهرة طبيعية يومية",
    unit: "Our planet",
    grade: 8
  },
  {
    question: "What is the correct past participle of 'eat'?",
    options: ["eat", "ate", "eaten", "eated"],
    correct: 2,
    explanation: "الصيغة الثالثة (past participle) للفعل eat هي eaten",
    unit: "Adventure sports",
    grade: 8
  }
];