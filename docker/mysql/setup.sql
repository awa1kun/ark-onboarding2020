/***CREATING ALL TABLES*/
CREATE TABLE rpses (
    rps_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(100),
    host_user_id INT NOT NULL,
    host_user_name VARCHAR(50),
    status INT DEFAULT 0,
    round INT DEFAULT 1
);

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_name VARCHAR(50),
    join_rps_id INT NOT NULL,
    current_round INT,
    current_hand INT,
    prev_hand INT,
    available BOOLEAN DEFAULT TRUE
);