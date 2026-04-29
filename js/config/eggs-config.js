/**
 * 北大社会学考研RPG - 彩蛋配置
 * eggs-config.js - 隐藏彩蛋、北大彩蛋、真题彩蛋的完整配置
 */

window.PKUSociologyRPG = window.PKUSociologyRPG || {};
window.PKUSociologyRPG.EggsConfig = {
    
    // ==================== 隐藏彩蛋 ====================
    hiddenEggs: {
        // 日期触发彩蛋
        lucky_seven: {
            id: 'lucky_seven',
            name: '第七感',
            type: 'hidden',
            trigger: 'day_reach',
            triggerValue: 7,
            icon: '🔮',
            title: '第七感',
            message: '数字7在社会学中有着特殊的意义...\n涂尔干的《社会分工论》中，社会团结的机械有机之分与此相关！\n\n✨ 获得成就：第七感',
            reward: { xp: 200, achievement: 'secret_day_7' }
        },
        
        halfway_secret: {
            id: 'halfway_secret',
            name: '半程惊喜',
            type: 'hidden',
            trigger: 'day_reach',
            triggerValue: 50,
            icon: '✨',
            title: '半程惊喜',
            message: '你已经完成了一半的旅程！\n社会学大师费孝通曾说："各美其美，美人之美"\n继续保持这份热情！\n\n✨ 获得成就：半程惊喜',
            reward: { xp: 500, achievement: 'secret_day_50' }
        },
        
        final_secret: {
            id: 'final_secret',
            name: '百日奇迹',
            type: 'hidden',
            trigger: 'day_reach',
            triggerValue: 100,
            icon: '🌟',
            title: '🌟 百日奇迹 🌟',
            message: '🎉 恭喜你完成了100天的学习！\n\n你已经完全具备了北大社会学考研的上岸能力！\n\n愿你在真正的考场上也能发挥出色！\n\n🏆 获得终极成就：百日奇迹',
            reward: { xp: 1000, achievement: 'secret_day_100', unlockEnding: true }
        },
        
        // 连续学习彩蛋
        streak_7: {
            id: 'streak_7',
            name: '燃烧的一周',
            type: 'hidden',
            trigger: 'streak',
            triggerValue: 7,
            icon: '🔥',
            title: '燃烧的一周',
            message: '连续7天学习，你已经燃烧了整整一周！\n社会学需要持续的热情，你做到了！',
            reward: { xp: 300 }
        },
        
        streak_30: {
            id: 'streak_30',
            name: '一个月的坚持',
            type: 'hidden',
            trigger: 'streak',
            triggerValue: 30,
            icon: '💪',
            title: '一个月的坚持',
            message: '30天！整整一个月！\n这种毅力，无论做什么都会成功的！',
            reward: { xp: 1000 }
        },
        
        // 正确率彩蛋
        perfect_10: {
            id: 'perfect_10',
            name: '十全十美',
            type: 'hidden',
            trigger: 'perfect_day',
            triggerCount: 10,
            icon: '💯',
            title: '十全十美',
            message: '你已经连续10天全部答对！\n这在社会学考研中是非常罕见的成就！',
            reward: { xp: 500 }
        },
        
        // 隐藏笔记彩蛋
        all_notes: {
            id: 'all_notes',
            name: '博闻强记',
            type: 'hidden',
            trigger: 'notes_count',
            triggerValue: 20,
            icon: '📖',
            title: '博闻强记',
            message: '你已经记录了20条笔记！\n好记性不如烂笔头，你深谙此道！',
            reward: { xp: 300, achievement: 'all_notes_found' }
        },
        
        // 隐藏场景触发
        late_night_study: {
            id: 'late_night_study',
            name: '深夜食堂',
            type: 'hidden',
            trigger: 'special_time',
            triggerValue: { hour: 23, minute: 59 },
            icon: '🌙',
            title: '深夜食堂',
            message: '深夜学习，注意身体哦～\n社会学的研究往往需要敏锐的观察力\n深夜的你，或许能看到不一样的世界...',
            reward: { xp: 100 }
        },
        
        // 连续答对难题彩蛋
        hard_question_10: {
            id: 'hard_question_10',
            name: '社会学の真爱',
            type: 'hidden',
            trigger: 'hard_correct',
            triggerValue: 10,
            icon: '💕',
            title: '社会学の真爱',
            message: '没有任何提示，你答对了10道难题！\n这是对社会学真正的热爱！',
            reward: { xp: 500, achievement: 'true_love' }
        }
    },
    
    // ==================== 北大彩蛋 ====================
    pkuEggs: {
        // 北大历史彩蛋
        pku_history_1: {
            id: 'pku_history_1',
            name: '北大粉丝',
            type: 'pku',
            trigger: 'scene_visit',
            triggerValue: 'pku_intro',
            icon: '🎓',
            title: '北大粉丝',
            message: '北京大学，创办于1898年，初名京师大学堂\n是中国近代第一所国立综合性大学\n社会学系则成立于更早的燕京大学时期...',
            reward: { xp: 100, achievement: 'pku_fan' }
        },
        
        pku_map: {
            id: 'pku_map',
            name: '北大漫步者',
            type: 'pku',
            trigger: 'scenes_visit',
            triggerValue: ['pku_未名湖', 'pku_博雅塔', 'pku_图书馆'],
            icon: '🗺️',
            title: '北大漫步者',
            message: '你已经在心中游遍了北大校园！\n未名湖、博雅塔、图书馆...\n这些都是北大人心中的圣地！',
            reward: { xp: 200, achievement: 'pku_walker' }
        },
        
        // 费孝通彩蛋
        fei_xiaotong: {
            id: 'fei_xiaotong',
            name: '北大学者',
            type: 'pku',
            trigger: 'knowledge_show',
            triggerValue: 'fei_xiaotong',
            icon: '👨‍🏫',
            title: '费孝通先生',
            message: '费孝通（1910-2005）\n中国社会学和人类学的重要奠基人\n著有《江村经济》《乡土中国》等不朽之作\n其"差序格局"概念至今影响深远...',
            reward: { xp: 300, achievement: 'pku_scholar' }
        },
        
        // 社会学系历史
        sociology_dept: {
            id: 'sociology_dept',
            name: '北大通',
            type: 'pku',
            trigger: 'knowledge_show',
            triggerValue: 'sociology_dept_history',
            icon: '📜',
            title: '北大社会学系',
            message: '北京大学社会学系的历史\n可追溯至1910年代燕京大学的社会学系\n1952年院系调整后一度中断\n1978年后重建，如今已是中国社会学重镇',
            reward: { xp: 300, achievement: 'pku_history' }
        },
        
        // 校园场景解锁
        yanyuan_1: {
            id: 'yanyuan_1',
            name: '燕园情怀',
            type: 'pku',
            trigger: 'scenes_all',
            triggerValue: ['未名湖', '博雅塔', '图书馆', '西校门', '燕南园'],
            icon: '🌸',
            title: '燕园情怀',
            message: '你已解锁所有北大校园场景！\n燕园的美，不仅在风景，更在人文\n愿你有一天能真正踏入这片土地...',
            reward: { xp: 500, achievement: 'yanyuan' }
        },
        
        // 社会学精神
        sociology_spirit: {
            id: 'sociology_spirit',
            name: '社会学精神',
            type: 'pku',
            trigger: 'special_action',
            triggerValue: 'help_others',
            icon: '💝',
            title: '社会学精神',
            message: '社会学不仅是学问，更是一种关怀\n费孝通先生曾说：\n"各美其美，美人之美，美美与共，天下大同"\n这正是社会学的人文精神！',
            reward: { xp: 300, achievement: 'sociology_spirit' }
        },
        
        // 北大往事
        beida_story: {
            id: 'beida_story',
            name: '北大往事',
            type: 'pku',
            trigger: 'hidden_knowledge',
            triggerValue: 'may_fourth',
            icon: '🏫',
            title: '五四精神',
            message: '1919年5月4日，北京学生走上街头\n这就是著名的五四运动\n北大是五四运动的中心\n"德先生"与"赛先生"的口号\n至今仍激励着无数学子...',
            reward: { xp: 500, achievement: 'beidawang' }
        }
    },
    
    // ==================== 真题彩蛋 ====================
    realQuestions: {
        // 2015年真题
        real_2015_1: {
            id: 'real_2015_1',
            name: '真题猎人·初',
            type: 'real_question',
            year: 2015,
            topic: '社会分层',
            icon: '📋',
            title: '发现真题！',
            message: '恭喜你遇到了一道2015年北大社会学考研真题！\n这道题考察了社会分层理论...',
            reward: { xp: 200 }
        },
        
        real_2015_2: {
            id: 'real_2015_2',
            name: '真题猎人·初',
            type: 'real_question',
            year: 2015,
            topic: '社会研究方法',
            icon: '📋',
            title: '发现真题！',
            message: '恭喜你遇到了一道2015年北大社会学考研真题！\n这道题考察了社会研究方法...',
            reward: { xp: 200 }
        },
        
        // 2016年真题
        real_2016_1: {
            id: 'real_2016_1',
            name: '真题猎人·初',
            type: 'real_question',
            year: 2016,
            topic: '社会学理论',
            icon: '📋',
            title: '发现真题！',
            message: '恭喜你遇到了一道2016年北大社会学考研真题！',
            reward: { xp: 200 }
        },
        
        // 2017年真题
        real_2017_1: {
            id: 'real_2017_1',
            name: '真题猎人·初',
            type: 'real_question',
            year: 2017,
            topic: '社会变迁',
            icon: '📋',
            title: '发现真题！',
            message: '恭喜你遇到了一道2017年北大社会学考研真题！',
            reward: { xp: 200 }
        },
        
        // 2018年真题
        real_2018_1: {
            id: 'real_2018_1',
            name: '真题猎人·初',
            type: 'real_question',
            year: 2018,
            topic: '越轨社会学',
            icon: '📋',
            title: '发现真题！',
            message: '恭喜你遇到了一道2018年北大社会学考研真题！',
            reward: { xp: 200 }
        },
        
        // 2019年真题
        real_2019_1: {
            id: 'real_2019_1',
            name: '真题猎人·初',
            type: 'real_question',
            year: 2019,
            topic: '社会网络',
            icon: '📋',
            title: '发现真题！',
            message: '恭喜你遇到了一道2019年北大社会学考研真题！',
            reward: { xp: 200 }
        },
        
        // 2020年真题
        real_2020_1: {
            id: 'real_2020_1',
            name: '真题猎人·初',
            type: 'real_question',
            year: 2020,
            topic: '社会现代化',
            icon: '📋',
            title: '发现真题！',
            message: '恭喜你遇到了一道2020年北大社会学考研真题！',
            reward: { xp: 200 }
        }
    },
    
    // ==================== 彩蛋触发器 ====================
    triggers: {
        // 检查所有彩蛋
        checkAll: function(engine) {
            const state = engine.getState();
            const hour = new Date().getHours();
            
            // 日期触发
            if (state.currentDay === 7) this.trigger('lucky_seven', engine);
            if (state.currentDay === 50) this.trigger('halfway_secret', engine);
            if (state.currentDay === 100) this.trigger('final_secret', engine);
            
            // 连续天数
            const streak = engine.calculateStreak();
            if (streak === 7) this.trigger('streak_7', engine);
            if (streak === 30) this.trigger('streak_30', engine);
            
            // 深夜学习
            if (hour >= 23 || hour < 5) this.trigger('late_night_study', engine);
        },
        
        // 触发单个彩蛋
        trigger: function(eggId, engine) {
            const allEggs = {
                ...window.PKUSociologyRPG.EggsConfig.hiddenEggs,
                ...window.PKUSociologyRPG.EggsConfig.pkuEggs,
                ...window.PKUSociologyRPG.EggsConfig.realQuestions
            };
            
            const egg = allEggs[eggId];
            if (!egg) return;
            
            const state = engine.getState();
            
            // 检查是否已经触发过
            if (state.foundEggs.includes(eggId)) return;
            
            // 触发彩蛋
            engine.discoverEgg(eggId, { name: egg.name });
            
            // 显示彩蛋内容
            if (egg.message) {
                engine.emit('eggContent', {
                    icon: egg.icon,
                    title: egg.title,
                    message: egg.message
                });
            }
            
            // 发放奖励
            if (egg.reward) {
                if (egg.reward.xp) engine.addXP(egg.reward.xp);
                if (egg.reward.achievement) engine.unlockAchievement(egg.reward.achievement);
            }
            
            console.log(`🥚 彩蛋触发: ${egg.name}`);
        },
        
        // 真题发现
        discoverRealQuestion: function(questionId, engine) {
            const realQuestion = window.PKUSociologyRPG.EggsConfig.realQuestions[questionId];
            if (!realQuestion) return;
            
            engine.discoverRealQuestion(questionId);
            
            engine.emit('eggContent', {
                icon: realQuestion.icon,
                title: realQuestion.title,
                message: realQuestion.message
            });
            
            if (realQuestion.reward?.xp) {
                engine.addXP(realQuestion.reward.xp);
            }
        }
    },
    
    // ==================== 彩蛋统计 ====================
    getTotalEggsCount: function() {
        return Object.keys(this.hiddenEggs).length + 
               Object.keys(this.pkuEggs).length + 
               Object.keys(this.realQuestions).length;
    },
    
    getEggsByCategory: function() {
        return {
            hidden: Object.keys(this.hiddenEggs).length,
            pku: Object.keys(this.pkuEggs).length,
            realQuestions: Object.keys(this.realQuestions).length,
            total: this.getTotalEggsCount()
        };
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.PKUSociologyRPG.EggsConfig;
}
