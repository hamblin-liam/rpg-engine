function ajax(METHOD, FILE, ARGS, ACTION) {
    var xmlhttp; // Creates xmlhttp variable.
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) // When the page has loaded it will perform this action.
        {
            var response = xmlhttp.responseText;
            ACTION(response); // The action is executed sending using the response variable.
        }
    }

    if (METHOD == "POST") { // Checks if the method is a 'POST' method.
        xmlhttp.open(METHOD, FILE, true); // Opens the connection witht remote file.
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // Sends headers to specify data types.
        xmlhttp.send(ARGS); // Send post arguments.
    } else { // If the method of does not equal 'POST' then it will do this.
        xmlhttp.open(METHOD, FILE + ARGS, true); // This uses the filename and the arguments to send the 'GET' arguments.
        xmlhttp.send(); // Sends the information to the remote file.
    }

}