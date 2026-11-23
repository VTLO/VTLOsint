import json, re
d=json.load(open('data/raw.json'))
META={ # sheet -> (id, label, emoji, group)
 'Search engines':('search','Moteurs de recherche','🔎'),
 'Email':('email','Email','📧'),
 'People Search':('people','Recherche de personnes','🧑'),
 'Phone Numbers':('phone','Numéros de téléphone','📱'),
 'Usernames':('usernames','Pseudonymes','🏷️'),
 'Maps':('maps','Cartes & Géo','🗺️'),
 'Social Media':('social','Réseaux sociaux','💬'),
 'Images':('images','Images & Forensique','📷'),
 'Reverse Video ':('video','Vidéo','📹'),
 'Companies':('companies','Entreprises & Leaks','🏢'),
 'Database Breach search':('breach','Fuites de données','🛡️'),
 'Forums Search':('forums','Forums','🏘️'),
 'Documents':('docs','Documents','📄'),
 'Vehicle':('vehicle','Véhicules','🚗'),
 'Marketplace Search':('market','Marketplaces','🛒'),
 'Domain':('domain','Domaine / IP','🌐'),
 'Dating':('dating','Sites de rencontre','💑'),
 'Others':('others','Autres','🧩'),
 'OSINT Tools & websites':('resources','Ressources OSINT','🏫'),
}
def clean(s): return re.sub(r'\s+',' ',s.replace('\xa0',' ')).strip()
cats=[]; seen=set()
for sh,(cid,label,emo) in META.items():
    rows=d[sh]
    sections={}  # title -> items
    order=[]
    def sec(t):
        if t not in sections: sections[t]=[]; order.append(t)
        return sections[t]
    title=clean(rows[0]['cells'][0]['v'])
    # block state per start column
    blocks={8:'Casiers & tribunaux (US)'} if sh=='People Search' else {}
    pending={}  # startcol -> last section-title candidate
    DORK=re.compile(r'(intext:|ext:|site:|inurl:)')
    for r in rows[1:]:
        cells={c['c']:c for c in r['cells']}
        cols=sorted(cells)
        hdr=[c for c in cols if cells[c]['v'].strip().lower() in ('type','criminal records','criminal record') and (c+1 in cells and cells[c+1]['v'].strip().lower() in ('url','description'))]
        if hdr:
            for c in hdr:
                blocks[c]=pending.pop(c,title) if c!=8 else 'Casiers & tribunaux (US)'
            if sh=='People Search' and 8 in cells and cells[8]['h']:
                sec('Casiers & tribunaux (US)').append({'t':'','n':clean(cells[8]['v']),'u':cells[8]['h'],'d':clean(cells[9]['v']) if 9 in cells else '','f':clean(cells[10]['v']).lower() if 10 in cells else ''})
            continue
        # title-only row
        if all(not cells[c]['h'] for c in cols) and all(len(cells[c]['v'])<40 for c in cols) and not any(c+1 in cells for c in cols) and not any(DORK.search(cells[c]['v']) for c in cols):
            for c in cols: pending[c]=clean(cells[c]['v'])
            continue
        used=set()
        for sc in list(blocks):
            typ=cells.get(sc); nm=cells.get(sc+1)
            if not typ and not nm: continue
            used|={sc,sc+1,sc+2,sc+3,sc+4}
            ds=cells.get(sc+2); fr=cells.get(sc+3); note=cells.get(sc+4)
            if typ and not typ['h'] and DORK.search(typ['v']) and not nm:
                sec('Google Dorks').append({'t':'dork','n':clean(typ['v']),'u':None,'d':'','f':''}); continue
            if sc==8:
                if typ: sec(blocks[sc]).append({'t':'','n':clean(typ['v']),'u':typ['h'],'d':clean(nm['v']) if nm else '','f':clean(ds['v']).lower() if ds else ''})
                continue
            if typ and typ['h'] and (not nm or not nm['h']):
                sec(pending.get(sc,blocks[sc]) if sc>=6 else blocks[sc]).append({'t':'','n':clean(typ['v']),'u':typ['h'],'d':clean(nm['v']) if nm else '','f':''}); continue
            if nm and (nm['h'] or nm['v']):
                it={'t':clean(typ['v']) if typ else '', 'n':clean(nm['v']), 'u':nm['h'], 'd':clean(ds['v']) if ds else '', 'f':clean(fr['v']).lower() if fr else ''}
                if note and note['v']: it['x']=clean(note['v'])
                sec(pending.get(sc,blocks[sc]) if sc>=6 else blocks[sc]).append(it)
            elif typ and not nm and typ['v']:
                pending[sc]=clean(typ['v'])
        for c in cols:
            if c in used: continue
            ce=cells[c]
            if DORK.search(ce['v']) and not ce['h']:
                sec('Google Dorks').append({'t':'dork','n':clean(ce['v']),'u':None,'d':'','f':''})
    # post-process
    # fix sections
    secs=[]
    for t in order:
        its=sections[t]
        if its: secs.append({'title':t,'items':its})
    cats.append({'id':cid,'label':label,'emoji':emo,'sheet':sh.strip(),'sections':secs})

FIX={'Exploit-DB':'https://www.exploit-db.com/google-hacking-database','Lookup ID':'https://lookup-id.com/','bitref':'https://bitref.com/','blockchain':'https://www.blockchain.com/explorer','iplogger':'https://iplogger.org/','canarytokens':'https://canarytokens.org/','osintframework':'https://osintframework.com/'}
for c in cats:
    for sct in c['sections']:
        for it in sct['items']:
            if not it['u'] and it['n'] in FIX: it['u']=FIX[it['n']]
            if it['u']: it['u']=it['u'].strip()

SECMAP={'Darknet':'Darknet','Wigle':'Wi‑Fi','mylnikov':'Wi‑Fi','ahmia':'Darknet','onionlandsearchengine':'Darknet','iaca':'Darknet',
 'readnotify':'Trackers','iplogger':'Trackers','canarytokens':'Trackers','geoguessr':'Défis géolocalisation','virtualvacation':'Défis géolocalisation',
 'iPhone IMEI Checker':'Divers','Checking MI account':'Divers','Chat forefront':'Divers','TheXifer':'Divers','Library Genesis':'Divers','Decoding Social Security Numbers in One Step':'Divers',
 'VoiceBooking':'Sockpuppets','elfqrin':'Sockpuppets','BoredHumans':'Sockpuppets','Face Generator':'Sockpuppets','ThisXDoesNotExist':'Sockpuppets','Fakeinfo':'Sockpuppets','Gravatar check':'Sockpuppets'}
FR={'Search for Search Engines':'Moteurs de recherche','Emails':'Emails','Browser Extensions':'Extensions navigateur','People Search':'Personnes','Phone Numbers':'Numéros','Google Dorks':'Google Dorks','Search for Usernames':'Pseudonymes','Maps':'Cartes','Search for Social Media':'Réseaux sociaux','Reverse Image Search':'Images','Search for videos':'Vidéos','Database Leaks':'Fuites','Forums Search':'Forums','Search for Documents':'Documents','Vehicle Records':'Véhicules','Marketplace/Stolen items':'Marketplaces','Search for Domain/IP address':'Domaine / IP','Dating sites':'Rencontres','OSINT Resources & Toolkits':'Ressources','Casiers & tribunaux (US)':'Casiers & tribunaux (US)'}
for c in cats:
    if c['id']=='others':
        m={}
        for sct in c['sections']:
            for it in sct['items']:
                t=SECMAP.get(it['n'],sct['title'])
                if it['n']=='archive': it['n']='archive.org · '+(it['d'][:28] or 'dataset')
                m.setdefault(t,[]).append(it)
        order=['Darknet','Wi‑Fi','Bitcoin','Privacy','Data sets','Trackers','Défis géolocalisation','Sockpuppets','Divers']
        c['sections']=[{'title':t,'items':m[t]} for t in order if t in m]
    for sct in c['sections']:
        sct['title']='Entreprises' if c['id']=='companies' else FR.get(sct['title'],sct['title'])
        for it in sct['items']:
            it['n']=it['n'].replace('https://','').rstrip('/')
json.dump(cats,open('data/cats.json','w'),ensure_ascii=False,indent=0)
tot=0
for c in cats:
    n=sum(len(s['items']) for s in c['sections']); tot+=n
    print(c['id'],n,[ (s['title'],len(s['items'])) for s in c['sections']])
print('total',tot)
