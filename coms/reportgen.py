from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML, CSS

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