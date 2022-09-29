export const state = () => ({
  helperData: {
    family_relation: ['مستقرة', 'غير مستقرة'],
    transReason: [
      {
        text: 'حصوله علي تقيم ملحوظ علي مقياس الصحه النفسيه',
        value: 1,
      },
      {
        text: 'نظرا للشكوي المقدمة من المجند بمركز تدريب',
        value: 2,
      },
      {
        text: 'نتيجة لما ظهر علي المجند من اعراض مرضية بمركز التدريب',
        value: 3,
      },
    ],
    marital_states: ['أعزب', 'متزوج', 'مطلق', 'أرمل'],
    appearance: ['لائق', 'غير لائق'],
    focus_ability: ['جيد', 'مشتت'],
    mood: ['معتدل', 'مكتئب', 'الرغبة بالبكاء', 'تهته'],
    parent_rel: [
      {
        text: 'متزوجان',
        value: 1,
      },
      {
        text: 'منفصلان',
        value: 2,
      },
      {
        text: 'الاب متوفي',
        value: 3,
      },
      {
        text: 'الام متوفيه',
        value: 4,
      },
      {
        text: 'الاب و الام متوفيان',
        value: 5,
      },
    ],
    moving: [
      { text: 'معتدل', value: 1 },
      { text: 'كثير الحركة', value: 2 },
      { text: 'تشنجات', value: 3 },
      { text: 'تخشب', value: 4 },
    ],
    faceExprission: [
      { text: 'معتدل', value: 1 },
      { text: 'حزن وكآبه', value: 2 },
      { text: 'انبساطيه', value: 3 },
      { text: 'تبلد', value: 4 },
    ],
    timeAware: [
      { text: 'مدرك', value: 1 },
      { text: 'غير مدرك', value: 2 },
    ],
    situationAware: [
      { text: 'جيده', value: 1 },
      { text: 'ضعيفة', value: 2 },
    ],
    judgeAbility: [
      { text: 'مستبصر', value: 1 },
      { text: 'غير مستبصر', value: 2 },
    ],
    awareDisorder: [
      { text: 'لا يوجد', value: 1 },
      { text: 'هلاوس سمعية', value: 2 },
      { text: 'هلاوس بصريه', value: 3 },
      { text: 'هلاوس شمية', value: 4 },
    ],
    thinkDisorder: [
      { text: 'لا يوجد', value: 1 },
      { text: 'تشتت الافكار', value: 2 },
      { text: 'توهم العظمه', value: 3 },
      { text: 'توهم المرض', value: 4 },
      { text: 'توهم الاضطهاد', value: 5 },
      { text: 'خوف مرضي', value: 6 },
      { text: 'وساوس افكار', value: 7 },
      { text: 'وساوس افعال', value: 8 },
    ],
    yesNo: [
      { text: 'لا يوجد', value: 1 },
      { text: 'نعم', value: 2 },
    ],
    family_income: [
      { text: 'عالي', value: 1 },
      { text: 'متوسط', value: 2 },
      { text: 'ضعيف', value: 3 },
    ],
    appetite: [
      { text: 'معتدل', value: 1 },
      { text: 'فقدان الشهية', value: 2 },
      { text: 'افراط في الاكل', value: 3 },
    ],
    sleeping: [
      { text: 'معتدل', value: 1 },
      { text: 'أرق', value: 2 },
      { text: 'الكلام اثناء النوم', value: 3 },
      { text: 'مشي اثناء النوم', value: 4 },
      { text: 'كوابيس', value: 5 },
    ],
    smoking: [
      { text: 'لا', value: 1 },
      { text: 'نعم', value: 2 },
    ],
    prayer: [
      { text: 'منتظم', value: 1 },
      { text: 'غير منتظم', value: 2 },
      { text: 'منقطع', value: 3 },
    ],
    interviewEntqaDone: [
      {
        text: 'تم عرضه على الفرع',
        value: 1,
      },
      {
        text: 'لم يتم عرضه على الفرع',
        value: 0,
      },
    ],
    recommendation: [
      {
        text: 'عرض مست نفسى فرع',
        comment:
          'يوصى فرع الإنتقاءوالتوجيه بعرض المجند على مست أحمد جلال العسكري للتأكد من صحة شكواه و موافتنا بنتائج العرض علي المستشفي و في حالة ترحيل المجند يتم ارسال وحدته و نقطة تمركزه',
        value: 1,
      },
      {
        text: 'عرض مست طبى كوبري القبه فرع',
        comment:
          'يوصى فرع الإنتقاءوالتوجيه بعرض المجند على مست كوبري القبه العسكري للتأكد من صحة شكواه و موافتنا بنتائج العرض علي المستشفي و في حالة ترحيل المجند يتم ارسال وحدته و نقطة تمركزه',
        value: 2,
      },
      {
        text: 'عرض مست طبى الحلميه فرع',
        comment:
          'يوصى فرع الإنتقاءوالتوجيه بعرض المجند على مست الحلميه العسكري للتأكد من صحة شكواه و موافتنا بنتائج العرض علي المستشفي و في حالة ترحيل المجند يتم ارسال وحدته و نقطة تمركزه',
        value: 3,
      },
      {
        text: 'موقف إقتصادى /إجتماعى',
        comment:
          'يوصى فرع الإنتقاءوالتوجيه بعودة المجند الي الوحده حيث انه لا يعاني من اي مشاكل نفسيه او طبيه حتي الان الا انه تآزمه مشكلة اقتصاديه قد تجعله عرضه للمرض النفسي لذا يرجي دراسة الحاله الاجتماعيه للمجند عن طريق ضابط الخدمه الاجتماعيه للوقوف علي حالته الاقتصاديه ومراعاة تلك الشكوه بواسطة وحدته في حالة تأكد من صحة شكواه',
        value: 4,
      },
      {
        text: 'عودة للوحدة',
        comment:
          'يوصي فرع الانتقاء و التوجيه بعودة المجند للوحده حيث انه لا يعاني من اي مشاكل نفسية او طبيه حتي الان و في حال ظهور اي اعراض علي المجند يتم تحويله لاقرب مست نفسي عسكري مع المتابعه الدوريه له و ارسال تقرير سلوكي عن حالته كل ثلاث شهور عن طريق وحدته المرحل عليها',
        value: 5,
      },
      {
        text: 'نفسى +إقتصادى',
        comment:
          'يوصى فرع الإنتقاءوالتوجيه بعرض المجند على مست أحمد جلال العسكري للتأكد من صحة شكواه و موافتنا بنتائج العرض علي المستشفي و في حالة ترحيل المجند يتم ارسال وحدته و نقطة تمركزه كما يوصي فرع الانتقاء و التوجيه دراسة الحاله الاجتماعيه للمجند عن طريق ضابط الخدمه الاجتماعيه للوقوف علي حالته الاقتصاديه ومراعاة تلك الشكوه بواسطة وحدته في حالة تأكد من صحة شكواه',
        value: 6,
      },
      {
        text: 'طبى+إقتصادى',
        comment:
          'يوصى فرع الإنتقاءوالتوجيه بعرض المجند على مست ......... طبي عسكري  للتأكد من صحة شكواه و موافتنا بنتائج العرض علي المستشفي و في حالة ترحيل المجند يتم ارسال وحدته و نقطة تمركزه كما يوصي فرع الانتقاء و التوجيه دراسة الحاله الاجتماعيه للمجند عن طريق ضابط الخدمه الاجتماعيه للوقوف علي حالته الاقتصاديه ومراعاة تلك الشكوه بواسطة وحدته في حالة تأكد من صحة شكواه',
        value: 7,
      },
    ],
    recommendation_res: [
      { text: 'منتظر عرض', value: 1 },
      { text: 'عودة للوحده', value: 2 },
      { text: 'رفت', value: 3 },
      { text: 'غياب', value: 4 },
      { text: 'موقف امني', value: 5 },
    ],
    report: [
      { text: 'مختبرين لكل مركز', value: 1 },
      { text: 'تقرير مجمع للمرحلة', value: 2 },
    ],
    final_hospital_result: ['لا يوجد', 'عودة للوحدة', 'رفت طبي', 'رفت نفسي'],

    qualification: [
      { name: 'عليا', value: 2 },
      { name: 'فوق متوسطة', value: 8 },
      { name: 'متوسطة', value: 1 },
      { name: 'عادة', value: 0 },
    ],
    examFinish: [
      { name: 'من انهوا', value: 1 },
      { name: 'من لم ينتهوا بعد', value: 0 },
    ],
    hasUnit: [
      { name: 'تم تسجيل وحدته', value: 1 },
      { name: 'لم يتم تسجيل وحدته', value: 0 },
    ],
    interview: [
      { name: 'تم عمل مقابلة لهم ', value: 1 },
      { name: 'لم يتم عمل مقابلة لهم', value: 0 },
    ],
    register: [
      { name: 'من تم تسجيلهم', value: 1 },
      { name: 'من لم يتم تسجيلهم', value: 0 },
    ],
    again: [
      { name: 'امتحن مره', value: 0 },
      { name: 'امتحن مرتين', value: 1 },
    ],
    isNoticed: [
      { name: 'تم تسجيلهم كملحوظين لاول مره', value: 1 },
      { name: 'تم تسجيلهم كملحوظ لثاني مره', value: 2 },
      { name: 'لم يتم تسجيلهم كملحوظين', value: 3 },
    ],
    speaking_disorder: ['معتدل', 'كثير الكلام', 'قليل الكلام', 'ضحك بدون سبب'],
    medicine_type: ['لا يوجد', 'نفسية', 'علاجية'],
    has_medical_history: ['نعم', 'لا'],
    final_opinion: [
      'عرضه علي المست من قبل المركز',
      'عرضه علي فرع الانتقاء و التوجيه',
      'لا يعاني من اي مشاكل',
    ],
    examiner_status: {
      'عرضه علي المست من قبل المركز': ['عرض مست طبي', 'عرض مست نفسي'],
      'عرضه علي فرع الانتقاء و التوجيه': [
        'لائق',
        'لا يوجد',
        'غياب',
        'ترحيل',
        'عرض مست طبي',
        'عرض مست نفسي',
      ],
      'لا يعاني من اي مشاكل': ['لائق'],
    },
    interviewers: [
      { text: 'نقيب / اميرة احمد سليمان', value: 1 },
      { text: 'رائد / نجوى أبوبكر', value: 2 },
      { text: 'أخصائى نفسى / شيماء الشحات', value: 3 },
      { text: 'رائد / ولاء سيد', value: 4 },
      { text: 'مقدم / أميرة نبيل', value: 5 },
      { text: 'اخصائي نفسي/ آيه أحمد', value: 6 },
      { text: 'نقيب / بسنت محمود', value: 7 },
      { text: 'نقيب / مروة احمد السيد', value: 8 },
      { text: 'رائد/ مي محمود', value: 9 },
      { text: 'م أ/ دينا رضا', value: 10 },
      { text: 'نقيب / سهام', value: 11 },
      { text: 'عقيد/ حنان', value: 12 },
    ],
    noticedActions: [
      { text: 'ملحوظ لاول مره', value: 1 },
      { text: 'تم اعادة الاختبار', value: 2 },
      { text: 'ملحوظ لثاني مره', value: 3 },
    ],
    endfa: [
      ' محاولة تكرار السلوك الإنتحارى والتفكير به',
      ' الشعور بالألم النفسى الشديد لـ ............... مصحوب بإكئاب تفاعلى .',
      ' سهولة الإستثارة والإندفاعية والغضب والإستهانه بسلامه نفسه .',
      ' غير قادر على تحمل المسئولية .',
      ' تحمل منخفض للإحباط والضغوط ممايعكس عدم قدرته على مواجهه مشكلاته .',
      ' ضعف قدرته على الضبط الذاتى يظهر غالباً فى صورة إنفجار للعدوان البدنى .',
      ' نقص النضج وغيركفء وإعتمادى .',
      ' علاقته سطحيه بالآخرين .',
      ' أفكار متكررة عن الموت أو التفكير فى الإنتحار .',
      ' لديه نزعه مستمرة لأن يقع فى المشاكل .',
      ' لديه تاريخ من التوافق الإجتماعى اللاسوى .',
      ' ضعف قدرته فى الحكم على الأمور تحت الضغوط .',
      ' نقص تقدير الذات .',
      ' يعانى من البلاده الإنفعاليه وغياب الشعور بالذنب وعدم الإكتراث بمشاعر الآخرين .',
      ' إستجابه سلوكيه مبالغ فيها عند مواجهه المواقف الضاغطة .',
      ' العجز عن الإمتثال للمعايير الإجتماعية .',
      ' عدم إكتراثه بالعواقب الإجتماعيه لسلوكه وغالباً مايصطدم بصعوبات إجتماعية وقانونية بسبب ضعف حكمه على الأمور ومشكلته فى المنطق والتفكير .',
      ' محاوله تكرار السلوك الإنتحارى لتحقيق مكسب ثانوى .',
    ],
    shchezo: [
      'التبديل السريع بين الإنبساطية والأعراض الإكتئابية',
      'يعانى من إضطراب بالإدراك تمثل فى صورة هلاوس (..................)',
      'إحتمال وجود إضطراب بالتفكير ذو ملامح هوسية .',
      'يعانى من إضطراب فى محتوى التفكير من خلال إضطراب توهم الإضطهاد/العظمه والذى فيه يعتقد بأن',
      'يعانى من الإنشغال بالتفكير حول موضوع معين يطغى على سائر الموضوعات الأخرى .',
      'يعانى من ضغط بالافكار وفيه محتوى التفكير يكون كثير وكأنه فى حاله ضغط مستمر .',
      'يشكو من إقحام الأفكار حيث أنه يرى أن الأفكار توضع فى رأسه دون إرادته .',
      'بفقد شعوره بشخصيته وكأنه تغير واصبح شخصاً آخر .',
      'يعانى من الشك فى الآخرين من حوله .',
      'الإعتقاد فى التخاطر والسحر مما يعكس إعتقاده بأن لديه خبرات إدراكية غير عادية .',
      'تتسم شخصية المفحوص بالإجتماعية والإنبساطيه مما يجعل وجوده ظاهراً فى أى موقف إجتماعى .',
      'الثرثره والإندفاعية والقابلية للهياج والإستثارة مما يعكس عدم ثباته الإنفعالى .',
      'تغيير إستجابته الإنفعاليه بسرعه من حاله الضحك بدون سبب إلى الكآبه الشديدة .',
      'المفحوص لا يستطيع التركيز على المعنى أو الفكرة المطلوبه وإظهارها بوضوح .',
      'الإنتقال من موضوع إلى آخر دون إكمال الموضوع الاول .',
      'التشتت بالأفكار وتداخلها دون ترابط منطقى .',
      'الشك بأن الآخرين يحاولون إيقاع الأذى به وخداعه .',
      'شك فى الآخرين وإنعدام الثقه فيهم .',
    ],
    depression: [
      'يعانى من العزله والإنزواء الإجتماعى مما يعكس النقص فى المهارات الإجتماعية .',
      'نقص تقدير الذات مما يعكس نقص الدافعية والمثابرة لإتمام المطلوب منه .',
      'الإحساس بالذنب ومحاوله إذاء نفسه .',
      'مزاج مكتئب ،ونقص الإستمتاع بالأنشطه ، ضعف ثقته بنفسه .',
      'ضعف الإهتمام بالجنس الآخر نظراً لقلقه وخوفه من الفشل .',
      'عجزه عن إتخاذ القرارات .',
      'التشاؤم بشأن المستقبل والشعور بفقدان الأمل .',
      'بناء نفسى ضعيف حيث إتسمت إستجابته الإنفعاليه بالبكاء المستمر أثناء المقابله الإكلينيكية .',
      'مظاهر من الضيق والقلق والتجهم على تعبيرات وجهه .',
      'العجز عن التخطيط للمستقبل والتمركز حول الذات .',
      'الإعتمادية والسلبية .',
      'عدم قدرته على مواجهه مشكلاته .',
      'عدم قدرته على تحمل الإحباطات .',
      'تعب بسرعه من أقل مجهود .',
      'ضعف الشهيه وقله النوم .',
      'يفتقد التواصل البصرى مع الفاحص أثناء المقابلة الإكلينيكية .',
      'الإقتضاب بالكلام وقلته .',
      'ضعيف الحكم تحت الضغوط .',
      'شخصيه تجنبية تميل للإنسحاب والعزله  وتفضيل الأنشطة الفردية مما قد يزيد من حده أعراضه .',
      'شعوره بالظلم والإضطهاد من قبل الآخرين .',
      'أفكار تخص الإنتحار بدون جديه .',
      'توتر وقلق يؤديان لأعراض نفسجسميه مثل .......... ',
      'ظهور بعض الملامح الهيستيريه مثل نقص النضج والإعتماديه والتمركز حول الذات .',
    ],
  },
})
export const getters = {
  helperData(state) {
    return state.helperData
  },
}
