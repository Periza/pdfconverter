<?php
    var_dump($_FILES['userfile']);
    if(isset($_FILES['userfile'])) {
        $fileName = $_FILES['userfile']['name'];
        $tempName = $_FILES['userfile']['tmp_name'];
        $local_files = 'uploads/';
        move_uploaded_file($tempName, $local_files.$fileName);
    }
?>