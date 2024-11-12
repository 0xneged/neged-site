import os

import requests

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.getcwd()), '.env'))


class Neynar:
    def __init__(self, fid):
        self.url = f'https://api.neynar.com/v1/farcaster/user?fid={fid}'

    def fetching_data(self):
        headers = {
            "accept": "application/json",
            "api_key": os.getenv('NEYNAR_KEY')
        }

        response = requests.get(self.url, headers=headers)
        return response.json()

    def username(self):
        return self.fetching_data()['result']['user']['username']

    def user_image(self):
        return self.fetching_data()['result']['user']['pfp']['url']
