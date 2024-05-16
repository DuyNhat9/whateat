#import sklearn library
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import MySQLdb
import fetch
import sim
from math import isnan


def main():
    conn = MySQLdb.connect(host="127.0.0.1", user="root", passwd="123123", db="whatseat")
    cur = conn.cursor()
    ratings = fetch.product_ratings(cur)
    ratings.dropna()

    #get matrix data 
    data = ratings.pivot_table(index=['ProductId'],columns=['CustomerId'],values='Rating')

    #convert to dictionary
    sdd = data.dropna(how = 'all').to_dict()
    clean_dict = {k: {j: sdd[k][j] for j in sdd[k] if not isnan(sdd[k][j])} for k in sdd}

    dataset = clean_dict

    cursor = conn.cursor()
    cursor.execute("TRUNCATE TABLE whatseat.item_base_similarity")
    cursor.close()
    
    sim.item_similarity(conn,dataset)

if __name__ == "__main__":
    main()