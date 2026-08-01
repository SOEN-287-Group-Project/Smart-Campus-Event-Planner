class User {
    constructor(
        user_id,
        full_name,
        email,
        password_hash,
        role, // student, admin
        created_at
    ){
        this.user_id = user_id;
        this.full_name = full_name;
        this.email = email;
        this.password_hash = password_hash;
        this.role = role;
        this.created_at = created_at;
    }
}

let user_id = 1;

createUser(
    first_name,
    last_name,
    email,
    password,
    confirmed_password
){
    const statement = db.prepare(`
        INSERT INTO users(
            user_id,
            full_name,
            email,
            password_hash,
            role,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    statement.run(
        user_id++,
        firstName + ' ' + lastName,
        email,
        password,
        'student',
        timestamp
    );

}