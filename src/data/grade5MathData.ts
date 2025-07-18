import { MathProblem } from '../types';

// Grade 5 Math Units - Based on curriculum structure
export const grade5MathUnits = [
  'نظام الأعداد',
  'الاستراتيجيات الذهنية والكتابية للجمع والطرح',
  'الاستراتيجيات الذهنية والكتابية للضرب والقسمة',
  'المضاعفات والأعداد المربعة والعوامل',
  'استخدام الاستدلال الهندسي والأشكال',
  'المكان والحركة',
  'الكتلة',
  'الوقت والجداول الزمنية',
  'المساحة والمحيط',
  'الأعداد والمتتاليات العددية',
  'الأعداد العشرية',
  'الاستراتيجيات الذهنية',
  'الاستراتيجيات الذهنية والكتابية للجمع والطرح',
  'الطرق الكتابية للضرب والقسمة'
];

// Grade 5 Math Problems - Based on the curriculum units
export const grade5MathProblems: MathProblem[] = [
  // الوحدة 1أ: الأعداد وحل المشكلات
  // 1 نظام الأعداد (الأعداد الكاملة)
  // 1-1: القيمة المكانية
  {
    id: 'math-5-1-1-1',
    question: 'ما هي القيمة المكانية للرقم 7 في العدد 47,382؟',
    options: ['7', '70', '700', '7000'],
    answer: '7000',
    solution: 'الرقم 7 في خانة الآلاف، لذا قيمته المكانية هي 7000',
    difficulty: 'easy',
    topic: 'القيمة المكانية',
    unit: 'نظام الأعداد',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-1-1-2',
    question: 'اكتب العدد 25,647 بالكلمات:',
    options: ['خمسة وعشرون ألفاً وستمائة وسبعة وأربعون', 'خمسة وعشرون ألفاً وستمائة وأربعة وسبعون', 'اثنان وخمسون ألفاً وستمائة وسبعة وأربعون', 'خمسة وعشرون ألفاً وسبعمائة وسبعة وأربعون'],
    answer: 'خمسة وعشرون ألفاً وستمائة وسبعة وأربعون',
    solution: '25,647 = خمسة وعشرون ألفاً + ستمائة + سبعة وأربعون',
    difficulty: 'medium',
    topic: 'القيمة المكانية',
    unit: 'نظام الأعداد',
    grade: 5,
    subject: 'math'
  },

  // 1-2: الترتيب والتقريب
  {
    id: 'math-5-1-2-1',
    question: 'رتب الأعداد التالية من الأصغر إلى الأكبر: 8,456 - 8,465 - 8,546 - 8,564',
    options: ['8,456 - 8,465 - 8,546 - 8,564', '8,564 - 8,546 - 8,465 - 8,456', '8,465 - 8,456 - 8,564 - 8,546', '8,456 - 8,546 - 8,465 - 8,564'],
    answer: '8,456 - 8,465 - 8,546 - 8,564',
    solution: 'نقارن الأرقام من اليسار إلى اليمين: 8,456 < 8,465 < 8,546 < 8,564',
    difficulty: 'medium',
    topic: 'الترتيب والتقريب',
    unit: 'نظام الأعداد',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-1-2-2',
    question: 'قرب العدد 3,847 إلى أقرب مئة:',
    options: ['3,800', '3,850', '3,900', '4,000'],
    answer: '3,800',
    solution: 'الرقم في خانة العشرات هو 4، وهو أقل من 5، لذا نقرب إلى الأسفل: 3,800',
    difficulty: 'easy',
    topic: 'الترتيب والتقريب',
    unit: 'نظام الأعداد',
    grade: 5,
    subject: 'math'
  },

  // 1-3: المتتاليات (1)
  {
    id: 'math-5-1-3-1',
    question: 'أكمل المتتالية: 5, 10, 15, 20, ___',
    options: ['23', '25', '30', '35'],
    answer: '25',
    solution: 'هذه متتالية حسابية بفرق ثابت = 5، لذا العدد التالي هو 20 + 5 = 25',
    difficulty: 'easy',
    topic: 'المتتاليات',
    unit: 'نظام الأعداد',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-1-3-2',
    question: 'ما هو الحد الثامن في متتالية مضاعفات العدد 7؟',
    options: ['49', '56', '63', '70'],
    answer: '56',
    solution: 'مضاعفات 7: 7, 14, 21, 28, 35, 42, 49, 56. الحد الثامن هو 56',
    difficulty: 'medium',
    topic: 'المتتاليات',
    unit: 'نظام الأعداد',
    grade: 5,
    subject: 'math'
  },

  // 2 الاستراتيجيات الذهنية والكتابية للجمع والطرح
  {
    id: 'math-5-2-1-1',
    question: 'أوجد ناتج: 4,567 + 2,834',
    options: ['7,401', '7,391', '6,401', '7,301'],
    answer: '7,401',
    solution: '4,567 + 2,834 = 7,401 (نجمع كل خانة على حدة مع الحمل)',
    difficulty: 'medium',
    topic: 'الجمع والطرح',
    unit: 'الاستراتيجيات الذهنية والكتابية للجمع والطرح',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-2-1-2',
    question: 'أوجد ناتج: 8,000 - 3,456',
    options: ['4,544', '4,644', '5,544', '4,454'],
    answer: '4,544',
    solution: '8,000 - 3,456 = 4,544 (نستلف من الخانات العليا عند الحاجة)',
    difficulty: 'medium',
    topic: 'الجمع والطرح',
    unit: 'الاستراتيجيات الذهنية والكتابية للجمع والطرح',
    grade: 5,
    subject: 'math'
  },

  // 3 الاستراتيجيات الذهنية والكتابية للضرب والقسمة
  {
    id: 'math-5-3-1-1',
    question: 'أوجد ناتج: 8 × 7',
    options: ['54', '56', '64', '48'],
    answer: '56',
    solution: '8 × 7 = 56 (من جدول الضرب الأساسي)',
    difficulty: 'easy',
    topic: 'حقائق الضرب والقسمة',
    unit: 'الاستراتيجيات الذهنية والكتابية للضرب والقسمة',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-3-2-1',
    question: 'أوجد ناتج: 234 × 5',
    options: ['1,170', '1,160', '1,180', '1,150'],
    answer: '1,170',
    solution: '234 × 5 = 1,170 (نضرب كل رقم في 5 ونحمل عند الحاجة)',
    difficulty: 'medium',
    topic: 'الطرق الكتابية للضرب',
    unit: 'الاستراتيجيات الذهنية والكتابية للضرب والقسمة',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-3-4-1',
    question: 'أوجد ناتج: 144 ÷ 12',
    options: ['11', '12', '13', '14'],
    answer: '12',
    solution: '144 ÷ 12 = 12 (لأن 12 × 12 = 144)',
    difficulty: 'medium',
    topic: 'الطرق الكتابية للقسمة',
    unit: 'الاستراتيجيات الذهنية والكتابية للضرب والقسمة',
    grade: 5,
    subject: 'math'
  },

  // 4 المضاعفات والأعداد المربعة والعوامل
  {
    id: 'math-5-4-1-1',
    question: 'ما هو العدد المربع التالي بعد 25؟',
    options: ['30', '35', '36', '49'],
    answer: '36',
    solution: 'الأعداد المربعة: 1, 4, 9, 16, 25, 36, ... (6² = 36)',
    difficulty: 'easy',
    topic: 'المضاعفات والأعداد المربعة',
    unit: 'المضاعفات والأعداد المربعة والعوامل',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-4-2-1',
    question: 'أي من الأعداد التالية يقبل القسمة على 3؟',
    options: ['124', '135', '247', '358'],
    answer: '135',
    solution: 'العدد يقبل القسمة على 3 إذا كان مجموع أرقامه يقبل القسمة على 3. مجموع أرقام 135 = 1+3+5 = 9، و9 يقبل القسمة على 3',
    difficulty: 'medium',
    topic: 'اختبارات قابلية القسمة',
    unit: 'المضاعفات والأعداد المربعة والعوامل',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-4-3-1',
    question: 'ما هي عوامل العدد 18؟',
    options: ['1, 2, 3, 6, 9, 18', '1, 3, 6, 18', '2, 3, 6, 9', '1, 2, 9, 18'],
    answer: '1, 2, 3, 6, 9, 18',
    solution: 'عوامل 18 هي الأعداد التي تقسم 18 بدون باقي: 1, 2, 3, 6, 9, 18',
    difficulty: 'medium',
    topic: 'العوامل',
    unit: 'المضاعفات والأعداد المربعة والعوامل',
    grade: 5,
    subject: 'math'
  },

  // الوحدة 1ب: الهندسة وحل المشكلات
  // 5 استخدام الاستدلال الهندسي والأشكال
  {
    id: 'math-5-5-1-1',
    question: 'كم عدد أزواج الخطوط المتوازية في المستطيل؟',
    options: ['1', '2', '3', '4'],
    answer: '2',
    solution: 'المستطيل له زوجان من الخطوط المتوازية: الضلعان المتقابلان العلوي والسفلي، والضلعان المتقابلان الأيمن والأيسر',
    difficulty: 'easy',
    topic: 'الخطوط المتوازية والمتعامدة',
    unit: 'استخدام الاستدلال الهندسي والأشكال',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-5-2-1',
    question: 'ما نوع المثلث الذي له ثلاثة أضلاع متساوية؟',
    options: ['مثلث قائم الزاوية', 'مثلث متطابق الضلعين', 'مثلث متساوي الأضلاع', 'مثلث مختلف الأضلاع'],
    answer: 'مثلث متساوي الأضلاع',
    solution: 'المثلث الذي له ثلاثة أضلاع متساوية يسمى مثلث متساوي الأضلاع',
    difficulty: 'easy',
    topic: 'المثلثات',
    unit: 'استخدام الاستدلال الهندسي والأشكال',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-5-3-1',
    question: 'كم عدد الأوجه في المكعب؟',
    options: ['4', '6', '8', '12'],
    answer: '6',
    solution: 'المكعب له 6 أوجه مربعة متساوية',
    difficulty: 'easy',
    topic: 'المكعب ومتوازي المستطيلات',
    unit: 'استخدام الاستدلال الهندسي والأشكال',
    grade: 5,
    subject: 'math'
  },

  // 6 المكان والحركة
  {
    id: 'math-5-6-1-1',
    question: 'ما هي إحداثيات النقطة التي تقع على المحور السيني عند العدد 4؟',
    options: ['(4, 0)', '(0, 4)', '(4, 4)', '(2, 2)'],
    answer: '(4, 0)',
    solution: 'النقطة على المحور السيني لها إحداثي ص = 0، فتكون (4, 0)',
    difficulty: 'medium',
    topic: 'الإحداثيات',
    unit: 'المكان والحركة',
    grade: 5,
    subject: 'math'
  },

  // الوحدة 1ج: القياس وحل المشكلات
  // 7 الكتلة
  {
    id: 'math-5-7-1-1',
    question: 'كم غراماً في 3.5 كيلوغرام؟',
    options: ['350 غم', '3500 غم', '35 غم', '35000 غم'],
    answer: '3500 غم',
    solution: '1 كيلوغرام = 1000 غرام، لذا 3.5 كغم = 3.5 × 1000 = 3500 غم',
    difficulty: 'medium',
    topic: 'الكتلة',
    unit: 'الكتلة',
    grade: 5,
    subject: 'math'
  },

  // 8 الوقت والجداول الزمنية
  {
    id: 'math-5-8-1-1',
    question: 'إذا كانت الساعة تشير إلى 2:45، فكم دقيقة تبقى حتى الساعة 3:00؟',
    options: ['10 دقائق', '15 دقيقة', '20 دقيقة', '25 دقيقة'],
    answer: '15 دقيقة',
    solution: 'من 2:45 إلى 3:00 = 15 دقيقة',
    difficulty: 'easy',
    topic: 'قراءة الوقت',
    unit: 'الوقت والجداول الزمنية',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-8-2-1',
    question: 'إذا بدأت الرحلة في الساعة 9:30 ص واستغرقت ساعتين و45 دقيقة، فمتى انتهت؟',
    options: ['12:15 ظ', '11:15 ص', '12:45 ظ', '11:45 ص'],
    answer: '12:15 ظ',
    solution: '9:30 + 2 ساعة 45 دقيقة = 9:30 + 2:45 = 12:15',
    difficulty: 'medium',
    topic: 'الجداول الزمنية',
    unit: 'الوقت والجداول الزمنية',
    grade: 5,
    subject: 'math'
  },

  // 9 المساحة والمحيط (1)
  {
    id: 'math-5-9-1-1',
    question: 'ما هي مساحة مستطيل طوله 8 سم وعرضه 5 سم؟',
    options: ['13 سم²', '26 سم²', '40 سم²', '80 سم²'],
    answer: '40 سم²',
    solution: 'مساحة المستطيل = الطول × العرض = 8 × 5 = 40 سم²',
    difficulty: 'easy',
    topic: 'المساحة',
    unit: 'المساحة والمحيط',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-9-2-1',
    question: 'ما هو محيط مربع طول ضلعه 6 سم؟',
    options: ['12 سم', '18 سم', '24 سم', '36 سم'],
    answer: '24 سم',
    solution: 'محيط المربع = 4 × طول الضلع = 4 × 6 = 24 سم',
    difficulty: 'easy',
    topic: 'المحيط',
    unit: 'المساحة والمحيط',
    grade: 5,
    subject: 'math'
  },

  // الوحدة 2أ: الأعداد وحل المشكلات
  // 11 الأعداد العشرية
  {
    id: 'math-5-11-1-1',
    question: 'ما هي القيمة المكانية للرقم 7 في العدد 23.47؟',
    options: ['7', '0.7', '0.07', '70'],
    answer: '0.07',
    solution: 'الرقم 7 في خانة الجزء من المئة، لذا قيمته 0.07',
    difficulty: 'medium',
    topic: 'النظام العشري',
    unit: 'الأعداد العشرية',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-11-1-2',
    question: 'أي من الأعداد التالية أكبر: 0.8 أم 0.75؟',
    options: ['0.8', '0.75', 'متساويان', 'لا يمكن المقارنة'],
    answer: '0.8',
    solution: '0.8 = 0.80، و 0.80 > 0.75',
    difficulty: 'medium',
    topic: 'النظام العشري',
    unit: 'الأعداد العشرية',
    grade: 5,
    subject: 'math'
  },

  // 12 الاستراتيجيات الذهنية
  {
    id: 'math-5-12-1-1',
    question: 'أوجد ناتج: 0.5 + 0.3',
    options: ['0.8', '0.35', '0.53', '8'],
    answer: '0.8',
    solution: '0.5 + 0.3 = 0.8 (نجمع الأجزاء العشرية)',
    difficulty: 'easy',
    topic: 'حقائق الأعداد العشرية',
    unit: 'الاستراتيجيات الذهنية',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-12-2-1',
    question: 'أوجد ناتج: 25 × 4 باستخدام استراتيجية ذهنية',
    options: ['90', '100', '110', '120'],
    answer: '100',
    solution: '25 × 4 = 25 × 4 = 100 (يمكن حفظها كحقيقة أو 25 × 4 = 100)',
    difficulty: 'easy',
    topic: 'استراتيجيات عمليات الضرب',
    unit: 'الاستراتيجيات الذهنية',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-12-3-1',
    question: 'ما هو نصف العدد 84؟',
    options: ['42', '48', '40', '44'],
    answer: '42',
    solution: 'نصف 84 = 84 ÷ 2 = 42',
    difficulty: 'easy',
    topic: 'المضاعفة والتنصيف',
    unit: 'الاستراتيجيات الذهنية',
    grade: 5,
    subject: 'math'
  },

  // مسائل لفظية متنوعة
  {
    id: 'math-5-word-1',
    question: 'في مدرسة يوجد 24 فصلاً، في كل فصل 28 طالباً. كم عدد الطلاب في المدرسة؟',
    options: ['652', '672', '682', '692'],
    answer: '672',
    solution: 'عدد الطلاب = عدد الفصول × عدد الطلاب في كل فصل = 24 × 28 = 672 طالباً',
    difficulty: 'medium',
    topic: 'مسائل لفظية',
    unit: 'الضرب والقسمة',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-word-2',
    question: 'اشترت فاطمة 3 كتب بـ 15.75 ريال، و4 أقلام بـ 8.50 ريال. كم دفعت في المجموع؟',
    options: ['24.25 ريال', '23.25 ريال', '25.25 ريال', '22.25 ريال'],
    answer: '24.25 ريال',
    solution: 'المجموع = 15.75 + 8.50 = 24.25 ريال',
    difficulty: 'medium',
    topic: 'مسائل لفظية',
    unit: 'جمع وطرح المبالغ المالية',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-word-3',
    question: 'حديقة مستطيلة الشكل طولها 15 متراً وعرضها 8 أمتار. ما هو محيط الحديقة؟',
    options: ['23 متراً', '46 متراً', '120 متراً', '30 متراً'],
    answer: '46 متراً',
    solution: 'محيط المستطيل = 2 × (الطول + العرض) = 2 × (15 + 8) = 2 × 23 = 46 متراً',
    difficulty: 'medium',
    topic: 'مسائل لفظية',
    unit: 'المساحة والمحيط',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-word-4',
    question: 'لدى أحمد 240 ريالاً. أنفق ثلث المبلغ على الكتب. كم ريالاً أنفق على الكتب؟',
    options: ['60 ريال', '80 ريال', '90 ريال', '120 ريال'],
    answer: '80 ريال',
    solution: 'ثلث 240 = 240 ÷ 3 = 80 ريال',
    difficulty: 'medium',
    topic: 'مسائل لفظية',
    unit: 'القسمة',
    grade: 5,
    subject: 'math'
  },

  // أسئلة متقدمة
  {
    id: 'math-5-advanced-1',
    question: 'إذا كان 6 × ن = 48، فما قيمة ن؟',
    options: ['6', '7', '8', '9'],
    answer: '8',
    solution: 'ن = 48 ÷ 6 = 8',
    difficulty: 'medium',
    topic: 'حل المعادلات البسيطة',
    unit: 'الضرب والقسمة',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-advanced-2',
    question: 'ما هو العدد الذي إذا ضربناه في 9 حصلنا على 108؟',
    options: ['11', '12', '13', '14'],
    answer: '12',
    solution: 'العدد = 108 ÷ 9 = 12',
    difficulty: 'medium',
    topic: 'حل المعادلات البسيطة',
    unit: 'الضرب والقسمة',
    grade: 5,
    subject: 'math'
  },

  // أسئلة الأنماط والتفكير المنطقي
  {
    id: 'math-5-pattern-1',
    question: 'في متتالية: 2, 6, 18, 54, ___. ما هو العدد التالي؟',
    options: ['108', '162', '216', '270'],
    answer: '162',
    solution: 'كل عدد يضرب في 3: 2×3=6، 6×3=18، 18×3=54، 54×3=162',
    difficulty: 'hard',
    topic: 'المتتاليات المتقدمة',
    unit: 'المتتاليات',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-5-pattern-2',
    question: 'أكمل النمط: 1, 4, 9, 16, ___',
    options: ['20', '25', '30', '36'],
    answer: '25',
    solution: 'هذه أعداد مربعة: 1²=1، 2²=4، 3²=9، 4²=16، 5²=25',
    difficulty: 'medium',
    topic: 'الأعداد المربعة',
    unit: 'المضاعفات والأعداد المربعة والعوامل',
    grade: 5,
    subject: 'math'
  }
];

// Science Experiments for Grade 5 Math (تجارب علمية مرتبطة بالرياضيات)
export const grade5MathExperiments = [
  {
    id: 'math-exp-5-1',
    title: 'قياس المساحة باستخدام المربعات',
    objective: 'فهم مفهوم المساحة من خلال العد والقياس',
    materials: ['ورق مربعات', 'مسطرة', 'أشكال مختلفة', 'قلم رصاص'],
    procedure: [
      'ارسم مستطيلاً على ورق المربعات',
      'عد المربعات داخل المستطيل',
      'احسب المساحة باستخدام القانون: الطول × العرض',
      'قارن النتيجتين'
    ],
    conclusion: 'المساحة يمكن حسابها بالعد أو بالضرب، والنتيجة نفسها',
    safetyNotes: ['استخدم الأدوات بحذر'],
    topic: 'المساحة',
    unit: 'المساحة والمحيط',
    grade: 5,
    subject: 'math'
  },
  {
    id: 'math-exp-5-2',
    title: 'استكشاف الأعداد العشرية باستخدام النقود',
    objective: 'فهم الأعداد العشرية من خلال التطبيق العملي',
    materials: ['عملات معدنية', 'أوراق نقدية', 'آلة حاسبة', 'ورقة وقلم'],
    procedure: [
      'اجمع مبالغ مختلفة من النقود',
      'اكتب كل مبلغ كعدد عشري',
      'اجمع واطرح مبالغ مختلفة',
      'تحقق من النتائج'
    ],
    conclusion: 'الأعداد العشرية تساعدنا في التعامل مع النقود والقياسات الدقيقة',
    safetyNotes: ['احتفظ بالنقود في مكان آمن'],
    topic: 'الأعداد العشرية',
    unit: 'الأعداد العشرية',
    grade: 5,
    subject: 'math'
  }
];