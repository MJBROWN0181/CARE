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
 shield:'<path d="m12 2 8 4v5c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V6l8-4Z"/><path d="m9 12 2 2 4-4"/>',
 pill:'<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m8.6 8.6 6.8 6.8"/>',
 book:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>',
 agenda:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M7 14h4m-4 3h7"/>',
 printer:'<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
 repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
 alert:'<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4m0 3h.01"/>',
 bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2Z"/><path d="M10 20a2 2 0 0 0 4 0"/>'
};
const svg=(name,size=20)=>`<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.heart}</svg>`;
for(const el of document.querySelectorAll('[data-icon]')) el.innerHTML=svg(el.dataset.icon,el.classList.contains('brand-mark')?28:20);
const avatar=(person,size='normal')=>person?.photo?.startsWith('data:image/')?`<img class="avatar-photo ${size==='large'?'avatar-large':''}" src="${esc(person.photo)}" alt="${esc(person.name||'Profile')}" />`:`<span class="avatar-fallback ${size==='large'?'avatar-large':''}">${esc((person?.name||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase())}</span>`;
const categories={appointments:'Appointments',tasks:'Tasks & Reminders',documents:'Documents',emails:'Saved Emails',medical:'Medical',medications:'Medications',journal:'Care Journal',finances:'Finances',contacts:'Contacts',locations:'Where is Everything?'};
const singular={appointments:'appointment',tasks:'task',documents:'document',emails:'saved email',medical:'medical record',medications:'medication',journal:'journal entry',finances:'financial record',contacts:'contact',locations:'item location'};
const tools={documents:['file','Important files and paperwork'],emails:['mail','Messages from doctors and agencies'],medical:['pulse','Doctors, conditions, and notes'],medications:['pill','Medicines, doses, and refills'],journal:['book','Daily notes and changes'],finances:['wallet','Bills, benefits, and accounts'],contacts:['contact','People to call'],locations:['pin','Find keys, deeds, and more']};
const emptyText={medications:'No medications yet. Add each medicine with its dose and when to take it.',journal:'No journal entries yet. Jot down how today went: symptoms, mood, sleep, or visits.'};
const journalKinds=['Note','Symptom','Mood','Sleep','Eating','Fall or injury','Visit','Medication change'];
const repeats={'':'Does not repeat',daily:'Every day',weekly:'Every week',monthly:'Every month',yearly:'Every year'};
const VIEWABLE=/\.(pdf|png|jpe?g|gif|webp|txt|eml|csv)$/i;
const NEWS_VERSION='0.8';
const EVERYONE='*';
let state=null, active='', page='dashboard', edit=null, sheetId='', weekOffset=0, appSettings=null;
let releaseState={state:'unconfigured'};
function showUpdateState(next){releaseState=next||{state:'unconfigured'};$('updateBanner').classList.toggle('hidden',releaseState.state!=='ready');if(state&&page==='help')render();}

let wizardStep=0;
const guide=[
  {icon:'heart',title:'Welcome to CARE',text:'CARE keeps caregiving information on this computer, protected by your vault password.',tip:'This guide explains one part at a time. You can reopen it from Help & Settings.'},
  {icon:'home',title:'Dashboard and search',text:'The dashboard shows the selected person’s health facts, upcoming appointments, tasks, and refills. Search at the top can find records across all profiles.',tip:'The menu at the top decides whose information you are viewing. Choose “Everyone” to see all the people you care for together.'},
  {icon:'user',title:'My caregiver profile',text:'Add your own name, role, contact information, and photo. This is the person doing the caregiving.',tip:'Your profile is separate from the profiles of people you care for, and it appears as the first contact on emergency sheets.'},
  {icon:'users',title:'Care profiles',text:'Click Add Profile for each person you care for. Add their allergies, conditions, blood type, and insurance under Health facts.',tip:'Each profile has a printable emergency sheet for ER visits or a new doctor.'},
  {icon:'agenda',title:'Week agenda',text:'See the next seven days of appointments, due tasks, and medication refills in one place.',tip:'Use Previous and Next to move between weeks.'},
  {icon:'file',title:'Documents',text:'Save important papers such as IDs, insurance cards, deeds, and legal documents under the right person.',tip:'Attach a file to a record, then use View to open PDFs and photos right inside CARE.'},
  {icon:'mail',title:'Saved Emails',text:'Download an email from a doctor or agency, select the right person, and click Save Email in CARE.',tip:'You can save .eml, .msg, or PDF files. Direct forwarding to a CARE email address is not available yet.'},
  {icon:'pill',title:'Medications',text:'List each medicine with its dose, when to take it, who prescribed it, and the next refill date.',tip:'Refills due within a week show on the dashboard. Current medicines are printed on the emergency sheet.'},
  {icon:'book',title:'Care journal',text:'Write short dated notes about symptoms, mood, sleep, falls, or visits.',tip:'Over time the journal helps you spot patterns and tell the doctor what has changed.'},
  {icon:'pulse',title:'Medical',text:'Keep notes about doctors, conditions, test results, and other health information for the selected person.',tip:'Add a record for each important item, using the title and details fields.'},
  {icon:'wallet',title:'Finances',text:'Record account references, benefit details, bills, and due dates in that person’s profile.',tip:'Only enter information you need to organize. The vault is encrypted on this computer.'},
  {icon:'contact',title:'Contacts',text:'Keep family, medical, legal, and agency contacts together so you know whom to call.',tip:'Tick “List on the emergency sheet” for the people to call in an emergency.'},
  {icon:'check',title:'Tasks & Reminders',text:'Write down what needs to be done and set a due date. Check a task off when it is finished.',tip:'Set a task to repeat every day, week, month, or year. Checking it off adds the next one.'},
  {icon:'calendar',title:'Appointments',text:'Save visits with a date, time, and location. Upcoming visits show on the dashboard.',tip:'Use Calendar file on an appointment to import it into your calendar app.'},
  {icon:'bell',title:'Reminder pop-ups',text:'CARE shows a Windows notification the day before and an hour before appointments, and when tasks or refills are due.',tip:'Reminders never show names or details. Keep CARE running in the system tray so they can appear.'},
  {icon:'pin',title:'Where is Everything?',text:'Record where to find original papers, keys, deeds, valuables, or other physical items.',tip:'For example: “House deed — fireproof safe, top drawer.”'},
  {icon:'shield',title:'Lock and back up CARE',text:'Click Lock when you step away. In Help & Settings, turn on automatic backups to a USB drive or another folder.',tip:'Keep your password safe. It cannot be reset, and you need it to restore a backup.'}
];
function showWizard(step=0){if(!state)return;wizardStep=step;$('wizard').classList.remove('hidden');renderWizard();$('wizardNext').focus();}
function renderWizard(){const item=guide[wizardStep];$('wizardTitle').textContent=item.title;$('wizardSymbol').innerHTML=svg(item.icon,28);$('wizardText').textContent=item.text;$('wizardTip').textContent=item.tip;$('wizardProgress').innerHTML=guide.map((_,i)=>`<span class="wizard-dot ${i<=wizardStep?'active':''}" aria-hidden="true"></span>`).join('');$('wizardProgress').setAttribute('aria-label',`Step ${wizardStep+1} of ${guide.length}`);$('wizardCounter').textContent=`Step ${wizardStep+1} of ${guide.length}`;$('wizardBack').classList.toggle('hidden',wizardStep===0);$('wizardNext').textContent=wizardStep===guide.length-1?'Start using CARE':'Next';}
async function endWizard(){if(!state)return;if(!state.onboardingComplete){state.onboardingComplete=true;state.newsSeen=NEWS_VERSION;try{await save();}catch(err){state.onboardingComplete=false;alert('Could not save your guide progress: '+err.message);return;}}$('wizard').classList.add('hidden');$('settingsBtn').focus();}
const $=id=>document.getElementById(id);
$('wizardNext').onclick=()=>{if(wizardStep<guide.length-1){wizardStep++;renderWizard();}else endWizard();};
$('wizardBack').onclick=()=>{if(wizardStep>0){wizardStep--;renderWizard();}};
$('wizardSkip').onclick=()=>endWizard();

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const everyone=()=>active===EVERYONE;
const chosen=()=>state.profiles.find(p=>p.id===active);
const scoped=()=>everyone()?state.items.filter(i=>state.profiles.some(p=>p.id===i.profileId)):state.items.filter(i=>i.profileId===active);
const personName=id=>state.profiles.find(p=>p.id===id)?.name||'';
const viewing=()=>everyone()?'For everyone':chosen()?'For '+esc(chosen().name):'Choose a care profile';
const fmt=d=>d?new Date(d+(d.length===10?'T12:00:00':'')).toLocaleString([],d.length===10?{dateStyle:'medium'}:{dateStyle:'medium',timeStyle:'short'}):'';
const sorted=a=>[...a].sort((x,y)=>(x.date||'9999').localeCompare(y.date||'9999'));
const localDay=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const localNow=(d=new Date())=>`${localDay(d)}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
const addDays=(day,n)=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return localDay(d);};
const longDay=day=>new Date(day+'T12:00:00').toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'});
const ageOn=birth=>{if(!birth)return null;const b=new Date(birth+'T12:00:00'),n=new Date();let a=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))a--;return a>=0&&a<130?a:null;};
// Keep a copy of what is on disk so a failed save can't leave unsaved changes on screen.
let savedState=null;
async function save(){try{await care.save(state);savedState=structuredClone(state);}catch(err){if(savedState)state=structuredClone(savedState);render();throw err;}render();}
const overdue=i=>i.type==='tasks'&&!i.done&&i.date&&i.date.slice(0,10)<localDay();
const refillSoon=i=>i.type==='medications'&&!i.stopped&&i.date&&i.date.slice(0,10)<=addDays(localDay(),7);
const BACKUP_NUDGE_DAYS=30;
const lastBackup=()=>[state.lastBackupAt,appSettings?.lastAutoBackup].filter(Boolean).sort().pop();
const backupDue=()=>state.items.length>0&&(!lastBackup()||Date.now()-new Date(lastBackup())>BACKUP_NUDGE_DAYS*864e5);
// Next date for a repeating task: step from its due date until it is today or later.
function nextRepeat(day,repeat){
  const today=localDay();let d=new Date((day||today).slice(0,10)+'T12:00:00');const dayOfMonth=d.getDate();
  const step=()=>{if(repeat==='daily')d.setDate(d.getDate()+1);else if(repeat==='weekly')d.setDate(d.getDate()+7);else{const t=new Date(d.getFullYear(),d.getMonth()+(repeat==='monthly'?1:12),1,12);t.setDate(Math.min(dayOfMonth,new Date(t.getFullYear(),t.getMonth()+1,0).getDate()));d=t;}};
  do step();while(localDay(d)<today);
  return localDay(d);
}
function showLocked(){state=null;savedState=null;active='';edit=null;sheetId='';weekOffset=0;$('passwordModal').classList.add('hidden');$('content').replaceChildren();$('profilePicker').replaceChildren();$('entryModal').classList.add('hidden');$('wizard').classList.add('hidden');$('appShell').classList.add('hidden');$('authScreen').classList.remove('hidden');$('authPassword').value='';$('authConfirm').value='';$('authError').textContent='';$('search').value='';}
async function auth(){showLocked();const exists=(await care.status()).exists;$('authTitle').textContent=exists?'Unlock CARE':'Create your private CARE vault';$('authHint').textContent=exists?'Enter your password to see your records.':'Choose at least 12 characters. This password cannot be reset.';$('authSubmit').textContent=exists?'Unlock':'Create vault';$('authPassword').autocomplete=exists?'current-password':'new-password';$('confirmField').classList.toggle('hidden',exists);$('authConfirm').required=!exists;$('restoreBtn').classList.toggle('hidden',exists);$('authPassword').focus();}
// Lock after 15 minutes without keyboard or mouse use so an unattended PC doesn't expose the vault.
const IDLE_LOCK_MS=15*60*1000;let idleTimer=null;
function resetIdle(){clearTimeout(idleTimer);if(state)idleTimer=setTimeout(async()=>{if(!state)return;await care.lock();await auth();$('authError').textContent='CARE locked after 15 minutes without activity.';},IDLE_LOCK_MS);}
for(const evt of ['mousedown','keydown','wheel','touchstart'])document.addEventListener(evt,resetIdle,{passive:true});
function open(v){state=v;savedState=structuredClone(v);active=v.profiles[0]?.id||'';page='dashboard';$('authScreen').classList.add('hidden');$('appShell').classList.remove('hidden');render();showUpdateState(releaseState);resetIdle();if(!state.onboardingComplete)showWizard();care.getSettings().then(s=>{appSettings=s;render();}).catch(()=>{});}
function nav(p){page=p;$('search').value='';render();}
function render(){if(!state)return;
  if((everyone()&&state.profiles.length<2)||(!everyone()&&!chosen()))active=state.profiles[0]?.id||'';
  $('profilePicker').innerHTML=state.profiles.length?state.profiles.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')+(state.profiles.length>1?`<option value="${EVERYONE}">Everyone</option>`:''):'<option value="">No profiles yet</option>';
  $('profilePicker').value=active;const caregiver=state.caregiver;$('miniName').textContent=caregiver?.name||'Your profile';$('miniPhoto').innerHTML=avatar(caregiver);
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const pages={dashboard,profiles,caregiver:caregiverPage,help,agenda,sheet:sheetPage};
  $('content').innerHTML=pages[page]?pages[page]():section(page);}
const add=(txt,action)=>`<button class="primary-btn" data-action="${action}">${txt}</button>`;
function healthStrip(p){
  const fact=(label,value)=>value?`<div class="fact"><span>${label}</span><strong>${esc(value)}</strong></div>`:'';
  const facts=(p.allergies?`<div class="fact fact-alert"><span>${svg('alert',14)} Allergies</span><strong>${esc(p.allergies)}</strong></div>`:'')+fact('Conditions',p.conditions)+fact('Blood type',p.bloodType)+fact('Advance directive',p.directives);
  return `<div class="health-strip"><div class="health-head"><div><div class="eyebrow">HEALTH FACTS · ${esc(p.name)}</div>${facts?'':'<p>Add allergies, conditions, and insurance so they are ready in an emergency.</p>'}</div><div class="strip-actions"><button class="ghost-btn" data-action="edit-profile" data-id="${esc(p.id)}">${facts?'Edit':'Add health facts'}</button><button class="ghost-btn" data-action="emergency-sheet" data-id="${esc(p.id)}">${svg('printer',16)} Emergency sheet</button></div></div>${facts?`<div class="facts">${facts}</div>`:''}</div>`;
}
function dashboard(){
  const todo=sorted(scoped().filter(i=>(i.type==='tasks'&&!i.done)||refillSoon(i))).slice(0,6);
  const appts=sorted(scoped().filter(i=>i.type==='appointments'&&i.date&&i.date>=localDay())).slice(0,5);
  const first=state.caregiver?.name?.trim().split(/\s+/)[0];
  const notice=(icon,title,text,button)=>`<div class="notice"><span>${svg(icon,20)}</span><div><strong>${title}</strong><small>${text}</small></div>${button}</div>`;
  const news=state.onboardingComplete&&state.newsSeen!==NEWS_VERSION?notice('heart','New in CARE','Medications with refill reminders, a care journal, health facts with a printable emergency sheet, a week agenda, repeating tasks, reminder pop-ups, automatic backups, and viewing files inside CARE.',`<button class="ghost-btn" data-action="show-guide">Take the tour</button><button class="text-btn" data-action="dismiss-news">Dismiss</button>`):'';
  const nudge=backupDue()?notice('shield',lastBackup()?'Time for a fresh backup':'You have no backup yet',`Your password can't be reset, and a backup is the only copy if this computer fails. Save one to a USB drive, or turn on automatic backups in Help &amp; Settings.`,'<button class="primary-btn" data-action="backup">Save encrypted backup</button>'):'';
  return `${news}${nudge}<div class="dashboard-head"><div><div class="eyebrow">YOUR CARE WORKSPACE</div><h1>${first?'Hello, '+esc(first):'Welcome to CARE'}<span class="title-period">.</span></h1><p>Everything important, organized around the people you care for.</p></div><div class="hero-actions">${add(svg('plus',18)+' Add care profile','add-profile')}${chosen()?add(svg('mail',18)+' Save email','save-email'):''}</div></div>
  ${chosen()?healthStrip(chosen()):''}
  <div class="section-heading"><div><div class="eyebrow">YOUR PEOPLE</div><h2>Care profiles <span class="count-pill">${state.profiles.length}</span></h2></div><button class="text-link" data-page="profiles">View all ${svg('chevron',16)}</button></div>
  <div class="profile-grid">${state.profiles.map(p=>`<button class="profile-card ${p.id===active?'selected':''}" data-action="select-profile" data-id="${esc(p.id)}"><span class="avatar">${avatar(p)}</span><span class="profile-copy"><strong>${esc(p.name)}</strong><small>${esc(p.relationship||'Care profile')}</small></span><span class="profile-arrow">${svg('chevron',18)}</span></button>`).join('')}<button class="add-card" data-action="add-profile"><span class="add-ring">${svg('plus',22)}</span><span>Add another person</span></button></div>
  <div class="panels"><div class="panel"><div class="panel-head"><div class="panel-icon blue">${svg('calendar',20)}</div><div><h2>Upcoming appointments</h2><p>${viewing()}</p></div><button class="icon-link" data-page="appointments" aria-label="View appointments">${svg('chevron',18)}</button></div><div class="panel-body">${appts.map(row).join('')||'<div class="panel-empty">No appointments yet. Add one when you need it.</div>'}</div></div>
  <div class="panel"><div class="panel-head"><div class="panel-icon coral">${svg('check',20)}</div><div><h2>Things to do</h2><p>${viewing()} · tasks and refills due this week</p></div><button class="icon-link" data-page="agenda" aria-label="View week agenda">${svg('chevron',18)}</button></div><div class="panel-body">${todo.map(row).join('')||'<div class="panel-empty">Nothing on your list right now.</div>'}</div></div></div>
  <div class="section-heading tools-heading"><div><div class="eyebrow">ORGANIZE THE DETAILS</div><h2>Care tools</h2></div></div>
  <div class="shortcuts">${Object.entries(tools).map(([key,[icon,text]])=>`<button class="shortcut" data-page="${key}"><span class="shortcut-icon ${key}">${svg(icon,22)}</span><strong>${esc(categories[key])}</strong><small>${text}</small><span class="shortcut-arrow">${svg('chevron',16)}</span></button>`).join('')}</div>`;
}
function profiles(){return `<div class="page-header"><div class="eyebrow">PEOPLE IN YOUR CARE</div><h1>Care profiles</h1><p>A private record for each person you help care for.</p></div><div class="section-heading"><h2>People <span class="count-pill">${state.profiles.length}</span></h2>${add(svg('plus',18)+' Add care profile','add-profile')}</div><div class="profile-list">${state.profiles.map(p=>`<div class="profile-list-card"><span class="avatar">${avatar(p)}</span><div class="profile-copy"><strong>${esc(p.name)}</strong><small>${esc(p.relationship||'Care profile')}${ageOn(p.birthDate)!=null?' · age '+ageOn(p.birthDate):''}${p.note?' · '+esc(p.note):''}</small>${p.allergies?`<small class="allergy-line">${svg('alert',12)} Allergies: ${esc(p.allergies)}</small>`:''}</div><div class="card-actions"><button data-action="select-profile" data-id="${esc(p.id)}">Open profile</button><button data-action="emergency-sheet" data-id="${esc(p.id)}">Emergency sheet</button><button data-action="edit-profile" data-id="${esc(p.id)}">Edit</button><button data-action="delete-profile" data-id="${esc(p.id)}">Delete</button></div></div>`).join('')||'<div class="empty">Add the first person you care for.</div>'}</div>`;
}
function caregiverPage(){const c=state.caregiver;return `<div class="page-header"><div class="eyebrow">THE PERSON PROVIDING CARE</div><h1>My caregiver profile</h1><p>Your details stay separate from the records of people in your care.</p></div><div class="caregiver-card"><div class="caregiver-card-art"><span class="avatar">${avatar(c,'large')}</span></div><div class="caregiver-card-copy"><span class="eyebrow">CAREGIVER</span><h2>${esc(c?.name||'Add your name')}</h2><p>${esc(c?.relationship||'Tell CARE who you are and how you help.')}</p>${c?.contact?`<div class="caregiver-contact">${svg('contact',18)} ${esc(c.contact)}</div>`:''}${c?.note?`<p class="caregiver-note">${esc(c.note)}</p>`:''}${add(c?'Edit my profile':'Set up my profile','edit-caregiver')}</div></div>`;
}
function section(type){
  if(!categories[type])return help();
  const p=chosen();
  let items=sorted(scoped().filter(i=>i.type===type)),past=[];
  if(type==='tasks')items=[...items.filter(i=>!i.done),...items.filter(i=>i.done)];
  if(type==='emails'||type==='journal')items.reverse();
  if(type==='medications'){items.sort((x,y)=>x.title.localeCompare(y.title));past=items.filter(i=>i.stopped);items=items.filter(i=>!i.stopped);}
  if(type==='appointments'){const today=localDay();past=items.filter(i=>i.date&&i.date.slice(0,10)<today).reverse();items=items.filter(i=>!past.includes(i));}
  const list=a=>'<div class="records">'+a.map(row).join('')+'</div>';
  const pastTitle={appointments:'Past appointments',medications:'No longer taking'}[type];
  const actions=p?`${type==='medications'&&items.length?`<button class="ghost-btn" data-action="emergency-sheet" data-id="${esc(p.id)}">${svg('printer',16)} Print medication list</button>`:''}${type==='emails'?add(svg('mail',18)+' Save email','save-email'):add(svg('plus',18)+' Add '+singular[type],'add-item')}`:'';
  const sub=everyone()?'Records for everyone you care for. Choose one person at the top to add records.':`Records for ${esc(p?.name||'your selected profile')}.`;
  const body=!p&&!everyone()?'<div class="empty">Add a care profile first.</div>'
    :items.length||past.length?(items.length?list(items):`<div class="empty">${type==='appointments'?'No upcoming appointments.':'No current medications.'}</div>`)+(past.length?`<h2 class="list-heading">${pastTitle}</h2>${list(past)}`:'')
    :`<div class="empty">${emptyText[type]||'Nothing here yet. Add the first record.'}</div>`;
  return `<div class="section-top"><div><h1 class="page-title">${categories[type]}</h1><p class="page-sub">${sub}</p></div><div class="section-actions">${actions}</div></div>${body}`;
}
function row(i){
  const today=localDay();
  const badges=[overdue(i)?'<span class="badge badge-alert">Overdue</span>':'',refillSoon(i)?`<span class="badge badge-alert">${i.date.slice(0,10)<today?'Refill overdue':'Refill soon'}</span>`:'',i.type==='journal'&&i.kind?`<span class="badge">${esc(i.kind)}</span>`:'',i.repeat?`<span class="badge">${svg('repeat',11)} ${esc(repeats[i.repeat]||'')}</span>`:'',i.type==='contacts'&&i.emergency?'<span class="badge">Emergency contact</span>':''].join('');
  const who=everyone()?`<span class="person-tag">${esc(personName(i.profileId))}</span>`:'';
  const meta=i.type==='medications'?[i.dose,i.schedule].filter(Boolean).join(' · '):i.type==='contacts'?i.contact||'':'';
  const when=i.date?(i.type==='medications'?'Next refill: ':i.type==='tasks'?'Due ':'')+fmt(i.date):'';
  const more=i.type==='medications'?[i.prescriber&&'Prescribed by '+i.prescriber,i.pharmacy&&'Pharmacy: '+i.pharmacy].filter(Boolean).join(' · '):'';
  const file=i.attachment;
  return `<div class="record ${i.stopped?'record-muted':''}"><div class="record-main">${i.type==='tasks'?`<input type="checkbox" data-action="toggle" data-id="${esc(i.id)}" ${i.done?'checked':''} aria-label="Mark task complete">`:''}<div><h3 class="${i.done?'done':''}">${esc(i.title)}${badges?' '+badges:''}</h3>${who}${meta?`<p class="record-meta">${esc(meta)}</p>`:''}${when?`<small>${esc(when)}</small>`:''}${more?`<p>${esc(more)}</p>`:''}${i.detail?`<p>${esc(i.detail)}</p>`:''}${file?`<small>📎 ${esc(file.name)}</small>`:''}</div></div><div class="card-actions">${i.type==='appointments'&&i.date?`<button data-action="calendar" data-id="${esc(i.id)}">Calendar file</button>`:''}${file&&VIEWABLE.test(file.name)?`<button data-action="view" data-id="${esc(i.id)}">View</button>`:''}${file?`<button data-action="download" data-id="${esc(i.id)}">Save a copy</button>`:''}<button data-action="edit-item" data-id="${esc(i.id)}">Edit</button><button data-action="delete-item" data-id="${esc(i.id)}">Delete</button></div></div>`;
}
function agenda(){
  const today=localDay(),start=addDays(today,weekOffset*7),days=[...Array(7)].map((_,n)=>addDays(start,n)),items=scoped();
  const timed=i=>i.type==='appointments'||i.type==='tasks'||(i.type==='medications'&&!i.stopped);
  const on=day=>items.filter(i=>timed(i)&&i.date&&i.date.slice(0,10)===day).sort((x,y)=>x.date.localeCompare(y.date));
  const late=weekOffset===0?sorted(items.filter(overdue)):[];
  const label=i=>i.type==='appointments'?(i.date.length>10?new Date(i.date).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):'All day'):i.type==='tasks'?'Task':'Refill';
  const entry=i=>`<div class="agenda-item agenda-${i.type}"><span class="agenda-time">${esc(label(i))}</span><span class="agenda-title ${i.done?'done':''}">${esc(i.type==='medications'?'Refill: '+i.title:i.title)}</span>${everyone()?`<span class="person-tag">${esc(personName(i.profileId))}</span>`:''}<button class="text-btn" data-action="open-result" data-profile="${esc(i.profileId)}" data-type="${esc(i.type)}">Open</button></div>`;
  const day=(title,list,cls='')=>`<div class="agenda-day ${cls}"><h3>${title}</h3>${list.map(entry).join('')||'<p class="agenda-empty">Nothing scheduled</p>'}</div>`;
  return `<div class="section-top"><div><h1 class="page-title">Week agenda</h1><p class="page-sub">${viewing()} · ${esc(longDay(days[0]))} to ${esc(longDay(days[6]))}</p></div><div class="section-actions"><button class="ghost-btn" data-action="week" data-step="-1">‹ Previous</button>${weekOffset?'<button class="ghost-btn" data-action="week" data-step="0">This week</button>':''}<button class="ghost-btn" data-action="week" data-step="1">Next ›</button></div></div>
  ${!chosen()&&!everyone()?'<div class="empty">Add a care profile first.</div>':(late.length?day('Overdue',late,'agenda-late'):'')+`<div class="agenda">${days.map(d=>day(esc(longDay(d))+(d===today?' <span class="count-pill">Today</span>':''),on(d),d===today?'agenda-today':'')).join('')}</div>`}`;
}
function emergencySheet(p){
  const mine=type=>state.items.filter(i=>i.profileId===p.id&&i.type===type);
  const meds=mine('medications').filter(m=>!m.stopped).sort((x,y)=>x.title.localeCompare(y.title));
  const contacts=mine('contacts').filter(k=>k.emergency);
  const c=state.caregiver,age=ageOn(p.birthDate);
  const field=(label,value)=>value?`<div class="sheet-field"><span>${label}</span><strong>${esc(value)}</strong></div>`:'';
  const person=(name,role,phone,note)=>`<div class="sheet-contact"><strong>${esc(name)}</strong>${role?`<span>${esc(role)}</span>`:''}${phone?`<b>${esc(phone)}</b>`:''}${note?`<small>${esc(note)}</small>`:''}</div>`;
  return `<article class="sheet">
    <header class="sheet-head">${p.photo?`<img src="${esc(p.photo)}" alt="" />`:''}<div><div class="sheet-kicker">EMERGENCY INFORMATION</div><h1>${esc(p.name)}</h1><p>${[p.birthDate?'Born '+fmt(p.birthDate)+(age!=null?` (age ${age})`:''):'',p.contact].filter(Boolean).map(esc).join(' · ')}</p></div></header>
    <section class="sheet-alert"><span>ALLERGIES</span><strong>${esc(p.allergies||'None recorded')}</strong></section>
    <div class="sheet-grid">${field('Medical conditions',p.conditions)}${field('Blood type',p.bloodType)}${field('Advance directive / DNR',p.directives)}${field('Insurance',p.insurance)}${field('Care notes',p.note)}</div>
    <h2>Current medications</h2>${meds.length?`<table><thead><tr><th>Medicine</th><th>Dose</th><th>When</th><th>Prescribed by</th></tr></thead><tbody>${meds.map(m=>`<tr><td>${esc(m.title)}</td><td>${esc(m.dose)}</td><td>${esc(m.schedule)}</td><td>${esc(m.prescriber)}</td></tr>`).join('')}</tbody></table>`:'<p class="sheet-none">No medications recorded.</p>'}
    <h2>Emergency contacts</h2><div class="sheet-contacts">${c?.name?person(c.name,'Caregiver'+(c.relationship?' · '+c.relationship:''),c.contact,''):''}${contacts.map(k=>person(k.title,'',k.contact,k.detail)).join('')||(c?.name?'':'<p class="sheet-none">No emergency contacts recorded.</p>')}</div>
    <footer>Printed ${esc(new Date().toLocaleDateString([],{dateStyle:'long'}))} from CARE. Details may have changed since then.</footer>
  </article>`;
}
function sheetPage(){
  const p=state.profiles.find(x=>x.id===sheetId);if(!p)return dashboard();
  const missing=[!p.allergies&&'allergies',!state.items.some(i=>i.profileId===p.id&&i.type==='medications')&&'medications',!state.items.some(i=>i.profileId===p.id&&i.type==='contacts'&&i.emergency)&&!state.caregiver?.name&&'emergency contacts'].filter(Boolean);
  return `<div class="sheet-toolbar"><button class="ghost-btn" data-page="dashboard">‹ Back</button><div>${missing.length?`<small>Not filled in yet: ${missing.join(', ')}.</small>`:''}</div><div class="section-actions"><button class="ghost-btn" data-action="edit-profile" data-id="${esc(p.id)}">Edit health facts</button><button class="ghost-btn" data-action="sheet-print">${svg('printer',16)} Print</button><button class="primary-btn" data-action="sheet-pdf">Save as PDF</button></div></div>${emergencySheet(p)}`;
}
function help(){
  const s=appSettings,stamp=d=>esc(new Date(d).toLocaleString([],{dateStyle:'medium',timeStyle:'short'}));
  const toggle=(key,label,disabled=false)=>`<label class="check-label setting"><input type="checkbox" data-action="setting" data-key="${key}" ${s?.[key]?'checked':''} ${disabled||!s?'disabled':''} /> ${label}</label>`;
  const autoStatus=!s?.autoBackupDir?'Off. Choose a folder (a USB drive or a OneDrive folder works well).':`Saving weekly to <b>${esc(s.autoBackupDir)}</b>, keeping the newest 5.${s.lastAutoBackup?' Last automatic backup: '+stamp(s.lastAutoBackup)+'.':''}`;
  return `<h1 class="page-title">Help & Settings</h1><div class="records">
  <div class="record"><div><h3>Setup guide</h3><p>Walk through profiles, records, reminders, and backup one step at a time.</p></div>${add('Show Setup Guide','show-guide')}</div>
  <div class="record record-stack"><div><h3>Reminder pop-ups</h3><p>Windows notifications the day before and an hour before appointments, and when tasks and medication refills are due. They say only when something is due, never names or details, and appear only while CARE is running.</p></div><div class="settings-list">${toggle('reminders','Show reminder pop-ups',s&&!s.notificationsSupported)}${toggle('tray','Keep CARE running in the system tray when I close the window (CARE locks when closed)')}${toggle('openAtLogin','Start CARE in the tray when Windows starts',s&&!s.canOpenAtLogin)}${s&&!s.canOpenAtLogin?'<small>Starting with Windows is available in the installed app.</small>':''}</div></div>
  <div class="record"><div><h3>Automatic backups</h3><p>${autoStatus}</p>${s?.autoBackupError?`<small class="error-line">${svg('alert',12)} Last automatic backup failed: ${esc(s.autoBackupError)}</small>`:''}</div><div class="section-actions">${s?.autoBackupDir?'<button class="ghost-btn" data-action="auto-backup-now">Back up now</button><button class="ghost-btn" data-action="auto-backup-off">Turn off</button>':''}${add(s?.autoBackupDir?'Change folder':'Choose folder','auto-backup-folder')}</div></div>
  <div class="record"><div><h3>Encrypted backup</h3><p>Save a one-time backup to another drive. It includes all attached files. Your password cannot be recovered.</p><small>${state.lastBackupAt?'Last saved backup: '+stamp(state.lastBackupAt):'No backup saved yet.'}</small></div>${add('Save encrypted backup','backup')}</div>
  <div class="record"><div><h3>Vault password</h3><p>Change the password that unlocks CARE. You need the current password to do this.</p></div>${add('Change password','change-password')}</div>
  <div class="record"><div><h3>App updates</h3><p>${({unconfigured:'Automatic updates will be available once CARE releases are connected.',checking:'Checking for updates...',downloading:'Downloading an update'+(releaseState.progress!=null?' · '+releaseState.progress+'%':''),ready:'Update ready. Restart to install it.',current:'CARE is up to date.',error:'Could not check for updates right now.'})[releaseState.state]||'Update status unavailable.'}</p></div>${releaseState.state==='unconfigured'?'<span class="update-state-note">Not connected yet</span>':releaseState.state==='ready'?add('Restart to update','install-update'):add('Check for updates','check-updates')}</div>
  <div class="record"><div><h3>Calendar</h3><p>Save a calendar file from an appointment to import it into Outlook, Google Calendar, or another calendar app. Automatic Google sync and text messages are not available.</p></div></div>
  </div>`;
}
const show=(id,on)=>$(id).classList.toggle('hidden',!on);
function modal(type,id=null){
  const isCaregiver=type==='caregiver',isProfile=type==='profile',isPerson=isCaregiver||isProfile;
  const record=isCaregiver?state.caregiver:(isProfile?state.profiles:state.items).find(x=>x.id===id);
  edit={type,id,attachment:record?.attachment||null,photo:record?.photo||null};
  $('entryHeading').textContent=isCaregiver?'My caregiver profile':(id?'Edit ':'Add ')+(isProfile?'care profile':singular[type]);
  $('entryNameLabel').textContent=isCaregiver?'Your name':isProfile?'Name':({tasks:'Task',medications:'Medicine name',contacts:'Name',journal:'What happened?',locations:'Item'})[type]||'Title';
  $('relationshipLabel').textContent=isCaregiver?'Your role or relationship':'Relationship';
  $('entryDetailLabel').textContent=isCaregiver?'About you (optional)':isProfile?'Care notes (optional)':type==='locations'?'Where is it located?':type==='journal'?'More details (optional)':type==='medications'?'Notes (optional)':'Details / notes';
  $('entryContactLabel').textContent=type==='contacts'?'Phone or email':'Phone or email (optional)';
  $('entryDateLabel').textContent=({appointments:'Date and time',tasks:'Due date (optional)',medications:'Next refill date (optional)',journal:'Date and time'})[type]||'Date (optional)';
  show('relationshipField',isPerson);show('contactField',isPerson||type==='contacts');show('birthField',isProfile);show('healthFields',isProfile);
  show('dateField',!isPerson&&type!=='contacts'&&type!=='locations');show('medFields',type==='medications');show('repeatField',type==='tasks');show('kindField',type==='journal');show('emergencyField',type==='contacts');
  show('photoField',isPerson);show('attachmentField',type==='documents'||type==='emails');
  $('entryKind').innerHTML=journalKinds.map(k=>`<option>${esc(k)}</option>`).join('');
  $('entryRepeat').innerHTML=Object.entries(repeats).map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join('');
  $('entryName').value=record?.name||record?.title||'';
  $('entryRelationship').value=record?.relationship||'';
  $('entryContact').value=record?.contact||'';
  $('entryDetail').value=record?.note||record?.detail||'';
  const withTime=type==='appointments'||type==='journal';
  $('entryDate').type=withTime?'datetime-local':'date';
  const date=record?.date||(type==='journal'&&!id?localNow():'');
  $('entryDate').value=withTime&&date.length===10?date+'T09:00':withTime?date:date.slice(0,10);
  for(const [field,key] of [['entryBirth','birthDate'],['entryAllergies','allergies'],['entryConditions','conditions'],['entryBloodType','bloodType'],['entryDirectives','directives'],['entryInsurance','insurance'],['entryDose','dose'],['entrySchedule','schedule'],['entryPrescriber','prescriber'],['entryPharmacy','pharmacy']])$(field).value=record?.[key]||'';
  $('entryStopped').checked=!!record?.stopped;$('entryEmergency').checked=!!record?.emergency;
  $('entryRepeat').value=record?.repeat||'';$('entryKind').value=record?.kind||'Note';
  refreshAttachment();refreshPhotoPreview();$('entryModal').classList.remove('hidden');$('entryName').focus();
}
function refreshAttachment(){$('attachmentStatus').textContent=edit?.attachment?.name||'No file attached';$('removeAttachBtn').classList.toggle('hidden',!edit?.attachment);}
function refreshPhotoPreview(){const person={name:$('entryName').value||'?',photo:edit?.photo};$('photoPreview').innerHTML=avatar(person);$('removePhotoBtn').classList.toggle('hidden',!edit?.photo);}
function closeModal(){$('entryModal').classList.add('hidden');$('entryForm').reset();edit=null;}
const fileRef=file=>({name:file.name,fileId:file.fileId,size:file.size});
async function action(el){let a=el.dataset.action,id=el.dataset.id;
  if(a==='edit-caregiver')return modal('caregiver','self');if(a==='add-profile')return modal('profile');if(a==='edit-profile')return modal('profile',id);
  if(a==='select-profile'){active=id;return nav('dashboard');}if(a==='add-item')return modal(page);if(a==='edit-item')return modal(state.items.find(i=>i.id===id).type,id);
  if(a==='check-updates'){showUpdateState({state:'checking'});return care.checkUpdates().then(showUpdateState);}if(a==='install-update')return care.installUpdate();
  if(a==='show-guide')return showWizard();
  if(a==='dismiss-news'){state.newsSeen=NEWS_VERSION;return save();}
  if(a==='change-password'){$('passwordForm').reset();$('pwError').textContent='';$('passwordModal').classList.remove('hidden');return $('pwCurrent').focus();}
  if(a==='backup'){if(!await care.backup())return;state.lastBackupAt=new Date().toISOString();return save();}
  if(a==='setting'){appSettings=await care.setSetting(el.dataset.key,el.checked);return render();}
  if(a==='auto-backup-folder'){appSettings=await care.chooseBackupFolder();return render();}
  if(a==='auto-backup-now'){appSettings=await care.autoBackupNow();render();if(appSettings.autoBackupError)alert('Backup failed: '+appSettings.autoBackupError);return;}
  if(a==='auto-backup-off'){if(!confirm('Turn off automatic backups? Backups already saved stay in the folder.'))return;appSettings=await care.clearBackupFolder();return render();}
  if(a==='open-result'){if(el.dataset.profile)active=el.dataset.profile;return nav(el.dataset.type);}
  if(a==='week'){weekOffset=+el.dataset.step?weekOffset+(+el.dataset.step):0;return render();}
  if(a==='emergency-sheet'){sheetId=id||active;if(!state.profiles.some(p=>p.id===sheetId))return alert('Choose a care profile first.');return nav('sheet');}
  if(a==='sheet-print')return care.printSheet('print');
  if(a==='sheet-pdf')return care.printSheet('pdf',personName(sheetId));
  if(a==='save-email'){if(!chosen())return alert('Choose a care profile first.');let file=await care.addDocument();if(!file)return;let details=file.email||{},sent=new Date(details.date||'');state.items.push({id:crypto.randomUUID(),type:'emails',profileId:active,title:details.subject||file.name,detail:[details.from?'From: '+details.from:'',details.date?'Date: '+details.date:''].filter(Boolean).join('\n'),date:Number.isNaN(+sent)?'':localDay(sent),done:false,attachment:fileRef(file)});await save();return nav('emails');}
  if(a==='view'){let i=state.items.find(i=>i.id===id);return care.viewDocument(i.attachment.name,i.attachment.fileId);}
  if(a==='download'){let i=state.items.find(i=>i.id===id);return care.saveDocument(i.attachment.name,i.attachment.fileId);}
  if(a==='calendar')return care.calendar(state.items.find(i=>i.id===id));
  if(a==='delete-profile'){let p=state.profiles.find(p=>p.id===id);if(!confirm(`Delete ${p.name} and all their records? This cannot be undone.`))return;state.profiles=state.profiles.filter(p=>p.id!==id);state.items=state.items.filter(i=>i.profileId!==id);if(active===id)active=state.profiles[0]?.id||'';}
  else if(a==='delete-item'){if(!confirm('Delete this record?'))return;state.items=state.items.filter(i=>i.id!==id);}
  else if(a==='toggle'){const t=state.items.find(i=>i.id===id);t.done=el.checked;
    // Checking off a repeating task adds the next one; it is only added once per task.
    if(t.done&&t.repeat&&!t.repeatSpawned){t.repeatSpawned=true;state.items.push({...structuredClone(t),id:crypto.randomUUID(),done:false,repeatSpawned:false,date:nextRepeat(t.date,t.repeat)});}}
  else return;
  await save();}
$('authForm').onsubmit=async e=>{e.preventDefault();$('authError').textContent='';try{let exists=(await care.status()).exists;if(!exists&&$('authPassword').value!==$('authConfirm').value){$('authError').textContent='The two passwords do not match.';return;}open(await(exists?care.unlock($('authPassword').value):care.create($('authPassword').value)));}catch(err){$('authError').textContent=err.message;}};
$('restoreBtn').onclick=async()=>{try{if(await care.importBackup())await auth();}catch(err){$('authError').textContent=err.message;}};
$('entryForm').onsubmit=async e=>{
  e.preventDefault();const {type,id,attachment,photo}=edit,name=$('entryName').value.trim();if(!name)return;
  const val=field=>$(field).value.trim();
  if(type==='caregiver'){
    state.caregiver={name,relationship:val('entryRelationship'),contact:val('entryContact'),note:val('entryDetail'),photo};
    page='caregiver';
  }else if(type==='profile'){
    const p=id?state.profiles.find(p=>p.id===id):{id:crypto.randomUUID()};
    Object.assign(p,{name,relationship:val('entryRelationship'),contact:val('entryContact'),note:val('entryDetail'),photo,birthDate:$('entryBirth').value,allergies:val('entryAllergies'),conditions:val('entryConditions'),bloodType:val('entryBloodType'),directives:val('entryDirectives'),insurance:val('entryInsurance')});
    if(!id){state.profiles.push(p);active=p.id;page='profiles';}
  }else{
    const i=id?state.items.find(i=>i.id===id):{id:crypto.randomUUID(),type,profileId:active,done:false};
    Object.assign(i,{title:name,detail:val('entryDetail'),date:$('entryDate').value});
    if(type==='medications')Object.assign(i,{dose:val('entryDose'),schedule:val('entrySchedule'),prescriber:val('entryPrescriber'),pharmacy:val('entryPharmacy'),stopped:$('entryStopped').checked});
    if(type==='tasks'){i.repeat=$('entryRepeat').value;if(!i.done)i.repeatSpawned=false;}
    if(type==='journal')i.kind=$('entryKind').value;
    if(type==='contacts')Object.assign(i,{contact:val('entryContact'),emergency:$('entryEmergency').checked});
    if(attachment)i.attachment=attachment;else delete i.attachment;if(!id)state.items.push(i);
  }
  try{await save();closeModal();}catch(err){alert(err.message);}
};
$('photoBtn').onclick=async()=>{try{const photo=await care.choosePhoto();if(photo){edit.photo=photo;refreshPhotoPreview();}}catch(err){alert(err.message);}};
$('removePhotoBtn').onclick=()=>{edit.photo=null;refreshPhotoPreview();};
$('entryName').oninput=()=>{if(edit?.type==='profile'||edit?.type==='caregiver')refreshPhotoPreview();};
$('attachBtn').onclick=async()=>{try{let file=await care.addDocument();if(file){edit.attachment=fileRef(file);refreshAttachment();}}catch(err){alert(err.message);}};
$('removeAttachBtn').onclick=()=>{edit.attachment=null;refreshAttachment();};
const closePassword=()=>{$('passwordForm').reset();$('passwordModal').classList.add('hidden');};
$('cancelPassword').onclick=closePassword;
$('passwordForm').onsubmit=async e=>{e.preventDefault();$('pwError').textContent='';if($('pwNew').value!==$('pwConfirm').value){$('pwError').textContent='The two new passwords do not match.';return;}try{await care.changePassword($('pwCurrent').value,$('pwNew').value);closePassword();alert('Password changed. Save a new encrypted backup so it uses the new password.');}catch(err){$('pwError').textContent=err.message;}};
$('cancelEntry').onclick=closeModal;$('profilePicker').onchange=e=>{active=e.target.value;render();};$('lockBtn').onclick=async()=>{await care.lock();auth();};$('settingsBtn').onclick=()=>nav('help');$('installUpdateBtn').onclick=()=>care.installUpdate();
care.getUpdateState().then(showUpdateState).catch(()=>{});care.onUpdateState(showUpdateState);
care.onLocked(()=>{if(state)auth();});
care.onSettings(s=>{appSettings=s;if(state&&(page==='help'||page==='dashboard'))render();});
document.addEventListener('click',e=>{let a=e.target.closest('[data-action]');if(a)action(a).catch(err=>alert(err.message));else{let p=e.target.closest('[data-page]');if(p)nav(p.dataset.page);}});
$('search').oninput=e=>{let q=e.target.value.trim().toLowerCase();if(!q)return render();
  const people=state.profiles.map(p=>({title:p.name,detail:p.relationship,type:'Profile',profileId:p.id,text:[p.name,p.relationship,p.note,p.allergies,p.conditions,p.insurance]}));
  const records=state.items.map(i=>({...i,profile:personName(i.profileId),text:[i.title,i.detail,personName(i.profileId),i.attachment?.name,i.dose,i.schedule,i.prescriber,i.pharmacy,i.contact,i.kind]}));
  let found=[...people,...records].filter(i=>i.text.filter(Boolean).join('\n').toLowerCase().includes(q));
  $('content').innerHTML=`<h1 class="page-title">Search</h1><p class="page-sub">${found.length} result(s)</p><div class="records">${found.map(i=>`<div class="record"><div><h3>${esc(i.title)}</h3><p>${esc(i.profile||i.detail||'')} · ${esc(categories[i.type]||i.type)}</p></div><div class="card-actions"><button data-action="open-result" data-profile="${esc(i.profileId||'')}" data-type="${i.type==='Profile'?'dashboard':esc(i.type)}">Open</button></div></div>`).join('')||'<div class="empty">No matches found.</div>'}</div>`;};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!$('passwordModal').classList.contains('hidden'))closePassword();else if(!$('entryModal').classList.contains('hidden'))closeModal();else if(!$('wizard').classList.contains('hidden'))endWizard();});
auth();
