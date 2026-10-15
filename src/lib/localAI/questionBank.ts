import type { Band } from './types';

export interface MCItem { q: string; options: [string, string, string, string]; answer: 'A' | 'B' | 'C' | 'D' }
export interface Passage { title: string; text: string; questions: MCItem[] }

/** Reading / listening passages by level band. */
export const PASSAGES: Record<Band, Passage[]> = {
  basic: [
    { title: 'My Family', text: 'My name is Ana. I am fifteen years old. I live with my mother, my father and my brother Tom. Tom is ten. We have a small dog. His name is Max. Every Sunday we go to the park.',
      questions: [
        { q: 'How old is Ana?', options: ['Ten', 'Fifteen', 'Twelve', 'Twenty'], answer: 'B' },
        { q: 'What is the name of the dog?', options: ['Tom', 'Ana', 'Max', 'Sam'], answer: 'C' },
        { q: 'When do they go to the park?', options: ['On Sunday', 'On Monday', 'Every day', 'On Friday'], answer: 'A' },
      ] },
    { title: 'At the Market', text: 'Peter goes to the market on Saturday morning. He buys apples, bread and milk. The apples are red and cheap. There is a new cafe next to the market. Peter drinks a coffee there before he goes home.',
      questions: [
        { q: 'When does Peter go to the market?', options: ['Saturday afternoon', 'Sunday morning', 'Saturday morning', 'Friday night'], answer: 'C' },
        { q: 'What color are the apples?', options: ['Green', 'Red', 'Yellow', 'Brown'], answer: 'B' },
        { q: 'What does Peter drink at the cafe?', options: ['Tea', 'Milk', 'Juice', 'Coffee'], answer: 'D' },
      ] },
    { title: 'A School Day', text: 'Lucy gets up at seven o\'clock. She has breakfast and walks to school. Her first class is English. She likes English because her teacher is very nice. After school she plays football with her friends.',
      questions: [
        { q: 'What time does Lucy get up?', options: ['At six', 'At seven', 'At eight', 'At nine'], answer: 'B' },
        { q: 'How does Lucy go to school?', options: ['By bus', 'By car', 'She walks', 'By bike'], answer: 'C' },
        { q: 'What does she do after school?', options: ['She plays football', 'She sleeps', 'She cooks', 'She studies math'], answer: 'A' },
      ] },
    { title: 'The Weather', text: 'Today it is cold and rainy in London. Yesterday it was sunny and warm. Tomorrow it will be windy. People usually carry an umbrella in London because the weather changes a lot.',
      questions: [
        { q: 'What is the weather like today?', options: ['Sunny and warm', 'Cold and rainy', 'Hot and dry', 'Windy and warm'], answer: 'B' },
        { q: 'How was the weather yesterday?', options: ['Rainy', 'Snowy', 'Sunny and warm', 'Windy'], answer: 'C' },
        { q: 'Why do people carry an umbrella?', options: ['It is fashionable', 'The weather changes a lot', 'It is always sunny', 'For the wind'], answer: 'B' },
      ] },
  ],
  intermediate: [
    { title: 'Working from Home', text: 'Since the pandemic, many companies have allowed employees to work from home. Although this saves time on commuting, some workers feel isolated. Experts suggest that a mix of office and remote work could be the best solution, as it would combine flexibility with social contact.',
      questions: [
        { q: 'What is one advantage of working from home?', options: ['More social contact', 'Saving time on commuting', 'Bigger salaries', 'Longer holidays'], answer: 'B' },
        { q: 'What problem do some remote workers have?', options: ['They feel isolated', 'They earn less', 'They travel more', 'They work less'], answer: 'A' },
        { q: 'What do experts suggest?', options: ['Only office work', 'Only remote work', 'A mix of both', 'Shorter weeks'], answer: 'C' },
      ] },
    { title: 'Plastic in the Ocean', text: 'Millions of tons of plastic are thrown into the ocean every year. If we don\'t reduce our use of single-use plastics, there could be more plastic than fish in the sea by 2050. Several countries have already banned plastic bags, and the results have been encouraging.',
      questions: [
        { q: 'What could happen by 2050?', options: ['Fish will disappear completely', 'There could be more plastic than fish', 'Plastic will be banned worldwide', 'Oceans will be clean'], answer: 'B' },
        { q: 'What have several countries done?', options: ['Banned plastic bags', 'Built new factories', 'Stopped fishing', 'Cleaned all beaches'], answer: 'A' },
        { q: 'How are the results described?', options: ['Disappointing', 'Unknown', 'Encouraging', 'Terrible'], answer: 'C' },
      ] },
    { title: 'A Trip Abroad', text: 'Last summer Maria travelled to Japan for the first time. She had been learning Japanese for two years, so she was able to order food and ask for directions. The thing that surprised her most was how quiet and clean the trains were.',
      questions: [
        { q: 'How long had Maria been learning Japanese?', options: ['Six months', 'One year', 'Two years', 'Five years'], answer: 'C' },
        { q: 'What could she do in Japanese?', options: ['Give a speech', 'Order food and ask for directions', 'Write a book', 'Nothing'], answer: 'B' },
        { q: 'What surprised her most?', options: ['The food', 'The prices', 'The weather', 'The quiet, clean trains'], answer: 'D' },
      ] },
    { title: 'Social Media and Teenagers', text: 'Research shows that teenagers who spend more than three hours a day on social media are more likely to feel anxious. However, social media can also help young people stay connected with friends and find support. The key, researchers say, is balance.',
      questions: [
        { q: 'Who is more likely to feel anxious?', options: ['Teens using social media over three hours a day', 'Teens who play sports', 'Adults', 'Teachers'], answer: 'A' },
        { q: 'What is a benefit of social media?', options: ['Better grades', 'Staying connected with friends', 'More sleep', 'Less homework'], answer: 'B' },
        { q: 'What is the key according to researchers?', options: ['Banning it', 'Using it more', 'Balance', 'Paying for it'], answer: 'C' },
      ] },
  ],
  advanced: [
    { title: 'The Ethics of AI', text: 'Not only has artificial intelligence transformed industries, but it has also raised profound ethical questions. Were algorithms to make decisions about employment or justice without transparency, public trust would inevitably erode. It is precisely this tension between efficiency and accountability that regulators are now attempting to resolve.',
      questions: [
        { q: 'What would erode public trust, according to the text?', options: ['Faster algorithms', 'Opaque algorithmic decisions', 'More regulation', 'Cheaper technology'], answer: 'B' },
        { q: 'What tension are regulators trying to resolve?', options: ['Cost vs. quality', 'Efficiency vs. accountability', 'Speed vs. accuracy', 'Privacy vs. profit'], answer: 'B' },
        { q: 'The tone of the passage is best described as:', options: ['Analytical', 'Humorous', 'Nostalgic', 'Indifferent'], answer: 'A' },
      ] },
    { title: 'Urban Migration', text: 'The relentless migration from rural areas to cities has reshaped the global economy. While urban centres offer unparalleled opportunities, they also concentrate inequality. Had governments invested more heavily in rural infrastructure decades ago, the exodus might have been far less pronounced.',
      questions: [
        { q: 'What does the author imply about rural investment?', options: ['It was excessive', 'It could have reduced migration', 'It caused inequality', 'It is irrelevant'], answer: 'B' },
        { q: '"Exodus" in the text most nearly means:', options: ['Mass departure', 'Celebration', 'Economic growth', 'Return'], answer: 'A' },
        { q: 'What do cities concentrate, besides opportunities?', options: ['Nature', 'Inequality', 'Agriculture', 'Silence'], answer: 'B' },
      ] },
    { title: 'Language and Thought', text: 'Linguists have long debated whether the language we speak shapes the way we think. What recent studies suggest is that language does not determine thought, but it does subtly influence perception, for example in how speakers categorise colours or conceptualise time.',
      questions: [
        { q: 'What do recent studies suggest?', options: ['Language determines thought', 'Language subtly influences perception', 'Language is unrelated to thought', 'Thought creates language'], answer: 'B' },
        { q: 'Which example is mentioned?', options: ['Music', 'Mathematics', 'Colour categorisation', 'Cooking'], answer: 'C' },
        { q: 'The word "subtly" suggests the influence is:', options: ['Strong and obvious', 'Small and indirect', 'Non-existent', 'Dangerous'], answer: 'B' },
      ] },
  ],
};

export interface FillItem { sentence: string; answer: string }

/** Grammar fill-in-the-blank items by topic keyword (lowercase match). */
export const GRAMMAR_ITEMS: Record<string, FillItem[]> = {
  'verb to be': [
    { sentence: 'She ___ a teacher.', answer: 'is' }, { sentence: 'They ___ my friends.', answer: 'are' }, { sentence: 'I ___ from Colombia.', answer: 'am' },
  ],
  'simple present': [
    { sentence: 'He ___ (play) football every Saturday.', answer: 'plays' }, { sentence: 'My mother ___ (work) in a hospital.', answer: 'works' }, { sentence: 'We ___ (live) in Bogotá.', answer: 'live' },
  ],
  'present continuous': [
    { sentence: 'Look! The children ___ (play) in the garden.', answer: 'are playing' }, { sentence: 'I ___ (read) a book right now.', answer: 'am reading' },
  ],
  'simple past': [
    { sentence: 'Yesterday I ___ (go) to the cinema.', answer: 'went' }, { sentence: 'She ___ (visit) her grandmother last week.', answer: 'visited' }, { sentence: 'We ___ (eat) pizza last night.', answer: 'ate' },
  ],
  'past continuous': [
    { sentence: 'I ___ (watch) TV when you called.', answer: 'was watching' }, { sentence: 'They ___ (sleep) at midnight.', answer: 'were sleeping' },
  ],
  'present perfect': [
    { sentence: 'I ___ (never / be) to Paris.', answer: 'have never been' }, { sentence: 'She ___ (finish) her homework already.', answer: 'has finished' },
  ],
  'past perfect': [
    { sentence: 'When we arrived, the film ___ (already / start).', answer: 'had already started' },
  ],
  'future': [
    { sentence: 'I think it ___ (rain) tomorrow. (will)', answer: 'will rain' }, { sentence: 'We ___ (visit) our cousins next week. (going to)', answer: 'are going to visit' },
  ],
  'adverbs of frequency': [
    { sentence: 'I ___ drink coffee. I hate it! (never/always)', answer: 'never' }, { sentence: 'She ___ goes to the gym — every single day. (always/rarely)', answer: 'always' },
  ],
  'there is / there are': [
    { sentence: '___ a book on the table.', answer: 'There is' }, { sentence: '___ three students in the room.', answer: 'There are' },
  ],
  'comparatives': [
    { sentence: 'An elephant is ___ (big) than a dog.', answer: 'bigger' }, { sentence: 'This is the ___ (good) day of my life.', answer: 'best' },
  ],
  'articles': [
    { sentence: 'I saw ___ elephant at the zoo.', answer: 'an' }, { sentence: '___ sun rises in the east.', answer: 'The' },
  ],
  'prepositions': [
    { sentence: 'The meeting is ___ Monday.', answer: 'on' }, { sentence: 'I was born ___ 2005.', answer: 'in' }, { sentence: 'See you ___ 8 o\'clock.', answer: 'at' },
  ],
  'pronouns': [
    { sentence: 'This book is not mine, it is ___. (she)', answer: 'hers' }, { sentence: 'Can you help ___? (I)', answer: 'me' }, { sentence: 'He cut ___ while cooking.', answer: 'himself' },
  ],
  'modal': [
    { sentence: 'You ___ wear a seatbelt. It\'s the law. (must/might)', answer: 'must' }, { sentence: '___ I open the window? (Can/Must)', answer: 'Can' },
  ],
  'passive voice': [
    { sentence: 'The book ___ (write) by Gabriel García Márquez.', answer: 'was written' }, { sentence: 'English ___ (speak) all over the world.', answer: 'is spoken' },
  ],
  'conditionals': [
    { sentence: 'If it rains, we ___ (stay) at home.', answer: 'will stay' }, { sentence: 'If I ___ (be) rich, I would travel the world.', answer: 'were' }, { sentence: 'If she had studied, she ___ (pass) the exam.', answer: 'would have passed' },
  ],
  'reported speech': [
    { sentence: '"I am tired." → She said that she ___ tired.', answer: 'was' },
  ],
  'relative clauses': [
    { sentence: 'The man ___ lives next door is a doctor.', answer: 'who' }, { sentence: 'This is the house ___ I was born.', answer: 'where' },
  ],
  'gerunds and infinitives': [
    { sentence: 'I enjoy ___ (swim).', answer: 'swimming' }, { sentence: 'She decided ___ (study) medicine.', answer: 'to study' },
  ],
  'used to': [
    { sentence: 'When I was a child, I ___ play in the street. (used to)', answer: 'used to' },
  ],
  'question tags': [
    { sentence: 'You are a student, ___ you?', answer: "aren't" }, { sentence: 'She can swim, ___ she?', answer: "can't" },
  ],
  'quantifiers': [
    { sentence: 'There isn\'t ___ milk left. (much/many)', answer: 'much' }, { sentence: 'How ___ apples do you want? (much/many)', answer: 'many' },
  ],
  'wish': [
    { sentence: 'I wish I ___ (have) more free time.', answer: 'had' },
  ],
  'inversion': [
    { sentence: 'Never ___ I seen such a beautiful sunset.', answer: 'have' }, { sentence: 'Not only ___ she sing, but she also dances.', answer: 'does' },
  ],
  'too / enough': [
    { sentence: 'The coffee is ___ hot to drink.', answer: 'too' }, { sentence: 'He is not old ___ to drive.', answer: 'enough' },
  ],
  'imperatives': [
    { sentence: '___ the door, please. It\'s cold. (Close/Closes)', answer: 'Close' },
  ],
  'causative': [
    { sentence: 'I had my hair ___ (cut) yesterday.', answer: 'cut' },
  ],
  'modals of deduction': [
    { sentence: 'He has three cars. He ___ be rich. (must/can\'t)', answer: 'must' },
  ],
};

/** Keywords / patterns used to detect topic usage in writing. */
export const TOPIC_PATTERNS: Record<string, RegExp> = {
  'verb to be': /\b(am|is|are|was|were)\b/i,
  'simple present': /\b(i|you|we|they)\s+(like|have|live|work|go|play|study)\b|\b\w+s\b/i,
  'present continuous': /\b(am|is|are)\s+\w+ing\b/i,
  'present perfect': /\b(have|has)\s+(been|\w+ed|done|gone|seen|made|taken|written)\b/i,
  'simple past': /\b(\w+ed|went|was|were|had|saw|made|took|ate|came)\b/i,
  'past continuous': /\b(was|were)\s+\w+ing\b/i,
  'past perfect': /\bhad\s+(been|\w+ed|done|gone|seen)\b/i,
  'future': /\b(will|going to)\b/i,
  'adverbs of frequency': /\b(always|usually|often|sometimes|rarely|never)\b/i,
  'there is / there are': /\bthere\s+(is|are|was|were)\b/i,
  'comparatives': /\b(\w+er than|more \w+ than|the \w+est|the most)\b/i,
  'articles': /\b(a|an|the)\b/i,
  'prepositions': /\b(in|on|at|under|between|next to)\b/i,
  'pronouns': /\b(me|him|her|us|them|mine|yours|hers|ours|theirs|myself|himself|herself|ourselves|themselves)\b/i,
  'modal': /\b(can|could|may|might|must|should|would|shall)\b/i,
  'passive voice': /\b(is|are|was|were|been|be)\s+\w+(ed|en)\b/i,
  'conditionals': /\bif\b/i,
  'reported speech': /\b(said|told|asked)\s+(that|me|him|her|if)\b/i,
  'relative clauses': /\b(who|which|that|where|whose)\b/i,
  'gerunds and infinitives': /\b(enjoy|like|love|hate)\s+\w+ing\b|\bto\s+[a-z]+\b/i,
  'used to': /\bused to\b/i,
  'question tags': /,\s*(isn't|aren't|don't|doesn't|didn't|can't|won't)\s+\w+\?/i,
  'quantifiers': /\b(some|any|much|many|few|little|a lot of)\b/i,
  'wish': /\b(wish|if only)\b/i,
  'inversion': /\b(never|rarely|seldom|not only|hardly)\s+(have|has|had|do|does|did|was|is)\b/i,
  'too / enough': /\b(too\s+\w+|\w+\s+enough)\b/i,
  'imperatives': /(^|[.!]\s+)(go|come|take|open|close|be|don't|do|please)\b/i,
  'phrasal verbs': /\b(get|give|look|put|take|turn|go|come)\s+(up|down|out|off|on|in|over|back)\b/i,
  'connectors': /\b(however|although|therefore|because|but|so|moreover)\b/i,
  'discourse markers': /\b(however|moreover|furthermore|on the other hand|in addition|nevertheless)\b/i,
  'cleft sentences': /\b(it is|it was|what)\s+.+\s+(that|is|was)\b/i,
};

/** Map a free-text topic to a known key in a dictionary. */
export function matchTopicKey(topic: string, keys: string[]): string | null {
  const t = topic.toLowerCase();
  const aliases: [string, string][] = [
    ['future', 'future'], ['will', 'future'], ['going to', 'future'],
    ['comparative', 'comparatives'], ['superlative', 'comparatives'],
    ['article', 'articles'], ['preposition', 'prepositions'], ['pronoun', 'pronouns'],
    ['modals of deduction', 'modals of deduction'], ['modal', 'modal'], ['conditional', 'conditionals'],
    ['quantifier', 'quantifiers'], ['wish', 'wish'], ['causative', 'causative'], ['conjunction', 'connectors'],
    ['used to', 'used to'], ['question tag', 'question tags'], ['phrasal', 'phrasal verbs'],
  ];
  if (keys.includes(t)) return t;
  for (const k of keys) if (t.includes(k)) return k;
  for (const [a, k] of aliases) if (t.includes(a) && keys.includes(k)) return k;
  return null;
}
