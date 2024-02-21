export const createTableQuery = 
    // `
    // CREATE TABLE IF NOT EXISTS User (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     username VARCHAR(255) NOT NULL,
    //     email VARCHAR(255) UNIQUE NOT NULL,
    //     phone VARCHAR(255) NOT NULL,
    //     password VARCHAR(255) NOT NULL
    // )
    // `;
    `CREATE TABLE IF NOT EXISTS users(
        id bigint(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name varchar(255) NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        email_verified_at timestamp NULL DEFAULT NULL,
        password varchar(255) NOT NULL,
        usertype varchar(255) NOT NULL DEFAULT 'user',
        remember_token varchar(100) DEFAULT NULL,
        created_at timestamp NULL DEFAULT NULL,
        updated_at timestamp NULL DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;