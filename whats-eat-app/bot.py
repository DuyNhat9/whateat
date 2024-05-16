from flask import Flask
app = Flask(__name__)
import requests

@app.route('/')
def hello():
    r = requests.get('https://localhost:7029/api/Store/storeCategories/2',verify=False)
    return r.text

app.run()