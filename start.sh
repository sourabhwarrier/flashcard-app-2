sudo apt-get install redis-server
sudo /etc/init.d/redis-server stop
pip install -r requirements.txt
echo " " >> redis_server_logs
echo "#####################################" >> redis_server_logs
echo `date` >> redis_server_logs
echo "#####################################" >> redis_server_logs
echo " " >> redis_server_logs
ps | awk '/redis-server/{system("kill -9 "$1)}'
redis-server >> redis_server_logs 2>&1 &
echo " " >> celery_logs
echo "#####################################" >> celery_logs
echo `date` >> celery_logs
echo "#####################################" >> celery_logs
echo " " >> celery_logs
ps | awk '/celery/{system("kill -9 "$1)}'
celery -A celery_async.celery_async_functions worker >> celery_logs 2>&1 &
echo " " >> application_logs
echo "#####################################" >> application_logs
echo `date` >> application_logs
echo "#####################################" >> application_logs
echo " " >> application_logs
ps | awk '/python/{system("kill -9 "$1)}'
nohup python app.py >> application_logs 2>&1 &
cpid=`jobs -l | egrep "celery_async_functions" | cut -d " " -f 2`
rpid=`jobs -l | egrep "redis-server" | cut -d " " -f 3`
fpid=`jobs -l | egrep "python app.py" | cut -d " " -f 2`
printf "\n\n"
printf "_______________________________________________________"
printf "\n"
printf "application started\nlisting current process IDs : \n\n"
echo "celery_process_id ${cpid}" > pids
echo "redis_server_process_id ${rpid}" >> pids
echo "application_process_id ${fpid}" >> pids
cat pids
printf "_______________________________________________________"
printf "\n"

