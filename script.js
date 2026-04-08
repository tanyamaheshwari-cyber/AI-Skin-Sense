const URL = "./my_model/"

let model, webcam, maxPredictions

async function loadModel(){
    const modelURL = URL + "model.json"
    const metadataURL = URL + "metadata.json"

    model = await tmImage.load(modelURL, metadataURL)
    maxPredictions = model.getTotalClasses()
}

loadModel()

function previewImage(){
    const file = document.getElementById("imageUpload").files[0]
    const reader = new FileReader()

    reader.onload = function(){
        const img = document.getElementById("preview")
        img.src = reader.result
        img.style.display = "block"
    }

    if(file){
        reader.readAsDataURL(file)
    }
}

async function predictImage(){
    const img = document.getElementById("preview")
    const prediction = await model.predict(img)
    showResult(prediction)
}

async function startCamera(){
    webcam = new tmImage.Webcam(300,300,true)
    await webcam.setup()
    await webcam.play()
    window.requestAnimationFrame(loop)

    document.getElementById("webcam-container").appendChild(webcam.canvas)
}

async function loop(){
    webcam.update()
    await predictCamera()
    window.requestAnimationFrame(loop)
}

async function predictCamera(){
    const prediction = await model.predict(webcam.canvas)
    showResult(prediction)
}

function showResult(prediction){

    let highest = prediction[0]

    for(let i=1;i<prediction.length;i++){
        if(prediction[i].probability > highest.probability){
            highest = prediction[i]
        }
    }

    let result = highest.className
    let rec = ""

    if(result.toLowerCase().includes("vitiligo")){
        rec="White patch detected. Use sunscreen and consult dermatologist."
    }
    else if(result.toLowerCase().includes("oily")){
        rec="Use oil-free facewash and avoid heavy creams."
    }
    else if(result.toLowerCase().includes("dry")){
        rec="Use hydrating moisturizer and drink more water."
    }
    else{
        rec="Maintain regular skincare routine."
    }

    document.getElementById("prediction").innerHTML = result
    document.getElementById("recommendation").innerHTML = rec
}

function toggleDarkMode(){
    document.body.classList.toggle("dark")
}
