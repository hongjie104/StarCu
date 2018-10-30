#!/usr/bin/env python
# -*- coding:utf-8 -*-
# 

'''
多渠道自动打包工具
'''

__author__ = "32968210@qq.com"

import os, re, codecs, subprocess, getopt, sys

channelList = ["google"]

def modifyConfig(filePath, pattern, replaceStr):
	file = codecs.open(filePath, 'r', 'utf-8')
	fileContent = file.read()
	file.close()

	fileContent = re.sub(pattern, replaceStr, fileContent)

	file = codecs.open(filePath, 'wb', 'utf-8');
	file.write(fileContent)
	file.close()

def createAPK(channel):
	# 修改AndroidManifest
	# modifyConfig(
	# 	r".\app\src\main\AndroidManifest.xml",
	# 	re.compile(r'<meta-data android:name="TD_CHANNEL_ID" android:value=".+" />'),
	# 	u'<meta-data android:name="TD_CHANNEL_ID" android:value="%s" />' % channel
	# )
	# 修改build.gradle
	# modifyConfig(
	# 	r".\app\build.gradle",
	# 	re.compile(r'def fileName = outputFile.name.replace\("app", ".+"\);'),
	# 	u'def fileName = outputFile.name.replace("app", "%s");' % channel
	# )

	# 修改config.js
	# modifyConfig(
	# 	r"..\app\config.js",
	# 	re.compile(r'let channel = ".+";'),
	# 	u'let channel = "%s";' % channel
	# )
	
	# 开始打包
	ps = subprocess.Popen("./gradlew assembleRelease", shell = True)
	ps.wait()

if __name__ == '__main__':
	is_show_help = False
	is_test = False
	try:
		optlist, args = getopt.getopt(sys.argv[1:], "th", ["test", "help"])
		for option, value in optlist:
			if option == "--help" or option == "-h":
				is_show_help = True
			elif option == "--test" or option == "-t":
				is_test = True
	except getopt.error, reason:
		raise Exception(str(reason))
	if is_show_help:
		print(u'''打测试包：python createAPK.py -t
打正式包：python createAPK.py
''')
	elif is_test:
		createAPK("test")
		print(u"搞定了")
	else:
		for x in channelList:
			createAPK(x)
		print(u"搞定了")