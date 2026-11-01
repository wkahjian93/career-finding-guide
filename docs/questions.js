/* The Career Finding Guide questions, in the order of the original Google Form.
   Answers are stored as one string in this order, so a wording can be changed but an item
   must not move, or older results will be scored wrongly. */
const CFG_TYPES = ['R', 'I', 'A', 'S', 'E', 'C'];

const CFG_SECTIONS = [
  {
    id: 1, name: 'Activities', zh: '活动', kind: 'yesno',
    intro: 'Choose 1 for activities you would like to do. Choose 0 for activities you dislike or feel indifferent to.',
    introZh: '选 1 表示你喜欢的活动，选 0 表示你不喜欢或不感兴趣的活动。',
    yes: 'Like', yesZh: '喜欢', no: 'Not for me', noZh: '不喜欢',
    groups: {
      R: [['Repair cars', '修理汽车'], ['Build things with wood', '做木工'], ['Drive a truck or tractor', '驾驶货车或拖拉机'], ['Fix mechanical things', '修理机器'], ['Use metal working or machine tools', '使用金工机床'], ['Take a woodworking course', '修读木工课程'], ['Work on a motorcycle', '修理电单车'], ['Fix electrical things', '修理电器'], ['Take an auto mechanic course', '修读汽车机械课程']],
      I: [['Read scientific books or magazines', '阅读科学书刊杂志'], ['Work in a laboratory', '在实验室工作'], ['Work on a scientific project', '参与科研工作'], ['Read specialist subjects on my own', '自发阅读专家论著'], ['Solve math or chess puzzles', '解答数学或棋类游戏难题'], ['Take a physics course', '修读物理课程'], ['Take a chemistry course', '修读化学课程'], ['Take a geometry course', '修读几何课程'], ['Take a biology course', '修读生物课程']],
      A: [['Create portraits, photographs or drawings', '素描、摄影或绘画'], ['Practise a musical instrument', '演奏乐器'], ['Design furniture or buildings', '设计家具或建筑'], ['Play in a band, group or orchestra', '参与乐队或交响乐团演奏'], ['Go to recitals or concerts', '出席朗诵会或音乐会'], ['Read plays', '读剧本'], ['Read or write poetry', '欣赏或写诗'], ['Take an art course', '进修艺术课程']],
      S: [['Write letters to friends', '写信给朋友'], ['Belong to social clubs', '参加社交组织'], ['Help others with personal problems', '帮助他人解决个人问题'], ['Take care of children', '照顾小孩'], ['Go to parties or dances', '参加舞会或聚会'], ['Read psychology books', '读心理学书籍'], ['Attend meetings and conferences', '出席座谈会或研讨会'], ['Go to sports events', '观看体育比赛'], ['Make new friends', '结交新朋友']],
      E: [['Influence others', '影响他人'], ['Sell something', '推销货品'], ['Discuss politics', '评论政治'], ['Operate my own services or business', '自己开业'], ['Attend conferences', '出席研讨会'], ['Give talks', '演讲'], ['Supervise the work of others', '监督别人工作'], ['Meet important people', '会见重要人物'], ['Lead a group to accomplish a goal', '领导组员达成目标']],
      C: [['Keep my desk and room neat', '把自己的工作台和房间收拾干净'], ['Type papers or letters', '打文件或信件'], ['Add, subtract, multiply and divide numbers in business or bookkeeping', '计算与生意或簿记有关的数字'], ['Operate business machines of any kind', '操作各种商用机器'], ['Keep detailed records of expenses', '维持开销的详细记录'], ['Take a typewriting course', '修打字课程'], ['Take a business course', '修读商科课程'], ['Take a commercial math course', '修读商用数学课程'], ['File letters, reports, records etc.', '把文件、报告、记录等归档']]
    }
  },
  {
    id: 2, name: 'Competencies', zh: '能力', kind: 'yesno',
    intro: 'Choose 1 for things you can already do well or competently. Choose 0 for things you have never done or can only do poorly.',
    introZh: '选 1 代表你有能力做或已经办得很好的事，选 0 代表你从来没有做过或办得很差的事。',
    yes: 'Can do', yesZh: '做得到', no: 'Cannot yet', noZh: '做不到',
    groups: {
      R: [['I know how to use a voltmeter', '我会使用电压计'], ['I have operated power tools such as a drill press, grinder or sewing machine', '我会使用电动工具如电钻、磨床或缝纫机'], ['I can refinish varnished or stained furniture or woodwork', '我能翻新陈旧或污染的家具'], ['I can read blueprints', '我能看蓝图'], ['I can repair furniture', '我能维修家具'], ['I can make mechanical drawings', '我会机械制图'], ['I can make simple repairs on a TV set', '我会做简单的电视修理'], ['I can make simple plumbing repairs', '我会做简单的排水管修理']],
      I: [['I understand how a vacuum tube works', '我明白真空管的原理'], ['I understand the “half life” of a radioactive element', '我明白放射性元素的半衰期'], ['I can use logarithm tables', '我会使用对数表'], ['I can use a microscope', '我会使用显微镜'], ['I can identify three constellations of stars', '我能辨认三个星座'], ['I can describe the function of white blood cells', '我能叙述白血球的功能'], ['I can interpret simple chemical formulas', '我能解释简单的化学方程式'], ['I understand why man-made satellites do not fall to earth', '我知道为什么人造卫星不会掉下来'], ['I have participated in a science fair or contest', '我曾参加过科学博览或竞赛']],
      A: [['I can play a musical instrument', '我会演奏乐器'], ['I can participate in two- or four-part choral singing', '我能参加二或四重唱的合唱团'], ['I can perform as a musical soloist', '我能独唱或独奏'], ['I can act in a play', '我能演戏'], ['I can sketch people so that they can be recognised', '我能画人物素描而画得很像'], ['I can do a painting or sculpture', '我能作画或雕塑'], ['I can make pottery', '我能造陶器'], ['I can design clothing, posters or furniture', '我能设计服装、海报或家具'], ['I write stories or poetry well', '我小说和诗都写得不错']],
      S: [['I am good at explaining things to others', '我善于向人解说'], ['I have participated in fund-raising drives', '我曾参加募捐活动'], ['I am competent at entertaining people older than I am', '我善于应酬年纪比我大的人'], ['I can be a good host or hostess', '我是个好主人'], ['I can teach children easily', '我善于教导小孩子'], ['I am good at helping people who are troubled or upset', '我善于帮助有困难或情绪不好的人'], ['I have worked as a volunteer in a hospital, clinic or home', '我曾是医院、诊疗所、疗养院的志愿工作者'], ['I can plan work or church social events', '我能策划教会或社会工作'], ['I am a good judge of personality', '我善于判断人的个性']],
      E: [['I have been elected to an office in secondary school, pre-university, college or university', '我曾在中学/高中/初级学院/大学被选为同学组织执委'], ['I can supervise the work of others', '我能监督他人的工作'], ['I have unusual energy and enthusiasm', '我有过人的精力和热忱'], ['I am good at getting people to do things my way', '我有办法让别人以我的方法办事'], ['I am good at selling ideas to people', '我擅长于将我的想法推销给别人'], ['I have organised a club or activities', '我曾经组织过俱乐部或其他活动'], ['I have started my own business or organisation', '我已开创了自己的事业或机构'], ['I know how to be a successful leader', '我知道如何成为一个成功的领导者'], ['I am a good debater', '我善于辩论']],
      C: [['I can type 40 words per minute', '我每分钟能打40个字'], ['I can operate a photocopier or fax machine', '我会使用影印机或传真机'], ['I can take shorthand', '我能速记'], ['I have held an office job', '我曾担任白领工作'], ['I can use an adding machine', '我会使用计算机'], ['I can do a lot of paperwork in a short time', '我能够在短时间内完成很多的文书工作'], ['I can operate a personal computer', '我能够使用个人电脑'], ['I can post credits and debits', '我会簿记'], ['I can keep accurate records of payments or sales', '我能精确地记录买卖账目']]
    }
  },
  {
    id: 3, name: 'Occupations', zh: '职业', kind: 'yesno',
    intro: 'This is about your feelings toward different occupations. Do not worry about whether you have the qualifications. Choose 1 if it appeals to you. Choose 0 if you dislike it or find it uninteresting.',
    introZh: '这里收集你对各项职业的感受和态度，不必考虑你是否具有相关的资格。选 1 表示该工作对你有吸引力，选 0 表示你不喜欢或不感兴趣。',
    yes: 'Appeals', yesZh: '有吸引力', no: 'Not for me', noZh: '不感兴趣',
    groups: {
      R: [['Airplane mechanic', '飞机技工'], ['Auto mechanic', '汽车技工'], ['Carpenter', '木匠'], ['Bulldozer operator', '推土机司机'], ['Surveyor', '调查员或测量员'], ['Construction inspector', '工地督察员'], ['Radio operator', '无线电通讯员'], ['Petrol station worker', '加油站工人'], ['Tree surgeon', '树木医生'], ['Lorry driver', '货车司机'], ['Machinist', '机械师'], ['Engineer', '工程师']],
      I: [['Meteorologist', '气象员'], ['Biologist', '生物学家'], ['Astronomer', '天文学家'], ['Medical laboratory technician', '医药化验室技工'], ['Zoologist', '动物学家'], ['Chemist', '化学家'], ['Independent research scientist', '独立研究科学家'], ['Physicist', '物理学家'], ['Writer of scientific articles', '科技文章作者'], ['Editor of scientific articles', '科技刊物编辑'], ['Botanist', '植物学家'], ['Scientific research worker', '科研工作者']],
      A: [['Poet', '诗人'], ['Symphony conductor', '交响乐队指挥'], ['Musician', '音乐家'], ['Author', '作家'], ['Commercial artist', '广告美术员'], ['Freelance writer', '自由投稿人'], ['Journalist', '新闻工作者'], ['Portrait artist', '人像画家'], ['Concert singer', '音乐会演唱家'], ['Composer', '作曲家'], ['Playwright', '剧作家'], ['Cartoonist', '卡通画家']],
      S: [['Sociologist', '社会学家'], ['Secondary school teacher', '中学老师'], ['Juvenile delinquency expert', '少年犯罪问题专家'], ['Speech therapist', '语言治疗师'], ['Marriage counsellor', '婚姻辅导员'], ['School principal', '校长'], ['Social sciences teacher', '社会科学老师'], ['Director of a welfare agency', '福利工作主管'], ['Youth camp director', '青年营主管'], ['Personal counsellor', '个人辅导员'], ['Psychiatric case worker', '精神病人调查员'], ['Vocational counsellor', '职业辅导员']],
      E: [['Currency speculator', '货币投机者'], ['Buyer', '买办'], ['Advertising representative', '广告商营业代表'], ['Manufacturer’s representative', '厂家营业代表'], ['Television producer', '电视导播'], ['Hotel manager', '旅店经理'], ['Business executive', '业务执行员'], ['Restaurant manager', '餐馆经理'], ['Master of ceremonies', '礼仪负责人'], ['Salesperson', '促销人员'], ['Sports promoter', '体育促销商'], ['Sales manager', '营业经理']],
      C: [['Bookkeeper', '簿记员'], ['Business teacher', '商业教员'], ['Budget reviewer', '预算检查员'], ['Certified public accountant', '合格公共会计师'], ['Credit investigator', '信用调查员'], ['Court stenographer', '法庭速记员'], ['Bank teller', '银行出纳员'], ['Tax expert', '税务专家'], ['Inventory controller', '存货管理员'], ['IBM equipment operator', 'IBM 设备操作员'], ['Financial analyst', '金融分析师'], ['Cost estimator', '成本估值员']]
    }
  },
  {
    id: 4, name: 'Self-estimates', zh: '自我评估', kind: 'scale',
    intro: 'Rate yourself on each trait compared with people of your age. 1 is lowest and 7 is highest. Try not to give every trait the same rating.',
    introZh: '与同年龄的人比较，评估自己属于哪一等级。最差=1，最强=7。尽量避免在不同的项目给自己打同样的分数。',
    pages: [
      {name: 'Ability', zh: '才能', items: [['R', 'Mechanical ability', '机械才能'], ['I', 'Scientific ability', '科学知识'], ['A', 'Artistic ability', '艺术才华'], ['S', 'Teaching ability', '教学能力'], ['E', 'Sales ability', '推销能力'], ['C', 'Clerical ability', '文书能力']]},
      {name: 'Skill', zh: '技能', items: [['R', 'Manual skill', '手艺'], ['I', 'Math ability', '计算能力'], ['A', 'Musical ability', '音乐才华'], ['S', 'Friendliness', '友善程度'], ['E', 'Managerial skills', '管理技能'], ['C', 'Office skills', '文员事务技能']]}
    ]
  }
];

/* Flat list of items in answer order: {section, type, en, zh, kind} */
const CFG_ITEMS = [];
CFG_SECTIONS.forEach(s => {
  if (s.kind === 'yesno') CFG_TYPES.forEach(t => s.groups[t].forEach(q => CFG_ITEMS.push({section: s.id, type: t, en: q[0], zh: q[1], kind: 'yesno'})));
  else s.pages.forEach(p => p.items.forEach(q => CFG_ITEMS.push({section: s.id, type: q[0], en: q[1], zh: q[2], kind: 'scale'})));
});

if (typeof module !== 'undefined') module.exports = {CFG_TYPES, CFG_SECTIONS, CFG_ITEMS};
