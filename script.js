const URL = "./my_model/";

let model, webcam, maxPredictions;

// Load model
async function loadModel() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    maxPredictions = model.getTotalClasses();
}

loadModel();

// Preview image
function previewImage() {
    const file = document.getElementById("imageUpload").files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const img = document.getElementById("preview");
        img.src = reader.result;
        img.style.display = "block";
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Predict Image
async function predictImage() {
    const img = document.getElementById("preview");
    const prediction = await model.predict(img);

    let highest = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highest.probability) {
            highest = prediction[i];
        }
    }

    document.getElementById("prediction").innerHTML =
        "Skin Type: " + highest.className;

    document.getElementById("recommendation").innerHTML =
        getRecommendation(highest.className);
}

// Start Camera
async function startCamera() {
    try {
        webcam = new tmImage.Webcam(300, 300, true);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").innerHTML = "";
        document.getElementById("webcam-container").appendChild(webcam.canvas);
    } catch (e) {
        alert("Allow camera permission and refresh page");
    }
}

// Loop for live prediction
async function loop() {
    webcam.update();
    await predictWebcam();
    window.requestAnimationFrame(loop);
}

// Predict webcam
async function predictWebcam() {
    const prediction = await model.predict(webcam.canvas);

    let highest = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highest.probability) {
            highest = prediction[i];
        }
    }

    document.getElementById("prediction").innerHTML =
        "Skin Type: " + highest.className;

    document.getElementById("recommendation").innerHTML =
        getRecommendation(highest.className);
}

// Recommendations
function getRecommendation(type) {
    if (type === "Dry") return "Use moisturizer and drink more water.";
    if (type === "Oily") return "Use oil-free cleanser twice daily.";
    if (type === "Normal") return "Maintain basic skincare routine.";
    return "Follow general skincare routine.";
}

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
