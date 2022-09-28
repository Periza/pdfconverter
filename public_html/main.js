const button = document.getElementById("convertButton");

document.querySelectorAll(".drop-zone__input").forEach(inputElement => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", event => {
        inputElement.click();
    });

    inputElement.addEventListener("change", event => {
        if(inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);

            // remove class from button
            button.classList.remove('fileNotPresent');
            // add class form button
            button.classList.add('filePresent');

            button.addEventListener('click', (event) => {
                uploadFile(event, inputElement.files[0]);
            });

            
        }

    })

    dropZoneElement.addEventListener("dragover", event => {
        event.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    })

    dropZoneElement.addEventListener("dragleave", event => {
        dropZoneElement.classList.remove("drop-zone--over");
    });

    dropZoneElement.addEventListener("dragend", event => {
        dropZoneElement.classList.remove("drop-zone--over");
    });

    dropZoneElement.addEventListener("drop", event => {
        event.preventDefault();
        
        if(event.dataTransfer.files.length) {
            inputElement.files = event.dataTransfer.files;

            updateThumbnail(dropZoneElement, event.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("drop-zone--over");
    })
});

/**
 * 
 * @param {HTMLElement} dropZoneElement 
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if(dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // first time, there is no thumbnail element, so let's create it
    if(!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    // Show thumbnail for image files
    if(file.type.startsWith("image/")) {
        const reader = new FileReader();
        
        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`
        }
    } else {
        thumbnailElement.style.backgroundImage = null;
    }

}

/**
 * @async
 * @param {Event} event
 * @param {File} file
 */
async function uploadFile(event, file) {
    // new form data
    let formData = new FormData();
    formData.append("userfile", file);

    const result = await fetch('/upload.php', {
        method: "POST",
        body: formData
    });

    const filename = result.headers.get('content-disposition').split("filename=")[1].split(";")[0];

    const blob = await result.blob();
    const href = URL.createObjectURL(blob);
    
    const pdf = Object.assign(document.createElement('a'), {href, style:"display:none", download: filename});

    document.body.appendChild(pdf);
    pdf.click();

    URL.revokeObjectURL(href);
    pdf.remove();
}


