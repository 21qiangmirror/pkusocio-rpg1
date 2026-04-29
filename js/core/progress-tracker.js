/**
 * 北大社会学考研RPG - 进度追踪系统
 * ProgressTracker.js - 100天进度可视化、知识点掌握度追踪、成就解锁检查、统计面板
 */

class ProgressTracker {
    constructor(gameEngine) {
        // 依赖注入
        this.gameEngine = gameEngine;
        
        // DOM元素
        this.elements = {
            progressContainer: null,
            statsPanel: null,
            achievementPanel: null,
            knowledgePanel: null,
            calendarView: null
        };
        
        // 进度数据缓存
        this.progressData = {
            dailyProgress: [],
            weeklyProgress: [],
            knowledgeMastery: {},
            studyStreak: 0,
            lastStudyDate: null
        };
        
        // 知识点配置 - 使用emoji图标
        this.knowledgeConfig = {
            sociology: {
                name: '社会学理论',
                icon: '🏛️',
                color: '#FF9F43',
                topics: {
                    classicalTheory: { name: '古典社会理论', progress: 0 },
                    modernTheory: { name: '现代社会理论', progress: 0 },
                    chineseSociology: { name: '中国社会思想', progress: 0 },
                    sociologyOfFamily: { name: '家庭社会学', progress: 0 },
                    sociologyOfEducation: { name: '教育社会学', progress: 0 },
                    sociologyOfDeviance: { name: '越轨社会学', progress: 0 },
                    urbanRural: { name: '城乡社会学', progress: 0 },
                    socialStratification: { name: '社会分层', progress: 0 }
                }
            },
            statistics: {
                name: '社会研究方法与统计',
                icon: '📊',
                color: '#00D9C0',
                topics: {
                    researchDesign: { name: '研究设计', progress: 0 },
                    sampling: { name: '抽样方法', progress: 0 },
                    questionnaire: { name: '问卷设计', progress: 0 },
                    qualitative: { name: '定性研究', progress: 0 },
                    quantitative: { name: '定量分析', progress: 0 },
                    statisticalInference: { name: '统计推断', progress: 0 },
                    spss: { name: 'SPSS应用', progress: 0 },
                    reportWriting: { name: '报告撰写', progress: 0 }
                }
            },
            theory: {
                name: '社会学概论',
                icon: '📚',
                color: '#F8B500',
                topics: {
                    socialGroup: { name: '社会群体', progress: 0 },
                    socialInstitution: { name: '社会制度', progress: 0 },
                    socialAction: { name: '社会行动', progress: 0 },
                    socialStructure: { name: '社会结构', progress: 0 },
                    socialCulture: { name: '社会文化', progress: 0 },
                    socialChange: { name: '社会变迁', progress: 0 },
                    socialization: { name: '社会化', progress: 0 },
                    socialControl: { name: '社会控制', progress: 0 }
                }
            }
        };
        
        // 周目标配置 - 游戏化设计
        this.weeklyGoals = [
            { week: 1, title: '入门周', description: '熟悉社会学基本概念', days: [1, 7], icon: '🎮', xpReward: 500 },
            { week: 2, title: '理论奠基', description: '学习古典社会理论', days: [8, 14], icon: '📖', xpReward: 600 },
            { week: 3, title: '方法入门', description: '掌握研究方法基础', days: [15, 21], icon: '🔬', xpReward: 600 },
            { week: 4, title: '综合提升', description: '理论与方法结合', days: [22, 28], icon: '💡', xpReward: 700 },
            { week: 5, title: '专题深化（一）', description: '家庭与教育社会学', days: [29, 35], icon: '🏠', xpReward: 700 },
            { week: 6, title: '专题深化（二）', description: '城市与分层研究', days: [36, 42], icon: '🌆', xpReward: 700 },
            { week: 7, title: '专题深化（三）', description: '文化与越轨研究', days: [43, 49], icon: '🎭', xpReward: 700 },
            { week: 8, title: '现代理论', description: '当代社会学理论', days: [50, 56], icon: '✨', xpReward: 800 },
            { week: 9, title: '统计进阶', description: '高级统计分析', days: [57, 63], icon: '📈', xpReward: 800 },
            { week: 10, title: '综合模拟（一）', description: '全科模拟测试', days: [64, 70], icon: '📝', xpReward: 900 },
            { week: 11, title: '综合模拟（二）', description: '全科模拟测试', days: [71, 77], icon: '⏰', xpReward: 900 },
            { week: 12, title: '综合模拟（三）', description: '全科模拟测试', days: [78, 84], icon: '🎯', xpReward: 900 },
            { week: 13, title: '冲刺复习', description: '查漏补缺', days: [85, 91], icon: '🚀', xpReward: 1000 },
            { week: 14, title: '最终冲刺', description: '考前最后准备', days: [92, 100], icon: '🏆', xpReward: 1500 }
        ];
        
        // 游戏目标说明
        this.gameGoals = {
            targetDays: 100,
            targetXP: 10000,
            targetLevel: 50,
            targetAccuracy: 85,
           上岸Days: 100 // 完成100天 = 具备考研上岸能力
        };
        
        // 刷新间隔
        this.refreshInterval = null;
        
        console.log('[ProgressTracker] 初始化完成');
    }
    
    /**
     * 初始化进度追踪系统
     * @param {Object} elements - DOM元素配置
     */
    init(elements = {}) {
        this.elements = { ...this.elements, ...elements };
        this.loadProgressData();
        this.startAutoRefresh();
    }
    
    /**
     * 加载进度数据
     */
    loadProgressData() {
        const savedProgress = localStorage.getItem('pku_sociology_rpg_progress');
        if (savedProgress) {
            try {
                const parsed = JSON.parse(savedProgress);
                this.progressData = { ...this.progressData, ...parsed };
            } catch (e) {
                console.warn('[ProgressTracker] 进度数据加载失败');
            }
        }
        this.calculateStudyStreak();
    }
    
    /**
     * 保存进度数据
     */
    saveProgressData() {
        localStorage.setItem('pku_sociology_rpg_progress', JSON.stringify(this.progressData));
    }
    
    /**
     * 计算连续学习天数
     */
    calculateStudyStreak() {
        const state = this.gameEngine.getState();
        const completedDays = state.completedDays.sort((a, b) => a - b);
        
        if (completedDays.length === 0) {
            this.progressData.studyStreak = 0;
            return;
        }
        
        let streak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastDay = completedDays[completedDays.length - 1];
        const lastStudyDate = new Date(today);
        lastStudyDate.setDate(lastStudyDate.getDate() - (100 - lastDay));
        
        const daysDiff = Math.floor((today - lastStudyDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) {
            streak = 1;
        } else {
            for (let i = completedDays.length - 1; i > 0; i--) {
                if (completedDays[i] - completedDays[i - 1] === 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }
        
        this.progressData.studyStreak = streak;
        this.progressData.lastStudyDate = lastStudyDate.toISOString();
    }
    
    /**
     * 开始自动刷新
     */
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.refreshAllPanels();
        }, 60000);
    }
    
    /**
     * 刷新所有面板
     */
    refreshAllPanels() {
        this.loadProgressData();
        this.renderAll();
    }
    
    /**
     * 渲染所有面板
     */
    renderAll() {
        this.renderCalendarView();
        this.renderStatsPanel();
        this.renderKnowledgePanel();
        this.renderAchievementPanel();
    }
    
    // ==================== 日历视图（暖色调） ====================
    
    /**
     * 渲染日历视图（100天进度）
     */
    renderCalendarView() {
        if (!this.elements.calendarView) return;
        
        const state = this.gameEngine.getState();
        const completedDays = state.completedDays;
        const unlockedDays = state.unlockedDays;
        const daysLeft = this.gameGoals.targetDays - state.currentDay;
        
        let html = `
            <div class="calendar-header">
                <h3>📅 100天学习进度</h3>
                <div class="days-to-goal">
                    <span class="goal-icon">🎯</span>
                    <span>距离上岸还有 <strong>${daysLeft}</strong> 天</span>
                </div>
                <div class="calendar-legend">
                    <span class="legend-item completed">已完成 ✓</span>
                    <span class="legend-item current">进行中 ▶</span>
                    <span class="legend-item locked">未解锁 🔒</span>
                </div>
            </div>
            <div class="calendar-grid">
        `;
        
        for (let day = 1; day <= 100; day++) {
            const isCompleted = completedDays.includes(day);
            const isUnlocked = unlockedDays.includes(day);
            const isCurrent = state.currentDay === day;
            
            let dayClass = 'locked';
            let dayIcon = '🔒';
            if (isCompleted) { 
                dayClass = 'completed'; 
                dayIcon = '✓';
            } else if (isUnlocked) { 
                dayClass = 'current';
                dayIcon = '▶';
            }
            
            html += `
                <div class="calendar-day ${dayClass}" 
                     data-day="${day}"
                     title="第${day}天 ${isCompleted ? '✓ 已完成' : isUnlocked ? '进行中' : '🔒 未解锁'}">
                    <span class="day-number">${day}</span>
                    <span class="day-icon">${dayIcon}</span>
                </div>
            `;
        }
        
        html += '</div>';
        html += this.renderWeeklyProgress();
        html += this.renderGoalProgress();
        
        this.elements.calendarView.innerHTML = html;
        
        this.elements.calendarView.querySelectorAll('.calendar-day').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const day = parseInt(dayEl.dataset.day);
                if (state.unlockedDays.includes(day)) {
                    this.showDayDetail(day);
                }
            });
        });
    }
    
    /**
     * 渲染目标进度条
     */
    renderGoalProgress() {
        const state = this.gameEngine.getState();
        const stats = this.gameEngine.getStatistics();
        const daysProgress = Math.round((state.completedDays.length / 100) * 100);
        const xpProgress = Math.round((state.totalXP / this.gameGoals.targetXP) * 100);
        
        return `
            <div class="goal-progress">
                <div class="goal-item">
                    <span class="goal-icon">📚</span>
                    <span class="goal-label">学习进度</span>
                    <div class="goal-bar">
                        <div class="goal-fill warm" style="width: ${daysProgress}%"></div>
                    </div>
                    <span class="goal-value">${state.completedDays.length}/100天</span>
                </div>
                <div class="goal-item">
                    <span class="goal-icon">⭐</span>
                    <span class="goal-label">经验积累</span>
                    <div class="goal-bar">
                        <div class="goal-fill gold" style="width: ${Math.min(xpProgress, 100)}%"></div>
                    </div>
                    <span class="goal-value">${state.totalXP}/${this.gameGoals.targetXP} XP</span>
                </div>
                <div class="goal-item">
                    <span class="goal-icon">🎯</span>
                    <span class="goal-label">正确率</span>
                    <div class="goal-bar">
                        <div class="goal-fill success" style="width: ${stats.accuracy}%"></div>
                    </div>
                    <span class="goal-value">${stats.accuracy}%</span>
                </div>
            </div>
        `;
    }
    
    /**
     * 渲染周进度
     */
    renderWeeklyProgress() {
        const state = this.gameEngine.getState();
        const completedDays = state.completedDays;
        
        let html = '<div class="weekly-progress"><h4>📆 周目标进度</h4><div class="weeks-grid">';
        
        this.weeklyGoals.forEach(goal => {
            const daysInWeek = goal.days[1] - goal.days[0] + 1;
            const completedInWeek = completedDays.filter(d => d >= goal.days[0] && d <= goal.days[1]).length;
            const progress = Math.round((completedInWeek / daysInWeek) * 100);
            
            html += `
                <div class="week-item" data-week="${goal.week}">
                    <div class="week-icon">${goal.icon}</div>
                    <div class="week-header">
                        <span class="week-number">第${goal.week}周</span>
                        <span class="week-progress">${completedInWeek}/${daysInWeek}</span>
                    </div>
                    <div class="week-bar">
                        <div class="week-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="week-title">${goal.title}</div>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    /**
     * 显示某一天的详情
     */
    showDayDetail(day) {
        this.emit('dayDetailRequested', { day });
    }
    
    // ==================== 统计面板（暖色调） ====================
    
    /**
     * 渲染统计面板
     */
    renderStatsPanel() {
        if (!this.elements.statsPanel) return;
        
        const state = this.gameEngine.getState();
        const stats = this.gameEngine.getStatistics();
        const achievementStats = this.gameEngine.getAchievementStats();
        const daysLeft = this.gameGoals.targetDays - state.currentDay;
        
        const html = `
            <div class="stats-header">
                <h3>📊 学习统计面板</h3>
                <div class="days-countdown">
                    <span class="countdown-icon">🎯</span>
                    <span>距离上岸: <strong>${daysLeft}</strong> 天</span>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-card level-card warm-glow">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-info">
                        <div class="stat-value">Lv.${stats.level}</div>
                        <div class="stat-label">当前等级</div>
                    </div>
                    <div class="xp-bar warm">
                        <div class="xp-fill" style="width: ${this.gameEngine.getLevelProgress()}%"></div>
                    </div>
                    <div class="xp-text">${stats.totalXP} XP</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.daysCompleted}/100</div>
                        <div class="stat-label">已完成天数</div>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-fill warm" style="width: ${stats.daysCompleted}%"></div>
                    </div>
                </div>
                
                <div class="stat-card streak-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-info">
                        <div class="stat-value">${this.progressData.studyStreak}天</div>
                        <div class="stat-label">连续学习</div>
                    </div>
                </div>
                
                <div class="stat-card accuracy-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.accuracy}%</div>
                        <div class="stat-label">正确率</div>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-fill ${stats.accuracy >= 85 ? 'success' : 'warm'}" style="width: ${stats.accuracy}%"></div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.correctAnswers}</div>
                        <div class="stat-label">答对题目</div>
                    </div>
                </div>
                
                <div class="stat-card wrong-card">
                    <div class="stat-icon">📝</div>
                    <div class="stat-info">
                        <div class="stat-value">${state.wrongAnswers.length}</div>
                        <div class="stat-label">错题数量</div>
                    </div>
                </div>
                
                <div class="stat-card achievement-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-info">
                        <div class="stat-value">${achievementStats.unlocked}/${achievementStats.total}</div>
                        <div class="stat-label">已解锁成就</div>
                    </div>
                </div>
                
                <div class="stat-card notes-card">
                    <div class="stat-icon">📖</div>
                    <div class="stat-info">
                        <div class="stat-value">${state.notes.length}</div>
                        <div class="stat-label">笔记数量</div>
                    </div>
                </div>
            </div>
            
            <div class="completion-display">
                <div class="completion-ring warm-ring">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" class="ring-bg" stroke="#FFE8D6"/>
                        <circle cx="50" cy="50" r="45" class="ring-fill" 
                                style="stroke-dasharray: ${(stats.daysCompleted / 100) * 283} 283; stroke: #FF9F43"/>
                    </svg>
                    <div class="ring-text">
                        <span class="ring-value warm">${stats.daysCompleted}%</span>
                        <span class="ring-label">总进度</span>
                    </div>
                </div>
                <div class="motivational-text">
                    ${this.getMotivationalText(stats.daysCompleted)}
                </div>
            </div>
        `;
        
        this.elements.statsPanel.innerHTML = html;
    }
    
    /**
     * 获取激励文案
     */
    getMotivationalText(progress) {
        if (progress >= 100) return '🎉 恭喜！已具备考研上岸能力！';
        if (progress >= 80) return '💪 胜利在望！继续冲刺！';
        if (progress >= 50) return '🔥 已过半！保持节奏！';
        if (progress >= 30) return '✨ 稳扎稳打，继续加油！';
        if (progress >= 10) return '🌱 良好的开始！';
        return '🚀 考研之旅开始了！';
    }
    
    // ==================== 知识掌握度面板 ====================
    
    /**
     * 渲染知识掌握度面板
     */
    renderKnowledgePanel() {
        if (!this.elements.knowledgePanel) return;
        
        let html = `
            <div class="knowledge-header">
                <h3>🧠 知识点掌握度</h3>
                <div class="knowledge-summary">
                    <span class="summary-icon">📊</span>
                    <span>总分：${this.calculateTotalMastery()}%</span>
                </div>
            </div>
        `;
        
        Object.entries(this.knowledgeConfig).forEach(([category, config]) => {
            const categoryProgress = this.getCategoryMastery(category);
            
            html += `
                <div class="knowledge-category" data-category="${category}" style="--cat-color: ${config.color}">
                    <div class="category-header">
                        <span class="category-icon">${config.icon}</span>
                        <span class="category-name">${config.name}</span>
                        <span class="category-progress">${categoryProgress}%</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${categoryProgress}%"></div>
                    </div>
                    <div class="topics-grid">
            `;
            
            Object.entries(config.topics).forEach(([topicId, topic]) => {
                const progress = this.progressData.knowledgeMastery[`${category}_${topicId}`] || 0;
                
                html += `
                    <div class="topic-item" data-topic="${topicId}">
                        <div class="topic-name">${topic.name}</div>
                        <div class="topic-bar">
                            <div class="topic-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="topic-percent">${progress}%</div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        });
        
        this.elements.knowledgePanel.innerHTML = html;
    }
    
    /**
     * 计算总掌握度
     */
    calculateTotalMastery() {
        let total = 0;
        let count = 0;
        
        Object.keys(this.knowledgeConfig).forEach(category => {
            Object.keys(this.knowledgeConfig[category].topics).forEach(topicId => {
                const key = `${category}_${topicId}`;
                total += this.progressData.knowledgeMastery[key] || 0;
                count++;
            });
        });
        
        return count > 0 ? Math.round(total / count) : 0;
    }
    
    /**
     * 获取分类掌握度
     */
    getCategoryMastery(category) {
        let total = 0;
        let count = 0;
        
        Object.keys(this.knowledgeConfig[category].topics).forEach(topicId => {
            const key = `${category}_${topicId}`;
            total += this.progressData.knowledgeMastery[key] || 0;
            count++;
        });
        
        return count > 0 ? Math.round(total / count) : 0;
    }
    
    /**
     * 更新知识点掌握度
     */
    updateKnowledgeMastery(category, topicId, delta) {
        const key = `${category}_${topicId}`;
        const current = this.progressData.knowledgeMastery[key] || 0;
        this.progressData.knowledgeMastery[key] = Math.min(100, Math.max(0, current + delta));
        this.saveProgressData();
        this.renderKnowledgePanel();
    }
    
    // ==================== 成就面板（彩蛋系统） ====================
    
    /**
     * 渲染成就面板
     */
    renderAchievementPanel() {
        if (!this.elements.achievementPanel) return;
        
        const allAchievements = this.gameEngine.getAllAchievements();
        const unlockedCount = allAchievements.filter(a => a.unlocked).length;
        const totalCount = allAchievements.length;
        
        // 分类显示
        const categories = {
            progress: { name: '进度成就', icon: '🎯', achievements: [] },
            knowledge: { name: '知识成就', icon: '🧠', achievements: [] },
            speed: { name: '速度成就', icon: '⚡', achievements: [] },
            hidden: { name: '隐藏彩蛋', icon: '🔮', achievements: [] },
            pku: { name: '北大彩蛋', icon: '🎓', achievements: [] },
            special: { name: '特殊成就', icon: '🏆', achievements: [] }
        };
        
        allAchievements.forEach(a => {
            const cat = a.category || 'progress';
            if (categories[cat]) {
                categories[cat].achievements.push(a);
            }
        });
        
        let html = `
            <div class="achievement-header">
                <h3>🏆 成就一览</h3>
                <div class="achievement-count">
                    <span class="count-icon">✨</span>
                    <span>${unlockedCount}/${totalCount}</span>
                </div>
            </div>
        `;
        
        Object.entries(categories).forEach(([catId, cat]) => {
            if (cat.achievements.length === 0) return;
            
            const catUnlocked = cat.achievements.filter(a => a.unlocked).length;
            
            html += `
                <div class="achievement-category" data-category="${catId}">
                    <div class="category-title">
                        <span class="cat-icon">${cat.icon}</span>
                        <span class="cat-name">${cat.name}</span>
                        <span class="cat-count">${catUnlocked}/${cat.achievements.length}</span>
                    </div>
                    <div class="achievements-grid">
            `;
            
            cat.achievements.forEach(achievement => {
                const opacity = achievement.unlocked ? 1 : 0.3;
                const isHidden = achievement.hidden && !achievement.unlocked;
                
                html += `
                    <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'} ${isHidden ? 'hidden' : ''}"
                         data-id="${achievement.id}"
                         title="${isHidden ? '？？？' : achievement.description}">
                        <div class="achievement-icon" style="opacity: ${opacity}">${isHidden ? '🔮' : achievement.icon}</div>
                        <div class="achievement-name">${isHidden ? '???' : achievement.name}</div>
                        <div class="achievement-desc">${isHidden ? '隐藏成就待发现' : achievement.description}</div>
                        ${achievement.unlocked ? '<div class="achievement-badge">✓</div>' : ''}
                    </div>
                `;
            });
            
            html += '</div></div>';
        });
        
        this.elements.achievementPanel.innerHTML = html;
    }
    
    // ==================== 雷达图 ====================
    
    /**
     * 渲染能力雷达图
     */
    renderRadarChart(stats) {
        const categories = ['社会学', '研究方法', '统计分析', '理论理解', '综合应用'];
        const values = [
            stats.sociology || 0,
            stats.socialResearch || 0,
            stats.statistics || 0,
            stats.theory || 0,
            (stats.sociology + stats.socialResearch + stats.statistics + stats.theory) / 4
        ];
        
        const maxValue = 100;
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        const points = values.map((value, i) => {
            const angle = (Math.PI * 2 * i / categories.length) - Math.PI / 2;
            const distance = (value / maxValue) * radius;
            return {
                x: centerX + distance * Math.cos(angle),
                y: centerY + distance * Math.sin(angle)
            };
        });
        
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
        
        const axisPoints = categories.map((_, i) => {
            const angle = (Math.PI * 2 * i / categories.length) - Math.PI / 2;
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
        
        const axisLines = axisPoints.map((p, i) => 
            `<line x1="${centerX}" y1="${centerY}" x2="${p.x}" y2="${p.y}" stroke="#FFE8D6"/>`
        ).join('');
        
        const grids = [0.25, 0.5, 0.75, 1].map(scale => {
            const gridPoints = categories.map((_, i) => {
                const angle = (Math.PI * 2 * i / categories.length) - Math.PI / 2;
                return {
                    x: centerX + radius * scale * Math.cos(angle),
                    y: centerY + radius * scale * Math.sin(angle)
                };
            });
            return `<polygon points="${gridPoints.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="#FFE8D6"/>`;
        }).join('');
        
        return `
            <div class="radar-chart">
                <svg viewBox="0 0 200 200">
                    ${grids}
                    ${axisLines}
                    <polygon points="${pointsStr}" fill="rgba(255, 159, 67, 0.3)" stroke="#FF9F43" stroke-width="2"/>
                    ${points.map((p, i) => `
                        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FF9F43"/>
                        <text x="${p.x}" y="${p.y + 15}" text-anchor="middle" font-size="10" fill="#FF9F43">${categories[i]}</text>
                    `).join('')}
                </svg>
            </div>
        `;
    }
    
    // ==================== 周报生成 ====================
    
    /**
     * 生成周报
     */
    generateWeeklyReport(weekNumber) {
        const goal = this.weeklyGoals[weekNumber - 1];
        const state = this.gameEngine.getState();
        
        const completedInWeek = state.completedDays.filter(d => d >= goal.days[0] && d <= goal.days[1]);
        const totalDays = goal.days[1] - goal.days[0] + 1;
        const completionRate = Math.round((completedInWeek.length / totalDays) * 100);
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (100 - goal.days[0]));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        return {
            weekNumber,
            title: goal.title,
            description: goal.description,
            icon: goal.icon,
            dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
            completedDays: completedInWeek.length,
            totalDays,
            completionRate,
            xpEarned: this.calculateWeekXP(weekNumber),
            xpReward: goal.xpReward,
            knowledgeGained: this.getWeekKnowledgeSummary(weekNumber),
            recommendations: this.generateRecommendations(weekNumber, completionRate)
        };
    }
    
    /**
     * 计算本周获得的经验值
     */
    calculateWeekXP(weekNumber) {
        const goal = this.weeklyGoals[weekNumber - 1];
        const state = this.gameEngine.getState();
        const completedInWeek = state.completedDays.filter(d => d >= goal.days[0] && d <= goal.days[1]);
        return completedInWeek.length * 100;
    }
    
    /**
     * 获取本周知识总结
     */
    getWeekKnowledgeSummary(weekNumber) {
        const summaries = {
            1: ['社会学的研究对象', '社会学的学科定位', '社会学的想象力'],
            2: ['涂尔干的社会学方法论', '韦伯的社会行动理论', '马克思的阶级理论'],
            3: ['研究设计的基本要素', '抽样的类型与应用', '问卷设计的原则'],
            4: ['定量与定性研究的结合', '混合研究方法', '研究报告的撰写'],
            5: ['家庭结构的变化', '教育不平等', '社会再生产理论'],
            6: ['城市社会学的主要理论', '社会分层与流动', '地位获得的机制'],
            7: ['文化的定义与功能', '越轨行为的成因', '标签理论'],
            8: ['结构功能主义', '冲突理论', '符号互动论', '交换理论'],
            9: ['回归分析', '因子分析', '结构方程模型'],
            10: ['综合模拟测试', '薄弱环节识别', '针对性复习'],
            11: ['综合模拟测试', '答题策略优化', '时间管理'],
            12: ['综合模拟测试', '考前心理调整', '重点知识回顾'],
            13: ['查漏补缺', '错题复习', '知识框架梳理'],
            14: ['考前冲刺', '状态调整', '考试技巧']
        };
        
        return summaries[weekNumber] || ['综合复习'];
    }
    
    /**
     * 生成学习建议
     */
    generateRecommendations(weekNumber, completionRate) {
        const recommendations = [];
        
        if (completionRate < 50) {
            recommendations.push('本周学习进度较慢，建议增加每日学习时间 ⏰');
            recommendations.push('可以先跳过难点，后续再回头复习 📖');
        } else if (completionRate < 80) {
            recommendations.push('进度良好，可以适当加快节奏 💪');
            recommendations.push('注意复习巩固已学内容 🔄');
        } else if (completionRate >= 100) {
            recommendations.push('太棒了！可以考虑提前学习下周内容 🌟');
            recommendations.push('继续保持这个学习节奏 ✨');
        }
        
        if (weekNumber <= 4) {
            recommendations.push('基础阶段，重在理解概念，建立框架 🏗️');
        } else if (weekNumber <= 8) {
            recommendations.push('提升阶段，注重理论与实际的结合 🔗');
        } else {
            recommendations.push('冲刺阶段，多做模拟题，查漏补缺 🎯');
        }
        
        return recommendations;
    }
    
    // ==================== 数据导出 ====================
    
    /**
     * 导出进度报告
     */
    exportProgressReport() {
        const state = this.gameEngine.getState();
        const stats = this.gameEngine.getStatistics();
        
        return {
            playerName: state.playerName,
            currentDay: state.currentDay,
            level: state.level,
            totalXP: state.totalXP,
            daysCompleted: state.completedDays.length,
            accuracy: stats.accuracy,
            achievementsUnlocked: state.achievements.length,
            knowledgeMastery: this.progressData.knowledgeMastery,
            studyStreak: this.progressData.studyStreak,
            gameGoalProgress: {
                daysProgress: `${state.completedDays.length}/100`,
                xpProgress: `${state.totalXP}/${this.gameGoals.targetXP}`,
                readyForExam: state.completedDays.length >= 100
            },
            weeklyProgress: this.weeklyGoals.map((goal, i) => ({
                ...goal,
                ...this.generateWeeklyReport(i + 1)
            })),
            exportTime: new Date().toISOString()
        };
    }
    
    // ==================== 事件系统 ====================
    
    listeners = {};
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
    
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.saveProgressData();
        console.log('[ProgressTracker] 已销毁');
    }
}

// 导出为全局变量
window.ProgressTracker = ProgressTracker;
