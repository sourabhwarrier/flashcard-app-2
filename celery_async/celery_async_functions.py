
from functions.functions_1 import format_datetime, get_all_user_ids, get_decks_for_dashboard, to_remind, update_participation, update_rating,update_deckstats
import time
import os

from build import celery
from coms.mailman import send_reminder
from coms.reportgen import generate_report


# FUNCTIONS BEGIN
@celery.task(name="update_rating_async")
def update_rating_async(deck_id,rating):
    update_rating(deck_id,rating)

@celery.task(name="update_deckstats_async")
def update_deckstats_async(user_id,deck_id,last_reviewed,score):
    update_deckstats(user_id,deck_id,last_reviewed,score)

@celery.task(name="update_participation_async")
def update_participation_async(client):
    update_participation(client)

@celery.task(name="clean_proc")
def clean_proc(filename):
    time.sleep(10)
    os.system("rm proc/{}.csv".format(filename))

@celery.task(name="reminder_async")
def reminder_async():
    print("{} : Async Job Dispatch: Daily Reminders".format(format_datetime(time.time())))
    users = get_all_user_ids()
    if users != []:
        for user in users:
            if to_remind(user.id):
                send_reminder(user.email,user.username)

@celery.task(name="dispatch_monthly_report")
def dispatch_monthly_report():
    users = get_all_user_ids()
    for user in users:
        deckstats = get_decks_for_dashboard(user.id)
        username = user.username
        email = user.email
        date = format_datetime(time.time())[:11]
        filenames = ["{}_monthly_report_{}.html".format(username,date),"{}_monthly_report_{}.pdf".format(username,date)]
        generate_report(username,deckstats,date)


    