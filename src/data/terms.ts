// All game content lives here: one short card + one "What is X?" question each.
// Each question has exactly one correct choice. `why` is shown after answering —
// for wrong choices it names the misconception in one short line.
// Markup: **bold highlight** and `code` work in `info` and `why`.

export type Choice = { text: string; correct?: boolean; why: string }
export type Term = { id: string; name: string; info: string; q: string; choices: Choice[] }

export const TERMS: Term[] = [
  {
    id: 'vibe-coding',
    name: 'Vibe coding',
    info: 'Building software by **telling an AI what you want** and letting it write the code. You steer, test and give feedback. **The AI does the typing.**',
    q: 'What is vibe coding?',
    choices: [
      { text: 'Building apps by describing what you want and letting an AI write the code', correct: true, why: 'You direct, the AI types. Testing and decisions are still on you.' },
      { text: 'Coding with music on to stay in the flow', why: 'Nice, but no. The vibe is trusting the AI to write the code.' },
      { text: 'A no-code tool where you drag blocks instead of writing code', why: 'Real code still gets written. The AI just writes it for you.' },
    ],
  },
  {
    id: 'llm',
    name: 'LLM',
    info: 'Large Language Model. An AI trained on huge amounts of text to **predict what comes next**. Claude, GPT and Gemini are LLMs.',
    q: 'What is an LLM?',
    choices: [
      { text: 'A search engine that finds answers on the internet', why: 'It doesn\'t search by default. It writes from what it learned.' },
      { text: 'An AI that writes text by predicting what comes next', correct: true, why: 'That\'s all it does, just extremely well.' },
      { text: 'A database of answers written by humans', why: 'No stored answers. Every reply is written fresh.' },
    ],
  },
  {
    id: 'token',
    name: 'Token',
    info: 'The **chunks of text** an LLM reads and writes. One token is **about ¾ of a word**. Limits and prices are counted in tokens.',
    q: 'What is a token?',
    choices: [
      { text: 'A login code that proves who you are', why: 'That\'s an auth token. In AI, a token is a piece of text.' },
      { text: 'One full sentence', why: 'Much smaller. A sentence is usually 10–30 tokens.' },
      { text: 'A small chunk of text, about ¾ of a word', correct: true, why: 'So 1,000 tokens is roughly 750 words.' },
    ],
  },
  {
    id: 'prompt',
    name: 'Prompt',
    info: 'The **message you send** to the AI. The clearer you are about what you want, **the better the result**.',
    q: 'What is a prompt?',
    choices: [
      { text: 'The instructions and info you give the AI', correct: true, why: 'Everything the AI knows about your task comes from it.' },
      { text: 'The answer the AI gives back', why: 'That\'s the response. The prompt is what you send.' },
      { text: 'A popup asking you to approve an action', why: 'That\'s a permission prompt. In AI talk, the prompt is your message.' },
    ],
  },
  {
    id: 'context',
    name: 'Context window',
    info: '**How much text the AI can see at once**: your chat, files, instructions and its own reply. When it\'s full, older stuff has to go.',
    q: 'What is the context window?',
    choices: [
      { text: 'The chat window in the app', why: 'Not the UI. It\'s the AI\'s working memory, counted in tokens.' },
      { text: 'How long the AI remembers you between sessions', why: 'That\'s memory. The context window only covers the current session.' },
      { text: 'The most text the AI can see at once', correct: true, why: 'Messages, files and the reply all have to fit.' },
    ],
  },
  {
    id: 'usage',
    name: 'Usage',
    info: '**How many tokens you\'ve burned.** Every message resends the whole chat, so **long sessions eat your limit fast**.',
    q: 'What does usage measure?',
    choices: [
      { text: 'How many messages you\'ve sent', why: 'One message can be 100 tokens or 100,000. Tokens are what count.' },
      { text: 'How many tokens you\'ve used, which sets your limit or bill', correct: true, why: 'Long chats and agents use the most.' },
      { text: 'How many minutes the AI spent working', why: 'Time isn\'t what\'s counted. Tokens are.' },
    ],
  },
  {
    id: 'compaction',
    name: 'Compaction',
    info: 'When the context window fills up, the AI **summarizes the chat so far** and carries on from the summary. **Small details can get lost.**',
    q: 'What is compaction?',
    choices: [
      { text: 'Zipping your project files to save space', why: 'Nothing to do with files. It shrinks the conversation.' },
      { text: 'Replacing a long chat with a short summary to free up space', correct: true, why: 'That\'s why exact details, like an error message, can vanish afterwards.' },
      { text: 'Deleting the chat and starting from zero', why: 'A summary is kept, so the gist survives.' },
    ],
  },
  {
    id: 'system-prompt',
    name: 'System prompt',
    info: '**Hidden instructions** the app gives the AI before your message. They set its **role, tone and rules**.',
    q: 'What is a system prompt?',
    choices: [
      { text: 'An error message from your operating system', why: 'Not an OS thing. It\'s text the app adds before your message.' },
      { text: 'The prompt you type into a terminal', why: 'That\'s a shell prompt. The system prompt goes to the AI.' },
      { text: 'Instructions sent before your messages that shape how the AI behaves', correct: true, why: 'You rarely see it, but it steers every reply.' },
    ],
  },
  {
    id: 'memory',
    name: 'Memory',
    info: 'The AI **forgets everything between sessions**. Memory is **notes saved in files**, like `CLAUDE.md` or `AGENTS.md`, that get loaded in each time.',
    q: 'What is memory in an AI coding tool?',
    choices: [
      { text: 'Saved notes that get loaded into context at the start of each session', correct: true, why: 'Put your project rules there so you never repeat yourself.' },
      { text: 'The AI permanently learning from your chats', why: 'The model never changes. It only knows what\'s loaded in.' },
      { text: 'Your computer\'s RAM', why: 'Different memory. This is text the AI reads every session.' },
    ],
  },
  {
    id: 'hallucination',
    name: 'Hallucination',
    info: 'When the AI **confidently makes something up**, like a fake function, package or fact. It writes **what sounds right**, not what it checked.',
    q: 'What is a hallucination?',
    choices: [
      { text: 'A bug that makes the AI crash', why: 'Nothing crashes. The answer looks right and isn\'t.' },
      { text: 'The AI refusing to answer', why: 'That\'s a refusal. Hallucinations are confident and wrong.' },
      { text: 'The AI confidently stating something false', correct: true, why: 'Always check the imports, APIs and facts it gives you.' },
    ],
  },
  {
    id: 'cutoff',
    name: 'Knowledge cutoff',
    info: '**The date the AI\'s training data ends.** It doesn\'t know **newer libraries, versions or news** unless it searches.',
    q: 'What is a knowledge cutoff?',
    choices: [
      { text: 'The longest answer the AI can give', why: 'That\'s an output limit. The cutoff is about time.' },
      { text: 'The date the AI\'s training data ends', correct: true, why: 'It\'s why it suggests old library versions. Paste in current docs.' },
      { text: 'The point where the AI stops reading your file', why: 'That\'s the context window. The cutoff is when training data ends.' },
    ],
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    info: 'Some models **think before answering**, working through the problem step by step. Better for hard bugs and plans, but **slower and more tokens**.',
    q: 'What is reasoning, or thinking mode?',
    choices: [
      { text: 'The AI working through the problem before giving its answer', correct: true, why: 'Smarter on hard tasks, paid for in time and tokens.' },
      { text: 'The AI double-checking its answer on the internet', why: 'No searching. It thinks on its own first.' },
      { text: 'A backup model that takes over when the main one fails', why: 'Nothing takes over. The same model just gets room to think.' },
    ],
  },
  {
    id: 'tool-call',
    name: 'Tool call',
    info: 'The AI can only write text. A tool call is **text asking the app to do something**, like `read_file` or `run_command`. The app does it and **hands back the result**.',
    q: 'What is a tool call?',
    choices: [
      { text: 'The AI running code directly on your computer', why: 'It can\'t. The app runs the tool for it.' },
      { text: 'The AI asking the app to do an action and return the result', correct: true, why: 'That\'s how an AI goes from talking to doing.' },
      { text: 'You calling an API from your own code', why: 'That\'s an API call. A tool call comes from the AI.' },
    ],
  },
  {
    id: 'harness',
    name: 'Harness',
    info: '**The app around the model.** It gives it tools, runs them and keeps it working. Claude Code, Cursor and Codex are harnesses. **The model is the engine; the harness is the car.**',
    q: 'What is a harness?',
    choices: [
      { text: 'The software that wraps the model with tools, instructions and a work loop', correct: true, why: 'Same model, better harness, better results.' },
      { text: 'A safety filter that blocks bad answers', why: 'It can include rules, but its main job is running the model\'s work.' },
      { text: 'The data the model was trained on', why: 'Training is done long before. The harness runs while you use it.' },
    ],
  },
  {
    id: 'agent',
    name: 'Agent',
    info: 'An AI that **works in a loop**: plan, use a tool, check the result, repeat until the task is done. It can take **dozens of steps on its own**.',
    q: 'What is an agent?',
    choices: [
      { text: 'A human who checks the AI\'s work', why: 'No human needed. The AI runs the loop itself.' },
      { text: 'A bigger, smarter version of a model', why: 'Any model can be an agent. It\'s the loop, not the size.' },
      { text: 'An AI that loops through steps with tools until the job is done', correct: true, why: 'A chatbot answers once. An agent keeps going.' },
    ],
  },
  {
    id: 'subagent',
    name: 'Subagent',
    info: 'A **helper the main agent sends off** on a side task, like searching the codebase. It works in its own context and **reports back a summary**.',
    q: 'What is a subagent?',
    choices: [
      { text: 'A cheaper model that takes over when you run low on usage', why: 'It doesn\'t replace anything. It helps with one side task.' },
      { text: 'A helper agent that does a side task in its own context and reports back', correct: true, why: 'Only the summary comes back, so the main context stays clean.' },
      { text: 'A second chat you open to ask something else', why: 'The agent starts it itself, to split up the work.' },
    ],
  },
  {
    id: 'mcp',
    name: 'MCP',
    info: 'Model Context Protocol. A **standard plug for connecting AI apps** to outside tools and data, like GitHub, a database or Figma.',
    q: 'What is MCP?',
    choices: [
      { text: 'A setting that makes the context window bigger', why: 'Despite the name, it doesn\'t touch the window. It adds connections.' },
      { text: 'A file that stores the AI\'s memory', why: 'That\'s a memory file. MCP connects to services.' },
      { text: 'A standard way to connect AI tools to outside apps and data', correct: true, why: 'Add an MCP server and the AI gets new tools.' },
    ],
  },
  {
    id: 'skills',
    name: 'Skills',
    info: '**Packs of instructions**, sometimes with scripts, that teach an agent one kind of task. Only a short description sits in context **until the skill is needed**.',
    q: 'What is a skill?',
    choices: [
      { text: 'A reusable pack of instructions the agent loads when a task needs it', correct: true, why: 'Like a recipe card: out of the way until it\'s useful.' },
      { text: 'A connection to an outside service like GitHub', why: 'That\'s MCP. Skills are instructions, not connections.' },
      { text: 'A setting that makes the model smarter', why: 'The model stays the same. A skill adds know-how for one task.' },
    ],
  },
  {
    id: 'plan-mode',
    name: 'Plan mode',
    info: 'The AI **writes a plan first**, without changing any files. **You review it**, then let it build.',
    q: 'What is plan mode?',
    choices: [
      { text: 'A paid plan that unlocks better models', why: 'Not pricing. It\'s plan before you code.' },
      { text: 'A to-do list app built into the editor', why: 'It\'s the AI planning its own work for you to approve.' },
      { text: 'The AI writes a plan for you to approve before it touches code', correct: true, why: 'Fixing a bad plan is way cheaper than undoing bad code.' },
    ],
  },
  {
    id: 'api-key',
    name: 'API key',
    info: '**A secret** that lets your app use an AI service on your account and bill. **Never put it in frontend code** or commit it to GitHub.',
    q: 'What is an API key?',
    choices: [
      { text: 'A secret that lets software use a paid service on your account', correct: true, why: 'Anyone who has it can run up your bill. Keep it in `.env`, out of git.' },
      { text: 'A public ID that\'s safe to share', why: 'It\'s secret. Leaked keys get found and abused fast.' },
      { text: 'The keyboard shortcut that opens the AI', why: 'Not a key on your keyboard. It\'s a password for software.' },
    ],
  },
]
