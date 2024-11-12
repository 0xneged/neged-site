import os

from flask import Flask, render_template, jsonify
from dotenv import load_dotenv
from data_retrieval.neynar_data import Neynar
from data_retrieval.read_json import read_allowance_json, read_tips_json
from data_retrieval.handler import allowance_user_exist, tips_user_exist

load_dotenv(os.path.join(os.getcwd(), '.env'))

app = Flask(__name__)

# turn off json_path keys when responsing in API
app.json.sort_keys = False

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api/allowances', methods=['GET'])
def allowances():
    return read_allowance_json(), 200


@app.route('/api/tips', methods=['GET'])
def tips():
    return read_tips_json(), 200


@app.route('/api/user_allowance/<int:fid>', methods=['GET'])
def user_allowance(fid):
    neynar = Neynar(fid)
    username = neynar.username()
    user_image = neynar.user_image()
    if allowance_user_exist(username):
        username, allowance = allowance_user_exist(username)
        return jsonify(
            fid=fid,
            username=username,
            user_image=user_image,
            allowance=allowance), 200
    else:
        return jsonify(
            fid=fid,
            username=username,
            user_image=user_image,
            allowance=0), 200


@app.route('/api/user_tips/<int:fid>', methods=['GET'])
def user_tips(fid):
    neynar = Neynar(fid)
    username = neynar.username()
    user_image = neynar.user_image()
    if tips_user_exist(username):
        username, tips = tips_user_exist(username)
        return jsonify(
            fid=fid,
            username=username,
            user_image=user_image,
            tips=tips), 200
    else:
        return jsonify(
            fid=fid,
            username=username,
            user_image=user_image,
            tips=0), 200


if __name__ == '__main__':
    app.run(port=3001)