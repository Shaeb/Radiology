
-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Questions'
-- 
-- ---

DROP TABLE IF EXISTS `Questions`;
		
CREATE TABLE `Questions` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Answers'
-- 
-- ---

DROP TABLE IF EXISTS `Answers`;
		
CREATE TABLE `Answers` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'FormQuestions'
-- 
-- ---

DROP TABLE IF EXISTS `FormQuestions`;
		
CREATE TABLE `FormQuestions` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `form_id` INTEGER DEFAULT NULL,
  `question_id` INTEGER DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Forms'
-- 
-- ---

DROP TABLE IF EXISTS `Forms`;
		
CREATE TABLE `Forms` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `description` VARCHAR(150) DEFAULT NULL,
  `new field` INTEGER DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'FormAnswers'
-- 
-- ---

DROP TABLE IF EXISTS `FormAnswers`;
		
CREATE TABLE `FormAnswers` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `patient_id` INTEGER DEFAULT NULL,
  `form_id` INTEGER DEFAULT NULL,
  `answer_id` INTEGER DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `FormQuestions` ADD FOREIGN KEY (form_id) REFERENCES `Forms` (`id`);
ALTER TABLE `FormQuestions` ADD FOREIGN KEY (question_id) REFERENCES `Questions` (`id`);
ALTER TABLE `FormAnswers` ADD FOREIGN KEY (form_id) REFERENCES `Forms` (`id`);
ALTER TABLE `FormAnswers` ADD FOREIGN KEY (answer_id) REFERENCES `Answers` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Questions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Answers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `FormQuestions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Forms` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `FormAnswers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Questions` (`id`,`description`) VALUES
-- ('','');
-- INSERT INTO `Answers` (`id`,`description`) VALUES
-- ('','');
-- INSERT INTO `FormQuestions` (`id`,`form_id`,`question_id`) VALUES
-- ('','','');
-- INSERT INTO `Forms` (`id`,`description`,`new field`) VALUES
-- ('','','');
-- INSERT INTO `FormAnswers` (`id`,`patient_id`,`form_id`,`answer_id`) VALUES
-- ('','','','');
