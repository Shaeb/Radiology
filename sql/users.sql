
-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Areas'
-- 
-- ---

DROP TABLE IF EXISTS Areas;
		
CREATE TABLE Areas (
  id INTEGER AUTO_INCREMENT primary key,
  description varchar(50),
  icon varchar(150)
) engine = InnoDB;

insert into Areas(description) values('CT DN');
insert into Areas(description) values('CT South');
insert into Areas(description) values('MRI DN');
insert into Areas(description) values('MRI Mobile');
insert into Areas(description) values('Peds Sedation');
insert into Areas(description) values('JHall');
insert into Areas(description) values('D1');

-- ---
-- Table 'AccessLevels'
-- 
-- ---

DROP TABLE IF EXISTS AccessLevels;
		
CREATE TABLE AccessLevels (
  id INTEGER AUTO_INCREMENT primary key,
  description varchar(50)
) engine = InnoDB;

insert into AccessLevels(description) values('technician');
insert into AccessLevels(description) values('nurse');
insert into AccessLevels(description) values('doctor');
insert into AccessLevels(description) values('manager');
insert into AccessLevels(description) values('administrator');

DROP TABLE IF EXISTS Groups;
		
CREATE TABLE Groups (
  id INTEGER AUTO_INCREMENT not null primary key,
  description VARCHAR(50),
  access_level INTEGER,
	foreign key(access_level) references AccessLevels(id) on update cascade on delete cascade
) engine=InnoDB;

insert into Groups(description, access_level) values('Technicians', 1);
insert into Groups(description, access_level) values('Nurses', 2);
insert into Groups(description, access_level) values('Doctors', 3);
insert into Groups(description, access_level) values('Managers', 4);
insert into Groups(description, access_level) values('Administrators', 5);

-- ---
-- Table 'Users'
-- 
-- ---

DROP TABLE IF EXISTS Users;
		
CREATE TABLE Users (
  id INTEGER AUTO_INCREMENT primary key,
  username VARCHAR(50),
  password VARCHAR(50),
  group_id INTEGER,
  date_added TIMESTAMP,
  session_id VARCHAR(100),
  last_login DATETIME,
  current_ip CHAR(15),
	foreign key(group_id) references Groups(id) on delete cascade on update cascade
) engine=InnoDB;

insert into Users(username, password, group_id) values('soulblast@gmail.com', 'felix', 5);
	
drop table if exists Patients;

create table Patients(
	id integer auto_increment primary key,
	first_name varchar(50),
	middle_name varchar(50),
	last_name varchar(50),
	mrn char(10) not null,
	date_of_birth date,
	constraint unique_mrn unique(mrn)
) engine = InnoDB;

insert into Patients(first_name, middle_name, last_name, mrn, date_of_birth) values('Nathan', 'Scott', 'Bardgett', 'NB0529', '1981-05-29 00:00:00');
insert into Patients(first_name, middle_name, last_name, mrn, date_of_birth) values('MiMi', 'Chan', 'Bardgett', 'MB1066', '1966-10-19 00:00:00');
insert into Patients(first_name, middle_name, last_name, mrn, date_of_birth) values('Erimi', 'Merigrace', 'Kendrick', 'EMK0711', '2002-07-11 00:00:00');
insert into Patients(first_name, middle_name, last_name, mrn, date_of_birth) values('Georgie', 'Merigrace', 'Bardgett', 'GP9710', '2004-10-19 00:00:00');
	
drop table if exists LabValues;

create table LabValues(
	id integer not null auto_increment primary key,
	patient_id integer not null,
	creatinine decimal(2,2) not null,
	gfr integer,
	date_of_result date,
	foreign key(patient_id) references Patients(id) on update cascade on delete cascade
) engine = InnoDB;

drop table if exists Allergies;

create table Allergies(
	id integer not null auto_increment primary key,
	patient_id integer not null,
	allergen varchar(50) not null,
	reaction varchar(50) default 'undefined',
	foreign key(patient_id) references Patients(id) on update cascade on delete cascade
) engine = InnoDB;

drop table if exists ProcedureStatus;

create table ProcedureStatus(
	id integer not null auto_increment primary key,
	description varchar(100)
) engine = InnoDB; 

insert into ProcedureStatus(description) values('Front Desk');
insert into ProcedureStatus(description) values('Changing');
insert into ProcedureStatus(description) values('Triage');
insert into ProcedureStatus(description) values('C1/C3 Triage');
insert into ProcedureStatus(description) values('GI Triage');
insert into ProcedureStatus(description) values('On Bed');
insert into ProcedureStatus(description) values('Scanning');
insert into ProcedureStatus(description) values('Scan Complete');
insert into ProcedureStatus(description) values('Discharged');

drop table if exists Schedules;

create table Schedules (
	id integer not null auto_increment primary key,
	patient_id int not null,
	area integer not null,
	description varchar(255),
	diagnosis varchar(255),
	protocol varchar(255),
	scheduled_time datetime,
	status integer not null,
	foreign key(patient_id) references Patients(id) on update cascade on delete cascade,
	foreign key(area) references Areas(id) on update cascade on delete cascade,
	foreign key(status) references ProcedureStatus(id) on update cascade on delete cascade
) engine = InnoDB;

insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(1, 1, 'Abdominal Pain', 'CAPc', '2011-04-01 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(2, 1, 'Abdominal Pain', 'CAPc', '2011-04-01 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(3, 1, 'Abdominal Pain', 'CAPc', '2011-04-01 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(4, 1, 'Abdominal Pain', 'CAPc', '2011-04-01 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(4, 1, 'Abdominal Pain', 'CAPc', '2011-04-15 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(3, 1, 'Abdominal Pain', 'CAPc', '2011-04-13 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(1, 1, 'Abdominal Pain', 'CAPc', '2011-04-04 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(2, 1, 'Abdominal Pain', 'CAPc', '2011-04-21 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(3, 1, 'Abdominal Pain', 'CAPc', '2011-04-26 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(3, 1, 'Abdominal Pain', 'CAPc', '2011-05-01 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(3, 1, 'Abdominal Pain', 'CAPc', '2011-04-16 08:00:00', 1);
insert into Schedules(patient_id, area, diagnosis, protocol, scheduled_time, status) values(4, 1, 'Abdominal Pain', 'CAPc', '2011-04-10 08:00:00', 1);

create view ct_schedule as 	
select p.id, p.first_name, p.last_name, p.middle_name, p.mrn, p.date_of_birth, a.description as 'area', a.icon, ps.id as 'status_id', ps.description as 'status', s.scheduled_time
from Schedules s, Patients p, Areas a, ProcedureStatus ps
where s.patient_id = p.id and s.area = a.id and s.status = ps.id;

grant select, insert, update, delete on radiology.* to nodeapp@localhost identified by 'n0d34pp';
-- ---
-- Table 'Groups'
-- 
-- ---

-- ---
-- Foreign Keys 
-- ---

-- ---
-- Table Properties
-- ---

-- ALTER TABLE Users ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Groups ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO Users (id,username,password,group,date_added,session_id,last_login,current_ip) VALUES
-- ('','','','','','','','');
-- INSERT INTO Groups (id,description,access_level) VALUES
-- ('','','');
