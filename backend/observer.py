import sys
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class RestartHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        print("Restarting server...")
        time.sleep(1)
        # Replace `app.py` with the name of your Flask application file.
        # This assumes that you start your Flask app with `flask run` command.
        # If you use a different way to start your app, adjust this line accordingly.
        sys.exit()

if __name__ == "__main__":
    event_handler = RestartHandler()
    observer = Observer()
    # Replace `/path/to/your/app` with the path to your Flask app directory.
    observer.schedule(event_handler, "./main.py", recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
