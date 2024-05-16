import json

def convert_content(text):
    L = []
    for i in json.loads(text):
        L.append(i['content']) 
    return L 

def convert_ingredient(text):
    L = []
    for i in json.loads(text):
        if(i['name'] != None):
            L.append(i['name']) 
    return L 

def upsert(conn, table, fields, object_list):
    cursor = conn.cursor()
    table = "`"+table+"`"
    fields = ["`"+field+"`" for field in tuple(fields)]
    placeholders = ["%s" for field in fields]
    assignments = ["{x} = VALUES({x})".format(
        x=x
    ) for x in fields]

    query_string = """INSERT INTO
    {table}
    ({fields})
    VALUES
    ({placeholders})
    ON DUPLICATE KEY UPDATE {assignments}""".format(
                                                    table=table,
                                                    fields=", ".join(fields),
                                                    placeholders=", ".join(placeholders),
                                                    assignments=", ".join(assignments)
                                                    )
    
    cursor.executemany(query_string, object_list)
    conn.commit()
    print(table + ' upserts successfully')

def insert_sim(conn, table, fields, object_list):
    cursor = conn.cursor()
    table = "`"+table+"`"
    fields = ["`"+field+"`" for field in tuple(fields)]
    placeholders = ["%s" for field in fields]
    assignments = ["{x} = VALUES({x})".format(
        x=x
    ) for x in fields]

    query_string = """INSERT INTO
    {table}
    ({fields})
    VALUES
    ({placeholders})
    ON DUPLICATE KEY UPDATE {assignments}""".format(
                                                    table=table,
                                                    fields=", ".join(fields),
                                                    placeholders=", ".join(placeholders),
                                                    assignments=", ".join(assignments)
                                                    )

    cursor.executemany(query_string, object_list)
    conn.commit()
    print(table + ' upserts successfully')

def convertDataframeToList(dataframe):
    L = []
    for col in dataframe.columns:
        for idx in dataframe.index:
            value = dataframe.loc[idx, col]
            column, row = col, idx
            L.append([column,row,value])
    return L

def convert_type(text):
    
    L = []
    for i in json.loads(text):
        if(i['Type'] != None):
            L.append(i['Type']) 
    return L 