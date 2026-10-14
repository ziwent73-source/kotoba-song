export const langLabels = { 'ja-JP': '日语', 'en-US': '英语', 'ko-KR': '韩语' };
export function parseAnnotated(text) {
  const tokens = [];
  const pattern = /([^\s\[\]]+)\[([^\[\]]+)\]|([^\s\[\]]+)|(\s+)/gu;
  for (const m of text.matchAll(pattern)) tokens.push({ text: m[1] || m[3] || m[4], reading: m[2] || '', space: !!m[4] });
  return tokens;
}
export const plainText = text => parseAnnotated(text).map(t => t.text).join('');
export function validSegment(start, end, duration) {
  return Number.isFinite(start) && Number.isFinite(end) && Number.isFinite(duration) && start >= 0 && end > start && end <= duration + 0.05;
}
export function validateSong(song) {
  if (!song || typeof song !== 'object' || !langLabels[song.lang] || typeof song.title !== 'string' || !song.title.trim() || song.title.length > 150 || !Array.isArray(song.lines) || !song.lines.length || song.lines.length > 150) throw new Error('请提供标题、语言和 1–150 句歌词。');
  return { id: typeof song.id === 'string' && /^[\w-]{1,100}$/.test(song.id) ? song.id : 'custom-' + Date.now(), title: song.title.trim(), artist: String(song.artist || '我的学习曲目').slice(0,150), lang: song.lang, demo: false, lines: song.lines.map((l, i) => {
    if (!l || typeof l.text !== 'string' || !l.text.trim() || l.text.length > 2000 || typeof l.translation !== 'string' || l.translation.length > 3000 || (l.reading != null && (typeof l.reading !== 'string' || l.reading.length > 2000))) throw new Error('第 ' + (i + 1) + ' 句格式不正确。');
    const start = Number(l.start ?? 0), end = l.end == null || l.end === '' ? null : Number(l.end);
    if (!Number.isFinite(start) || start < 0 || (end !== null && (!Number.isFinite(end) || end <= start))) throw new Error('第 ' + (i + 1) + ' 句的起止时间不正确。');
    if (l.words != null && (!Array.isArray(l.words) || l.words.length > 150)) throw new Error('第 ' + (i + 1) + ' 句的词义格式不正确。');
    return { text: l.text, translation: l.translation, reading: l.reading || '', note: String(l.note || '').slice(0,3000), start, end, words: (l.words || []).map(w => {
      if (!w || typeof w.term !== 'string' || !w.term.trim() || typeof w.meaning !== 'string') throw new Error('词义必须包含词语和中文释义。');
      return Object.fromEntries(['term','reading','meaning','usage','example','exampleTranslation'].map(k => [k,String(w[k] || '').slice(0,2000)]));
    }) };
  }) };
}
const w = (term, reading, meaning, usage, example = '', exampleTranslation = '') => ({term,reading,meaning,usage,example,exampleTranslation});
export const songs = [
  { id:'lilac', title:'ライラック', artist:'Mrs. GREEN APPLE', lang:'ja-JP', demo:false, titleOnly:true, official:'https://www.youtube.com/watch?v=QjrkrVmC-8M', lines:[{ text:'ライラック[らいらっく]', translation:'紫丁香', reading:'らいらっく', note:'这是歌名学习卡，还不是歌词。添加歌词、平假名和翻译，再导入歌曲音频，就能开始逐句学习。', start:0,end:null,words:[w('ライラック','らいらっく','紫丁香；一种开花的植物。','外来语，通常用片假名书写。这里的平假名是辅助读音。','ライラックの花が咲いています。','紫丁香的花正在开放。')] }] },
  { id:'demo-ja', title:'風の向こう', artist:'歌语原创 · 日语学习片段', lang:'ja-JP',demo:true,lines:[
    {text:'小さな[ちいさな] 夢[ゆめ] を[を] 抱いて[だいて]',translation:'怀抱一个小小的梦想。',reading:'ちいさな ゆめ を だいて',start:0,end:5,note:'「抱いて」读作「だいて」，来自「抱く（だく）」的て形。先把「だ・い・て」读清楚，再跟着旋律连接。',words:[w('小さな','ちいさな','小小的；小的。','连体词，后面接名词。','小さな花を見つけた。','找到了一朵小花。'),w('夢','ゆめ','梦；梦想。','名词。「夢を見る」可表示做梦；「夢を追う」是追逐梦想。','私には夢があります。','我有一个梦想。'),w('を','を','提示动作对象的助词。','作为助词发音为「お」。这里标记「抱く」的对象「夢」。'),w('抱いて','だいて','怀抱着；抱着。','「抱く（だく）」的て形，在这里连接后续动作。','希望を抱いて進む。','怀抱希望向前走。')]},
    {text:'明日[あした] へ[へ] 歩こう[あるこう]',translation:'向着明天迈步吧。',reading:'あした へ あるこう',start:5,end:10,note:'「歩こう」是「歩く」的意志形，表达“走吧”。「へ」作为助词读作「え」。',words:[w('明日','あした','明天。','常用读音「あした」；较正式时也可读「あす」。','明日、また会いましょう。','明天再见吧。'),w('へ','へ','朝；向。','方向助词，实际发音为「え」。','駅へ行きます。','去车站。'),w('歩こう','あるこう','走吧；迈步吧。','「歩く」的意志形，可表达邀请或自己的决心。','一緒に歩こう。','一起走吧。')]},
    {text:'君[きみ] の[の] 声[こえ] が[が] 聞こえる[きこえる]',translation:'能听见你的声音。',reading:'きみ の こえ が きこえる',start:10,end:15,note:'「聞こえる」表示声音自然传入耳中。读「こえ」时，保留「こ・え」两个音拍。',words:[w('君','きみ','你。','用于亲近关系；正式场合称呼对方时通常更谨慎。'),w('の','の','的。','连接两个名词，表示所属或关系。'),w('声','こえ','声音；嗓音。','通常指人或动物发出的声音。','優しい声ですね。','是温柔的声音呢。'),w('が','が','提示主语的助词。','这里标记听见的对象「君の声」。'),w('聞こえる','きこえる','听得见；能听见。','表示自然地听见，与主动听的「聞く」不同。','鳥の声が聞こえる。','能听见鸟的鸣叫声。')]}
  ]},
  {id:'demo-en',title:'Morning light',artist:'歌语原创 · 英语学习片段',lang:'en-US',demo:true,lines:[
    {text:'Let the morning light find me.',reading:'/let ðə ˈmɔːrnɪŋ laɪt faɪnd miː/',translation:'让晨光找到我。',start:0,end:5,note:'轻读 the，突出 MORning、LIGHT 和 FIND。先自然朗读，再体会旋律如何拉长元音。',words:[w('Let','','让；允许。','let + 宾语 + 动词原形。','Let me try.','让我试试。'),w('the','/ðə/','定冠词。','这里用于特指晨光；在辅音前常弱读为 /ðə/。'),w('morning','/ˈmɔːrnɪŋ/','早晨；早晨的。','这里修饰 light。','Good morning.','早上好。'),w('light','/laɪt/','光；光线。','这里是不可数名词。'),w('find','/faɪnd/','找到；发现。','本句用拟人化表达，将晨光想象成会寻找的事物。'),w('me','/miː/','我。','I 的宾格，作 find 的宾语。')]},
    {text:'I will carry hope with me.',reading:'/aɪ wɪl ˈkæri hoʊp wɪð miː/',translation:'我会带着希望前行。',start:5,end:10,note:'carry 的重音在第一个音节。hope 末尾的 /p/ 收住，不要额外加一个元音。',words:[w('I','/aɪ/','我。','第一人称主格。'),w('will','/wɪl/','将；会。','will + 动词原形，可以表达意愿或未来。'),w('carry','/ˈkæri/','携带；带着。','可搭配具体物品，也可搭配希望等抽象名词。'),w('hope','/hoʊp/','希望。','这里用作名词。'),w('with','/wɪð/','和；带着。','with me 表示伴随我。'),w('me','/miː/','我。','第一人称宾格。')]}
  ]},
  {id:'demo-ko',title:'작은 빛',artist:'歌语原创 · 韩语学习片段',lang:'ko-KR',demo:true,lines:[
    {text:'작은 빛이 나를 비춰요',reading:'jageun bichi nareul bichwoyo',translation:'小小的光照着我。',start:0,end:5,note:'「빛이」连读为「비치」。罗马字仅用于辅助；优先听韩语朗读。',words:[w('작은','jageun','小的。','「작다」的定语形式，修饰后面的名词。','작은 꽃','小花'),w('빛이','bichi','光（主语）。','「빛」+ 主格助词「이」；连音后读作「비치」。'),w('나를','nareul','我（宾语）。','「나」+ 宾格助词「를」。'),w('비춰요','bichwoyo','照着；照亮。','「비추다」的礼貌语体；也可用「비추어요」。','햇빛이 방을 비춰요.','阳光照亮房间。')]},
    {text:'오늘도 함께 걸어요',reading:'oneuldo hamkke georeoyo',translation:'今天也一起走吧。',start:5,end:10,note:'「걸어요」来自「걷다」的 ㄷ 不规则变化；语境中可表示邀请。',words:[w('오늘도','oneuldo','今天也。','「오늘（今天）」+「도（也）」。'),w('함께','hamkke','一起。','副词，表示共同做某事。','함께 노래해요.','一起唱歌吧。'),w('걸어요','georeoyo','走；走吧。','「걷다」的礼貌语体，词干末尾 ㄷ 在元音前变为 ㄹ。','천천히 걸어요.','慢慢走。')]}
  ]}
];
