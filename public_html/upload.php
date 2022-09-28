

<?php
var_dump($_FILES);
if(isset($_FILES['userfile'])) {
    $fileName = $_FILES['userfile']['name'];
    $tempName = $_FILES['userfile']['tmp_name'];
    $fileError = $_FILES['userfile']['error'];

    echo $tempName;
    
    $fileNameWithoutExt = explode('.', $fileName)[0];
    $fileExt = strtolower(end(explode('.', $fileName)));

    // allowed file types
    $allowedImageFiles = array('jpg', 'jpeg', 'png');
    $allowedDocumentFiles = array('odt', 'docx', 'doc');

    // check if the file is allowed to be converted
    if(in_array($fileExt, $allowedImageFiles) || in_array($fileExt, $allowedDocumentFiles)) {
        // check for errors
        if($fileError === 0) {
            $uniquePart = uniqid('');
            $newFileName = $fileNameWithoutExt.$uniquePart.'.pdf';
            // if the file is an image
            if(in_array($fileExt, $allowedImageFiles)) {
                // use image converter
                exec("img2pdf $tempName --output $newFileName");
                
            } 
            // the file is a document
            else {
                // move the file
                exec("libreoffice --headless --convert-to pdf $tempName");
                rename(end(explode('/', $tempName)).".pdf", $newFileName);
            }

            header('Content-type: application/pdf');
            header("Content-Disposition: attachment; filename=$newFileName");
            readfile("$newFileName");

            // delete the file
            unlink($newFileName);
        } else {
            echo "There was an error during upload!";
        }
    } else {
        echo "Type of file not supported!";
    }
}
?>