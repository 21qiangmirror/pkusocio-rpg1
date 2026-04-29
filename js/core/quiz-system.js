/**
 * 北大社会学考研RPG - 题目系统
 * QuizSystem.js - 题目渲染、答案验证、分数计算、经验值奖励、错题本、论述题评分
 */

class QuizSystem {
    constructor(gameEngine, narrativeSystem) {
        // 依赖注入
        this.gameEngine = gameEngine;
        this.narrativeSystem = narrativeSystem;
        
        // DOM元素
        this.elements = {
            quizContainer: null,
            questionArea: null,
            optionsArea: null,
            feedbackArea: null,
            progressBar: null,
            timer: null,
            scoreDisplay: null
        };
        
        // 当前测验状态
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = null;
        this.timeLimit = 0; // 0表示无限制
        
        // 计时器
        this.timerInterval = null;
        this.remainingTime = 0;
        
        // 分数配置
        this.scoringConfig = {
            correctBaseXP: 20,        // 基础正确经验值
            streakBonusXP: 5,         // 连击奖励
            perfectBonusXP: 50,       // 全对额外奖励
            timeBonusMultiplier: 1,  // 时间奖励倍数
            wrongPenalty: -5          // 错误惩罚
        };
        
        // 论述题关键词配置
        this.essayKeywords = {
            // 社会学理论关键词
            theory: {
                critical: ['批判', '反思', '建构', '范式', '现代性', '传统', '转型'],
                functional: ['功能', '结构', '系统', '整合', '均衡', '适应', '维持'],
                conflict: ['冲突', '权力', '资源', '不平等', '支配', '抗争']
            },
            // 方法论关键词
            methodology: {
                quantitative: ['变量', '相关', '回归', '假设', '检验', '抽样', '问卷'],
                qualitative: ['访谈', '田野', '参与', '观察', '个案', '扎根', '编码']
            }
        };
        
        // 论述题评分标准
        this.essayScoringRubric = {
            excellent: { min: 85, message: '优秀！回答非常全面深入' },
            good: { min: 70, message: '良好！抓住了核心要点' },
            satisfactory: { min: 60, message: '及格！基本理解了知识点' },
            needsImprovement: { min: 0, message: '需要加强，建议复习相关内容' }
        };
        
        // 回调函数
        this.onQuizComplete = null;
        this.onQuestionAnswered = null;
        
        console.log('[QuizSystem] 初始化完成');
    }
    
    /**
     * 初始化题目系统
     * @param {Object} elements - DOM元素配置
     */
    init(elements = {}) {
        this.elements = { ...this.elements, ...elements };
    }
    
    /**
     * 开始测验
     * @param {Object} quizData - 测验数据
     */
    startQuiz(quizData) {
        this.currentQuiz = quizData;
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = Date.now();
        this.timeLimit = quizData.timeLimit || 0;
        this.remainingTime = this.timeLimit;
        
        // 打乱题目顺序（如果配置允许）
        if (quizData.shuffleQuestions) {
            this.shuffleArray(this.currentQuiz.questions);
        }
        
        // 显示测验界面
        this.showQuizContainer();
        
        // 如果有计时器，启动它
        if (this.timeLimit > 0) {
            this.startTimer();
        }
        
        // 显示第一题
        this.showQuestion(0);
        
        this.emit('quizStarted', quizData);
    }
    
    /**
     * 显示测验容器
     */
    showQuizContainer() {
        if (this.elements.quizContainer) {
            this.elements.quizContainer.style.display = 'block';
            this.narrativeSystem?.fadeIn(this.elements.quizContainer);
        }
    }
    
    /**
     * 隐藏测验容器
     */
    hideQuizContainer() {
        if (this.elements.quizContainer) {
            this.narrativeSystem?.fadeOut(this.elements.quizContainer, 300, () => {
                this.elements.quizContainer.style.display = 'none';
            });
        }
    }
    
    /**
     * 显示指定题目
     * @param {number} index - 题目索引
     */
    showQuestion(index) {
        if (!this.currentQuiz || index >= this.currentQuiz.questions.length) {
            this.completeQuiz();
            return;
        }
        
        this.currentQuestionIndex = index;
        const question = this.currentQuiz.questions[index];
        
        // 清空答题区域
        if (this.elements.questionArea) {
            this.elements.questionArea.innerHTML = '';
        }
        if (this.elements.optionsArea) {
            this.elements.optionsArea.innerHTML = '';
        }
        if (this.elements.feedbackArea) {
            this.elements.feedbackArea.style.display = 'none';
        }
        
        // 更新进度条
        this.updateProgressBar(index, this.currentQuiz.questions.length);
        
        // 根据题目类型渲染
        switch (question.type) {
            case 'choice':
            case 'single':
            case 'multiple':
                this.renderChoiceQuestion(question);
                break;
            case 'truefalse':
                this.renderTrueFalseQuestion(question);
                break;
            case 'fill':
                this.renderFillQuestion(question);
                break;
            case 'essay':
                this.renderEssayQuestion(question);
                break;
            case 'match':
                this.renderMatchQuestion(question);
                break;
            case 'order':
                this.renderOrderQuestion(question);
                break;
            default:
                this.renderChoiceQuestion(question);
        }
        
        this.emit('questionShown', { question, index });
    }
    
    /**
     * 渲染选择题
     * @param {Object} question - 题目数据
     */
    renderChoiceQuestion(question) {
        if (!this.elements.questionArea || !this.elements.optionsArea) return;
        
        // 渲染题目
        const questionHTML = `
            <div class="question-header">
                <span class="question-number">第 ${this.currentQuestionIndex + 1} 题</span>
                <span class="question-type">${question.type === 'multiple' ? '（多选）' : '（单选）'}</span>
            </div>
            <div class="question-content">${question.question}</div>
            ${question.image ? `<img src="${question.image}" class="question-image" alt="题目图片">` : ''}
        `;
        this.elements.questionArea.innerHTML = questionHTML;
        
        // 渲染选项
        const isMultiple = question.type === 'multiple';
        const optionsHTML = question.options.map((option, idx) => `
            <div class="option-item ${isMultiple ? 'checkbox' : 'radio'}" data-index="${idx}">
                <span class="option-marker">${String.fromCharCode(65 + idx)}.</span>
                <span class="option-text">${option.text}</span>
            </div>
        `).join('');
        
        this.elements.optionsArea.innerHTML = optionsHTML;
        
        // 绑定选项点击事件
        const options = this.elements.optionsArea.querySelectorAll('.option-item');
        options.forEach(option => {
            option.addEventListener('click', () => {
                this.handleOptionClick(option, isMultiple);
            });
        });
        
        // 添加确认按钮（多选题必须明确确认）
        if (isMultiple) {
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'confirm-btn';
            confirmBtn.textContent = '确认答案';
            confirmBtn.addEventListener('click', () => {
                this.confirmAnswer(isMultiple);
            });
            this.elements.optionsArea.appendChild(confirmBtn);
        }
        
        // 单选题直接提交
        if (!isMultiple) {
            options.forEach(option => {
                setTimeout(() => option.classList.add('clickable'), 100);
            });
        }
    }
    
    /**
     * 渲染判断题
     * @param {Object} question - 题目数据
     */
    renderTrueFalseQuestion(question) {
        if (!this.elements.questionArea || !this.elements.optionsArea) return;
        
        const questionHTML = `
            <div class="question-header">
                <span class="question-number">第 ${this.currentQuestionIndex + 1} 题</span>
                <span class="question-type">（判断）</span>
            </div>
            <div class="question-content">${question.question}</div>
        `;
        this.elements.questionArea.innerHTML = questionHTML;
        
        const optionsHTML = `
            <div class="tf-options">
                <button class="tf-btn true-btn" data-value="true">正确</button>
                <button class="tf-btn false-btn" data-value="false">错误</button>
            </div>
        `;
        this.elements.optionsArea.innerHTML = optionsHTML;
        
        // 绑定事件
        this.elements.optionsArea.querySelectorAll('.tf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value === 'true';
                this.submitAnswer(question, [value], null);
            });
        });
    }
    
    /**
     * 渲染填空题
     * @param {Object} question - 题目数据
     */
    renderFillQuestion(question) {
        if (!this.elements.questionArea || !this.elements.optionsArea) return;
        
        const blanksCount = (question.question.match(/_____/g) || []).length;
        
        const questionHTML = `
            <div class="question-header">
                <span class="question-number">第 ${this.currentQuestionIndex + 1} 题</span>
                <span class="question-type">（填空）</span>
            </div>
            <div class="question-content">${question.question}</div>
        `;
        this.elements.questionArea.innerHTML = questionHTML;
        
        let optionsHTML = '<div class="fill-inputs">';
        for (let i = 0; i < blanksCount; i++) {
            optionsHTML += `
                <div class="fill-blank">
                    <label>填空 ${i + 1}：</label>
                    <input type="text" class="fill-input" data-blank="${i}" placeholder="请输入答案">
                </div>
            `;
        }
        optionsHTML += '</div>';
        
        const submitBtn = document.createElement('button');
        submitBtn.className = 'confirm-btn';
        submitBtn.textContent = '提交答案';
        submitBtn.addEventListener('click', () => {
            const inputs = this.elements.optionsArea.querySelectorAll('.fill-input');
            const answers = Array.from(inputs).map(input => input.value.trim());
            this.submitAnswer(question, answers, null);
        });
        
        this.elements.optionsArea.innerHTML = optionsHTML;
        this.elements.optionsArea.appendChild(submitBtn);
    }
    
    /**
     * 渲染论述题
     * @param {Object} question - 题目数据
     */
    renderEssayQuestion(question) {
        if (!this.elements.questionArea || !this.elements.optionsArea) return;
        
        const questionHTML = `
            <div class="question-header">
                <span class="question-number">第 ${this.currentQuestionIndex + 1} 题</span>
                <span class="question-type">（论述）</span>
            </div>
            <div class="question-content essay-question">${question.question}</div>
            ${question.hint ? `<div class="question-hint">提示：${question.hint}</div>` : ''}
        `;
        this.elements.questionArea.innerHTML = questionHTML;
        
        const optionsHTML = `
            <div class="essay-input-area">
                <textarea class="essay-input" placeholder="请在此输入你的回答..." rows="8"></textarea>
                <div class="essay-stats">
                    <span class="char-count">已输入 0 字</span>
                </div>
            </div>
        `;
        
        const submitBtn = document.createElement('button');
        submitBtn.className = 'confirm-btn';
        submitBtn.textContent = '提交答案';
        
        this.elements.optionsArea.innerHTML = optionsHTML;
        this.elements.optionsArea.appendChild(submitBtn);
        
        // 字数统计
        const textarea = this.elements.optionsArea.querySelector('.essay-input');
        const charCount = this.elements.optionsArea.querySelector('.char-count');
        textarea.addEventListener('input', () => {
            const count = textarea.value.length;
            charCount.textContent = `已输入 ${count} 字`;
        });
        
        submitBtn.addEventListener('click', () => {
            const answer = textarea.value.trim();
            const score = this.gradeEssay(question, answer);
            this.submitAnswer(question, answer, score);
        });
    }
    
    /**
     * 渲染连线题
     * @param {Object} question - 题目数据
     */
    renderMatchQuestion(question) {
        if (!this.elements.questionArea || !this.elements.optionsArea) return;
        
        const questionHTML = `
            <div class="question-header">
                <span class="question-number">第 ${this.currentQuestionIndex + 1} 题</span>
                <span class="question-type">（连线）</span>
            </div>
            <div class="question-content">${question.question}</div>
        `;
        this.elements.questionArea.innerHTML = questionHTML;
        
        // 左侧选项
        const leftOptions = question.options.map((opt, idx) => `
            <div class="match-item left-item" data-id="${idx}">${opt.text}</div>
        `).join('');
        
        // 右侧选项（打乱顺序）
        const shuffledRight = [...question.matchWith].sort(() => Math.random() - 0.5);
        const rightOptions = shuffledRight.map((opt, idx) => `
            <div class="match-item right-item" data-id="${idx}">${opt}</div>
        `).join('');
        
        const optionsHTML = `
            <div class="match-container">
                <div class="match-column left-column">${leftOptions}</div>
                <div class="match-lines"></div>
                <div class="match-column right-column">${rightOptions}</div>
            </div>
        `;
        
        const submitBtn = document.createElement('button');
        submitBtn.className = 'confirm-btn';
        submitBtn.textContent = '确认连线';
        
        this.elements.optionsArea.innerHTML = optionsHTML;
        this.elements.optionsArea.appendChild(submitBtn);
        
        // 实现连线逻辑
        let selectedLeft = null;
        let selectedRight = null;
        
        this.elements.optionsArea.querySelectorAll('.left-item').forEach(item => {
            item.addEventListener('click', () => {
                this.elements.optionsArea.querySelectorAll('.left-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                selectedLeft = parseInt(item.dataset.id);
            });
        });
        
        this.elements.optionsArea.querySelectorAll('.right-item').forEach(item => {
            item.addEventListener('click', () => {
                if (selectedLeft !== null) {
                    const answer = [selectedLeft, parseInt(item.dataset.id)];
                    this.submitAnswer(question, answer, null);
                }
            });
        });
    }
    
    /**
     * 渲染排序题
     * @param {Object} question - 题目数据
     */
    renderOrderQuestion(question) {
        if (!this.elements.questionArea || !this.elements.optionsArea) return;
        
        const questionHTML = `
            <div class="question-header">
                <span class="question-number">第 ${this.currentQuestionIndex + 1} 题</span>
                <span class="question-type">（排序）</span>
            </div>
            <div class="question-content">${question.question}</div>
            <div class="order-hint">拖动选项进行排序</div>
        `;
        this.elements.questionArea.innerHTML = questionHTML;
        
        // 打乱顺序
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
        
        const optionsHTML = `
            <div class="order-container">
                ${shuffledOptions.map((opt, idx) => `
                    <div class="order-item" draggable="true" data-original="${opt.id || idx}">
                        <span class="order-number">${idx + 1}</span>
                        <span class="order-text">${opt.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        const submitBtn = document.createElement('button');
        submitBtn.className = 'confirm-btn';
        submitBtn.textContent = '确认排序';
        
        this.elements.optionsArea.innerHTML = optionsHTML;
        this.elements.optionsArea.appendChild(submitBtn);
        
        // 拖拽排序逻辑
        const container = this.elements.optionsArea.querySelector('.order-container');
        const items = container.querySelectorAll('.order-item');
        let draggedItem = null;
        
        items.forEach(item => {
            item.addEventListener('dragstart', () => {
                draggedItem = item;
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedItem = null;
                this.updateOrderNumbers();
            });
            
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    const container = item.parentNode;
                    const allItems = [...container.querySelectorAll('.order-item')];
                    const draggedIdx = allItems.indexOf(draggedItem);
                    const targetIdx = allItems.indexOf(item);
                    
                    if (draggedIdx < targetIdx) {
                        container.insertBefore(draggedItem, item.nextSibling);
                    } else {
                        container.insertBefore(draggedItem, item);
                    }
                }
            });
        });
        
        submitBtn.addEventListener('click', () => {
            const answer = [...container.querySelectorAll('.order-item')].map(item => 
                parseInt(item.dataset.original)
            );
            this.submitAnswer(question, answer, null);
        });
    }
    
    /**
     * 更新排序题序号
     */
    updateOrderNumbers() {
        const items = this.elements.optionsArea.querySelectorAll('.order-item');
        items.forEach((item, idx) => {
            item.querySelector('.order-number').textContent = idx + 1;
        });
    }
    
    /**
     * 处理选项点击
     * @param {HTMLElement} option - 选项元素
     * @param {boolean} isMultiple - 是否多选
     */
    handleOptionClick(option, isMultiple) {
        if (isMultiple) {
            option.classList.toggle('selected');
        } else {
            // 单选题直接选中并提交
            this.elements.optionsArea.querySelectorAll('.option-item').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // 延迟提交以显示选中效果
            setTimeout(() => {
                const selectedIndex = parseInt(option.dataset.index);
                const question = this.currentQuiz.questions[this.currentQuestionIndex];
                const answer = question.options[selectedIndex].id || selectedIndex;
                this.submitAnswer(question, answer, null);
            }, 200);
        }
    }
    
    /**
     * 确认多选题答案
     * @param {boolean} isMultiple - 是否多选
     */
    confirmAnswer(isMultiple) {
        const selected = this.elements.optionsArea.querySelectorAll('.option-item.selected');
        if (selected.length === 0) {
            this.showTemporaryMessage('请至少选择一个选项');
            return;
        }
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const answer = Array.from(selected).map(opt => 
            parseInt(opt.dataset.index)
        );
        
        this.submitAnswer(question, answer, null);
    }
    
    /**
     * 提交答案
     * @param {Object} question - 题目数据
     * @param {*} userAnswer - 用户答案
     * @param {number|null} score - 论述题分数
     */
    submitAnswer(question, userAnswer, score) {
        // 停止计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // 验证答案
        const result = this.validateAnswer(question, userAnswer, score);
        
        // 记录答案
        this.answers[this.currentQuestionIndex] = {
            questionId: question.id,
            userAnswer,
            correct: result.correct,
            score: result.score,
            timeSpent: Date.now() - this.startTime - (this.currentQuestionIndex * (this.timeLimit / this.currentQuiz.questions.length))
        };
        
        // 记录到游戏统计
        this.gameEngine.recordAnswer(result.correct);
        
        // 如果答错，记录到错题本
        if (!result.correct) {
            this.gameEngine.addWrongAnswer({
                questionId: question.id,
                question: question.question,
                userAnswer,
                correctAnswer: question.correctAnswer,
                day: this.currentQuiz.day
            });
        } else {
            // 如果之前错现在对了，从错题本移除
            this.gameEngine.removeWrongAnswer(question.id);
        }
        
        // 显示反馈
        this.showFeedback(result, question);
        
        // 触发回调
        if (this.onQuestionAnswered) {
            this.onQuestionAnswered(this.answers[this.currentQuestionIndex]);
        }
        
        this.emit('answerSubmitted', { question, userAnswer, result });
    }
    
    /**
     * 验证答案
     * @param {Object} question - 题目数据
     * @param {*} userAnswer - 用户答案
     * @param {number|null} score - 论述题分数
     * @returns {Object} 验证结果
     */
    validateAnswer(question, userAnswer, score) {
        let correct = false;
        let resultScore = 0;
        let feedback = '';
        
        switch (question.type) {
            case 'single':
            case 'choice':
                correct = userAnswer === question.correctAnswer || 
                          userAnswer === question.correctAnswer?.id;
                resultScore = correct ? 100 : 0;
                feedback = correct ? '正确！' : '错误';
                break;
                
            case 'multiple':
                const correctSet = new Set(
                    Array.isArray(question.correctAnswer) 
                        ? question.correctAnswer 
                        : [question.correctAnswer]
                );
                const userSet = new Set(userAnswer);
                correct = correctSet.size === userSet.size && 
                         [...correctSet].every(a => userSet.has(a));
                resultScore = correct ? 100 : 0;
                feedback = correct ? '正确！' : '错误';
                break;
                
            case 'truefalse':
                correct = userAnswer === question.correctAnswer;
                resultScore = correct ? 100 : 0;
                feedback = correct ? '正确！' : '错误';
                break;
                
            case 'fill':
                const correctFill = Array.isArray(question.correctAnswer) 
                    ? question.correctAnswer 
                    : [question.correctAnswer];
                correct = userAnswer.every((ans, idx) => 
                    correctFill[idx]?.toLowerCase().trim() === ans.toLowerCase().trim()
                );
                resultScore = correct ? 100 : 0;
                feedback = correct ? '正确！' : '错误';
                break;
                
            case 'match':
                const matches = question.options.map((opt, idx) => ({
                    left: idx,
                    right: opt.matchIndex
                }));
                correct = userAnswer[0] === matches[0].left && 
                         userAnswer[1] === matches[0].right;
                resultScore = correct ? 100 : 0;
                feedback = correct ? '正确！' : '错误';
                break;
                
            case 'order':
                correct = userAnswer.every((ans, idx) => ans === question.options[idx].id);
                resultScore = correct ? 100 : 0;
                feedback = correct ? '正确！' : '错误';
                break;
                
            case 'essay':
                // 论述题使用传入的分数
                correct = score >= 60;
                resultScore = score;
                feedback = this.getEssayFeedback(score);
                break;
        }
        
        return { correct, score: resultScore, feedback };
    }
    
    /**
     * 论述题评分
     * @param {Object} question - 题目数据
     * @param {string} answer - 用户答案
     * @returns {number} 分数 0-100
     */
    gradeEssay(question, answer) {
        if (!answer || answer.length < 20) {
            return 20; // 太短给最低分
        }
        
        const lowerAnswer = answer.toLowerCase();
        let score = 0;
        let keywordMatches = 0;
        let totalKeywords = 0;
        
        // 关键词匹配评分
        const keywordCategories = [
            ...this.essayKeywords.theory.critical,
            ...this.essayKeywords.theory.functional,
            ...this.essayKeywords.theory.conflict,
            ...this.essayKeywords.methodology.quantitative,
            ...this.essayKeywords.methodology.qualitative
        ];
        
        // 题目指定的关键词
        const requiredKeywords = question.keywords || [];
        totalKeywords = requiredKeywords.length;
        
        requiredKeywords.forEach(keyword => {
            if (lowerAnswer.includes(keyword.toLowerCase())) {
                keywordMatches++;
            }
        });
        
        // 关键词得分（占40%）
        const keywordScore = totalKeywords > 0 
            ? (keywordMatches / totalKeywords) * 40 
            : 20;
        
        // 结构得分（占30%）
        let structureScore = 0;
        const hasStructure = {
            intro: answer.length > 50,
            body: answer.includes('首先') || answer.includes('第一') || 
                  answer.includes('其次') || answer.includes('第二') ||
                  answer.includes('此外') || answer.includes('第三'),
            conclusion: answer.includes('总之') || answer.includes('因此') || 
                       answer.includes('综上所述') || answer.includes('综上所述')
        };
        
        if (hasStructure.intro) structureScore += 10;
        if (hasStructure.body) structureScore += 10;
        if (hasStructure.conclusion) structureScore += 10;
        
        // 字数得分（占30%）
        let lengthScore = 0;
        const wordCount = answer.replace(/\s/g, '').length;
        if (wordCount >= 200) lengthScore = 30;
        else if (wordCount >= 150) lengthScore = 25;
        else if (wordCount >= 100) lengthScore = 20;
        else if (wordCount >= 50) lengthScore = 10;
        
        // 总分
        score = Math.round(keywordScore + structureScore + lengthScore);
        return Math.min(100, Math.max(0, score));
    }
    
    /**
     * 获取论述题反馈
     * @param {number} score - 分数
     * @returns {string}
     */
    getEssayFeedback(score) {
        for (const [key, rubric] of Object.entries(this.essayScoringRubric)) {
            if (score >= rubric.min) {
                return rubric.message;
            }
        }
        return '需要加强复习';
    }
    
    /**
     * 显示反馈
     * @param {Object} result - 验证结果
     * @param {Object} question - 题目数据
     */
    showFeedback(result, question) {
        if (!this.elements.feedbackArea) return;
        
        const feedbackClass = result.correct ? 'correct' : 'incorrect';
        const icon = result.correct ? '✓' : '✗';
        
        let feedbackHTML = `
            <div class="feedback ${feedbackClass}">
                <div class="feedback-icon">${icon}</div>
                <div class="feedback-message">${result.feedback}</div>
                ${!result.correct && question.explanation ? `
                    <div class="feedback-explanation">
                        <strong>解析：</strong>${question.explanation}
                    </div>
                ` : ''}
            </div>
        `;
        
        this.elements.feedbackArea.innerHTML = feedbackHTML;
        this.elements.feedbackArea.style.display = 'block';
        
        // 播放音效
        if (this.narrativeSystem) {
            this.narrativeSystem.playGeneratedSFX(result.correct ? 'correct' : 'wrong');
        }
        
        // 2秒后自动进入下一题
        setTimeout(() => {
            this.nextQuestion();
        }, result.correct ? 1500 : 3000);
    }
    
    /**
     * 进入下一题
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.showQuestion(this.currentQuestionIndex + 1);
        } else {
            this.completeQuiz();
        }
    }
    
    /**
     * 完成测验
     */
    completeQuiz() {
        // 停止计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // 计算总分
        const results = this.calculateResults();
        
        // 隐藏测验容器
        this.hideQuizContainer();
        
        // 计算并发放经验值
        const xpEarned = this.calculateXP(results);
        this.gameEngine.addXP(xpEarned);
        
        // 完成任务天数
        if (this.currentQuiz.day) {
            this.gameEngine.completeDay(this.currentQuiz.day, {
                score: results.totalScore,
                stats: {
                    sociology: Math.round(results.totalScore / 5),
                    theory: Math.round(results.totalScore / 5)
                }
            });
        }
        
        // 检查完美一天成就
        if (results.correctCount === results.totalQuestions) {
            this.gameEngine.unlockAchievement('perfect_day');
        }
        
        // 触发完成回调
        if (this.onQuizComplete) {
            this.onQuizComplete(results);
        }
        
        this.emit('quizCompleted', { results, xpEarned });
        
        console.log(`[QuizSystem] 测验完成: 正确 ${results.correctCount}/${results.totalQuestions}, XP +${xpEarned}`);
    }
    
    /**
     * 计算测验结果
     * @returns {Object}
     */
    calculateResults() {
        const totalQuestions = this.answers.length;
        const correctCount = this.answers.filter(a => a.correct).length;
        const totalScore = this.answers.reduce((sum, a) => sum + a.score, 0) / totalQuestions;
        
        return {
            totalQuestions,
            correctCount,
            incorrectCount: totalQuestions - correctCount,
            totalScore: Math.round(totalScore),
            accuracy: Math.round((correctCount / totalQuestions) * 100),
            answers: this.answers,
            timeTaken: Date.now() - this.startTime
        };
    }
    
    /**
     * 计算获得的经验值
     * @param {Object} results - 测验结果
     * @returns {number}
     */
    calculateXP(results) {
        let xp = 0;
        
        // 基础正确经验值
        xp += results.correctCount * this.scoringConfig.correctBaseXP;
        
        // 计算连续答对奖励
        let streak = 0;
        results.answers.forEach((answer, idx) => {
            if (answer.correct) {
                streak++;
                xp += streak * this.scoringConfig.streakBonusXP;
            } else {
                streak = 0;
            }
        });
        
        // 完美奖励
        if (results.correctCount === results.totalQuestions) {
            xp += this.scoringConfig.perfectBonusXP;
        }
        
        // 时间奖励（如果用时少于限制的一半）
        if (this.timeLimit > 0) {
            const timeUsed = results.timeTaken;
            if (timeUsed < this.timeLimit / 2) {
                xp *= 1.5;
            } else if (timeUsed < this.timeLimit) {
                xp *= 1.2;
            }
        }
        
        return Math.round(xp);
    }
    
    /**
     * 更新进度条
     * @param {number} current - 当前题目索引
     * @param {number} total - 总题目数
     */
    updateProgressBar(current, total) {
        if (this.elements.progressBar) {
            const percentage = ((current + 1) / total) * 100;
            this.elements.progressBar.style.width = `${percentage}%`;
            this.elements.progressBar.textContent = `${current + 1}/${total}`;
        }
    }
    
    /**
     * 启动计时器
     */
    startTimer() {
        this.remainingTime = this.timeLimit;
        
        if (this.elements.timer) {
            this.updateTimerDisplay();
        }
        
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            
            if (this.elements.timer) {
                this.updateTimerDisplay();
            }
            
            if (this.remainingTime <= 0) {
                clearInterval(this.timerInterval);
                this.showTemporaryMessage('时间到！');
                setTimeout(() => this.completeQuiz(), 1000);
            }
        }, 1000);
    }
    
    /**
     * 更新计时器显示
     */
    updateTimerDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // 时间紧迫时变红
        if (this.remainingTime <= 30) {
            this.elements.timer.classList.add('urgent');
        }
    }
    
    /**
     * 显示临时消息
     * @param {string} message - 消息内容
     */
    showTemporaryMessage(message) {
        const msg = document.createElement('div');
        msg.className = 'temp-message';
        msg.textContent = message;
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.classList.add('fade-out');
            setTimeout(() => msg.remove(), 300);
        }, 1500);
    }
    
    /**
     * 随机打乱数组
     * @param {Array} array - 数组
     * @returns {Array}
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
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
            this.listeners[event].forEach(callback => callback(data));
        }
    }
    
    /**
     * 销毁题目系统
     */
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.currentQuiz = null;
        this.answers = [];
        console.log('[QuizSystem] 已销毁');
    }
}

// 导出为全局变量
window.QuizSystem = QuizSystem;
