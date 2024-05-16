import pandas as pd

def product_df(cur):
    cur.execute("""SELECT p.ProductId, p.Name, pc.Name FROM whatseat.products p 
    JOIN whatseat.productcategories pc ON p.ProductCategoryId = pc.ProductCategoryId""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['ProductId', 'Name', 'ProductCategoryName'])
    return data

def get_list_user(cur):
    cur.execute("""SELECT Distinct CustomerId FROM whatseat.lovedproducts""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['CustomerId'])
    return data


def get_user(cur, user_id):
    cur.execute("""SELECT CustomerId, ProductId FROM whatseat.lovedproducts where CustomerId Like %s""",(user_id,))
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['CustomerId','ProductId'])
    return data