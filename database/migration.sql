#------------------------------------------------------------
# Database: MoonriseKingdom
#------------------------------------------------------------

DROP DATABASE IF EXISTS MoonriseKingdom;
CREATE DATABASE MoonriseKingdom;
USE MoonriseKingdom;

#------------------------------------------------------------
# Dropping existing tables
#------------------------------------------------------------

DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS Coordinates;
DROP TABLE IF EXISTS Miscellaneous;
DROP TABLE IF EXISTS ActionTypes;
DROP TABLE IF EXISTS Action;
DROP TABLE IF EXISTS Placement;
DROP TABLE IF EXISTS Armageddon;
DROP TABLE IF EXISTS Morpion;
DROP TABLE IF EXISTS Compositions;
DROP TABLE IF EXISTS Sample;
DROP TABLE IF EXISTS Belongs;


#------------------------------------------------------------
# Table: Game
#------------------------------------------------------------

CREATE TABLE Game(
        idG        int (11) Auto_increment  NOT NULL ,
        identifier Varchar (255) NOT NULL ,
        dimension  Int NOT NULL ,
        created_at Date NOT NULL ,
        PRIMARY KEY (idG )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Team
#------------------------------------------------------------

CREATE TABLE Team(
        idT   int (11) Auto_increment  NOT NULL ,
        name  Varchar (255) NOT NULL ,
        color Varchar (255) NOT NULL ,
        idG   Int NOT NULL ,
        PRIMARY KEY (idT )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Coordinates
#------------------------------------------------------------

CREATE TABLE Coordinates(
        idCo  int (11) Auto_increment  NOT NULL ,
        cordX Int NOT NULL ,
        cordY Int NOT NULL ,
        ruin  Bool NOT NULL ,
        idM   Int NULL ,
        idG   Int NOT NULL ,
        PRIMARY KEY (idCo )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Miscellaneous
#------------------------------------------------------------

CREATE TABLE Miscellaneous(
        idMi        int (11) Auto_increment  NOT NULL ,
        idA         Int NOT NULL ,
        type        Varchar (255) NOT NULL ,
        idM         Int NOT NULL ,
        idM_Morpion Int NOT NULL ,
        PRIMARY KEY (idMi )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: ActionTypes
#------------------------------------------------------------

CREATE TABLE ActionTypes(
        type Varchar (255) NOT NULL ,
        PRIMARY KEY (type )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Action
#------------------------------------------------------------

CREATE TABLE Action(
        idA int (11) Auto_increment  NOT NULL ,
        idG Int NOT NULL ,
        idT Int NOT NULL ,
        PRIMARY KEY (idA )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Placement
#------------------------------------------------------------

CREATE TABLE Placement(
        idPl int (11) Auto_increment  NOT NULL ,
        idA  Int NOT NULL ,
        idCo Int NOT NULL ,
        PRIMARY KEY (idPl )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Armageddon
#------------------------------------------------------------

CREATE TABLE Armageddon(
        idAm        int (11) Auto_increment  NOT NULL ,
        idA         Int NOT NULL ,
        idCo        Int NOT NULL ,
        idM         Int NOT NULL ,
        idM_Morpion Int NULL ,
        PRIMARY KEY (idAm )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Morpion
#------------------------------------------------------------

CREATE TABLE Morpion(
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
# Table: Attack
#------------------------------------------------------------

CREATE TABLE Attack(
        idAt        int (11) Auto_increment  NOT NULL ,
        bonus       Bool NOT NULL ,
        idA         Int NOT NULL ,
        idM         Int NOT NULL ,
        idM_Morpion Int NOT NULL ,
        PRIMARY KEY (idAt )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Compositions
#------------------------------------------------------------

CREATE TABLE Compositions(
        idT   int (11) Auto_increment  NOT NULL ,
        name  Varchar (255) NOT NULL ,
        color Varchar (255) NOT NULL ,
        PRIMARY KEY (idT )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Sample
#------------------------------------------------------------

CREATE TABLE Sample(
        idM    int (11) Auto_increment  NOT NULL ,
        health Int NOT NULL ,
        damage Int NOT NULL ,
        mana   Int NOT NULL ,
        bonus  Int ,
        class  Varchar (255) NOT NULL ,
        PRIMARY KEY (idM )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Belongs
#------------------------------------------------------------

CREATE TABLE Belongs(
        idB int (11) Auto_increment  NOT NULL ,
        idT Int NOT NULL ,
        idM Int NOT NULL ,
        PRIMARY KEY (idB )
)ENGINE=InnoDB;

ALTER TABLE Team ADD CONSTRAINT FK_Team_idG FOREIGN KEY (idG) REFERENCES Game(idG);
ALTER TABLE Coordinates ADD CONSTRAINT FK_Coordinates_idM FOREIGN KEY (idM) REFERENCES Morpion(idM);
ALTER TABLE Coordinates ADD CONSTRAINT FK_Coordinates_idG FOREIGN KEY (idG) REFERENCES Game(idG);
ALTER TABLE Miscellaneous ADD CONSTRAINT FK_Miscellaneous_idA FOREIGN KEY (idA) REFERENCES Action(idA);
ALTER TABLE Miscellaneous ADD CONSTRAINT FK_Miscellaneous_type FOREIGN KEY (type) REFERENCES ActionTypes(type);
ALTER TABLE Miscellaneous ADD CONSTRAINT FK_Miscellaneous_idM FOREIGN KEY (idM) REFERENCES Morpion(idM);
ALTER TABLE Miscellaneous ADD CONSTRAINT FK_Miscellaneous_idM_Morpion FOREIGN KEY (idM_Morpion) REFERENCES Morpion(idM);
ALTER TABLE Action ADD CONSTRAINT FK_Action_idG FOREIGN KEY (idG) REFERENCES Game(idG);
ALTER TABLE Action ADD CONSTRAINT FK_Action_idT FOREIGN KEY (idT) REFERENCES Team(idT);
ALTER TABLE Placement ADD CONSTRAINT FK_Placement_idA FOREIGN KEY (idA) REFERENCES Action(idA);
ALTER TABLE Placement ADD CONSTRAINT FK_Placement_idCo FOREIGN KEY (idCo) REFERENCES Coordinates(idCo);
ALTER TABLE Armageddon ADD CONSTRAINT FK_Armageddon_idA FOREIGN KEY (idA) REFERENCES Action(idA);
ALTER TABLE Armageddon ADD CONSTRAINT FK_Armageddon_idCo FOREIGN KEY (idCo) REFERENCES Coordinates(idCo);
ALTER TABLE Armageddon ADD CONSTRAINT FK_Armageddon_idM FOREIGN KEY (idM) REFERENCES Morpion(idM);
ALTER TABLE Armageddon ADD CONSTRAINT FK_Armageddon_idM_Morpion FOREIGN KEY (idM_Morpion) REFERENCES Morpion(idM);
ALTER TABLE Attack ADD CONSTRAINT FK_Attack_idA FOREIGN KEY (idA) REFERENCES Action(idA);
ALTER TABLE Attack ADD CONSTRAINT FK_Attack_idM FOREIGN KEY (idM) REFERENCES Morpion(idM);
ALTER TABLE Attack ADD CONSTRAINT FK_Attack_idM_Morpion FOREIGN KEY (idM_Morpion) REFERENCES Morpion(idM);
ALTER TABLE Morpion ADD CONSTRAINT FK_Morpion_idT FOREIGN KEY (idT) REFERENCES Team(idT);
ALTER TABLE Belongs ADD CONSTRAINT FK_Belongs_idT FOREIGN KEY (idT) REFERENCES Compositions(idT);
ALTER TABLE Belongs ADD CONSTRAINT FK_Belongs_idM FOREIGN KEY (idM) REFERENCES Sample(idM);

INSERT INTO ActionTypes VALUES("throw");
INSERT INTO ActionTypes VALUES("fireball");
INSERT INTO ActionTypes VALUES("heal");

INSERT INTO Compositions(name,color) VALUES('Team_1', '#ff0fff');
INSERT INTO Compositions(name,color) VALUES('Team_2', '#f00fff');

INSERT INTO Sample(health,damage,mana,bonus,class) VALUES(8,2,0,10,"warrior");
INSERT INTO Sample(health,damage,mana,bonus,class) VALUES(3,2,5,0,"mage");
INSERT INTO Sample(health,damage,mana,bonus,class) VALUES(8,2,0,0,"archer");

INSERT INTO Belongs(idT,idM) VALUES(1, 1);
INSERT INTO Belongs(idT,idM) VALUES(1, 1);
INSERT INTO Belongs(idT,idM) VALUES(1, 1);
INSERT INTO Belongs(idT,idM) VALUES(1, 2);
INSERT INTO Belongs(idT,idM) VALUES(1, 2);
INSERT INTO Belongs(idT,idM) VALUES(1, 3);
INSERT INTO Belongs(idT,idM) VALUES(1, 3);

INSERT INTO Belongs(idT,idM) VALUES(2, 1);
INSERT INTO Belongs(idT,idM) VALUES(2, 1);
INSERT INTO Belongs(idT,idM) VALUES(2, 2);
INSERT INTO Belongs(idT,idM) VALUES(2, 2);
INSERT INTO Belongs(idT,idM) VALUES(2, 3);
INSERT INTO Belongs(idT,idM) VALUES(2, 3);
INSERT INTO Belongs(idT,idM) VALUES(2, 3);