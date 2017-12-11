#------------------------------------------------------------
# Database: MoonriseKingdom | If you are on LocalHost
#------------------------------------------------------------

DROP DATABASE IF EXISTS MoonriseKingdom;
CREATE DATABASE MoonriseKingdom;
USE MoonriseKingdom;

#------------------------------------------------------------
# Dropping existing tables
#------------------------------------------------------------

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS coordinates;
DROP TABLE IF EXISTS miscellaneous;
DROP TABLE IF EXISTS actiontypes;
DROP TABLE IF EXISTS action;
DROP TABLE IF EXISTS attack;
DROP TABLE IF EXISTS placement;
DROP TABLE IF EXISTS armageddon;
DROP TABLE IF EXISTS morpion;
DROP TABLE IF EXISTS compositions;
DROP TABLE IF EXISTS sample;
DROP TABLE IF EXISTS belongs;


#------------------------------------------------------------
# Table: game
#------------------------------------------------------------

CREATE TABLE game(
        idG        Int (11) Auto_increment  NOT NULL ,
        identifier Varchar (255) NOT NULL ,
        dimension  Int NOT NULL ,
        created_at Date NOT NULL ,
        idT        Int NULL,
        PRIMARY KEY (idG )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: team
#------------------------------------------------------------

CREATE TABLE team(
        idT   int (11) Auto_increment  NOT NULL ,
        name  Varchar (255) NOT NULL ,
        color Varchar (255) NOT NULL ,
        idG   Int NOT NULL ,
        PRIMARY KEY (idT )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: coordinates
#------------------------------------------------------------

CREATE TABLE coordinates(
        idCo  int (11) Auto_increment  NOT NULL ,
        cordX Int NOT NULL ,
        cordY Int NOT NULL ,
        ruin  Bool NOT NULL ,
        idM   Int NULL ,
        idG   Int NOT NULL ,
        PRIMARY KEY (idCo )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: miscellaneous
#------------------------------------------------------------

CREATE TABLE miscellaneous(
        idMi        int (11) Auto_increment  NOT NULL ,
        idA         Int NOT NULL ,
        type        Varchar (255) NOT NULL ,
        idM         Int NOT NULL ,
        idM_morpion Int NOT NULL ,
        PRIMARY KEY (idMi ,idA )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: actiontypes
#------------------------------------------------------------

CREATE TABLE actiontypes(
        type Varchar (255) NOT NULL ,
        PRIMARY KEY (type )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: action
#------------------------------------------------------------

CREATE TABLE action(
        idA int (11) Auto_increment  NOT NULL ,
        idG Int NOT NULL ,
        idT Int NOT NULL ,
        PRIMARY KEY (idA )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: placement
#------------------------------------------------------------

CREATE TABLE placement(
        idPl int (11) Auto_increment  NOT NULL ,
        idA  Int NOT NULL ,
        idCo Int NOT NULL ,
        PRIMARY KEY (idPl ,idA )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: attack
#------------------------------------------------------------

CREATE TABLE attack(
        idAt        int (11) Auto_increment  NOT NULL ,
        bonus       Bool NOT NULL ,
        idA         Int NOT NULL ,
        idM         Int NOT NULL ,
        idM_morpion Int NOT NULL ,
        PRIMARY KEY (idAt ,idA )
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: armageddon
#------------------------------------------------------------

CREATE TABLE armageddon(
        idAm        int (11) Auto_increment  NOT NULL ,
        idA         Int NOT NULL ,
        idCo        Int NOT NULL ,
        idM         Int NOT NULL ,
        idM_morpion Int NULL ,
        PRIMARY KEY (idAm ,idA )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: morpion
#------------------------------------------------------------

CREATE TABLE morpion(
        idM    int (11) Auto_increment  NOT NULL ,
        health Int NOT NULL ,
        damage Int NOT NULL ,
        mana   Int NOT NULL ,
        bonus  Int NULL,
        class  Varchar (255) NOT NULL ,
        idT    Int NOT NULL ,
        PRIMARY KEY (idM )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: compositions
#------------------------------------------------------------

CREATE TABLE compositions(
        idT   int (11) Auto_increment  NOT NULL ,
        name  Varchar (255) NOT NULL ,
        color Varchar (255) NOT NULL ,
        PRIMARY KEY (idT )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: sample
#------------------------------------------------------------

CREATE TABLE sample(
        idM    int (11) Auto_increment  NOT NULL ,
        health Int NOT NULL ,
        damage Int NOT NULL ,
        mana   Int NOT NULL ,
        bonus  Int ,
        class  Varchar (255) NOT NULL ,
        PRIMARY KEY (idM )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: belongs
#------------------------------------------------------------

CREATE TABLE belongs(
        idB int (11) Auto_increment  NOT NULL ,
        idT Int NOT NULL ,
        idM Int NOT NULL ,
        PRIMARY KEY (idB )
)ENGINE=InnoDB;

ALTER TABLE game ADD CONSTRAINT FK_game_idT FOREIGN KEY (idT) REFERENCES team(idT);
ALTER TABLE team ADD CONSTRAINT FK_team_idG FOREIGN KEY (idG) REFERENCES game(idG);
ALTER TABLE coordinates ADD CONSTRAINT FK_coordinates_idM FOREIGN KEY (idM) REFERENCES morpion(idM);
ALTER TABLE coordinates ADD CONSTRAINT FK_coordinates_idG FOREIGN KEY (idG) REFERENCES game(idG);
ALTER TABLE miscellaneous ADD CONSTRAINT FK_miscellaneous_idA FOREIGN KEY (idA) REFERENCES action(idA);
ALTER TABLE miscellaneous ADD CONSTRAINT FK_miscellaneous_type FOREIGN KEY (type) REFERENCES actiontypes(type);
ALTER TABLE miscellaneous ADD CONSTRAINT FK_miscellaneous_idM FOREIGN KEY (idM) REFERENCES morpion(idM);
ALTER TABLE miscellaneous ADD CONSTRAINT FK_miscellaneous_idM_morpion FOREIGN KEY (idM_morpion) REFERENCES morpion(idM);
ALTER TABLE action ADD CONSTRAINT FK_action_idG FOREIGN KEY (idG) REFERENCES game(idG);
ALTER TABLE action ADD CONSTRAINT FK_action_idT FOREIGN KEY (idT) REFERENCES team(idT);
ALTER TABLE placement ADD CONSTRAINT FK_placement_idA FOREIGN KEY (idA) REFERENCES action(idA);
ALTER TABLE placement ADD CONSTRAINT FK_placement_idCo FOREIGN KEY (idCo) REFERENCES coordinates(idCo);
ALTER TABLE attack ADD CONSTRAINT FK_attack_idA FOREIGN KEY (idA) REFERENCES action(idA);
ALTER TABLE attack ADD CONSTRAINT FK_attack_idM FOREIGN KEY (idM) REFERENCES morpion(idM);
ALTER TABLE attack ADD CONSTRAINT FK_attack_idM_morpion FOREIGN KEY (idM_morpion) REFERENCES morpion(idM);
ALTER TABLE armageddon ADD CONSTRAINT FK_armageddon_idA FOREIGN KEY (idA) REFERENCES action(idA);
ALTER TABLE armageddon ADD CONSTRAINT FK_armageddon_idCo FOREIGN KEY (idCo) REFERENCES coordinates(idCo);
ALTER TABLE armageddon ADD CONSTRAINT FK_armageddon_idM FOREIGN KEY (idM) REFERENCES morpion(idM);
ALTER TABLE armageddon ADD CONSTRAINT FK_armageddon_idM_morpion FOREIGN KEY (idM_morpion) REFERENCES morpion(idM);
ALTER TABLE morpion ADD CONSTRAINT FK_morpion_idT FOREIGN KEY (idT) REFERENCES team(idT);
ALTER TABLE belongs ADD CONSTRAINT FK_belongs_idT FOREIGN KEY (idT) REFERENCES compositions(idT);
ALTER TABLE belongs ADD CONSTRAINT FK_belongs_idM FOREIGN KEY (idM) REFERENCES sample(idM);

INSERT INTO actiontypes VALUES("throw");
INSERT INTO actiontypes VALUES("fireball");
INSERT INTO actiontypes VALUES("heal");

INSERT INTO compositions(name,color) VALUES('team_1', '#ff0fff');
INSERT INTO compositions(name,color) VALUES('team_2', '#f00fff');
INSERT INTO compositions(name,color) VALUES('team_3', '#ff0fff');
INSERT INTO compositions(name,color) VALUES('team_4', '#f00fff');
INSERT INTO compositions(name,color) VALUES('team_5', '#ff0fff');
INSERT INTO compositions(name,color) VALUES('team_6', '#f00fff');

INSERT INTO sample(health,damage,mana,bonus,class) VALUES(8,2,0,10,"warrior");
INSERT INTO sample(health,damage,mana,bonus,class) VALUES(3,2,5,0,"mage");
INSERT INTO sample(health,damage,mana,bonus,class) VALUES(8,2,0,0,"archer");

INSERT INTO belongs(idT,idM) VALUES(1, 1);
INSERT INTO belongs(idT,idM) VALUES(1, 1);
INSERT INTO belongs(idT,idM) VALUES(1, 1);
INSERT INTO belongs(idT,idM) VALUES(1, 2);
INSERT INTO belongs(idT,idM) VALUES(1, 2);
INSERT INTO belongs(idT,idM) VALUES(1, 3);
INSERT INTO belongs(idT,idM) VALUES(1, 3);

INSERT INTO belongs(idT,idM) VALUES(2, 1);
INSERT INTO belongs(idT,idM) VALUES(2, 1);
INSERT INTO belongs(idT,idM) VALUES(2, 2);
INSERT INTO belongs(idT,idM) VALUES(2, 2);
INSERT INTO belongs(idT,idM) VALUES(2, 3);
INSERT INTO belongs(idT,idM) VALUES(2, 3);
INSERT INTO belongs(idT,idM) VALUES(2, 3);

INSERT INTO belongs(idT,idM) VALUES(3, 1);
INSERT INTO belongs(idT,idM) VALUES(3, 1);
INSERT INTO belongs(idT,idM) VALUES(3, 1);
INSERT INTO belongs(idT,idM) VALUES(3, 1);
INSERT INTO belongs(idT,idM) VALUES(3, 2);
INSERT INTO belongs(idT,idM) VALUES(3, 3);
INSERT INTO belongs(idT,idM) VALUES(3, 3);

INSERT INTO belongs(idT,idM) VALUES(4, 1);
INSERT INTO belongs(idT,idM) VALUES(4, 2);
INSERT INTO belongs(idT,idM) VALUES(4, 2);
INSERT INTO belongs(idT,idM) VALUES(4, 2);
INSERT INTO belongs(idT,idM) VALUES(4, 3);
INSERT INTO belongs(idT,idM) VALUES(4, 3);
INSERT INTO belongs(idT,idM) VALUES(4, 3);

INSERT INTO belongs(idT,idM) VALUES(5, 1);
INSERT INTO belongs(idT,idM) VALUES(5, 2);
INSERT INTO belongs(idT,idM) VALUES(5, 2);
INSERT INTO belongs(idT,idM) VALUES(5, 2);
INSERT INTO belongs(idT,idM) VALUES(5, 2);
INSERT INTO belongs(idT,idM) VALUES(5, 2);
INSERT INTO belongs(idT,idM) VALUES(5, 3);

INSERT INTO belongs(idT,idM) VALUES(6, 1);
INSERT INTO belongs(idT,idM) VALUES(6, 2);
INSERT INTO belongs(idT,idM) VALUES(6, 3);
INSERT INTO belongs(idT,idM) VALUES(6, 3);
INSERT INTO belongs(idT,idM) VALUES(6, 3);
INSERT INTO belongs(idT,idM) VALUES(6, 3);
INSERT INTO belongs(idT,idM) VALUES(6, 3);