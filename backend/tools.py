# utils.py
import time, threading
from config import TIME_SCALE_FACTOR
import datetime

def get_in_game_month(start_time):
    elapsed_real_time = datetime.datetime.now() - start_time
    elapsed_in_game_time = elapsed_real_time.total_seconds() * TIME_SCALE_FACTOR
    in_game_month = int((elapsed_in_game_time // (30 * 24 * 60 * 60)) % 12) + 1
    return in_game_month

StartTime=time.time()

def action() :
    print('action ! -> time : {:.1f}s'.format(time.time()-StartTime))


class setInterval :
    def __init__(self,interval,action) :
        self.interval=interval
        self.action=action
        self.stopEvent=threading.Event()
        thread=threading.Thread(target=self.__setInterval)
        thread.start()

    def __setInterval(self) :
        nextTime=time.time()+self.interval
        while not self.stopEvent.wait(nextTime-time.time()) :
            nextTime+=self.interval
            self.action()

    def cancel(self) :
        self.stopEvent.set()

# start action every 0.6s
inter=setInterval(0.6,action)
print('just after setInterval -> time : {:.1f}s'.format(time.time()-StartTime))

# will stop interval in 5s
t=threading.Timer(5,inter.cancel)
t.start()