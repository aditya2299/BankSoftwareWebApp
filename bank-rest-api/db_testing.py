import os
import sqlite3
import pandas as pd
from pathlib import Path


cwd = Path.cwd()
db_path = str(Path(cwd).parent) + '\database\db.db'
con = sqlite3.connect(db_path)
con.row_factory = lambda cursor, row: row[0]
c = con.cursor()
#df_match = pd.read_sql_query("SELECT * FROM CustomerStatus;", con)
#df_match = pd.read_sql_query("SELECT * FROM AccountStatus;", con)
ssn_list = c.execute('SELECT ssn_id FROM CustomerStatus').fetchall()
print(ssn_list)
#print(df_match)