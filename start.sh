sudo apt-get install redis-server
sudo /etc/init.d/redis-server stop
pip install -r requirements.txt
echo " " >> logs/redis_server_logs
echo "#####################################" >> logs/redis_server_logs
echo `date` >> logs/redis_server_logs
echo "#####################################" >> logs/redis_server_logs
echo " " >> logs/redis_server_logs
ps | awk '/redis-server/{system("kill -9 "$1)}'
redis-server >> logs/redis_server_logs 2>&1 &
echo " " >> logs/celery_logs
echo "#####################################" >> logs/celery_logs
echo `date` >> logs/celery_logs
echo "#####################################" >> logs/celery_logs
echo " " >> logs/celery_logs
ps | awk '/celery/{system("kill -9 "$1)}'
celery -A celery_async.celery_async_functions worker -B -s proc/celerybeat-schedule >> logs/celery_logs 2>&1 &
echo " " >> logs/application_logs
echo "#####################################" >> logs/application_logs
echo `date` >> logs/application_logs
echo "#####################################" >> logs/application_logs
echo " " >> logs/application_logs
ps | awk '/python/{system("kill -9 "$1)}'
nohup python app.py >> logs/application_logs 2>&1 &
cpid=`jobs -l | egrep "celery_async_functions" | cut -d " " -f 3`
rpid=`jobs -l | egrep "redis-server" | cut -d " " -f 4`
fpid=`jobs -l | egrep "python app.py" | cut -d " " -f 3`
ip=`curl ifconfig.me`
printf "\n\n"
printf "_______________________________________________________"
printf "\n"
printf "application running at http://${ip}:5000/#/\n"
printf "\n"
printf "application started\nlisting current process IDs : \n\n"
echo "celery_process_id ${cpid}" > proc/pids
echo "redis_server_process_id ${rpid}" >> proc/pids
echo "application_process_id ${fpid}" >> proc/pids
cat proc/pids
printf "_______________________________________________________"
printf "\n"
