from sklearn.metrics.pairwise import cosine_similarity

def item_similarity(conn,dataset):
    list_items = unique_items(dataset)
    for item1 in list_items:
        list_sim = []
        for item2 in list_items:
            if item1 != item2:
                both_rated = {}
                for person in dataset.keys():
                    if item1 in dataset[person] and item2 in dataset[person]: # vòng lặp lấy ra lần lượt 2 items bất kỳ
                        both_rated[person] = [dataset[person][item1],dataset[person][item2]] # danh sách người dùng đều đã đánh giá cả 2 item này

            # print(both_rated)
                number_of_ratings = len(both_rated) # số lượng người dùng đều đã đánh giá 2 item này
                if number_of_ratings == 0:
                    list_sim.append((item1,item2,0))
                    continue
                # danh sách các điểm đánh giá của tất cả người dùng trong hệ thống đã từng đánh giá item1
                item1_ratings = [[dataset[k][item1] for k,v in both_rated.items() if item1 in dataset[k] and item2 in dataset[k]]]
                # danh sách các điểm đánh giá của tất cả người dùng trong hệ thống đã từng đánh giá item2
                item2_ratings = [[dataset[k][item2] for k, v in both_rated.items() if item1 in dataset[k] and item2 in dataset[k]]]
                # sử dụng consine_similarity để tính độ tương đồng của 2 item
                cs = cosine_similarity(item1_ratings,item2_ratings)
                list_sim.append((item1,item2,cs[0][0]))

        fields = ("id1", "id2", "similarity")
        upsert(conn, "item_base_similarity", fields, list_sim)
        print(str(item1) +"upserts successfully")

# Tao ra danh sach cac items khong trung nhau, nguoi dung da danh gia
def unique_items(dataset):
    unique_items_list = []
    for person in dataset.keys():
        for items in dataset[person]:
            unique_items_list.append(items)
    s=set(unique_items_list)
    unique_items_list=list(s)
    return unique_items_list

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
