// CARE's own consistent 24px line icon set. Paths stay local to the app.
const iconPaths={
 heart:'<path d="M12 21s-8-4.9-8-10.8a4.6 4.6 0 0 1 8-3.1 4.6 4.6 0 0 1 8 3.1C20 16.1 12 21 12 21Z"/><path d="M12 9v6m-3-3h6"/>',
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2H3Zm12-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 4 5v1h-3"/>',
 user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2H5Z"/>',
 file:'<path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M9 13h6m-6 4h6"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
 pulse:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
 wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9V5a2 2 0 0 1 2-2h13m3 9h-6a2 2 0 0 0 0 4h6"/>',
 contact:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M5.5 17a3.5 3.5 0 0 1 7 0m2.5-8h4m-4 4h4"/>',
 check:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 3 3 5-6"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h3"/>',
 pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .8-1.5 1.2-1.5 2.5M12 17h.01"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3V7Z"/><circle cx="12" cy="13" r="3.5"/>',
 chevron:'<path d="m9 6 6 6-6 6"/>',
 shield:'<path d="m12 2 8 4v5c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V6l8-4Z"/><path d="m9 12 2 2 4-4"/>'
};
const svg=(name,size=20)=>`<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.heart}</svg>`;
for(const el of document.querySelectorAll('[data-icon]')) el.innerHTML=svg(el.dataset.icon,el.classList.contains('brand-mark')?28:20);
const avatar=(person,size='normal')=>person?.photo?.startsWith('data:image/')?`<img class="avatar-photo ${size==='large'?'avatar-large':''}" src="${esc(person.photo)}" alt="${esc(person.name||'Profile')}" />`:`<span class="avatar-fallback ${size==='large'?'avatar-large':''}">${esc((person?.name||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase())}</span>`;
const categories = {appointments:'Appointments',tasks:'Tasks & Reminders',documents:'Documents',emails:'Saved Emails',medical:'Medical',finances:'Finances',contacts:'Contacts',locations:'Where is Everything?'};
let state=null, active='', page='dashboard', edit=null;
let releaseState={state:'unconfigured'};
function showUpdateState(next){releaseState=next||{state:'unconfigured'};$('updateBanner').classList.toggle('hidden',releaseState.state!=='ready');if(state&&page==='help')render();}

let wizardStep=0;
const guide=[
  {icon:'heart',title:'Welcome to CARE',text:'CARE keeps caregiving information on this computer, protected by your vault password.',tip:'This guide explains one part at a time. You can reopen it from Help & Settings.'},
  {icon:'home',title:'Dashboard and search',text:'The dashboard shows the selected person’s upcoming appointments and unfinished tasks. Search at the top can find records across all profiles.',tip:'The profile menu at the top decides whose information you are viewing.'},
  {icon:'user',title:'My caregiver profile',text:'Add your own name, role, contact information, and photo. This is the person doing the caregiving.',tip:'Your profile is separate from the profiles of people you care for.'},
  {icon:'users',title:'Care profiles',text:'Click Add Profile for each person you care for. Each person gets their own records.',tip:'Switch people with the profile menu at the top.'},
  {icon:'file',title:'Documents',text:'Save important papers such as IDs, insurance cards, deeds, and legal documents under the right person.',tip:'Open Documents, click Add Record, then attach the downloaded file.'},
  {icon:'mail',title:'Saved Emails',text:'Download an email from a doctor or agency, select the right person, and click Save Email in CARE.',tip:'You can save .eml, .msg, or PDF files. Direct forwarding to a CARE email address is not available yet.'},
  {icon:'pulse',title:'Medical',text:'Keep notes about doctors, medications, conditions, and other health information for the selected person.',tip:'Add a record for each important item, using the title and details fields.'},
  {icon:'wallet',title:'Finances',text:'Record account references, benefit details, bills, and due dates in that person’s profile.',tip:'Only enter information you need to organize. The vault is encrypted on this computer.'},
  {icon:'contact',title:'Contacts',text:'Keep family, medical, legal, and agency contacts together so you know whom to call.',tip:'Add a contact as a record with the name and phone number or other details.'},
  {icon:'check',title:'Tasks & Reminders',text:'Write down what needs to be done and set a due date. Check a task off when it is finished.',tip:'Pending tasks show on the dashboard. Automatic text reminders are not available yet.'},
  {icon:'calendar',title:'Appointments',text:'Save visits with a date, time, and location. Upcoming visits show on the dashboard.',tip:'Use Calendar file on an appointment to import it into your calendar app.'},
  {icon:'pin',title:'Where is Everything?',text:'Record where to find original papers, keys, deeds, valuables, or other physical items.',tip:'For example: “House deed — fireproof safe, top drawer.”'},
  {icon:'shield',title:'Lock and back up CARE',text:'Click Lock App when you step away. In Help & Settings, save an encrypted backup to a separate drive.',tip:'Keep your password safe. It cannot be reset, and you need it to restore a backup.'}
];
function showWizard(step=0){if(!state)return;wizardStep=step;$('wizard').classList.remove('hidden');renderWizard();$('wizardNext').focus();}
function renderWizard(){const item=guide[wizardStep];$('wizardTitle').textContent=item.title;$('wizardSymbol').innerHTML=svg(item.icon,28);$('wizardText').textContent=item.text;$('wizardTip').textContent=item.tip;$('wizardProgress').innerHTML=guide.map((_,i)=>`<span class="wizard-dot ${i<=wizardStep?'active':''}" aria-hidden="true"></span>`).join('');$('wizardProgress').setAttribute('aria-label',`Step ${wizardStep+1} of ${guide.length}`);$('wizardCounter').textContent=`Step ${wizardStep+1} of ${guide.length}`;$('wizardBack').classList.toggle('hidden',wizardStep===0);$('wizardNext').textContent=wizardStep===guide.length-1?'Start using CARE':'Next';}
async function endWizard(){if(!state)return;if(!state.onboardingComplete){state.onboardingComplete=true;try{await save();}catch(err){state.onboardingComplete=false;alert('Could not save your guide progress: '+err.message);return;}}$('wizard').classList.add('hidden');$('settingsBtn').focus();}
const $=id=>document.getElementById(id);
$('wizardNext').onclick=()=>{if(wizardStep<guide.length-1){wizardStep++;renderWizard();}else endWizard();};
$('wizardBack').onclick=()=>{if(wizardStep>0){wizardStep--;renderWizard();}};
$('wizardSkip').onclick=()=>endWizard();

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chosen=()=>state.profiles.find(p=>p.id===active);
const scoped=()=>state.items.filter(i=>i.profileId===active);
const fmt=d=>d?new Date(d+(d.length===10?'T12:00:00':'')).toLocaleString([],d.length===10?{dateStyle:'medium'}:{dateStyle:'medium',timeStyle:'short'}):'';
const sorted=a=>[...a].sort((x,y)=>(x.date||'9999').localeCompare(y.date||'9999'));
async function save(){await care.save(state);render();}
function showLocked(){state=null;active='';edit=null;$('content').replaceChildren();$('profilePicker').replaceChildren();$('entryModal').classList.add('hidden');$('wizard').classList.add('hidden');$('appShell').classList.add('hidden');$('authScreen').classList.remove('hidden');$('authPassword').value='';$('authError').textContent='';$('search').value='';}
async function auth(){showLocked();const exists=(await care.status()).exists;$('authTitle').textContent=exists?'Unlock CARE':'Create your private CARE vault';$('authHint').textContent=exists?'Enter your password to see your records.':'Choose at least 12 characters. This password cannot be reset.';$('authSubmit').textContent=exists?'Unlock':'Create vault';$('restoreBtn').classList.toggle('hidden',exists);$('authPassword').focus();}
function open(v){state=v;active=v.profiles[0]?.id||'';page='dashboard';$('authScreen').classList.add('hidden');$('appShell').classList.remove('hidden');render();showUpdateState(releaseState);if(!state.onboardingComplete)showWizard();}
function nav(p){page=p;$('search').value='';render();}
function render(){if(!state)return;$('profilePicker').innerHTML=state.profiles.length?state.profiles.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join(''):'<option value="">No profiles yet</option>';$('profilePicker').value=active;const caregiver=state.caregiver;$('miniName').textContent=caregiver?.name||'Your profile';$('miniPhoto').innerHTML=avatar(caregiver);document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('content').innerHTML=page==='dashboard'?dashboard():page==='profiles'?profiles():page==='caregiver'?caregiverPage():page==='help'?help():section(page);}
const add=(txt,action)=>`<button class="primary-btn" data-action="${action}">${txt}</button>`;
function dashboard(){
  const tasks=sorted(scoped().filter(i=>i.type==='tasks'&&!i.done)).slice(0,4);
  const appts=sorted(scoped().filter(i=>i.type==='appointments'&&i.date>=new Date().toISOString().slice(0,10))).slice(0,4);
  const first=state.caregiver?.name?.trim().split(/\s+/)[0];
  return `<div class="dashboard-head"><div><div class="eyebrow">YOUR CARE WORKSPACE</div><h1>${first?'Hello, '+esc(first):'Welcome to CARE'}<span class="title-period">.</span></h1><p>Everything important, organized around the people you care for.</p></div><div class="hero-actions">${add(svg('plus',18)+' Add care profile','add-profile')}${chosen()?add(svg('mail',18)+' Save email','save-email'):''}</div></div>
  <div class="section-heading"><div><div class="eyebrow">YOUR PEOPLE</div><h2>Care profiles <span class="count-pill">${state.profiles.length}</span></h2></div><button class="text-link" data-page="profiles">View all ${svg('chevron',16)}</button></div>
  <div class="profile-grid">${state.profiles.map(p=>`<button class="profile-card ${p.id===active?'selected':''}" data-action="select-profile" data-id="${esc(p.id)}"><span class="avatar">${avatar(p)}</span><span class="profile-copy"><strong>${esc(p.name)}</strong><small>${esc(p.relationship||'Care profile')}</small></span><span class="profile-arrow">${svg('chevron',18)}</span></button>`).join('')}<button class="add-card" data-action="add-profile"><span class="add-ring">${svg('plus',22)}</span><span>Add another person</span></button></div>
  <div class="panels"><div class="panel"><div class="panel-head"><div class="panel-icon blue">${svg('calendar',20)}</div><div><h2>Upcoming appointments</h2><p>${chosen()?'For '+esc(chosen().name):'Choose a care profile'}</p></div><button class="icon-link" data-page="appointments" aria-label="View appointments">${svg('chevron',18)}</button></div><div class="panel-body">${appts.map(row).join('')||'<div class="panel-empty">No appointments yet. Add one when you need it.</div>'}</div></div>
  <div class="panel"><div class="panel-head"><div class="panel-icon coral">${svg('check',20)}</div><div><h2>Things to do</h2><p>${chosen()?'For '+esc(chosen().name):'Choose a care profile'}</p></div><button class="icon-link" data-page="tasks" aria-label="View tasks">${svg('chevron',18)}</button></div><div class="panel-body">${tasks.map(row).join('')||'<div class="panel-empty">Nothing on your list right now.</div>'}</div></div></div>
  <div class="section-heading tools-heading"><div><div class="eyebrow">ORGANIZE THE DETAILS</div><h2>Care tools</h2></div></div>
  <div class="shortcuts">${Object.entries(categories).filter(([key])=>!['tasks','appointments'].includes(key)).map(([key,title])=>`<button class="shortcut" data-page="${key}"><span class="shortcut-icon ${key}">${svg(({documents:'file',emails:'mail',medical:'pulse',finances:'wallet',contacts:'contact',locations:'pin'})[key],22)}</span><strong>${esc(title)}</strong><small>${({documents:'Important files and paperwork',emails:'Messages from doctors and agencies',medical:'Doctors, medicines, and notes',finances:'Bills, benefits, and accounts',contacts:'People to call',locations:'Find keys, deeds, and more'})[key]}</small><span class="shortcut-arrow">${svg('chevron',16)}</span></button>`).join('')}</div>`;
}
function profiles(){return `<div class="page-header"><div class="eyebrow">PEOPLE IN YOUR CARE</div><h1>Care profiles</h1><p>A private record for each person you help care for.</p></div><div class="section-heading"><h2>People <span class="count-pill">${state.profiles.length}</span></h2>${add(svg('plus',18)+' Add care profile','add-profile')}</div><div class="profile-list">${state.profiles.map(p=>`<div class="profile-list-card"><span class="avatar">${avatar(p)}</span><div class="profile-copy"><strong>${esc(p.name)}</strong><small>${esc(p.relationship||'Care profile')}${p.note?' · '+esc(p.note):''}</small></div><div class="card-actions"><button data-action="select-profile" data-id="${esc(p.id)}">Open profile</button><button data-action="edit-profile" data-id="${esc(p.id)}">Edit</button><button data-action="delete-profile" data-id="${esc(p.id)}">Delete</button></div></div>`).join('')||'<div class="empty">Add the first person you care for.</div>'}</div>`;
}
function caregiverPage(){const c=state.caregiver;return `<div class="page-header"><div class="eyebrow">THE PERSON PROVIDING CARE</div><h1>My caregiver profile</h1><p>Your details stay separate from the records of people in your care.</p></div><div class="caregiver-card"><div class="caregiver-card-art"><span class="avatar">${avatar(c,'large')}</span></div><div class="caregiver-card-copy"><span class="eyebrow">CAREGIVER</span><h2>${esc(c?.name||'Add your name')}</h2><p>${esc(c?.relationship||'Tell CARE who you are and how you help.')}</p>${c?.contact?`<div class="caregiver-contact">${svg('contact',18)} ${esc(c.contact)}</div>`:''}${c?.note?`<p class="caregiver-note">${esc(c.note)}</p>`:''}${add(c?'Edit my profile':'Set up my profile','edit-caregiver')}</div></div>`;
}
function section(type){if(!categories[type])return help();let items=sorted(scoped().filter(i=>i.type===type));return `<div class="section-top"><div><h1 class="page-title">${categories[type]}</h1><p class="page-sub">Records for ${esc(chosen()?.name||'your selected profile')}.</p></div>${chosen()?(type==='emails'?add('✉ Save Email','save-email'):add('+ Add Record','add-item')):''}</div>${!chosen()?'<div class="empty">Add a care profile first.</div>':items.length?'<div class="records">'+items.map(row).join('')+'</div>':'<div class="empty">Nothing here yet. Add the first record.</div>'}`;}
function row(i){return `<div class="record"><div class="record-main">${i.type==='tasks'?`<input type="checkbox" data-action="toggle" data-id="${esc(i.id)}" ${i.done?'checked':''} aria-label="Mark task complete">`:''}<div><h3 class="${i.done?'done':''}">${esc(i.title)}</h3>${i.date?`<small>${esc(fmt(i.date))}</small>`:''}${i.detail?`<p>${esc(i.detail)}</p>`:''}${i.attachment?`<small>📎 ${esc(i.attachment.name)}</small>`:''}</div></div><div class="card-actions">${i.type==='appointments'&&i.date?`<button data-action="calendar" data-id="${esc(i.id)}">Calendar file</button>`:''}${i.attachment?`<button data-action="download" data-id="${esc(i.id)}">Save document</button>`:''}<button data-action="edit-item" data-id="${esc(i.id)}">Edit</button><button data-action="delete-item" data-id="${esc(i.id)}">Delete</button></div></div>`;}
function help(){return `<h1 class="page-title">Help & Settings</h1><div class="records"><div class="record"><div><h3>Setup guide</h3><p>Walk through profiles, records, email, reminders, and backup one step at a time.</p></div>${add('Show Setup Guide','show-guide')}</div><div class="record"><div><h3>App updates</h3><p>${({unconfigured:'Update checks only run when you choose Check for updates. No care records are sent.',checking:'Checking the release feed. No care records are sent.',available:'Update available. Choose Download update to get the installer.',downloading:'Downloading an update'+(releaseState.progress!=null?' · '+releaseState.progress+'%':''),ready:'Update ready. Restart to install it.',current:'CARE is up to date.',error:'Could not check for updates right now.'})[releaseState.state]||'Update status unavailable.'}</p></div>${releaseState.state==='unconfigured'?'<span class="update-state-note">Not connected yet</span>':releaseState.state==='ready'?add('Restart to update','install-update'):releaseState.state==='available'?add('Download update','download-update'):add('Check for updates','check-updates')}</div><div class="record"><div><h3>Encrypted backup</h3><p>Your records are encrypted on this computer. Save a backup to another drive; your password cannot be recovered.</p></div>${add('Save encrypted backup','backup')}</div><div class="record"><div><h3>Calendar</h3><p>Appointments show in CARE. Save a calendar file to import an appointment into your calendar app. Automatic text reminders and Google sync are not available yet.</p></div></div><div class="record"><div><h3>Earlier browser prototype</h3><p>This desktop vault starts empty. It does not read browser storage from the earlier prototype.</p></div></div></div>`;}
function modal(type,id=null){
  const isCaregiver=type==='caregiver',isProfile=type==='profile';
  const person=isCaregiver?state.caregiver:(isProfile?state.profiles:state.items).find(x=>x.id===id);
  edit={type,id,attachment:null,photo:person?.photo||null};
  $('entryHeading').textContent=isCaregiver?'My caregiver profile':(id?'Edit ':'Add ')+(isProfile?'care profile':categories[type]);
  $('entryNameLabel').textContent=isCaregiver?'Your name':isProfile?'Name':type==='tasks'?'Task':'Title';
  $('relationshipLabel').textContent=isCaregiver?'Your role or relationship':'Relationship';
  $('entryDetailLabel').textContent=isCaregiver?'About you (optional)':isProfile?'Care notes (optional)':type==='locations'?'Where is it located?':'Details / notes';
  $('relationshipField').classList.toggle('hidden',!isProfile&&!isCaregiver);
  $('contactField').classList.toggle('hidden',!isCaregiver);
  $('dateField').classList.toggle('hidden',isProfile||isCaregiver);
  $('photoField').classList.toggle('hidden',!isProfile&&!isCaregiver);
  $('attachmentField').classList.toggle('hidden',type!=='documents'&&type!=='emails');
  $('entryName').value=person?.name||person?.title||'';
  $('entryRelationship').value=person?.relationship||'';
  $('entryContact').value=person?.contact||'';
  $('entryDetail').value=person?.note||person?.detail||'';
  $('entryDate').type=type==='appointments'?'datetime-local':'date';
  $('entryDate').value=person?.date||'';
  $('attachmentStatus').textContent=person?.attachment?.name||'No file attached';
  refreshPhotoPreview();$('entryModal').classList.remove('hidden');$('entryName').focus();
}
function refreshPhotoPreview(){const person={name:$('entryName').value||'?',photo:edit?.photo};$('photoPreview').innerHTML=avatar(person);$('removePhotoBtn').classList.toggle('hidden',!edit?.photo);}
function closeModal(){$('entryModal').classList.add('hidden');$('entryForm').reset();edit=null;}
async function action(el){let a=el.dataset.action,id=el.dataset.id;if(a==='edit-caregiver')return modal('caregiver','self');if(a==='add-profile')return modal('profile');if(a==='edit-profile')return modal('profile',id);if(a==='select-profile'){active=id;return nav('dashboard');}if(a==='add-item')return modal(page);if(a==='edit-item')return modal(state.items.find(i=>i.id===id).type,id);if(a==='check-updates'){showUpdateState({state:'checking'});return care.checkUpdates().then(showUpdateState);}if(a==='download-update'){if(!confirm('Download the CARE update from the official release feed? CARE will connect to the internet to get program files. Your vault will not be uploaded.'))return;return care.downloadUpdate();}if(a==='install-update')return care.installUpdate();if(a==='show-guide')return showWizard();if(a==='backup')return care.backup();if(a==='save-email'){if(!chosen())return alert('Choose a care profile first.');let file=await care.addDocument();if(!file)return;let details=file.email||{};state.items.push({id:crypto.randomUUID(),type:'emails',profileId:active,title:details.subject||file.name,detail:[details.from?'From: '+details.from:'',details.date?'Date: '+details.date:''].filter(Boolean).join('\n'),date:'',done:false,attachment:{name:file.name,content:file.content}});await save();return nav('emails');}if(a==='download'){let i=state.items.find(i=>i.id===id);return care.saveDocument(i.attachment.name,i.attachment.content);}if(a==='calendar')return care.calendar(state.items.find(i=>i.id===id));if(a==='delete-profile'){let p=state.profiles.find(p=>p.id===id);if(!confirm(`Delete ${p.name} and all their records? This cannot be undone.`))return;state.profiles=state.profiles.filter(p=>p.id!==id);state.items=state.items.filter(i=>i.profileId!==id);if(active===id)active=state.profiles[0]?.id||'';}else if(a==='delete-item'){if(!confirm('Delete this record?'))return;state.items=state.items.filter(i=>i.id!==id);}else if(a==='toggle')state.items.find(i=>i.id===id).done=el.checked;else return;await save();}
$('authForm').onsubmit=async e=>{e.preventDefault();$('authError').textContent='';try{let exists=(await care.status()).exists;open(await(exists?care.unlock($('authPassword').value):care.create($('authPassword').value)));}catch(err){$('authError').textContent=err.message;}};
$('restoreBtn').onclick=async()=>{try{if(await care.importBackup())await auth();}catch(err){$('authError').textContent=err.message;}};
$('entryForm').onsubmit=async e=>{
  e.preventDefault();const {type,id,attachment,photo}=edit,name=$('entryName').value.trim();if(!name)return;
  if(type==='caregiver'){
    state.caregiver={name,relationship:$('entryRelationship').value.trim(),contact:$('entryContact').value.trim(),note:$('entryDetail').value.trim(),photo};
    page='caregiver';
  }else if(type==='profile'){
    const p=id?state.profiles.find(p=>p.id===id):{id:crypto.randomUUID()};
    Object.assign(p,{name,relationship:$('entryRelationship').value.trim(),note:$('entryDetail').value.trim(),photo});
    if(!id){state.profiles.push(p);active=p.id;page='profiles';}
  }else{
    const i=id?state.items.find(i=>i.id===id):{id:crypto.randomUUID(),type,profileId:active,done:false};
    Object.assign(i,{title:name,detail:$('entryDetail').value.trim(),date:$('entryDate').value});
    if(attachment)i.attachment=attachment;if(!id)state.items.push(i);
  }
  try{await save();closeModal();}catch(err){alert(err.message);}
};
$('photoBtn').onclick=async()=>{try{const photo=await care.choosePhoto();if(photo){edit.photo=photo;refreshPhotoPreview();}}catch(err){alert(err.message);}};
$('removePhotoBtn').onclick=()=>{edit.photo=null;refreshPhotoPreview();};
$('entryName').oninput=()=>{if(edit?.type==='profile'||edit?.type==='caregiver')refreshPhotoPreview();};
$('attachBtn').onclick=async()=>{try{let file=await care.addDocument();if(file){edit.attachment=file;$('attachmentStatus').textContent=file.name;}}catch(err){alert(err.message);}};
$('cancelEntry').onclick=closeModal;$('profilePicker').onchange=e=>{active=e.target.value;render();};$('lockBtn').onclick=async()=>{await care.lock();auth();};$('settingsBtn').onclick=()=>nav('help');$('installUpdateBtn').onclick=()=>care.installUpdate();if(care.getUpdateState)care.getUpdateState().then(showUpdateState).catch(()=>{});if(care.onUpdateState)care.onUpdateState(showUpdateState);if(care.onVaultLocked)care.onVaultLocked(()=>auth());
document.addEventListener('click',e=>{let a=e.target.closest('[data-action]');if(a)action(a).catch(err=>alert(err.message));else{let p=e.target.closest('[data-page]');if(p)nav(p.dataset.page);}});
$('search').oninput=e=>{let q=e.target.value.trim().toLowerCase();if(!q)return render();let found=[...state.profiles.map(p=>({title:p.name,detail:p.relationship,type:'Profile'})),...state.items.map(i=>({...i,profile:state.profiles.find(p=>p.id===i.profileId)?.name}))].filter(i=>JSON.stringify([i.title,i.detail,i.profile]).toLowerCase().includes(q));$('content').innerHTML=`<h1 class="page-title">Search</h1><p class="page-sub">${found.length} result(s)</p><div class="records">${found.map(i=>`<div class="record"><div><h3>${esc(i.title)}</h3><p>${esc(i.profile||i.detail||'')} · ${esc(categories[i.type]||i.type)}</p></div></div>`).join('')||'<div class="empty">No matches found.</div>'}</div>`;};
auth();
