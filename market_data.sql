DROP DATABASE IF EXISTS vendorlink;
CREATE DATABASE vendorlink;
USE vendorlink;

-- =========================
-- VENDORS TABLE
-- =========================
CREATE TABLE vendors (
    vendor_id VARCHAR(20) PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL,
    vendor_type ENUM('Farmer','Wholesaler','Retailer') NOT NULL,
    village VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) CHECK (rating BETWEEN 0 AND 5),
    trust_score INT DEFAULT 0,
    stock_capacity_tons DECIMAL(6,2),
    verified_status TINYINT(1) DEFAULT 0,
    open_time TIME,
    close_time TIME,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(150) UNIQUE
);

INSERT INTO vendors VALUES
('V_GHA_001','Ramesh Reddy','Farmer','Ghatkesar',4.2,85,5,1,'06:00:00','18:00:00','9848012345','ramesh.reddy@ruralmail.in'),
('V_GHA_002','Suresh Babu','Wholesaler','Ghatkesar',3.8,70,20,1,'08:00:00','20:00:00','9989054321','suresh.ghatkesar@vlink.com'),
('V_GHA_003','Anitha Rao','Retailer','Ghatkesar',4.5,92,2,1,'09:00:00','21:00:00','9123456780','anitha.stores@gmail.com'),
('V_GHA_004','Krishna Murthy','Farmer','Ghatkesar',3.1,45,4,0,'05:30:00','17:30:00','9440011223','murthy.k@yahoo.in'),
('V_GHA_005','Laxmi Devi','Farmer','Ghatkesar',4.8,95,6,1,'06:00:00','18:00:00','8886655443','laxmi.agri@vlink.com'),
('V_GHA_006','Venkat Raman','Wholesaler','Ghatkesar',3.5,62,18,0,'08:00:00','19:00:00','7702233445','raman.trading@outlook.com');

-- =========================
-- PRODUCTS TABLE
-- =========================
CREATE TABLE products (
    product_id VARCHAR(10) PRIMARY KEY,
    commodity_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    variety VARCHAR(100),
    grade VARCHAR(10),
    season_type VARCHAR(50),
    shelf_life_days INT
);

INSERT INTO products VALUES
('P001','Tomato','Vegetable','Desi','A','All',5),
('P002','Onion','Vegetable','Nasik Red','B','All',30),
('P003','Rice','Grain','Sona Masuri','A','Rabi',365),
('P004','Wheat','Grain','Lokwan','A','Rabi',365),
('P005','Mango','Fruit','Benishan','A','Summer',7),
('P006','Potato','Vegetable','Jyoti','B','All',45);

-- =========================
-- MARKET CONTEXT TABLE
-- =========================
CREATE TABLE market_context (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    village VARCHAR(100) NOT NULL,
    rainfall_mm DECIMAL(6,2),
    temperature_celsius DECIMAL(5,2),
    festival_flag TINYINT(1) DEFAULT 0,
    transport_cost_index DECIMAL(4,2),
    inflation_index DECIMAL(4,2)
);

INSERT INTO market_context
(date,village,rainfall_mm,temperature_celsius,festival_flag,transport_cost_index,inflation_index)
VALUES
('2026-01-01','Ghatkesar',0,22,1,1.10,1.02),
('2026-01-14','Bibinagar',0,24,1,1.20,1.05),
('2026-03-20','Shamshabad',5,38,0,1.05,1.12);

-- =========================
-- LISTINGS TABLE
-- =========================
CREATE TABLE listings (
    listing_id VARCHAR(20) PRIMARY KEY,
    date DATE NOT NULL,
    vendor_id VARCHAR(20),
    product_id VARCHAR(10),
    village VARCHAR(100),
    stock_available_tons DECIMAL(6,2),
    minimum_quantity DECIMAL(6,2),
    price_offered DECIMAL(12,2),
    previous_day_price DECIMAL(12,2),
    price_change DECIMAL(10,2),
    competitor_avg_price DECIMAL(12,2),
    demand_index DECIMAL(4,2),
    supply_index DECIMAL(4,2),
    seasonal_factor DECIMAL(4,2),
    recommended_price DECIMAL(12,2),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

INSERT INTO listings VALUES
('L_0001','2026-01-01','V_GHA_001','P001','Ghatkesar',1.2,0.05,25.5,24.0,1.5,26.0,0.85,0.6,0.5,25.8),
('L_0002','2026-01-01','V_GHA_002','P003','Ghatkesar',15.0,1.0,52000.0,52000.0,0.0,51500.0,0.4,0.9,0.8,51800.0),
('L_1500','2026-03-28','V_GHA_003','P002','Ghatkesar',3.0,0.1,30.0,28.0,2.0,31.0,0.75,0.65,0.7,29.5);