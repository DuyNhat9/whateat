import pandas as pd
import MySQLdb
import fetch
import utils
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy import spatial
from sqlalchemy import create_engine

conn = MySQLdb.connect(host="127.0.0.1", user="root", passwd="123123", db="whatseat")
cur = conn.cursor()
product_df = fetch.product_df(cur)
product_df = product_df.dropna()
cur.close()

product_df['tags'] = product_df['ProductCategoryName']
new = product_df.drop(columns=['ProductCategoryName'])

print(new['tags'])
# new['tags'] = new['tags'].apply(lambda x: " ".join(x))

cv = TfidfVectorizer(max_features=20447,stop_words='english')
vector = cv.fit_transform(new['tags']).toarray()

dataframe = pd.DataFrame(vector,index = product_df['ProductId'])

#get user profile interact with web
cur = conn.cursor()
list_user = fetch.get_list_user(cur)['CustomerId'].values.tolist()
cur.close()

#truncate table sim
cursor= conn.cursor()
cursor.execute("TRUNCATE TABLE whatseat.cb_product_similarity")
cursor.close()

for user in list_user:
    cur = conn.cursor()
    user_profile = fetch.get_user(cur,user)
    cur.close()
    user_profile['rating'] = 1
    #Lấy ra các vector item user đã like 
    user_tags_df = dataframe[dataframe.index.isin(user_profile.ProductId)]
    user_tags_df.reset_index(drop=True, inplace=True)
    
    #Lấy ra các vector item user chưa like 
    unlove_recipe_df = dataframe[~dataframe.index.isin(user_profile.ProductId)]

    #Tạo user profile từ các vector 
    user_profile = user_tags_df.T.dot(user_profile.rating)
    weight = user_profile / len(user_tags_df.index)

    #Tính độ tương đồng của user profile với các item profile chưa like
    similarity = unlove_recipe_df.apply(lambda row: 1 - spatial.distance.cosine(row, weight.array), axis=1)
    
    #Insert độ tương đồng giữa user profile và item profile vào db
    sim_df = pd.DataFrame({'ProductId':similarity.index, 'Similarity':similarity.values})
    sim_df['CustomerId'] = user
    columns_titles = ["ProductId", "CustomerId", "Similarity"]
    df_reorder=sim_df.reindex(columns=columns_titles)
    df_reorder = df_reorder.sort_values(by='Similarity', ascending=False)

    object_list = list(df_reorder.to_records(index=False))
    my_conn = create_engine("mysql+mysqldb://root:123123@localhost/whatseat")
    df_reorder.to_sql(con=my_conn,name='cb_product_similarity',if_exists='append',index=False)
    # fields = ("ProductId", "CustomerId", "Similarity")

    # utils.upsert(conn, "cb_product_similarity", fields, object_list)