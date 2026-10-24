import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createChatHandler } from '../netlify/lib/chat-handler.mjs';

test('long multibyte conversations retain complete pairs and fit the server byte limit', async () => {
  const element = () => ({
    value: '', textContent: '', hidden: false, disabled: false, scrollHeight: 0,
    events: {}, setAttribute() {}, focus() {}, appendChild() {}, remove() {},
    addEventListener(name, callback) { this.events[name] = callback; }
  });
  const elements = Object.fromEntries(['chatBody', 'chatInput', 'btnSend', 'resetChat', 'chatStatus', 'chatError', 'retryChat'].map(id => [id, element()]));
  let initialize;
  const document = {
    getElementById: id => elements[id] || null,
    querySelectorAll: () => [],
    createElement: element,
    addEventListener(name, callback) { if (name === 'DOMContentLoaded') initialize = callback; }
  };
  const requests = [];
  const handler = createChatHandler({ knowledge: {}, complete: async () => 'á'.repeat(2000) });
  const fetch = async (_, options) => {
    requests.push({ bytes: new TextEncoder().encode(options.body).length, messages: JSON.parse(options.body).messages });
    return handler(new Request('https://example.com/api/chat', options));
  };
  vm.runInNewContext(await readFile(new URL('../Antigravity/app.js', import.meta.url), 'utf8'), {
    document, fetch, TextEncoder, AbortController, setTimeout, clearTimeout
  });
  initialize();
  for (let turn = 0; turn < 8; turn++) {
    elements.chatInput.value = 'á'.repeat(2000);
    await elements.btnSend.events.click();
    assert.equal(elements.chatError.hidden, true, 'the actual server accepts each UI request');
  }
  assert.equal(requests.length, 8);
  assert(requests.every(({ bytes }) => bytes <= 16000));
  assert.equal(requests[1].messages.length, 3, 'retains prior context when it fits');
  assert(requests.at(-1).messages.length < 11, 'drops old pairs when byte budget requires it');
  for (const { messages } of requests) {
    assert.equal(messages.length % 2, 1);
    messages.forEach((message, index) => assert.equal(message.role, index % 2 ? 'assistant' : 'user'));
    assert.equal(messages.at(-1).content, 'á'.repeat(2000), 'keeps the current question intact');
  }
});
