from random import triangular
import pandas as pd
import numpy as np
from re import T
import numpy as np
import pandas as pd
import MySQLdb
import fetch



conn = MySQLdb.connect(host="127.0.0.1", user="root", passwd="123123", db="whatseat")
cur = conn.cursor()

#lấy dataframe món ăn
recipes_df = fetch.recipes_df(cur)
cur.close()
#xóa những phần tử null
recipes_df = recipes_df.dropna()

recipes_df['Ingredients'] = recipes_df['Ingredients'].apply(fetch.convert)
cur = conn.cursor()
caloList = []
for line in recipes_df.itertuples():
    caloList.append(fetch.convert_calo(cur,line[3]))
# fetch.convert_calo(cur,recipes_df['Ingredients'][1])
cur.close()

recipes_df['Calo'] = caloList

recipes_df = recipes_df[['Calo','RecipeId']]
tuple = list(recipes_df.itertuples(index=False, name=None))
fetch.update_calo(conn,tuple)






