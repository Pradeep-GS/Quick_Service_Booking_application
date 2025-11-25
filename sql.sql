-- DATABASE
CREATE DATABASE IF NOT EXISTS QuickServiceDB;
USE QuickServiceDB;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    mail_id VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) UNIQUE,
    dob DATE NOT NULL,
    age INT NOT NULL,
    country VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    pincode INT NOT NULL,
    district VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL
);

-- SERVICE PROVIDER TABLE
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

-- CATEGORY
CREATE TABLE IF NOT EXISTS service_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- PROVIDER-CATEGORY JOIN TABLE
CREATE TABLE IF NOT EXISTS provider_category (
    provider_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (provider_id, category_id),
    FOREIGN KEY (provider_id) REFERENCES service_provider(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES service_category(id) ON DELETE CASCADE
);

-- BOOKING TABLE
CREATE TABLE IF NOT EXISTS booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    service_id INT,
    user_name VARCHAR(255) NOT NULL,
    user_address VARCHAR(255) NOT NULL,
    user_mobile VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    description VARCHAR(255),

    status ENUM('PENDING','ACCEPTED','CANCELLED','COMPLETED') DEFAULT 'PENDING',

    -- PAYMENT FIELDS
    payment_status ENUM('NOT_PAID','PAID') NOT NULL DEFAULT 'NOT_PAID',
    payment_id VARCHAR(200),

    amount_in_paise INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_provider(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service_category(id) ON DELETE SET NULL
);

-- RATING TABLE
CREATE TABLE IF NOT EXISTS rating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    booking_id INT,
    rating_value INT NOT NULL,
    comments VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_provider(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chat_message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    sender_type ENUM('USER', 'PROVIDER') NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES service_provider(id) ON DELETE CASCADE
);

-- INSERT CATEGORIES
INSERT INTO service_category (category_name) VALUES
('Electrician'),
('Plumber'),
('Painter'),
('AC Mechanic'),
('Carpenter'),
('Cleaner'),
('Gardener'),
('Cook'),
('Driver'),
('Technician');

-- INSERT PROVIDERS
INSERT INTO service_provider 
(name, email, password, mobile_number, gender, year_of_experience, salary_per_hr, dob, age, country, address, pincode, district, state)
VALUES
('Provider1', 'provider1@gmail.com', 'Provider@123', '9000000001', 'Male', 3, 250, '1999-05-10', 26, 'India', 'Address1', '600001', 'Chennai', 'Tamil Nadu'),
('Provider2', 'provider2@gmail.com', 'Provider@123', '9000000002', 'Female', 5, 300, '1997-04-20', 28, 'India', 'Address2', '600002', 'Chennai', 'Tamil Nadu'),
('Provider3', 'provider3@gmail.com', 'Provider@123', '9000000003', 'Male', 2, 200, '2001-03-15', 24, 'India', 'Address3', '600003', 'Chennai', 'Tamil Nadu'),
('Provider4', 'provider4@gmail.com', 'Provider@123', '9000000004', 'Male', 8, 400, '1995-07-25', 30, 'India', 'Address4', '600004', 'Chennai', 'Tamil Nadu'),
('Provider5', 'provider5@gmail.com', 'provider@123', '9000000005', 'Female', 4, 280, '1998-06-18', 27, 'India', 'Address5', '600005', 'Chennai', 'Tamil Nadu');

-- PROVIDER ↔ CATEGORY MAPPING
INSERT INTO provider_category (provider_id, category_id) VALUES
(1,1),(1,2),
(2,5),(2,3),
(3,4),
(4,1),(4,6),
(5,7),(5,10);

-- INSERT USERS
INSERT INTO users (user_name, mail_id, password, mobile_number, dob, age, country, address, pincode, district, state)
VALUES
('User1', 'user1@gmail.com', 'User@123', '9000000101', '2000-01-01', 25, 'India', 'Address1', 600100, 'Chennai', 'Tamil Nadu'),
('User2', 'user2@gmail.com', 'User@123', '9000000102', '2001-02-02', 24, 'India', 'Address2', 600101, 'Chennai', 'Tamil Nadu'),
('User3', 'user3@gmail.com', 'User@123', '9000000103', '2002-03-03', 23, 'India', 'Address3', 600102, 'Chennai', 'Tamil Nadu'),
('User4', 'user4@gmail.com', 'User@123', '9000000104', '2003-04-04', 22, 'India', 'Address4', 600103, 'Chennai', 'Tamil Nadu');

-- INSERT BOOKINGS (updated with amount_in_paise)
INSERT INTO booking 
(user_id, provider_id, service_id, user_name, user_address, user_mobile, booking_date, booking_time, description, status, amount_in_paise)
VALUES
(1, 1, 1, 'User1', 'Address1', '9000000101', '2025-11-10', '10:00:00', 'Fan not working', 'ACCEPTED', 25000),
(1, 2, 5, 'User1', 'Address1', '9000000101', '2025-11-12', '14:30:00', 'Furniture repair', 'ACCEPTED', 30000),
(2, 3, 4, 'User2', 'Address2', '9000000102', '2025-11-11', '16:00:00', 'AC cooling low', 'PENDING', 20000),
(3, 4, 6, 'User3', 'Address3', '9000000103', '2025-11-07', '12:00:00', 'Deep cleaning service', 'ACCEPTED', 40000),
(4, 5, 3, 'User4', 'Address4', '9000000104', '2025-11-06', '10:45:00', 'Painting service', 'ACCEPTED', 28000);
SELECT * FROM booking;
SELECT * FROM users;
SELECT * FROM service_category;
SELECT * FROM  service_provider;
SELECT * FROM chat_message;
 -- DROP DATABASE QuickServiceDB;
