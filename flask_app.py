from flask import Flask, request, jsonify
from flask_cors import CORS 
import requests
import json  

app = Flask(__name__)
CORS(app)

def process_message_fragment(message):
    resp = ''
    message_type = message['messageType']
    fragments = message.get('fragments', [])
    
    if message_type == 'CONTENT':
        if fragments:
            for fragment in fragments:
                text = fragment.get('text', '')
                resp+= text
    return resp

def process_response_message_stream(response):
    resp = ''
    for line in response.iter_lines():
        if line:
            line_json = json.loads(line)
            messages = line_json.get('messages', [])
            for message in messages:
                resp += process_message_fragment(message)
    return resp

def answerCustomerQuery(query):
    url = 'https://your-api.com/chat'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    }
    
    data = {
        'stream': False, 
        'applicationId': "your-app-id",
        'messages': [{
            'author': 'USER',
            'fragments': [{'text': query}]
        }],
    }

    try:
        with requests.post(url, headers=headers, json=data, stream=True) as response:
            if response.status_code == 200:
                resp = process_response_message_stream(response)
            else:
                print(f'Status code: {response.status_code}, error: {response.text}')
                exit(1)
    except requests.exceptions.RequestException as e:
        print(f'Request Exception: {str(e)}')
        exit(1)

    answer = resp    
    return answer

@app.route('/api/ask', methods=['POST'])  

def ask():  
    data = request.get_json()    
    text = data.get('text', '')  
    print("Question : ",text) 
    answer = answerCustomerQuery(text)
    print(answer)
    response = {  
        'answer': answer  
    }   
    return jsonify(response)  
  
if __name__ == '__main__':  
    app.run(debug=True)  