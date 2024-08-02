from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)


df = pd.read_csv('house_prices.csv')

states_and_cities = df.groupby('state')['city'].apply(lambda x: list(set(x))).to_dict()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_locations', methods=['GET'])
def get_locations():
    return jsonify(states_and_cities)

@app.route('/predict', methods=['POST'])
def predict():
    content = request.json
    state = content['state']
    city = content['city']
    bhk_type = content['bhkType']
    
    result = df[(df['state'] == state) & (df['city'] == city) & (df['type'] == bhk_type)]
    
    if result.empty:
        return jsonify({'price': 'N/A', 'quality': 'N/A'})
    

    price = result.iloc[0]['price']
    quality = result.iloc[0]['quality']
    

    price = float(price)  
    
    return jsonify({'price': price, 'quality': quality})

if __name__ == '__main__':
    app.run(debug=True)
