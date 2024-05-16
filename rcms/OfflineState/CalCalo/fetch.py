from time import sleep
from unicodedata import decimal
import pandas as pd
import json
import requests
import time
def update_calo(conn,tuple):
    cursor = conn.cursor()

    query_string =  """Update whatseat.recipes set Calories = %s where RecipeId = %s"""
    
    cursor.executemany(query_string, tuple)
    conn.commit()
    print('Update calo successfully')

def recipes_df(cur):
    cur.execute("""SELECT RecipeId, Name, Ingredients FROM whatseat.recipes""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['RecipeId', 'Name', 'Ingredients'])
    return data

def calo_df(cur,name):
    cur.execute("""SELECT Calo FROM whatseat.foodcalo where Name LIKE %s LIMIT 1""",("%" + name + "%",))
    res = cur.fetchall()
    if(res):

        res = res[0][0]
        return res
    else: return 0


def convert(text):
    L = []
    for i in json.loads(text):
        if(i['name'] != None):
            L.append(i) 
    return L 


def convert_calo(cur, list_ingredient):
    sum_calories = 0
    for i in list_ingredient:
        if(i != 0):
            if 'quantity' in i:
                if(i['unit']['unit'] == 'Gr'):
                    quantity = 0
                    if(i['quantity'] == '1/2'):
                        quantity = 0.5
                    elif i['quantity'] == '1/4':
                        quantity = 0.25
                    else:
                        quantity = float(i['quantity'])
                    calo = calo_df(cur,i['name'])
                    # if(calo == 0):
                    #     url = "https://www.myfitnesspal.com/public/nutrition"
                    #     PARAMS = {'q':i['name'],'page':1,'per_page':10}
                    #     r = requests.get(url = url, params = PARAMS)
                    #     data = r.json()
                    #     print(data['items'][0])
                    #     time.sleep(5)
                    # if(calo > 0):
                    caloOfFood = calo * (quantity/100)
                    sum_calories += caloOfFood
    return sum_calories
