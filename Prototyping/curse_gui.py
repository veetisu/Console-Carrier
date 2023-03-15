import curses
from curses import panel


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
            current_row = 1
            for index, item in enumerate(self.items):
                if index == self.position:
                    mode = curses.A_REVERSE
                else:
                    mode = curses.A_NORMAL

                msg = "%d. %s" % (index, item[0])
                msg_rows = msg.count("\n")
                self.window.addstr(current_row, 1, msg, mode)
                current_row += msg_rows + 1

            key = self.window.getch()

            if key == curses.KEY_DOWN:
                self.navigate(1)

            if key in [curses.KEY_ENTER, ord("\n")]:
                if self.position == len(self.items) - 1:
                    break
                else:
                    self.items[self.position][1]()

            if key == curses.KEY_UP:
                self.navigate(-1)

        self.window.clear()
        self.panel.hide()
        panel.update_panels()
        curses.doupdate()


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

