let pet = null;
const API_KEY = "AIzaSyCWjlAAysIa65rncjBnn_J0UQL8qGMDACM"; // Replace with your actual API key

function createPet() {
    const name = document.getElementById("pet-name").value;
    const type = document.getElementById("pet-type").value;
    pet = { name, type, happiness: 100 };

    document.getElementById("pet-info").innerText = `${name} the ${type} has been created!`;
}

async function generateAIResponse(prompt) {
    if (!pet) {
        return "Please create a pet first!";
    }

    const animalIntro = pet.type === "cat" ? "Meow, " : pet.type === "dog" ? "Woof! " : pet.type === "parrot" ? "Squawk! " : "";
    const fullPrompt = `You are a ${pet.type} named ${pet.name}. Respond like a ${pet.type} would. Message: ${prompt}`;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
        });

        const data = await response.json();
        return animalIntro + (data.candidates?.[0]?.content?.parts?.[0]?.text || "...");
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Your pet stays silent.";
    }
}

async function sendMessage(action = null) {
    const userInput = action || document.getElementById("user-input").value;
    if (!pet) {
        alert("Please create a pet first!");
        return;
    }

    let petResponse;
    if (userInput.toLowerCase() === "feed") {
        pet.happiness += 10;
        petResponse = `${pet.name} happily eats! 🍖`;
    } else if (userInput.toLowerCase() === "play") {
        pet.happiness += 5;
        petResponse = `${pet.name} enjoys playing! 🐾`;
    } else {
        petResponse = await generateAIResponse(userInput);
    }

    document.getElementById("chat-output").innerHTML += `<p><b>You:</b> ${userInput}</p>`;
    document.getElementById("chat-output").innerHTML += `<p><b>${pet.name}:</b> ${petResponse}</p>`;
}
