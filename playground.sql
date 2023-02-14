INSERT INTO plane 

CREATE TABLE carrier (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    carrier_name VARCHAR(255) NOT NULL,
    fuel INTEGER,
    carrier_money INTEGER
);

CREATE TABLE plane (
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    carrier_id INTEGER NOT NULL,
    airport_id VARCHAR(40) NOT NULL,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (carrier_id) REFERENCES carrier(id),
    FOREIGN KEY (airport_id) REFERENCES airport(ident)
);
CREATE TABLE carrier (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    carrier_name VARCHAR(255)
);