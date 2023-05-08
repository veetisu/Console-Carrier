import curses
from curses import panel
from airplane import Airplane
from carrier_handler import Carrier
from db_handler import Db_handler

class Menu(object):
    def __init__(self, items, stdscreen):
        self.window = stdscreen.subwin(0, 0)
        self.window.keypad(1)
        self.panel = panel.new_panel(self.window)
        self.panel.hide()
        panel.update_panels()

        self.position = 0
        self.items = items
        self.items.append(("exit", "exit"))

    def navigate(self, n):
        self.position += n
        if self.position < 0:
            self.position = 0
        elif self.position >= len(self.items):
            self.position = len(self.items) - 1

    def display(self):
        self.panel.top()
        self.panel.show()
        self.window.clear()

        while True:
            self.window.refresh()
            curses.doupdate()
            for index, item in enumerate(self.items):
                if index == self.position:
                    mode = curses.A_REVERSE
                else:
                    mode = curses.A_NORMAL

                msg = "%d. %s" % (index, item[0])
                self.window.addstr(1 + index, 1, msg, mode)

            key = self.window.getch()

            if key in [curses.KEY_ENTER, ord("\n")]:
                if self.position == len(self.items) - 1:
                    break
                else:
                    self.items[self.position][1]()

            elif key == curses.KEY_UP:
                self.navigate(-1)

            elif key == curses.KEY_DOWN:
                self.navigate(1)

        self.window.clear()
        self.panel.hide()
        panel.update_panels()
        curses.doupdate()

def main(stdscr):
    curses.curs_set(0)
    plane_items = []
    for plane in planes:
        plane_items.append((plane.__str__(), curses.flash))
    plane_menu = Menu(plane_items, self.screen)
    plane_menu.display()
    menu = Menu(plane_items, stdscr)
    menu.display()

class UI(object):
    def __init__(self, stdscreen):
        self.screen = stdscreen
        curses.curs_set(0)

    def display_planes(self, planes):
        plane_items = []
        for plane in planes:
            plane_items.append((plane.__str__(), curses.flash))
        plane_menu = Menu(plane_items, self.screen)
        plane_menu.display()

if __name__ == '__main__':
    db_handler = Db_handler()
    carrier = Carrier("DummyCarrier","EFHK")
    airport = db_handler.add_airport("EFHK")
    ui : UI = curses.wrapper(main)
    plane = Airplane(carrier.id,"C172",airport)
    plane2 = Airplane(carrier.id,"C172",airport)
    planes = [plane, plane2]
    ui.display_planes(planes)
