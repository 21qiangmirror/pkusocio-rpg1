/**
 * 谜题引擎 - 负责各种知识谜题的实现
 */
class PuzzleEngine {
    constructor() {
        this.currentPuzzle = null;
        this.score = 0;
        this.timeLimit = null;
        this.timer = null;
    }
    
    /**
     * 初始化谜题
     */
    initPuzzle(puzzleConfig) {
        this.currentPuzzle = puzzleConfig;
        this.score = 0;
        
        switch (puzzleConfig.type) {
            case 'matching':
                return this.createMatchingPuzzle(puzzleConfig);
            case 'sequence':
                return this.createSequencePuzzle(puzzleConfig);
            case 'quiz':
                return this.createQuizPuzzle(puzzleConfig);
            case 'fill-blank':
                return this.createFillBlankPuzzle(puzzleConfig);
            case 'essay':
                return this.createEssayPuzzle(puzzleConfig);
            default:
                console.error('Unknown puzzle type:', puzzleConfig.type);
                return null;
        }
    }
    
    /**
     * 创建连线题
     */
    createMatchingPuzzle(config) {
        const container = document.createElement('div');
        container.className = 'puzzle-container matching-puzzle';
        
        const leftItems = config.pairs.map((p, i) => 
            `<div class="match-item left-item" data-id="${i}" draggable="true">${p.left}</div>`
        ).join('');
        
        const rightItems = this.shuffleArray(config.pairs.map((p, i) => 
            `<div class="match-item right-item" data-target="${i}">${p.right}</div>`
        ));
        
        container.innerHTML = `
            <div class="puzzle-header">
                <h3>${config.title || '连线题'}</h3>
                <p>${config.description || '请将相关概念连接起来'}</p>
            </div>
            <div class="matching-area">
                <div class="matching-column left-column">${leftItems}</div>
                <div class="matching-lines"></div>
                <div class="matching-column right-column">${rightItems.join('')}</div>
            </div>
            <div class="puzzle-actions">
                <button class="btn-submit" disabled>提交答案</button>
                <button class="btn-hint">使用提示</button>
            </div>
            <div class="puzzle-result"></div>
        `;
        
        // 绑定拖拽事件
        this.bindDragEvents(container);
        
        return container;
    }
    
    /**
     * 创建选择题
     */
    createQuizPuzzle(config) {
        const container = document.createElement('div');
        container.className = 'puzzle-container quiz-puzzle';
        
        let optionsHTML = config.options.map((opt, i) => 
            `<div class="quiz-option" data-index="${i}">
                <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                <span class="option-text">${opt}</span>
            </div>`
        ).join('');
        
        container.innerHTML = `
            <div class="puzzle-header">
                <h3>${config.title || '选择题'}</h3>
                <div class="question-stem">${config.question}</div>
            </div>
            <div class="quiz-options">${optionsHTML}</div>
            <div class="quiz-actions">
                <button class="btn-submit" disabled>提交答案</button>
            </div>
            <div class="quiz-explanation" style="display: none;"></div>
        `;
        
        // 绑定选择事件
        this.bindQuizEvents(container, config);
        
        return container;
    }
    
    /**
     * 创建排序题
     */
    createSequencePuzzle(config) {
        const container = document.createElement('div');
        container.className = 'puzzle-container sequence-puzzle';
        
        const shuffledItems = this.shuffleArray([...config.items]);
        const itemsHTML = shuffledItems.map((item, i) => 
            `<div class="sequence-item" data-original-index="${config.items.indexOf(item)}" draggable="true">
                <span class="item-index">${i + 1}</span>
                <span class="item-text">${item}</span>
            </div>`
        ).join('');
        
        container.innerHTML = `
            <div class="puzzle-header">
                <h3>${config.title || '排序题'}</h3>
                <p>${config.description || '请将选项按正确顺序排列'}</p>
            </div>
            <div class="sequence-area">${itemsHTML}</div>
            <div class="puzzle-actions">
                <button class="btn-submit" disabled>提交答案</button>
            </div>
        `;
        
        // 绑定拖拽排序事件
        this.bindSortableEvents(container);
        
        return container;
    }
    
    /**
     * 创建填空题
     */
    createFillBlankPuzzle(config) {
        const container = document.createElement('div');
        container.className = 'puzzle-container fillblank-puzzle';
        
        // 将文本中的空位用输入框替换
        let questionHTML = config.sentence;
        const blanks = [];
        let blankIndex = 0;
        
        questionHTML = questionHTML.replace(/______/g, () => {
            blanks.push(`<input type="text" class="fill-blank-input" data-blank="${blankIndex}" placeholder="请输入">`);
            blankIndex++;
            return blanks[blanks.length - 1];
        });
        
        container.innerHTML = `
            <div class="puzzle-header">
                <h3>${config.title || '填空题'}</h3>
                <div class="question-content">${questionHTML}</div>
            </div>
            <div class="puzzle-actions">
                <button class="btn-submit" disabled>提交答案</button>
            </div>
        `;
        
        // 绑定输入事件
        container.querySelectorAll('.fill-blank-input').forEach(input => {
            input.addEventListener('input', () => {
                const allFilled = [...container.querySelectorAll('.fill-blank-input')]
                    .every(i => i.value.trim() !== '');
                container.querySelector('.btn-submit').disabled = !allFilled;
            });
        });
        
        return container;
    }
    
    /**
     * 创建论述题
     */
    createEssayPuzzle(config) {
        const container = document.createElement('div');
        container.className = 'puzzle-container essay-puzzle';
        
        container.innerHTML = `
            <div class="puzzle-header">
                <h3>${config.title || '论述题'}</h3>
                <div class="question-content">${config.question}</div>
                ${config.wordLimit ? `<p class="word-limit">字数要求: ${config.wordLimit}字</p>` : ''}
            </div>
            <div class="essay-area">
                <textarea class="essay-input" placeholder="请在此输入你的回答..." 
                    ${config.wordLimit ? `maxlength="${config.wordLimit * 1.2}"` : ''}></textarea>
                <div class="word-count">已输入: <span class="count">0</span>字</div>
            </div>
            <div class="puzzle-actions">
                <button class="btn-submit" disabled>提交答案</button>
                ${config.showModelAnswer ? `<button class="btn-model-answer">查看参考答案</button>` : ''}
            </div>
        `;
        
        // 字数统计
        const textarea = container.querySelector('.essay-input');
        const countSpan = container.querySelector('.count');
        
        textarea.addEventListener('input', () => {
            countSpan.textContent = textarea.value.length;
            container.querySelector('.btn-submit').disabled = textarea.value.length < 50;
        });
        
        // 查看参考答案
        if (config.showModelAnswer) {
            container.querySelector('.btn-model-answer').addEventListener('click', () => {
                alert(config.modelAnswer);
            });
        }
        
        return container;
    }
    
    /**
     * 绑定拖拽连线事件
     */
    bindDragEvents(container) {
        let draggedItem = null;
        let connections = [];
        
        container.querySelectorAll('.left-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                e.dataTransfer.effectAllowed = 'move';
            });
        });
        
        container.querySelectorAll('.right-item').forEach(item => {
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem) {
                    const leftId = draggedItem.dataset.id;
                    const rightTarget = item.dataset.target;
                    connections.push({ left: leftId, right: rightTarget });
                    
                    // 画连线
                    this.drawConnection(container, draggedItem, item);
                    draggedItem.classList.add('connected');
                    item.classList.add('connected');
                }
            });
        });
        
        // 提交按钮
        container.querySelector('.btn-submit').addEventListener('click', () => {
            this.checkMatchingResult(container, connections);
        });
    }
    
    /**
     * 画连接线
     */
    drawConnection(container, leftEl, rightEl) {
        const linesContainer = container.querySelector('.matching-lines');
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        const x1 = leftRect.right - containerRect.left;
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
        const x2 = rightRect.left - containerRect.left;
        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
        
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.width = `${Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))}px`;
        line.style.transform = `rotate(${Math.atan2(y2-y1, x2-x1)}rad)`;
        
        linesContainer.appendChild(line);
    }
    
    /**
     * 检查连线结果
     */
    checkMatchingResult(container, connections) {
        const pairs = this.currentPuzzle.pairs;
        let correct = 0;
        
        connections.forEach(conn => {
            if (pairs[conn.left].right === pairs[conn.left].right) {
                correct++;
            }
        });
        
        const score = Math.round((correct / pairs.length) * 100);
        this.showResult(container, score >= 80, score);
    }
    
    /**
     * 绑定选择题事件
     */
    bindQuizEvents(container, config) {
        const options = container.querySelectorAll('.quiz-option');
        const submitBtn = container.querySelector('.btn-submit');
        let selectedIndex = null;
        
        options.forEach((opt, index) => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedIndex = index;
                submitBtn.disabled = false;
            });
        });
        
        submitBtn.addEventListener('click', () => {
            const isCorrect = selectedIndex === config.correctIndex;
            options[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
            
            if (!isCorrect) {
                options[config.correctIndex].classList.add('correct');
            }
            
            // 显示解析
            const explanation = container.querySelector('.quiz-explanation');
            explanation.innerHTML = `
                <strong>${isCorrect ? '✓ 回答正确!' : '✗ 回答错误'}</strong>
                <p>${config.explanation || ''}</p>
            `;
            explanation.style.display = 'block';
            
            submitBtn.disabled = true;
            
            // 通知游戏引擎
            window.gameEngine.answerQuestion(isCorrect);
        });
    }
    
    /**
     * 绑定排序事件
     */
    bindSortableEvents(container) {
        const items = container.querySelectorAll('.sequence-item');
        const submitBtn = container.querySelector('.btn-submit');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                submitBtn.disabled = false;
            });
            
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const dragging = container.querySelector('.dragging');
                if (dragging !== item) {
                    const container = item.parentElement;
                    const items = [...container.querySelectorAll('.sequence-item')];
                    const draggingIndex = items.indexOf(dragging);
                    const targetIndex = items.indexOf(item);
                    
                    if (draggingIndex < targetIndex) {
                        container.insertBefore(dragging, item.nextSibling);
                    } else {
                        container.insertBefore(dragging, item);
                    }
                    
                    // 更新序号
                    container.querySelectorAll('.sequence-item').forEach((el, i) => {
                        el.querySelector('.item-index').textContent = i + 1;
                    });
                }
            });
        });
    }
    
    /**
     * 显示结果
     */
    showResult(container, isPassed, score) {
        const resultDiv = container.querySelector('.puzzle-result') || 
                          container.querySelector('.quiz-explanation');
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result ${isPassed ? 'pass' : 'fail'}">
                    <span class="result-icon">${isPassed ? '🎉' : '😢'}</span>
                    <span class="result-text">${isPassed ? '恭喜通关!' : '继续努力!'}</span>
                    <span class="result-score">得分: ${score}</span>
                </div>
            `;
            resultDiv.style.display = 'block';
        }
        
        // 奖励经验
        if (isPassed) {
            const xpReward = this.currentPuzzle.xpReward || 50;
            window.gameEngine.xp.awardXP(xpReward, 'general', window.gameEngine.getPlayer());
            window.gameEngine.state.save();
        }
    }
    
    /**
     * 打乱数组
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 导出
window.PuzzleEngine = PuzzleEngine;
