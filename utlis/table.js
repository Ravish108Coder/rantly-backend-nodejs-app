export const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
        id bigint(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name varchar(255) NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        email_verified_at timestamp NULL DEFAULT NULL,
        password varchar(255) NOT NULL,
        usertype varchar(255) NOT NULL DEFAULT 'user',
        remember_token varchar(100) DEFAULT NULL,
        created_at timestamp NULL DEFAULT NULL,
        updated_at timestamp NULL DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

export const bookingsTableQuery = `
CREATE TABLE IF NOT EXISTS bookings (
  id bigint(20) UNSIGNED AUTO_INCREMENT NOT NULL,
  user_id bigint(20) UNSIGNED NOT NULL,
  name varchar(255) NOT NULL,
  car_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  GSTno varchar(15) NOT NULL DEFAULT '',
  booking_from datetime NOT NULL,
  booking_till datetime NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;


export const renderOtherPage = (page) => {
    return (req, res) => {
      const UserRole = req.user.usertype;
      const pagetitle = page.split('.html')[0];
        return res.render(pagetitle, {UserRole: UserRole, UserName: req.user.name, UserEmail: req.user.email,
          UserId: req.user.id});
    }
}