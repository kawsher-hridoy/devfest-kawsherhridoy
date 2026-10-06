export type Language = 'en' | 'bn';
export type Status = 'Missing' | 'Not provided' | 'Expiry date needed' | 'Expired' | 'OK';
export interface Requirement { id:string; order:number; title_en:string; title_bn:string; mandatory:boolean; has_expiry:boolean }
export interface Tender { tender_id:string; title:string; procuring_entity:string; bidder:string; submission_deadline:string }
export interface Imported { tender:Tender; requirements:Requirement[] }
export interface DocumentFile { id:string; name:string; bytes:Uint8Array; byteLength:number; pageCount:number; sha256:string }
export interface Assignment { fileId:string; expiryDate:string }
export interface Stamp { bytes:Uint8Array; pages:string; width:number; x:number; y:number; position:'bottom-right'|'bottom-left'|'top-right'|'custom' }
export interface Project extends Imported { files:DocumentFile[]; assignments:Record<string,Assignment>; options:{ index:boolean; stamp?:Stamp } }
export const MAX_FILES=30, MAX_BYTES=50_000_000;
export function validDate(v:unknown):v is string {
 if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
 const d=new Date(v+'T00:00:00Z'); return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===v;
}
export function validateRequirements(v:unknown):Imported {
 const x=v as Imported;
 if(!x||!x.tender||!Array.isArray(x.requirements)||x.requirements.length===0)throw Error('invalidJSON');
 for(const k of ['tender_id','title','procuring_entity','bidder'] as const)if(typeof x.tender[k]!=='string'||!x.tender[k].trim())throw Error('invalidJSON');
 if(!validDate(x.tender.submission_deadline))throw Error('invalidJSON');
 const ids=new Set<string>();
 for(const r of x.requirements){
  if(!r||typeof r.id!=='string'||!r.id.trim()||ids.has(r.id)||!Number.isFinite(r.order)||r.order<0||typeof r.title_en!=='string'||!r.title_en.trim()||typeof r.title_bn!=='string'||!r.title_bn.trim()||typeof r.mandatory!=='boolean'||typeof r.has_expiry!=='boolean')throw Error('invalidJSON'); ids.add(r.id);
 }
 return {tender:{...x.tender},requirements:x.requirements.map(r=>({...r})).sort((a,b)=>a.order-b.order)};
}
export const emptyProject=(x:Imported):Project=>({...x,files:[],assignments:{},options:{index:true}});
export function getRequirementStatus(r:Requirement,a:Assignment|undefined,deadline:string):Status {
 if(!a?.fileId)return r.mandatory?'Missing':'Not provided';
 if(r.has_expiry){if(!validDate(a.expiryDate))return 'Expiry date needed';if(a.expiryDate<deadline)return 'Expired';}return 'OK';
}
export function getBlockingIssues(p:Project){return p.requirements.filter(r=>!['OK','Not provided'].includes(getRequirementStatus(r,p.assignments[r.id],p.tender.submission_deadline)));}
export function duplicateGroups(files:DocumentFile[]){const m=new Map<string,DocumentFile[]>();for(const f of files)m.set(f.sha256,[...(m.get(f.sha256)||[]),f]);return [...m.values()].filter(g=>g.length>1);}
export function canAssign(p:Project,rid:string,fid:string){const f=p.files.find(f=>f.id===fid);return !!f&&!Object.entries(p.assignments).some(([r,a])=>r!==rid&&p.files.find(f=>f.id===a.fileId)?.sha256===f.sha256);}
export function assign(p:Project,rid:string,fid:string):Project {
 if(!p.requirements.some(r=>r.id===rid))throw Error('invalidJSON');
 if(fid&&!canAssign(p,rid,fid))throw Error('alreadyAssigned');
 const assignments={...p.assignments};if(fid)assignments[rid]={fileId:fid,expiryDate:''};else delete assignments[rid];
 return {...p,assignments,options:{...p.options,stamp:p.options.stamp?{...p.options.stamp,pages:''}:undefined}};
}
export function removeFile(p:Project,id:string):Project {
 const assignments=Object.fromEntries(Object.entries(p.assignments).filter(([,a])=>a.fileId!==id));
 return {...p,files:p.files.filter(f=>f.id!==id),assignments,options:{...p.options,stamp:p.options.stamp?{...p.options.stamp,pages:''}:undefined}};
}
export function withinLimits(files:Pick<DocumentFile,'byteLength'>[],bytes:number){return files.length<MAX_FILES&&files.reduce((a,f)=>a+f.byteLength,0)+bytes<=MAX_BYTES;}
export function included(p:Project){return p.requirements.flatMap(r=>{const f=p.files.find(f=>f.id===p.assignments[r.id]?.fileId);return f?[{r,f}]:[];});}
export function indexPageCount(p:Project){return p.options.index?Math.ceil(included(p).length/12):0;}
export function pageLayout(p:Project){let n=2+indexPageCount(p);return included(p).map(x=>{const start=n;n+=x.f.pageCount;return {...x,start};});}
export function totalPages(p:Project){return 1+indexPageCount(p)+included(p).reduce((a,x)=>a+x.f.pageCount,0);}
const tokens=(s:string)=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').split(/\s+/).filter(s=>s.length>1&&!['certificate','cert','pdf','the','of','registration'].includes(s));
export function suggestMatches(p:Project,r:Requirement){const rt=tokens(r.title_en+' '+r.title_bn);return p.files.filter(f=>canAssign(p,r.id,f.id)).map(f=>({f,score:tokens(f.name).reduce((s,t)=>s+(rt.some(r=>r===t||(r.length>3&&t.startsWith(r)))?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);}
export function parsePages(value:string,total:number):number[]{if(!value.trim())return [];const n=new Set<number>();for(const part of value.split(',')){const match=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!match)throw Error('invalidPages');const a=+match[1],b=+(match[2]||match[1]);if(a<1||b<a||b>total)throw Error('invalidPages');for(let i=a;i<=b;i++)n.add(i);}return [...n];}
export function csvCell(v:unknown){let s=String(v??'');if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
export function exportChecklist(p:Project,lang:Language,statusText:(s:Status)=>string){const headers=lang==='bn'?['নথি','ফাইলের নাম','পৃষ্ঠা','মেয়াদ শেষ','অবস্থা']:['Document','Filename','Pages','Expiry date','Status'];return '\ufeff'+[headers,...p.requirements.map(r=>{const a=p.assignments[r.id],f=p.files.find(f=>f.id===a?.fileId);return [lang==='bn'?r.title_bn:r.title_en,f?.name||'',f?.pageCount||'',a?.expiryDate||'',statusText(getRequirementStatus(r,a,p.tender.submission_deadline))];})].map(row=>row.map(csvCell).join(',')).join('\r\n');}
export function validateProject(v:unknown):Project {
 const p=v as Project,x=validateRequirements(p);if(!Array.isArray(p.files)||!p.assignments||typeof p.options?.index!=='boolean'||p.files.length>MAX_FILES||p.files.reduce((a,f)=>a+f.byteLength,0)>MAX_BYTES)throw Error('storageError');
 const ids=new Set();for(const f of p.files){if(!(f.bytes instanceof Uint8Array)||f.bytes.length!==f.byteLength||!Number.isInteger(f.pageCount)||f.pageCount<1||ids.has(f.id))throw Error('storageError');ids.add(f.id);}
 const out={...p,...x};for(const [rid,a] of Object.entries(p.assignments))if(!x.requirements.some(r=>r.id===rid)||!canAssign(out,rid,a.fileId))throw Error('storageError');return out;
}
