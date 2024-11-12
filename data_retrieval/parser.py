import json
import os
import requests
import schedule
import threading

from bs4 import BeautifulSoup


def get_allowances_data():
    allowances_dict = {}
    i = 1
    while True:
        url_allowances = f'https://app.p00ls.io/embeds/tipping/NEGED/allowances/FARCASTER/fullscreen?page={i}&pageSize=10'

        i += 1
        page = requests.get(url_allowances)
        soup = BeautifulSoup(page.text, "html.parser")

        all_data = soup.findAll('div', class_='gap-2.5')

        for data in all_data:
            try:
                nickname = data.find_next('a', class_='inline-flex w-full gap-2 items-center').text
                daily_allowance = data.find_next('div', class_='ml-auto font-apercu-mono').text
                allowances_dict[nickname] = daily_allowance
            except:
                return allowances_dict


def get_tips_data():
    tips_dict = {}
    i = 1
    while True:
        url_tips = f'https://app.p00ls.io/embeds/tipping/NEGED/tiprequests/FARCASTER/fullscreen?page={i}&pageSize=10'

        i += 1
        page = requests.get(url_tips)
        soup = BeautifulSoup(page.text, "html.parser")

        all_data = soup.findAll('div', class_='gap-2.5')
        for data in all_data:
            try:
                nickname = data.find_next('a', class_='inline-flex w-full gap-2 items-center').text
                daily_allowance = data.find_next('div', class_='ml-auto font-apercu-mono').text
                tips_dict[nickname] = daily_allowance
            except:
                return tips_dict


def convert_allowances_json():
    with open(os.path.join(os.getcwd(), 'json_path', 'allowances_data.json'), 'w', encoding='utf-8') as f:
        json.dump(get_allowances_data(), f, ensure_ascii=False, indent=4)
        print('allowance was updated')


def convert_tips_json():
    with open(os.path.join(os.getcwd(), 'json_path', 'tips_data.json'), 'w', encoding='utf-8') as f:
        json.dump(get_tips_data(), f, ensure_ascii=False, indent=4)
        print('tips was updated')


def main():
    schedule.every().day.at('11:00').do(convert_allowances_json)
    schedule.every().day.at('11:00').do(convert_tips_json)

    while True:
        schedule.run_pending()


thread = threading.Thread(target=main)


if __name__ == '__main__':
    print('parser start')
    thread.start()