#import sklearn library
import pandas as pd

def recipe_ratings(cur):
    cur.execute("""SELECT CustomerId, RecipeId,Rating FROM whatseat.recipereviews""",)
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['CustomerId','RecipeId','Rating'])
    return data


def product_ratings(cur):
    cur.execute("""SELECT CustomerId, ProductId,Rating FROM whatseat.productreviews""",)
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['CustomerId','ProductId','Rating'])
    return data