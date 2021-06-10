function showpassword() {
    var x = document.getElementById("input-password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
};
