from __future__ import print_function
from flask import Flask, render_template,request,g, make_response
# from accout import account_api
from flask import jsonify
import json
# import sqlite3
import sys,random
import base64
# import pyqrcode
from datetime import date
# import account

reload(sys)
sys.setdefaultencoding('utf-8')
# import make_response

#test

app = Flask(__name__)

@app.route('/getTransRec', methods = ['GET'])
def getTransRec():
    # memberid=request.json['id']
    id=request.args.get('id')
    t={} 

    if id=="1":
        t['0']=['a','b','c']
        t['1']=['d','e','f']
        t['2']=['g','h','i']

        
    else:
        t['0']=['1','2','3']
        t['1']=['4','5','6']
        t['2']=['7','8','9']

    return jsonify(t)


@app.route('/test_1', methods = ['POST'])
def test_1():
    memberid=request.json['id']
    if memberid == "ok":
        return "ok"
    else:
        return "not ok"

    


if __name__ == "__main__":
    # app.run(host='0.0.0.0',debug=True,ssl_context='adhoc')
    app.run(host='0.0.0.0',debug=True)