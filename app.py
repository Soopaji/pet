import google.generativeai as genai
import os
from flask import Flask, jsonify, request, render_template

# Configure Google Gemini API
genai.configure(api_key="AIzaSyCWjlAAysIa65rncjBnn_J0UQL8qGMDACM")  # Replace with your API key

app = Flask(__name__)

class Pet:
    def __init__(self, name, pet_type):
        self.name = name
        self.pet_type = pet_type
        self.happiness = 100

    def feed(self):
        self.happiness += 10
        return f"{self.name} happily eats the food! 🍖"

    def play(self):
        self.happiness += 5
        return f"{self.name} enjoys playing! 🐾"

    def check_mood(self):
        if self.happiness > 80:
            return f"{self.name} is very happy! 😊"
        elif self.happiness > 50:
            return f"{self.name} is content. 😌"
        else:
            return f"{self.name} seems a bit sad. 😢"

def generate_ai_response(pet, prompt):
    """
    Generates a response using Google Gemini AI.
    The response is customized based on the pet's type.
    """
    if pet.pet_type.lower() == "cat":
        animal_instruction = "Always start your response with 'Meow,'"
    elif pet.pet_type.lower() == "dog":
        animal_instruction = "Always start your response with 'Woof!'"
    else:
        animal_instruction = ""

    full_prompt = (
        f"You are a {pet.pet_type} named {pet.name}. {animal_instruction} "
        f"Respond naturally in a conversational style to this message: {prompt}"
    )

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(full_prompt)
        return response.text.strip()
    except Exception as e:
        print("Google Gemini API Error:", e)
        return f"{pet.name} stays silent."

# Store the pet instance
pet = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/create_pet', methods=['POST'])
def create_pet():
    global pet
    data = request.json
    pet_name = data.get('name')
    pet_type = data.get('type')
    pet = Pet(pet_name, pet_type)
    return jsonify({"message": f"{pet_name} the {pet_type} has been created!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    global pet
    if pet is None:
        return jsonify({"response": "Please create a pet first!"})

    user_input = request.json.get('message')
    response = generate_ai_response(pet, user_input)
    
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
