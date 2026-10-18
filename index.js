class z{constructor(e={},t){if(this.routes=e,this.fallback_view=t,this.stack=[],this.listeners=new Set,this.current_path=null,this.base_path=this.detect_base_path(),typeof window<"u"&&window.addEventListener)window.addEventListener("popstate",(r)=>{let s=this.strip_base(window.location.pathname);this.handle_route(s,r.state,!1)})}detect_base_path(){if(typeof document>"u"||!document.baseURI)return"/";return new URL(document.baseURI).pathname.replace(/\/+$/,"")||"/"}strip_base(e){if(this.base_path==="/")return e||"/";if(e===this.base_path)return"/";if(e.startsWith(`${this.base_path}/`))return e.slice(this.base_path.length)||"/";return e||"/"}to_url(e){return this.base_path==="/"?e:`${this.base_path}${e}`}normalize_path(e){if(!e)return"/";let r=String(e).replace(/^#+/,"").split(/[?#]/)[0].replace(/\/{2,}/g,"/");return(r.startsWith("/")?r:`/${r}`).replace(/\/+$/,"")||"/"}register(e,t){return this.routes[this.normalize_path(e)]=t,this}set_fallback(e){return this.fallback_view=e,this}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}handle_route(e,t={},r=!0){let s=this.normalize_path(e);if(this.current_path=s,r)this.stack.push({path:s,state:t});let n=this.routes[s],a=!n,o={view:n||this.fallback_view,is_fallback:a,path:s,state:t};for(let i of this.listeners)i(o)}resolve(e){let t=this.normalize_path(e);if(this.routes[t])return{view:this.routes[t],is_fallback:!1,path:t};return{view:this.fallback_view,is_fallback:!0,path:t}}navigate(e,t={}){let r=this.normalize_path(e);if(typeof window<"u"&&window.history)window.history.pushState(t,"",this.to_url(r));this.handle_route(r,t,!0)}replace(e,t={}){let r=this.normalize_path(e);if(typeof window<"u"&&window.history)window.history.replaceState(t,"",this.to_url(r));this.handle_route(r,t,!1)}redirect(e){this.replace(e)}back(){if(this.stack.length>1)if(typeof window<"u"&&window.history)window.history.back();else{this.stack.pop();let e=this.stack[this.stack.length-1];if(e)this.handle_route(e.path,e.state,!1)}else this.navigate("/")}start(){let e=typeof window<"u"&&window.location?this.strip_base(window.location.pathname):"/",t=typeof window<"u"&&window.history?window.history.state:null;this.handle_route(e,t??{},!1)}}var X="app_navigate";function b(e){if(typeof document>"u")return;document.dispatchEvent(new CustomEvent(X,{detail:{path:e}}))}function N(e,t,r){let s=r===e.replace("./","/")?"active":"";return`<a href="${e}" class="app-header__link ${s}">${t}</a>`}function Q(e="/",t={}){let r=document.createElement("header");r.className="app-header";let s=t.authenticated?[N("./about","About",e),N("./dashboard","Dashboard",e),'<button type="button" id="header_logout" class="app-header__button">Logout</button>'].join(""):[N("./about","About",e),N("./login","Login",e),N("./register","Register",e)].join("");r.innerHTML=`
    <a href="./" class="app-header__brand">
      <img src="./icon.svg" alt="Logo" class="app-header__logo" />
      <span>Sandbox</span>
    </a>
    <nav class="app-header__nav">${s}</nav>
  `;let n=r.querySelector("#header_logout");if(n&&typeof t.on_logout==="function")n.addEventListener("click",t.on_logout);return r}var u=Object.freeze({app:Object.freeze({name:"Sandbox",description:"A full-stack single-page web application utilizing SQLite WASM + OPFS + web worker setup, powered by Bun.",version:"0.1.0",url_base_path:"/sandbox"}),database:Object.freeze({name:"sandbox.sqlite3"}),cipher:Object.freeze({algorithm:"AES-GCM",key_length:256,iv_bytes:12,salt_bytes:16,key_bytes:32,iterations:600000}),session:Object.freeze({cookie_name:"sandbox_session",ttl_ms:604800000}),network:Object.freeze({base_url:"",timeout_ms:15000,credentials:"same-origin",debug:!1}),validation:Object.freeze({username_pattern:"^[A-Za-z]+$",username_min_length:3,username_max_length:32,password_min_length:8})});class m extends Error{constructor(e,t={}){super(e);let{code:r="APPLICATION_ERROR",http_status:s=500,context:n={}}=t;this.name=this.constructor.name,this.code=r,this.http_status=s,this.context=n}toJSON(){return{name:this.name,code:this.code,message:this.message,http_status:this.http_status,context:this.context}}}class w extends m{constructor(e,t={}){super(e,{code:"CIPHER_ERROR",http_status:500,...t})}}var Ne="./cipher.worker.js",W=new TextEncoder,Ie=new TextDecoder;function y(){if(!globalThis.crypto||!globalThis.crypto.subtle)throw new w("Web Crypto API is unavailable in this environment.");return globalThis.crypto}function Y(e){return typeof e==="string"?W.encode(e):e}function I(e){let t=e instanceof Uint8Array?e:new Uint8Array(e),r="";for(let s=0;s<t.length;s+=1)r+=String.fromCharCode(t[s]);return btoa(r)}function B(e){try{let t=atob(e),r=new Uint8Array(t.length);for(let s=0;s<t.length;s+=1)r[s]=t.charCodeAt(s);return r}catch(t){throw new w(`Unable to decode base64 value: ${t.message}`)}}function te(e){return I(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function ct(e){let t=await y().subtle.digest("SHA-256",Y(e));return I(new Uint8Array(t))}async function R(e){return[...new Uint8Array(await y().subtle.digest("SHA-256",Y(e)))].map((r)=>r.toString(16).padStart(2,"0")).join("")}async function Oe(e,t={}){let r=y(),s=t.iterations??u.cipher.iterations,n=t.key_bytes??u.cipher.key_bytes,a=t.salt_bytes??u.cipher.salt_bytes,o=t.salt??r.getRandomValues(new Uint8Array(a)),i=await r.subtle.importKey("raw",W.encode(e),"PBKDF2",!1,["deriveBits"]),c=await r.subtle.deriveBits({name:"PBKDF2",salt:o,iterations:s,hash:"SHA-256"},i,n*8);return`$pbkdf2-sha256$i=${s}$${I(o)}$${I(new Uint8Array(c))}`}async function Ce(e,t){let r=Ue(t),s=y(),n=await s.subtle.importKey("raw",W.encode(e),"PBKDF2",!1,["deriveBits"]),a=await s.subtle.deriveBits({name:"PBKDF2",salt:r.salt,iterations:r.iterations,hash:"SHA-256"},n,r.hash.length*8);return De(new Uint8Array(a),r.hash)}function Ue(e){let t=/^\$pbkdf2-sha256\$i=(\d+)\$([^$]+)\$([^$]+)$/.exec(e||"");if(!t)throw new w("Malformed PBKDF2 hash.");return{iterations:Number(t[1]),salt:B(t[2]),hash:B(t[3])}}function De(e,t){if(e.length!==t.length)return!1;let r=0;for(let s=0;s<e.length;s+=1)r|=e[s]^t[s];return r===0}async function J(e=!1){return y().subtle.generateKey({name:u.cipher.algorithm,length:u.cipher.key_length},e,["encrypt","decrypt"])}async function re(e){if(!e)return $e();if(typeof CryptoKey<"u"&&e instanceof CryptoKey)return e;return y().subtle.importKey("raw",e,{name:u.cipher.algorithm},!1,["encrypt","decrypt"])}async function qe(e,t){let r=y(),s=await re(t),n=r.getRandomValues(new Uint8Array(u.cipher.iv_bytes)),a=new Uint8Array(await r.subtle.encrypt({name:u.cipher.algorithm,iv:n},s,Y(e))),o=new Uint8Array(n.length+a.length);return o.set(n,0),o.set(a,n.length),I(o)}async function Pe(e,t){let r=typeof e==="string"?B(e):e,s=r.slice(0,u.cipher.iv_bytes),n=r.slice(u.cipher.iv_bytes),a=await re(t),o=await y().subtle.decrypt({name:u.cipher.algorithm,iv:s},a,n);return Ie.decode(o)}var Me="sandbox_cipher",L="keys",ee="device",U=null;function $e(){if(!U)U=Fe().catch((e)=>{throw U=null,new w(`Unable to obtain the device key: ${e.message}`)});return U}async function Fe(){if(typeof indexedDB>"u")return J(!1);let e=await He(),t=await ze(e,ee);if(t)return t;let r=await J(!1);return await Xe(e,ee,r),r}function He(){return new Promise((e,t)=>{let r=indexedDB.open(Me,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(L))r.result.createObjectStore(L)},r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error||Error("IndexedDB open failed."))})}function ze(e,t){return new Promise((r,s)=>{let n=e.transaction(L,"readonly").objectStore(L).get(t);n.onsuccess=()=>r(n.result||null),n.onerror=()=>s(n.error)})}function Xe(e,t,r){return new Promise((s,n)=>{let a=e.transaction(L,"readwrite");a.objectStore(L).put(r,t),a.oncomplete=()=>s(),a.onerror=()=>n(a.error)})}class se{constructor(e){this.worker=e,this.sequence=0,this.pending=new Map,this.worker.addEventListener("message",(t)=>{let{id:r,ok:s,result:n,error:a}=t.data||{},o=this.pending.get(r);if(!o)return;if(this.pending.delete(r),s)o.resolve(n);else o.reject(new w(a||"Cipher operation failed."))}),this.worker.addEventListener("error",(t)=>{let r=new w(`Cipher worker failure: ${t.message||"unknown error"}`);for(let s of this.pending.values())s.reject(r);this.pending.clear()})}request(e,t){this.sequence+=1;let r=this.sequence;return new Promise((s,n)=>{this.pending.set(r,{resolve:s,reject:n}),this.worker.postMessage({id:r,action:e,payload:t})})}}var D=null;function Be(){if(typeof window>"u"||typeof Worker>"u")return null;if(!D)try{D=new se(new Worker(new URL(Ne,import.meta.url),{type:"module"}))}catch(e){console.warn("[Cipher] Falling back to main-thread cryptography:",e.message),D=null}return D}function q(e,t,r){let s=Be();return s?s.request(e,t):r()}function P(e,t={}){return q("hash",{password:e,options:t},()=>Oe(e,t))}function ne(e,t){return q("verify",{password:e,encoded:t},()=>Ce(e,t))}function oe(e,t){return q("encrypt",{plaintext:e,key:t},()=>qe(e,t))}function ae(e,t){return q("decrypt",{payload:e,key:t},()=>Pe(e,t))}function K(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();let e=globalThis.crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t=[...e].map((r)=>r.toString(16).padStart(2,"0")).join("");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function M(e=32){return te(globalThis.crypto.getRandomValues(new Uint8Array(e)))}class f extends m{constructor(e,t={}){super(e,{code:"AUTHENTICATION_ERROR",http_status:401,...t})}}class g extends m{constructor(e,t={}){super(e,{code:"VALIDATION_ERROR",http_status:400,...t})}}function F(e={}){let t=e,r=new Set;function s(){return t}function n(i){t=typeof i==="function"?i(t):i;for(let c of r)c(t);return t}function a(i){return n({...t,...i})}function o(i){return r.add(i),i(t),()=>r.delete(i)}return{get:s,set:n,patch:a,subscribe:o}}var p=F({ready:!1,authenticated:!1,user:null,session:null,error:null});class ie{constructor(){this.worker=null,this.message_id=0,this.pending=new Map,this.status={ready:!1,vfs:"uninitialized",detail:null,version:null,error:null},this.subscribers=new Set}subscribe(e){return this.subscribers.add(e),e(this.status),()=>this.subscribers.delete(e)}notify(){for(let e of this.subscribers)e(this.status)}init(){if(this.worker)return Promise.resolve(this.status);if(typeof window<"u"&&window.location?.protocol==="file:")return console.warn("[Database]",'Module Web Workers and OPFS require HTTP/HTTPS and cannot run under file://. Please serve via "bun run dev".'),this.status.error='Module Web Workers and OPFS require HTTP/HTTPS and cannot run under file://. Please serve via "bun run dev".',this.notify(),Promise.reject(Error('Module Web Workers and OPFS require HTTP/HTTPS and cannot run under file://. Please serve via "bun run dev".'));return new Promise((e,t)=>{try{let r=new URL("./sqlite.worker.js",import.meta.url);this.worker=new Worker(r,{type:"module"}),this.worker.onmessage=(s)=>{let{id:n,type:a,error:o,...i}=s.data,c=this.pending.get(n);if(!c)return;if(this.pending.delete(n),a==="error"||o)c.reject(Error(o||"Worker error"));else c.resolve(i)},this.worker.onerror=(s)=>{let n=s.message||(s.filename?`${s.message||"Script error"} in ${s.filename}:${s.lineno}`:"Worker thread failed to load (check network/CORS/path)");console.error("[Database] Worker error:",n,s),this.status.error=n,this.notify()},this.send("init").then((s)=>{if(s.success)this.status.ready=!0,this.status.vfs=s.vfs,this.status.detail=s.detail||null,this.status.version=s.version,this.status.error=null;else this.status.error=s.error;this.notify(),e(this.status)}).catch((s)=>{this.status.error=s.message,this.notify(),t(s)})}catch(r){this.status.error=r.message,this.notify(),t(r)}})}send(e,t={}){if(!this.worker)return Promise.reject(Error("Database worker is not instantiated."));let r=++this.message_id;return new Promise((s,n)=>{this.pending.set(r,{resolve:s,reject:n}),this.worker.postMessage({id:r,type:e,...t})})}query(e,t=[]){return this.send("query",{sql:e,params:t}).then((r)=>r.rows)}exec(e,t=[]){return this.send("exec",{sql:e,params:t})}write(e){return this.send("write",e)}}var T=new ie;var We=Object.freeze([{version:1,name:"initial_schema",statements:[`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE
          CHECK (username GLOB '[A-Za-z]*' AND username NOT GLOB '*[^A-Za-z]*'),
        password TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        authenticated_at TEXT,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );`,`CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        revoked_at TEXT,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );`,`CREATE TABLE IF NOT EXISTS recoveries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        code TEXT NOT NULL,
        used_at TEXT,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );`,`CREATE TABLE IF NOT EXISTS synchronization (
        id TEXT PRIMARY KEY,
        operation TEXT NOT NULL,
        user_id TEXT,
        user_agent TEXT,
        machine TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      );`,"CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);","CREATE INDEX IF NOT EXISTS idx_recoveries_user_id ON recoveries (user_id);","CREATE INDEX IF NOT EXISTS idx_synchronization_user_id ON synchronization (user_id);"]},{version:2,name:"one_session_per_user",statements:["DROP TABLE IF EXISTS sessions;",`CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        revoked_at TEXT,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
      );`,"CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_token ON sessions (token);"]},{version:3,name:"rename_synchronization_table",statements:["ALTER TABLE synchronization RENAME TO synchronizations;","DROP INDEX IF EXISTS idx_synchronization_user_id;","CREATE INDEX IF NOT EXISTS idx_synchronizations_user_id ON synchronizations (user_id);"]}]);async function ce(e){let t=await e.query("PRAGMA user_version;"),r=t&&t.length?Number(t[0].user_version):0;for(let s of We){if(s.version<=r)continue;for(let n of s.statements)await e.exec(n);await e.exec(`PRAGMA user_version = ${s.version};`)}return r}function de(e){return e&&e.length?e[0]:null}function ue(e){return{async find_by_id(t){return de(await e.query("SELECT * FROM users WHERE id = ? LIMIT 1;",[t]))},async find_by_username(t){return de(await e.query("SELECT * FROM users WHERE username = ? LIMIT 1;",[t]))},async count(){let t=await e.query("SELECT COUNT(*) AS total FROM users;");return t&&t.length?Number(t[0].total):0},async list(t={}){let r=t.limit??50;return e.query("SELECT id, username, is_active, authenticated_at, updated_at, created_at FROM users ORDER BY created_at DESC LIMIT ?;",[r])},async insert({id:t,username:r,password:s,created_at:n},a){let o=n||new Date().toISOString(),i="INSERT INTO users (id, username, password, updated_at, created_at) VALUES (?, ?, ?, ?, ?);";await e.write({sql:"INSERT INTO users (id, username, password, updated_at, created_at) VALUES (?, ?, ?, ?, ?);",params:[t,r,s,o,o],context:a})},async update(t,r,s){let n=Object.keys(r);if(n.length===0)return;let o=`UPDATE users SET ${n.map((c)=>`${c} = ?`).join(", ")}, updated_at = ? WHERE id = ?;`,i=[...n.map((c)=>r[c]),new Date().toISOString(),t];await e.write({sql:o,params:i,context:s})}}}function le(e){return e&&e.length?e[0]:null}function pe(e){return{async find_by_id(t){return le(await e.query("SELECT * FROM sessions WHERE id = ? LIMIT 1;",[t]))},async find_by_token(t){return le(await e.query("SELECT * FROM sessions WHERE token = ? LIMIT 1;",[t]))},async list(t={}){let r=t.limit??50;return e.query("SELECT * FROM sessions ORDER BY created_at DESC LIMIT ?;",[r])},async upsert({user_id:t,token:r,expires_at:s,created_at:n},a){let o=n||new Date().toISOString(),i=`INSERT INTO sessions (id, token, expires_at, revoked_at, updated_at, created_at)
        VALUES (?, ?, ?, NULL, ?, ?)
        ON CONFLICT (id) DO UPDATE SET
          token = excluded.token,
          expires_at = excluded.expires_at,
          revoked_at = NULL,
          updated_at = excluded.updated_at,
          created_at = excluded.created_at;`;await e.write({sql:`INSERT INTO sessions (id, token, expires_at, revoked_at, updated_at, created_at)
        VALUES (?, ?, ?, NULL, ?, ?)
        ON CONFLICT (id) DO UPDATE SET
          token = excluded.token,
          expires_at = excluded.expires_at,
          revoked_at = NULL,
          updated_at = excluded.updated_at,
          created_at = excluded.created_at;`,params:[t,r,s,o,o],context:a})},async revoke(t,r){let s=new Date().toISOString(),n="UPDATE sessions SET revoked_at = ?, updated_at = ? WHERE id = ?;";await e.write({sql:"UPDATE sessions SET revoked_at = ?, updated_at = ? WHERE id = ?;",params:[s,s,t],context:r})}}}function Ye(e){return e&&e.length?e[0]:null}function _e(e){return{async find_active_by_user(t){return Ye(await e.query("SELECT * FROM recoveries WHERE user_id = ? AND used_at IS NULL ORDER BY created_at DESC LIMIT 1;",[t]))},async insert({id:t,user_id:r,code:s,created_at:n},a){let o=n||new Date().toISOString(),i="INSERT INTO recoveries (id, user_id, code, updated_at, created_at) VALUES (?, ?, ?, ?, ?);";await e.write({sql:"INSERT INTO recoveries (id, user_id, code, updated_at, created_at) VALUES (?, ?, ?, ?, ?);",params:[t,r,s,o,o],context:a})},async consume(t,r){let s=new Date().toISOString(),n="UPDATE recoveries SET used_at = ?, updated_at = ? WHERE id = ?;";await e.write({sql:"UPDATE recoveries SET used_at = ?, updated_at = ? WHERE id = ?;",params:[s,s,t],context:r})},async delete_for_user(t,r){await e.write({sql:"DELETE FROM recoveries WHERE user_id = ?;",params:[t],context:r})}}}function he(e){return{async list(t={}){let r=t.limit??50;if(t.user_id)return e.query("SELECT * FROM synchronizations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?;",[t.user_id,r]);return e.query("SELECT * FROM synchronizations ORDER BY created_at DESC LIMIT ?;",[r])},async count(){let t=await e.query("SELECT COUNT(*) AS total FROM synchronizations;");return t&&t.length?Number(t[0].total):0}}}var S=F({ready:!1,vfs:"uninitialized",detail:null,version:null,error:null});class j extends m{constructor(e,t={}){super(e,{code:"DATABASE_ERROR",http_status:500,...t})}}function x(e=null){return{user_id:e,user_agent:typeof navigator<"u"?navigator.userAgent:"unknown",machine:Ke()}}function Ke(){if(typeof navigator>"u")return"unknown";if(navigator.userAgentData?.platform)return navigator.userAgentData.platform;let e=/\(([^)]+)\)/.exec(navigator.userAgent||"");return e?e[1]:"unknown"}class me{constructor(){let e={query:(t,r=[])=>T.query(t,r),exec:(t,r=[])=>T.exec(t,r),write:(t)=>T.write(t)};this.client=e,this.users=ue(e),this.sessions=pe(e),this.recoveries=_e(e),this.synchronizations=he(e),this.unsubscribe_state=T.subscribe((t)=>S.set({...t}))}async init(){if(S.get().ready)return S.get();try{await T.init();let e=T.status;if(S.set({...e}),!e.ready)throw new j(e.error||"The database failed to initialize.");return await ce(this.client),S.get()}catch(e){throw S.patch({error:e.message}),e}}}var d=new me;function je(){let e=u.app.url_base_path||"/";return e==="/"?"/":`${e}/`}function V(e,t,r={}){if(typeof document>"u")return;let s=r.max_age,n=r.path??je(),a=r.same_site??"Strict",o=r.secure??(typeof location<"u"&&location.protocol==="https:"),i=`${encodeURIComponent(e)}=${encodeURIComponent(t)}; Path=${n}; SameSite=${a}`;if(typeof s==="number")i+=`; Max-Age=${Math.floor(s/1000)}`;if(o)i+="; Secure";document.cookie=i}function fe(e){if(typeof document>"u"||!document.cookie)return null;let t=`${encodeURIComponent(e)}=`;for(let r of document.cookie.split("; "))if(r.startsWith(t))return decodeURIComponent(r.slice(t.length));return null}function A(e,t={}){V(e,"",{...t,max_age:0})}var v=u.session.cookie_name,k={async create(e,t){let r=M(),s=await R(r),n=new Date().toISOString(),a=new Date(Date.now()+u.session.ttl_ms).toISOString();await d.sessions.upsert({user_id:e,token:s,expires_at:a,created_at:n},t);let o=await oe(r);return V(v,o,{max_age:u.session.ttl_ms}),{id:e,token:s,expires_at:a,created_at:n}},async resolve(){let e=fe(v);if(!e)return null;let t;try{t=await ae(e)}catch{return A(v),null}let r=await R(t),s=await d.sessions.find_by_token(r);if(!s||s.revoked_at||new Date(s.expires_at).getTime()<=Date.now())return A(v),null;let n=await d.users.find_by_id(s.id);if(!n||!n.is_active)return A(v),null;return{session:s,user:n}},async revoke(e,t){await d.sessions.revoke(e,t),A(v)},async revoke_all(e,t){await d.sessions.revoke(e,t),A(v)},clear(){A(v)}};var Ve=new RegExp(u.validation.username_pattern);function be(e){let t=String(e||"").trim(),{username_min_length:r,username_max_length:s}=u.validation;if(t.length<r||t.length>s)throw new g(`Username must be between ${r} and ${s} characters.`);if(!Ve.test(t))throw new g("Username may only contain letters (a-z, A-Z).");return t}function G(e){let t=String(e||"");if(t.length<u.validation.password_min_length)throw new g(`Password must be at least ${u.validation.password_min_length} characters.`);return t}function Z(e,t){p.set({ready:!0,authenticated:!0,user:e,session:t,error:null})}function O(e=null){p.set({ready:!0,authenticated:!1,user:null,session:null,error:e})}async function we(e,t){let r=M(24),s=await R(r);return await d.recoveries.insert({id:K(),user_id:e,code:s},t),r}var _={async bootstrap(){try{let e=await k.resolve();if(e)Z(e.user,e.session);else O()}catch(e){O(e.message)}return p.get()},async register(e){let t=be(e?.username),r=G(e?.password);if(await d.users.find_by_username(t))throw new g("That username is already taken.");let n=K(),a=await P(r),o=x(n);await d.users.insert({id:n,username:t,password:a},o);let i=await we(n,o),c=await k.create(n,o),l=await d.users.find_by_id(n);return Z(l,c),{user:l,recovery_code:i}},async login(e){let t=String(e?.username||"").trim(),r=await d.users.find_by_username(t);if(!r||!r.is_active)throw new f("Invalid username or password.");if(!await ne(String(e?.password||""),r.password))throw new f("Invalid username or password.");let n=x(r.id);await d.users.update(r.id,{authenticated_at:new Date().toISOString()},n);let a=await k.create(r.id,n),o=await d.users.find_by_id(r.id);return Z(o,a),o},async logout(){let{user:e,session:t}=p.get();if(t)await k.revoke(t.id,x(e?e.id:null));O()},async recover(e){let t=String(e?.username||"").trim(),r=G(e?.password),s=await d.users.find_by_username(t);if(!s||!s.is_active)throw new f("Invalid username or recovery code.");let n=await d.recoveries.find_active_by_user(s.id);if(!n)throw new f("No active recovery code is available for this account.");if(await R(String(e?.recovery_code||"").trim())!==n.code)throw new f("Invalid username or recovery code.");let o=x(s.id);await d.users.update(s.id,{password:await P(r)},o),await d.recoveries.consume(n.id,o),await d.sessions.revoke(s.id,o),k.clear();let i=await we(s.id,o);return O(),{recovery_code:i}},async update_profile(e){let t=p.get().user;if(!t)throw new f("You must be signed in to update your profile.");let r={};if(e?.username!==void 0){let n=be(e.username);if(n!==t.username){let a=await d.users.find_by_username(n);if(a&&a.id!==t.id)throw new g("That username is already taken.");r.username=n}}if(e?.password)r.password=await P(G(e.password));if(Object.keys(r).length===0)throw new g("No profile changes were provided.");await d.users.update(t.id,r,x(t.id));let s=await d.users.find_by_id(t.id);return p.patch({user:s}),s},async delete_profile(){let e=p.get().user;if(!e)throw new f("You must be signed in to delete your profile.");let t=x(e.id);await d.users.update(e.id,{is_active:0},t),await d.sessions.revoke(e.id,t),k.clear(),O()}};function ye(){let e=document.createElement("main");return e.className="home-view",e.innerHTML=`
    <section class="hero-card">
      <h1 class="hero-card__title">About Sandbox</h1>
      <p class="hero-card__subtitle">
        Architecture, technology stack, and engineering philosophy behind this application.
      </p>
    </section>

    <section class="db-panel">
      <h2>Architecture Overview</h2>
      <ul class="about-list">
        <li><strong>SQLite WASM + OPFS:</strong> Persistent relational database running client-side with native file system access.</li>
        <li><strong>Dedicated Web Workers:</strong> Database and cryptography run off the main thread so the UI never blocks.</li>
        <li><strong>Local Authentication:</strong> PBKDF2-SHA256 password hashing and cookie-backed sessions, all client-side.</li>
        <li><strong>Bun Toolchain:</strong> Ultra-fast bundler, test runner, and development environment.</li>
        <li><strong>Automated CI/CD:</strong> Seamless GitHub Pages deployment via GitHub Actions.</li>
      </ul>
      <a href="./" class="db-button" style="display:inline-block; text-decoration:none; margin-top:1rem;">Back to Home</a>
    </section>
  `,e}function ge(){let e=document.createElement("main");e.className="home-view";let{user:t,session:r}=p.get();e.innerHTML=`
    <section class="hero-card">
      <h1 class="hero-card__title">Welcome, <span id="dashboard_username"></span></h1>
      <p class="hero-card__subtitle">Your local profile, active session and database contents.</p>
    </section>

    <section class="db-panel">
      <div class="db-panel__header">
        <h2>Account</h2>
        <span id="dashboard_status" class="db-status-badge db-status-badge--loading">Loading...</span>
      </div>
      <dl class="info-list" id="dashboard_info"></dl>
      <div class="dashboard-actions">
        <a href="./profile/edit" class="db-button">Edit Profile</a>
      </div>
    </section>

    <section class="db-panel">
      <h2>Users</h2>
      <div class="table-scroll">
        <table class="db-table">
          <thead>
            <tr>
              <th>ID</th><th>Username</th><th>Active</th><th>Authenticated</th><th>Updated</th><th>Created</th>
            </tr>
          </thead>
          <tbody id="dashboard_users"></tbody>
        </table>
      </div>
    </section>

    <section class="db-panel">
      <h2>Sessions</h2>
      <div class="table-scroll">
        <table class="db-table">
          <thead>
            <tr>
              <th>ID</th><th>Token</th><th>Expires</th><th>Revoked</th><th>Updated</th><th>Created</th>
            </tr>
          </thead>
          <tbody id="dashboard_sessions"></tbody>
        </table>
      </div>
    </section>

    <section class="db-panel">
      <h2>Synchronization</h2>
      <div class="table-scroll">
        <table class="db-table">
          <thead>
            <tr>
              <th>Operation</th><th>User Agent</th><th>Machine</th><th>Created</th>
            </tr>
          </thead>
          <tbody id="dashboard_synchronizations"></tbody>
        </table>
      </div>
    </section>
  `,e.querySelector("#dashboard_username").textContent=t?.username||"unknown";let s=e.querySelector("#dashboard_info"),n=[["Username",t?.username||"—"],["Status",t?.is_active?"Active":"Inactive"],["Created",h(t?.created_at)],["Last authenticated",h(t?.authenticated_at)],["Session expires",h(r?.expires_at)]];for(let[o,i]of n){let c=document.createElement("dt");c.textContent=o;let l=document.createElement("dd");l.textContent=i,s.append(c,l)}let a=[{body:e.querySelector("#dashboard_users"),load:()=>d.users.list(),columns:[{key:"id"},{key:"username"},{key:"is_active",format:(o)=>o?"Active":"Inactive"},{key:"authenticated_at",format:h},{key:"updated_at",format:h},{key:"created_at",format:h}]},{body:e.querySelector("#dashboard_sessions"),load:()=>d.sessions.list(),columns:[{key:"id"},{key:"token"},{key:"expires_at",format:h},{key:"revoked_at",format:h},{key:"updated_at",format:h},{key:"created_at",format:h}]},{body:e.querySelector("#dashboard_synchronizations"),load:()=>d.synchronizations.list(),columns:[{key:"operation"},{key:"user_agent"},{key:"machine"},{key:"created_at",format:h}]}];return Ge(a,e.querySelector("#dashboard_status")),e}async function Ge(e,t){let r=await Promise.allSettled(e.map((n)=>n.load()));r.forEach((n,a)=>{let o=e[a];if(n.status==="fulfilled")Ze(o.body,n.value,o.columns);else ve(o.body,o.columns.length,n.reason?.message||"Unable to load records.")});let s=r.some((n)=>n.status==="rejected");t.className=s?"db-status-badge db-status-badge--error":"db-status-badge db-status-badge--ready",t.textContent=s?"Partial":"Ready"}function Ze(e,t,r){if(!t||t.length===0){ve(e,r.length,"No records yet.");return}let s=document.createDocumentFragment();for(let n of t){let a=document.createElement("tr");for(let o of r){let i=document.createElement("td"),c=n[o.key],l=o.format?o.format(c):c;i.textContent=l===null||l===void 0||l===""?"—":String(l),a.appendChild(i)}s.appendChild(a)}e.replaceChildren(s)}function ve(e,t,r){let s=document.createElement("tr"),n=document.createElement("td");n.colSpan=t,n.className="table-empty",n.textContent=r,s.appendChild(n),e.replaceChildren(s)}function h(e){if(!e)return"—";let t=new Date(e);return Number.isNaN(t.getTime())?String(e):t.toLocaleString()}function Ee(){let e=document.createElement("main");e.className="home-view";let t=p.get().authenticated;e.innerHTML=`
    <section class="hero-card">
      <h1 class="hero-card__title">Sandbox SPA</h1>
      <p class="hero-card__subtitle">
        A client-only single-page application with local SQLite WASM persistence, a hardened
        authentication flow and a modular service architecture. Everything runs in your browser.
      </p>
    </section>

    <section class="db-panel landing-actions">
      <h2>Get Started</h2>
      <p class="landing-actions__lead">
        ${t?"Open your dashboard to review your profile and recent activity.":"Create a local account to manage your profile and review your synchronization history."}
      </p>
      <div class="landing-actions__buttons"></div>
    </section>
  `;let r=e.querySelector(".landing-actions__buttons"),s=t?[["./dashboard","Go to Dashboard","db-button"],["./profile/edit","Edit Profile","db-button db-button--ghost"]]:[["./register","Create Account","db-button"],["./login","Sign In","db-button db-button--ghost"]];for(let[n,a,o]of s){let i=document.createElement("a");i.href=n,i.className=o,i.textContent=a,r.appendChild(i)}return e}function Te(){let e=document.createElement("main");e.className="auth-view",e.innerHTML=`
    <section class="auth-card">
      <h1 class="auth-card__title">Sign In</h1>
      <p class="auth-card__subtitle">Welcome back. Sign in to manage your profile.</p>
      <form id="login_form" class="auth-form" novalidate>
        <label class="form-field">
          <span class="form-label">Username</span>
          <input id="login_username" class="db-input" type="text" autocomplete="username" required />
        </label>
        <label class="form-field">
          <span class="form-label">Password</span>
          <input id="login_password" class="db-input" type="password" autocomplete="current-password" required />
        </label>
        <p id="login_error" class="form-error" hidden></p>
        <div class="form-actions">
          <button type="submit" id="login_submit" class="db-button">Sign In</button>
        </div>
      </form>
      <p class="auth-links">
        <a href="./register">Create an account</a>
        <a href="./recover">Forgot password?</a>
      </p>
    </section>
  `;let t=e.querySelector("#login_form"),r=e.querySelector("#login_username"),s=e.querySelector("#login_password"),n=e.querySelector("#login_submit"),a=e.querySelector("#login_error");return t.addEventListener("submit",async(o)=>{o.preventDefault(),a.hidden=!0,n.disabled=!0;try{await _.login({username:r.value,password:s.value}),b("/dashboard")}catch(i){a.textContent=i.message,a.hidden=!1}finally{n.disabled=!1}}),e}function Se(e={}){let t=document.createElement("div");t.className="not-found-view";let r=e.path||"Unknown";return t.innerHTML=`
    <div class="not-found-view__code">404</div>
    <h1 class="not-found-view__title">Route Not Found</h1>
    <p class="not-found-view__message">
      The requested path <code>${Qe(r)}</code> was not found.
    </p>
    <a href="./" class="not-found-view__btn">Return Home</a>
  `,t}function Qe(e){return String(e).replace(/[&<>'"]/g,(t)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]||t)}function xe(){let e=document.createElement("main");e.className="home-view";let t=p.get().user;e.innerHTML=`
    <section class="hero-card">
      <h1 class="hero-card__title">Edit Profile</h1>
      <p class="hero-card__subtitle">Update your username or set a new password.</p>
    </section>

    <section class="db-panel">
      <form id="profile_form" class="auth-form" novalidate>
        <label class="form-field">
          <span class="form-label">Username</span>
          <input id="profile_username" class="db-input" type="text" autocomplete="username" required />
        </label>
        <label class="form-field">
          <span class="form-label">New password (optional)</span>
          <input id="profile_password" class="db-input" type="password" autocomplete="new-password" />
        </label>
        <label class="form-field">
          <span class="form-label">Confirm new password</span>
          <input id="profile_confirm" class="db-input" type="password" autocomplete="new-password" />
        </label>
        <p id="profile_error" class="form-error" hidden></p>
        <p id="profile_notice" class="form-notice" hidden></p>
        <div class="form-actions">
          <button type="submit" id="profile_submit" class="db-button">Save Changes</button>
          <a href="./dashboard" class="db-button db-button--ghost">Back to Dashboard</a>
        </div>
      </form>
    </section>

    <section class="db-panel danger-zone">
      <h2>Danger Zone</h2>
      <p>Deactivating your profile revokes every session and signs you out. Your username is retained and cannot be reused.</p>
      <button type="button" id="profile_delete" class="db-button db-button--danger">Delete Profile</button>
    </section>
  `;let r=e.querySelector("#profile_form"),s=e.querySelector("#profile_username"),n=e.querySelector("#profile_password"),a=e.querySelector("#profile_confirm"),o=e.querySelector("#profile_submit"),i=e.querySelector("#profile_error"),c=e.querySelector("#profile_notice"),l=e.querySelector("#profile_delete");return s.value=t?.username||"",r.addEventListener("submit",async(E)=>{if(E.preventDefault(),i.hidden=!0,c.hidden=!0,n.value&&n.value!==a.value){i.textContent="Passwords do not match.",i.hidden=!1;return}o.disabled=!0;try{let C={username:s.value};if(n.value)C.password=n.value;await _.update_profile(C),n.value="",a.value="",c.textContent="Profile updated.",c.hidden=!1}catch(C){i.textContent=C.message,i.hidden=!1}finally{o.disabled=!1}}),l.addEventListener("click",async()=>{if(!window.confirm("Delete your profile? This signs you out and cannot be undone."))return;l.disabled=!0;try{await _.delete_profile(),b("/")}catch(E){i.textContent=E.message,i.hidden=!1,l.disabled=!1}}),e}function H(e,t={}){let r=document.createElement("section");if(r.className="recovery-card",r.innerHTML=`
    <h2 class="recovery-card__title"></h2>
    <p class="recovery-card__hint"></p>
    <div class="recovery-code" role="textbox" aria-readonly="true"></div>
    <div class="form-actions"></div>
  `,r.querySelector(".recovery-card__title").textContent=t.title||"Your recovery code",r.querySelector(".recovery-card__hint").textContent=t.hint||"Store this code somewhere safe. It is shown only once and is required to recover your account.",r.querySelector(".recovery-code").textContent=e,typeof t.on_continue==="function"){let s=document.createElement("button");s.type="button",s.className="db-button",s.textContent=t.continue_label||"Continue",s.addEventListener("click",t.on_continue),r.querySelector(".form-actions").appendChild(s)}return r}function Ae(){let e=document.createElement("main");e.className="auth-view";let t=document.createElement("section");t.className="auth-card",t.innerHTML=`
    <h1 class="auth-card__title">Recover Account</h1>
    <p class="auth-card__subtitle">Enter your username, recovery code and a new password.</p>
    <form id="recover_form" class="auth-form" novalidate>
      <label class="form-field">
        <span class="form-label">Username</span>
        <input id="recover_username" class="db-input" type="text" autocomplete="username" required />
      </label>
      <label class="form-field">
        <span class="form-label">Recovery code</span>
        <input id="recover_code" class="db-input" type="text" autocomplete="off" spellcheck="false" required />
      </label>
      <label class="form-field">
        <span class="form-label">New password</span>
        <input id="recover_password" class="db-input" type="password" autocomplete="new-password" required />
      </label>
      <label class="form-field">
        <span class="form-label">Confirm new password</span>
        <input id="recover_confirm" class="db-input" type="password" autocomplete="new-password" required />
      </label>
      <p id="recover_error" class="form-error" hidden></p>
      <div class="form-actions">
        <button type="submit" id="recover_submit" class="db-button">Recover Account</button>
      </div>
    </form>
    <p class="auth-links"><a href="./login">Back to sign in</a></p>
  `,e.appendChild(t);let r=t.querySelector("#recover_form"),s=t.querySelector("#recover_username"),n=t.querySelector("#recover_code"),a=t.querySelector("#recover_password"),o=t.querySelector("#recover_confirm"),i=t.querySelector("#recover_submit"),c=t.querySelector("#recover_error");return r.addEventListener("submit",async(l)=>{if(l.preventDefault(),c.hidden=!0,a.value!==o.value){c.textContent="Passwords do not match.",c.hidden=!1;return}i.disabled=!0;try{let{recovery_code:E}=await _.recover({username:s.value,recovery_code:n.value,password:a.value});e.replaceChildren(H(E,{title:"Your new recovery code",hint:"All previous sessions were revoked. Save this new one-time code — it replaces the code you just used.",continue_label:"Go to Sign In",on_continue:()=>b("/login")}))}catch(E){c.textContent=E.message,c.hidden=!1,i.disabled=!1}}),e}function ke(){let e=document.createElement("main");e.className="auth-view";let t=document.createElement("section");t.className="auth-card",t.innerHTML=`
    <h1 class="auth-card__title">Create Account</h1>
    <p class="auth-card__subtitle">Usernames contain letters only. Passwords must be at least 8 characters.</p>
    <form id="register_form" class="auth-form" novalidate>
      <label class="form-field">
        <span class="form-label">Username</span>
        <input id="register_username" class="db-input" type="text" autocomplete="username" required />
      </label>
      <label class="form-field">
        <span class="form-label">Password</span>
        <input id="register_password" class="db-input" type="password" autocomplete="new-password" required />
      </label>
      <label class="form-field">
        <span class="form-label">Confirm password</span>
        <input id="register_confirm" class="db-input" type="password" autocomplete="new-password" required />
      </label>
      <p id="register_error" class="form-error" hidden></p>
      <div class="form-actions">
        <button type="submit" id="register_submit" class="db-button">Create Account</button>
      </div>
    </form>
    <p class="auth-links"><a href="./login">Already have an account?</a></p>
  `,e.appendChild(t);let r=t.querySelector("#register_form"),s=t.querySelector("#register_username"),n=t.querySelector("#register_password"),a=t.querySelector("#register_confirm"),o=t.querySelector("#register_submit"),i=t.querySelector("#register_error");return r.addEventListener("submit",async(c)=>{if(c.preventDefault(),i.hidden=!0,n.value!==a.value){i.textContent="Passwords do not match.",i.hidden=!1;return}o.disabled=!0;try{let{recovery_code:l}=await _.register({username:s.value,password:n.value});e.replaceChildren(H(l,{title:"Save your recovery code",hint:"This one-time code is the only way to recover your account. Store it somewhere safe — it will not be shown again.",continue_label:"Continue to Dashboard",on_continue:()=>b("/dashboard")}))}catch(l){i.textContent=l.message,i.hidden=!1,o.disabled=!1}}),e}var Je=Object.freeze({"/login":"guest","/register":"guest","/recover":"guest","/dashboard":"authenticated","/profile/edit":"authenticated"});class Re{constructor(){this.root=null,this.header_container=null,this.view_container=null,this.router=null}async init(){if(this.root=document.querySelector("#app"),this.header_container=document.querySelector("#header_slot"),this.view_container=document.querySelector("#view_slot"),!this.root||!this.header_container||!this.view_container)throw Error("Application shell (#app / #header_slot / #view_slot) is missing from index.html.");this.router=new z({},Se),this.router.register("/",Ee).register("/about",ye).register("/login",Te).register("/register",ke).register("/recover",Ae).register("/dashboard",ge).register("/profile/edit",xe),this.router.subscribe((e)=>this.render_route(e)),document.addEventListener("click",(e)=>this.handle_click(e)),document.addEventListener(X,(e)=>this.router.navigate(e.detail.path)),p.subscribe(()=>this.render_header_slot(this.router.current_path||"/"));try{await d.init()}catch(e){console.warn("[Engine] Database initialization failed:",e.message)}await _.bootstrap(),this.router.start()}handle_click(e){if(e.defaultPrevented||e.button!==0)return;let t=e.target.closest("a");if(!t||t.target||t.hasAttribute("download"))return;let r=new URL(t.href,window.location.href);if(r.origin!==window.location.origin)return;if(this.router.base_path!=="/"&&!r.pathname.startsWith(`${this.router.base_path}/`)&&r.pathname!==this.router.base_path)return;e.preventDefault(),this.router.navigate(this.router.strip_base(r.pathname))}async handle_logout(){try{await _.logout()}catch(e){console.warn("[Engine] Logout failed:",e.message)}this.router.navigate("/")}render_header_slot(e){let t=p.get();this.header_container.innerHTML="",this.header_container.appendChild(Q(e,{authenticated:t.authenticated,on_logout:()=>this.handle_logout()}))}render_route({path:e,view:t,is_fallback:r,state:s}){let n=Je[e],a=p.get().authenticated;if(n==="authenticated"&&!a){this.router.replace("/login");return}if(n==="guest"&&a){this.router.replace("/dashboard");return}this.render_header_slot(e),this.view_container.innerHTML="";let o=t({path:e,is_fallback:r,state:s});if(o instanceof HTMLElement)this.view_container.appendChild(o)}}async function Le(){try{await new Re().init()}catch(e){console.error("[Engine] Fatal bootstrap error:",e)}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",Le);else Le();
