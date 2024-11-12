import os
import json


def read_allowance_json():
    with open(os.path.join(os.getcwd(), 'data_retrieval', 'json_path', 'allowances_data.json')) as json_file:
        json_data = json.load(json_file)
        return json_data


def read_tips_json():
    with open(os.path.join(os.getcwd(), 'data_retrieval', 'json_path', 'tips_data.json')) as json_file:
        json_data = json.load(json_file)
        return json_data