/* VTLOsint_mod — OSINT toolkit (source: CyberSudo's OSINT Toolkit, 24.08.2024) */
(function(){
'use strict';
var CATS=window.OSINT_DATA, ABOUT=window.OSINT_ABOUT, ANDROID=window.Android||null;
var $=function(s,r){return (r||document).querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var LS={g:function(k,d){try{var v=localStorage.getItem('vtlo_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},s:function(k,v){try{localStorage.setItem('vtlo_'+k,JSON.stringify(v))}catch(e){}}};
var I={
 grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
 flask:'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L4.5 19a1.6 1.6 0 0 0 1.4 2.4h12.2a1.6 1.6 0 0 0 1.4-2.4L14 9V3"/><path d="M7.5 15h9"/></svg>',
 search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 star:'<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/></svg>',
 note:'<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
 cap:'<svg viewBox="0 0 24 24"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11.5V16c3 2.5 9 2.5 12 0v-4.5"/></svg>',
 home:'<svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M12 2.5 1.5 12H5v9h5v-6h4v6h5v-9h3.5z"/></svg>',
 lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
 sliders:'<svg viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>',
 power:'<svg viewBox="0 0 24 24"><path d="M12 3v9"/><path d="M6.3 6.8a8 8 0 1 0 11.4 0"/></svg>',
 ext:'<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
 copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
 go:'<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
 share:'<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/></svg>',
 menu:'<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19"/></svg>',
 back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>'
};
var GROUPS=[
 {t:'Identité & contacts',c:['email','phone','usernames','people','social','dating']},
 {t:'Web & domaines',c:['search','domain','docs','forums']},
 {t:'Images, vidéo & géo',c:['images','video','maps','vehicle']},
 {t:'Données & entreprises',c:['breach','companies','market']},
 {t:'Outils & divers',c:['others','resources']}
];
var byId={};CATS.forEach(function(c){byId[c.id]=c;c.all=[];c.sections.forEach(function(s){s.items.forEach(function(it){it._c=c.id;it._s=s.title;it._k=c.id+'|'+it.n+'|'+(it.u||it.t+it.n).slice(0,60);c.all.push(it)})})});
var ALL=[];CATS.forEach(function(c){c.all.forEach(function(i){if(i.t!=='dork')ALL.push(i)})});
var TOTAL=ALL.filter(function(i){return i.u}).length;
var favs=LS.g('favs',[]), notes=LS.g('notes',[]), recent=LS.g('recent',[]), cfg=LS.g('cfg',{mode:'inapp',priv:false});
var $view,$menu;

/* ------------ helpers ------------ */
function toast(m){var t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},1700)}
function copy(txt){try{if(ANDROID&&ANDROID.copy){ANDROID.copy(txt);toast('Copié');return}}catch(e){}
 if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){toast('Copié')},fb)}else fb();
 function fb(){var a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('Copié')}catch(e){toast('Copie impossible')}a.remove()}}
function openUrl(u,label){if(!u)return;if(!/^https?:\/\//i.test(u))u='https://'+u;
 if(!cfg.priv&&label){recent=recent.filter(function(r){return r.u!==u});recent.unshift({u:u,n:label});recent=recent.slice(0,12);LS.s('recent',recent)}
 if(ANDROID&&ANDROID.open){ANDROID.open(u,cfg.mode||'inapp')}else{window.open(u,'_blank','noopener')}}
var fcb={},fid=0;
window.__fetchCb=function(id,status,b64){var f=fcb[id];if(!f)return;delete fcb[id];var txt='';try{txt=decodeURIComponent(escape(atob(b64)))}catch(e){try{txt=atob(b64)}catch(e2){}}f(status,txt)};
function vfetch(url){return new Promise(function(res,rej){
 if(ANDROID&&ANDROID.fetch){var id=++fid;fcb[id]=function(st,txt){st>=200&&st<400?res(txt):rej(new Error('HTTP '+st))};ANDROID.fetch(url,id);setTimeout(function(){if(fcb[id]){delete fcb[id];rej(new Error('délai dépassé'))}},25000)}
 else{var ctl=('AbortController' in window)?new AbortController():null;var to=setTimeout(function(){ctl&&ctl.abort()},20000);
  fetch(url,{signal:ctl&&ctl.signal}).then(function(r){clearTimeout(to);if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}).then(res,function(e){rej(new Error('Bloqué par le navigateur (CORS) — utilisez l’APK ou ouvrez le lien'))})}})}
function vjson(url){return vfetch(url).then(function(t){return JSON.parse(t)})}
function isFav(k){return favs.indexOf(k)>-1}
function toggleFav(k){var i=favs.indexOf(k);i>-1?favs.splice(i,1):favs.unshift(k);LS.s('favs',favs)}
function freeCls(f){f=(f||'').toLowerCase();if(!f)return '';if(/^(yes|yes)$/.test(f))return 'yes';if(/part|trial/.test(f))return 'partial';if(/^no/.test(f))return 'no';return ''}
function freeLbl(c){return {yes:'Gratuit',partial:'Partiel',no:'Payant'}[c]||''}
function host(u){try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}}
/* md5 */
function md5(s){function L(x,c){return(x<<c)|(x>>>(32-c))}function A(x,y){var l=(x&0xFFFF)+(y&0xFFFF),m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xFFFF)}
 function C(q,a,b,x,s,t){return A(L(A(A(a,q),A(x,t)),s),b)}function F(a,b,c,d,x,s,t){return C((b&c)|((~b)&d),a,b,x,s,t)}function G(a,b,c,d,x,s,t){return C((b&d)|(c&(~d)),a,b,x,s,t)}function H(a,b,c,d,x,s,t){return C(b^c^d,a,b,x,s,t)}function J(a,b,c,d,x,s,t){return C(c^(b|(~d)),a,b,x,s,t)}
 s=unescape(encodeURIComponent(s));var n=s.length,w=[],i;for(i=0;i<n*8;i+=8)w[i>>5]|=(s.charCodeAt(i/8)&255)<<(i%32);w[n*8>>5]|=0x80<<(n*8%32);w[(((n*8+64)>>>9)<<4)+14]=n*8;
 var a=1732584193,b=-271733879,c=-1732584194,d=271733878;
 for(i=0;i<w.length;i+=16){var oa=a,ob=b,oc=c,od=d;
 a=F(a,b,c,d,w[i],7,-680876936);d=F(d,a,b,c,w[i+1],12,-389564586);c=F(c,d,a,b,w[i+2],17,606105819);b=F(b,c,d,a,w[i+3],22,-1044525330);a=F(a,b,c,d,w[i+4],7,-176418897);d=F(d,a,b,c,w[i+5],12,1200080426);c=F(c,d,a,b,w[i+6],17,-1473231341);b=F(b,c,d,a,w[i+7],22,-45705983);a=F(a,b,c,d,w[i+8],7,1770035416);d=F(d,a,b,c,w[i+9],12,-1958414417);c=F(c,d,a,b,w[i+10],17,-42063);b=F(b,c,d,a,w[i+11],22,-1990404162);a=F(a,b,c,d,w[i+12],7,1804603682);d=F(d,a,b,c,w[i+13],12,-40341101);c=F(c,d,a,b,w[i+14],17,-1502002290);b=F(b,c,d,a,w[i+15],22,1236535329);
 a=G(a,b,c,d,w[i+1],5,-165796510);d=G(d,a,b,c,w[i+6],9,-1069501632);c=G(c,d,a,b,w[i+11],14,643717713);b=G(b,c,d,a,w[i],20,-373897302);a=G(a,b,c,d,w[i+5],5,-701558691);d=G(d,a,b,c,w[i+10],9,38016083);c=G(c,d,a,b,w[i+15],14,-660478335);b=G(b,c,d,a,w[i+4],20,-405537848);a=G(a,b,c,d,w[i+9],5,568446438);d=G(d,a,b,c,w[i+14],9,-1019803690);c=G(c,d,a,b,w[i+3],14,-187363961);b=G(b,c,d,a,w[i+8],20,1163531501);a=G(a,b,c,d,w[i+13],5,-1444681467);d=G(d,a,b,c,w[i+2],9,-51403784);c=G(c,d,a,b,w[i+7],14,1735328473);b=G(b,c,d,a,w[i+12],20,-1926607734);
 a=H(a,b,c,d,w[i+5],4,-378558);d=H(d,a,b,c,w[i+8],11,-2022574463);c=H(c,d,a,b,w[i+11],16,1839030562);b=H(b,c,d,a,w[i+14],23,-35309556);a=H(a,b,c,d,w[i+1],4,-1530992060);d=H(d,a,b,c,w[i+4],11,1272893353);c=H(c,d,a,b,w[i+7],16,-155497632);b=H(b,c,d,a,w[i+10],23,-1094730640);a=H(a,b,c,d,w[i+13],4,681279174);d=H(d,a,b,c,w[i],11,-358537222);c=H(c,d,a,b,w[i+3],16,-722521979);b=H(b,c,d,a,w[i+6],23,76029189);a=H(a,b,c,d,w[i+9],4,-640364487);d=H(d,a,b,c,w[i+12],11,-421815835);c=H(c,d,a,b,w[i+15],16,530742520);b=H(b,c,d,a,w[i+2],23,-995338651);
 a=J(a,b,c,d,w[i],6,-198630844);d=J(d,a,b,c,w[i+7],10,1126891415);c=J(c,d,a,b,w[i+14],15,-1416354905);b=J(b,c,d,a,w[i+5],21,-57434055);a=J(a,b,c,d,w[i+12],6,1700485571);d=J(d,a,b,c,w[i+3],10,-1894986606);c=J(c,d,a,b,w[i+10],15,-1051523);b=J(b,c,d,a,w[i+1],21,-2054922799);a=J(a,b,c,d,w[i+8],6,1873313359);d=J(d,a,b,c,w[i+15],10,-30611744);c=J(c,d,a,b,w[i+6],15,-1560198380);b=J(b,c,d,a,w[i+13],21,1309151649);a=J(a,b,c,d,w[i+4],6,-145523070);d=J(d,a,b,c,w[i+11],10,-1120210379);c=J(c,d,a,b,w[i+2],15,718787259);b=J(b,c,d,a,w[i+9],21,-343485551);
 a=A(a,oa);b=A(b,ob);c=A(c,oc);d=A(d,od)}
 var o='';[a,b,c,d].forEach(function(v){for(var j=0;j<4;j++){o+=('0'+((v>>>(j*8))&255).toString(16)).slice(-2)}});return o}
window.__md5=md5;

/* ------------ per-site search templates (live search from a catalog item) ------------ */
var HOSTQ={'google.com':'https://www.google.com/search?q={q}','bing.com':'https://www.bing.com/search?q={q}','duckduckgo.com':'https://duckduckgo.com/?q={q}','yandex.com':'https://yandex.com/search/?text={q}','baidu.com':'https://www.baidu.com/s?wd={q}','qwant.com':'https://www.qwant.com/?q={q}','shodan.io':'https://www.shodan.io/search?query={q}','intelx.io':'https://intelx.io/?s={q}','reddit.com':'https://www.reddit.com/search/?q={q}','ebay.com':'https://www.ebay.com/sch/i.html?_nkw={q}','opencorporates.com':'https://opencorporates.com/companies?q={q}','haveibeenpwned.com':'https://haveibeenpwned.com/account/{q}','scribd.com':'https://www.scribd.com/search?query={q}','wolframalpha.com':'https://www.wolframalpha.com/input?i={q}','github.com':'https://github.com/search?q={q}','openstreetmap.org':'https://www.openstreetmap.org/search?query={q}','ahmia.fi':'https://ahmia.fi/search/?q={q}','archive.org':'https://archive.org/search?query={q}','web.archive.org':'https://web.archive.org/web/*/{q}','data.occrp.org':'https://data.occrp.org/search?q={q}','twitter.com':'https://twitter.com/search?q={q}','search.censys.io':'https://search.censys.io/search?q={q}','tineye.com':'https://tineye.com/search?url={q}','images.google.com':'https://www.google.com/searchbyimage?image_url={q}&client=app','crt.sh':'https://crt.sh/?q={q}','builtwith.com':'https://builtwith.com/{q}','securityheaders.com':'https://securityheaders.com/?q={q}&followRedirects=on','viewdns.info':'https://viewdns.info/reverseip/?host={q}&t=1','craigslist.org':'https://www.google.com/search?q=site%3Acraigslist.org+{q}','spokeo.com':'https://www.spokeo.com/{q}','yasni.com':'https://www.yasni.com/{q}/check+people','webmii.com':'https://webmii.com/people?n=%22{q}%22','howmanyofme.com':'https://howmanyofme.com/','zoomeye.org':'https://www.zoomeye.org/searchResult?q={q}'};
function itemTpl(it){var h=host(it.u||'');if(!h)return null;
 if(HOSTQ[h])return HOSTQ[h];
 var base=h.split('.').slice(-2).join('.');return HOSTQ[base]||null}

/* ------------ Live lab data ------------ */
var DEFTYPES=[
 {id:'text',l:'Texte',ph:'mot-clé, nom, phrase…',h:'Recherche croisée sur moteurs & sources'},
 {id:'email',l:'Email',ph:'prenom.nom@exemple.fr',h:'Contrôles d’exposition & réputation'},
 {id:'phone',l:'Téléphone',ph:'+33 6 12 34 56 78  /  (555) 123-4567',h:'Variantes de format + Google Dorks du classeur'},
 {id:'user',l:'Pseudo',ph:'pseudonyme',h:'Ouvre le profil sur ~30 plateformes'},
 {id:'domain',l:'Domaine',ph:'exemple.fr',h:'DNS, RDAP, certificats, historique — en direct'},
 {id:'ip',l:'IP',ph:'8.8.8.8',h:'Géoloc/ASN en direct + scanners'},
 {id:'img',l:'Image (URL)',ph:'https://…/photo.jpg',h:'Recherche inversée multi-moteurs'},
 {id:'vin',l:'VIN',ph:'3GTEK13Y87G5…',h:'Décodage NHTSA en direct'},
 {id:'bssid',l:'BSSID Wi‑Fi',ph:'00:11:22:33:44:55',h:'Géolocalisation (API mylnikov du classeur)'},
 {id:'btc',l:'Adresse BTC',ph:'bc1…  /  1…',h:'Explorateurs blockchain'}
];
var USERS=[['GitHub','https://github.com/{q}'],['X / Twitter','https://x.com/{q}'],['Instagram','https://www.instagram.com/{q}/'],['TikTok','https://www.tiktok.com/@{q}'],['Reddit','https://www.reddit.com/user/{q}'],['YouTube','https://www.youtube.com/@{q}'],['Twitch','https://www.twitch.tv/{q}'],['Telegram','https://t.me/{q}'],['Facebook','https://www.facebook.com/{q}'],['LinkedIn','https://www.linkedin.com/in/{q}'],['Pinterest','https://www.pinterest.com/{q}/'],['Medium','https://medium.com/@{q}'],['Snapchat','https://www.snapchat.com/add/{q}'],['SoundCloud','https://soundcloud.com/{q}'],['Keybase','https://keybase.io/{q}'],['GitLab','https://gitlab.com/{q}'],['Tinder','https://tinder.com/@{q}'],['Kik','http://kik.me/{q}'],['VK','https://vk.com/{q}'],['Steam','https://steamcommunity.com/id/{q}'],['Hacker News','https://news.ycombinator.com/user?id={q}'],['dev.to','https://dev.to/{q}'],['About.me','https://about.me/{q}'],['Gravatar','https://gravatar.com/{q}'],['Mastodon (search)','https://mastodon.social/@{q}'],['Google "pseudo"','https://www.google.com/search?q=%22{q}%22']];
var TPL={
 text:[['Google','https://www.google.com/search?q={q}'],['Google (exact)','https://www.google.com/search?q=%22{q}%22'],['Bing','https://www.bing.com/search?q={q}'],['DuckDuckGo','https://duckduckgo.com/?q={q}'],['Yandex','https://yandex.com/search/?text={q}'],['Baidu','https://www.baidu.com/s?wd={q}'],['Qwant','https://www.qwant.com/?q={q}'],['IntelX','https://intelx.io/?s={q}'],['Shodan','https://www.shodan.io/search?query={q}'],['Reddit','https://www.reddit.com/search/?q={q}'],['X / Twitter','https://twitter.com/search?q={q}'],['Archive.org','https://archive.org/search?query={q}'],['Ahmia (darknet)','https://ahmia.fi/search/?q={q}'],['OpenCorporates','https://opencorporates.com/companies?q={q}'],['OCCRP Aleph','https://data.occrp.org/search?q={q}'],['eBay','https://www.ebay.com/sch/i.html?_nkw={q}'],['Scribd','https://www.scribd.com/search?query={q}'],['OpenStreetMap','https://www.openstreetmap.org/search?query={q}'],['Google Maps','https://www.google.com/maps/search/{q}'],['GitHub','https://github.com/search?q={q}']],
 email:[['Epieos','https://epieos.com/?q={q}&t=email'],['Have I Been Pwned','https://haveibeenpwned.com/account/{q}'],['EmailRep','https://emailrep.io/{q}'],['Google "email"','https://www.google.com/search?q=%22{q}%22'],['IntelX','https://intelx.io/?s={q}'],['Pastes (Google)','https://www.google.com/search?q=site%3Apastebin.com+%22{q}%22'],['Gravatar (profil)','https://gravatar.com/{md5}'],['Gravatar (avatar)','https://gravatar.com/avatar/{md5}?s=400&d=404']],
 user:USERS,
 domain:[['crt.sh (certificats)','https://crt.sh/?q=%25.{q}'],['ViewDNS reverse IP','https://viewdns.info/reverseip/?host={q}&t=1'],['SecurityHeaders','https://securityheaders.com/?q={q}&followRedirects=on'],['BuiltWith','https://builtwith.com/{q}'],['Who.is','https://who.is/whois/{q}'],['Wayback Machine','https://web.archive.org/web/*/{q}'],['VirusTotal','https://www.virustotal.com/gui/domain/{q}'],['urlscan.io','https://urlscan.io/search/#domain%3A{q}'],['Shodan (hostname)','https://www.shodan.io/search?query=hostname%3A{q}'],['SimilarWeb','https://www.similarweb.com/website/{q}/'],['Reddit (domain)','https://www.reddit.com/domain/{q}/'],['Google site:','https://www.google.com/search?q=site%3A{q}'],['Google fichiers','https://www.google.com/search?q=site%3A{q}+ext%3Apdf+OR+ext%3Adocx+OR+ext%3Axlsx'],['Pastes (Google)','https://www.google.com/search?q=site%3Apastebin.com+%22{q}%22']],
 ip:[['Shodan','https://www.shodan.io/host/{q}'],['Censys','https://search.censys.io/hosts/{q}'],['IPinfo','https://ipinfo.io/{q}'],['AbuseIPDB','https://www.abuseipdb.com/check/{q}'],['VirusTotal','https://www.virustotal.com/gui/ip-address/{q}'],['BGP.he.net','https://bgp.he.net/ip/{q}'],['GreyNoise','https://viz.greynoise.io/ip/{q}'],['I Know What You Download','https://iknowwhatyoudownload.com/en/peer/?ip={q}']],
 img:[['Google Lens','https://lens.google.com/uploadbyurl?url={q}'],['Yandex Images','https://yandex.com/images/search?rpt=imageview&url={q}'],['Bing Visual','https://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:{q}'],['TinEye','https://tineye.com/search?url={q}']],
 vin:[['NHTSA (JSON)','https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/{q}?format=json'],['carsowners (dork)','https://www.google.com/search?q=site%3Acarsowners.net+%22{q}%22'],['Google VIN','https://www.google.com/search?q=%22{q}%22'],['NICB VINCheck','https://www.nicb.org/vincheck']],
 bssid:[['mylnikov (JSON)','https://api.mylnikov.org/geolocation/wifi?v=1.1&data=open&bssid={q}'],['WiGLE','https://wigle.net/']],
 btc:[['Blockchain.com','https://www.blockchain.com/explorer/addresses/btc/{q}'],['Bitref','https://bitref.com/{q}'],['BitcoinWhosWho','https://www.bitcoinwhoswho.com/address/{q}'],['Blockchair','https://blockchair.com/bitcoin/address/{q}'],['Google','https://www.google.com/search?q=%22{q}%22']]
};
function phoneVariants(raw){var d=raw.replace(/[^\d+]/g,'');var nat=d.replace(/^\+?1(?=\d{10}$)/,'').replace(/^\+/,'');var ten=nat.slice(-10);return {digits:d.replace('+',''),e164:d.indexOf('+')===0?d:'+'+d,ten:ten,a:ten.slice(0,3),b:ten.slice(3,6),c:ten.slice(6)}}
function dorkFill(tpl,p){var a=p.a,b=p.b,c=p.c;
 return tpl.replace(/\(xxx\) xxx-xxxx/g,'('+a+') '+b+'-'+c).replace(/xxx-xxx-xxxx/g,a+'-'+b+'-'+c).replace(/xxx\.xxx\.xxxx/g,a+'.'+b+'.'+c).replace(/xxx xxx xxxx/g,a+' '+b+' '+c).replace(/\+1xxxxxxxxxx/g,'+1'+p.ten).replace(/1xxxxxxxxxx/g,'1'+p.ten).replace(/xxxxxxxxxx/g,p.ten)}
function gsearch(q){return 'https://www.google.com/search?q='+encodeURIComponent(q)}

/* ------------ views ------------ */
var cur={r:'home',a:''};
function setView(html){$view.onclick=null;$view.innerHTML=html;$view.scrollTop=0}
function itemCard(it,showCat){var k=it._k,f=isFav(k),fc=freeCls(it.f),tpl=itemTpl(it);
 var cat=byId[it._c];
 return '<div class="card" data-k="'+esc(k)+'"><div class="hd"><button class="fav'+(f?' on':'')+'" data-fav="'+esc(k)+'" aria-label="Favori">'+I.star+'</button><div class="nm"><b>'+esc(it.n)+'</b><span class="t">'+esc(showCat?(cat.emoji+' '+cat.label+' · '):'')+esc(it.t||it._s)+'</span>'+(it.d?'<p>'+esc(it.d)+'</p>':'')+(it.x?'<p>💡 '+esc(it.x)+'</p>':'')+'</div>'+(fc?'<span class="badge b-'+fc+'">'+freeLbl(fc)+'</span>':'')+'</div>'+
 (it.u?'<div class="url">'+esc(it.u)+'</div>':'')+
 (tpl?'<div class="qrow"><div class="in"><input data-q placeholder="Rechercher sur '+esc(host(it.u))+'…" enterkeyhint="search"></div><button class="btn yel" data-go="'+esc(k)+'">'+I.go+'</button></div>':'')+
 '<div class="act">'+(it.u?'<button class="btn" data-open="'+esc(k)+'">'+I.ext+'Ouvrir</button><button class="btn sec2" data-copy="'+esc(k)+'">'+I.copy+'Lien</button>':'')+'</div></div>'}
var ITEMK={};ALL.forEach(function(i){ITEMK[i._k]=i});
function bindCards(root){
 if(root._h){root.removeEventListener('click',root._h);root.removeEventListener('keydown',root._k)}
 root._h=function(e){var b=e.target.closest('[data-fav],[data-open],[data-copy],[data-go],[data-dopen],[data-dcopy]');if(!b)return;
  if(b.dataset.fav){toggleFav(b.dataset.fav);b.classList.toggle('on');if(cur.r==='fav')route('fav');return}
  if(b.dataset.open){var it=ITEMK[b.dataset.open];openUrl(it.u,it.n);return}
  if(b.dataset.copy){copy(ITEMK[b.dataset.copy].u);return}
  if(b.dataset.go){var it2=ITEMK[b.dataset.go],inp=b.closest('.card').querySelector('[data-q]'),q=inp.value.trim();if(!q){inp.focus();return}openUrl(itemTpl(it2).replace('{q}',encodeURIComponent(q)),it2.n+' · '+q);return}
  if(b.dataset.dopen){openUrl(b.dataset.dopen,'Dork');return}
  if(b.dataset.dcopy){copy(b.dataset.dcopy);return}};
 root._k=function(e){if(e.key==='Enter'&&e.target.matches('[data-q]')){e.target.closest('.card').querySelector('[data-go]').click()}};
 root.addEventListener('click',root._h);root.addEventListener('keydown',root._k)}

function vHome(){
 var h='<div class="hero"><img src="icons/icon-192.png" alt=""><div><h1>VTLOsint_mod</h1><p>Boîte à outils OSINT : '+TOTAL+' ressources, '+CATS.length+' catégories, outils en direct.</p></div></div>';
 h+='<div class="stats"><div class="stat"><b>'+TOTAL+'</b><span>Ressources</span></div><div class="stat"><b>'+favs.length+'</b><span>Favoris</span></div><div class="stat"><b>'+notes.length+'</b><span>Notes</span></div></div>';
 h+='<div class="sbar">'+I.search+'<input id="hq" placeholder="Rechercher un outil, un type, un usage…" enterkeyhint="search"></div>';
 h+='<button class="tile" style="width:100%;flex-direction:row;align-items:center;gap:14px;background:linear-gradient(90deg,#1c2150,#2b3380);border:1px solid var(--teal)" data-r="lab"><span class="e" style="color:var(--yel)">'+I.flask.replace('<svg','<svg style="width:34px;height:34px"')+'</span><span><b>Live Lab</b><br><small>Email · Téléphone · Pseudo · Domaine · IP · Image · VIN · Wi‑Fi · BTC</small></span></button>';
 if(recent.length&&!cfg.priv){h+='<div class="sec"><h2>Récents</h2><button class="chip" data-clr="1">Effacer</button></div>';recent.slice(0,5).forEach(function(r,i){h+='<button class="lnk" data-rec="'+i+'"><span>'+esc(r.n)+'<small>'+esc(host(r.u))+'</small></span>'+I.ext+'</button>'})}
 GROUPS.forEach(function(g){h+='<h2>'+esc(g.t)+'</h2><div class="grid">';g.c.forEach(function(id){var c=byId[id];h+='<button class="tile" data-r="cat" data-a="'+id+'"><span class="e">'+c.emoji+'</span><b>'+esc(c.label)+'</b><small>'+c.all.filter(function(i){return i.t!=='dork'}).length+' ressources</small></button>'});h+='</div>'});
 h+='<div class="foot">Source : CyberSudo’s OSINT Toolkit (mis à jour le 24.08.2024)<br>Utilisation dans un cadre légal et respectueux de la vie privée.</div>';
 setView(h);
 var hq=$('#hq');hq.addEventListener('keydown',function(e){if(e.key==='Enter'&&hq.value.trim())go('search',hq.value.trim())});
 $view.onclick=function(e){var t=e.target.closest('[data-r]');if(t){go(t.dataset.r,t.dataset.a);return}var r=e.target.closest('[data-rec]');if(r){var x=recent[+r.dataset.rec];openUrl(x.u,x.n);return}if(e.target.closest('[data-clr]')){recent=[];LS.s('recent',recent);vHome()}}}

function vCat(id,filter){var c=byId[id];if(!c)return vHome();filter=filter||'all';
 var h='<h1>'+c.emoji+' '+esc(c.label)+'</h1><p class="sub">'+c.all.filter(function(i){return i.t!=='dork'}).length+' ressources · feuille « '+esc(c.sheet)+' »</p>';
 h+='<div class="chips">'+[['all','Tous'],['yes','Gratuit'],['partial','Partiel'],['no','Payant']].map(function(f){return '<button class="chip'+(filter===f[0]?' on':'')+'" data-f="'+f[0]+'">'+f[1]+'</button>'}).join('')+'</div>';
 if(id==='phone')h+='<button class="tile" style="width:100%;margin-bottom:8px;flex-direction:row;align-items:center;gap:12px" data-r="lab" data-a="phone"><span class="e">🔥</span><span><b>Générateur de Google Dorks</b><br><small>Saisissez un numéro dans le Live Lab</small></span></button>';
 var any=false;
 c.sections.forEach(function(s){var its=s.items.filter(function(i){return filter==='all'||freeCls(i.f)===filter});if(!its.length)return;any=true;
  h+='<div class="sec"><h2>'+esc(s.title)+'</h2><small>'+its.length+'</small></div>';
  its.forEach(function(it){if(it.t==='dork'){h+='<div class="card"><div class="hd"><div class="nm"><span class="dork">'+esc(it.n)+'</span></div></div><div class="act"><button class="btn sec2" data-dcopy="'+esc(it.n)+'">'+I.copy+'Copier</button></div></div>'}else h+=itemCard(it)})});
 if(!any)h+='<div class="empty">Aucun résultat pour ce filtre.</div>';
 setView(h);bindCards($view);
 $view.querySelectorAll('[data-f]').forEach(function(b){b.onclick=function(){vCat(id,b.dataset.f)}});
 var t=$view.querySelector('[data-r]');if(t&&t.classList.contains('tile'))t.onclick=function(){go('lab','phone')}}

function vSearch(q){q=(q||'').trim();var ql=q.toLowerCase(),words=ql.split(/\s+/).filter(Boolean);
 var res=words.length?ALL.map(function(i){var hay=(i.n+' '+i.t+' '+i.d+' '+i._s+' '+byId[i._c].label+' '+host(i.u||'')).toLowerCase(),sc=0;
  for(var w=0;w<words.length;w++){if(hay.indexOf(words[w])<0){return null}if(i.n.toLowerCase().indexOf(words[w])>-1)sc+=3;if(i.t.toLowerCase().indexOf(words[w])>-1)sc+=2;sc+=1}return {i:i,s:sc}}).filter(Boolean).sort(function(a,b){return b.s-a.s}):[];
 var h='<h1>Recherche</h1><div class="sbar">'+I.search+'<input id="gq" value="'+esc(q)+'" placeholder="Rechercher parmi '+TOTAL+' ressources…" enterkeyhint="search"></div>';
 h+=q?'<p class="sub">'+res.length+' résultat(s) pour « '+esc(q)+' »</p>':'<p class="sub">Nom, type, description, catégorie ou domaine.</p>';
 res.slice(0,80).forEach(function(r){h+=itemCard(r.i,true)});if(res.length>80)h+='<div class="empty">Affinez votre recherche (80 premiers résultats).</div>';
 setView(h);bindCards($view);var g=$('#gq');g.addEventListener('keydown',function(e){if(e.key==='Enter'){cur.a=g.value;vSearch(g.value)}});if(!q)g.focus()}

function vFav(){var items=favs.map(function(k){return ITEMK[k]}).filter(Boolean);
 var h='<h1>⭐ Favoris</h1><p class="sub">'+items.length+' ressource(s) enregistrée(s) sur cet appareil.</p>';
 if(!items.length)h+='<div class="empty">Touchez l’étoile d’une ressource pour la retrouver ici.</div>';
 items.forEach(function(i){h+=itemCard(i,true)});setView(h);bindCards($view)}

/* Live lab */
var lab={t:'text',q:''};
function vLab(t){if(t)lab.t=t;
 var ty=DEFTYPES.filter(function(x){return x.id===lab.t})[0];
 var h='<h1>🧪 Live Lab</h1><p class="sub">Saisissez une cible, choisissez son type : les recherches se lancent en un geste et les APIs ouvertes répondent directement ici.</p>';
 h+='<div class="chips">'+DEFTYPES.map(function(x){return '<button class="chip'+(x.id===lab.t?' on':'')+'" data-t="'+x.id+'">'+x.l+'</button>'}).join('')+'</div>';
 h+='<div class="lab-in">'+I.search+'<input id="lq" value="'+esc(lab.q)+'" placeholder="'+esc(ty.ph)+'" autocapitalize="off" autocomplete="off" spellcheck="false" enterkeyhint="go"><button class="btn yel" id="lgo">'+I.go+'</button></div><div class="hint">'+esc(ty.h)+'</div><div id="lout"></div>';
 setView(h);
 $view.querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){lab.q=$('#lq').value;lab.t=b.dataset.t;vLab()}});
 var run=function(){lab.q=$('#lq').value.trim();if(!lab.q){$('#lq').focus();return}runLab()};
 $('#lgo').onclick=run;$('#lq').addEventListener('keydown',function(e){if(e.key==='Enter')run()});
 if(lab.q&&cur.go)runLab();cur.go=false}
function linkList(arr,q,x){return arr.map(function(a){var url=a[1].replace(/\{md5\}/g,x&&x.md5||'').replace(/\{q\}/g,encodeURIComponent(q));return '<button class="lnk" data-u="'+esc(url)+'" data-n="'+esc(a[0]+' · '+q)+'"><span>'+esc(a[0])+'<small>'+esc(host(url))+'</small></span>'+I.ext+'</button>'}).join('')}
function panel(id,title){return '<div class="res" id="'+id+'"><h3>'+esc(title)+'</h3><div class="loading">Chargement…</div></div>'}
function kv(o){return '<div class="kv">'+Object.keys(o).filter(function(k){return o[k]!==''&&o[k]!=null}).map(function(k){return '<div><span>'+esc(k)+'</span><span>'+esc(o[k])+'</span></div>'}).join('')+'</div>'}
function setP(id,html,err){var e=$('#'+id);if(!e)return;e.querySelector('.loading,.kv,pre,.err')&&0;var h3=e.querySelector('h3').outerHTML;e.innerHTML=h3+(err?'<div class="err">'+esc(html)+'</div>':html)}
function runLab(){var q=lab.q.trim(),t=lab.t,out=$('#lout'),h='',x={};
 if(t==='email'){x.md5=md5(q.toLowerCase());h+=panel('p1','Gravatar')+panel('p2','Réputation (EmailRep)')+panel('p3','Serveurs mail du domaine (DNS MX)')}
 if(t==='domain')h+=panel('p1','DNS (Google DoH)')+panel('p2','Enregistrement RDAP')+panel('p3','Sous-domaines (certificats crt.sh)')+panel('p4','Archive Wayback')
 if(t==='ip')h+=panel('p1','Géolocalisation & réseau')
 if(t==='vin')h+=panel('p1','Décodage NHTSA')
 if(t==='bssid')h+=panel('p1','Géolocalisation Wi‑Fi (mylnikov)')
 if(t==='phone'){var p=phoneVariants(q);h+='<div class="res"><h3>Formats</h3>'+kv({'E.164':p.e164,'Chiffres':p.digits,'US national':p.a&&'('+p.a+') '+p.b+'-'+p.c,'Tirets':p.a+'-'+p.b+'-'+p.c,'Points':p.a+'.'+p.b+'.'+p.c})+'</div>';
  var dorks=(byId.phone.sections.filter(function(s){return s.title==='Google Dorks'})[0]||{items:[]}).items;
  h+='<div class="sec"><h2>Google Dorks (classeur)</h2><small>'+dorks.length+'</small></div>';
  dorks.forEach(function(d){var f=dorkFill(d.n,p);h+='<div class="card"><div class="hd"><div class="nm"><span class="dork">'+esc(f)+'</span></div></div><div class="act"><button class="btn" data-dopen="'+esc(gsearch(f))+'">'+I.ext+'Google</button><button class="btn sec2" data-dcopy="'+esc(f)+'">'+I.copy+'Copier</button></div></div>'});
  h+='<div class="hint">Les gabarits des dorks proviennent du format américain (NANP) ; pour un numéro non US, utilisez la ligne « Formats ».</div>';
  var tools=byId.phone.sections[0].items;h+='<div class="sec"><h2>Outils de recherche inversée</h2></div>'+tools.map(function(i){return itemCard(i)}).join('')}
 else{var arr=TPL[t]||[];h+='<div class="sec"><h2>Ouvrir dans…</h2><small>'+arr.length+'</small></div>'+linkList(arr,q,x)}
 out.innerHTML=h;
 out.onclick=function(e){var b=e.target.closest('[data-u]');if(b){openUrl(b.dataset.u,b.dataset.n)}};bindCards(out);
 if(t==='email')liveEmail(q,x.md5);if(t==='domain')liveDomain(q.toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,''));if(t==='ip')liveIp(q);if(t==='vin')liveVin(q);if(t==='bssid')liveBssid(q)}
function liveEmail(q,m){var img=new Image();img.onload=function(){setP('p1','<div class="kv"><div><span>Avatar</span><span>✅ Compte Gravatar trouvé</span></div></div><img src="https://gravatar.com/avatar/'+m+'?s=120&d=404" style="border-radius:10px;margin-top:8px" width="90" height="90" alt="">')};img.onerror=function(){setP('p1','<div class="kv"><div><span>Avatar</span><span>Aucun compte Gravatar</span></div></div>')};img.src='https://gravatar.com/avatar/'+m+'?s=120&d=404';
 vjson('https://emailrep.io/'+encodeURIComponent(q)).then(function(j){var d=j.details||{};setP('p2',kv({Réputation:j.reputation,Suspect:j.suspicious,'Références':j.references,'Fuite de données':d.data_breach,'Identifiants divulgués':d.credentials_leaked,'Livraison possible':d.deliverable,'Jetable':d.disposable,'Domaine récent':d.new_domain,'Profils':(d.profiles||[]).join(', '),'Dernière vue':d.last_seen}))}).catch(function(e){setP('p2',e.message+' — ouvrez « EmailRep » ci‑dessous.',1)});
 var dm=q.split('@')[1];if(!dm){setP('p3','Domaine absent',1);return}
 vjson('https://dns.google/resolve?name='+encodeURIComponent(dm)+'&type=MX').then(function(j){setP('p3',(j.Answer&&j.Answer.length)?'<pre>'+esc(j.Answer.map(function(a){return a.data}).join('\n'))+'</pre>':'Aucun MX (domaine incapable de recevoir du mail)')}).catch(function(e){setP('p3',e.message,1)})}
function liveDomain(d){
 var types=['A','AAAA','MX','NS','TXT','CNAME'];
 Promise.all(types.map(function(t){return vjson('https://dns.google/resolve?name='+encodeURIComponent(d)+'&type='+t).then(function(j){return [t,(j.Answer||[]).map(function(a){return a.data})]},function(){return [t,null]})})).then(function(r){var o={};r.forEach(function(x){o[x[0]]=x[1]===null?'(erreur)':x[1].join('\n')||'—'});setP('p1',kv(o).replace(/<span>/g,'<span style="white-space:pre-wrap">'))});
 vjson('https://rdap.org/domain/'+encodeURIComponent(d)).then(function(j){var ev={};(j.events||[]).forEach(function(e){ev[e.eventAction]=(e.eventDate||'').slice(0,10)});var reg='';(j.entities||[]).forEach(function(e){if((e.roles||[]).indexOf('registrar')>-1&&e.vcardArray){(e.vcardArray[1]||[]).forEach(function(v){if(v[0]==='fn')reg=v[3]})}});
  setP('p2',kv({Domaine:j.ldhName,'Statut':(j.status||[]).join(', '),Registrar:reg,Création:ev.registration,'Dernière modif.':ev['last changed'],Expiration:ev.expiration,'Serveurs NS':(j.nameservers||[]).map(function(n){return n.ldhName}).join(', ')}))}).catch(function(e){setP('p2',e.message,1)});
 vjson('https://crt.sh/?q=%25.'+encodeURIComponent(d)+'&output=json').then(function(j){var s={};j.forEach(function(c){String(c.name_value).split('\n').forEach(function(n){s[n.replace(/^\*\./,'').toLowerCase()]=1})});var l=Object.keys(s).sort();setP('p3','<div class="hint">'+l.length+' nom(s) unique(s) dans les certificats</div><pre>'+esc(l.slice(0,300).join('\n'))+(l.length>300?'\n… +'+(l.length-300):'')+'</pre><button class="btn sec2" id="cpsub" style="margin-top:8px">'+I.copy+'Copier la liste</button>');var b=$('#cpsub');if(b)b.onclick=function(){copy(l.join('\n'))}}).catch(function(e){setP('p3',e.message+' (crt.sh est parfois lent) — ouvrez le lien crt.sh ci‑dessous.',1)});
 vjson('https://archive.org/wayback/available?url='+encodeURIComponent(d)).then(function(j){var c=j.archived_snapshots&&j.archived_snapshots.closest;setP('p4',c?kv({Disponible:'oui',Capture:c.timestamp.replace(/^(\d{4})(\d\d)(\d\d).*/,'$1-$2-$3'),Statut:c.status})+'<button class="btn sec2" style="margin-top:8px" data-dopen="'+esc(c.url)+'">'+I.ext+'Ouvrir la capture</button>':'Aucune capture trouvée')}).catch(function(e){setP('p4',e.message,1)})}
function liveIp(ip){vjson('https://ipwho.is/'+encodeURIComponent(ip)).then(function(j){if(j.success===false)throw new Error(j.message||'IP invalide');var c=j.connection||{};setP('p1',kv({IP:j.ip,Type:j.type,Pays:(j.flag&&j.flag.emoji||'')+' '+j.country,Région:j.region,Ville:j.city,'Lat, Lon':j.latitude+', '+j.longitude,ASN:c.asn,Organisation:c.org,FAI:c.isp,Domaine:c.domain,'Fuseau':j.timezone&&j.timezone.id})+'<button class="btn sec2" style="margin-top:8px" data-dopen="https://www.openstreetmap.org/?mlat='+j.latitude+'&mlon='+j.longitude+'#map=10/'+j.latitude+'/'+j.longitude+'">'+I.ext+'Voir sur la carte</button>')}).catch(function(e){setP('p1',e.message,1)})}
function liveVin(v){vjson('https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/'+encodeURIComponent(v)+'?format=json').then(function(j){var o={};(j.Results||[]).forEach(function(r){if(r.Value&&r.Value!=='Not Applicable'&&['Make','Model','Model Year','Manufacturer Name','Vehicle Type','Body Class','Plant Country','Plant City','Engine Model','Fuel Type - Primary','Displacement (L)','Drive Type','Transmission Style','Series','Trim','Error Text'].indexOf(r.Variable)>-1)o[r.Variable]=r.Value});setP('p1',Object.keys(o).length?kv(o):'Aucune donnée')}).catch(function(e){setP('p1',e.message,1)})}
function liveBssid(b){vjson('https://api.mylnikov.org/geolocation/wifi?v=1.1&data=open&bssid='+encodeURIComponent(b)).then(function(j){if(j.result!==200||!j.data)throw new Error(j.desc||'Introuvable');var d=j.data;setP('p1',kv({BSSID:b,Latitude:d.lat,Longitude:d.lon,Précision:d.range&&d.range+' m',Pays:d.country,Dernière_vue:d.time&&new Date(d.time*1000).toISOString().slice(0,10)})+'<button class="btn sec2" style="margin-top:8px" data-dopen="https://www.openstreetmap.org/?mlat='+d.lat+'&mlon='+d.lon+'#map=17/'+d.lat+'/'+d.lon+'">'+I.ext+'Voir sur la carte</button>')}).catch(function(e){setP('p1',e.message,1)})}

/* Notes */
function vNotes(){var h='<h1>📓 Notes d’enquête</h1><p class="sub">Enregistrées uniquement sur cet appareil.</p><textarea id="nt" placeholder="Cible, constats, liens, horodatage…"></textarea><div class="act" style="padding:10px 0 0"><button class="btn" id="nadd">Ajouter</button>'+(notes.length?'<button class="btn sec2" id="nexp">'+I.share+'Exporter</button>':'')+'</div>';
 notes.forEach(function(n,i){h+='<div class="note"><small>'+esc(n.d)+' <button data-del="'+i+'" style="float:right;color:var(--bad)">'+I.trash+'</button></small>'+esc(n.t)+'</div>'});
 setView(h);$('#nadd').onclick=function(){var v=$('#nt').value.trim();if(!v)return;notes.unshift({d:new Date().toLocaleString('fr-FR'),t:v});LS.s('notes',notes);vNotes()};
 var e=$('#nexp');if(e)e.onclick=function(){var txt=notes.map(function(n){return '['+n.d+']\n'+n.t}).join('\n\n---\n\n');if(ANDROID&&ANDROID.share)ANDROID.share(txt);else{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='VTLOsint_notes.txt';a.click()}};
 $view.onclick=function(ev){var d=ev.target.closest('[data-del]');if(d){notes.splice(+d.dataset.del,1);LS.s('notes',notes);vNotes()}}}

/* Settings / About */
function tg(id,on,l,s){return '<div class="set"><div>'+l+'<small>'+s+'</small></div><button class="tg'+(on?' on':'')+'" data-tg="'+id+'" aria-label="'+esc(l)+'"></button></div>'}
function vSettings(){var h='<h1>Paramètres</h1>';
 h+=tg('priv',cfg.priv,'Mode privé','N’enregistre pas les liens récents (le cadenas devient jaune).');
 if(ANDROID)h+='<div class="set"><div>Ouverture des liens<small>Navigateur intégré ou navigateur du téléphone</small></div><div class="seg"><button data-mode="inapp" class="'+(cfg.mode==='inapp'?'on':'')+'">Intégré</button><button data-mode="external" class="'+(cfg.mode==='external'?'on':'')+'">Externe</button></div></div>';
 h+='<div class="set"><div>Données locales<small>Favoris : '+favs.length+' · Notes : '+notes.length+' · Récents : '+recent.length+'</small></div><button class="btn sec2" id="wipe">'+I.trash+'Tout effacer</button></div>';
 h+='<div class="foot">VTLOsint_mod v1.0 · '+(ANDROID?'APK Android':'Version web universelle / PWA')+'</div>';
 setView(h);
 $view.onclick=function(e){var t=e.target.closest('[data-tg]');if(t){cfg[t.dataset.tg]=!cfg[t.dataset.tg];LS.s('cfg',cfg);syncLock();vSettings();return}var m=e.target.closest('[data-mode]');if(m){cfg.mode=m.dataset.mode;LS.s('cfg',cfg);vSettings();return}if(e.target.closest('#wipe')){favs=[];notes=[];recent=[];LS.s('favs',favs);LS.s('notes',notes);LS.s('recent',recent);toast('Données effacées');vSettings()}}}
function vAbout(){var h='<h1>À propos</h1><p class="sub">VTLOsint_mod regroupe les ressources du classeur « CyberSudo’s OSINT Toolkit » (dernière mise à jour 24.08.2024) dans une interface mobile : catalogue, recherche, favoris, notes et outils en direct. Les liens pointent vers des services tiers : utilisez-les dans le respect du droit et de la vie privée des personnes.</p><h2>Liens CyberSudo</h2>';
 ABOUT.forEach(function(a){h+='<button class="lnk" data-u="'+esc(a.u)+'" data-n="'+esc(a.n)+'"><span>'+esc(a.n)+'<small>'+esc(host(a.u))+'</small></span>'+I.ext+'</button>'});
 h+='<div class="foot">Développé par VTLO · icône robot VTLO</div>';setView(h);$view.onclick=function(e){var b=e.target.closest('[data-u]');if(b)openUrl(b.dataset.u,b.dataset.n)}}

/* ------------ router & menu ------------ */
function go(r,a,noPush){cur={r:r,a:a||'',go:!!(r==='lab'&&a==='go')};if(!noPush)history.pushState({r:r,a:a||''},'','#/'+r+(a?'/'+encodeURIComponent(a):''));route(r,a)}
function route(r,a){r=r||cur.r;a=a===undefined?cur.a:a;cur.r=r;cur.a=a;closeMenu(true);
 ({home:vHome,cat:function(){vCat(a)},search:function(){vSearch(a)},fav:vFav,lab:function(){vLab(a&&a!=='go'?a:null)},notes:vNotes,settings:vSettings,about:vAbout}[r]||vHome)();$view.scrollTop=0;syncMenu()}
function syncLock(){var l=$('#lock');if(l)l.classList.toggle('on',!!cfg.priv)}
function openMenu(){$menu.classList.add('show');syncMenu()}
function closeMenu(q){$menu.classList.remove('show')}
var openG={};
function buildMenu(){var cnt=function(id){return byId[id].all.filter(function(i){return i.t!=='dork'}).length};
 var h='<div class="mtop"><button class="x" id="mx" aria-label="Fermer">'+I.x+'</button><div class="sp"></div><button class="top-home" style="width:60px;color:#fff;font-size:27px;display:flex;align-items:center;justify-content:center" data-r="home">'+I.home+'</button><div class="sp" style="flex:0 0 120px"></div><div class="help" style="width:56px;background:var(--teal);color:var(--bar);display:flex;align-items:center;justify-content:center"><span class="q" style="width:28px;height:28px;border-radius:50%;background:var(--bar);color:var(--teal);display:flex;align-items:center;justify-content:center;font-weight:800">?</span></div></div>';
 h+='<div class="mbody"><div class="user"><b>VTLOsint_mod</b><button data-r="settings" aria-label="Paramètres">'+I.sliders+'</button><button id="pw" aria-label="Quitter">'+I.power+'</button></div>';
 [['home','','grid','Accueil'],['lab','','flask','Live Lab'],['search','','search','Recherche globale'],['fav','','star','Favoris'],['notes','','note','Notes d’enquête']].forEach(function(m){h+='<button class="mi'+(cur.r===m[0]?' act':'')+'" data-r="'+m[0]+'" data-m="'+m[0]+'">'+I[m[2]]+m[3]+(m[0]==='fav'?'<small>'+favs.length+'</small>':'')+'</button>'});
 h+='<button class="mi" data-u="https://academy.cybersudo.org/">'+I.cap+'Académie CyberSudo</button><div class="msep"></div>';
 GROUPS.forEach(function(g,gi){h+='<button class="mh" data-g="'+gi+'"><span class="pl">'+(openG[gi]?'−':'+')+'</span>'+esc(g.t)+'</button>';
  if(openG[gi])h+='<div class="msub">'+g.c.map(function(id){var c=byId[id];return '<button class="mi" data-r="cat" data-a="'+id+'"><span class="em">'+c.emoji+'</span>'+esc(c.label)+'<small>'+cnt(id)+'</small></button>'}).join('')+'</div>'});
 h+='<button class="mh" data-r="about"><span class="pl">+</span>À propos</button><div style="height:40px"></div></div>';
 $menu.innerHTML=h}
function syncMenu(){buildMenu()}
function init(){
 $('#app').innerHTML='<div class="top"><button class="tb" id="mb" aria-label="Menu">'+I.menu+'</button><div class="brand"><img src="icons/icon-96.png" alt=""><b>VTLOsint_mod</b></div><button class="ic" id="hm" aria-label="Accueil">'+I.home+'</button><button class="ic lock" id="lock" aria-label="Mode privé">'+I.lock+'</button><button class="help" id="hp" aria-label="Aide"><span class="q">?</span></button></div><div id="view"></div><div id="menu"></div>';
 $view=$('#view');$menu=$('#menu');syncLock();
 $('#mb').onclick=openMenu;$('#hm').onclick=function(){go('home')};$('#hp').onclick=function(){go('about')};
 $('#lock').onclick=function(){cfg.priv=!cfg.priv;LS.s('cfg',cfg);syncLock();toast(cfg.priv?'Mode privé activé':'Mode privé désactivé')};
 $menu.addEventListener('click',function(e){
  if(e.target.closest('#mx')){closeMenu();return}
  var g=e.target.closest('[data-g]');if(g){openG[g.dataset.g]=!openG[g.dataset.g];buildMenu();return}
  var u=e.target.closest('[data-u]');if(u){openUrl(u.dataset.u,'Académie CyberSudo');return}
  if(e.target.closest('#pw')){if(ANDROID&&ANDROID.exit)ANDROID.exit();else{closeMenu();toast('Fermez l’onglet ou l’application pour quitter')}return}
  var r=e.target.closest('[data-r]');if(r)go(r.dataset.r,r.dataset.a)});
 window.addEventListener('popstate',function(e){var s=e.state||{r:'home'};cur={r:s.r,a:s.a||''};route(s.r,s.a)});
 window.__back=function(){if($menu.classList.contains('show')){closeMenu();return true}if(cur.r!=='home'){history.back();return true}return false};
 var m=location.hash.match(/^#\/(\w+)(?:\/(.*))?$/);var r=m?m[1]:'home',a=m&&m[2]?decodeURIComponent(m[2]):'';history.replaceState({r:r,a:a},'','#/'+(r==='home'?'':r+(a?'/'+encodeURIComponent(a):'')));route(r,a);
 if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){})}
document.addEventListener('DOMContentLoaded',init);
})();
