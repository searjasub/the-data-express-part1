function login() {
    let url = "/create";
    let myForm = document.getElementById('form');
    myForm.action = url;
    myForm.submit();
}