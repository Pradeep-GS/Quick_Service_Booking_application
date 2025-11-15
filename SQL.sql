CREATE DATABASE IF NOT EXISTS QuickServiceDB;
USE QuickServiceDB;

CREATE TABLE IF NOT EXISTS service_provider (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(20) UNIQUE NOT NULL,
    gender VARCHAR(10),
    year_of_experience INT,
    salary_per_hr FLOAT,
    dob DATE,
    age INT,
    country VARCHAR(50),
    address VARCHAR(255),
    pincode VARCHAR(20),
    district VARCHAR(50),
    state VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS USERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    mail_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(255) UNIQUE,
    dob DATE NOT NULL,
    age INT NOT NULL,
    country VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    pincode INT NOT NULL,
    district VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS service_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS provider_category (
    provider_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (provider_id, category_id),
    FOREIGN KEY (provider_id) REFERENCES service_provider(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES service_category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    service_id INT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    description VARCHAR(255),
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_provider(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service_category(id) ON DELETE SET NULL
);

INSERT INTO service_category (id, category_name) VALUES
(1, 'Electrician'),
(2, 'Plumber'),
(3, 'Painter'),
(4, 'AC Mechanic'),
(5, 'Carpenter'),
(6, 'Cleaner'),
(7, 'Gardener'),
(8, 'Cook'),
(9, 'Driver'),
(10, 'Technician');

INSERT INTO service_provider 
(name, email, password, mobile_number, gender, year_of_experience, salary_per_hr, dob, age, country, address, pincode, district, state)
VALUES
('Provider1', 'provider1@gmail.com', 'Provider@123', '9876500010', 'Male', 3, 250.0, '1999-05-10', 26, 'India', 'Karur', '639001', 'Karur', 'Tamil Nadu'),
('Provider2', 'provider2@gmail.com', 'Provider@123', '9876500020', 'Female', 5, 300.0, '1997-04-20', 28, 'India', 'Chennai', '600001', 'Chennai', 'Tamil Nadu'),
('Provider3', 'provider3@gmail.com', 'Provider@123', '9876500030', 'Male', 2, 200.0, '2001-03-15', 24, 'India', 'Madurai', '625001', 'Madurai', 'Tamil Nadu'),
('Provider4', 'provider4@gmail.com', 'Provider@123', '9876500040', 'Male', 8, 400.0, '1995-07-25', 30, 'India', 'Coimbatore', '641001', 'Coimbatore', 'Tamil Nadu'),
('Provider5', 'provider5@gmail.com', 'provider@123', '9876500050', 'Female', 4, 280.0, '1998-06-18', 27, 'India', 'Trichy', '620001', 'Trichy', 'Tamil Nadu'),
('Provider6', 'provider6@gmail.com', 'Provider@123', '9876500060', 'Male', 6, 350.0, '1996-09-05', 29, 'India', 'Salem', '636001', 'Salem', 'Tamil Nadu'),
('Provider7', 'provider7@gmail.com', 'Provider@123', '9876500070', 'Male', 10, 500.0, '1993-12-22', 32, 'India', 'Erode', '638001', 'Erode', 'Tamil Nadu'),
('Provider8', 'provider8@gmail.com', 'Provider@123', '9876500080', 'Female', 3, 220.0, '2000-10-10', 25, 'India', 'Dindigul', '624001', 'Dindigul', 'Tamil Nadu'),
('Provider9', 'provider9@gmail.com', 'Provider@123', '9876500090', 'Male', 7, 420.0, '1994-01-14', 31, 'India', 'Thanjavur', '613001', 'Thanjavur', 'Tamil Nadu'),
('Provider10', 'provider10@gmail.com', 'Provider@123', '9876500100', 'Female', 5, 320.0, '1997-11-30', 28, 'India', 'Vellore', '632001', 'Vellore', 'Tamil Nadu');

INSERT INTO provider_category (provider_id, category_id) VALUES
(1, 1), (1, 2),
(2, 5), (2, 3),
(3, 4),
(4, 1), (4, 6), (4, 9),
(5, 7), (5, 10),
(6, 2), (6, 5),
(7, 8), (7, 9),
(8, 3), (8, 4), (8, 10),
(9, 1), (9, 2), (9, 6), (9, 8),
(10, 5), (10, 7), (10, 9);

select * from USERS;
SELECT * FROM  service_provider;
SELECT * FROM booking;
-- DROP database QuickServiceDB;