CREATE TABLE `survey`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email_id` VARCHAR(256) NOT NULL,
  `user_type` TINYINT NOT NULL,
  `age` INT NULL,
  `gender` CHAR(2) NULL,
  `created_at` TIMESTAMP NULL DEFAULT 'NOW()',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `email_id_UNIQUE` (`email_id` ASC));


CREATE TABLE `survey`.`roles` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(45) NOT NULL,
  `role_description` VARCHAR(256) NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE INDEX `role_name_UNIQUE` (`role_name` ASC));

ALTER TABLE `survey`.`users` 
ADD INDEX `fk_users_1_idx` (`user_type` ASC);
ALTER TABLE `survey`.`users` 
ADD CONSTRAINT `fk_users_1`
  FOREIGN KEY (`user_type`)
  REFERENCES `survey`.`roles` (`role_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `survey`.`passwords` (
  `idpassword` INT NOT NULL AUTO_INCREMENT,
  `email_id` VARCHAR(256) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`idpassword`),
  UNIQUE INDEX `passwordcol_UNIQUE` (`email_id` ASC),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  CONSTRAINT `fk_password_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `survey`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

INSERT INTO roles(role_name,role_description)
values ("survey_coordinators","Define and conduct surveys i.e an Admin role"),
	   ("survey_respondents","Complete surveys.They have no administrative privileges
within the app")

CREATE TABLE `survey`.`createdsurveys` (
  `survey_id` INT NOT NULL AUTO_INCREMENT,
  `created_by` INT(11) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  `description` VARCHAR(256) NULL,
  `survey_json` JSON NOT NULL,
  PRIMARY KEY (`survey_id`),
  INDEX `fk_createdsurveys_1_idx` (`created_by` ASC),
  UNIQUE INDEX `title_UNIQUE` (`title` ASC),
  CONSTRAINT `fk_createdsurveys_1`
    FOREIGN KEY (`created_by`)
    REFERENCES `survey`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `survey`.`survey_user_map` (
  `map_id` INT NOT NULL AUTO_INCREMENT,
  `survey_id` INT NOT NULL,
  `responded` TINYINT NOT NULL,
  `user_id` INT NOT NULL,
  `response_json` JSON NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`map_id`),
  UNIQUE INDEX `idsurvey_user_map_UNIQUE` (`map_id` ASC),
  INDEX `fk_survey_user_map_1_idx` (`user_id` ASC),
  CONSTRAINT `fk_survey_user_map_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `survey`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_survey_user_map_2`
    FOREIGN KEY (`survey_id`)
    REFERENCES `survey`.`createdsurveys` (`survey_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);