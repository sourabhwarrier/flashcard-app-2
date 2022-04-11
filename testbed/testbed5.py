from functions.functions_1 import format_datetime
from jinja2 import Environment, FileSystemLoader
import time,os
from weasyprint import HTML, CSS

deckstats = [{'owner': 'user1', 'visibility': 'Public', 'name': 'deck01', 'description': 'this is the first deck', 'average_score': '24.28', 'rating': 'Easy', 'times_reviewed': '14', 'last_reviewed': '2022-03-28 08:16:13', 'deck_id': 1, 'number_of_cards': 4}, {'owner': 'user2', 'visibility': 'Public', 'name': 'deck02', 'description': 'This is the second deck', 'average_score': '44.44', 'rating': 'Medium', 'times_reviewed': '9', 'last_reviewed': '2022-03-27 16:56:48', 'deck_id': 2, 'number_of_cards': 1}]
date = format_datetime(time.time())[:11]
username= "user1"
#html = template.render(username="user1",deckstats = deckstats,date=date[:11])
#with open("html_report.html","w") as f:
#    f.write(html)

def generate_report(username,deckstats,date):
    css = CSS(string='''
        @page {size:A4; margin: 1cm}
        th,td {border:1px solid black}
    ''')
    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template('report.html')
    html = template.render(username="user1",deckstats = deckstats,date=date)
    with open("{}_monthly_report_{}.html".format(username,date),"w") as f:
        f.write(html)
    HTML("{}_monthly_report_{}.html".format(username,date)).write_pdf("{}_monthly_report_{}.pdf".format(username,date),stylesheets=[css])



#generate_report(username,deckstats,date)
