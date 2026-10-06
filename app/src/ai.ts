import type {Language,Status} from './domain';
export async function explainChecklist(key:string,counts:Record<Status,number>,lang:Language,signal:AbortSignal){
 const headers={'Content-Type':'application/json','x-goog-api-key':key};
 const models=await fetch('https://generativelanguage.googleapis.com/v1beta/models',{headers,signal});if(!models.ok)throw Error('aiError');
 const data=await models.json();const model=data.models?.find((m:{name:string;supportedGenerationMethods?:string[]})=>m.supportedGenerationMethods?.includes('generateContent'));if(!model)throw Error('aiError');
 const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent`,{method:'POST',headers,signal,body:JSON.stringify({contents:[{parts:[{text:`Explain anonymous tender checklist counts in ${lang==='bn'?'Bangla':'English'}: ${JSON.stringify(counts)}. Give brief generic next steps. Expiry is checked against submission deadline, equality is valid; optional supplied expired or undated documents block. Never invent document details. Guidance only, not authoritative.`}]}],generationConfig:{maxOutputTokens:500}})});if(!res.ok)throw Error('aiError');const result=await res.json();return result.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text||'').join('\n')||Promise.reject(Error('aiError'));
}
