import type { Question } from '../types';

export const questions: Question[] = [
  // D1 冒险精神 - 2 questions
  {
    id: 1, dim: 'D1',
    text: '地图上出现了一个从未探索过的危险区域，你会？',
    options: [
      { label: '太好了！立刻冲进去探索，危险就是最大的乐趣', value: 3 },
      { label: '做好准备再进去，探索但要注意安全', value: 2 },
      { label: '等别人先探好路，或者看看攻略再说', value: 1 }
    ]
  },
  {
    id: 2, dim: 'D1',
    text: '在深境螺旋中遇到了远超当前实力的关卡，你会？',
    options: [
      { label: '燃起来了！越难越有挑战感，反复尝试到通关', value: 3 },
      { label: '试几次，打不过就先提升实力再来', value: 2 },
      { label: '跳过吧，奖励不差这一点', value: 1 }
    ]
  },
  // D2 战斗意志 - 2 questions
  {
    id: 3, dim: 'D2',
    text: '面对一个极难的 BOSS（比如深渊使徒三人组），你通常会？',
    options: [
      { label: '硬刚到底，研究机制反复练习，不击败不罢休', value: 3 },
      { label: '尝试几次，如果实在打不过就调整策略或配队', value: 2 },
      { label: '找朋友帮忙或跳过，没必要和自己过不去', value: 1 }
    ]
  },
  {
    id: 4, dim: 'D2',
    text: '你的账号被朋友说"练度不行"，你会？',
    options: [
      { label: '正好激起斗志，立刻开始认真练角色', value: 3 },
      { label: '看看哪里可以改进，慢慢优化', value: 2 },
      { label: '无所谓，我玩得开心就好', value: 1 }
    ]
  },
  // D3 社交主动性 - 2 questions
  {
    id: 5, dim: 'D3',
    text: '在联机模式中，你通常会？',
    options: [
      { label: '主动加入别人的世界聊天互动', value: 3 },
      { label: '如果有人邀请就参加，自己不会主动找人', value: 2 },
      { label: '基本不联机，自己的世界自己玩', value: 1 }
    ]
  },
  {
    id: 6, dim: 'D3',
    text: '在原神社区/群聊中，你倾向于？',
    options: [
      { label: '经常发帖分享心得，积极参与讨论', value: 3 },
      { label: '偶尔评论互动，但不常主动发帖', value: 2 },
      { label: '默默看帖潜水，几乎不发言', value: 1 }
    ]
  },
  // D4 团队协作 - 2 questions
  {
    id: 7, dim: 'D4',
    text: '联机打秘境时，你更偏好？',
    options: [
      { label: '根据队伍需要选择角色，配合队友打出最佳效果', value: 3 },
      { label: '用自己熟悉的角色，但也愿意适当调整', value: 2 },
      { label: '直接用自己最强的角色，独立输出搞定一切', value: 1 }
    ]
  },
  {
    id: 8, dim: 'D4',
    text: '如果队友操作失误导致团灭，你会？',
    options: [
      { label: '没关系，鼓励队友再来一次，游戏就是要一起玩', value: 3 },
      { label: '提醒一下需要注意的点，然后重试', value: 2 },
      { label: '算了，还是自己单人通关靠谱', value: 1 }
    ]
  },
  // D5 情感深度 - 2 questions
  {
    id: 9, dim: 'D5',
    text: '玩到特别感人的剧情时（比如那维莱特审判、芙宁娜的真相），你会？',
    options: [
      { label: '深受触动，甚至会红眼眶，反复回味剧情细节', value: 3 },
      { label: '有感触但不至于太入戏，看完继续该干嘛干嘛', value: 2 },
      { label: '快速跳过剧情对话，赶紧拿奖励', value: 1 }
    ]
  },
  {
    id: 10, dim: 'D5',
    text: '你对喜欢的角色的态度是？',
    options: [
      { label: '深度投入，了解所有相关故事、语音，甚至会写分析', value: 3 },
      { label: '喜欢但不会花太多时间研究设定', value: 2 },
      { label: '角色就是工具人，好用就行', value: 1 }
    ]
  },
  // D6 理想主义 - 2 questions
  {
    id: 11, dim: 'D6',
    text: '在原神世界中，你更认同哪种理念？',
    options: [
      { label: '像纳西妲一样相信知识和善意能改变世界', value: 3 },
      { label: '理想很重要，但也要照顾现实', value: 2 },
      { label: '实用第一，资源效率最大化才是正道', value: 1 }
    ]
  },
  {
    id: 12, dim: 'D6',
    text: '如果米哈游做了一个你觉得不合理的改动，你会？',
    options: [
      { label: '积极反馈和讨论，相信玩家的声音能带来改变', value: 3 },
      { label: '发表下看法，但不会太投入', value: 2 },
      { label: '无所谓，适应就好，或者直接弃坑', value: 1 }
    ]
  },
  // D7 规则遵守 - 2 questions
  {
    id: 13, dim: 'D7',
    text: '在游戏中发现了一个能跳过关卡的 BUG，你会？',
    options: [
      { label: '提交反馈，BUG 不应该被利用', value: 3 },
      { label: '看看是什么 BUG，不影响平衡的话无所谓', value: 2 },
      { label: '当然要利用，不卡白不卡', value: 1 }
    ]
  },
  {
    id: 14, dim: 'D7',
    text: '你对每日委托和树脂消耗的态度是？',
    options: [
      { label: '每天准时清理，绝不浪费一点树脂', value: 3 },
      { label: '大部分时候会清，偶尔忘了也无所谓', value: 2 },
      { label: '随缘，想起来就做，溢出也不心疼', value: 1 }
    ]
  },
  // D8 决断力 - 2 questions
  {
    id: 15, dim: 'D8',
    text: '限定角色池最后一天，你还差十抽保底，但原石不够，你会？',
    options: [
      { label: '立刻做决定——买或不买，不纠结', value: 3 },
      { label: '权衡一下角色价值和后续卡池再决定', value: 2 },
      { label: '纠结到最后一刻，可能会错过', value: 1 }
    ]
  },
  {
    id: 16, dim: 'D8',
    text: '圣遗物出了个主词条完美但副词条一般的，你会？',
    options: [
      { label: '先强化到+20看看，犹豫不如行动', value: 3 },
      { label: '强化到+12看看趋势再决定', value: 2 },
      { label: '继续刷吧，万一后面出更好的呢', value: 1 }
    ]
  },
  // D9 执行力 - 2 questions
  {
    id: 17, dim: 'D9',
    text: '你对成就系统和收集要素的态度是？',
    options: [
      { label: '制定计划逐步推进，追求高完成度', value: 3 },
      { label: '有兴趣的就做，不感兴趣的放着', value: 2 },
      { label: '开头做了一点就放弃了，太肝了', value: 1 }
    ]
  },
  {
    id: 18, dim: 'D9',
    text: '游戏出了新的限时活动，你通常会？',
    options: [
      { label: '第一天就开始做，确保不错过任何奖励', value: 3 },
      { label: '有空就做，不急', value: 2 },
      { label: '等最后一天再说...结果经常忘了', value: 1 }
    ]
  },
  // D10 自我认同 - 2 questions
  {
    id: 19, dim: 'D10',
    text: '当朋友说"都这么大了还玩原神"，你会？',
    options: [
      { label: '我就是喜欢，不需要别人理解', value: 3 },
      { label: '有点在意但不会因此改变', value: 2 },
      { label: '确实会动摇，开始怀疑自己', value: 1 }
    ]
  },
  {
    id: 20, dim: 'D10',
    text: '你对自己在游戏中的风格和定位是否清晰？',
    options: [
      { label: '很清楚自己喜欢什么、追求什么', value: 3 },
      { label: '大概知道，但有时候也会随波逐流', value: 2 },
      { label: '跟着大家玩什么就玩什么，没什么特别的偏好', value: 1 }
    ]
  }
];
