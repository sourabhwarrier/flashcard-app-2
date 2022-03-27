
from functions.functions_1 import format_datetime, get_all_user_ids, to_remind, update_participation, update_rating,update_deckstats
import time
import os

from models.models import DeckStat, Rating
from build import celery
from coms.mailman import send_reminder


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
    #users = get_all_user_ids()
    #if users != []:
    #    for user in users:
    #        if to_remind(user.id):
    send_reminder("sourabhw7@gmail.com","Sourabh")

@celery.task(name="dispatch_monthly_report")
def dispatch_monthly_report():
    users = get_all_user_ids()
    