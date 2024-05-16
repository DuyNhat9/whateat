import main
import pytz
def timed_job():
    print('This job is run every three minutes.')

def scheduled_job():
    main.main()
    print('This job is run every weekday at 5pm.')

if __name__ == "__main__":
    from apscheduler.schedulers.blocking import BlockingScheduler
    sched = BlockingScheduler(timezone=pytz.timezone('Asia/Ho_Chi_Minh'))

    sched.add_job(timed_job, 'cron', id='run_every_30_s', minute='1')
    sched.add_job(scheduled_job, 'cron', id='run_at_3_am', day_of_week="mon-fri", hour='3')

sched.start()