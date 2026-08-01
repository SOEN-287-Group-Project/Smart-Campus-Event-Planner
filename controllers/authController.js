
function showLogin(req, res){
    res.sendFile("login.html", {root: "views"});
} 

function showRegister(req, res){
    res.sendFile("register.html", {root: "views"});
}

function login(req, res){

}

function register(){
    const {
        first_name,
        last_name,
        email,
        password,
        confirmed_password
    } = req.body;

}

function logout(){

}

export {
    showLogin,
    showRegister,
    login,
    register
}