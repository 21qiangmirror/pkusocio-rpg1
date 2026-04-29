# 北大社会学考研RPG - JavaScript引擎文件清单

## 📁 文件结构

```
pku-sociology-rpg/
├── js/
│   ├── core/                          # 核心引擎模块
│   │   ├── game-engine.js            # 游戏引擎 (约800行)
│   │   ├── narrative-system.js       # 叙事系统 (约600行)
│   │   ├── quiz-system.js            # 题目系统 (约700行)
│   │   ├── progress-tracker.js       # 进度追踪 (约600行)
│   │   └── puzzle-engine.js          # 解谜引擎 (已存在)
│   ├── config/                        # 配置模块
│   │   └── eggs-config.js            # 彩蛋配置 (约400行)
│   └── main.js                        # 主入口 (约500行)
└── css/
    └── theme-variables.css            # 暖色调主题变量
```

## 📊 代码统计

| 文件 | 行数 | 功能描述 |
|------|------|----------|
| game-engine.js | ~800 | 状态管理、存档、成就、等级系统 |
| narrative-system.js | ~600 | 对话、场景切换、音效、角色立绘 |
| quiz-system.js | ~700 | 题目渲染、答案验证、论述题评分 |
| progress-tracker.js | ~600 | 100天可视化、知识点追踪、统计面板 |
| eggs-config.js | ~400 | 隐藏彩蛋、北大彩蛋、真题彩蛋配置 |
| main.js | ~500 | 入口初始化、路由、UI交互 |
| **总计** | **~3600** | 完整RPG游戏引擎 |

---

## 🎨 暖色调配色方案

```css
/* 主色调 */
--color-primary: #FF9F43;      /* 暖橙 */
--color-secondary: #F8B500;    /* 琥珀 */
--color-accent: #FF6B6B;       /* 珊瑚红 */

/* 强调色 */
--color-success: #4CAF50;      /* 成功绿 */
--color-mint: #00D9C0;         /* 薄荷绿 */

/* 背景渐变 */
--bg-gradient-start: #FFF8F0;  /* 暖白 */
--bg-gradient-end: #FFE8D6;    /* 暖杏 */
```

---

## 🏆 成就系统 (50+成就)

### 进度成就
- ✅ 第一步 → 考研战士 (100天通关)
- ⭐ 学者 → 大师 → 专家 (经验值里程碑)

### 彩蛋成就 (隐藏)
- 🥚 彩蛋猎人 → 彩蛋收藏家 → 彩蛋大师
- 🔮 第七感 (第7天)
- ✨ 半程惊喜 (第50天)  
- 🌟 百日奇迹 (第100天)

### 北大彩蛋 (隐藏)
- 🎓 北大粉丝 → 北大漫步者 → 燕园情怀
- 👨‍🏫 北大学者 (了解费孝通)
- 🏫 北大往事 (五四精神)

### 真题彩蛋 (隐藏)
- 📋 真题猎人·初/中/高
- 👑 真题终结者

### 终极成就
- 🎓 社会学大师 (全收集)
- 🌟 上岸达人 (完美通关)

---

## 🥚 彩蛋触发机制

### 隐藏彩蛋
1. **日期触发**: 第7/50/100天自动触发
2. **连续学习**: 7天/30天连续
3. **完美天数**: 连续10天全对
4. **深夜学习**: 23:00-05:00学习

### 北大彩蛋
1. **场景访问**: 访问北大校园特定场景
2. **知识展示**: 展示社会学知识点时触发
3. **隐藏知识**: 发现五四运动等历史知识

### 真题彩蛋
- 遇到北大历年真题时自动发现

---

## 🎮 游戏目标

```
📚 完成100天 = 具备北大社会学考研上岸能力

每周目标:
- 第1周: 入门周 🎮
- 第2周: 理论奠基 📖
- 第3周: 方法入门 🔬
- ...
- 第14周: 最终冲刺 🏆
```

---

## 📝 HTML集成方式

在HTML的 `<head>` 中引入CSS:

```html
<link rel="stylesheet" href="css/theme-variables.css">
```

在 `</body>` 前按顺序引入JS:

```html
<!-- 1. 核心引擎 (按依赖顺序) -->
<script src="js/core/game-engine.js"></script>
<script src="js/core/narrative-system.js"></script>
<script src="js/core/quiz-system.js"></script>
<script src="js/core/progress-tracker.js"></script>

<!-- 2. 配置文件 -->
<script src="js/config/eggs-config.js"></script>

<!-- 3. 主入口 -->
<script src="js/main.js"></script>
```

---

## 🔧 初始化示例

```javascript
// 在页面加载后，游戏自动初始化
window.addEventListener('DOMContentLoaded', () => {
    // GameEngine 自动实例化
    const engine = window.PKUSociologyRPG.engine;
    
    // 开始学习
    window.PKUSociologyRPG.app.startLearning(1);
    
    // 监听成就解锁
    engine.on('achievementUnlocked', (achievement) => {
        console.log('成就解锁:', achievement.name);
    });
    
    // 监听彩蛋发现
    engine.on('eggDiscovered', (egg) => {
        console.log('彩蛋发现:', egg.name);
    });
});
```

---

## 📦 数据存储结构

```javascript
{
    playerName: '新同学',
    currentDay: 1,
    totalXP: 0,
    level: 1,
    unlockedDays: [1],
    completedDays: [],
    achievements: [],
    hiddenEvents: [],        // 隐藏事件
    foundEggs: [],           // 已发现彩蛋
    realQuestionsFound: [],  // 已发现的真题
    wrongAnswers: [],
    notes: [],
    settings: { sound: true, music: true },
    statistics: { totalQuestions: 0, correctAnswers: 0 },
    characterStats: { sociology: 0, statistics: 0 }
}
```

---

## 🎵 音效配置

```javascript
// 音效类型
const sounds = {
    select: '选择',      // 选项点击
    correct: '正确',    // 答对
    wrong: '错误',      // 答错
    levelup: '升级',    // 升级
    click: '点击',      // 通用点击
    bgm: '背景音乐'      // BGM
};
```

---

## 📱 快捷键

| 按键 | 功能 |
|------|------|
| Space/Enter | 继续对话/确认 |
| ESC | 打开菜单/关闭弹窗 |
| Ctrl+S | 手动保存 |

---

**版本**: 1.0.0  
**更新日期**: 2025-01-XX
