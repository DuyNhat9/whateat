import pandas as pd
import MySQLdb
import fetch
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import association_rules, apriori
from sqlalchemy import create_engine

conn = MySQLdb.connect(host="127.0.0.1", user="root", passwd="123123", db="whatseat")
cur = conn.cursor()

#lấy dataframe món ăn
transaction_df = fetch.transaction_df(cur)
transaction_df.drop(transaction_df[transaction_df['ProductId']=='None'].index,inplace=True)


cur.close()

transaction_list = []

for i in transaction_df["OrderId"].unique():
    tlist = list(set(transaction_df[transaction_df["OrderId"]==i]["ProductId"]))
    if len(tlist) > 0:
        transaction_list.append(tlist)

print(len(transaction_list))

te = TransactionEncoder()
te_ary = te.fit(transaction_list).transform(transaction_list)
df2 = pd.DataFrame(te_ary,columns = te.columns_)


frequent_itemsets = apriori(df2, min_support=0.01,use_colnames=True)
rules = association_rules(frequent_itemsets,metric='lift',min_threshold=1.0)
frequent_itemsets['length'] = frequent_itemsets['itemsets'].apply(lambda x: len(x))

rules.sort_values('confidence', ascending = False)
rules['antecedents'] = rules['antecedents'].apply(fetch.convert_frozenset)
rules['consequents'] = rules['consequents'].apply(fetch.convert_frozenset)
my_conn = create_engine("mysql+mysqldb://root:123123@localhost/whatseat")
rules = rules.drop(columns=['conviction'])
rules.to_sql(con=my_conn,name='apriori',if_exists='append',index=False)