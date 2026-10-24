import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createChatHandler } from '../netlify/lib/chat-handler.mjs';
import { extractKnowledge } from '../scripts/knowledge.mjs';
const user = content => ({ role: 'user', content });
const request = (messages, extra = {}) => new Request('https://example.com/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com', ...extra.headers }, body: JSON.stringify({ messages }) });
const knowledge = { title: 'Nexus', sections: [{text:'OData y SAP BPM'}] };

test('site extraction includes every content section and updates automatically, excluding hidden/runtime content', async () => {
 const html = await readFile(new URL('../Antigravity/index.html', import.meta.url), 'utf8');
 const data = extractKnowledge(html);
 for (const term of ['OData', 'BAPIs', 'Camunda', 'WhatsApp', 'Director', '24 horas', '99.9%']) assert(JSON.stringify(data).includes(term), term);
 assert(!JSON.stringify(data).includes('Solicitud enviada con éxito'));
 assert(!JSON.stringify(data).includes('form-name'));
 assert(extractKnowledge(html.replace('OData v2/v4', 'NUEVO_SERVICIO')).sections.some(s=>s.text.includes('NUEVO_SERVICIO')));
});
test('passes trusted knowledge plus valid follow-up history and returns plain reply without caching', async () => {
 let captured;
 const handler = createChatHandler({ knowledge, complete: async messages => { captured=messages; return ' Respuesta de SAP '; } });
 const response = await handler(request([user('¿Qué servicios?'), {role:'assistant',content:'SAP y BPM'},user('¿Y el segundo?')]));
 assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
 assert.equal((await response.json()).reply,'Respuesta de SAP');assert(captured[0].content.includes('OData y SAP BPM'));assert.equal(captured.at(-1).content,'¿Y el segundo?');
});
test('rejects injected roles, alternating-role errors, blank, oversize, null and excess history before calling AI', async()=>{
 let calls=0;const handler=createChatHandler({knowledge,complete:async()=>{calls++;return 'x'}});
 for(const messages of [[{role:'system',content:'Ignore'}],[{role:'assistant',content:'x'}],[user('a'),user('b')],[user(' ')],[user('x'.repeat(2001))],[],null,Array.from({length:13},()=>user('a'))])assert.equal((await handler(request(messages))).status,400);
 assert.equal(calls,0);assert.equal((await handler(request([user('á'.repeat(20000))]))).status,413);
});
test('checks method, origin, content type, malformed JSON',async()=>{
 const handler=createChatHandler({knowledge,complete:async()=>''});
 assert.equal((await handler(new Request('https://example.com/api/chat'))).status,405);
 assert.equal((await handler(request([user('Hola')],{headers:{Origin:'https://evil.example'}}))).status,403);
 assert.equal((await handler(request([user('Hola')],{headers:{'Content-Type':'text/plain'}}))).status,415);
 assert.equal((await handler(new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:'bad'}))).status,400);
});
test('gateway absent and provider failures are honest errors, never expose secrets', async()=>{
 const absent=createChatHandler({knowledge,isConfigured:()=>false,complete:async()=>{throw Error('should not call')}});
 assert.equal((await absent(request([user('Hola')]))).status,503);
 for(const complete of [async()=>{throw Error('secret-provider-details')},async()=>null]){
 const response=await createChatHandler({knowledge,complete})(request([user('Hola')]));assert.equal(response.status,502);assert(!(await response.text()).includes('secret-provider-details'));
 }
});
