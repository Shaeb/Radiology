
-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Forms'
-- 
-- ---

DROP TABLE IF EXISTS Forms;
		
CREATE TABLE Forms (
  id INTEGER AUTO_INCREMENT primary key,
  description varchar(50),
  published INTEGER,
  area_id INTEGER,
  access_level INTEGER,
  foreign key(area_id) references Areas(id) on update cascade on delete cascade,
  foreign key(access_level) references AccessLevels(id) on update cascade on delete cascade
) engine = InnoDB;

insert into Forms(published, description, area_id, access_level) values(1, 'CT Nursing Contrast Sheet', 1,2);

-- ---
-- Table 'AnswerTypes'
-- 
-- ---

DROP TABLE IF EXISTS AnswerTypes;
		
CREATE TABLE AnswerTypes (
  id INTEGER AUTO_INCREMENT primary key,
  description varchar(50)
) engine = InnoDB;

insert into answertypes(description) values('unique');
insert into answertypes(description) values('multiple');
insert into answertypes(description) values('list');
insert into answertypes(description) values('text');
insert into answertypes(description) values('boolean');
insert into answertypes(description) values('date');

-- ---
-- Table 'AnswerValues'
-- 
-- ---

DROP TABLE IF EXISTS AnswerValues;
		
CREATE TABLE AnswerValues (
  id INTEGER AUTO_INCREMENT primary key,
  description varchar(50),
  default_value varchar(50),
  answer_type INTEGER,
  foreign key(answer_type) references AnswerTypes(id)
) engine = InnoDB;

insert into AnswerValues(description, default_value, answer_type) values('yes','yes',1);
insert into AnswerValues(description, default_value, answer_type) values('no','no',1);
insert into AnswerValues(description, default_value, answer_type) values('asthma','mild',1);
insert into AnswerValues(description, default_value, answer_type) values('asthma','moderate',1);
insert into AnswerValues(description, default_value, answer_type) values('asthma','severe',1);
insert into AnswerValues(description, default_value, answer_type) values('kidneys','transplant',1);
insert into AnswerValues(description, default_value, answer_type) values('kidneys','nephrectomy',1);
insert into AnswerValues(description, default_value, answer_type) values('kidneys','dialysis',1);
insert into AnswerValues(description, default_value, answer_type) values('diabetes','insulin',2);
insert into AnswerValues(description, default_value, answer_type) values('diabetes','metformin',2);
insert into AnswerValues(description, default_value, answer_type) values('diabetes','other',2);
insert into AnswerValues(description, default_value, answer_type) values('metformin','instuctions given',2);
insert into AnswerValues(description, default_value, answer_type) values('metformin','verbalizes understanding',2);
insert into AnswerValues(description, default_value, answer_type) values('ssd_crisis','yes',1);
insert into AnswerValues(description, default_value, answer_type) values('ssd_crisis','no',1);
insert into AnswerValues(description, default_value, answer_type) values('','',4);
insert into AnswerValues(description, default_value, answer_type) values('true','1',5);
insert into AnswerValues(description, default_value, answer_type) values('false','0',5);
insert into AnswerValues(description, default_value, answer_type) values('lmp','now()',6);

-- ---
-- Table 'Questions'
-- 
-- ---

DROP TABLE IF EXISTS Questions;
		
CREATE TABLE Questions (
  id INTEGER AUTO_INCREMENT primary key,
  description varchar(255),
  answer_type INTEGER,
  default_answer INTEGER,
  published INTEGER,
  area_id INTEGER,
  access_level INTEGER,
  foreign key(answer_type) references AnswerTypes(id) on update cascade on delete cascade,
  foreign key(default_answer) references AnswerValues(id) on update cascade on delete cascade,
  foreign key(area_id) references Areas(id) on update cascade on delete cascade,
  foreign key(access_level) references AccessLevels(id) on update cascade on delete cascade
) engine = InnoDB;

insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Prior iodinated contrast media?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Reaction?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Steroid prep?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Asthma?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Renal Disease?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Diabetes? ',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Glucophage/Metformin?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Recent Chemotherapy?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Myasthenia Gravis, Multiple Myeloma, Hyperthyroidism',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Sickle Cell Disease?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Pregnant or possibility of pregnancy?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Emergent study in whom communication cannot be established?',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('Patient instructed to increase fluid x48 hours.',1,2,1,1,2);
insert into Questions(description, answer_type, default_answer, published, area_id, access_level) value('The patient was educated about contrast media.',1,2,1,1,2);

-- ---
-- Table 'FormQuestions'
-- 
-- ---

DROP TABLE IF EXISTS FormQuestions;
		
CREATE TABLE FormQuestions (
  id INTEGER AUTO_INCREMENT primary key,
  form_id INTEGER,
  question_id INTEGER,
  foreign key (form_id) references Forms(id) on update cascade on delete cascade,
  foreign key (question_id) references Questions(id) on update cascade on delete cascade
) engine = InnoDB;

insert into FormQuestions(form_id, question_id) values(1,1);
insert into FormQuestions(form_id, question_id) values(1,2);
insert into FormQuestions(form_id, question_id) values(1,3);
insert into FormQuestions(form_id, question_id) values(1,4);
insert into FormQuestions(form_id, question_id) values(1,5);
insert into FormQuestions(form_id, question_id) values(1,6);
insert into FormQuestions(form_id, question_id) values(1,7);
insert into FormQuestions(form_id, question_id) values(1,8);
insert into FormQuestions(form_id, question_id) values(1,9);
insert into FormQuestions(form_id, question_id) values(1,10);
insert into FormQuestions(form_id, question_id) values(1,11);
insert into FormQuestions(form_id, question_id) values(1,12);
insert into FormQuestions(form_id, question_id) values(1,13);
insert into FormQuestions(form_id, question_id) values(1,14);

-- ct form view
create view ct_form as
select q.description, at.description as 'answer_type', av.description as 'answer_description', av.default_value as 'default_value'
from Questions q, FormQuestions f, AnswerTypes at, AnswerValues av
 where q.id = f.question_id and f.form_id = 1 and q.answer_type = at.id and q.default_answer = av.id;

-- ---
-- Foreign Keys 
-- ---

-- ---
-- Table Properties
-- ---

-- ALTER TABLE Forms ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Questions ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Areas ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE AccessLevels ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE AnswerTypes ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE AnswerValues ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE FormQuestions ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO Forms (id,published,area_id,access_level) VALUES
-- ('','','','');
-- INSERT INTO Questions (id,description,answer_type,default_answer,published,area_id,access_level) VALUES
-- ('','','','','','','');
-- INSERT INTO Areas (id,description) VALUES
-- ('','');
-- INSERT INTO AccessLevels (id,description) VALUES
-- ('','');
-- INSERT INTO AnswerTypes (id,description) VALUES
-- ('','');
-- INSERT INTO AnswerValues (id,description,default_value,answer_type) VALUES
-- ('','','','');
-- INSERT INTO FormQuestions (id,form_id,question_id) VALUES
-- ('','','');
