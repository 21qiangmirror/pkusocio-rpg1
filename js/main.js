/**
 * 北大社会学考研RPG - 主入口文件
 * main.js - 页面初始化、路由处理、事件绑定、存档自动保存
 * 
 * 暖色调主题：#FF9F43 #F8B500 #FF6B6B | 薄荷绿 #00D9C0 | 成功绿 #4CAF50
 */

(function() {
    'use strict';
    
    // 全局命名空间
    window.PKUSociologyRPG = {
        version: '1.0.0',
        engine: null,
        narrative: null,
        quiz: null,
        progress: null
    };
    
    // DOM元素缓存
    const DOM = {};
    
    /**
     * 初始化应用程序
     */
    function init() {
        console.log('🎮 北大社会学考研RPG 初始化中...');
        
        // 缓存DOM元素
        cacheDOMElements();
        
        // 初始化游戏引擎
        initGameEngine();
        
        // 初始化叙事系统
        initNarrativeSystem();
        
        // 初始化题目系统
        initQuizSystem();
        
        // 初始化进度追踪
        initProgressTracker();
        
        // 设置路由
        setupRouting();
        
        // 绑定全局事件
        bindGlobalEvents();
        
        // 检查登录状态并加载主界面
        checkAuthAndLoad();
        
        // 初始化音效
        initAudioSystem();
        
        console.log('✅ 初始化完成！');
    }
    
    /**
     * 缓存常用DOM元素
     */
    function cacheDOMElements() {
        DOM.body = document.body;
        DOM.app = document.getElementById('app');
        DOM.loading = document.getElementById('loading');
        DOM.modal = document.getElementById('modal');
        
        // 游戏界面元素
        DOM.gameContainer = document.getElementById('game-container');
        DOM.dialogueContainer = document.getElementById('dialogue-container');
        DOM.dialogueText = document.getElementById('dialogue-text');
        DOM.speakerName = document.getElementById('speaker-name');
        DOM.characterImage = document.getElementById('character-image');
        DOM.background = document.getElementById('background');
        DOM.choicesContainer = document.getElementById('choices-container');
        DOM.sceneContainer = document.getElementById('scene-container');
        
        // 测验界面元素
        DOM.quizContainer = document.getElementById('quiz-container');
        DOM.questionArea = document.getElementById('question-area');
        DOM.optionsArea = document.getElementById('options-area');
        DOM.feedbackArea = document.getElementById('feedback-area');
        DOM.progressBar = document.getElementById('quiz-progress');
        DOM.timer = document.getElementById('timer');
        DOM.scoreDisplay = document.getElementById('score-display');
        
        // 进度追踪元素
        DOM.calendarView = document.getElementById('calendar-view');
        DOM.statsPanel = document.getElementById('stats-panel');
        DOM.achievementPanel = document.getElementById('achievement-panel');
        DOM.knowledgePanel = document.getElementById('knowledge-panel');
        
        // 侧边栏
        DOM.sidebar = document.getElementById('sidebar');
        DOM.menuBtn = document.getElementById('menu-btn');
    }
    
    /**
     * 初始化游戏引擎
     */
    function initGameEngine() {
        PKUSociologyRPG.engine = new GameEngine();
        
        // 监听游戏事件
        PKUSociologyRPG.engine.on('gameSaved', (state) => {
            showToast('💾 自动保存成功', 'success');
        });
        
        PKUSociologyRPG.engine.on('levelUp', (data) => {
            showAchievementPopup(`⭐ 升级！Lv.${data.newLevel}`, `经验值 +${data.totalXP}`);
        });
        
        PKUSociologyRPG.engine.on('achievementUnlocked', (achievement) => {
            showAchievementPopup(`${achievement.icon} 成就解锁！`, `${achievement.name}\n${achievement.description}`);
        });
        
        PKUSociologyRPG.engine.on('dayCompleted', (data) => {
            const daysLeft = 100 - data.day;
            showToast(`📚 第${data.day}天完成！距离上岸还有 ${daysLeft} 天`, 'success');
        });
        
        PKUSociologyRPG.engine.on('hiddenEvent', (event) => {
            showHiddenEventModal(event);
        });
        
        PKUSociologyRPG.engine.on('eggDiscovered', (egg) => {
            showAchievementPopup('🥚 彩蛋发现！', egg.name || '你发现了一个隐藏的彩蛋！');
        });
        
        PKUSociologyRPG.engine.on('xpAdded', (data) => {
            updateHUD();
        });
    }
    
    /**
     * 初始化叙事系统
     */
    function initNarrativeSystem() {
        PKUSociologyRPG.narrative = new NarrativeSystem(PKUSociologyRPG.engine);
        
        // 设置DOM元素
        PKUSociologyRPG.narrative.init({
            dialogueContainer: DOM.dialogueContainer,
            dialogueText: DOM.dialogueText,
            speakerName: DOM.speakerName,
            characterImage: DOM.characterImage,
            background: DOM.background,
            choicesContainer: DOM.choicesContainer,
            sceneContainer: DOM.sceneContainer
        });
        
        // 监听叙事事件
        PKUSociologyRPG.narrative.on('sceneLoaded', (scene) => {
            console.log(`🎬 场景加载: ${scene.id}`);
        });
        
        PKUSociologyRPG.narrative.on('choicesShown', (data) => {
            // 音效
            PKUSociologyRPG.narrative.playGeneratedSFX('click');
        });
        
        PKUSociologyRPG.narrative.on('sceneEnd', (node) => {
            // 自动进入测验或下一场景
            if (node.nextScene) {
                loadScene(node.nextScene);
            }
        });
    }
    
    /**
     * 初始化题目系统
     */
    function initQuizSystem() {
        PKUSociologyRPG.quiz = new QuizSystem(PKUSociologyRPG.engine, PKUSociologyRPG.narrative);
        
        // 设置DOM元素
        PKUSociologyRPG.quiz.init({
            quizContainer: DOM.quizContainer,
            questionArea: DOM.questionArea,
            optionsArea: DOM.optionsArea,
            feedbackArea: DOM.feedbackArea,
            progressBar: DOM.progressBar,
            timer: DOM.timer,
            scoreDisplay: DOM.scoreDisplay
        });
        
        // 监听测验事件
        PKUSociologyRPG.quiz.on('quizStarted', (quiz) => {
            console.log(`📝 测验开始: ${quiz.id}`);
            navigateTo('quiz');
        });
        
        PKUSociologyRPG.quiz.on('quizCompleted', (data) => {
            const { results, xpEarned } = data;
            showQuizResultModal(results, xpEarned);
        });
        
        PKUSociologyRPG.quiz.on('answerSubmitted', (answer) => {
            if (!answer.correct) {
                PKUSociologyRPG.narrative.playGeneratedSFX('wrong');
            }
        });
    }
    
    /**
     * 初始化进度追踪
     */
    function initProgressTracker() {
        PKUSociologyRPG.progress = new ProgressTracker(PKUSociologyRPG.engine);
        
        // 设置DOM元素
        PKUSociologyRPG.progress.init({
            progressContainer: document.getElementById('progress-container'),
            statsPanel: DOM.statsPanel,
            achievementPanel: DOM.achievementPanel,
            knowledgePanel: DOM.knowledgePanel,
            calendarView: DOM.calendarView
        });
        
        // 监听进度事件
        PKUSociologyRPG.progress.on('dayDetailRequested', (data) => {
            showDayDetailModal(data.day);
        });
    }
    
    /**
     * 设置路由
     */
    function setupRouting() {
        // 简单路由实现
        window.addEventListener('hashchange', handleRoute);
        
        // 拦截链接点击
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                navigateTo(link.dataset.route, link.dataset.params);
            }
        });
    }
    
    /**
     * 处理路由变化
     */
    function handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [route, params] = hash.split('?');
        
        renderPage(route, params);
    }
    
    /**
     * 导航到指定页面
     */
    function navigateTo(route, params = '') {
        window.location.hash = params ? `${route}?${params}` : route;
    }
    
    /**
     * 渲染页面
     */
    function renderPage(route, params) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示目标页面
        const targetPage = document.getElementById(`${route}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // 页面特定逻辑
        switch (route) {
            case 'home':
                renderHomePage();
                break;
            case 'calendar':
                PKUSociologyRPG.progress.renderCalendarView();
                break;
            case 'stats':
                PKUSociologyRPG.progress.renderStatsPanel();
                break;
            case 'achievements':
                PKUSociologyRPG.progress.renderAchievementPanel();
                break;
            case 'knowledge':
                PKUSociologyRPG.progress.renderKnowledgePanel();
                break;
            case 'wrong-answers':
                renderWrongAnswersPage();
                break;
            case 'notes':
                renderNotesPage();
                break;
            case 'settings':
                renderSettingsPage();
                break;
        }
    }
    
    /**
     * 渲染首页
     */
    function renderHomePage() {
        const state = PKUSociologyRPG.engine.getState();
        const stats = PKUSociologyRPG.engine.getStatistics();
        const daysLeft = 100 - state.currentDay;
        
        // 更新HUD
        updateHUD();
        
        // 渲染当前天数卡片
        renderCurrentDayCard(state.currentDay);
    }
    
    /**
     * 渲染当前天数卡片
     */
    function renderCurrentDayCard(day) {
        const dayCard = document.getElementById('current-day-card');
        if (!dayCard) return;
        
        const isUnlocked = PKUSociologyRPG.engine.isDayUnlocked(day);
        const isCompleted = PKUSociologyRPG.engine.isDayCompleted(day);
        const stats = PKUSociologyRPG.engine.getStatistics();
        
        dayCard.innerHTML = `
            <div class="day-header">
                <span class="day-badge ${isCompleted ? 'completed' : isUnlocked ? 'active' : 'locked'}">
                    ${isCompleted ? '✓' : isUnlocked ? '▶' : '🔒'}
                </span>
                <span class="day-title">第 ${day} 天</span>
            </div>
            <div class="day-info">
                <div class="info-item">
                    <span class="info-icon">📚</span>
                    <span class="info-label">学习进度</span>
                    <span class="info-value">${stats.daysCompleted}/100</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🎯</span>
                    <span class="info-label">正确率</span>
                    <span class="info-value">${stats.accuracy}%</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">⭐</span>
                    <span class="info-label">当前等级</span>
                    <span class="info-value">Lv.${stats.level}</span>
                </div>
            </div>
            <div class="day-motivation">
                ${getMotivationText(stats.daysCompleted)}
            </div>
            ${isUnlocked && !isCompleted ? `
                <button class="start-btn warm-btn" data-route="play" data-day="${day}">
                    🎮 开始学习
                </button>
            ` : isCompleted ? `
                <button class="review-btn" data-route="review" data-day="${day}">
                    🔄 复习回顾
                </button>
            ` : `
                <button class="locked-btn" disabled>
                    🔒 完成前一天解锁
                </button>
            `}
        `;
    }
    
    /**
     * 获取激励文案
     */
    function getMotivationText(progress) {
        if (progress >= 100) return '🎉 恭喜！已具备考研上岸能力！';
        if (progress >= 80) return '💪 胜利在望！继续冲刺！';
        if (progress >= 50) return '🔥 已过半！保持节奏！';
        if (progress >= 30) return '✨ 稳扎稳打，继续加油！';
        if (progress >= 10) return '🌱 良好的开始！';
        return '🚀 考研之旅开始了！';
    }
    
    /**
     * 更新HUD显示
     */
    function updateHUD() {
        const state = PKUSociologyRPG.engine.getState();
        const stats = PKUSociologyRPG.engine.getStatistics();
        const levelProgress = PKUSociologyRPG.engine.getLevelProgress();
        
        // 更新等级显示
        const levelEl = document.getElementById('hud-level');
        if (levelEl) levelEl.textContent = `Lv.${stats.level}`;
        
        // 更新XP显示
        const xpEl = document.getElementById('hud-xp');
        if (xpEl) xpEl.textContent = `${state.totalXP} XP`;
        
        // 更新进度条
        const xpBarEl = document.getElementById('hud-xp-bar');
        if (xpBarEl) xpBarEl.style.width = `${levelProgress}%`;
        
        // 更新天数显示
        const dayEl = document.getElementById('hud-day');
        if (dayEl) dayEl.textContent = `第${state.currentDay}天`;
        
        // 更新成就徽章
        const achievementStats = PKUSociologyRPG.engine.getAchievementStats();
        const badgeEl = document.getElementById('achievement-badge');
        if (badgeEl) badgeEl.textContent = `${achievementStats.unlocked}/${achievementStats.total}`;
    }
    
    /**
     * 加载场景
     */
    function loadScene(sceneId) {
        // 加载场景数据
        fetch(`data/scenes/${sceneId}.json`)
            .then(response => response.json())
            .then(sceneData => {
                PKUSociologyRPG.narrative.loadScene(sceneData);
                navigateTo('game');
            })
            .catch(error => {
                console.error('加载场景失败:', error);
                showToast('加载场景失败，请重试', 'error');
            });
    }
    
    /**
     * 开始学习
     */
    function startLearning(day) {
        // 检查天数是否解锁
        if (!PKUSociologyRPG.engine.isDayUnlocked(day)) {
            showToast('请先完成前一天的学习', 'warning');
            return;
        }
        
        // 更新当前天数
        PKUSociologyRPG.engine.updateState({ currentDay: day });
        
        // 加载剧情
        loadScene(`day_${day}_intro`);
    }
    
    /**
     * 开始测验
     */
    function startQuiz(day) {
        // 加载测验数据
        fetch(`data/quizzes/day_${day}.json`)
            .then(response => response.json())
            .then(quizData => {
                PKUSociologyRPG.quiz.startQuiz(quizData);
            })
            .catch(error => {
                console.error('加载测验失败:', error);
                showToast('加载测验失败，请重试', 'error');
            });
    }
    
    /**
     * 检查登录状态并加载
     */
    function checkAuthAndLoad() {
        // 简化处理：直接加载游戏
        if (PKUSociologyRPG.engine.hasSave()) {
            navigateTo('home');
        } else {
            navigateTo('home');
        }
        
        // 隐藏加载动画
        if (DOM.loading) {
            DOM.loading.classList.add('fade-out');
            setTimeout(() => {
                DOM.loading.style.display = 'none';
            }, 500);
        }
    }
    
    /**
     * 绑定全局事件
     */
    function bindGlobalEvents() {
        // 菜单按钮
        if (DOM.menuBtn) {
            DOM.menuBtn.addEventListener('click', toggleSidebar);
        }
        
        // 键盘快捷键
        document.addEventListener('keydown', handleKeyboard);
        
        // 触摸滑动（移动端侧边栏）
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;
            
            if (diff > 50 && touchStartX < 50) {
                // 从左滑入
                openSidebar();
            } else if (diff < -50 && touchStartX > window.innerWidth - 50) {
                // 从右滑出
                closeSidebar();
            }
        });
    }
    
    /**
     * 处理键盘快捷键
     */
    function handleKeyboard(e) {
        // 空格/回车：继续对话
        if (e.code === 'Space' || e.code === 'Enter') {
            if (PKUSociologyRPG.narrative?.isTyping) {
                PKUSociologyRPG.narrative.skipTypewriter();
            }
        }
        
        // ESC：打开菜单/关闭弹窗
        if (e.code === 'Escape') {
            closeAllModals();
            if (DOM.sidebar?.classList.contains('open')) {
                closeSidebar();
            }
        }
        
        // S：保存游戏
        if (e.code === 'KeyS' && e.ctrlKey) {
            e.preventDefault();
            PKUSociologyRPG.engine.saveGame();
            showToast('💾 游戏已保存', 'success');
        }
    }
    
    /**
     * 切换侧边栏
     */
    function toggleSidebar() {
        DOM.sidebar?.classList.toggle('open');
    }
    
    function openSidebar() {
        DOM.sidebar?.classList.add('open');
    }
    
    function closeSidebar() {
        DOM.sidebar?.classList.remove('open');
    }
    
    /**
     * 初始化音效系统
     */
    function initAudioSystem() {
        // 预加载音效
        const sfxList = ['select', 'correct', 'wrong', 'click', 'levelup'];
        
        sfxList.forEach(sfx => {
            const audio = new Audio(`assets/audio/sfx/${sfx}.mp3`);
            audio.preload = 'auto';
        });
    }
    
    // ==================== UI辅助函数 ====================
    
    /**
     * 显示Toast提示
     */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
    
    /**
     * 显示成就弹窗
     */
    function showAchievementPopup(title, description) {
        const modal = createModal({
            title,
            content: `<div class="achievement-popup">${description}</div>`,
            className: 'achievement-modal warm-modal'
        });
        
        setTimeout(() => closeModal(modal), 3000);
    }
    
    /**
     * 显示隐藏事件弹窗
     */
    function showHiddenEventModal(event) {
        const modal = createModal({
            title: event.title,
            content: `<div class="hidden-event-content">${event.message.replace(/\n/g, '<br>')}</div>`,
            className: 'hidden-event-modal',
            buttons: [{ text: '✨ 继续', action: 'close' }]
        });
    }
    
    /**
     * 显示测验结果弹窗
     */
    function showQuizResultModal(results, xpEarned) {
        const accuracy = results.accuracy;
        let emoji, message;
        
        if (accuracy >= 90) { emoji = '🌟'; message = '太棒了！'; }
        else if (accuracy >= 70) { emoji = '👍'; message = '不错！'; }
        else if (accuracy >= 60) { emoji = '💪'; message = '继续加油！'; }
        else { emoji = '📚'; message = '需要加强复习'; }
        
        const modal = createModal({
            title: `${emoji} 测验完成 - ${message}`,
            content: `
                <div class="quiz-result">
                    <div class="result-stats">
                        <div class="stat">
                            <span class="stat-value">${results.correctCount}/${results.totalQuestions}</span>
                            <span class="stat-label">正确题数</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${accuracy}%</span>
                            <span class="stat-label">正确率</span>
                        </div>
                        <div class="stat xp-gain">
                            <span class="stat-value">+${xpEarned}</span>
                            <span class="stat-label">经验值</span>
                        </div>
                    </div>
                    ${results.correctCount < results.totalQuestions ? `
                        <div class="wrong-summary">
                            <p>有 ${results.totalQuestions - results.correctCount} 道题答错了</p>
                            <button class="review-btn" onclick="PKUSociologyRPG.app.reviewWrong()">
                                📝 查看错题
                            </button>
                        </div>
                    ` : ''}
                </div>
            `,
            className: 'quiz-result-modal warm-modal',
            buttons: [
                { text: '📊 查看进度', action: () => { closeModal(modal); navigateTo('stats'); } },
                { text: '▶ 继续学习', action: () => { closeModal(modal); nextDay(); } }
            ]
        });
    }
    
    /**
     * 显示天数详情弹窗
     */
    function showDayDetailModal(day) {
        const state = PKUSociologyRPG.engine.getState();
        const isUnlocked = PKUSociologyRPG.engine.isDayUnlocked(day);
        const isCompleted = PKUSociologyRPG.engine.isDayCompleted(day);
        
        const modal = createModal({
            title: `📅 第 ${day} 天`,
            content: `
                <div class="day-detail">
                    <div class="day-status ${isCompleted ? 'completed' : isUnlocked ? 'active' : 'locked'}">
                        ${isCompleted ? '✓ 已完成' : isUnlocked ? '▶ 可学习' : '🔒 未解锁'}
                    </div>
                    <div class="day-content-preview">
                        ${getDayContentPreview(day)}
                    </div>
                </div>
            `,
            className: 'day-detail-modal',
            buttons: [
                isUnlocked && !isCompleted ? 
                    { text: '🎮 开始学习', action: () => { closeModal(modal); startLearning(day); } } :
                    { text: '关闭', action: 'close' }
            ]
        });
    }
    
    /**
     * 获取天数内容预览
     */
    function getDayContentPreview(day) {
        // 根据天数返回不同的内容预览
        const contents = {
            1: '社会学的研究对象与方法',
            7: '社会群体与社会结构',
            14: '社会分层与社会流动',
            30: '社会越轨与社会控制'
        };
        
        return contents[day] || '社会学专题学习';
    }
    
    /**
     * 渲染错题本页面
     */
    function renderWrongAnswersPage() {
        const wrongAnswers = PKUSociologyRPG.engine.getWrongAnswers();
        const container = document.getElementById('wrong-answers-list');
        
        if (!container) return;
        
        if (wrongAnswers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎉</span>
                    <p>太棒了！错题本空空如也！</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = wrongAnswers.map((item, idx) => `
            <div class="wrong-answer-item">
                <div class="item-header">
                    <span class="item-number">${idx + 1}</span>
                    <span class="item-day">第${item.day}天</span>
                </div>
                <div class="item-question">${item.question}</div>
                <div class="item-answer">
                    <span class="wrong-mark">✗</span>
                    <span>${Array.isArray(item.userAnswer) ? item.userAnswer.join(', ') : item.userAnswer}</span>
                </div>
                <button class="review-btn" onclick="PKUSociologyRPG.app.reviewQuestion('${item.questionId}')">
                    🔄 再试一次
                </button>
            </div>
        `).join('');
    }
    
    /**
     * 渲染笔记页面
     */
    function renderNotesPage() {
        const notes = PKUSociologyRPG.engine.getNotes();
        const container = document.getElementById('notes-list');
        
        if (!container) return;
        
        if (notes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📝</span>
                    <p>还没有笔记，开始记录吧！</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = notes.map(note => `
            <div class="note-item" data-id="${note.id}">
                <div class="note-day">第${note.day}天</div>
                <div class="note-content">${note.content}</div>
                <div class="note-actions">
                    <button class="edit-btn" onclick="PKUSociologyRPG.app.editNote('${note.id}')">✏️</button>
                    <button class="delete-btn" onclick="PKUSociologyRPG.app.deleteNote('${note.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 渲染设置页面
     */
    function renderSettingsPage() {
        const settings = PKUSociologyRPG.engine.getSettings();
        const theme = PKUSociologyRPG.engine.getThemeConfig();
        
        const container = document.getElementById('settings-content');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-section">
                <h4>🔊 音效设置</h4>
                <div class="setting-item">
                    <label>音效</label>
                    <input type="checkbox" id="setting-sound" ${settings.sound ? 'checked' : ''} 
                           onchange="PKUSociologyRPG.app.updateSetting('sound', this.checked)">
                </div>
                <div class="setting-item">
                    <label>背景音乐</label>
                    <input type="checkbox" id="setting-music" ${settings.music ? 'checked' : ''} 
                           onchange="PKUSociologyRPG.app.updateSetting('music', this.checked)">
                </div>
            </div>
            
            <div class="settings-section">
                <h4>📖 显示设置</h4>
                <div class="setting-item">
                    <label>文字速度</label>
                    <select id="setting-textspeed" onchange="PKUSociologyRPG.app.updateSetting('textSpeed', parseInt(this.value))">
                        <option value="10" ${settings.textSpeed === 10 ? 'selected' : ''}>快速</option>
                        <option value="30" ${settings.textSpeed === 30 ? 'selected' : ''}>正常</option>
                        <option value="50" ${settings.textSpeed === 50 ? 'selected' : ''}>慢速</option>
                    </select>
                </div>
            </div>
            
            <div class="settings-section">
                <h4>💾 数据管理</h4>
                <div class="setting-item">
                    <label>自动保存</label>
                    <input type="checkbox" id="setting-autosave" ${settings.autoSave ? 'checked' : ''} 
                           onchange="PKUSociologyRPG.app.updateSetting('autoSave', this.checked)">
                </div>
                <button class="action-btn" onclick="PKUSociologyRPG.app.exportSave()">📤 导出存档</button>
                <button class="action-btn" onclick="PKUSociologyRPG.app.importSave()">📥 导入存档</button>
                <button class="danger-btn" onclick="PKUSociologyRPG.app.resetGame()">⚠️ 重置游戏</button>
            </div>
            
            <div class="settings-section theme-preview">
                <h4>🎨 主题预览</h4>
                <div class="theme-colors">
                    <span class="color-swatch" style="background: ${theme.primary}" title="主色"></span>
                    <span class="color-swatch" style="background: ${theme.secondary}" title="次色"></span>
                    <span class="color-swatch" style="background: ${theme.accent}" title="强调"></span>
                    <span class="color-swatch" style="background: ${theme.success}" title="成功"></span>
                    <span class="color-swatch" style="background: ${theme.mint}" title="薄荷"></span>
                </div>
            </div>
        `;
    }
    
    /**
     * 创建模态框
     */
    function createModal(options) {
        const modal = document.createElement('div');
        modal.className = `modal ${options.className || ''}`;
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${options.title}</h3>
                    <button class="modal-close" onclick="PKUSociologyRPG.app.closeModal(this)">×</button>
                </div>
                <div class="modal-body">${options.content}</div>
                ${options.buttons ? `
                    <div class="modal-footer">
                        ${options.buttons.map(btn => 
                            typeof btn === 'string' ? `<button>${btn}</button>` :
                            `<button class="${btn.class || ''}" data-action="${btn.action || ''}">${btn.text}</button>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        // 绑定按钮事件
        if (options.buttons) {
            modal.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    if (action === 'close') {
                        closeModal(modal);
                    } else if (options.buttons.find(b => b.action === action)?.action) {
                        options.buttons.find(b => b.action === action)?.action();
                    }
                });
            });
        }
        
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('open'));
        
        return modal;
    }
    
    /**
     * 关闭模态框
     */
    function closeModal(modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.remove(), 300);
    }
    
    /**
     * 关闭所有模态框
     */
    function closeAllModals() {
        document.querySelectorAll('.modal.open').forEach(closeModal);
    }
    
    /**
     * 进入下一天
     */
    function nextDay() {
        const currentDay = PKUSociologyRPG.engine.getState().currentDay;
        if (currentDay < 100) {
            startLearning(currentDay + 1);
        } else {
            showToast('🎉 恭喜完成所有学习！', 'success');
            navigateTo('stats');
        }
    }
    
    /**
     * 复习错题
     */
    function reviewWrongAnswers() {
        const wrongAnswers = PKUSociologyRPG.engine.getWrongAnswers();
        if (wrongAnswers.length > 0) {
            // 启动错题复习测验
            PKUSociologyRPG.quiz.startQuiz({
                id: 'wrong_review',
                questions: wrongAnswers.map(w => w.question),
                day: 'review'
            });
        }
    }
    
    // ==================== 导出应用接口 ====================
    
    window.PKUSociologyRPG.app = {
        // 导航
        navigateTo,
        startLearning,
        startQuiz,
        
        // 设置
        updateSetting: (key, value) => {
            PKUSociologyRPG.engine.updateSettings({ [key]: value });
            showToast('设置已保存', 'success');
        },
        
        // 存档
        exportSave: () => {
            const data = PKUSociologyRPG.engine.exportSave();
            navigator.clipboard.writeText(data);
            showToast('存档已复制到剪贴板', 'success');
        },
        
        importSave: () => {
            const data = prompt('请粘贴存档数据：');
            if (data && PKUSociologyRPG.engine.importSave(data)) {
                showToast('存档导入成功', 'success');
                location.reload();
            }
        },
        
        resetGame: () => {
            if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
                PKUSociologyRPG.engine.resetGame(true);
                location.reload();
            }
        },
        
        // 笔记
        addNote: (content) => {
            PKUSociologyRPG.engine.addNote(content);
            showToast('笔记已保存', 'success');
        },
        
        editNote: (noteId) => {
            const note = PKUSociologyRPG.engine.getNotes().find(n => n.id === noteId);
            if (note) {
                const newContent = prompt('编辑笔记：', note.content);
                if (newContent) {
                    PKUSociologyRPG.engine.deleteNote(noteId);
                    PKUSociologyRPG.engine.addNote(newContent, note.day);
                    renderNotesPage();
                }
            }
        },
        
        deleteNote: (noteId) => {
            if (confirm('确定删除这条笔记？')) {
                PKUSociologyRPG.engine.deleteNote(noteId);
                renderNotesPage();
            }
        },
        
        // 错题
        reviewWrong: reviewWrongAnswers,
        reviewQuestion: (questionId) => {
            // 实现特定题目复习
            console.log('复习题目:', questionId);
        },
        
        // 模态框
        closeModal,
        
        // HUD
        updateHUD,
        
        // 彩蛋发现
        discoverEgg: (eggId, eggData) => {
            PKUSociologyRPG.engine.discoverEgg(eggId, eggData);
        }
    };
    
    // ==================== 启动应用 ====================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
