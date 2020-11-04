# JOIN, PLAY, PAUSE, FORWARD

import socket
import json
import time
import configparser
import _thread
import traceback
import requests

server_socket = None
client_configs = configparser.SafeConfigParser()
client_configs.read('configs.ini')
HOST = client_configs['GeneralSettings']['host']
PORT = int(client_configs['GeneralSettings']['port'])
message_queue = []
users = []

def connect_server():
    global server_socket, HOST, PORT

    if check_internet():
        try:
            server_socket = socket.create_connection((HOST, PORT))

            # start receiving messages from server
            _thread.start_new_thread(receive_messages, ())

            return True, "DISPLAY : Server connected"
        except Exception as e:
            print("EXCEPTION IN CONNECT SERVER: " + str(e))
            traceback.print_exc()
            return False, str(e)
    else:
        return False, "DISPLAY : No internet connection"

def check_internet():
    url = "http://www.google.com"
    timeout = 5
    try:
        request = requests.get(url, timeout=timeout)
        return True
    except (requests.ConnectionError, requests.Timeout) as exception:
        return False

def create_room(username):
    global server_socket

    data = {'action_id':0, 'username':username}
    try:
        server_socket.send(bytes(json.dumps(data), encoding='utf8'))
        return True
    except Exception as e:
        print("EXCEPTION IN CREATE ROOM: " + str(e))
        traceback.print_exc()
        return False

def join_room(username, room_id):
    global server_socket

    data = {'action_id':1, 'username':username, 'room_id':room_id}

    try:
        server_socket.send(bytes(json.dumps(data), encoding='utf8'))
        return True
    except Exception as e:
        print("EXCEPTION IN JOIN ROOM: " +str(e))
        return False

def disconnect_server():
    global server_socket
    data = {'action_id':4, 'username':username, 'room_id':room_id}
    try:
        server_socket.send(bytes(json.dumps(data), encoding='utf8'))
        message_queue = []
        server_socket.close()
        return False
    except Exception as e:
        print("EXCEPTION IN DISCONNECT SERVER: " + str(e))
        return True

def get_users_in_room():
    return users

def receive_messages():
    global message_queue
    print('In receive message')
    while True:
        if server_socket is not None:
            try:
                message = str(server_socket.recv(1024).decode("utf-8"))

                if message in ('',' ', None):
                    server_socket.close()
                    message_queue.append(json.dumps({'closed':'server disconnected'}))
                    break
                else:
                    message_queue.append(message)

            except Exception as e:
                print('ERROR IN RECEIVE MESSAGES:', e)
                message_queue.append(json.dumps({'closed':e}))

        return message_queue


if __name__ == "__main__":
    connect_server()
    time.sleep(1)
    if len(message_queue) > 0 :
        print(message_queue.pop(0))

    create_room('varungujarathi')
    time.sleep(1)
    while True:
        if len(message_queue) > 0 :
            print(message_queue.pop(0))
