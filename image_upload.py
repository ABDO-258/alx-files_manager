import base64
import requests
import sys

file_path = sys.argv[1]
print(file_path)
file_name = file_path.split('/')[-1]
print(file_name)
file_encoded = None
with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

r_json = { 'name': file_name, 'type': 'image', 'isPublic': True, 'data': file_encoded, 'parentId': sys.argv[3] }
print(r_json)

r_headers = { 'X-Token': sys.argv[2] }
print(r_headers)
print('test')
r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)
print('fin')
print(r.json())