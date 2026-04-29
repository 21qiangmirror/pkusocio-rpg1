/**
 * 北大社会学考研RPG - 核心游戏引擎
 * GameEngine.js - 游戏状态管理、存档/读档、章节解锁、经验值/等级、成就系统
 * 
 * 【暖色调配色方案】
 * 主色：#FF9F43 (暖橙), #F8B500 (琥珀), #FF6B6B (珊瑚红)
 * 背景：#FFF8F0 → #FFE8D6 (暖灰/米白渐变)
 * 强调色：#00D9C0 (薄荷绿), #4CAF50 (成功绿)
 * 图标：🎮🎯🏆📚✨🔮💡🌟⭐🗺️🎒💎📖🎓
 */

class GameEngine {
    constructor() {
        // 游戏数据存储键名
        this.STORAGE_KEY = 'pku_sociology_rpg_save';
        
        // 暖色调配色配置
        this.themeConfig = {
            primary: '#FF9F43',
            secondary: '#F8B500', 
            accent: '#FF6B6B',
            success: '#4CAF50',
            mint: '#00D9C0',
            bgGradientStart: '#FFF8F0',
            bgGradientEnd: '#FFE8D6',
            textPrimary: '#4A4A4A',
            textSecondary: '#7A7A7A'
        };
        
        // 默认游戏状态
        this.defaultState = {
            playerName: '新同学',
            currentDay: 1,
            totalXP: 0,
            level: 1,
            unlockedDays: [1],
            completedDays: [],
            achievements: [],
            wrongAnswers: [],
            notes: [],
            hiddenEvents: [],        // 隐藏事件记录
            foundEggs: [],           // 已发现彩蛋
            realQuestionsFound: [],  // 已发现的真题
            settings: {
                sound: true,
                music: true,
                autoSave: true,
                textSpeed: 30
            },
            statistics: {
                totalQuestions: 0,
                correctAnswers: 0,
                totalPlayTime: 0,
                lastPlayedAt: null,
                daysCompleted: 0
            },
            characterStats: {
                sociology: 0,
                statistics: 0,
                socialResearch: 0,
                theory: 0
            },
            questLog: [],
            visitedScenes: []
        };
        
        // 当前游戏状态
        this.gameState = null;
        
        // 等级经验值配置
        this.levelConfig = {
            maxLevel: 99,
            xpPerLevel: [
                0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
                3300, 4000, 4800, 5700, 6700, 7800, 9000, 10300, 11700, 13200,
                14800, 16500, 18300, 20200, 22200, 24300, 26500, 28800, 31200, 33700,
                36300, 39000, 41800, 44700, 47700, 50800, 54000, 57300, 60700, 64200
            ]
        };
        
        // 【彩蛋成就配置】- 丰富的隐藏成就系统
        this.achievementsConfig = this.buildAchievementsConfig();
        
        // 事件监听器
        this.listeners = {};
        
        // 初始化
        this.init();
    }
    
    /**
     * 构建完整的成就配置（包括彩蛋）
     */
    buildAchievementsConfig() {
        return {
            // ==================== 进度成就 ====================
            'first_step': { 
                name: '第一步', description: '完成第一天学习', icon: '🎯', xp: 50, category: 'progress' 
            },
            'week_one': { 
                name: '第一周', description: '完成第一周学习', icon: '📅', xp: 200, category: 'progress' 
            },
            'month_one': { 
                name: '第一个月', description: '完成第一个月学习', icon: '📚', xp: 500, category: 'progress' 
            },
            'half_way': { 
                name: '半程纪念', description: '完成50天学习', icon: '🌟', xp: 1000, category: 'progress' 
            },
            'all_days': { 
                name: '考研战士', description: '完成所有100天学习', icon: '🏆', xp: 5000, category: 'progress',
                message: '🎉 恭喜！你已具备北大社会学考研上岸能力！'
            },
            
            // ==================== 知识成就 ====================
            'scholar': { 
                name: '学者', description: '累计获得1000经验值', icon: '🎓', xp: 100, category: 'knowledge' 
            },
            'master': { 
                name: '大师', description: '累计获得5000经验值', icon: '👑', xp: 500, category: 'knowledge' 
            },
            'expert': { 
                name: '专家', description: '累计获得10000经验值', icon: '💎', xp: 1000, category: 'knowledge' 
            },
            'perfect_day': { 
                name: '完美一天', description: '某天所有题目全对', icon: '⭐', xp: 100, category: 'knowledge' 
            },
            'week_perfect': { 
                name: '完美一周', description: '连续7天全对', icon: '💫', xp: 300, category: 'knowledge' 
            },
            'high_accuracy': { 
                name: '百发百中', description: '正确率达到90%以上', icon: '🎯', xp: 500, category: 'knowledge' 
            },
            'all_wrong_fixed': { 
                name: '知错能改', description: '清空错题本', icon: '✅', xp: 200, category: 'knowledge' 
            },
            
            // ==================== 速度成就 ====================
            'speed_demon': { 
                name: '速战速决', description: '在60秒内完成一天的学习', icon: '⚡', xp: 150, category: 'speed' 
            },
            'lightning': { 
                name: '闪电侠', description: '连续3天都在60秒内完成', icon: '🌩️', xp: 300, category: 'speed' 
            },
            'speed_master': { 
                name: '极速大师', description: '连续7天都在60秒内完成', icon: '💨', xp: 500, category: 'speed' 
            },
            
            // ==================== 学习习惯成就 ====================
            'night_owl': { 
                name: '夜猫子', description: '在凌晨0点-5点学习', icon: '🦉', xp: 50, category: 'special' 
            },
            'early_bird': { 
                name: '早起鸟', description: '在早晨6点前开始学习', icon: '🐦', xp: 50, category: 'special' 
            },
            'note_taker': { 
                name: '笔记达人', description: '添加10条笔记', icon: '📝', xp: 100, category: 'special' 
            },
            'comeback': { 
                name: '王者归来', description: '错题后重新答对', icon: '🔥', xp: 30, category: 'special' 
            },
            'streak_7': { 
                name: '连续7天', description: '连续学习7天', icon: '🔥', xp: 200, category: 'special' 
            },
            'streak_30': { 
                name: '连续一个月', description: '连续学习30天', icon: '🔥', xp: 1000, category: 'special' 
            },
            
            // ==================== 【隐藏彩蛋成就】 ====================
            'egg_first': { 
                name: '彩蛋猎人', description: '发现第一个隐藏彩蛋', icon: '🥚', xp: 100, category: 'hidden', hidden: true 
            },
            'egg_collector': { 
                name: '彩蛋收藏家', description: '发现5个隐藏彩蛋', icon: '🪺', xp: 300, category: 'hidden', hidden: true 
            },
            'egg_master': { 
                name: '彩蛋大师', description: '发现10个隐藏彩蛋', icon: '💎', xp: 500, category: 'hidden', hidden: true 
            },
            'secret_day_7': { 
                name: '第七感', description: '在第7天发现隐藏剧情', icon: '🔮', xp: 200, category: 'hidden', hidden: true,
                condition: { day: 7, event: 'lucky_seven' }
            },
            'secret_day_50': { 
                name: '半程惊喜', description: '在第50天发现隐藏剧情', icon: '✨', xp: 500, category: 'hidden', hidden: true,
                condition: { day: 50, event: 'halfway_secret' }
            },
            'secret_day_100': { 
                name: '百日奇迹', description: '在第100天发现终极彩蛋', icon: '🌟', xp: 1000, category: 'hidden', hidden: true,
                condition: { day: 100, event: 'final_secret' }
            },
            'all_notes_found': { 
                name: '博闻强记', description: '发现所有隐藏笔记', icon: '📖', xp: 300, category: 'hidden', hidden: true 
            },
            'true_love': { 
                name: '社会学の真爱', description: '在没有任何提示的情况下答对10道难题', icon: '💕', xp: 500, category: 'hidden', hidden: true 
            },
            
            // ==================== 【北大彩蛋成就】 ====================
            'pku_fan': { 
                name: '北大粉丝', description: '了解北大的基本历史', icon: '🎓', xp: 100, category: 'pku', hidden: true 
            },
            'pku_walker': { 
                name: '北大漫步者', description: '解锁北大校园地图', icon: '🗺️', xp: 200, category: 'pku', hidden: true 
            },
            'pku_scholar': { 
                name: '北大学者', description: '了解费孝通先生的贡献', icon: '👨‍🏫', xp: 300, category: 'pku', hidden: true 
            },
            'pku_history': { 
                name: '北大通', description: '了解北大社会学系的历史', icon: '📜', xp: 300, category: 'pku', hidden: true 
            },
            'beidawang': { 
                name: '北大往事', description: '发现北大校史中的社会学彩蛋', icon: '🏫', xp: 500, category: 'pku', hidden: true 
            },
            'yanyuan': { 
                name: '燕园情怀', description: '解锁所有北大校园场景', icon: '🌸', xp: 500, category: 'pku', hidden: true 
            },
            'sociology_spirit': { 
                name: '社会学精神', description: '理解社会学的人文关怀', icon: '💝', xp: 300, category: 'pku', hidden: true 
            },
            
            // ==================== 【真题彩蛋成就】 ====================
            'real_question_1': { 
                name: '真题猎人·初', description: '答对一道北大社会学考研真题', icon: '📋', xp: 200, category: 'pku', hidden: true,
                condition: { realQuestion: true }
            },
            'real_question_5': { 
                name: '真题猎人·中', description: '答对5道北大社会学考研真题', icon: '📚', xp: 500, category: 'pku', hidden: true,
                condition: { realQuestionCount: 5 }
            },
            'real_question_10': { 
                name: '真题猎人·高', description: '答对10道北大社会学考研真题', icon: '🏆', xp: 1000, category: 'pku', hidden: true,
                condition: { realQuestionCount: 10 }
            },
            'real_question_all': { 
                name: '真题终结者', description: '答对所有北大社会学考研真题', icon: '👑', xp: 2000, category: 'pku', hidden: true,
                condition: { realQuestionCount: 'all' }
            },
            
            // ==================== 【全收集终极成就】 ====================
            'egg_king': { 
                name: '社会学大师', description: '集齐所有彩蛋，成为真正的社会学大师', icon: '🎓', xp: 10000, category: 'special',
                requirement: 'all_eggs',
                message: '🏆 恭喜！你已集齐所有彩蛋，成为真正的社会学大师！'
            },
            'true_master': { 
                name: '上岸达人', description: '100天全通关+正确率90%+解锁所有普通成就', icon: '🌟', xp: 5000, category: 'special',
                requirement: 'all_achievements',
                message: '🎉 完美通关！你已完全具备北大社会学考研上岸能力！'
            },
            
            // ==================== 特殊互动成就 ====================
            'explorer': { 
                name: '探索者', description: '访问所有已解锁的场景', icon: '🔍', xp: 100, category: 'special' 
            },
            'reader': { 
                name: '阅读达人', description: '看完所有剧情对话', icon: '📖', xp: 200, category: 'special' 
            },
            'helper': { 
                name: '互助达人', description: '帮助其他考研同学', icon: '🤝', xp: 150, category: 'special' 
            },
            'time_traveler': { 
                name: '时间旅人', description: '在不同时间段学习（早中晚）', icon: '⏰', xp: 100, category: 'special' 
            },
            'patient': { 
                name: '耐心铸就', description: '单次学习超过30分钟', icon: '⏳', xp: 100, category: 'special' 
            }
        };
    }
    
    /**
     * 初始化游戏引擎
     */
    init() {
        this.loadGame();
        this.setupAutoSave();
        this.setupTimeBasedAchievements();
        this.checkHiddenAchievements();
        console.log('[GameEngine] 初始化完成');
        console.log('[GameEngine] 暖色调主题已启用: ' + this.themeConfig.primary);
    }
    
    /**
     * 获取游戏状态（带默认值）
     */
    getState() {
        if (!this.gameState) {
            this.gameState = { ...this.defaultState };
        }
        return this.gameState;
    }
    
    /**
     * 更新游戏状态
     */
    updateState(updates) {
        this.gameState = { ...this.getState(), ...updates };
        this.emit('stateUpdate', this.gameState);
    }
    
    /**
     * 获取主题配置
     */
    getThemeConfig() {
        return { ...this.themeConfig };
    }
    
    // ==================== 存档系统 ====================
    
    /**
     * 保存游戏到localStorage
     */
    saveGame() {
        try {
            const state = this.getState();
            state.statistics.lastPlayedAt = new Date().toISOString();
            
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                data: state
            };
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
            this.emit('gameSaved', state);
            return true;
        } catch (error) {
            console.error('[GameEngine] 保存失败:', error);
            this.emit('saveError', error);
            return false;
        }
    }
    
    /**
     * 从localStorage加载游戏
     */
    loadGame() {
        try {
            const saveData = localStorage.getItem(this.STORAGE_KEY);
            
            if (saveData) {
                const parsed = JSON.parse(saveData);
                this.gameState = { ...this.defaultState, ...parsed.data };
                console.log('[GameEngine] 游戏已加载');
                return true;
            } else {
                this.gameState = { ...this.defaultState };
                console.log('[GameEngine] 未找到存档，创建新游戏');
                return false;
            }
        } catch (error) {
            console.error('[GameEngine] 加载失败:', error);
            this.gameState = { ...this.defaultState };
            return false;
        }
    }
    
    /**
     * 删除存档
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            this.gameState = { ...this.defaultState };
            this.emit('saveDeleted');
            return true;
        } catch (error) {
            console.error('[GameEngine] 删除存档失败:', error);
            return false;
        }
    }
    
    /**
     * 检查存档是否存在
     */
    hasSave() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }
    
    /**
     * 设置自动保存
     */
    setupAutoSave() {
        if (this.getState().settings.autoSave) {
            setInterval(() => this.saveGame(), 30000);
            
            window.addEventListener('beforeunload', () => this.saveGame());
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) this.saveGame();
            });
        }
    }
    
    /**
     * 设置时间相关的成就检测
     */
    setupTimeBasedAchievements() {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            this.unlockAchievement('night_owl');
        }
        if (hour >= 4 && hour < 6) {
            this.unlockAchievement('early_bird');
        }
    }
    
    /**
     * 检查隐藏成就
     */
    checkHiddenAchievements() {
        const state = this.getState();
        
        // 检查特定日期的隐藏剧情
        if (state.currentDay === 7 && !state.hiddenEvents.includes('lucky_seven')) {
            this.triggerHiddenEvent('lucky_seven', {
                title: '🔮 第七感',
                message: '数字7在社会学中有着特殊的意义...\n涂尔干的《社会分工论》中，数字7出现了7次！',
                achievementId: 'secret_day_7'
            });
        }
        
        if (state.currentDay === 50 && !state.hiddenEvents.includes('halfway_secret')) {
            this.triggerHiddenEvent('halfway_secret', {
                title: '✨ 半程惊喜',
                message: '你已经完成了一半的旅程！\n社会学大师费孝通曾说："各美其美，美人之美"\n继续保持这份热情！',
                achievementId: 'secret_day_50'
            });
        }
    }
    
    /**
     * 触发隐藏事件
     */
    triggerHiddenEvent(eventId, eventData) {
        const state = this.getState();
        if (!state.hiddenEvents.includes(eventId)) {
            state.hiddenEvents.push(eventId);
            state.foundEggs.push(eventId);
            
            if (eventData.achievementId) {
                this.unlockAchievement(eventData.achievementId);
            }
            
            this.updateState(state);
            this.emit('hiddenEvent', eventData);
        }
    }
    
    /**
     * 发现彩蛋
     */
    discoverEgg(eggId, eggData = {}) {
        const state = this.getState();
        
        if (!state.foundEggs.includes(eggId)) {
            state.foundEggs.push(eggId);
            this.updateState(state);
            
            // 检查彩蛋收集成就
            const eggCount = state.foundEggs.length;
            if (eggCount >= 1) this.unlockAchievement('egg_first');
            if (eggCount >= 5) this.unlockAchievement('egg_collector');
            if (eggCount >= 10) this.unlockAchievement('egg_master');
            
            // 检查全收集成就
            const totalEggs = 15; // 假设总共15个彩蛋
            if (eggCount >= totalEggs) this.unlockAchievement('egg_king');
            
            this.emit('eggDiscovered', { eggId, ...eggData });
            
            return true;
        }
        return false;
    }
    
    /**
     * 发现真题
     */
    discoverRealQuestion(questionId) {
        const state = this.getState();
        
        if (!state.realQuestionsFound.includes(questionId)) {
            state.realQuestionsFound.push(questionId);
            this.updateState(state);
            
            // 检查真题收集成就
            const realCount = state.realQuestionsFound.length;
            if (realCount >= 1) this.unlockAchievement('real_question_1');
            if (realCount >= 5) this.unlockAchievement('real_question_5');
            if (realCount >= 10) this.unlockAchievement('real_question_10');
            
            this.emit('realQuestionFound', { questionId, totalFound: realCount });
            
            return true;
        }
        return false;
    }
    
    // ==================== 经验值与等级系统 ====================
    
    /**
     * 添加经验值
     */
    addXP(amount) {
        const state = this.getState();
        const oldLevel = state.level;
        state.totalXP += amount;
        
        let newLevel = 1;
        for (let i = 1; i <= this.levelConfig.maxLevel; i++) {
            const levelXP = this.levelConfig.xpPerLevel[i] || (i * 100 + i * i * 50);
            if (state.totalXP >= levelXP) {
                newLevel = i + 1;
            } else {
                break;
            }
        }
        
        newLevel = Math.min(newLevel, this.levelConfig.maxLevel);
        state.level = newLevel;
        this.updateState(state);
        
        const leveledUp = newLevel > oldLevel;
        
        if (leveledUp) {
            this.emit('levelUp', { oldLevel, newLevel, totalXP: state.totalXP });
        }
        
        this.emit('xpAdded', { amount, totalXP: state.totalXP, level: newLevel });
        
        // 检查知识成就
        if (state.totalXP >= 1000) this.unlockAchievement('scholar');
        if (state.totalXP >= 5000) this.unlockAchievement('master');
        if (state.totalXP >= 10000) this.unlockAchievement('expert');
        
        return {
            leveledUp,
            oldLevel,
            newLevel,
            totalXP: state.totalXP,
            xpToNextLevel: this.getXPToNextLevel()
        };
    }
    
    /**
     * 获取当前等级所需经验值
     */
    getXPToNextLevel() {
        const state = this.getState();
        const currentLevel = state.level;
        const nextLevelXP = this.levelConfig.xpPerLevel[currentLevel + 1] || 
            ((currentLevel + 1) * 100 + (currentLevel + 1) * (currentLevel + 1) * 50);
        const currentLevelXP = this.levelConfig.xpPerLevel[currentLevel] || 0;
        return nextLevelXP - (state.totalXP - currentLevelXP);
    }
    
    /**
     * 获取当前等级经验值进度百分比
     */
    getLevelProgress() {
        const state = this.getState();
        const currentLevel = state.level;
        const currentLevelXP = this.levelConfig.xpPerLevel[currentLevel] || 0;
        const nextLevelXP = this.levelConfig.xpPerLevel[currentLevel + 1] || 
            ((currentLevel + 1) * 100 + (currentLevel + 1) * (currentLevel + 1) * 50);
        const levelProgress = state.totalXP - currentLevelXP;
        const levelRange = nextLevelXP - currentLevelXP;
        return Math.min(100, Math.max(0, (levelProgress / levelRange) * 100));
    }
    
    // ==================== 章节/天数解锁系统 ====================
    
    /**
     * 解锁指定天数
     */
    unlockDay(day) {
        const state = this.getState();
        if (!state.unlockedDays.includes(day)) {
            state.unlockedDays.push(day);
            state.unlockedDays.sort((a, b) => a - b);
            this.updateState(state);
            this.emit('dayUnlocked', day);
        }
    }
    
    /**
     * 完成指定天数
     */
    completeDay(day, results = {}) {
        const state = this.getState();
        
        if (!state.completedDays.includes(day)) {
            state.completedDays.push(day);
            state.completedDays.sort((a, b) => a - b);
        }
        
        state.currentDay = day;
        state.statistics.daysCompleted = state.completedDays.length;
        
        if (results.stats) {
            Object.keys(results.stats).forEach(key => {
                if (state.characterStats.hasOwnProperty(key)) {
                    state.characterStats[key] += results.stats[key];
                }
            });
        }
        
        this.updateState(state);
        
        // 检查里程碑成就
        if (day >= 1) this.unlockAchievement('first_step');
        if (day >= 7) this.unlockAchievement('week_one');
        if (day >= 30) this.unlockAchievement('month_one');
        if (day >= 50) this.unlockAchievement('half_way');
        if (day >= 100) {
            this.unlockAchievement('all_days');
            // 第100天终极彩蛋
            this.triggerHiddenEvent('final_secret', {
                title: '🌟 百日奇迹',
                message: '恭喜你完成了100天的学习！\n你已经完全具备了北大社会学考研的上岸能力！\n愿你在真正的考场上也能发挥出色！',
                achievementId: 'secret_day_100'
            });
        }
        
        if (day < 100) {
            this.unlockDay(day + 1);
        }
        
        // 检查完美一天成就
        if (results.perfectDay) {
            this.unlockAchievement('perfect_day');
        }
        
        // 检查高正确率成就
        const accuracy = this.getAccuracy();
        if (accuracy >= 90) {
            this.unlockAchievement('high_accuracy');
        }
        
        // 检查连续天数成就
        const streak = this.calculateStreak();
        if (streak >= 7) this.unlockAchievement('streak_7');
        if (streak >= 30) this.unlockAchievement('streak_30');
        
        this.emit('dayCompleted', { day, results });
    }
    
    /**
     * 计算连续学习天数
     */
    calculateStreak() {
        const state = this.getState();
        const completedDays = state.completedDays.sort((a, b) => a - b);
        if (completedDays.length === 0) return 0;
        
        let streak = 1;
        for (let i = completedDays.length - 1; i > 0; i--) {
            if (completedDays[i] - completedDays[i - 1] === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
    
    isDayUnlocked(day) {
        return this.getState().unlockedDays.includes(day);
    }
    
    isDayCompleted(day) {
        return this.getState().completedDays.includes(day);
    }
    
    getMaxUnlockedDay() {
        const unlocked = this.getState().unlockedDays;
        return unlocked.length > 0 ? Math.max(...unlocked) : 0;
    }
    
    // ==================== 成就系统 ====================
    
    /**
     * 解锁成就
     */
    unlockAchievement(achievementId) {
        const state = this.getState();
        
        if (state.achievements.includes(achievementId)) {
            return null;
        }
        
        const achievement = this.achievementsConfig[achievementId];
        if (!achievement) {
            console.warn(`[GameEngine] 未知成就: ${achievementId}`);
            return null;
        }
        
        state.achievements.push(achievementId);
        this.updateState(state);
        
        if (achievement.xp) {
            this.addXP(achievement.xp);
        }
        
        this.emit('achievementUnlocked', {
            id: achievementId,
            ...achievement
        });
        
        // 如果有特殊消息，显示
        if (achievement.message) {
            this.emit('specialMessage', achievement.message);
        }
        
        return achievement;
    }
    
    /**
     * 检查成就是否已解锁
     */
    hasAchievement(achievementId) {
        return this.getState().achievements.includes(achievementId);
    }
    
    /**
     * 获取所有成就信息
     */
    getAllAchievements() {
        return Object.entries(this.achievementsConfig).map(([id, config]) => ({
            id,
            ...config,
            unlocked: this.hasAchievement(id)
        }));
    }
    
    /**
     * 获取已解锁成就数量
     */
    getAchievementStats() {
        const total = Object.keys(this.achievementsConfig).length;
        const unlocked = this.getState().achievements.length;
        return { total, unlocked, percentage: Math.round((unlocked / total) * 100) };
    }
    
    // ==================== 错题本系统 ====================
    
    addWrongAnswer(wrongAnswer) {
        const state = this.getState();
        state.wrongAnswers.push({
            ...wrongAnswer,
            timestamp: new Date().toISOString()
        });
        this.updateState(state);
        this.emit('wrongAnswerAdded', wrongAnswer);
    }
    
    removeWrongAnswer(questionId) {
        const state = this.getState();
        const index = state.wrongAnswers.findIndex(w => w.questionId === questionId);
        
        if (index !== -1) {
            state.wrongAnswers.splice(index, 1);
            this.updateState(state);
            this.unlockAchievement('comeback');
            this.emit('wrongAnswerRemoved', questionId);
        }
    }
    
    getWrongAnswers() {
        return this.getState().wrongAnswers;
    }
    
    clearWrongAnswers() {
        this.updateState({ wrongAnswers: [] });
        this.unlockAchievement('all_wrong_fixed');
        this.emit('wrongAnswersCleared');
    }
    
    // ==================== 笔记系统 ====================
    
    addNote(content, day = null) {
        const state = this.getState();
        const note = {
            id: `note_${Date.now()}`,
            content,
            day: day || state.currentDay,
            timestamp: new Date().toISOString()
        };
        
        state.notes.push(note);
        this.updateState(state);
        
        if (state.notes.length >= 10) {
            this.unlockAchievement('note_taker');
        }
        
        this.emit('noteAdded', note);
        return note;
    }
    
    deleteNote(noteId) {
        const state = this.getState();
        const index = state.notes.findIndex(n => n.id === noteId);
        
        if (index !== -1) {
            state.notes.splice(index, 1);
            this.updateState(state);
            this.emit('noteDeleted', noteId);
        }
    }
    
    getNotes() {
        return this.getState().notes;
    }
    
    // ==================== 统计系统 ====================
    
    recordAnswer(correct) {
        const state = this.getState();
        state.statistics.totalQuestions++;
        if (correct) {
            state.statistics.correctAnswers++;
        }
        this.updateState(state);
    }
    
    getAccuracy() {
        const stats = this.getState().statistics;
        if (stats.totalQuestions === 0) return 0;
        return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
    }
    
    getStatistics() {
        return {
            ...this.getState().statistics,
            accuracy: this.getAccuracy(),
            totalXP: this.getState().totalXP,
            level: this.getState().level,
            daysCompleted: this.getState().completedDays.length,
            achievementsUnlocked: this.getState().achievements.length
        };
    }
    
    // ==================== 角色属性系统 ====================
    
    updateCharacterStat(stat, value) {
        const state = this.getState();
        if (state.characterStats.hasOwnProperty(stat)) {
            state.characterStats[stat] += value;
            this.updateState(state);
            this.emit('characterStatUpdated', { stat, value, newValue: state.characterStats[stat] });
        }
    }
    
    getCharacterStats() {
        return { ...this.getState().characterStats };
    }
    
    // ==================== 场景访问系统 ====================
    
    visitScene(sceneId) {
        const state = this.getState();
        if (!state.visitedScenes.includes(sceneId)) {
            state.visitedScenes.push(sceneId);
            this.updateState(state);
            
            // 检查探索者成就
            const totalScenes = 50; // 假设总共50个场景
            if (state.visitedScenes.length >= totalScenes) {
                this.unlockAchievement('explorer');
            }
        }
    }
    
    hasVisitedScene(sceneId) {
        return this.getState().visitedScenes.includes(sceneId);
    }
    
    // ==================== 事件系统 ====================
    
    listeners = {};
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
    
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[GameEngine] 事件处理错误 (${event}):`, error);
                }
            });
        }
    }
    
    // ==================== 导出/导入系统 ====================
    
    exportSave() {
        const saveData = {
            version: '1.0.0',
            timestamp: Date.now(),
            data: this.getState()
        };
        return btoa(JSON.stringify(saveData));
    }
    
    importSave(encodedData) {
        try {
            const decoded = JSON.parse(atob(encodedData));
            if (decoded.data) {
                this.gameState = { ...this.defaultState, ...decoded.data };
                this.saveGame();
                this.emit('saveImported', this.gameState);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[GameEngine] 导入失败:', error);
            return false;
        }
    }
    
    // ==================== 重置系统 ====================
    
    resetGame(confirm = false) {
        if (!confirm) {
            console.warn('[GameEngine] 重置游戏需要传入 confirm=true');
            return false;
        }
        
        this.deleteSave();
        this.emit('gameReset');
        return true;
    }
}

// 导出为全局变量
window.GameEngine = GameEngine;
