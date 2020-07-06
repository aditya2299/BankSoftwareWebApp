from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
import os
from pathlib import Path
import sqlite3
import pandas as pd
from random import choice
from datetime import datetime

app = Flask(__name__)
CORS(app)
api = Api(app)

@app.route('/')
def index():
    return 'Server is UP and RUNNING!!'


class userValidation(Resource):

    def post(self):
        if (request.data):
            some_json = request.get_json()
            userName = some_json["userName"]
            password = some_json["password"]
            userProfile = some_json["profile"]["prName"]

            #QUERY FOR VALIDATION
            con = connect()

            con.row_factory = lambda cursor, row: row[0]
            c = con.cursor()
            u_names = c.execute('SELECT userName FROM login').fetchall()
            u_pass = c.execute('SELECT password FROM login').fetchall()
            u_profiles = c.execute('SELECT prName FROM login').fetchall()

            if userName in u_names:
                u_id = u_names.index(userName)
                if password == u_pass[u_id] and userProfile == u_profiles[u_id]:
                    
                    c.close()
                    con.close()
                    #return 200
                    return some_json, 200
                else:
                    c.close()
                    con.close()
                    #return 404
                    return {}, 404
            else:
                c.close()
                con.close()
                #return 404
                return {}, 404
                


class CustomerBySSNID(Resource):

    def get(self, ssn_id):
        #print("SSN_ID",ssn_id)
        new_ssn_id = int(ssn_id)
        con = connect()
        new_con = connect()
        con.row_factory = lambda cursor, row: row[0]
        c = con.cursor()
        new_c = new_con.cursor()
        ssn_id_list = c.execute('SELECT ssn_id FROM CustomerStatus').fetchall()
        #print(ssn_id_list)
        if new_ssn_id in ssn_id_list:
            #WHERE QUERY TO SELECT THE RECORD
            cust_tuple = new_c.execute('SELECT * FROM CustomerStatus WHERE ssn_id = {}'.format(new_ssn_id)).fetchone()
            #print(cust_tuple)
            cust_dict = {'SSN_ID':cust_tuple[0],
                         'CUST_ID':cust_tuple[1],
                         'Name':cust_tuple[2],
                         'Age':cust_tuple[3],
                         'Address': cust_tuple[4],
                         'City': cust_tuple[5],
                         'State': cust_tuple[6],
                         'timestamp': cust_tuple[7],
                         'Status': cust_tuple[8],
                         'Message': cust_tuple[9],
                        }
            
            c.close()
            con.close()
            new_c.close()
            new_con.close()
            
            return cust_dict, 200
        else:
            c.close()
            con.close()
            new_c.close()
            new_con.close()

            return {}, 404



class CustomerByCUSTID(Resource):

    def get(self, cust_id):
        new_cust_id = int(cust_id)
        con = connect()
        new_con = connect()
        con.row_factory = lambda cursor, row: row[0]
        c = con.cursor()
        new_c = new_con.cursor()
        cust_id_list = c.execute('SELECT cust_id FROM CustomerStatus').fetchall()
        #print(cust_id_list)
        if new_cust_id in cust_id_list:
            #WHERE QUERY TO SELECT THE RECORD
            cust_tuple = new_c.execute('SELECT * FROM CustomerStatus WHERE cust_id = {}'.format(new_cust_id)).fetchone()
            #print(cust_tuple)
            cust_dict = {'SSN_ID':cust_tuple[0],
                         'CUST_ID':cust_tuple[1],
                         'Name':cust_tuple[2],
                         'Age':cust_tuple[3],
                         'Address': cust_tuple[4],
                         'City': cust_tuple[5],
                         'State': cust_tuple[6],
                         'timestamp': cust_tuple[7],
                         'Status': cust_tuple[8],
                         'Message': cust_tuple[9],
                        }
            
            c.close()
            con.close()
            new_c.close()
            new_con.close()

            return cust_dict, 200
        else:
            c.close()
            con.close()
            new_c.close()
            new_con.close()

            return {}, 404


    def delete(self, cust_id):
        new_cust_id = int(cust_id)
        timestamp = datetime.fromtimestamp(datetime.timestamp(datetime.now()))
        #print(new_cust_id)
        con = connect()    
        c = con.cursor()

        delete_statement = '''UPDATE CustomerStatus SET status = 'Inactive', timestamp = '{}',
                                message = 'Customer Deleted' WHERE cust_id = '{}';'''.replace('\n',' ')
        formatted_statement = delete_statement.format(timestamp,new_cust_id)
        c.execute(str(formatted_statement))

        delete_acc = '''UPDATE AccountStatus SET acc_status = 'Inactive', acc_timestamp = '{}',
                            acc_message = 'Account Deleted' WHERE acc_cust_id = '{}';'''.replace('\n',' ')
        formatted_statement = delete_acc.format(timestamp,new_cust_id)
        c.execute(str(formatted_statement))
        
        con.commit()

        c.close()
        con.close()

        return 200



class Customers(Resource):

    def get(self):
        con = connect()
        c = con.cursor()
        c.execute('SELECT * FROM CustomerStatus;')
        cust_list = c.fetchall()
        final_list = []
        for i in cust_list:
            cust_dict = {'SSN_ID':i[0], 'CUST_ID':i[1],'Name':i[2],'Age':i[3],
                            'Address':i[4],'City':i[5],'State':i[6],'timestamp':i[7],
                            'Status':i[8],'Message':i[9]}
            final_list.append(cust_dict)
            
        c.close()
        con.close()

        return final_list


    def post(self):
        some_json = request.get_json()
        ssn_id = int(some_json["SSN_ID"])
        cust_name = some_json["Name"]
        age = int(some_json["Age"])
        address = some_json["Address"]
        state = some_json["State"]
        city = some_json["City"]
        timestamp = datetime.fromtimestamp(datetime.timestamp(datetime.now()))
        status = 'Pending'
        message = 'Customer Created'

        #QUERY FOR CREATING ACCOUNT
        con = connect()

        con.row_factory = lambda cursor, row: row[0]
        c = con.cursor()

        c.execute('CREATE TABLE IF NOT EXISTS CustomerStatus' +
                    '(ssn_id int, cust_id int primary key, ' +
                    'name varchar(100), age int, address varchar(255),' +
                    'city varchar(100), state varchar(100),' +
                    'timestamp varchar(100),status varchar(100), message varchar(100));')
        
        rows = c.execute('SELECT COUNT(*) AS RowCnt FROM CustomerStatus').fetchall()
        
        if rows[0] == 0:
            cust_id = choice(range(100000000,999999999))
        else:
            u_cust_id = c.execute('SELECT cust_id FROM CustomerStatus').fetchall()
            cust_id = choice(range(100000000,999999999))
            while cust_id in u_cust_id:
                cust_id = choice(range(100000000,999999999))

        #CHECK IF ALREADY AN SSN_ID EXISTS
        ssn_list = c.execute('SELECT ssn_id FROM CustomerStatus').fetchall()
        #print(ssn_id)
        #print(ssn_list)
        if ssn_id in ssn_list:
            #SSN DUPLICATION ERROR
            c.close()
            con.close()

            return 404
        
        else:
            insert_statement = '''INSERT INTO CustomerStatus(ssn_id,cust_id, name, age, address, city,
                               state, timestamp, status, message) VALUES
                           ({},{},'{}',{},'{}','{}','{}','{}','{}','{}');'''.replace('\n',' ')
            formatted_statement = insert_statement.format(ssn_id,cust_id, cust_name, age,
                                  address, city, state, timestamp, status, message)
            c.execute(str(formatted_statement))
            con.commit()

            c.close()
            con.close()

            return 201

    
    def put(self):
        some_json = request.get_json()
        ssn_id = int(some_json["SSN_ID"])
        new_cust_name = some_json["Name"]
        new_age = int(some_json["Age"])
        new_address = some_json["Address"]
        timestamp = datetime.fromtimestamp(datetime.timestamp(datetime.now()))

        con = connect()
        c = con.cursor()

        update_statement = '''UPDATE CustomerStatus SET name = '{}',age = {},
                                address = '{}', timestamp = '{}', message = 'Customer updated'
                                WHERE ssn_id = {};'''.replace('\n',' ')
                                
        formatted_statement = update_statement.format(new_cust_name,new_age, new_address, timestamp, ssn_id)
        
        c.execute(str(formatted_statement))
        con.commit()

        c.close()
        con.close()

        return  200



class AccountsBySSNID(Resource):

    def get(self,ssn_id):
        new_ssn_id = int(ssn_id)
        acc_status = 'Active'
        con = connect()
        c = con.cursor()
        cust_id = c.execute('SELECT cust_id FROM CustomerStatus WHERE ssn_id = {}'.format(new_ssn_id)).fetchall()[0][0]
        final_list = []
        acc_list = c.execute("SELECT * FROM AccountStatus WHERE acc_cust_id = {} AND acc_status = '{}'".replace('\n',' ').format(cust_id,acc_status)).fetchall()

        if len(acc_list) > 0:
        
            for i in acc_list:
                acc_dict = {'ACC_ID':i[0],'CUST_ID':i[1],'AccType':i[2],'Amount':i[3]}
                final_list.append(acc_dict)

            c.close()
            con.close()

            return final_list, 200
            #return 200
        
        else:
            return [], 200


class AccountsByCUSTID(Resource):

    def get(self,cust_id):
        new_cust_id = int(cust_id)
        acc_status = 'Active'
        
        con = connect()
        c = con.cursor()
        final_list = []
        acc_list = c.execute("SELECT * FROM AccountStatus WHERE acc_cust_id = {} AND acc_status = '{}'".replace('\n',' ').format(new_cust_id,acc_status)).fetchall()

        if len(acc_list) > 0:
        
            for i in acc_list:
                acc_dict = {'ACC_ID':i[0],'CUST_ID':i[1],'AccType':i[2],'Amount':i[3]}
                final_list.append(acc_dict)

            c.close()
            con.close()

            return final_list, 200
            #return 200
        
        else:
            return [], 200



class Account(Resource):

    def get(self, acc_id):
        new_acc_id = int(acc_id)
        acc_status = 'Active'
        con = connect()
        new_con = connect()
        con.row_factory = lambda cursor, row: row[0]
        c = con.cursor()
        new_c = new_con.cursor()
        acc_id_list = c.execute('SELECT acc_id FROM AccountStatus').fetchall()
        #print(acc_id_list)
        if new_acc_id in acc_id_list:
            #WHERE QUERY TO SELECT THE RECORD
            acc_tuple = new_c.execute("SELECT * FROM AccountStatus WHERE acc_id = {} AND acc_status = '{}'".format(new_acc_id, acc_status)).fetchone()
            #print(cust_tuple)
            acc_dict = { 'ACC_ID':acc_tuple[0],
                         'CUST_ID':acc_tuple[1],
                         'AccType':acc_tuple[2],
                         'Amount': acc_tuple[3],
                         'timestamp': acc_tuple[4],
                         'Status': acc_tuple[5],
                         'Message': acc_tuple[6],
                        }
            
            c.close()
            con.close()
            new_c.close()
            new_con.close()

            return acc_dict, 200
        else:
            c.close()
            con.close()
            new_c.close()
            new_con.close()

            return {}, 404


    def delete(self, acc_id):
        new_acc_id = int(acc_id)
        timestamp = datetime.fromtimestamp(datetime.timestamp(datetime.now()))
        #print(new_acc_id)

        con = connect()    
        c = con.cursor()

        delete_statement = '''UPDATE AccountStatus SET acc_status = 'Inactive',
                                acc_message = 'Account Deleted', acc_timestamp = '{}'
                                WHERE acc_id = {};'''.replace('\n',' ')
        formatted_statement = delete_statement.format(timestamp,new_acc_id)
        c.execute(str(formatted_statement))
        con.commit()

        c.close()
        con.close()

        return 200



class ActiveAccounts(Resource):

    def get(self):
        acc_list = []
        con = connect()
        con.row_factory = lambda cursor, row: row[0]
        c = con.cursor()
        acc_id_list = c.execute('''SELECT acc_id FROM AccountStatus WHERE acc_status = 'Active';''').fetchall()
        acc_type_list = c.execute('''SELECT acc_type FROM AccountStatus WHERE acc_status = 'Active';''').fetchall()
        for i in range(len(acc_id_list)):
            acc_dict = {
                'ACC_ID': acc_id_list[i],
                'AccType': acc_type_list[i]
            }
            acc_list.append(acc_dict)
        
        c.close()
        con.close()

        return acc_list



class Accounts(Resource):

    def get(self):
        con = connect()
        c = con.cursor()
        c.execute('SELECT * FROM AccountStatus;')
        acc_list = c.fetchall()
        final_list = []
        for i in acc_list:
            acc_dict = {'ACC_ID':i[0], 'CUST_ID':i[1],'AccType':i[2],'Amount':i[3],
                            'timestamp':i[4],'Status':i[5],'Message':i[6]}
            final_list.append(acc_dict)
            
        c.close()
        con.close()

        return final_list


    def post(self):
        some_json = request.get_json()
        cust_id = int(some_json["CUST_ID"])
        account_type = some_json["AccType"]
        deposit_amount = int(some_json["Amount"])
        acc_timestamp = datetime.fromtimestamp(datetime.timestamp(datetime.now()))
        acc_status = 'Active'
        acc_message = 'Account Created'

        #QUERY FOR CREATING ACCOUNT
        con = connect()

        con.row_factory = lambda cursor, row: row[0]
        c = con.cursor()
        c.execute('PRAGMA foreign_keys = ON;')
        c.execute('CREATE TABLE IF NOT EXISTS AccountStatus' +
                    '(acc_id int, acc_cust_id int references CustomerStatus(cust_id),' +
                    'acc_type varchar(255), deposit int, acc_timestamp varchar(100),' +
                    'acc_status varchar(100), acc_message varchar(100));')

        #CHECK IF CUSTOMER EXISTS IN TABLE INORDER TO CREATE AN ACCOUNT
        cust_list = c.execute('SELECT cust_id FROM CustomerStatus').fetchall()

        if cust_id in cust_list:

            #Change Customer Status
            update_statement = '''UPDATE CustomerStatus SET timestamp = '{}', status='{}',
                                  message = '{}' WHERE cust_id = {};'''.replace('\n',' ')
                                  
            
            formatted_statement = update_statement.format(acc_timestamp,acc_status, acc_message, cust_id)

            c.execute(str(formatted_statement))

            #CUSTOMER EXISTS SO DEPOSIT THE AMOUNT

            #GENERATE A NEW ACCOUNT ID
            rows = c.execute('SELECT COUNT(*) AS RowCnt FROM AccountStatus').fetchall()
            if rows[0] == 0:
                account_id = choice(range(100000000,999999999))
            else:
                u_acc_id = c.execute('SELECT acc_id FROM AccountStatus').fetchall()
                account_id = choice(range(100000000,999999999))
                while account_id in u_acc_id:
                    account_id = choice(range(100000000,999999999))

            
            insert_statement = '''INSERT INTO AccountStatus(acc_id,acc_cust_id, acc_type,
                               deposit, acc_timestamp, acc_status, acc_message) VALUES
                           ({},{},'{}',{},'{}','{}','{}');'''.replace('\n',' ')
            formatted_statement = insert_statement.format(account_id,cust_id, account_type, deposit_amount,
                                  acc_timestamp, acc_status, acc_message)
            c.execute(str(formatted_statement))
            con.commit()
            #print("account created")
            c.close()
            con.close()

            return 201
            
        else:
            #NO SUCH CUSTOMER EXISTS SO CAN'T CREATE AN ACCOUNT
            return 404


    def put(self):
        some_json = request.get_json()
        operation = some_json["Operation"]
        if operation == 'DEPOSIT':
            amount = int(some_json["Amount"])
            acc_id = int(some_json["ACC_ID"])
            description = 'Deposit'
            date = datetime.fromtimestamp(datetime.timestamp(datetime.now())).date()

            con = connect()
            c = con.cursor()

            original = c.execute('''SELECT deposit FROM AccountStatus WHERE acc_id = {}; '''.replace('\n',' ').format(acc_id))
            original = original.fetchall()[0][0]
            after = original + amount
            
            c.execute('''UPDATE AccountStatus SET deposit = '{}' WHERE acc_id = {};'''.replace('\n',' ').format(after,acc_id))
            
            c.execute('CREATE TABLE IF NOT EXISTS Transactions' +
                        '(acc_id int, trans_id varchar(100),description varchar(100),' +
                        'date varchar(255), amount int);')
            
            con.commit()
            
            rows = c.execute('SELECT COUNT(*) AS RowCnt FROM Transactions').fetchall()

            if rows[0][0] == 0:
                trans_id = ('1').zfill(9)
            else:
                req_list = c.execute('SELECT trans_id FROM Transactions').fetchall()
                int_list = list(map(lambda x:int(x[0]),req_list))
                trans_id = str(max(int_list)+1).zfill(9)

            insert_statement = '''INSERT INTO Transactions(acc_id,trans_id, description,
                                date, amount) VALUES ({},'{}','{}','{}',{});'''.replace('\n',' ')

            formatted_statement = insert_statement.format(acc_id,trans_id, description, date, amount)

            c.execute(str(formatted_statement))
            
            con.commit()
            c.close()
            con.close()

            return after

        elif operation == 'WITHDRAW':
            some_json = request.get_json()
            amount = int(some_json["Amount"])
            acc_id = int(some_json["ACC_ID"])
            description = 'Withdraw'
            date = datetime.fromtimestamp(datetime.timestamp(datetime.now())).date()

            con = connect()
            c = con.cursor()

            original = c.execute('''SELECT deposit FROM AccountStatus WHERE acc_id = {}; '''.replace('\n',' ').format(acc_id))
            original = original.fetchall()[0][0]
            after = original - amount
            
            if after < 0:
                #"Withdraw not allowed, please choose smaller amount"
                return {}, 404
            else:
                c.execute('''UPDATE AccountStatus SET deposit = '{}' WHERE acc_id = {};'''.replace('\n',' ').format(after,acc_id))
            
                c.execute('CREATE TABLE IF NOT EXISTS Transactions' +
                      '(acc_id int, trans_id varchar(100),description varchar(100),' +
                      'date varchar(255), amount int);')
            
                con.commit()
            
                rows = c.execute('SELECT COUNT(*) AS RowCnt FROM Transactions').fetchall()

                if rows[0][0] == 0:
                    trans_id = ('1').zfill(9)
                else:
                    req_list = c.execute('SELECT trans_id FROM Transactions').fetchall()
                    int_list = list(map(lambda x:int(x[0]),req_list))
                    trans_id = str(max(int_list)+1).zfill(9)
                    insert_statement = '''INSERT INTO Transactions(acc_id,trans_id, description,
                               date, amount) VALUES ({},'{}','{}','{}',{});'''.replace('\n',' ')

                formatted_statement = insert_statement.format(acc_id,trans_id, description, date, amount)

                c.execute(str(formatted_statement))
            
                con.commit()
                c.close()
                con.close()

                return {'LATEST': after}, 200

        elif operation == 'TRANSFER':
            amount = int(some_json["TransferAmount"])
            description = 'Transfer'
            date = datetime.fromtimestamp(datetime.timestamp(datetime.now())).date()
            src_acc_id = some_json["SRC_ACC_ID"]
            tar_acc_id = some_json["TRG_ACC_ID"]

            con = connect()
            c = con.cursor()

            original = '''SELECT deposit FROM AccountStatus WHERE acc_id = {}; '''.replace('\n',' ')
            original = c.execute(original.format(src_acc_id)).fetchall()[0][0]
            after_src = original - amount
            original = '''SELECT deposit FROM AccountStatus WHERE acc_id = {}; '''.replace('\n',' ')
            original = c.execute(original.format(tar_acc_id)).fetchall()[0][0]
            after_tar = original + amount
            
            if after_src < 0:
                return {}, 404
            else:
                update_statement = '''UPDATE AccountStatus SET deposit = '{}' WHERE acc_id = {};'''.replace('\n',' ')
                formatted_statement = update_statement.format(after_src, src_acc_id)
                c.execute(formatted_statement)
                update_statement = '''UPDATE AccountStatus SET deposit = '{}' WHERE acc_id = {};'''.replace('\n',' ')
                formatted_statement = update_statement.format(after_tar, tar_acc_id)
                c.execute(formatted_statement)
                c.execute('CREATE TABLE IF NOT EXISTS Transactions' +
                      '(acc_id int, trans_id varchar(100),description varchar(100),' +
                      'date varchar(255), amount int);')
            
            
                rows = c.execute('SELECT COUNT(*) AS RowCnt FROM Transactions').fetchall()

                if rows[0][0] == 0:
                    trans_id = ('1').zfill(9)
                else:
                    req_list = c.execute('SELECT trans_id FROM Transactions').fetchall()
                    int_list = list(map(lambda x:int(x[0]),req_list))
                    trans_id = str(max(int_list)+1).zfill(9)
                    insert_statement = '''INSERT INTO Transactions(acc_id,trans_id, description,
                               date, amount) VALUES ({},'{}','{}','{}',{});'''.replace('\n',' ')

                    formatted_statement = insert_statement.format(src_acc_id,trans_id, description, date, amount)

                    c.execute(str(formatted_statement))

                    formatted_statement = insert_statement.format(tar_acc_id,trans_id, description, date, amount)

                    c.execute(str(formatted_statement))
            
                    con.commit()
                    c.close()
                    con.close()

                return {'LATEST_SRC_AMOUNT': after_src, 'LATEST_TRG_AMOUNT': after_tar}, 200



class Transactions(Resource):

    def post(self):
        some_json = request.get_json()
        method = some_json["Method"]
        
        if method == 'no_of_trans':
            no_of_trans = -int(some_json["TRANS_NO"])
            acc_id = int(some_json["ACC_ID"])
            
            con = connect()
            c = con.cursor()

            trans_list = c.execute('''SELECT * FROM Transactions WHERE acc_id = {}; '''.replace('\n',' ').format(acc_id))
            trans_list = trans_list.fetchall()[no_of_trans:]
            final_list = []

            for i in trans_list:
                trans_dict = {'TRANS_ID':i[1], 'Description':i[2], 'Date':i[3], 'Amount':i[4]}
                final_list.append(trans_dict)
            con.commit()
            c.close()
            con.close()
            return final_list

        elif method == 'date_gap':

            start_date = datetime.strptime(some_json["START_DATE"],'%Y-%m-%d').date()
            end_date = datetime.strptime(some_json["END_DATE"],'%Y-%m-%d').date()
            acc_id = int(some_json["ACC_ID"])
            
            con = connect()
            c = con.cursor()

            trans_list = c.execute('''SELECT * FROM Transactions WHERE acc_id = {}; '''.replace('\n',' ').format(acc_id))
            
            new_list = []
            final_list = []

            for i in trans_list:
                trans_dict = {'TRANS_ID':i[1], 'Description':i[2], 'Date':i[3], 'Amount':i[4]}
                new_list.append(trans_dict)
            for i in new_list:
                if start_date <= datetime.strptime(i['Date'],'%Y-%m-%d').date() and end_date >= datetime.strptime(i['Date'],'%Y-%m-%d').date():
                    final_list.append(i)
                    
                
            con.commit()
            c.close()
            con.close()
            return final_list

        return 200




api.add_resource(userValidation, '/user')
api.add_resource(CustomerBySSNID, '/customer/SSNID/<ssn_id>')
api.add_resource(CustomerByCUSTID, '/customer/CUSTID/<cust_id>')
api.add_resource(Customers, '/customer')
api.add_resource(Account, '/account/<acc_id>')
api.add_resource(AccountsBySSNID, '/account/SSNID/<ssn_id>')
api.add_resource(AccountsByCUSTID, '/account/CUSTID/<cust_id>')
api.add_resource(ActiveAccounts, '/account/active')
api.add_resource(Accounts, '/account')
api.add_resource(Transactions, '/account/transaction')


def connect():
    cwd = Path.cwd()
    db_path = str(Path(cwd).parent) + "\database\database.db"
    con = sqlite3.connect(db_path)
    return con


if __name__ == '__main__':
    print("Server is Up and Running!")
    app.run(debug=True)