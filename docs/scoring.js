/* Scores a Career Finding Guide and writes the leader's comment.
   Everything here is rule-based, so the same answers always give the same result
   and no candidate data leaves the leader's browser.

   The thresholds in CFG_RULES are starting points, not validated cut-offs.
   Calibrate them against the results of proven REDEFINE agents. */
const CFG_RULES = {
  targets: ['ECS', 'ESC'],   // O*NET lists insurance sales agents as ECS; older sources say ESC
  strongMatch: 20,           // Iachan score (0-28): Enterprising is first, or second behind Social or Conventional
  exploreMatch: 12,          // Enterprising, Social or Conventional appear high in the code
  strongLevel: 50,           // E total must reach this % of its maximum for a Strong fit
  flatRange: 20,             // top minus bottom type below this % means an unclear profile
  gap: 25,                   // interest and ability differ by this many % points
  fastSeconds: 180,          // finishing 190 questions faster than this is suspicious
  extremeShare: 0.9          // this share of identical 1 or 0 answers is suspicious
};

const CFG_RING = 'RIASEC';
const CFG_NAMES = {
  R: ['Realistic', '现实型'], I: ['Investigative', '研究型'], A: ['Artistic', '艺术型'],
  S: ['Social', '社会型'], E: ['Enterprising', '企业型'], C: ['Conventional', '常规型']
};
const IACHAN = [[22, 10, 4], [10, 5, 2], [4, 2, 1]];

function hexDistance(a, b) {
  const d = Math.abs(CFG_RING.indexOf(a) - CFG_RING.indexOf(b));
  return Math.min(d, 6 - d);
}
function iachan(code, target) {
  let m = 0;
  for (let i = 0; i < 3; i++) { const j = target.indexOf(code[i]); if (j >= 0) m += IACHAN[i][j]; }
  return m;
}
const pct = (n, max) => max ? Math.round(n / max * 100) : 0;

function cfgScore(answers, items) {
  const empty = () => ({R: 0, I: 0, A: 0, S: 0, E: 0, C: 0});
  const bySection = {1: empty(), 2: empty(), 3: empty(), 4: empty()};
  const maxBySection = {1: empty(), 2: empty(), 3: empty(), 4: empty()};
  let ones = 0, yesno = 0;
  const ratings = [];
  items.forEach((q, i) => {
    const v = +answers[i];
    bySection[q.section][q.type] += v;
    maxBySection[q.section][q.type] += q.kind === 'scale' ? 7 : 1;
    if (q.kind === 'yesno') { yesno++; ones += v; } else ratings.push(v);
  });
  const types = {}, order = [];
  'RIASEC'.split('').forEach(t => {
    const sum = o => o[1][t] + o[2][t] + o[3][t] + o[4][t];
    const total = sum(bySection), max = sum(maxBySection);
    const interest = bySection[1][t] + bySection[3][t], interestMax = maxBySection[1][t] + maxBySection[3][t];
    const ability = bySection[2][t] + bySection[4][t], abilityMax = maxBySection[2][t] + maxBySection[4][t];
    types[t] = {total, max, pct: pct(total, max), interest: pct(interest, interestMax), ability: pct(ability, abilityMax)};
    order.push(t);
  });
  order.sort((a, b) => types[b].total / types[b].max - types[a].total / types[a].max || CFG_RING.indexOf(a) - CFG_RING.indexOf(b));
  const code = order.slice(0, 3).join('');
  const third = types[order[2]].total / types[order[2]].max, fourth = types[order[3]].total / types[order[3]].max;
  const pcts = order.map(t => types[t].pct);
  return {
    bySection, maxBySection, types, order, code,
    tiedThird: third === fourth ? order[3] : null,
    match: Math.max.apply(null, CFG_RULES.targets.map(t => iachan(code, t))),
    consistency: hexDistance(order[0], order[1]),   // 1 adjacent, 2 alternate, 3 opposite
    range: pcts[0] - pcts[5],
    oneShare: yesno ? ones / yesno : 0,
    sameRatings: ratings.length > 0 && ratings.every(r => r === ratings[0])
  };
}

function cfgBand(s) {
  const r = CFG_RULES;
  if (s.match >= r.strongMatch && s.types.E.pct >= r.strongLevel && s.range >= r.flatRange) return 'strong';
  if (s.match >= r.exploreMatch || s.range < r.flatRange) return 'explore';   // a flat profile is unclear, not a poor fit
  return 'low';
}

const CFG_BANDS = {
  strong: ['Strong fit', '高度匹配'],
  explore: ['Explore further', '值得深入了解'],
  low: ['Not a natural fit now', '目前不算天然匹配']
};

const TYPE_TEXT = {
  R: ['practical, hands-on work with tools and machines', '动手操作、与工具机器打交道的实际工作'],
  I: ['analysing, researching and solving problems', '分析、研究和解决问题'],
  A: ['creating, expressing ideas and working with freedom', '创作、表达想法和自由发挥'],
  S: ['helping, teaching and building relationships', '帮助、教导他人和建立关系'],
  E: ['influencing, selling and leading people', '影响、推销和带领他人'],
  C: ['organising, keeping records and following a system', '整理、记录和按系统办事']
};

/* type: [what it brings to the career, what to watch] */
const AGENT_TEXT = {
  R: ['may value practical, tangible results', '可能重视实在、看得见的成果', 'Check they are comfortable with work that is mostly talking to people.', '确认对方能接受以与人交谈为主的工作。'],
  I: ['can bring depth when explaining products and numbers', '在讲解产品和数字时能有深度', 'Investigative sits opposite Enterprising on the hexagon, so check they are willing to prospect and close, not only study.', '研究型在六边形上与企业型相对，要确认对方愿意主动开拓和促成，而不只是钻研。'],
  A: ['can stand out in content and personal branding', '在内容创作和个人品牌上有优势', 'Artistic sits opposite Conventional, so test how they cope with routine activity tracking.', '艺术型与常规型相对，要了解对方能否坚持例行的活动记录。'],
  S: ['can build trust and long-term client relationships', '能建立信任和长期客户关系', 'Check they can ask for the decision and not only care for people.', '确认对方敢于要求客户做决定，而不只是关心对方。'],
  E: ['likely to enjoy persuading, selling and leading', '可能享受说服、推销和带领他人', 'Check their drive is matched by client care and suitability discipline.', '确认冲劲之外也重视客户利益和保障是否合适。'],
  C: ['likely to keep records, follow up and stay disciplined', '可能做好记录、跟进并保持纪律', 'Check they are willing to start conversations with new people.', '确认对方愿意主动与陌生人开启对话。']
};

function cfgComment(s, meta) {
  const c = {summary: [], strengths: [], watch: [], ask: [], flags: []};
  const add = (list, en, zh) => list.push([en, zh]);
  const r = CFG_RULES, band = cfgBand(s), T = s.types;
  const [a, b, d] = s.order;
  const name = t => CFG_NAMES[t];

  add(c.summary, `Holland code ${s.code}: mainly ${name(a)[0]}, then ${name(b)[0]} and ${name(d)[0]}. This person leans toward ${TYPE_TEXT[a][0]}.`,
    `霍兰德代码 ${s.code}：以${name(a)[1]}为主，其次是${name(b)[1]}和${name(d)[1]}。此人倾向于${TYPE_TEXT[a][1]}。`);
  if (band === 'strong') add(c.summary, `Match with the agent profile is ${s.match}/28, and Enterprising is at ${T.E.pct}%. Worth moving to a career conversation soon.`,
    `与保险顾问画像的匹配度为 ${s.match}/28，企业型达 ${T.E.pct}%。值得尽快安排职涯对谈。`);
  else if (band === 'explore') add(c.summary, `Match with the agent profile is ${s.match}/28. Some of the right interests may be there, but the picture is not clear. Decide after a conversation, not from this score.`,
    `与保险顾问画像的匹配度为 ${s.match}/28。可能具备部分相符的兴趣，但情况尚不明朗。请通过对谈再做判断，不要只看分数。`);
  else add(c.summary, `Match with the agent profile is ${s.match}/28. Their interests point elsewhere, so a sales-led role may not energise them. If they still want to join, find out why before investing time.`,
    `与保险顾问画像的匹配度为 ${s.match}/28。对方的兴趣偏向其他方向，以销售为主的工作未必能带给他们动力。如果对方仍想加入，请先了解原因再投入时间。`);

  s.order.slice(0, 3).forEach(t => add(c.strengths, `${name(t)[0]} (${T[t].pct}%): ${AGENT_TEXT[t][0]}.`, `${name(t)[1]}（${T[t].pct}%）：${AGENT_TEXT[t][1]}。`));

  ['E', 'S', 'C'].forEach(t => {
    const gap = T[t].interest - T[t].ability;
    if (gap >= r.gap) add(c.strengths, `${name(t)[0]}: interest (${T[t].interest}%) is ahead of ability (${T[t].ability}%). They want this but have not built it yet, so it is coachable.`,
      `${name(t)[1]}：兴趣（${T[t].interest}%）高于能力（${T[t].ability}%）。对方有意愿但尚未练成，可以通过培训提升。`);
    if (-gap >= r.gap) add(c.watch, `${name(t)[0]}: ability (${T[t].ability}%) is ahead of interest (${T[t].interest}%). They can do this but may not enjoy it, which is a retention risk.`,
      `${name(t)[1]}：能力（${T[t].ability}%）高于兴趣（${T[t].interest}%）。对方做得到但未必喜欢，长期留存有风险。`);
  });
  if (s.code.indexOf('E') < 0) add(c.watch, `Enterprising is not in the top three (${T.E.pct}%). Prospecting, selling and handling rejection may feel draining.`,
    `企业型不在前三名（${T.E.pct}%）。开拓、销售和面对拒绝可能让对方感到吃力。`);
  if (s.code.indexOf('C') < 0) add(c.watch, `Conventional is outside the top three (${T.C.pct}%). Set up simple activity tracking early. The form’s dated office items can understate this type for younger candidates.`,
    `常规型不在前三名（${T.C.pct}%）。请尽早建立简单的活动记录习惯。表格中较旧的文书题目可能低估年轻人的这一项。`);
  if (s.code.indexOf('S') < 0) add(c.watch, `Social is outside the top three (${T.S.pct}%). Check how much they enjoy listening to people and building long-term relationships.`,
    `社会型不在前三名（${T.S.pct}%）。请了解对方是否乐于倾听和建立长期关系。`);
  s.order.slice(0, 3).filter(t => t === 'I' || t === 'A' || t === 'R').slice(0, 1).forEach(t => add(c.watch, AGENT_TEXT[t][2], AGENT_TEXT[t][3]));
  if (s.consistency === 3) add(c.watch, `Top two types (${a} and ${b}) sit opposite each other on the hexagon, so this person may feel pulled in two directions. Ask which side matters more to them.`,
    `前两型（${a} 和 ${b}）在六边形上相对，对方可能感到两边拉扯。请询问哪一边对他们更重要。`);
  else if (s.consistency === 1) add(c.strengths, `Top two types (${a} and ${b}) sit side by side on the hexagon, so their interests are consistent.`,
    `前两型（${a} 和 ${b}）在六边形上相邻，兴趣方向一致。`);
  if (s.range < r.flatRange) add(c.watch, `The profile is flat: only ${s.range} points separate the highest and lowest types. They may not yet know what they want, so treat the code as tentative.`,
    `兴趣分布较平均：最高与最低类型只相差 ${s.range} 分。对方可能还不清楚自己想要什么，代码仅供参考。`);

  add(c.ask, 'Tell me about a time you tried to persuade someone and they said no. What did you do next?', '说说你曾尝试说服别人却被拒绝的经历，之后你怎么做？');
  add(c.ask, 'What would you want from your career in five years, and why does it matter to you?', '五年后你希望事业带给你什么？为什么这对你重要？');
  if (T.E.interest - T.E.ability >= r.gap) add(c.ask, 'Which part of selling or leading do you most want to learn first?', '销售或带领团队中，你最想先学哪一部分？');
  if (s.code.indexOf('E') < 0) add(c.ask, 'How would you feel about meeting new people every week and asking for their time?', '每周认识新朋友并主动约时间，你有什么感觉？');
  if (s.code.indexOf('C') < 0) add(c.ask, 'How do you keep track of your commitments and follow-ups today?', '你现在如何记录自己的承诺和跟进事项？');

  if (s.oneShare >= r.extremeShare) add(c.flags, `${Math.round(s.oneShare * 100)}% of yes/no answers were 1. This candidate may have answered without reading.`, `${Math.round(s.oneShare * 100)}% 的是非题选了 1，对方可能没有细读题目。`);
  if (s.oneShare <= 1 - r.extremeShare) add(c.flags, `Only ${Math.round(s.oneShare * 100)}% of yes/no answers were 1. This candidate may have answered without reading.`, `只有 ${Math.round(s.oneShare * 100)}% 的是非题选了 1，对方可能没有细读题目。`);
  if (s.sameRatings) add(c.flags, 'Every Section 4 rating is the same, although the form asks them not to do this.', '第四部分的评分全部相同，尽管表格已提醒避免这样做。');
  if (meta && meta.seconds > 0 && meta.seconds < r.fastSeconds) add(c.flags, `Completed in ${(meta.seconds / 60).toFixed(1)} min, which is very fast for 190 questions.`, `只用 ${(meta.seconds / 60).toFixed(1)} 分钟完成 190 题，速度过快。`);
  if (s.tiedThird) add(c.flags, `${s.code[2]} and ${s.tiedThird} are tied for third place, so the third letter could be either.`, `${s.code[2]} 和 ${s.tiedThird} 并列第三，第三个字母两者皆可。`);
  return {band, ...c};
}

if (typeof module !== 'undefined') module.exports = {CFG_RULES, CFG_NAMES, CFG_BANDS, CFG_RING, cfgScore, cfgBand, cfgComment, iachan, hexDistance};
