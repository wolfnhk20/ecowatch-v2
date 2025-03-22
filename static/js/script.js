let species_data = []

document.addEventListener("DOMContentLoaded", function () {
    fetch("/data.json")
        .then(response => response.json())
        .then(data => {
            species_data = data;
        })
        .catch(error => console.error("Error loading species data:", error));

    const video = document.getElementById('camera');
    let videoStream = null;
    let previewFile = null;

    document.querySelectorAll('.fade-in').forEach(element => {
        setTimeout(() => element.classList.add('show'), 100);
    });


    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then((stream) => {
                videoStream = stream;
                video.srcObject = videoStream;
            })
            .catch((error) => console.error('Error accessing camera:', error));
    }

    function stopCamera() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
    }

    function captureImage() {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL("image/jpeg");

        document.getElementById("preview-image").src = imageDataURL;
        document.getElementById("preview-section").style.display = "block";
        previewFile = dataURLtoFile(imageDataURL, "captured-image.jpg");
        document.getElementById('preview-section').scrollIntoView({ behavior: 'smooth' });
        stopCamera();
    }

    function dataURLtoFile(dataURL, filename) {
        const byteString = atob(dataURL.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new File([ab], filename, { type: "image/jpeg" });
    }

    function resetApp() {
        location.reload();
    }

    function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("preview-image").src = e.target.result;
            document.getElementById("preview-section").style.display = "block";
        };
        reader.readAsDataURL(file);
        previewFile = file;
    }


    function uploadMedia() {
        const input = document.getElementById("uploadInput");
        if (input.files.length > 0) {
            handleFileUpload(input.files[0]);
            document.getElementById("preview-section").style.display = "block";
            document.getElementById('preview-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    function identifySpecies() {
        if (!previewFile) {
            console.error("No file selected for processing");
            return;
        }

        const formData = new FormData();
        formData.append("file", previewFile);

        document.getElementById('processed-section').style.display = 'block';
        document.getElementById('processed-info').innerHTML = `<p>🔍 Identifying species... Please wait.</p>`;

        $.ajax({
            url: "/identify",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log(response);
                search(response.label.toString());
            },
            error: function () {
                displaySpeciesNotFound();
                console.error("Identification Error!");
            }
        });
    }

    window.search = function (species) {
        if (!species || species.trim() === "") {
            alert('No data Entered!');
            return;
        }

        species = species.trim().toLowerCase();
        let foundSpecies = species_data.find(animal => animal.name.toLowerCase() === species);

        document.getElementById('processed-section').style.display = 'block';
        document.getElementById('processed-section').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('processed-info').innerHTML = `<p>🦿 Fetching Info ... Please wait.</p>`;

        if (foundSpecies) {
            displaySpeciesInfo(foundSpecies);
        } else {
            fetchFromApi(species);
        }
    };

    function fetchFromApi(species) {
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/animals?name=' + encodeURIComponent(species),
            headers: { 'X-Api-Key': 'yUUcMvgCc5K84gXqrWTTyw==PXB6CQuS3FDzkO7h' },
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                let animal = null;

                if (result.length > 0) {
                    animal = result.find(ani => ani.name.toLowerCase() === species);
                    displaySpeciesInfo(animal);
                } else {
                    displaySpeciesNotFound();
                }
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
                document.getElementById('processed-info').innerHTML = `
                    <p style="font-size: 16px;"><b>Error fetching data. Try again later.</b></p>
                `;
            }
        });
    }

    function displaySpeciesInfo(animal) {
        document.getElementById('processed-info').innerHTML = `
            <h2>${animal.name}</h2>
            <h3>Scientific Name:</h3> <p>${animal.taxonomy?.scientific_name || "N/A"}</p>

            <h3>Classification:</h3>
            <p><b>Kingdom:</b> ${animal.taxonomy?.kingdom || "N/A"}</p>
            <p><b>Phylum:</b> ${animal.taxonomy?.phylum || "N/A"}</p>
            <p><b>Class:</b> ${animal.taxonomy?.class || "N/A"}</p>
            <p><b>Order:</b> ${animal.taxonomy?.order || "N/A"}</p>
            <p><b>Family:</b> ${animal.taxonomy?.family || "N/A"}</p>
            <p><b>Genus:</b> ${animal.taxonomy?.genus || "N/A"}</p>

            <h3>Physical Characteristics:</h3>
            <p><b>Distinctive Features:</b> ${animal.characteristics?.most_distinctive_feature || "N/A"}</p>
            <p><b>Skin Type:</b> ${animal.characteristics?.skin_type || "N/A"}</p>
            <p><b>Color:</b> ${animal.characteristics?.color || "N/A"}</p>
            <p><b>Height:</b> ${animal.characteristics?.height || "N/A"}</p>
            <p><b>Weight:</b> ${animal.characteristics?.weight || "N/A"}</p>
            <p><b>Top Speed:</b> ${animal.characteristics?.top_speed || "N/A"}</p>

            <h3>Habitat & Lifestyle:</h3>
            <p><b>Habitat:</b> ${animal.characteristics?.habitat || "N/A"}</p>
            <p><b>Locations:</b> ${animal.locations ? animal.locations.join(", ") : "N/A"}</p>
            <p><b>Group Behavior:</b> ${animal.characteristics?.group_behavior || "N/A"}</p>
            <p><b>Lifestyle:</b> ${animal.characteristics?.lifestyle || "N/A"}</p>

            <h3>Diet & Predation:</h3>
            <p><b>Diet:</b> ${animal.characteristics?.diet || "N/A"}</p>
            <p><b>Prey:</b> ${animal.characteristics?.prey || "N/A"}</p>

            <h3>Reproduction & Lifespan:</h3>
            <p><b>Average Lifespan:</b> ${animal.characteristics?.lifespan || "N/A"}</p>
            <p><b>Gestation Period:</b> ${animal.characteristics?.gestation_period || "N/A"}</p>
            <p><b>Number of Species:</b> ${animal.characteristics?.number_of_species || "N/A"}</p>
            <p><b>Name of Young:</b> ${animal.characteristics?.name_of_young || "N/A"}</p>
            <p><b>Average Litter Size:</b> ${animal.characteristics?.average_litter_size || "N/A"}</p>
            <p><b>Age of Sexual Maturity:</b> ${animal.characteristics?.age_of_sexual_maturity || "N/A"}</p>
            <p><b>Age of Weaning:</b> ${animal.characteristics?.age_of_weaning || "N/A"}</p>

            <h3>Conservation & Threats:</h3>
            <p><b>Estimated Population:</b> ${animal.characteristics?.estimated_population_size || "N/A"}</p>
            <p><b>Biggest Threat:</b> ${animal.characteristics?.biggest_threat || "N/A"}</p>

            <h3>Fun Fact:</h3>
            <p>${animal.characteristics?.slogan || "N/A"}</p>
        `;
    }


    function displaySpeciesNotFound() {
        document.getElementById('processed-section').style.display = 'block';
        document.getElementById('processed-section').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('processed-info').innerHTML = `
        <p style="font-size:18px; color:red;">⚠️ Wildlife species not recognized!</p>
        <p>Try uploading a clearer image or check the species manually.</p>
        <button class='btn-secondary' onclick="document.getElementById('intro').scrollIntoView({ behavior: 'smooth' });">Try Manually</button>`;
    }


    window.startCamera = startCamera;
    window.stopCamera = stopCamera;
    window.captureImage = captureImage;
    window.uploadMedia = uploadMedia;
    window.identifySpecies = identifySpecies;
    window.resetApp = resetApp;
});

document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const uploadText = document.getElementById("upload-text");
    const uploadInput = document.getElementById("uploadInput");

    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("dragging");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("dragging");
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("dragging");

        let files = e.dataTransfer.files;
        handleFiles(files);
    });

    dropArea.addEventListener("click", () => {
        uploadInput.click();
    });
});

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];

        if (file.type.startsWith("image/")) {
            document.getElementById("upload-text").innerText = `📂 ${file.name}`;
            document.getElementById("uploadInput").files = files;
        } else {
            alert("Please upload a valid image file.");
        }
    }
}

function uploadMedia() {
    const fileInput = document.getElementById("uploadInput");

    if (!fileInput.files.length) {
        alert("Please select an image first.");
        return;
    }

    alert("Image uploaded successfully!");
}
