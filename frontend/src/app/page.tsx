'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock3, Compass, ExternalLink, Globe2, History, Home, LoaderCircle, Plus, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { api, Person, Site, Visit } from '@/lib/api';

type Entry = { address: string; title: string; html: string; scrollY: number; visitId?: string };
type Panel = 'history' | 'search' | 'publish' | 'directory' | null;
const START = 'tidepool.zz';

function makeSafeDocument(html: string) {
  // Remove active content and remote resources before injecting a controlled link bridge.
  let safe = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<base\b[^>]*>/gi, '')
    .replace(/<meta[^>]+http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, '')
    .replace(/\s(on\w+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(?:src|srcset|poster)\s*=\s*(["'])https?:[\s\S]*?\1/gi, '')
    .replace(/<(?:img|video|audio|source|iframe|object|embed)\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/url\s*\(\s*(['"]?)https?:[^)]*\)/gi, 'none')
    .replace(/href\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, 'href="#"');
  const bridge = `<script>document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var href=a.getAttribute('href')||'';if(!href||href[0]==='#'){return;}e.preventDefault();parent.postMessage({type:'SMALL_WEB_NAVIGATE',address:href},'*');});window.addEventListener('scroll',function(){parent.postMessage({type:'SMALL_WEB_SCROLL',y:window.scrollY},'*');},{passive:true});window.addEventListener('message',function(e){if(e.data&&e.data.type==='SMALL_WEB_RESTORE_SCROLL')window.scrollTo(0,e.data.y||0);});</script>`;
  const policy = `<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; font-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'\">`;
  if (/<head\b[^>]*>/i.test(safe)) safe = safe.replace(/<head\b[^>]*>/i, match => match + policy); else safe = policy + safe;
  if (/<\/body\s*>/i.test(safe)) safe = safe.replace(/<\/body\s*>/i, `${bridge}</body>`); else safe += bridge;
  return safe;
}

export default function HomePage() {
  const [people,setPeople] = useState<Person[]>([]);
  const [person,setPerson] = useState<Person|null>(null);
  const [stack,setStack] = useState<Entry[]>([]);
  const [index,setIndex] = useState(-1);
  const [address,setAddress] = useState(START);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [panel,setPanel] = useState<Panel>(null);
  const [history,setHistory] = useState<Visit[]>([]);
  const [query,setQuery] = useState('');
  const [results,setResults] = useState<Site[]>([]);
  const [sites,setSites] = useState<Pick<Site,'address'|'title'|'author'>[]>([]);
  const [publish,setPublish] = useState({address:'',title:'',author:'',html:'<!doctype html>\n<html>\n<body>\n  <h1>Hello, Small Web!</h1>\n  <p>This is my first published page.</p>\n  <p><a href="tidepool.zz">Visit the tidepool journal</a></p>\n</body>\n</html>'});
  const [publishError,setPublishError] = useState('');
  const [notice,setNotice] = useState('');
  const frameRef = useRef<HTMLIFrameElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const current = stack[index];
  const canBack = index > 0;
  const canForward = index >= 0 && index < stack.length - 1;
  const loadPeople = useCallback(async()=>{try{const list=await api.people();setPeople(list);setPerson(list.find(p=>p.kind==='reader')||list[0]||null);}catch(e){setError(e instanceof Error?e.message:'Could not connect to the API.');}},[]);
  useEffect(()=>{loadPeople();api.sites().then(setSites).catch(()=>{});},[loadPeople]);

  const recordVisit = useCallback(async(site: Site, method: 'typed'|'link'|'history'|'restore')=>{
    if(!person)return;
    try { await api.visit({personId:person._id,personName:person.name,address:site.address,title:site.title,method}); } catch {}
  },[person]);

  const navigate = useCallback(async(raw: string, method: 'typed'|'link'|'history'|'restore'='typed', replace=false)=>{
    let target=raw.trim().toLowerCase(); if(!target)return;
    target=target.replace(/^https?:\/\//,'').replace(/\/$/,'').split('/')[0];
    if(!target.includes('.')) target += '.zz';
    setAddress(target); setPanel(null); setError(''); setLoading(true);
    try {
      const site=await api.site(target);
      const entry:Entry={address:site.address,title:site.title,html:site.html,scrollY:0};
      if(replace && index>=0){setStack(prev=>prev.map((v,i)=>i===index?entry:v));}
      else {setStack(prev=>[...prev.slice(0,index+1),entry]);setIndex(prev=>prev+1);}
      await recordVisit(site,method); setNotice('');
    } catch(e) { setError(e instanceof Error?e.message:`No site exists at ${target}.`); }
    finally {setLoading(false);}
  },[index,recordVisit]);

  const restoreEntry = useCallback((nextIndex:number)=>{
    if(nextIndex<0||nextIndex>=stack.length)return;
    const entry=stack[nextIndex]; setIndex(nextIndex); setAddress(entry.address); setError(''); setPanel(null);
    requestAnimationFrame(()=>{frameRef.current?.contentWindow?.postMessage({type:'SMALL_WEB_RESTORE_SCROLL',y:entry.scrollY},'*');});
    // Back/forward are movements within the existing trail, not new visits.
  },[stack]);
  const goBack=()=>{if(canBack)restoreEntry(index-1);};
  const goForward=()=>{if(canForward)restoreEntry(index+1);};
  useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if((e.altKey&&e.key==='ArrowLeft')||(e.metaKey&&e.key==='[')){e.preventDefault();goBack();}if((e.altKey&&e.key==='ArrowRight')||(e.metaKey&&e.key===']')){e.preventDefault();goForward();}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);});
  useEffect(()=>{const onMessage=(event:MessageEvent)=>{if(event.data?.type==='SMALL_WEB_NAVIGATE'&&typeof event.data.address==='string')navigate(event.data.address,'link');if(event.data?.type==='SMALL_WEB_SCROLL'&&typeof event.data.y==='number'){setStack(prev=>prev.map((entry,i)=>i===index?{...entry,scrollY:event.data.y}:entry));}};window.addEventListener('message',onMessage);return()=>window.removeEventListener('message',onMessage);},[navigate]);
  useEffect(()=>{if(!person)return;api.history(person._id).then(setHistory).catch(()=>setHistory([]));},[person,current]);
  useEffect(()=>{if(panel==='search'&&query.trim().length>=2){const t=setTimeout(()=>api.search(query).then(setResults).catch(()=>setResults([])),220);return()=>clearTimeout(t);}if(!query.trim())setResults([]);},[query,panel]);
  const frameSrc=useMemo(()=>current?`data:text/html;charset=utf-8,${encodeURIComponent(makeSafeDocument(current.html))}`:'about:blank',[current]);
  const submitAddress=(e:React.FormEvent)=>{e.preventDefault();navigate(address,'typed');};
  const doPublish=async(e:React.FormEvent)=>{e.preventDefault();setPublishError('');try{const created=await api.publish({...publish,author:publish.author||person?.name||'Anonymous'});setSites(prev=>[...prev,{address:created.address,title:created.title,author:created.author}]);setPanel(null);setNotice(`${created.address} is now published.`);navigate(created.address,'typed');}catch(err){setPublishError(err instanceof Error?err.message:'Could not publish this page.');}};
  const openHistory=(visit:Visit)=>navigate(visit.address,'history');
  const choosePerson=(id:string)=>{const p=people.find(x=>x._id===id);if(p){setPerson(p);setStack([]);setIndex(-1);setAddress(START);setHistory([]);}};

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#home" onClick={e=>{e.preventDefault();navigate(START,'typed');}}><span className="brand-mark"><Globe2 size={19}/></span><span>small<span className="brand-light">web</span></span></a><div className="topbar-right"><div className="person-select"><span className="avatar">{person?.name?.split(' ').map(x=>x[0]).join('').slice(0,2)||'?'}</span><select aria-label="Browsing as" value={person?._id||''} onChange={e=>choosePerson(e.target.value)}>{people.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}</select></div><span className="online-dot" title="Local demo environment"/></div></header>
    <div className="workspace">
      <section className="browser-panel">
        <div className="browser-chrome">
          <div className="window-controls">
          </div>
          <div className="nav-controls">
            <button title="Back" onClick={goBack} disabled={!canBack}>
              <ArrowLeft size={17}/>
              </button>
              <button title="Forward" onClick={goForward} disabled={!canForward}>
                <ArrowRight size={17}/>
                </button>
                <button title="Start page" onClick={()=>navigate(START,'typed')}>
                  <Home size={16}/>
                  </button>
                  </div>
          <form className="address-form" onSubmit={submitAddress}>
            <ShieldCheck size={15}/>
            <input aria-label="Address" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Enter a Small Web address"/>
            <button type="submit" disabled={loading}>{loading?<LoaderCircle className="spin" size={16}/>:<ArrowRight size={16}/>}
            </button>
            </form>
          <button className={`chrome-action ${panel==='history'?'selected':''}`} title="History" onClick={()=>setPanel(panel==='history'?null:'history')}>
            <History size={17}/>
          </button>
          <button className={`chrome-action ${panel==='search'?'selected':''}`} title="Search" onClick={()=>setPanel(panel==='search'?null:'search')}>
            <Search size={17}/>
          </button>
        </div>
        <div className="browser-body" ref={contentRef}>
          {notice&&<div className="notice">
            <Sparkles size={15}/>{notice}
          <button onClick={()=>setNotice('')}><X size={14}/>
          </button>
          </div>}
          {error?<div className="error-page">
            <div className="error-icon">
            <Globe2 size={28}/>
          </div>
          <p className="eyebrow">ADDRESS NOT FOUND</p><h1>This page isn’t here.</h1><p className="muted">{error}
            </p>
          <p className="muted">Check the address, or search the Small Web for something related.
            </p>
          <button className="primary-btn" onClick={()=>{setPanel('search');setQuery(address.split('.')[0]);}}>Search the Small Web 
            <Search size={15}/>
          </button>
          </div>:current?<><div className="page-meta">
            <span>
              <span className="site-dot"/>{current.address}</span>
              <span>Published page
              </span>
              </div><iframe ref={frameRef} title={current.title} className="site-frame" sandbox="allow-scripts" src={frameSrc} onLoad={()=>frameRef.current?.contentWindow?.postMessage({type:'SMALL_WEB_RESTORE_SCROLL',y:current.scrollY},'*')}/></>
          :<div className="welcome-page">
            <div className="welcome-orb">
              <Compass size={34}/>
            </div>
            <p className="eyebrow">A SMALLER CORNER OF THE INTERNET
              </p>
            <h1>Curiosity has<br/>
            <em>an address.
              </em>
            </h1>
            <p className="welcome-copy">A little web made by people, for people. Wander through independent pages, follow a thought, and see where it takes you.
              </p>
            <form className="welcome-search" onSubmit={e=>{e.preventDefault();navigate(address,'typed');}}>
              <Search size={18}/>
            <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Try tidepool.zz"/>
            <button>Explore 
              <ArrowRight size={15}/>
            </button>
            </form>
            <div className="quick-links">
              <button onClick={()=>navigate(START,'typed')}>Start exploring <ArrowRight size={14}/>
            </button>
            <button onClick={()=>setPanel('search')}>Search pages 
              <Search size={14}/>
            </button></div></div>}
        </div>
        <footer className="statusbar"><span><span className="status-dot"/> {loading?'Finding page…':current?'Connected to the Small Web':'Ready to explore'}</span><span>{current?`${index+1} / ${stack.length} in this trail`:'A little web, a lot to discover'}</span></footer>
      </section>
      <aside className={`side-panel ${panel ? 'mobile-open' : ''}`}>
        <div className="side-heading">
        <div>
        <p className="eyebrow">YOUR SPACE</p>
      <h2>Explore</h2>
      </div>
      <span className="side-icon">
        <Compass size={18}/>
        </span></div>
        <div className="side-actions">
          <button className={panel==='search'?'active':''} onClick={()=>setPanel(panel==='search'?null:'search')}>
            <Search size={17}/>
            <span>Search the web</span>
            <kbd>⌘ K</kbd>
            </button>
            <button className={panel==='history'?'active':''} onClick={()=>setPanel(panel==='history'?null:'history')}>
              <Clock3 size={17}/>
              <span>Browsing history</span>
              <kbd>{history.length}</kbd>
              </button>
              <button className={panel==='directory'?'active':''} onClick={()=>setPanel(panel==='directory'?null:'directory')}>
                <Globe2 size={17}/>
                <span>Site directory
                  </span>
                  <kbd>{sites.length}</kbd>
                  </button>
                  </div>
        <div className="side-divider"/>
        {panel==='search'?
        <div className="side-content">
          <div className="panel-title">
            <div>
              <p className="eyebrow">DISCOVER</p>
            <h3>Search pages</h3>
            </div><button onClick={()=>setPanel(null)}>
              <X size={16}/></button>
              </div>
              <div className="search-box">
                <Search size={16}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Words, ideas, places…"/></div><p className="hint">Search looks through page titles and everything written on them.</p>{query.trim().length>=2?<div className="result-list">{results.length?results.map(r=><button className="result-item" key={r._id} onClick={()=>navigate(r.address,'typed')}><span className="result-domain">{r.address}</span><strong>{r.title}</strong><span>{r.textContent?.slice(0,100)||'Open this page to explore its writing.'}…</span></button>):<p className="empty-state">No matching pages yet. Try another phrase.</p>}</div>:<div className="suggestion"><Sparkles size={15}/><span>Try “shore”, “repair”, or “birds”.</span></div>}</div>
        :panel==='history'?<div className="side-content"><div className="panel-title"><div><p className="eyebrow">YOUR TRAIL</p><h3>History</h3></div><button onClick={()=>setPanel(null)}><X size={16}/></button></div><p className="hint">Recent pages visited as {person?.name||'you'}.</p><div className="history-list">{history.length?history.map(v=><button key={v._id} className="history-item" onClick={()=>openHistory(v)}><span className="history-time">{new Date(v.visitedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span><span className="history-info"><strong>{v.title}</strong><small>{v.address} · {v.method}</small></span><ArrowRight size={14}/></button>):<p className="empty-state">Your journey starts with the first page you visit.</p>}</div></div>
        :panel==='directory'?<div className="side-content"><div className="panel-title"><div><p className="eyebrow">THE SMALL WEB</p><h3>Site directory</h3></div><button onClick={()=>setPanel(null)}><X size={16}/></button></div><p className="hint">Every address is a page written by someone in this little web.</p><div className="result-list">{sites.map(s=><button key={s.address} className="directory-item" onClick={()=>navigate(s.address,'typed')}><span className="result-domain">{s.address}</span><strong>{s.title}</strong><small>by {s.author}</small></button>)}</div></div>
        :<div className="side-content side-home"><div className="featured-label"><span className="featured-dot"/> A GOOD PLACE TO BEGIN</div><button className="featured-card" onClick={()=>navigate(START,'typed')}><div className="featured-art"><div className="wave wave-one"/><div className="wave wave-two"/><div className="sun"/></div><div className="featured-copy"><span>FIELD JOURNAL · MARA</span><strong>The Tidepool Field Journal</strong><small>Look closer at the little worlds along the shore.</small></div><div className="featured-arrow"><ArrowRight size={16}/></div></button><div className="side-note"><Sparkles size={16}/><p><strong>There’s no algorithm here.</strong><br/>Just pages, links, and the joy of following your curiosity.</p></div><div className="publish-card"><div className="publish-icon"><Plus size={18}/></div><div><strong>Have something to share?</strong><p>Give your words a little corner of the web.</p><button onClick={()=>{setPublishError('');setPanel('publish');}}>Publish a page <ArrowRight size={14}/></button></div></div></div>}
        <div className="side-bottom"><span>SMALL WEB PROJECT</span><span>MADE FOR WANDERING <span className="tiny-heart">✳</span></span></div>
      </aside>
    </div>
    {panel==='publish'&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPanel(null);}}><section className="publish-modal"><div className="modal-header"><div><p className="eyebrow">ADD TO THE NEIGHBORHOOD</p><h2>Publish a page</h2><p>Every new address makes the Small Web a little bigger.</p></div><button className="close-modal" onClick={()=>setPanel(null)}><X size={19}/></button></div><form onSubmit={doPublish}><div className="form-grid"><label>Page title<input required maxLength={100} value={publish.title} onChange={e=>setPublish({...publish,title:e.target.value})} placeholder="A little field guide"/></label><label>Web address<div className="domain-input"><input required pattern="[a-zA-Z0-9][a-zA-Z0-9-]{1,38}" value={publish.address} onChange={e=>setPublish({...publish,address:e.target.value.toLowerCase()})} placeholder="my-new-page"/><span>.zz</span></div></label></div><label>Written by<input value={publish.author} onChange={e=>setPublish({...publish,author:e.target.value})} placeholder={person?.name||'Your name'}/></label><label>Page HTML<textarea required rows={11} value={publish.html} onChange={e=>setPublish({...publish,html:e.target.value})}/></label><div className="publish-safety"><ShieldCheck size={16}/><span>Your page runs in an isolated frame. Scripts, forms, popups and external resources are disabled.</span></div>{publishError&&<p className="form-error">{publishError}</p>}<div className="modal-footer"><span>HTML only · No external assets</span><button type="submit" className="primary-btn">Publish page <ArrowRight size={15}/></button></div></form></section></div>}
    <div className="mobile-bottom"><button onClick={goBack} disabled={!canBack}><ArrowLeft size={18}/><span>Back</span></button><button onClick={()=>setPanel('search')}><Search size={18}/><span>Search</span></button><button onClick={()=>setPanel('history')}><History size={18}/><span>History</span></button><button onClick={()=>setPanel('publish')}><Plus size={18}/><span>Publish</span></button></div>
  </main>;
}
