from random import triangular
import pandas as pd
import numpy as np

# rarting_click_df fuction: fetch user's click data from database
# Input: mysql cursor
# Output: pandas dataframe of clicks data with three columns: id_user, id_movie, rating
def rating_recipe_df(cur):
    cur.execute("""SELECT CustomerId, RecipeId, Rating FROM whatseat.recipereviews""")
    res = cur.fetchall()
    click_df = pd.DataFrame(res, columns=['CustomerId', 'RecipeId', 'Rating'])
    return click_df

def similarity_item_df(cur):
    cur.execute("""SELECT id1, id2, similarity FROM whatseat.item_base_similarity""")
    res = cur.fetchall()
    item_sim_df = pd.DataFrame(res, columns=['id1', 'id2', 'similarity'])
    return item_sim_df

def rating_love_df(cur):
    cur.execute("""SELECT id_user, id_food, is_love FROM whatseat.interactive_food""")
    res = cur.fetchall()
    click_df = pd.DataFrame(res, columns=['id_user', 'id_food', 'rating'])
    return click_df

def get_fav_food(cur, user_id):
    cur.execute("""SELECT CustomerId, RecipeId FROM whatseat.recipereviews where rating >= 4 and CustomerId = %s """,(user_id,))
    res = cur.fetchall()
    click_df = pd.DataFrame(res, columns=['CustomerId', 'RecipeId'])
    return click_df

def list_product(cur, list_product_id):
    cur.execute("""SELECT ProductId, Name, InStock, BasePrice, Description FROM whatseat.products WHERE ProductId IN %s""",(tuple(list_product_id),))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['productId','name','inStock','basePrice','description'])

def list_recipents(cur, list_recipents_id):
    cur.execute("""SELECT RecipeId, Name, TotalTime, TotalView, totalLike, ThumbnailUrl FROM whatseat.recipes WHERE RecipeId IN %s""",(tuple(list_recipents_id),))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['recipeId','name','totalTime','totalView','totalLike','images'])

#get list recipe by index
def get_list_recipents_by_index(cur, list_recipents_id):
    cur.execute("""SELECT RecipeId, Name, TotalTime, TotalView, totalLike, ThumbnailUrl, RecipeTypeId, Calories/Serving as Calo FROM whatseat.recipes
     WHERE RecipeId IN %s""",(tuple(list_recipents_id),))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['recipeId','name','totalTime','totalView','totalLike','images','RecipeTypeId','calories'])

def product_recommendation(cur):
    cur.execute("""SELECT id_user, id_movie, (is_clicked + shop_rating)/2 FROM testdb.interactive""")
    res = cur.fetchall()
    click_df = pd.DataFrame(res, columns=['id_user', 'id_movie', 'rating'])
    return click_df

#get interactive recipe
def interactive_food(cur,recipeTypeId):
    cur.execute("""SELECT review.CustomerId, review.RecipeId, review.Rating 
                        FROM whatseat.recipereviews review
                        JOIN whatseat.reciperecipetypes re ON review.RecipeId = re.RecipeId
                        Where re.RecipeTypeId = %s""",(recipeTypeId,))
    res = cur.fetchall()
    click_df = pd.DataFrame(res, columns=['id_user', 'id_food', 'rating'])
    return click_df

#get list top recipe by total like
def get_top_recipe(cur, user_kcal,n_recipe,page,level,mintime,maxtime,allergy):
    if allergy == "":
        if level != "Mức độ":
            if maxtime > 0:
                #filter by time and level
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s AND totalTime >= %s AND totalTime <= %s AND level = %s
                        Order By totalLike desc LIMIT %s,%s""",(user_kcal, mintime, maxtime, level,page*n_recipe,n_recipe,))
            else:
            #filter by level
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s AND level = %s
                        Order By totalLike desc LIMIT %s,%s""",(user_kcal, level,page*n_recipe,n_recipe,))
        else:
            if maxtime > 0:
                #filter by total time
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s AND totalTime >= %s AND totalTime <= %s
                        Order By totalLike desc LIMIT %s,%s""",(user_kcal, mintime, maxtime,page*n_recipe,n_recipe,))
            else:
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s
                Order By totalLike desc LIMIT %s,%s""",(user_kcal,page*n_recipe,n_recipe,))
    else:
        if level != "Mức độ":
            if maxtime > 0:
                #filter by time and level
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s AND totalTime >= %s AND totalTime <= %s AND level = %s AND Ingredients NOT LIKE %s
                        Order By totalLike desc LIMIT %s,%s""",(user_kcal, mintime, maxtime, level,"%{}%".format(allergy),page*n_recipe,n_recipe,))
            else:
            #filter by level
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s AND level = %s AND Ingredients NOT LIKE %s
                        Order By totalLike desc LIMIT %s,%s""",(user_kcal, level,"%{}%".format(allergy),page*n_recipe,n_recipe,))
        else:
            if maxtime > 0:
                #filter by total time
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s AND totalTime >= %s AND totalTime <= %s AND Ingredients NOT LIKE %s
                        Order By totalLike desc LIMIT %s,%s""",(user_kcal, mintime, maxtime,"%{}%".format(allergy),page*n_recipe,n_recipe,))
            else:
                cur.execute("""SELECT RecipeId, (Calories/Serving) as Calo FROM whatseat.recipes Where Calo <= %s AND Ingredients NOT LIKE %s
                Order By totalLike desc LIMIT %s,%s""",(user_kcal,"%{}%".format(allergy),page*n_recipe,n_recipe,))
    res = cur.fetchall()
    click_df = pd.DataFrame(res, columns=['id','calories'])
    return click_df


#get list top product by total sell
def get_top_products(cur, n_product):
    cur.execute("""SELECT ProductId, Name, InStock, BasePrice,PhotoJson,WeightServing, TotalSell FROM whatseat.products 
     Order By TotalSell desc LIMIT %s""",(n_product,))
    res = cur.fetchall()
    click_df = pd.DataFrame(res, columns=['id','name','inStock','basePrice','images','weightServing','totalSell'])
    return click_df

#get list recipe id love by user
def recipe_love_by_user(cur, id_user):
    cur.execute("""SELECT CustomerId ,GROUP_CONCAT(RecipeNo) FROM whatseat.lovedrecipes IR
    JOIN whatseat.recipes R ON IR.RecipeId = R.RecipeId WHERE CustomerId = %s """,(id_user,))
    res = cur.fetchall()
    print('res',res)
    res = res[0][1]
    ids = []
    if(res != None):
        ids = res.split(',')
        ids = [int(s) for s in ids]
    return ids

#get list product id love by user
def product_love_by_user(cur, id_user):
    cur.execute("""SELECT CustomerId ,GROUP_CONCAT(ProductNo) FROM whatseat.lovedproducts IP
    JOIN whatseat.products P ON IP.ProductId = P.ProductId WHERE CustomerId = %s """,(id_user,))
    res = cur.fetchall()
    print('res',res)
    res = res[0][1]
    ids = []
    if(res != None):
        ids = res.split(',')
        ids = [int(s) for s in ids]
    return ids

#filter by low price
def get_top_product_low_price(cur,list_product_id):
    cur.execute("""SELECT ProductId, Name, InStock, BasePrice,PhotoJson,WeightServing, TotalSell, Status from
    whatseat.products where ProductId IN %s ORDER BY BasePrice ASC LIMIT 12""",(tuple(list_product_id),))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['productId','name','inStock','basePrice','images','weightServing','totalSell','status'])

#get product with apriori
def get_product_priori(cur,list_product_id):
    cur.execute("""SELECT consequents FROM whatseat.apriori
    WHERE confidence >= 0.5 AND antecedents LIKE %s""",(list_product_id,))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['consequents'])

#get recipe with apriori
def get_recipe_priori(cur,list_recipe_id):
    cur.execute("""SELECT consequents FROM whatseat.apriori_recipe
    WHERE confidence >= 0.5 AND antecedents LIKE %s""",(list_recipe_id,))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['consequents'])

#get product by list id
def get_product_by_list_id(cur,list_product_id):
    cur.execute("""SELECT ProductId, Name, InStock, BasePrice,PhotoJson,WeightServing, TotalSell from
    whatseat.products where ProductId IN %s""",(tuple(list_product_id),))
    res = cur.fetchall()
    return pd.DataFrame(res,columns=['productId','name','inStock','basePrice','images','weightServing','totalSell'])
    
#get recommend list recipe cb
def get_recommend_list_cb(id_user,user_kcal,n_recipe,page,cur,level,mintime,maxtime,allergy):
    if allergy == "":
        if level != "Mức độ":
            if maxtime > 0:
                #filter by time and level
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s AND R.level = %s AND R.totaltime >= %s AND R.totaltime <= %s
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,level,mintime,maxtime,page*n_recipe,n_recipe,))
            else:
            #filter by level
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s AND R.level = %s 
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,level,page*n_recipe,n_recipe,))
        else:
            if maxtime > 0:
                #filter by total time
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s AND R.totaltime >= %s AND R.totaltime <= %s
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,mintime,maxtime,page*n_recipe,n_recipe,))
            else:
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s 
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,page*n_recipe,n_recipe,))
    else:
        if level != "Mức độ":
            if maxtime > 0:
                #filter by time and level
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s AND R.level = %s AND R.totaltime >= %s AND R.totaltime <= %s AND R.Ingredients NOT LIKE %s
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,level,mintime,maxtime,"%{}%".format(allergy),page*n_recipe,n_recipe,))
            else:
            #filter by level
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s AND R.level = %s AND R.Ingredients NOT LIKE %s
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,level,"%{}%".format(allergy),page*n_recipe,n_recipe,))
        else:
            if maxtime > 0:
                #filter by total time
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s AND R.totaltime >= %s AND R.totaltime <= %s AND R.Ingredients NOT LIKE %s
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,mintime,maxtime,"%{}%".format(allergy),page*n_recipe,n_recipe,))
            else:
                cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
                    from whatseat.cb_similarity CB
                    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
                    Where CB.CustomerId LIKE %s AND Calo <= %s AND R.Ingredients NOT LIKE %s
                    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,"%{}%".format(allergy),page*n_recipe,n_recipe,))

    res = cur.fetchall()
    return pd.DataFrame(res, columns=['id1','id2','similarity','calo'])

def get_recommend_list_cb_by_time(id_user,user_kcal,n_recipe,page,cur):
    cur.execute("""SELECT CB.RecipeId , CB.CustomerId, CB.Similarity, R.Calories/R.Serving as Calo 
    from whatseat.cb_similarity CB
    JOIN whatseat.recipes R ON CB.RecipeId = R.RecipeId 
    Where CB.CustomerId LIKE %s AND Calo <= %s 
    ORDER BY CB.Similarity DESC LIMIT %s,%s""",(id_user,user_kcal,page*n_recipe,n_recipe,))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['id1','id2','similarity','calo'])
#get recommend list product cb
def get_recommend_list_product_cb(id_user,n_product,cur):
    cur.execute("""SELECT ProductId, CustomerId, Similarity from whatseat.cb_product_similarity 
    where CustomerId LIKE %s ORDER BY Similarity DESC LIMIT %s""",(id_user,n_product))
    res = cur.fetchall()
    return pd.DataFrame(res, columns=['id1','id2','similarity'])

def get_product_review(cur):
    cur.execute("""SELECT  CustomerId, ProductId, Rating FROM whatseat.productreviews""")
    res = cur.fetchall()
    data = pd.DataFrame(res, columns=['CustomerId','ProductId','Rating'])
    return data

def get_sim_cb(cur,id_user):
    cur.execute("""SELECT CustomerId FROM whatseat.cb_similarity WHERE CustomerId = %s """,(id_user,))
    res = cur.fetchall()
    print('res',len(res))
    
    return len(res)
