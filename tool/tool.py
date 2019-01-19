#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import sys

reload(sys)
sys.setdefaultencoding('utf-8')


def get_city_data(parent_id):
	city_arr = []
	for data in source_json:
		if data.get('parent_id') == parent_id:
			city_arr.append(data)
	return city_arr



if __name__ == '__main__':
	f = open('s_city_list.json')
	source_json = f.read()
	f.close()
	source_json = json.loads(source_json)
	source_json = source_json.get('RECORDS')

	result = []
	for data in source_json:
		if data.get('parent_id') == 0:
			result.append({
				'name': data.get('name'),
				'id': data.get('id'),
				'city': []
			})

	for city in result:
		for data in source_json:
			if data.get('parent_id') == city.get('id'):
				# area_arr = get_city_data(data.get('id'))
				city.get('city').append({
					'name': data.get('name'),
					'id': data.get('id'),
					# 'area': area_arr
				})

	# print(result[0])
	f = open('city.json', 'w')
	f.write(json.dumps(result).encode('utf-8').decode('unicode_escape'))
	# f.write(json.dumps(result).encode('gbk'))
	f.close()
	print('done')
		