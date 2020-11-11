#
#
#
##
##import sys
##from PyQt5.QtWidgets import QApplication, QDialog
##from PyQt5.QtWidgets import QApplication
##from PyQt5.QtCore import QUrl
#
##
##app = QApplication(sys.argv)
##window = QDialog()
##
##window.show()
#
#
#
#
#import sys
#from PyQt5.QtWidgets import QApplication, QWidget, QPushButton,QLineEdit
#from PyQt5.QtGui import QIcon
#from PyQt5.QtCore import pyqtSlot,QUrl
#from PyQt5.QtWebEngineWidgets import QWebEngineView
#
#class App(QWidget):
#
#    def __init__(self):
#        super().__init__()
#        self.title = 'PyQt5 button - pythonspot.com'
#        self.left = 10
#        self.top = 10
#        self.width = 320
#        self.height = 200
#        self.initUI()
#    
#    def initUI(self):
#        self.setWindowTitle(self.title)
#        self.setGeometry(self.left, self.top, self.width, self.height)
#        
#        textbox = QLineEdit(self)
#        textbox.move(20, 20)
#        textbox.resize(280,40)
#        button = QPushButton('Connect', self)
#        button.setToolTip('Connect to server')
#        button.move(100,70)
#        button.clicked.connect(self.on_click)
#        
#        self.show()
#
#    @pyqtSlot()
#    def on_click(self):
#        print('PyQt5 button click')
#
#
#
#    #viewing browser tabs using PyQt5
#    def video(self):
# 
#        url = 'https://www.youtube.com/watch?v=jUOzJIWfLX8'
#    
##        app = QApplication(sys.argv)
# 
##        browser = QWebEngineView()
##        browser.load(QUrl(url))
##        self.show()
##        app.exec_()
#
# 
#
#if __name__ == '__main__':
#    app = QApplication(sys.argv)
#    ex = App()
#    sys.exit(app.exec_())


from PyQt5 import QtWidgets, uic
import sys

class Ui(QtWidgets.QMainWindow):
    def __init__(self):
        super(Ui, self).__init__()
        uic.loadUi('basic.ui', self)

        self.button = self.findChild(QtWidgets.QPushButton, 'printButton') # Find the button
        self.button.clicked.connect(self.printButtonPressed) # Remember to pass the definition/method, not the return value!

        self.show()

    def printButtonPressed(self):
        # This is executed when the button is pressed
        print('printButtonPressed')

app = QtWidgets.QApplication(sys.argv)
window = Ui()
app.exec_()

 

