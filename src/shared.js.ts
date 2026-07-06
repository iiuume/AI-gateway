// 共享 JS 工具函数 — 注入到后台页面的 <script> 块中
export const SHARED_JS = `
// ── 工具函数 ──
function normalizeUrl(url) {
	  return url.replace(/\\/$/, '')
	}
function buildAuthHeaders(apiType, key) {
  return apiType === 'anthropic'
    ? { 'x-api-key': key, 'anthropic-version': '2023-06-01' }
    : { 'Authorization': 'Bearer ' + key }
}

// ── UI 函数 ──
function showSpinner(el) {
  el.innerHTML = '<span class="mu"><i class="fas fa-spinner fa-spin"></i> 测试中...</span>'
}
function showResult(el, success, msg) {
  el.innerHTML = success
    ? '<div class="al al-s"><i class="fas fa-check-circle"></i> 连接成功</div>'
    : '<div class="al al-e"><i class="fas fa-times-circle"></i> ' + (msg || '连接失败') + '</div>'
  setTimeout(function() { el.innerHTML = '' }, 5000)
}

// ── API 请求函数 ──
async function testKeyConnection(url, apiType, key) {
  try {
    var r = await fetch(normalizeUrl(url) + '/models', {
      method: 'GET', headers: buildAuthHeaders(apiType, key)
    })
    return { success: r.ok, status: r.status, data: r.ok ? await r.json().catch(function() { return null }) : null }
  } catch (e) {
    return { success: false, status: 0, data: null }
  }
}
async function testModelConnection(url, apiType, key, modelId) {
  try {
    var endpoint = apiType === 'anthropic' ? 'messages' : 'chat/completions'
    var r = await fetch(normalizeUrl(url) + '/' + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(apiType, key) },
      body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: 'hi' }], max_tokens: 1 })
    })
    return { success: r.ok, status: r.status }
  } catch (e) {
    return { success: false, status: 0 }
  }
}
`