/**
 * 北大社会学考研RPG - Day 1 内容数据
 * 觉醒之夜 - 温暖的考研陪伴之旅
 */

const Day01Content = {
  // ========== 章节元数据 ==========
  meta: {
    id: 'day01',
    title: '觉醒之夜',
    subtitle: '温暖的考研陪伴',
    chapterNumber: 1,
    difficulty: '🌱',
    estimatedTime: '15-20分钟',
    keywords: ['社会学导论', '学科定位', '社会学想象力', '实证主义'],
    prerequisites: [],
    unlocks: ['day02'],
    version: '2.0.0'
  },

  // ========== 章节简介 ==========
  synopsis: {
    short: '温暖的考研夜里，你将遇见社会学这个有趣的朋友~',
    full: `夜深了，但你不孤单。
社会学像一个温暖的老朋友，正在等你打开心扉。
这一次，让我们用好奇的眼睛，重新看看这个世界...`
  },

  // ========== 场景定义 ==========
  scenes: [
    {
      id: 'scene_desk',
      name: '温暖的书桌·研考前夜',
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 50%, #FFDAB9 100%)',
      atmosphere: '温暖治愈的夜晚氛围',
      colorScheme: {
        bgPrimary: '#FFF8F0',
        bgSecondary: '#FFE8D6',
        accent: '#FF9F43',
        success: '#4CAF50',
        text: '#5D4E37'
      },
      elements: [
        {
          type: 'prop',
          id: 'desk_lamp',
          name: '可爱的小台灯',
          emoji: '💡',
          position: { x: '70%', y: '30%' },
          description: '发出暖暖黄光的护眼台灯',
          interactive: true
        },
        {
          type: 'prop',
          id: 'sociology_book',
          name: '社会学概论',
          emoji: '📚',
          position: { x: '45%', y: '55%' },
          description: '明天考试要用到的参考书~',
          interactive: true,
          glowEffect: true
        },
        {
          type: 'prop',
          id: 'suicide_note',
          name: '《自杀论》',
          emoji: '📕',
          position: { x: '80%', y: '70%' },
          description: '一本有些旧的学术书，似乎不属于考研书单...',
          easterEgg: true,
          easterEggMessage: '🔮 【彩蛋发现！】\n\n《自杀论》——涂尔干的经典之作！\n\n这本书在社会学历史上可是大名鼎鼎~\n它在悄悄暗示着什么...\n\n✨ 线索已记录：这个彩蛋可能在Day 12解开哦！'
        },
        {
          type: 'prop',
          id: 'calendar',
          name: '倒计时日历',
          emoji: '📅',
          position: { x: '85%', y: '20%' },
          description: '考研倒计时100天！',
          easterEgg: true,
          easterEggMessage: '📅 【彩蛋发现！】\n\n日历上画满了小红心和小星星~\n旁边写着："100天后，北大见！" 💕\n\n还有一行小字："第50天会有特别挑战哦~\"\n\n✨ 线索已记录！'
        },
        {
          type: 'prop',
          id: 'photo',
          name: '北大照片',
          emoji: '🖼️',
          position: { x: '15%', y: '25%' },
          description: '墙上的北大校园照片，激励着你',
          easterEgg: true,
          easterEggMessage: '🖼️ 【彩蛋发现！】\n\n是北大的博雅塔！\n照片下面写着一行字：\n" someday is now "\n\n✨ 成就解锁：🌟 梦想的起点 🌟'
        },
        {
          type: 'prop',
          id: 'coffee_cup',
          name: '温热的牛奶',
          emoji: '🥛',
          position: { x: '30%', y: '50%' },
          description: '不是咖啡啦，妈妈给的热牛奶~'
        },
        {
          type: 'prop',
          id: 'clock',
          name: '小闹钟',
          emoji: '⏰',
          position: { x: '85%', y: '15%' },
          description: '22:30，今晚早点睡~'
        },
        {
          type: 'prop',
          id: 'sticker',
          name: '励志贴纸',
          emoji: '✨',
          position: { x: '20%', y: '60%' },
          description: '写着"你很棒！加油鸭~"'
        },
        {
          type: 'prop',
          id: 'plant',
          name: '小绿植',
          emoji: '🌱',
          position: { x: '75%', y: '65%' },
          description: '陪你一起熬夜的小多肉'
        }
      ],
      ambientSound: 'soft_rain',
      lighting: 'warm_lamp'
    },
    {
      id: 'scene_awakening',
      name: '无知之海·星空下',
      background: 'linear-gradient(180deg, #2C3E50 0%, #3498DB 30%, #85C1E9 60%, #F8F9FA 100%)',
      atmosphere: '充满希望的星海，知识的海洋',
      elements: [
        {
          type: 'npc',
          id: 'guide',
          name: '引路人',
          position: { x: '50%', y: '60%' },
          description: '一位温柔可亲的学长/学姐，眼中带着温暖的光',
          sprite: 'guide_avatar',
          dialogueAvailable: true
        },
        {
          type: 'prop',
          id: 'sea_particles',
          name: '知识星星',
          emoji: '⭐',
          position: { x: '0%', y: '0%' },
          description: '漂浮在空中的可爱星星~'
        },
        {
          type: 'prop',
          id: 'ancient_building',
          name: '知识殿堂',
          emoji: '🏛️',
          position: { x: '80%', y: '40%' },
          description: '远方隐约可见的温暖建筑'
        }
      ],
      ambientSound: 'gentle_wind',
      lighting: 'starlight'
    }
  ],

  // ========== NPC定义 ==========
  npcs: {
    guide: {
      id: 'guide',
      name: '引路人',
      title: '社会学学长/学姐',
      avatar: '🎓',
      description: '一位已经上岸的北大社会学研究生，来帮助可爱的学弟学妹~',
      personality: {
        tone: '温暖鼓励型',
        traits: ['温柔', '耐心', '有点俏皮'],
        speechStyle: '用简单的比喻，喜欢鼓励人'
      },
      firstMeetDialogue: {
        greeting: '嗨~欢迎来到社会学世界！我是你的引路人~',
        context: '别紧张！这不是考试，只是带你认识一个新朋友...'
      },
      abilities: ['授予新手装备', '解答基础问题', '指引前进方向'],
      quests: ['完成社会学入门测试']
    }
  },

  // ========== 对话内容 ==========
  dialogues: {
    // 温暖的开始
    opening: {
      id: 'opening',
      type: 'narrative',
      speaker: '旁白',
      content: `✨ 欢迎来到北大社会学考研RPG ✨

夜深了，房间里只有台灯暖暖的光~
桌上放着明天考试要用到的书，还有一杯妈妈给的热牛奶 🥛

今天，你决定再复习一会儿...
毕竟社会学真的很有趣呢！

你的目光在书桌上游移，看到了好多熟悉的小东西... 💕`,
      next: 'choice_desk'
    },
    
    choice_desk: {
      id: 'choice_desk',
      type: 'choice',
      speaker: '旁白',
      content: '你想先看看什么呢~？',
      choices: [
        { id: 'book', text: '📚 翻开社会学课本', next: 'observe_book' },
        { id: 'calendar', text: '📅 看看倒计时日历', next: 'easter_egg_calendar', flag: 'easter_egg_calendar' },
        { id: 'photo', text: '🖼️ 望一眼北大的照片', next: 'easter_egg_photo', flag: 'easter_egg_photo' },
        { id: 'suicide', text: '📕 角落那本旧书是什么？', next: 'easter_egg_suicide', flag: 'easter_egg_suicide' },
        { id: 'sleep', text: '😴 有点困了，休息一下吧', next: 'fall_into_dream' }
      ]
    },

    // 各种彩蛋对话
    easter_egg_calendar: {
      id: 'easter_egg_calendar',
      type: 'easter_egg',
      speaker: '旁白',
      content: `📅 【彩蛋发现！】

日历上画满了可爱的小红心和小星星 ⭐
每一格都认真地标记着学习进度~

旁边写着大大的字：
🎯 "考研倒计时 100 天！"

还有一行小字引起了你的注意：
💬 "第50天会有特别挑战哦~ 期待！"

这是谁写的呢？好像是...你自己的字迹？

✨ 线索已记录！`,
      achievement: '📅 倒计时开启',
      achievementId: 'calendar_countdown',
      next: 'choice_desk_return'
    },

    easter_egg_photo: {
      id: 'easter_egg_photo',
      type: 'easter_egg',
      speaker: '旁白',
      content: `🖼️ 【彩蛋发现！】

墙上的相框里，是北大的博雅塔！
照片拍得很美，是梦想中的样子呢~ 💕

照片下面写着一行字：
" someday is now "

✨ 成就解锁：🌟 梦想的起点 🌟
✨ 获得勇气值 +10！`,
      achievement: '🌟 梦想的起点',
      achievementId: 'dream_start',
      next: 'choice_desk_return'
    },

    easter_egg_suicide: {
      id: 'easter_egg_suicide',
      type: 'easter_egg',
      speaker: '旁白',
      content: `📕 【彩蛋发现！】

是一本有些旧的《自杀论》~
这不是考研书单上的书呢，是从哪里来的？

翻开扉页，看到一行褪色的字：

📖 "社会事实不是由个人意志决定的，
   而是具有外在性的客观存在。"
   —— 埃米尔·涂尔干

这本书似乎在暗示着什么...
也许在之后的某个章节，会用到它？

✨ 线索已记录：这个彩蛋可能在 Day 12 解开哦！`,
      achievement: '🔮 涂尔干的暗示',
      achievementId: 'clue_suicide',
      next: 'choice_desk_return'
    },

    choice_desk_return: {
      id: 'choice_desk_return',
      type: 'choice',
      speaker: '旁白',
      content: '继续探索你的小窝~',
      choices: [
        { id: 'book', text: '📚 还是看课本吧', next: 'observe_book' },
        { id: 'sleep', text: '😴 准备休息一下', next: 'fall_into_dream' }
      ]
    },

    observe_book: {
      id: 'observe_book',
      type: 'narrative',
      speaker: '旁白',
      content: `📚 你翻开社会学课本~

封面上写着：
"社会学 —— 让你用全新的眼光，看待身边的世界 ✨"

目录里有很多有趣的章节：
• 什么是社会学？
• 社会学看世界的方式
• 社会学的想象力
• 社会分层与流动

看着看着...
突然，书页发出柔和的蓝色光芒！`,
      hint: '是社会学在召唤你哦~',
      next: 'fall_into_dream'
    },

    fall_into_dream: {
      id: 'fall_into_dream',
      type: 'transition',
      speaker: '旁白',
      content: `✨ 你感到一阵温柔的困意袭来... ✨

在闭上眼睛的瞬间，你听到了一个温暖的声音：

🌟 "嘿~ 想不想来社会学世界玩一玩？"

蓝色的光芒将你轻轻包裹...
你感觉自己像羽毛一样飘了起来~

当你再次睁开眼睛...
来到了一个充满星星的神奇世界... 🌌`,
      next: 'scene_transition_awakening'
    },

    // 场景转换
    scene_transition_awakening: {
      id: 'scene_transition_awakening',
      targetScene: 'scene_awakening',
      title: '🌌 无知之海',
      type: 'scene_transition',
      content: `✨ 你睁开眼睛，发现自己漂浮在一片星空之中！ ✨

无数的星星在身边闪烁 🌟
每一颗都像是一个知识点~


脚下是透明的彩虹桥，通向远方...

远处，一座温暖光芒的建筑若隐若现 🏛️

你听到身后传来轻轻的脚步声...`,
      next: 'guide_appearance'
    },

    // 引路人出场
    guide_appearance: {
      id: 'guide_appearance',
      type: 'dialogue',
      speaker: '引路人',
      npc: 'guide',
      content: `🎓 "嗨~欢迎来到社会学世界！"

一位戴着眼镜、笑容温暖的学长/学姐出现在你面前！

🎓 "我是引路人，你可以叫我学长/学姐~"
🎓 "别紧张！这不是考试哦，只是带你认识一个新朋友..."

他从身后拿出一本闪闪发光的小册子：

📘 "这是《社会学入门手册》，送给你！"
📘 "还有这个——👁️ 洞察之眼！戴上它，你就能看到不一样的世界~"`,
      next: 'guide_explain_world'
    },

    guide_explain_world: {
      id: 'guide_explain_world',
      type: 'dialogue',
      speaker: '引路人',
      npc: 'guide',
      content: `🎓 "在这片无知之海里，散布着很多知识星星~"

他指着远方温暖光芒的建筑：

🏛️ "那是知识殿堂 —— 北大社会学考研的圣地！"

🎓 "别担心路程遥远，我们会一步步来~"
🎓 "就像你考研一样，每天进步一点点，100天后就是全新的自己！"

他的眼睛弯成月牙：

💬 "对了，你注意到日历上的'第50天特别挑战'吗？"
💬 "那是我们的小秘密哦~ 期待吧！"`,
      next: 'tutorial_start'
    },

    tutorial_start: {
      id: 'tutorial_start',
      type: 'dialogue',
      speaker: '引路人',
      npc: 'guide',
      content: `🎓 "好啦，让我们开始今天的小测试吧~"

他伸出手，三颗可爱的星星浮现在掌心 ⭐⭐⭐

🎓 "回答3个小问题，就能获得奖励哦！"
🎓 "答错了也没关系，重要的是学到知识~"

⭐ 每答对一题：+💡 知识碎片
⭐ 全部答对：+👁️ 洞察之眼（进阶版）
⭐ 收集线索：+🔮 解锁隐藏剧情

🎓 "准备好了吗？让我们开始吧！"`,
      next: 'quest_start',
      unlocks: {
        abilities: ['社会学入门手册', '洞察之眼'],
        items: ['新手装备礼包']
      }
    },

    quest_start: {
      id: 'quest_start',
      type: 'quest_start',
      questId: 'day01_tutorial',
      questName: '社会学入门测试 ✨',
      description: '回答3个有趣的问题，认识社会学的魅力~',
      rewards: [
        { type: 'exp', value: 100, emoji: '⭐', description: '经验值 +100' },
        { type: 'ability', name: '洞察之眼', emoji: '👁️', description: '看穿社会现象背后的秘密' },
        { type: 'item', name: '社会学入门手册', emoji: '📘', description: '基础知识随身指南' },
        { type: 'unlock', target: 'day02', emoji: '🔓', description: '解锁 Day 2' }
      ],
      next: 'question_1'
    }
  },

  // ========== 题目数据 ==========
  questions: [
    {
      id: 'q1_discipline',
      type: 'choice',
      title: '🎯 社会学的诞生',
      question: '「社会学作为一门独立学科的标志是什么呢？」',
      difficulty: 1,
      points: 30,
      feedback: {
        correct: '🎉 正确！太棒了！',
        wrong: '🤔 差一点哦~来看看解析吧！'
      },
      options: [
        { id: 'A', text: '📗 孔德的《实证哲学教程》', isCorrect: true },
        { id: 'B', text: '📘 斯宾塞的《社会学原理》', isCorrect: false },
        { id: 'C', text: '📙 "社会学"这个词的出现', isCorrect: false },
        { id: 'D', text: '📕 涂尔干的《社会学研究方法论》', isCorrect: false }
      ],
      explanation: `✨ 【正确答案：A】✨

📗 孔德的《实证哲学教程》（1838年）

孔德爷爷可是社会学的老前辈呢！他第一次系统地提出了"社会学"这个概念~

📌 小贴士：
• 斯宾塞的《社会学原理》虽然也很重要，但是比孔德晚一些
• "社会学"这个词最早是别人提的，但孔德把它变成了真正的学问
• 涂尔干大大聚焦在方法论上，贡献也很大哦！

💡 记住：社会学不是凭空出现的，是孔德把各种知识整合起来，创立了这门学科！`,
      hint: '💭 想想看：谁最先系统地提出了社会学的研究方法？',
      knowledgePoint: '社会学的学科定位',
      relatedConcept: '实证主义'
    },
    {
      id: 'q2_perspective',
      type: 'matching',
      title: '🔗 社会学视角 vs 日常感觉',
      question: '🎮 请帮社会学视角和日常直觉找到它们的正确配对吧~',
      difficulty: 2,
      points: 35,
      feedback: {
        correct: '🎉 完美匹配！你很有社会学天赋！',
        wrong: '🤔 再想想看，它们有什么区别呢？'
      },
      matching: {
        left: [
          { id: 'L1', text: '🔬 社会学的视角', emoji: '🔬' },
          { id: 'L2', text: '💭 日常经验的视角', emoji: '💭' },
          { id: 'L3', text: '⚖️ 两者的关键差异', emoji: '⚖️' }
        ],
        right: [
          { id: 'R1', text: '🔍 看到行为背后的结构与制度', emoji: '🔍', correct: 'L1' },
          { id: 'R2', text: '👤 就事论事，关注个体', emoji: '👤', correct: 'L2' },
          { id: 'R3', text: '📊 客观、系统、去个人化', emoji: '📊', correct: 'L3' }
        ]
      },
      explanation: `✨ 【解析时间到！】✨

🔬 社会学视角：
• 戴上"洞察之眼"，看到表面背后的东西~
• 关注：制度、文化、群体是怎么影响人的
• 保持"科学家"的态度，客观观察

💭 日常经验视角：
• 用自己的感受去理解别人
• 关注：这个人为啥这么做
• 容易说："他就是这种人！"

💡 关键区别：
社会学追求"客观理解"，而日常经验往往带着主观感情~

就像看一个人失业：
• 日常："他不努力吧..."
• 社会学："这可能是整个就业结构的问题..."`,
      hint: '💭 想象你看到一个同学考试没考好，社会学怎么看？日常怎么看？',
      knowledgePoint: '社会学与日常经验的区别'
    },
    {
      id: 'q3_imagination',
      type: 'short_answer',
      title: '💡 社会学的想象力',
      question: `📝 【思考题】请回答：

1. 💬 什么是"社会学的想象力"？
2. 💡 为什么它对社会学很重要？

用温暖的方式写下你的理解吧~ ✨`,
      difficulty: 3,
      points: 35,
      feedback: {
        correct: '💖 你的回答很棒！',
        wrong: '💖 没关系，重要的是你在思考~'
      },
      modelAnswer: `✨ 【参考答案】✨

1️⃣ 社会学的想象力是什么？

🏆 这个概念来自美国社会学家 C.赖特·米尔斯

简单说就是：一种把"个人经历"和"社会结构"连接起来的能力！

💭 举个例子：
• 个人困扰："我考研好焦虑..."
• 社会议题："为什么现在这么多人考研？"
• 社会学想象力：把两者联系起来，看到"大环境"怎么影响"小我"~

2️⃣ 为什么重要？

🌟 超越个人局限：从"我"的视角变成"社会"的视角
🌟 理解背后原因：知道为什么事情会这样发生
🌟 批判性思考：不盲目接受，学会有自己的判断
🌟 连接宏微两端：明白大世界和小生活的关系

💕 记住：社会学的想象力，让我们成为更好的自己！`,
      rubric: [
        { criterion: '定义准确性', maxPoints: 10, description: '能说出想象力是什么' },
        { criterion: '核心内涵理解', maxPoints: 15, description: '理解个人困扰vs社会议题的关系' },
        { criterion: '重要性阐述', maxPoints: 10, description: '能说出2-3个重要性' }
      ],
      hint: '💭 想想你自己为什么决定考研？这和整个社会有什么关系？',
      knowledgePoint: '社会学的想象力',
      relatedConcept: ['个人困扰与公共议题', '米尔斯', '宏观与微观的连接']
    }
  ],

  // ========== 结局与奖励 ==========
  endings: {
    success: {
      id: 'ending_success',
      title: '🎊 测试完成！太厉害了！',
      type: 'success',
      content: `三颗星星在你面前绽放出璀璨的光芒！✨✨✨

引路人开心地鼓起了掌：

🎓 "太棒了！你对社会学有了很好的理解！"

他从口袋里掏出一枚闪闪发光的徽章：

🏆 "这是'社会学小达人'徽章，送给你！"

🎓 "记住今天学到的知识哦，它们会陪伴你整个考研旅程~"
🎓 "100天后的考试，你一定能行的！相信自己！" 💪

他的眼睛弯成月牙：

💬 "对了，如果你发现了书桌上那本《自杀论》..."
💬 "也许在第12天，它会派上用场哦~ 期待吧！"`,
      rewards: [
        { type: 'exp', value: 100, emoji: '⭐', description: '经验值 +100' },
        { type: 'ability', name: '洞察之眼', emoji: '👁️', description: '看穿社会现象背后的结构' },
        { type: 'item', name: '社会学入门手册', emoji: '📘', description: '基础知识随身指南' },
        { type: 'item', name: '社会学小达人徽章', emoji: '🏆', description: 'Day 1 毕业徽章' }
      ],
      unlocks: ['day02'],
      nextChapter: {
        id: 'day02',
        title: 'Day 2：实证之光',
        description: '学习社会学的实证主义传统~',
        hint: '准备好迎接新的冒险了吗？🌟'
      }
    },
    partial: {
      id: 'ending_partial',
      title: '💪 继续加油！',
      type: 'retry',
      content: `星星们的光芒有些黯淡了...

引路人温柔地拍了拍你的肩膀：

🎓 "没关系！学习本来就是一个慢慢来的过程~"

🎓 "要不要再试一次？或者先休息一下？"
🎓 "记住，考研路上你不是一个人！" 💕

他挥了挥手，你的星星们又重新亮了起来：

✨ "随时可以再来挑战哦~ 我在这里等你！"`,
      unlocks: ['day01_retry']
    }
  },

  // ========== 彩蛋数据 ==========
  easterEggs: [
    {
      id: 'easter_egg_suicide',
      name: '📕 涂尔干的遗产',
      description: '在书桌上发现《自杀论》',
      trigger: 'day01_scene_desk_examine_suicide',
      achievement: {
        name: '🔮 涂尔干的暗示',
        description: '这本书似乎在暗示着什么...'
      },
      hint: '💭 角落里有本不属于考研书单的书...',
      relatedQuestion: 'q1_discipline',
      futureChapter: 'day12',
      emoji: '🔮'
    },
    {
      id: 'easter_egg_calendar',
      name: '📅 倒计时开启',
      description: '发现考研倒计时日历',
      trigger: 'day01_look_calendar',
      achievement: {
        name: '📅 倒计时开始！',
        description: '100天后，北大见！'
      },
      hint: '💭 日历上有什么特别的信息吗？',
      futureChapter: 'day05',
      emoji: '📅'
    },
    {
      id: 'easter_egg_photo',
      name: '🖼️ 梦想的起点',
      description: '看到北大的照片',
      trigger: 'day01_look_photo',
      achievement: {
        name: '🌟 梦想的起点',
        description: 'someday is now'
      },
      hint: '💭 墙上的照片激励着你...',
      futureChapter: 'day01_ending',
      emoji: '🌟'
    },
    {
      id: 'easter_egg_guide_hint',
      name: '💬 第50天的约定',
      description: '引路人提到第50天',
      trigger: 'day01_guide_mentioned_50',
      achievement: {
        name: '💬 神秘约定',
        description: '第50天会有特别挑战...'
      },
      hint: '💭 引路人说了什么特别的话？',
      futureChapter: 'day05',
      emoji: '💬'
    }
  ],

  // ========== 游戏进度数据 ==========
  progress: {
    currentScene: 'scene_desk',
    completedScenes: [],
    discoveredEasterEggs: [],
    answeredQuestions: [],
    collectedItems: [],
    unlockedAbilities: [],
    flags: {
      hasSeenOpening: false,
      hasMetGuide: false,
      tutorialStarted: false,
      day01Complete: false
    }
  },

  // ========== 辅助函数 ==========
  helpers: {
    getQuestionById: function(id) {
      return this.questions.find(q => q.id === id);
    },
    
    getSceneById: function(id) {
      return this.scenes.find(s => s.id === id);
    },
    
    getNPCById: function(id) {
      return this.npcs[id];
    },
    
    getDialogueById: function(id) {
      return this.dialogues[id];
    },
    
    getEasterEggById: function(id) {
      return this.easterEggs.find(e => e.id === id);
    },

    getProgress: function() {
      return { ...this.progress };
    },

    updateProgress: function(updates) {
      Object.assign(this.progress, updates);
    },

    calculateCompletion: function(answers) {
      const totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
      const earnedPoints = answers.reduce((sum, a) => sum + (a.points || 0), 0);
      const percentage = Math.round((earnedPoints / totalPoints) * 100);
      
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'partial';
      return 'retry';
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Day01Content;
}
