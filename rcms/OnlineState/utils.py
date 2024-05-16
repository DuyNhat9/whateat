import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
import fetch_data
import json
# find_candidate_items: find list of items that can be recommended.
# These should not have been watched by any member of group.
def find_candidate_items(ratings, members):
    if len(members) == 0: return []

    unwatched_items = np.argwhere(ratings[members[0]] == 0)
    for member in members:
        cur_unwatched = np.argwhere(ratings[member] == 0)
        unwatched_items = np.intersect1d(unwatched_items, cur_unwatched)

    return unwatched_items

# display_results: is used to config what show in json result
def display_results(mysql,list_item_id):
    return pd.DataFrame(list_item_id, columns=['id']).to_dict('records')
    # cur = mysql.connection.cursor()
    # cur.execute("""SELECT id, name, director, description FROM moviedb.movie WHERE id IN %s""",(tuple(list_item_id),))
    # # print('id: ', id)
    # res = cur.fetchall()
    # cur.close()
    # return pd.DataFrame(res, columns=['id','movie_title','director','decription']).to_dict('records')
    

# check_new_user: set threshold to determine wether the user is newuser or not
def check_new_user(cur, id_user):
    # get movies that had watched by input user from database
    recipeIds = fetch_data.recipe_love_by_user(cur, id_user)
    isModelBuild = fetch_data.get_sim_cb(cur,id_user)
    return recipeIds, len(recipeIds) < 50, len(recipeIds) , isModelBuild

def check_new_user_product(cur,id_user):
    productIds = fetch_data.product_love_by_user(cur, id_user)
    return productIds, len(productIds) < 20, len(productIds)
    
def to_json(text):
    return json.loads(text)[0]

def to_json_product(text):
    return json.loads(text)

def list_to_string(items):
    if len(items) > 1:
        return (' '.join(str(e) for e in items))
    
    return str(items[0])