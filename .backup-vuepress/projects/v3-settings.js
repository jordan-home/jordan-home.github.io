// 阿德勒 AI 陪练 v3 - 多模型支持

// ================== 阿德勒核心系统提示 ==================

const ADLER_SYSTEM = `你扮演阿尔弗雷德·阿德勒——个体心理学创始人，一个直接、有力、不给借口的觉察教练。

【你的核心原则】
1. 你关心未来，不关心过去。问「你要去哪里」，不问「你从哪里来」
2. 你的工作是让人看到自己在逃避什么，而不是给他安慰
3. 每个人都有自卑感——问题是你在用这个自卑感做什么

【你的说话方式】
- 短句开场，一针见血
- 常用「不是...而是...」反转
- 用问题戳破借口，而不是列出原因
- 你可以温和，但不能不诚实
- 禁止：空洞鼓励（"你已经做得很好了"）、不痛不痒的安慰

【你开场时的提问风格】
从一个具体、不舒服的角度切入，让对方不能回避：
- "你最不想面对的那件事，是什么？"
- "你在向谁假装你不自卑？"
- "如果你不怕失败，你现在会做什么？"
- "你一直在说服自己相信什么谎话？"
- "你用忙碌来回避什么？"

【追问原则】
- 对方说一件事 → 问这件事在服务什么目的
- 对方给理由 → 追问「这不是理由，这是在服务谁的需要？」
- 对方停在情绪里 → 说「情绪不是问题，情绪是你选择的结果」
- 对方说「我不知道」 → 问「你是真的不知道，还是不敢知道？」

【危险信号】
如果对方表达自杀/自伤念头 → 立即停止对话流程，直接回应：你值得被听到。
然后说：请拨打心理援助热线 400-821-1215（24小时）。

【字数控制】每次回复不超过120字，不超过2段。`;

// ================== API 调用层 ==================

async function callAI(messages, settings) {
  const { provider, model, apiKey, baseUrl } = settings;

  if (provider === 'ollama') {
    return callOllama(messages, model);
  } else if (provider === 'openai') {
    return callOpenAI(messages, model, apiKey);
  } else if (provider === 'deepseek') {
    return callDeepSeek(messages, apiKey);
  } else if (provider === 'custom') {
    return callCustom(messages, model, apiKey, baseUrl);
  }
  throw new Error('Unknown provider: ' + provider);
}

async function callOllama(messages, model) {
  const prompt = messagesToPrompt(messages);
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'qwen2.5:7b',
      prompt: prompt,
      stream: false
    })
  });
  if (!res.ok) throw new Error('Ollama error: ' + res.status);
  const data = await res.json();
  return data.response || data.text || '';
}

async function callOpenAI(messages, model, apiKey) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: messages,
      temperature: 0.8
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('OpenAI error: ' + res.status + ' ' + err);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callCustom(messages, model, apiKey, baseUrl) {
  // OpenAI-compatible API (硅基流动等)
  const res = await fetch(baseUrl + '/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.8
    })
  });
  if (!res.ok) throw new Error('API error: ' + res.status);
  const data = await res.json();
  return data.choices[0].message.content;
}

// 把对话历史转成纯文本 prompt（给 Ollama 用）
function messagesToPrompt(messages) {
  let prompt = ADLER_SYSTEM + '\n\n对话历史：\n';
  for (const m of messages) {
    prompt += (m.role === 'user' ? '用户' : '你') + '：' + m.content + '\n';
  }
  prompt += '\n你的回复（少于120字，直接有力）：';
  return prompt;
}

// ================== 设置管理 ==================

const SETTINGS_KEY = 'adler-coach-settings';

function loadSettings() {
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    return s ? JSON.parse(s) : defaultSettings();
  } catch(e) {
    return defaultSettings();
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function defaultSettings() {
  return {
    provider: 'ollama',
    model: 'qwen2.5:7b',
    apiKey: '',
    baseUrl: ''
  };
}

function renderSettingsPanel() {
  const s = loadSettings();
  return `
    <div class="settings-panel" id="settingsPanel" style="
      background: #f8f6f3;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      border: 1px solid #e8e0d8;
    ">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <span style="font-size:13px;color:#888;">⚙️ AI 设置</span>
        <button onclick="toggleSettings()" style="background:none;border:none;cursor:pointer;font-size:16px;">${document.getElementById('settingsPanel')?.style.display === 'none' ? '▼' : '▲'}</button>
      </div>
      <div id="settingsBody">
        <div style="margin-bottom:10px;">
          <label style="font-size:12px;color:#666;display:block;margin-bottom:4px;">接入方式</label>
          <select id="selProvider" onchange="onProviderChange()" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d4cdc6;font-size:14px;">
            <option value="ollama" ${s.provider==='ollama'?'selected':''}>🏠 本地 Ollama</option>
            <option value="openai" ${s.provider==='openai'?'selected':''}>🤖 OpenAI (GPT)</option>
            <option value="deepseek" ${s.provider==='deepseek'?'selected':''}>🌊 DeepSeek</option>
            <option value="custom" ${s.provider==='custom'?'selected':''}>☁️ 自定义 API</option>
          </select>
        </div>
        <div style="margin-bottom:10px;" id="divModel">
          <label style="font-size:12px;color:#666;display:block;margin-bottom:4px;">模型</label>
          <input type="text" id="inpModel" value="${s.model}" placeholder="如 qwen2.5:7b 或 gpt-4o-mini" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d4cdc6;font-size:14px;">
        </div>
        <div style="margin-bottom:10px;" id="divApiKey">
          <label style="font-size:12px;color:#666;display:block;margin-bottom:4px;">API Key</label>
          <input type="password" id="inpApiKey" value="${s.apiKey}" placeholder="sk-..." style="width:100%;padding:8px;border-radius:8px;border:1px solid #d4cdc6;font-size:14px;">
        </div>
        <div style="margin-bottom:10px;display:none;" id="divBaseUrl">
          <label style="font-size:12px;color:#666;display:block;margin-bottom:4px;">API 地址</label>
          <input type="text" id="inpBaseUrl" value="${s.baseUrl}" placeholder="https://api.example.com" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d4cdc6;font-size:14px;">
        </div>
        <button onclick="saveAndClose()" style="width:100%;background:#2d4a3e;color:#fff;border:none;padding:10px;border-radius:8px;font-size:14px;cursor:pointer;margin-bottom:6px;">保存设置</button>
        <button onclick="testConnection()" id="testConnBtn" style="width:100%;background:#fff;color:#2d4a3e;border:1.5px solid #2d4a3e;padding:9px;border-radius:8px;font-size:13px;cursor:pointer;">🔗 测试连接</button>
        <div style="font-size:11px;color:#aaa;margin-top:6px;text-align:center;">Key 仅存储在本地浏览器</div>
      </div>
    </div>
  `;
}

function toggleSettings() {
  const body = document.getElementById('settingsBody');
  body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function onProviderChange() {
  const p = document.getElementById('selProvider').value;
  document.getElementById('divApiKey').style.display = p === 'ollama' ? 'none' : 'block';
  document.getElementById('divBaseUrl').style.display = p === 'custom' ? 'block' : 'none';
  const modelPlaceholder = p === 'ollama' ? 'qwen2.5:7b' : 'gpt-4o-mini';
  document.getElementById('inpModel').placeholder = '如 ' + modelPlaceholder;
}

function saveAndClose() {
  const settings = {
    provider: document.getElementById('selProvider').value,
    model: document.getElementById('inpModel').value.trim() || defaultSettings().model,
    apiKey: document.getElementById('inpApiKey').value.trim(),
    baseUrl: document.getElementById('inpBaseUrl').value.trim()
  };
  saveSettings(settings);
  toggleSettings();
  // 重新渲染 AI 消息
  renderSettingsUI();
}

async function testConnection() {
  const btn = document.getElementById('testConnBtn');
  if (!btn) return;
  const origText = btn.textContent;
  btn.textContent = '⏳ 测试中...';
  btn.disabled = true;

  const s = loadSettings();
  try {
    let result;
    if (s.provider === 'deepseek') {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + s.apiKey },
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: 'hi' }], max_tokens: 5 })
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error('HTTP ' + res.status + ': ' + err);
      }
      const data = await res.json();
      result = '✅ 连接成功！DeepSeek 响应正常。';
    } else if (s.provider === 'openai') {
      result = 'OpenAI 连接需要有效的 API Key，当前未测试。';
    } else if (s.provider === 'ollama') {
      result = '请确保本地 Ollama 已启动 (localhost:11434)。';
    } else {
      result = '请先保存设置后再测试。';
    }
    btn.textContent = result.includes('成功') ? '✅ 成功' : '⚠️ ' + result;
    setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 4000);
  } catch(e) {
    btn.textContent = '❌ 失败: ' + e.message.slice(0, 50);
    setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 5000);
  }
}

function renderSettingsUI() {
  // 这个函数由外部 HTML 调用，用于初始化设置面板
}

// ================== DeepSeek 支持 ==================

async function callDeepSeek(messages, apiKey) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.8
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('DeepSeek error: ' + res.status + ' ' + err);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

// ================== 阿德勒核心系统提示（精简版） ==================

function buildAdlerMessages(userText, history) {
  const msgs = [{ role: 'system', content: ADLER_SYSTEM }];
  for (const m of history) {
    msgs.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content });
  }
  msgs.push({ role: 'user', content: userText });
  return msgs;
}

function getAdlerOpening() {
  const openings = [
    "你最不想面对的那件事，是什么？",
    "你在向谁假装你不自卑？",
    "如果你不怕失败，你现在会做什么？",
    "你一直在说服自己相信什么谎话？",
    "你用忙碌来回避什么？"
  ];
  return openings[Math.floor(Math.random() * openings.length)];
}
