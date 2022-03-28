pip install -r requirements.txt
sudo apt install redis
service redis-server stop
service redis-cli stop
coproc redis-server
coproc (celery -A celety_async.celery_async_functions worker --loglevel=info)
python app.py