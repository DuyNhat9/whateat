import flask
from flask import request, jsonify, abort, Flask
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow
import json
from sqlalchemy import true
import fetch_data
import utils
import jwt
from math import isnan
import datetime
import KRNN_recommend_engine
app = flask.Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123123@localhost/whatseat'
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_PORT'] = None
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123123'
app.config['MYSQL_DB'] = 'whatseat'
app.config['JSON_AS_ASCII'] = False

mysql = MySQL(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

# begin my own new code

class Stores(db.Model):

    StoreId = db.Column(db.Integer, primary_key = True)
    PhoneNumber = db.Column(db.Text())
    Address = db.Column(db.Text())
    ProvinceCode = db.Column(db.Integer(),nullable=False)
    DistrictCode = db.Column(db.Integer(),nullable=False)
    WardCode = db.Column(db.Integer(),nullable=False)
    Description = db.Column(db.Text())
    IsActive = db.Column(db.Integer(), default = 1)
    AvatarUrl = db.Column(db.Text())
    UserId = db.Column(db.String(100),db.ForeignKey('Aspnetusers.Id'),nullable=False)
    Email = db.Column(db.Text())
    ShopName = db.Column(db.Text())
    AvgRating = db.Column(db.Float(), default = 10)

    def __init__(self, PhoneNumber, Address, ProvinceCode, DistrictCode, WardCode, Description, Email, ShopName):

        self.PhoneNumber = PhoneNumber
        self.Address = Address
        self.ProvinceCode = ProvinceCode
        self.DistrictCode = DistrictCode
        self.WardCode = WardCode
        self.Description = Description
        self.Email = Email
        self.ShopName = ShopName

class StoreSchema(ma.Schema):
    class Meta:
        fields = ('StoreId', 'PhoneNumber', 'Address', 'ProvinceCode', 'DistrictCode', 'WardCode', 'Description', 'IsActive', 'AvatarUrl', 'UserId', 'Email', 'ShopName', 'AvgRating','UserName')

store_schema = StoreSchema()
stores_schema = StoreSchema(many=True)

class Products(db.Model):

    ProductId = db.Column(db.Integer, primary_key = True,nullable=False)
    Name = db.Column(db.Text())
    InStock = db.Column(db.Integer(),nullable=False)
    BasePrice = db.Column(db.Integer(),nullable=False)
    PhotoJson = db.Column(db.Text())
    Description = db.Column(db.Text())
    WeightServing = db.Column(db.Text())
    TotalSell = db.Column(db.Integer(),nullable=False)
    ProductCategoryId = db.Column(db.Integer(),nullable=False)
    StoreId = db.Column(db.Integer())
    CreatedOn = db.Column(db.DateTime, default = '2022-05-04 00:00:00' )
    ProductNo = db.Column(db.Text(),nullable=False)
    Status = db.Column(db.Integer(), default = 1)


    def __init__(self, ProductId, Name, InStock, BasePrice, Description, TotalSell, ProductCategoryId, StoreId, CreatedOn, ProductNo, Status):

        self.ProductId = ProductId
        self.Name = Name
        self.InStock = InStock
        self.BasePrice = BasePrice
        self.Description = Description
        self.TotalSell = TotalSell
        self.ProductCategoryId = ProductCategoryId
        self.StoreId = StoreId
        self.CreatedOn = CreatedOn
        self.ProductNo = ProductNo
        self.Status = Status

class ProductSchema(ma.Schema):
    class Meta:
        fields = ('ProductId', 'Name', 'InStock', 'BasePrice','PhotoJson', 'Description','WeightServing', 'TotalSell', 'ProductCategoryId', 'StoreId', 'CreatedOn', 'ProductNo', 'Status')

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

class Aspnetusers(db.Model):

    Id = db.Column(db.Integer, primary_key = True)
    UserName = db.Column(db.Text())
    NormalizedUserName = db.Column(db.Text())
    Email = db.Column(db.Text())
    NormalizedEmail = db.Column(db.Text())
    EmailConfirmed = db.Column(db.Integer(),default = 0)
    PasswordHash = db.Column(db.Text())
    SecurityStamp = db.Column(db.Text())
    ConcurrencyStamp = db.Column(db.Text())
    PhoneNumber = db.Column(db.Text())
    PhoneNumberConfirmed = db.Column(db.Text(),default = 0)
    TwoFactorEnabled = db.Column(db.Integer(),default = 0)
    LockoutEnd = db.Column(db.DateTime())
    LockoutEnabled = db.Column(db.Integer(),default = 1)
    AccessFailedCount = db.Column(db.Integer(),default = 0)

    def __init__(self, Id, UserName, Email, PhoneNumber):

        self.Id = Id
        self.UserName = UserName
        self.PhoneNumber = PhoneNumber
        self.Email = Email

class UserSchema(ma.Schema):
    class Meta:
        fields = ('Id', 'UserName', 'NormalizedUserName', 'Email', 'NormalizedEmail', 'EmailConfirmed', 'PasswordHash', 'SecurityStamp', 'ConcurrencyStamp', 'PhoneNumber', 'PhoneNumberConfirmed', 'TwoFactorEnabled', 'LockoutEnd', 'LockoutEnabled', 'AccessFailedCount')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class Orderdetails(db.Model):

    OrderId = db.Column(db.Integer, primary_key = True)
    ProductId = db.Column(db.Integer,db.ForeignKey('products.ProductId'), nullable=False)
    Quantity = db.Column(db.Integer,nullable=False)
    Price = db.Column(db.Integer,nullable=False)

    orders = db.relationship('Products',backref = 'order', lazy = 'select')

    def __init__(self, OrderId, ProductId, Quantity, Price):

        self.OrderId = OrderId
        self.ProductId = ProductId
        self.Quantity = Quantity
        self.Price = Price


class OrderdetailSchema(ma.Schema):
    class Meta:
        fields = ('OrderId', 'ProductId', 'Quantity', 'Price','Name')# check

orderdetail_schema = OrderdetailSchema()
orderdetails_schema = OrderdetailSchema(many=True)

class Orderstatushistories(db.Model):

    OrderStatusHistoryId = db.Column(db.Integer, primary_key = True)
    OrderStatusId = db.Column(db.Integer())
    OrderId = db.Column(db.Integer())
    Message = db.Column(db.Text())
    CreatedOn = db.Column(db.DateTime,nullable=False)
    ByUser = db.Column(db.Integer(),default = 0)

    def __init__(self, OrderStatusHistoryId, OrderStatusId, OrderId, Message):

        self.OrderStatusHistoryId = OrderStatusHistoryId
        self.OrderStatusId = OrderStatusId
        self.OrderId = OrderId
        self.Message = Message

class OrderhistorySchema(ma.Schema):
    class Meta:
        fields = ('OrderStatusHistoryId', 'OrderStatusId', 'OrderId', 'Message', 'CreatedOn', 'ByUser')

orderhistory_schema = OrderhistorySchema()
orderhistorys_schema = OrderhistorySchema(many=True)

class Productreviews(db.Model):

    ProductReviewId = db.Column(db.Integer, primary_key = True)
    Rating = db.Column(db.Integer(),nullable=False)
    Comment = db.Column(db.Text())
    CreatedOn = db.Column(db.DateTime(),nullable=False)
    ProductId = db.Column(db.Integer,nullable=False)
    CustomerId = db.Column(db.Integer(),nullable=False)

    def __init__(self, ProductReviewId, Rating, Comment, ProductId):

        self.ProductReviewId = ProductReviewId
        self.Rating = Rating
        self.Comment = Comment
        self.ProductId = ProductId

class ProductreviewSchema(ma.Schema):
    class Meta:
        fields = ('ProductReviewId', 'Rating', 'Comment', 'CreatedOn', 'ProductId', 'CustomerId')

productreview_schema = ProductreviewSchema()
productreviews_schema = ProductreviewSchema(many=True)

@app.route('/getorder', methods = ['GET'])
def get_orders():

    orders = db.session.query(Orderdetails.OrderId,Products.Name,Orderdetails.Quantity,Orderdetails.Price).join(Products,Products.ProductId == Orderdetails.ProductId).all()
    return orderdetails_schema.jsonify(orders)

@app.route('/gethistory/<OrderStatusId>', methods = ['GET'])
def get_histories(OrderStatusId):
    histories = Orderstatushistories.query.get(OrderStatusId)
    return orderhistory_schema.jsonify(histories) # bang ko danh cho status

@app.route('/sale', methods = ['GET'])
def get_sales():
    high_sales = Products.query.filter(Products.TotalSell >= 15000).all()
    return products_schema.jsonify(high_sales)

@app.route('/get', methods = ['GET'])
def get_data():
    token = request.headers['Authorization']
    # TODO  tao ham cho 200-202
    x = token.split()
    secret = 'voqytdgraffwyrikpidzcdupfkysehkd'
    payload = jwt.decode(x[1], secret, algorithms=['HS256'] , verify=True)
    # TODO khi token null thi dan de login
    data = Stores.query.filter_by(Email=payload['email']).all()
    #data = db.session.query(Stores,)
    return stores_schema.jsonify(data)

@app.route('/getorder1', methods = ['GET'])
def get_order1():
    data = Orderstatushistories.query.filter_by(OrderStatusId = 1).all()
    return orderhistorys_schema.jsonify(data)

@app.route('/getorder2', methods = ['GET'])
def get_order2():
    data = Orderstatushistories.query.filter_by(OrderStatusId = 2).all()
    return orderhistorys_schema.jsonify(data)

@app.route('/getorder3', methods = ['GET'])
def get_order3():
    data = Orderstatushistories.query.filter_by(OrderStatusId = 3).all()
    return orderhistorys_schema.jsonify(data)

@app.route('/getorder4', methods = ['GET'])
def get_order4():
    data = Orderstatushistories.query.filter_by(OrderStatusId = 4).all()
    return orderhistorys_schema.jsonify(data)

@app.route('/getshopuser', methods = ['GET'])
def get_users():
    all_users = db.session.query(Aspnetusers,Stores)\
    .filter(Stores.UserId == Aspnetusers.Id).first()
    return users_schema.jsonify(all_users)

@app.route('/add', methods = ['POST'])
def add_store():
    ShopName = request.json['ShopName']
    PhoneNumber = request.json['PhoneNumber']
    Email = request.json['Email']
    Address = request.json['Address']
    ProvinceCode = request.json['ProvinceCode']
    DistrictCode = request.json['DistrictCode']
    WardCode = request.json['WardCode']
    Description = request.json['Description']

    store = Stores(ShopName, PhoneNumber, Address, Email, ProvinceCode, DistrictCode, WardCode, Description )
    db.session.add(store)
    db.session.commit()
    return store_schema.jsonify(store)

@app.route('/update/<StoreId>', methods = ['PUT'])
def update_store(StoreId):
    store = Stores.query.get(StoreId)

    ShopName = request.json['ShopName']
    PhoneNumber = request.json['PhoneNumber']
    Email = request.json['Email']
    Address = request.json['Address']
    ProvinceCode = request.json['ProvinceCode']
    DistrictCode = request.json['DistrictCode']
    WardCode = request.json['WardCode']
    Description = request.json['Description']

    store.ShopName = ShopName
    store.PhoneNumber = PhoneNumber
    store.Email = Email
    store.Address = Address
    store.ProvinceCode = ProvinceCode
    store.DistrictCode = DistrictCode
    store.WardCode = WardCode
    store.Description = Description

    db.session.commit()
    return store_schema.jsonify(store)

@app.route('/delete/<StoreId>', methods = ['DELETE'])
def delete_store(StoreId):
    store = Stores.query.get(StoreId)
    db.session.delete(store)
    db.session.commit()

    return store_schema.jsonify(store)

# end my own new code

@app.route('/', methods=['GET'])
def home():
    return """<h1>What's eat recommend engine</h1>
              <p>This site is APIs for getting list of recommend products.</p>"""

def individual_recommend_list_recipes(id_user, user_kcal, n_recipe,page,level,mintime,maxtime,allergy):
    cur = mysql.connection.cursor()
    rec_ids, is_newuser, is_notlove, is_build = utils.check_new_user(cur, id_user)
    if is_newuser:
        if is_notlove == 0 or is_build == 0:
            print("New user with filter!")
            rec_list = fetch_data.get_top_recipe(cur,user_kcal,n_recipe,page,level,mintime,maxtime,allergy)['id'].to_list()
            cur.close()
        else:    
            print("New user detected!")
            rec_list = fetch_data.get_recommend_list_cb(id_user,user_kcal,n_recipe,page,cur,level,mintime,maxtime,allergy)['id1'].to_list()
            cur.close()    

    cur = mysql.connection.cursor()
    print(rec_list)
    rec_list2 = fetch_data.get_list_recipents_by_index(cur,rec_list)
    cur.close()
    rec_list2['images'] = rec_list2['images'].apply(utils.to_json)
    return rec_list2

def individual_recommend_list_products(id_user, n_product):
    cur = mysql.connection.cursor()
    rec_ids, is_newuser, is_notlove = utils.check_new_user_product(cur, id_user)

    if is_newuser:
        if is_notlove == 0:
            print("New user with filter!")
            rec_list = []
            rec_list = fetch_data.get_top_products(cur,n_product)['id'].to_list()
            cur.close()
        else:    
            print("New user detected!")
            rec_list = []
            rec_list = fetch_data.get_recommend_list_product_cb(id_user,n_product,cur)['id1'].to_list()
            cur.close()
    else:
        rec_list = []
        for rating ,id_product in individual_item_based(id_user):
            if(rating >= 3):
                rec_list.append(id_product)

    cur = mysql.connection.cursor()
    rec_list2 = fetch_data.get_top_product_low_price(cur,rec_list)
    cur.close()
    # print(rec_list2)
    rec_list2['images'] = rec_list2['images'].apply(utils.to_json_product)
    return rec_list2

@app.route('/individual/product/', methods=['GET'])
def individual_state1_api():
    if 'id_user' in request.args:
        id_user = request.args['id_user']
        n_product = int(request.args['n_product'])

    else:
        return """Error: No id field provided. Please specify an id.
                (URL: /individual/product?id_user= ...&n_product=...)
                """
    
    rec_list = individual_recommend_list_products(id_user,n_product)
    # print(rec_list)
    return jsonify(rec_list.to_dict('records'))

#Recommend recipe 
@app.route('/individual/recipe/', methods=['GET'])
def individual_recipe_api():
    if 'id_user' in request.args:
        id_user = request.args['id_user']
        user_kcal = float(request.args['user_kcal'])
        n_recipe = int(request.args['n_recipe'])
        page = int(request.args['page'])
        level = request.args['level']
        mintime = int(request.args['mintime'])
        maxtime = int(request.args['maxtime'])
        allergy = request.args['allergy']
    else:
        return """Error: No id field provided. Please specify an id.
                (URL: /individual/recipe)
                """
    
    rec_list = individual_recommend_list_recipes(id_user,user_kcal,n_recipe,page,level,mintime,maxtime,allergy)
    # print(rec_list)
    return jsonify(rec_list.to_dict('records'))

@app.route('/individual/product/apriori', methods=['GET'])
def individual_product_apriori():
    if 'id_product' in request.args:
        list_product = request.args.getlist('id_product')
    else:
        abort(500,'{"message":"Error: No id field provided. Please specify an id.(URL: /individual/product/apriori?id_product= ... &id_product= ...)"}')
        
    list_product = list(map(int, list_product))
    list_product = utils.list_to_string(sorted(list_product))
    cur = mysql.connection.cursor()
    
    print('number',list_product)
    result = fetch_data.get_product_priori(cur, list_product)
    if result.index.stop <=0 :
        abort(500,'{"message":"Error: No products is recommneded ')
    result = result.drop_duplicates()
    result = fetch_data.get_product_by_list_id(cur,result['consequents'].to_list())
    cur.close()
    result['images'] = result['images'].apply(utils.to_json_product)
    return jsonify(result.to_dict('record'))

@app.route('/individual/recipe/apriori', methods=['GET'])
def individual_recipe_apriori():
    if 'id_recipe' in request.args:
        list_recipe = request.args.getlist('id_recipe')
    else:
        abort(500,'{"message":"Error: No id field provided. Please specify an id.(URL: /individual/product/apriori?id_product= ... &id_product= ...)"}')
        
    list_recipe = list(map(int, list_recipe))
    list_recipe = utils.list_to_string(sorted(list_recipe))
    cur = mysql.connection.cursor()
    
    result = fetch_data.get_recipe_priori(cur, list_recipe)
    print(result)
    if result.index.stop <=0 :
        abort(500,'{"message":"Error: No products is recommneded ')
    result = result.drop_duplicates()
    result = fetch_data.get_list_recipents_by_index(cur,result['consequents'].to_list())
    cur.close()
    result['images'] = result['images'].apply(utils.to_json)
    return jsonify(result.to_dict('record'))

@app.route('/get_min_max_date/<StoreId>', methods = ['GET'])
def get_store_min_max_date(StoreId):
    start_from = request.args.get('start_from')
    start_to = request.args.get('start_to')
    condition = "where orders.CreatedOn >= '{0}' and orders.CreatedOn < '{1}' and orders.StoreId = {2}".format(start_from, start_to, StoreId)
    if (start_from == "" and start_to == ""):
        condition = "where orders.StoreId = {0}".format(StoreId)
    else:
        if (start_to == ""):
            condition = "where orders.CreatedOn >= '{0}' and orders.StoreId = {1}".format(start_from, StoreId)
        elif (start_from == ""):
            condition = "where orders.CreatedOn <= '{0}' and orders.StoreId = {1}".format(start_to, StoreId)
        elif start_from == start_to:
            date_1 = datetime.datetime.strptime(start_from, '%Y-%m-%d')
            end_date = date_1 + datetime.timedelta(days=1)
            start_to = end_date.strftime('%Y-%m-%d')
    print(start_from, start_to)
    cur = mysql.connection.cursor()

    request_url = """
        SELECT date(orders.CreatedOn), sum(BasePrice) as TotalSell FROM whatseat.orders 
        INNER JOIN orderdetails on orders.OrderId = orderdetails.OrderId
        INNER JOIN products on orderdetails.ProductId = products.ProductId
        {0}
        GROUP BY date(orders.CreatedOn)
    """.format(condition)
    cur.execute(request_url)
    data = cur.fetchall()
    if data is not None:
       
        x = []
        for temp in data:
            date_str = temp[0].strftime("%Y-%m-%d")
            x.append(
            {
                "date": date_str,
                "value": int(str(temp[1]))
            }
            )
        # x = 
        y = json.dumps(x) 
        return y
    return json.dumps([{}])

@app.route('/get_sale_by_date/<StoreId>', methods = ['GET'])
def get_store_sale_by_date(StoreId):
    date = request.args.get('date')
    condition = "where orders.CreatedOn >= '{0}' and orders.StoreId = {1}".format(date, StoreId)
    cur = mysql.connection.cursor()

    request_url = """
        SELECT orders.OrderId, sum(BasePrice), count(*) FROM whatseat.orders 
        INNER JOIN orderdetails on orders.OrderId = orderdetails.OrderId
        INNER JOIN products on orderdetails.ProductId = products.ProductId
        {0}
        group by orders.OrderId
    """.format(condition)
    cur.execute(request_url)
    data = cur.fetchall()
    total_transaction = 0
    total_sales = 0
    if data is not None:
        total_transaction = len(data)
        for i in data:
            total_sales += i[1]
        x = {
            "date":date,
            "total_sales": int(str(total_sales)),
            "total_transaction": int(total_transaction)
        }
        y = json.dumps(x) 
        return y
    return json.dumps({})


def individual_item_based(id_user):
    cur = mysql.connection.cursor()
    print("Old user detected!")
    ratings = fetch_data.get_product_review(cur)
    sim_df= fetch_data.similarity_item_df(cur)

    #get matrix data 
    data = ratings.pivot_table(index=['ProductId'],columns=['CustomerId'],values='Rating')

    #convert to dictionary
    sdd = data.dropna(how = 'all').to_dict()
    clean_dict = {k: {j: sdd[k][j] for j in sdd[k] if not isnan(sdd[k][j])} for k in sdd}

    dataset = clean_dict

    return KRNN_recommend_engine.recommendation_phase(id_user,dataset,sim_df)
    

app.run()