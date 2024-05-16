import pandas as pd

def recipes_df(cur):
    cur.execute("""SELECT RecipeId, Name, Ingredients, Steps FROM whatseat.recipes""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['RecipeId', 'Name', 'Ingredients', 'Steps'])
    return data

def get_list_user(cur):
    cur.execute("""SELECT Distinct CustomerId FROM whatseat.lovedrecipes""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['CustomerId'])
    return data

def get_user(cur, user_id):
    cur.execute("""SELECT CustomerId, RecipeId FROM whatseat.lovedrecipes where CustomerId Like %s""",(user_id,))
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['CustomerId','RecipeId'])
    return data

def recipes_type_df(cur):
    cur.execute("""SELECT rrp.RecipeId, rrp.RecipeTypeId, rp.Name FROM whatseat.reciperecipetypes rrp JOIN recipetypes rp ON rrp.RecipeTypeId = rp.RecipeTypeId""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['RecipeId', 'RecipeTypeId','Type'])
    return data