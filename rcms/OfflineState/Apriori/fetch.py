import pandas as pd

def transaction_df(cur):
    cur.execute("""SELECT OrderId, ProductId FROM whatseat.orderdetails""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['OrderId', 'ProductId'])
    return data

def menu_df(cur):
    cur.execute("""SELECT MenuId, RecipeId, Name FROM whatseat.menudetails""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['MenuId', 'RecipeId','name'])
    return data

def convert_frozenset(frozenset):
    items = list(frozenset)
    items = sorted(items)
    if len(items) > 1:
        return (' '.join(str(e) for e in items))
    
    return str(items[0])
    
    