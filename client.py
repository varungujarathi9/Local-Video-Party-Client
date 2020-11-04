# 0 - create room
# 1 - join room
# 2 - play
# 3 - pause
# 4 - play at

import numpy as np
import tkinter
import cv2
import PIL.Image, PIL.ImageTk
import time
import _thread
import json
from tkinter import filedialog, BOTH
from videoprops import get_video_properties

import client_utility as cu

join_flag = False
room_id = None
room_members = []
paused = False
playing_at = 0
total_duration = 0

def read_message():
	global join_flag, room_members, paused, playing_at, total_duration, room_id
	print('In read message')
	while True:
		try:
			if(len(cu.message_queue)>0):
				message = json.loads(cu.message_queue.pop(0))
				if "created" in message.keys() or "join" in message.keys():
					join_flag = True
					room_id = message['created']

				if "room_details" in message.keys():
					room_members = message['room_details']['members'].keys()
					paused = message['room_details']['paused']
					playing_at = message['room_details']['playing_at']
					total_duration = message['room_details']['total_duration']

				if "error" in message.keys():
					tkinter.messagebox("error",message['error'])

		except KeyboardInterrupt as e:
			break

_thread.start_new_thread(read_message,())

class App:
	def __init__(self, window, window_title):
		self.window = window
		self.window.config(background = "white")
		self.window.title(window_title)
		self.window_padding = 3
		self.window_geom='600x600+0+0'
		self.window.geometry("{0}x{1}+0+0".format(self.window.winfo_screenwidth() - self.window_padding, self.window.winfo_screenheight() - self.window_padding))
		self.window.bind('<Escape>',self.toggle_geom)
		self.widget_list = []
		self.room_id = None
		self.initialize()

	def __del__(self):
		if self.room_id is not None:
			self.exit_application()

	def toggle_geom(self, event):
		self._geom='100x100+0+0'
		self.window.config(width=400, height=400)

	# GUI Functions ---------------------------------------

	def initialize(self):
		try:
			# text field to enter username
			self.username_label = tkinter.Label(self.window,text='What should we call you', bg ='white')
			self.text_example = tkinter.Entry(self.window)
			self.btn_submit = tkinter.Button(self.window, text="Connect", width=30,command =self.login, bg ='green')

			self.username_label.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)
			self.text_example.place(relx=0.5, rely=0.35, anchor=tkinter.CENTER)
			self.btn_submit.place(relx=0.5, rely=0.5, anchor=tkinter.CENTER)

			self.widget_list = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def create_or_join(self):
		try:
			self.clear_window()
			btn_create = tkinter.Button(self.window, text = "Create Room", command = self.create_room, width=10)
			btn_join = tkinter.Button(self.window, text = "Join Room", command =self.enter_room_details, width=10)
			btn_exit = tkinter.Button(self.window, text = "Exit", command = exit, width=10)
			btn_create.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)
			btn_join.place(relx=0.5, rely=0.4, anchor=tkinter.CENTER)
			btn_exit.place(relx=0.5, rely=0.5, anchor=tkinter.CENTER)
			self.widget_list = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def enter_room_details(self):
		try:
			self.clear_window()
			self.enter_room_id = tkinter.Entry(self.window)
			self.enter_room_id.pack()
			btn_join_room = tkinter.Button(self.window, text = "Enter Room Code", command =self.join_room, width=10)
			btn_back = tkinter.Button(self.window, text = "Back", command =self.create_or_join, width=10)
			btn_join_room.pack(anchor=tkinter.CENTER, expand=True)
			btn_back.pack(anchor=tkinter.CENTER, expand=True)
			self.widget_list = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def browse(self):
		try:
			self.clear_window()
			def browse_file():
				self.filename = filedialog.askopenfilename(initialdir = "~/", title = "Select a file", filetypes = (("Video file", "*.mp4* *.mkv* *.mpv* *.avi* *.webm*"), ("All files","*.*")))
				if self.filename not in (""," ",None) and type(self.filename) is not tuple:
					label_file_explorer.configure(text="File selected: " + self.filename)
					btn_next.place(relx=0.5, rely=0.4, anchor=tkinter.CENTER)
					self.window.mainloop()

			label_file_explorer = tkinter.Label(self.window, text = "Select a file to play", width = 100, height = 4, fg = "blue")
			btn_explore = tkinter.Button(self.window, text = "Browse", command = browse_file, width=10)
			btn_next = tkinter.Button(self.window, text = "Next", command = self.display_room_info, width=10)
			btn_back = tkinter.Button(self.window, text = "Back", command = self.create_or_join, width=10)

			label_file_explorer.place(relx=0.5, rely=0.05, anchor=tkinter.CENTER)
			btn_explore.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)
			btn_back.place(relx=0.5, rely=0.5, anchor=tkinter.CENTER)
			self.widget_list = self.check_widgets()
			self.window.mainloop()
		except KeyboardInterrupt:
			pass

	def display_room_info(self):
		global room_members
		self.clear_window()

		if self.filename not in (""," ",None) and type(self.filename) is not tuple:
			room_id_label=tkinter.Label(self.window, text="Share this room code with your friends: " + self.room_id)
			room_id_label.place(relx=0.5, rely=0.3, anchor=tkinter.CENTER)

			members_text = "List of members in room: "
			for room_member in room_members:
				members_text += str(room_member)
			member_label=tkinter.Label(self.window, text=members_text)
			member_label.place(relx=0.5, rely=0.4, anchor=tkinter.CENTER)

			btn_start = tkinter.Button(self.window, text = "Start", command = self.player_window, width=10)
			btn_start.place(relx=0.5, rely=0.6, anchor=tkinter.CENTER)

		else:
			self.browse()

		self.widget_list = self.check_widgets()
		self.window.mainloop()

	def player_window(self):
		try:
			self.clear_window()

			# self.video_streamer = VideoStreamer(self.filename, self.canvas_width, self.canvas_height)
			self.video_streamer = VideoStreamer("/media/varungujarathi9/Varun Seagate HDD/Movies & Series/Asur/Asur 2020 S01E01 Hindi 720p WEBRip x264 AAC - LOKiHD - Telly.mkv")

			# Create a canvas that can fit the above video source size
			self.canvas = tkinter.Canvas(self.window, bg='black')

			# Button that lets the user take a snapshot
			self.btn_pause=tkinter.Button(self.window, text="Pause", command=self.pause)
			self.btn_play = tkinter.Button(self.window, text="Play", command=self.play)

			self.canvas.pack(anchor=tkinter.CENTER, expand=True)
			self.btn_pause.pack(anchor=tkinter.CENTER, expand=True)
			self.btn_play.pack(anchor=tkinter.CENTER, expand=True)

			# After it is called once, the update method will be automatically called every delay milliseconds
			self.fps = self.video_streamer.get_fps()
			self.delay = float(1 / self.fps)
			self.widget_list = self.check_widgets()
			self.update_frame()
			self.window.mainloop()

		except KeyboardInterrupt:
			pass

	def pause(self):
		print("Pause button pressed")

	def play(self):
		print("Play button pressed")

	def update_frame(self):
		global paused
		start_time = time.time()
		frames_count = 0
		while True:
			if not paused:
				# Get a frame from the video source
				# self.canvas.config(width = self.canvas.winfo_width(), height = self.canvas.winfo_height())

				ret, frame = self.video_streamer.get_next_frame(self.canvas.winfo_width(), self.canvas.winfo_height())
				if ret:
					self.photo = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame))
					self.canvas.create_image(0, 0, image = self.photo, anchor = tkinter.NW)
					frames_count += 1
					time.sleep(self.delay)
				else:
					pass


				# # check if the delay right according to fps
				if int((time.time() - start_time) ) >= 1:
					self.delay2 = float(float(frames_count / self.fps) * self.delay)
					self.delay = self.delay2
					frames_count = 0
					start_time = time.time()

	def check_widgets(self):
		_list = self.window.winfo_children()
		return _list

	def clear_window(self):
		for item in self.widget_list:
			if(item.winfo_manager()=='pack'):
				item.pack_forget()
			if(item.winfo_manager()=='grid'):
				item.grid_forget()
			if(item.winfo_manager()=='place'):
				item.place_forget()

	# Non-GUI functions ------------------------------------------
	def login(self):
		self.username = self.text_example.get()

		if self.username == "":
			print('DISPLAY : Username cannot be empty')
		elif len(self.username) <= 1:
			print('DISPLAY : Username cannot be single charecter')
		else:
			print("DISPLAY : Connecting to server")
			self.server_connected, self.error_message = cu.connect_server()
			if self.server_connected:
				print(self.error_message)
				self.create_or_join()
			elif not self.server_connected:
				tkinter.messagebox.showerror("Error",self.error_message)

	def create_room(self):
		global join_flag, room_id
		self.create_room_check = cu.create_room(self.username)
		if self.create_room_check :
			while not join_flag:
				pass

			if join_flag:
				self.room_id = room_id
				join_flag = False
				self.browse()
			else:
				print("DISPLAY : Error creating room")
		else:
			print("DISPLAY : Error creating room")


	def join_room(self):
		global join_flag
		self.room_id = self.enter_room_id.get()
		if len(self.room_id) and self.username:
			self.ret_val = cu.join_room(self.username, self.room_id)
			if self.ret_val :
				while not join_flag:
					pass

				if join_flag:
					join_flag = False
					self.browse()
				else:
					print("DISPLAY : Error joining room")

			else:
				print("DISPLAY : Error joining room")

	def exit_application(self):
		self.ret_val = cu.disconnect_server(self.username, self.room_id)

class VideoStreamer:

	def __init__(self, video_source):
		# Open the video source
		try:
			self.video_file = cv2.VideoCapture(video_source)
			self.ret, self.frame = self.video_file.read()
		except cv2.error as e:
			print('DISPLAY :',e)
		self.video_properties = get_video_properties(video_source)
		if not self.video_file.isOpened():
			raise ValueError("Unable to open video source", video_source)


	def get_next_frame(self, frame_width, frame_height):

		if self.video_file.isOpened():

			# Get video source width and height
			# self.frame_width = frame_width
			# self.frame_height = frame_height
			# self.aspect_ratio = float(frame_width / frame_height)

			ret, frame = self.video_file.read()
			if ret:
				# frame_height, frame_width, _ = frame.shape
				# if frame_height * self.aspect_ratio > frame_width:
				# 	frame = cv2.resize(frame, (int(frame_width/frame_height*self.display_height), self.display_height))
				# else:
				# 	frame = cv2.resize(frame, (self.display_width, int(frame_height/frame_width*self.display_width)))

				# Return a boolean success flag and the current frame converted to BGR
				return (ret, cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
			else:
				return (ret, None)
		else:
			return (False, None)

	def get_fps(self):
		num,den = self.video_properties['avg_frame_rate'].split( '/' )
		result = (float(num)/float(den))
		return result


# Create a window and pass it to the Application object
App(tkinter.Tk(), "Video Party")


