#------------------------------------------------------------
# Dropping existing tables
#------------------------------------------------------------

DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS Action;
DROP TABLE IF EXISTS Morpion;
DROP TABLE IF EXISTS Placement;
DROP TABLE IF EXISTS Miscellaneous;
DROP TABLE IF EXISTS Armageddon;
DROP TABLE IF EXISTS BonusAttack;
DROP TABLE IF EXISTS ActionTypes;
DROP TABLE IF EXISTS Coordinates;
DROP TABLE IF EXISTS AllTeams;
DROP TABLE IF EXISTS AllMorpis;
DROP TABLE IF EXISTS Appartient;


#------------------------------------------------------------
# Table: Game
#------------------------------------------------------------

CREATE TABLE Game(
        idG        int (11) Auto_increment  NOT NULL ,
        identifier Varchar (25) NOT NULL UNIQUE,
        dimension  Int NOT NULL ,
        created_at Date NOT NULL ,
        PRIMARY KEY (idG )
);


#------------------------------------------------------------
# Table: Team
#------------------------------------------------------------

CREATE TABLE Team(
        idT   int (11) Auto_increment  NOT NULL ,
        name  Varchar (25) NOT NULL ,
        color Varchar (25) NOT NULL ,
        idG   Int NOT NULL REFERENCES Game(idG),
        PRIMARY KEY (idT )
);

#------------------------------------------------------------
# Table: Coordinates
#------------------------------------------------------------

CREATE TABLE Coordinates(
        idCo  int (11) Auto_increment  NOT NULL ,
        cordX Int NOT NULL ,
        cordY Int NOT NULL ,
        ruin  Bool DEFAULT false ,
        PRIMARY KEY (idCo )
);


#------------------------------------------------------------
# Table: Miscellaneous
#------------------------------------------------------------

CREATE TABLE Miscellaneous(
        idMi        int (11) Auto_increment  NOT NULL ,
        idA         Int NOT NULL REFERENCES Action(idA) ,
        type        Varchar (25) NOT NULL REFERENCES ActionTypes(type) ,
        idM         Int NOT NULL REFERENCES Morpion(idM) ,
        idM_Morpion Int NOT NULL REFERENCES Morpion(idM) ,
        PRIMARY KEY (idMi )
);


#------------------------------------------------------------
# Table: ActionTypes
#------------------------------------------------------------

CREATE TABLE ActionTypes(
        type Varchar (25) NOT NULL ,
        PRIMARY KEY (type )
);


#------------------------------------------------------------
# Table: Action
#------------------------------------------------------------

CREATE TABLE Action(
        idA int (11) Auto_increment  NOT NULL ,
        idG Int NOT NULL REFERENCES Game(idG) ,
        idT Int NOT NULL REFERENCES Team(idT) ,
        PRIMARY KEY (idA )
);


#------------------------------------------------------------
# Table: Placement
#------------------------------------------------------------

CREATE TABLE Placement(
        idPl int (11) Auto_increment  NOT NULL ,
        idA  Int NOT NULL REFERENCES Action(idA) ,
        idCo Int NOT NULL REFERENCES Coordinates(idCo) ,
        PRIMARY KEY (idPl )
);

#------------------------------------------------------------
# Table: Armageddon
#------------------------------------------------------------

CREATE TABLE Armageddon(
        idAm        int (11) Auto_increment  NOT NULL ,
        idA         Int NOT NULL REFERENCES Action(idA) ,
        idCo        Int NOT NULL REFERENCES Coordinates(idCo) ,
        idM         Int NOT NULL REFERENCES Morpion(idM) ,
        idM_Morpion Int NULL REFERENCES Morpion(idM) ,
        PRIMARY KEY (idAm )
);


#------------------------------------------------------------
# Table: Morpion
#------------------------------------------------------------

CREATE TABLE Morpion(
        idM    int (11) Auto_increment  NOT NULL ,
        health Int NOT NULL ,
        damage Int NOT NULL ,
        mana   Int NULL ,
        BonusAttack Int NULL,
        class  Varchar (25) NOT NULL ,
        idT    Int NOT NULL REFERENCES Team(idT) ,
        idCo   Int NOT NULL REFERENCES Coordinates(idCo) ,
        PRIMARY KEY (idM )
);

#------------------------------------------------------------
# Table: Composition
#------------------------------------------------------------

CREATE TABLE Composition(
        idC   int (11) Auto_increment  NOT NULL ,
        name  Varchar (25) NOT NULL,
        color Varchar (25) NOT NULL DEFAULT '#000000',
        PRIMARY KEY (idT )
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Piece
#------------------------------------------------------------

CREATE TABLE Piece(
        idP    int (11) Auto_increment  NOT NULL ,
        health Int NOT NULL ,
        damage Int NOT NULL ,
        mana   Int NOT NULL ,
        bonus  Int NULL,
        class  Varchar (25) NOT NULL ,
        PRIMARY KEY (idM )
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Appartient
#------------------------------------------------------------

CREATE TABLE Belongs(
        idC Int NOT NULL REFERENCES Composition(idC),
        idP Int NOT NULL REFERENCES Piece(idP),
        PRIMARY KEY (idC, idP )
)ENGINE=InnoDB;


INSERT INTO ActionTypes VALUES("attack");
INSERT INTO ActionTypes VALUES("throw");
INSERT INTO ActionTypes VALUES("fireball");
INSERT INTO ActionTypes VALUES("heal");

INSERT INTO AllTeams(name,color) VALUES('CovrigaTeam','#ff0fff');
INSERT INTO AllTeams(name,color) VALUES('MariaTeam','#f00fff');

INSERT INTO Appartient(idT,idM) VALUES(1, 1);
INSERT INTO Appartient(idT,idM) VALUES(1, 2);
INSERT INTO Appartient(idT,idM) VALUES(1, 5);
INSERT INTO Appartient(idT,idM) VALUES(1, 6);
INSERT INTO Appartient(idT,idM) VALUES(1, 7);
INSERT INTO Appartient(idT,idM) VALUES(1, 10);
INSERT INTO Appartient(idT,idM) VALUES(1, 11);

INSERT INTO Appartient(idT,idM) VALUES(2, 3);
INSERT INTO Appartient(idT,idM) VALUES(2, 4);
INSERT INTO Appartient(idT,idM) VALUES(2, 8);
INSERT INTO Appartient(idT,idM) VALUES(2, 9);
INSERT INTO Appartient(idT,idM) VALUES(2, 12);
INSERT INTO Appartient(idT,idM) VALUES(2, 13);
INSERT INTO Appartient(idT,idM) VALUES(2, 14);

INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(7,2,0,10,"warrior");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(6,4,0,10,"warrior");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(5,5,0,10,"warrior");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(3,7,0,10,"warrior");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(4,3,3,0,"mage");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(4,2,4,0,"mage");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(5,3,2,0,"mage");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(2,3,5,0,"mage");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(5,1,4,0,"mage");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(5,5,0,0,"archer");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(6,4,0,0,"archer");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(7,3,0,0,"archer");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(4,6,0,0,"archer");
INSERT INTO AllMorpis(health,damage,mana,bonus,class) VALUES(3,7,0,0,"archer");