import openpyxl, json, sys
wb=openpyxl.load_workbook(sys.argv[1])
out={}
for ws in wb:
    rows=[]
    for row in ws.iter_rows():
        cells=[]
        for c in row:
            if c.value is None and not c.hyperlink: continue
            cells.append({"c":c.column,"v":str(c.value).strip() if c.value is not None else "","h":c.hyperlink.target if c.hyperlink and c.hyperlink.target else None})
        if cells: rows.append({"r":row[0].row,"cells":cells})
    out[ws.title]=rows
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False)
for k,v in out.items():
    n=sum(1 for r in v for c in r['cells'] if c['h'])
    print(k,len(v),'rows',n,'links')
