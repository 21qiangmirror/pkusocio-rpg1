/**
 * 北大社会学考研RPG - 叙事系统
 * NarrativeSystem.js - 对话解析、场景切换、音效控制、打字机效果、角色立绘管理
 */

class NarrativeSystem {
    constructor(gameEngine) {
        // 依赖游戏引擎
        this.gameEngine = gameEngine;
        
        // DOM元素引用
        this.elements = {
            dialogueContainer: null,
            dialogueText: null,
            speakerName: null,
            characterImage: null,
            background: null,
            choicesContainer: null,
            sceneContainer: null
        };
        
        // 当前叙事状态
        this.currentScene = null;
        this.currentNode = null;
        this.dialogueQueue = [];
        this.isTyping = false;
        this.typewriterSpeed = 30; // 毫秒每字符
        
        // 音频系统
        this.audioContext = null;
        this.sounds = {};
        this.music = null;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        
        // 角色立绘配置
        this.characterExpressions = {
            normal: 'normal',
            happy: 'happy',
            sad: 'sad',
            angry: 'angry',
            thinking: 'thinking',
            surprised: 'surprised'
        };
        
        // 动画配置
        this.animationConfig = {
            fadeIn: 300,
            fadeOut: 200,
            slideIn: 400
        };
        
        // 回调函数
        this.onSceneChange = null;
        this.onDialogueEnd = null;
        this.onChoiceSelected = null;
    }
    
    /**
     * 初始化叙事系统
     * @param {Object} elements - DOM元素配置
     */
    init(elements = {}) {
        // 设置DOM元素引用
        this.elements = { ...this.elements, ...elements };
        
        // 初始化音频上下文
        this.initAudio();
        
        // 绑定快捷键
        this.bindKeyboard();
        
        console.log('[NarrativeSystem] 初始化完成');
    }
    
    /**
     * 初始化音频系统
     */
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('[NarrativeSystem] 音频上下文初始化失败:', error);
        }
    }
    
    /**
     * 绑定键盘快捷键
     */
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            // 空格或回车键：继续对话或确认选择
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.continueDialogue();
            }
            
            // ESC键：打开菜单
            if (e.code === 'Escape') {
                this.emit('escapePressed');
            }
        });
        
        // 点击继续对话
        if (this.elements.dialogueContainer) {
            this.elements.dialogueContainer.addEventListener('click', () => {
                this.continueDialogue();
            });
        }
    }
    
    /**
     * 加载场景数据
     * @param {Object} sceneData - 场景数据结构
     */
    loadScene(sceneData) {
        this.currentScene = sceneData;
        this.currentNode = null;
        this.dialogueQueue = [];
        
        // 记录场景访问
        this.gameEngine.visitScene(sceneData.id);
        
        // 设置背景音乐
        if (sceneData.bgm) {
            this.playBGM(sceneData.bgm);
        } else {
            this.stopBGM();
        }
        
        // 设置背景
        if (sceneData.background) {
            this.setBackground(sceneData.background);
        }
        
        // 触发场景变化回调
        if (this.onSceneChange) {
            this.onSceneChange(sceneData);
        }
        
        this.emit('sceneLoaded', sceneData);
        
        // 如果有起始节点，开始播放
        if (sceneData.startNode) {
            this.goToNode(sceneData.startNode);
        }
    }
    
    /**
     * 跳转到指定节点
     * @param {string} nodeId - 节点ID
     */
    goToNode(nodeId) {
        if (!this.currentScene) return;
        
        const node = this.findNode(nodeId);
        if (!node) {
            console.error(`[NarrativeSystem] 未找到节点: ${nodeId}`);
            return;
        }
        
        this.currentNode = node;
        this.dialogueQueue = [];
        
        // 处理节点类型
        switch (node.type) {
            case 'dialogue':
                this.playDialogue(node);
                break;
            case 'choice':
                this.showChoices(node);
                break;
            case 'scene':
                this.changeScene(node);
                break;
            case 'quiz':
                this.emit('quizStart', node);
                break;
            case 'event':
                this.handleEvent(node);
                break;
            case 'end':
                this.handleSceneEnd(node);
                break;
            default:
                this.playDialogue(node);
        }
    }
    
    /**
     * 查找节点
     * @param {string} nodeId - 节点ID
     * @returns {Object|null}
     */
    findNode(nodeId) {
        if (!this.currentScene || !this.currentScene.nodes) return null;
        return this.currentScene.nodes[nodeId] || null;
    }
    
    /**
     * 播放对话
     * @param {Object} node - 对话节点
     */
    playDialogue(node) {
        // 解析对话内容
        const dialogues = Array.isArray(node.content) ? node.content : [node.content];
        
        dialogues.forEach(dialogue => {
            this.dialogueQueue.push({
                speaker: dialogue.speaker || '',
                text: dialogue.text || '',
                expression: dialogue.expression || 'normal',
                emotion: dialogue.emotion || null,
                next: dialogue.next || null,
                sfx: dialogue.sfx || null,
                condition: dialogue.condition || null
            });
        });
        
        // 如果有下一节点，加入队列
        if (node.next) {
            this.dialogueQueue.push({
                _type: 'goto',
                nodeId: node.next
            });
        }
        
        // 开始播放对话
        this.playNextDialogue();
    }
    
    /**
     * 播放下一条对话
     */
    playNextDialogue() {
        if (this.dialogueQueue.length === 0) {
            this.onDialogueComplete();
            return;
        }
        
        const item = this.dialogueQueue.shift();
        
        // 处理特殊类型
        if (item._type === 'goto') {
            this.goToNode(item.nodeId);
            return;
        }
        
        // 检查条件
        if (item.condition && !this.evaluateCondition(item.condition)) {
            this.playNextDialogue();
            return;
        }
        
        // 显示对话
        this.displayDialogue(item);
    }
    
    /**
     * 显示对话内容
     * @param {Object} dialogue - 对话数据
     */
    displayDialogue(dialogue) {
        const { speaker, text, expression, sfx } = dialogue;
        
        // 更新说话者名称
        if (this.elements.speakerName) {
            this.elements.speakerName.textContent = speaker;
            this.elements.speakerName.style.display = speaker ? 'block' : 'none';
        }
        
        // 更新角色立绘
        if (this.elements.characterImage) {
            this.setCharacterImage(speaker, expression);
        }
        
        // 播放音效
        if (sfx) {
            this.playSFX(sfx);
        }
        
        // 打字机效果显示文本
        if (this.elements.dialogueText) {
            this.typewriterEffect(text, () => {
                // 打字完成后设置下一节点
                dialogue._resolved = true;
            });
        }
    }
    
    /**
     * 打字机效果
     * @param {string} text - 文本内容
     * @param {Function} onComplete - 完成回调
     */
    typewriterEffect(text, onComplete) {
        this.isTyping = true;
        this.elements.dialogueText.textContent = '';
        
        let index = 0;
        const speed = this.gameEngine.getSettings().textSpeed || this.typewriterSpeed;
        
        const type = () => {
            if (index < text.length) {
                this.elements.dialogueText.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                this.isTyping = false;
                if (onComplete) onComplete();
            }
        };
        
        type();
    }
    
    /**
     * 跳过打字机效果
     */
    skipTypewriter() {
        if (this.isTyping && this.elements.dialogueText) {
            this.isTyping = false;
            // 获取当前正在显示的对话的完整文本
            const currentDialogue = this.dialogueQueue.find(d => !d._resolved);
            if (currentDialogue) {
                this.elements.dialogueText.textContent = currentDialogue.text;
            }
        }
    }
    
    /**
     * 继续对话（点击或按空格）
     */
    continueDialogue() {
        if (this.isTyping) {
            // 跳过打字机效果
            this.skipTypewriter();
        } else {
            // 播放下一条对话
            this.playNextDialogue();
        }
    }
    
    /**
     * 显示选项
     * @param {Object} node - 选项节点
     */
    showChoices(node) {
        const choices = node.choices || [];
        
        if (this.elements.choicesContainer) {
            this.elements.choicesContainer.innerHTML = '';
            this.elements.choicesContainer.style.display = 'flex';
            
            choices.forEach((choice, index) => {
                // 检查选项条件
                if (choice.condition && !this.evaluateCondition(choice.condition)) {
                    return;
                }
                
                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = choice.text;
                
                // 添加视觉效果
                button.style.animationDelay = `${index * 100}ms`;
                
                button.addEventListener('click', () => {
                    this.selectChoice(choice, index);
                });
                
                this.elements.choicesContainer.appendChild(button);
            });
            
            // 添加淡入动画
            this.fadeIn(this.elements.choicesContainer);
        }
        
        this.emit('choicesShown', { node, choices });
    }
    
    /**
     * 选择选项
     * @param {Object} choice - 选项数据
     * @param {number} index - 选项索引
     */
    selectChoice(choice, index) {
        // 播放选择音效
        this.playSFX('select');
        
        // 隐藏选项
        if (this.elements.choicesContainer) {
            this.fadeOut(this.elements.choicesContainer, () => {
                this.elements.choicesContainer.style.display = 'none';
            });
        }
        
        // 触发回调
        if (this.onChoiceSelected) {
            this.onChoiceSelected(choice, index);
        }
        
        this.emit('choiceSelected', { choice, index });
        
        // 执行选项效果
        if (choice.effect) {
            this.applyEffect(choice.effect);
        }
        
        // 跳转到下一节点
        if (choice.next) {
            setTimeout(() => {
                this.goToNode(choice.next);
            }, 300);
        }
    }
    
    /**
     * 切换场景
     * @param {Object} node - 场景节点
     */
    changeScene(node) {
        // 淡出当前场景
        this.fadeOut(this.elements.sceneContainer, () => {
            // 加载新场景
            if (node.sceneData) {
                this.loadScene(node.sceneData);
            } else if (node.sceneId) {
                this.emit('requestSceneLoad', node.sceneId);
            }
        });
    }
    
    /**
     * 处理事件节点
     * @param {Object} node - 事件节点
     */
    handleEvent(node) {
        if (node.eventType === 'unlockDay') {
            this.gameEngine.unlockDay(node.day);
        } else if (node.eventType === 'addXP') {
            this.gameEngine.addXP(node.amount);
        } else if (node.eventType === 'unlockAchievement') {
            this.gameEngine.unlockAchievement(node.achievementId);
        } else if (node.eventType === 'completeDay') {
            this.gameEngine.completeDay(node.day, node.results);
        }
        
        // 继续到下一节点
        if (node.next) {
            setTimeout(() => {
                this.goToNode(node.next);
            }, node.delay || 500);
        }
    }
    
    /**
     * 处理场景结束
     * @param {Object} node - 结束节点
     */
    handleSceneEnd(node) {
        if (this.onDialogueEnd) {
            this.onDialogueEnd(node);
        }
        this.emit('sceneEnd', node);
    }
    
    /**
     * 对话完成回调
     */
    onDialogueComplete() {
        if (this.currentNode && this.currentNode.next) {
            this.goToNode(this.currentNode.next);
        } else {
            // 如果是场景中的最后一个节点，触发结束回调
            if (this.onDialogueEnd) {
                this.onDialogueEnd();
            }
        }
    }
    
    /**
     * 评估条件
     * @param {Object|string} condition - 条件
     * @returns {boolean}
     */
    evaluateCondition(condition) {
        if (typeof condition === 'string') {
            // 简单的表达式求值
            try {
                const state = this.gameEngine.getState();
                return new Function('state', `with(state) { return ${condition}; }`)(state);
            } catch (e) {
                console.warn('[NarrativeSystem] 条件评估失败:', condition, e);
                return true;
            }
        }
        
        if (typeof condition === 'object') {
            const state = this.gameEngine.getState();
            
            // 检查属性条件
            if (condition.level && state.level < condition.level) return false;
            if (condition.totalXP && state.totalXP < condition.totalXP) return false;
            if (condition.achievement && !state.achievements.includes(condition.achievement)) return false;
            if (condition.dayCompleted && !state.completedDays.includes(condition.dayCompleted)) return false;
            
            // 检查自定义函数
            if (condition.custom && typeof condition.custom === 'function') {
                return condition.custom(state);
            }
        }
        
        return true;
    }
    
    /**
     * 应用效果
     * @param {Object} effect - 效果对象
     */
    applyEffect(effect) {
        if (effect.addXP) {
            this.gameEngine.addXP(effect.addXP);
        }
        if (effect.unlockDay) {
            this.gameEngine.unlockDay(effect.unlockDay);
        }
        if (effect.unlockAchievement) {
            this.gameEngine.unlockAchievement(effect.unlockAchievement);
        }
        if (effect.updateStat) {
            this.gameEngine.updateCharacterStat(effect.updateStat, effect.statValue || 0);
        }
    }
    
    // ==================== 角色立绘系统 ====================
    
    /**
     * 设置角色立绘
     * @param {string} characterId - 角色ID
     * @param {string} expression - 表情
     */
    setCharacterImage(characterId, expression = 'normal') {
        if (!this.elements.characterImage) return;
        
        // 构建图片路径
        const basePath = 'assets/images/characters/';
        const imagePath = `${basePath}${characterId}_${expression}.png`;
        
        // 检查图片是否存在
        const img = new Image();
        img.onload = () => {
            this.elements.characterImage.src = imagePath;
            this.elements.characterImage.style.display = 'block';
        };
        img.onerror = () => {
            // 使用默认占位图
            this.elements.characterImage.style.display = 'none';
        };
        img.src = imagePath;
    }
    
    /**
     * 隐藏角色立绘
     */
    hideCharacterImage() {
        if (this.elements.characterImage) {
            this.fadeOut(this.elements.characterImage, () => {
                this.elements.characterImage.style.display = 'none';
            });
        }
    }
    
    // ==================== 背景系统 ====================
    
    /**
     * 设置背景
     * @param {string} backgroundId - 背景ID或路径
     */
    setBackground(backgroundId) {
        if (!this.elements.background) return;
        
        // 构建背景路径
        let bgPath;
        if (backgroundId.startsWith('http') || backgroundId.startsWith('/') || backgroundId.startsWith('./')) {
            bgPath = backgroundId;
        } else {
            bgPath = `assets/images/backgrounds/${backgroundId}.jpg`;
        }
        
        // 淡入新背景
        this.elements.background.style.backgroundImage = `url(${bgPath})`;
    }
    
    // ==================== 音频系统 ====================
    
    /**
     * 播放背景音乐
     * @param {string} musicId - 音乐ID或路径
     * @param {boolean} loop - 是否循环
     */
    playBGM(musicId, loop = true) {
        if (!this.gameEngine.getSettings().music) return;
        
        const settings = this.gameEngine.getSettings();
        
        // 停止当前音乐
        this.stopBGM();
        
        // 构建音乐路径
        let musicPath;
        if (musicId.startsWith('http') || musicId.startsWith('/')) {
            musicPath = musicId;
        } else {
            musicPath = `assets/audio/bgm/${musicId}.mp3`;
        }
        
        this.music = new Audio(musicPath);
        this.music.loop = loop;
        this.music.volume = settings.musicVolume || this.musicVolume;
        
        // 使用 Web Audio API 以支持更流畅的播放
        if (this.audioContext) {
            this.audioContext.resume().then(() => {
                this.music.play().catch(e => {
                    console.warn('[NarrativeSystem] BGM播放失败:', e);
                });
            });
        } else {
            this.music.play().catch(e => {
                console.warn('[NarrativeSystem] BGM播放失败:', e);
            });
        }
        
        this.emit('bgmStarted', { musicId, path: musicPath });
    }
    
    /**
     * 停止背景音乐
     * @param {number} fadeOutTime - 淡出时间（毫秒）
     */
    stopBGM(fadeOutTime = 1000) {
        if (this.music) {
            const fadeOut = setInterval(() => {
                if (this.music.volume > 0.1) {
                    this.music.volume -= 0.1;
                } else {
                    this.music.pause();
                    this.music.currentTime = 0;
                    clearInterval(fadeOut);
                    this.music = null;
                }
            }, fadeOutTime / 10);
        }
    }
    
    /**
     * 暂停背景音乐
     */
    pauseBGM() {
        if (this.music) {
            this.music.pause();
        }
    }
    
    /**
     * 恢复背景音乐
     */
    resumeBGM() {
        if (this.music && this.audioContext) {
            this.audioContext.resume().then(() => {
                this.music.play();
            });
        }
    }
    
    /**
     * 播放音效
     * @param {string} sfxId - 音效ID或路径
     */
    playSFX(sfxId) {
        if (!this.gameEngine.getSettings().sound) return;
        
        const settings = this.gameEngine.getSettings();
        
        // 构建音效路径
        let sfxPath;
        if (sfxId.startsWith('http') || sfxId.startsWith('/')) {
            sfxPath = sfxId;
        } else {
            sfxPath = `assets/audio/sfx/${sfxId}.mp3`;
        }
        
        const audio = new Audio(sfxPath);
        audio.volume = settings.sfxVolume || this.sfxVolume;
        
        audio.play().catch(e => {
            console.warn('[NarrativeSystem] SFX播放失败:', e);
        });
    }
    
    /**
     * 生成简单音效（使用Web Audio API）
     * @param {string} type - 音效类型
     */
    playGeneratedSFX(type) {
        if (!this.audioContext || !this.gameEngine.getSettings().sound) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        const settings = this.gameEngine.getSettings();
        gainNode.gain.value = settings.sfxVolume || this.sfxVolume;
        
        switch (type) {
            case 'select':
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                break;
            case 'correct':
                oscillator.frequency.value = 523;
                oscillator.type = 'sine';
                setTimeout(() => {
                    const osc2 = this.audioContext.createOscillator();
                    const gain2 = this.audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(this.audioContext.destination);
                    osc2.frequency.value = 659;
                    gain2.gain.value = settings.sfxVolume || this.sfxVolume;
                    osc2.start();
                    osc2.stop(this.audioContext.currentTime + 0.15);
                }, 100);
                break;
            case 'wrong':
                oscillator.frequency.value = 200;
                oscillator.type = 'sawtooth';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                break;
            case 'click':
                oscillator.frequency.value = 600;
                oscillator.type = 'square';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
                break;
        }
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    // ==================== 动画系统 ====================
    
    /**
     * 淡入效果
     * @param {HTMLElement} element - 元素
     * @param {number} duration - 持续时间
     * @param {Function} callback - 回调
     */
    fadeIn(element, duration = this.animationConfig.fadeIn, callback) {
        if (!element) return;
        
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * 淡出效果
     * @param {HTMLElement} element - 元素
     * @param {number} duration - 持续时间
     * @param {Function} callback - 回调
     */
    fadeOut(element, duration = this.animationConfig.fadeOut, callback) {
        if (!element) return;
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * 滑动进入效果
     * @param {HTMLElement} element - 元素
     * @param {string} direction - 方向 (left, right, up, down)
     * @param {number} duration - 持续时间
     * @param {Function} callback - 回调
     */
    slideIn(element, direction = 'left', duration = this.animationConfig.slideIn, callback) {
        if (!element) return;
        
        const originalTransform = element.style.transform;
        let translate = '';
        
        switch (direction) {
            case 'left':
                translate = 'translateX(-100%)';
                break;
            case 'right':
                translate = 'translateX(100%)';
                break;
            case 'up':
                translate = 'translateY(-100%)';
                break;
            case 'down':
                translate = 'translateY(100%)';
                break;
        }
        
        element.style.transform = translate;
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = this.easeOutCubic(progress);
            
            element.style.transform = `translateX(${-100 * (1 - eased)}%)`;
            element.style.opacity = eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = originalTransform || 'none';
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * 缓动函数 - cubic ease out
     * @param {number} t - 进度 0-1
     * @returns {number}
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // ==================== 事件系统 ====================
    
    /**
     * 事件监听器
     */
    listeners = {};
    
    /**
     * 注册事件监听器
     * @param {string} event - 事件名
     * @param {Function} callback - 回调
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    /**
     * 触发事件
     * @param {string} event - 事件名
     * @param {*} data - 数据
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`[NarrativeSystem] 事件处理错误 (${event}):`, e);
                }
            });
        }
    }
    
    // ==================== 工具方法 ====================
    
    /**
     * 解析对话文本（支持变量替换）
     * @param {string} text - 文本
     * @returns {string}
     */
    parseDialogueText(text) {
        const state = this.gameEngine.getState();
        
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            if (state.hasOwnProperty(key)) {
                return state[key];
            }
            return match;
        });
    }
    
    /**
     * 创建对话节点
     * @param {Object} config - 节点配置
     * @returns {Object}
     */
    createDialogueNode(config) {
        return {
            type: 'dialogue',
            content: Array.isArray(config.content) ? config.content : [config.content],
            next: config.next || null
        };
    }
    
    /**
     * 创建选项节点
     * @param {Array} choices - 选项数组
     * @param {Object} config - 额外配置
     * @returns {Object}
     */
    createChoiceNode(choices, config = {}) {
        return {
            type: 'choice',
            choices: choices.map((c, i) => ({
                text: c.text,
                next: c.next,
                effect: c.effect || null,
                condition: c.condition || null
            })),
            ...config
        };
    }
    
    /**
     * 创建场景切换节点
     * @param {string} sceneId - 目标场景ID
     * @returns {Object}
     */
    createSceneChangeNode(sceneId) {
        return {
            type: 'scene',
            sceneId
        };
    }
    
    /**
     * 销毁叙事系统
     */
    destroy() {
        this.stopBGM();
        this.dialogueQueue = [];
        this.currentScene = null;
        this.currentNode = null;
        
        // 移除键盘监听
        document.removeEventListener('keydown', this.boundKeyboardHandler);
        
        console.log('[NarrativeSystem] 已销毁');
    }
}

// 导出为全局变量
window.NarrativeSystem = NarrativeSystem;
