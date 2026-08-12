import database from "../database/database.js";
import bcrypt from "bcrypt";

function login(req, res){
    const {
        email,
        password
    } = req.body || {};

    if (!email || !password) {
        return res.status(400).send("All fields are required.");
    }

    try{
        const user = database.getUser(email);

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).send(`
              <script>
                alert("Invalid email or password.");
                window.location = "/auth/login";
              </script>
            `);
        }
        req.session.userId = user.user_id;
        req.session.role = user.role;
        req.session.fullName = user.full_name;

        console.log(req.session);

        if (user.role === "admin") {
            return res.redirect('/admin/admin-dashboard');
        }

        return res.redirect('/student/student-dashboard');
    }
    catch (error){
        console.error(error);
        return res.status(500).send("Unable to sign in.");
    }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Unable to log out.");
    }
    console.log("Log out successful");
    res.redirect("/public/index");
  });
}

function register(req, res){
    const {
        first_name,
        last_name,
        email,
        password,
        confirmed_password
    } = req.body || {};

    if (!first_name || !last_name || !email || !password || !confirmed_password) {
        return res.status(400).send(`
          <script>
            alert("All fields are required.");
            window.location = "/auth/register";
          </script>
        `);
    }
    
    if (password !== confirmed_password) {
        return res.status(400).send(`
          <script>
            alert("Passwords do not match.");
            window.location = "/auth/register";
          </script>
        `);
    }

    try {
        const password_hash = bcrypt.hashSync(password, 10);
        database.addUser(`${first_name} ${last_name}`, email, password_hash);

        const user = database.getUser(email);
        req.session.userId = user.user_id;
        req.session.role = user.role;
        req.session.fullName = user.full_name;

        console.log(req.session);

        return res.redirect('/student/student-dashboard');
    } 
    catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).send(`
              <script>
                alert("An account with this email already exists.");
                window.location = "/auth/register";
              </script>
            `);
        }
        console.error(error);
        return res.status(500).send("Unable to create account.");
    }
}

export default {
    login,
    register,
    logout
}
