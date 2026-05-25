export interface Monster {
  id: string;
  type: string;
  nickname: string;
  title: string;
  description: string;
  typeLabel: string;
  bodyColor: string;
  namingOptions: { label: string; icon: string }[];
  strikeActions: string[];
  trophyExplanation: string;
}

export const MONSTERS: Monster[] = [
  {
    id: "procrastinate",
    type: "procrastinate",
    nickname: "明天再说先生",
    title: "拖延小软泥",
    description: "走一步化三步的泥状液体。在你想干正事时施放「下周再说」的物理迟缓结界。",
    typeLabel: "拖延借口系",
    bodyColor: "#E8AA42",
    namingOptions: [
      { label: "拒绝开启正事", icon: "🏷️" },
      { label: "等等在做先生", icon: "⏳" },
      { label: "空虚划手机户", icon: "📱" },
    ],
    strikeActions: [
      "打开那个任务的页面",
      "只写一个标题",
      "只写第一句话",
      "把任务拆成3个小标题",
      "设5分钟计时器，只开始",
    ],
    trophyExplanation: "启动能量是完成能量的3倍。你刚才做的是最难的那步——开始。写下问题会让大脑开始后台处理，不需要你主动推。",
  },
  {
    id: "stress",
    type: "stress",
    nickname: "催命鬼",
    title: "压力催命怪",
    description: "不断在耳边嘶吼「还有3件事没做」，让时间焦虑无限放大的红色怪兽。",
    typeLabel: "压力轰炸系",
    bodyColor: "#D96B6B",
    namingOptions: [
      { label: "压力催命鬼", icon: "😵" },
      { label: "时间焦虑机", icon: "⏰" },
      { label: "多任务炸弹", icon: "💣" },
    ],
    strikeActions: [
      "闭眼深呼吸3次",
      "写下最压你的1件事",
      "把今天不做的一件事划掉",
      "手机放下30秒，不看消息",
      "对自己说：我现在只处理一件事",
    ],
    trophyExplanation: "命名压力会让大脑从「扩散焦虑模式」切换到「定点处理模式」，皮质醇开始下降。这不是心理安慰，是神经科学。",
  },
  {
    id: "overload",
    type: "overload",
    nickname: "信息轰炸机",
    title: "过载信息怪",
    description: "群消息轰炸、标签页狂开、同时有20件事等你回复，能量被切成碎片。",
    typeLabel: "过载混乱系",
    bodyColor: "#A1B57D",
    namingOptions: [
      { label: "99条未读恐惧者", icon: "📲" },
      { label: "标签页焦虑症", icon: "🖥️" },
      { label: "信息过载机", icon: "🌀" },
    ],
    strikeActions: [
      "开启勿扰10分钟",
      "关掉3个浏览器标签页",
      "手机屏幕扣下1分钟",
      "戴上耳机或离开嘈杂地",
      "关闭一个干扰你的App",
    ],
    trophyExplanation: "大脑工作记忆只有4-7个单位。超过这个数字认知负荷指数级上升。你刚才做的是在给大脑减负，不是逃避。",
  },
  {
    id: "brain_fog",
    type: "brain_fog",
    nickname: "浆糊怪",
    title: "脑雾浆糊怪",
    description: "全身由黏膜浆糊线圈组成，擅长锁死注意力聚焦，让你看字却理解不了意思。",
    typeLabel: "脑雾低电系",
    bodyColor: "#C4B9A8",
    namingOptions: [
      { label: "进水了先生", icon: "🌫️" },
      { label: "脑子棉花怪", icon: "🧸" },
      { label: "神游毛玻璃", icon: "🪟" },
    ],
    strikeActions: [
      "站起来30秒",
      "喝3口水",
      "看远处20秒",
      "走到门口再回来",
      "伸展肩颈3次",
    ],
    trophyExplanation: "脑雾不是「你不行」，是葡萄糖和供血暂时跟不上。你刚才做的动作激活了前庭系统，让大脑重新上线，比喝咖啡更快。",
  },
  {
    id: "social",
    type: "social",
    nickname: "假笑怪",
    title: "社交低电怪",
    description: "戴着假笑面具，强迫你在社交余量耗尽时还要不停回复和维持人设。",
    typeLabel: "社交耗竭系",
    bodyColor: "#E27B66",
    namingOptions: [
      { label: "假笑怪上线", icon: "🥸" },
      { label: "人设维护员", icon: "🎭" },
      { label: "社恐但硬撑", icon: "😬" },
    ],
    strikeActions: [
      "发：我现在有点累，晚点回你",
      "发：我看到了，明天再回复你",
      "标记一个消息为稍后处理",
      "拒绝一个今晚不想去的邀约",
      "发：今天状态低，改天认真见",
    ],
    trophyExplanation: "社交能量是真实消耗，不是心理脆弱。设边界不是隔离，是保护双方体验的前提。发出那句话，你已完成今天最难的社交动作。",
  },
  {
    id: "low_energy",
    type: "low_energy",
    nickname: "低电量小人",
    title: "低电耗竭怪",
    description: "电量剩5%，能坐着绝不站着，想躺下去但又焦虑没完成任务的空洞感。",
    typeLabel: "低电耗竭系",
    bodyColor: "#9B9B9B",
    namingOptions: [
      { label: "电池告急人", icon: "🔋" },
      { label: "躺平但焦虑", icon: "🛋️" },
      { label: "什么都不想", icon: "😶" },
    ],
    strikeActions: [
      "喝一杯水",
      "躺下5分钟",
      "去洗澡",
      "吃一点东西",
      "写下明早第一件事，今天先停",
    ],
    trophyExplanation: "身体能量信号先于情绪感知下降。你刚才做的最小身体动作告诉神经系统「我们还在运作」，会触发一个小的能量回升窗口。",
  },
];
