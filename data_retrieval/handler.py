from data_retrieval.read_json import read_allowance_json, read_tips_json


def allowance_user_exist(username: str):
    json_data = read_allowance_json()
    try:
        for user, allowance in json_data.items():
            if user == username:
                return user, allowance
    except:
        return None


def tips_user_exist(username: str):
    json_data = read_tips_json()
    try:
        for user, tips in json_data.items():
            if user == username:
                return user, tips
    except:
        return None