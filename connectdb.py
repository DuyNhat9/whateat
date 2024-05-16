import pyodbc
# print(pyodbc.drivers())
server = 'DESKTOP-HFADRBI' 
database = 'movie' 
username = 'sa' 
password = '11111111' 
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute('SELECT * FROM rating')
for i in cursor:
    print(i)
