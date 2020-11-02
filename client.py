# 0 - create room
# 1 - join room
# 2 - play
# 3 - pause
# 4 - play at

# TODO: Import the message queue list from utility.py in here and keep reading it

import tkinter
import cv2
import PIL.Image, PIL.ImageTk
import time
import _thread
import json

from tkinter import filedialog
import client_utility as cu




class Home:

    def __init__(self, window, window_title):

        self.window = window
        self.window.title(window_title)
        self.initialize()
        self.displayDetails = True

    def initialize(self):
      try:
        self.UsernameLabel = tkinter.Label(self.window,text='Username',font=('calibre',
                            10, 'bold'))
        self.textExample = tkinter.Entry(self.window)
        self.UsernameLabel.pack()
        self.textExample.pack()


          # Create a canvas that can fit the above video source size
        self.canvas = tkinter.Canvas(self.window, width = 10, height = 10)
        self.canvas.pack()

          # Button that lets the user take a snapshot

        self.btn_submit=tkinter.Button(self.window, text="Submit", width=30,command =self.connCheck)

        self.btn_submit.pack(anchor=tkinter.CENTER, expand=True)

        # self.btn_browse=tkinter.Button(window, text="UserPage", width=30,command = self.browse )
        # self.btn_browse.pack(anchor=tkinter.CENTER, expand=True)
        self.widget_list = self.checkWidgets()

        self.window.mainloop()
      except KeyboardInterrupt:
        pass

    # check the status of the connection
    def connCheck(self):

        self.connCheck = cu.connect_server()
        self.userVal = self.textExample.get()
        print("check user",self.userVal)
        print("check conn",self.connCheck)
        if(self.connCheck and self.userVal):
          self.hideWidgets()
          print("all right")
          self.roomDecide()
        else:
          print(self.connCheck)



    def roomDecide(self):
      # userVal = self.textExample.get()
      try:
        self.hideWidgets()
        self.window.title('Hello '+self.userVal )
        self.window.geometry("500x500")
        self.window.config(background = "white")
        label_file_explorer = tkinter.Label(self.window,
                    text = "Select room",
                    width = 100, height = 4,
                    fg = "blue")
        btn_create = tkinter.Button(self.window,
                text = "Create Room",
                command = self.createRoom,width=10)
        btn_join = tkinter.Button(self.window,
                text = "Join Room",
                command =self.joinRoom,width=10)
        button_exit = tkinter.Button(self.window,
              text = "Exit",
              command = exit,width=10)
        btn_create.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)
        btn_join.place(relx=0.5, rely=0.4, anchor=tkinter.CENTER)
        button_exit.place(relx=0.5, rely=0.5, anchor=tkinter.CENTER)
        self.widget_list = self.checkWidgets()
      except KeyboardInterrupt:
        pass


    def createRoom(self):
      self.createRoomCheck = cu.create_room(self.userVal)
      if(self.createRoomCheck):
        while len(cu.message_queue)==0:
          pass
        message = json.loads(cu.message_queue.pop(0))
        if "created" in message.keys():
          self.roomId = message['created']
          print("roomId",self.roomId)
          self.hideWidgets()
          self.browse()

    def joinRoom(self):
      try:
        self.hideWidgets()
        self.window.title('Hello '+self.userVal )
        self.window.geometry("500x500")
        self.window.config(background = "white")
        self.enterRoomId = tkinter.Entry(self.window)
        self.enterRoomId.pack()
        btn_joinRoom = tkinter.Button(self.window,
                text = "Submit RoomID",
                command =self.joinRoomAccepted,width=10)
        btn_joinRoom.pack(anchor=tkinter.CENTER, expand=True)
        button_goBack = tkinter.Button(self.window,
        						text = "Back",
        						command =self.roomDecide,width=10)
        button_goBack.pack(anchor=tkinter.CENTER, expand=True)
        self.widget_list = self.checkWidgets()
      except KeyboardInterrupt:
        pass

    def joinRoomAccepted(self):
      validRoomId = self.enterRoomId.get()
      if(validRoomId and self.userVal):
        joinRoomCheck=cu.join_room(self.userVal,validRoomId)
        print("sending info to join room")
        if(joinRoomCheck):
          print("message appended to join room server")
          print(message_queue)
          while(len(cu.message_queue)==0):
            pass
          message = json.loads(cu.message_queue.pop(0))
          if('join' in message):
            self.hideWidgets()
            self.home()
          else:
            print("room not available")

        else:
          print(joinRoomCheck)

    def browse(self):
      try:

        def browseFiles():

            filename = filedialog.askopenfilename(initialdir = "/",
        										title = "Select a File",
        										filetypes = (("Text files",
        														"*.txt*"),
        													("all files",
        														"*.*")))


            label_file_explorer.configure(text="File Opened: "+filename)

        

        self.window.title('File Explorer')

        self.window.geometry("500x500")

        self.window.config(background = "white")

        label_file_explorer = tkinter.Label(self.window,
        							text = "File Explorer using Tkinter",
        							width = 100, height = 4,
        							fg = "blue")


        button_explore = tkinter.Button(self.window,
        						text = "Browse Files",
        						command = browseFiles,width=10)

        roomIdLabel=tkinter.Label(self.window,text=self.roomId,
                                  width=50)

        # get username from receive message

        code = tkinter.Text(self.window, height=2)
        button_goBack = tkinter.Button(self.window,
        						text = "Back",
        						command =self.roomDecide,width=10)


        label_file_explorer.grid(column = 1, row = 1)
        code.grid(column=1,row = 3)
        button_explore.grid(column = 1, row = 4)
        roomIdLabel.grid(column=1,row=6)
        button_goBack.grid(column=1,row=7)
        self.widget_list = self.checkWidgets()
        
        # Let the window wait for any events
        self.window.mainloop()
      except KeyboardInterrupt:
        pass

    def home(self):
      
      App("Home Page")


    def checkWidgets(self):
      _list = self.window.winfo_children()
      for item in _list :
        # if item.winfo_children() :
        #     _list.extend(item.winfo_children())
        print("check the childre items")

        print(item.winfo_class())
        print("type of widget")
        print(item.winfo_manager())


      return _list

    def hideWidgets(self):
      for item in self.widget_list:
        if(item.winfo_manager()=='pack'):
          print("inside pack")
          item.pack_forget()
        if(item.winfo_manager()=='grid'):
          print("inside grid")
          item.grid_forget()
        if(item.winfo_manager()=='place'):
          print("inside place")
          item.place_forget()
        
        


class App:

    def __init__(self, window, window_title, video_source=0):

        self.window = window
        self.window.title(window_title)
        self.video_source = video_source
        self.playerWindow()

    def playerWindow(self):
      try:
        self.textExample = tkinter.Text(self.window, height=10)
        self.textExample.pack()

          # open video source (by default this will try to open the computer webcam)
        self.vid = MyVideoCapture(self.video_source)

          # Create a canvas that can fit the above video source size
        self.canvas = tkinter.Canvas(self.window, width = self.vid.width, height = self.vid.height)
        self.canvas.pack()

          # Button that lets the user take a snapshot
        self.btn_pause=tkinter.Button(self.window, text="Pause", width=50, command=self.pause)
        self.btn_play = tkinter.Button(self.window, text="Play", width=50, command=self.play)
        self.btn_pause.pack(anchor=tkinter.CENTER, expand=True)
        self.btn_play.pack(anchor=tkinter.CENTER, expand=True)

          # After it is called once, the update method will be automatically called every delay milliseconds
        self.delay = 15
        self.update()
        self.widget_List = self.checkWidgets()
        self.window.mainloop()
      except KeyboardInterrupt:
        pass

    def pause(self):
        print("pause button pressed")
          # Get a frame from the video source
#          ret, frame = self.vid.get_frame()
#
#          if ret:
#
#              cv2.imwrite("frame-" + time.strftime("%d-%m-%Y-%H-%M-%S") + ".jpg", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))

    def play(self):

        print("play button pressed")

    def update(self):

          # Get a frame from the video source
        ret, frame = self.vid.get_frame()

        if ret:

            self.photo = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame))
            self.canvas.create_image(0, 0, image = self.photo, anchor = tkinter.NW)

        self.window.after(self.delay, self.update)

class MyVideoCapture:

    def __init__(self, video_source="Alexa intro.mp4"):
          # Open the video source
          self.vid = cv2.VideoCapture(video_source)
          if not self.vid.isOpened():
              raise ValueError("Unable to open video source", video_source)

          # Get video source width and height
          self.width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
          self.height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)

    def get_frame(self):

        if self.vid.isOpened():

            ret, frame = self.vid.read()
            if ret:

                  # Return a boolean success flag and the current frame converted to BGR
                return (ret, cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            else:

                return (ret, None)
        else:
            return (ret, None)

      # Release the video source when the object is destroyed

        if self.vid.isOpened():

            self.vid.release()





#
#
#class UserPage:
#
#    def __init__(self):
#
#
#

  # Create a window and pass it to the Application object
Home(tkinter.Tk(), "Tkinter and OpenCV")

# def read_message():

#   while True:
#     try:
#       # print("message que")
#       # print(cu.message_queue)
#       if(len(cu.message_queue)>0):
#         message = json.loads(cu.message_queue.pop(0))
#         if "created" in message.keys():
#           home.browse()
#           print("display message",json.dumps(message))
#     except KeyboardInterrupt as e:
#       break

# _thread.start_new_thread(read_message,())


