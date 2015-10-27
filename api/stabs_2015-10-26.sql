# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.5.33)
# Database: andresru_stabs
# Generation Time: 2015-10-26 21:25:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table answers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `answers`;

CREATE TABLE `answers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `questionID` int(11) DEFAULT NULL,
  `locationID` int(11) DEFAULT NULL,
  `answer` varchar(500) DEFAULT NULL,
  `answerKey` varchar(500) DEFAULT NULL,
  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;

INSERT INTO `category` (`id`, `name`)
VALUES
	(1,'General'),
	(2,'Servicio al cliente'),
	(3,'cate'),
	(8,'sdasdasd');

/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table customer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `customer`;

CREATE TABLE `customer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;

INSERT INTO `customer` (`id`, `name`, `Date`)
VALUES
	(1,'RadioShack','0000-00-00 00:00:00'),
	(2,'Lazaro','0000-00-00 00:00:00'),
	(22,'Laurens','0000-00-00 00:00:00'),
	(23,'otro','2015-10-26 01:47:19'),
	(24,'uno mas','2015-10-26 01:47:51');

/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table location
# ------------------------------------------------------------

DROP TABLE IF EXISTS `location`;

CREATE TABLE `location` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `idCustomer` int(11) DEFAULT NULL,
  `store` varchar(500) CHARACTER SET latin1 DEFAULT NULL,
  `area` varchar(500) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer` (`idCustomer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;

INSERT INTO `location` (`id`, `idCustomer`, `store`, `area`)
VALUES
	(1,1,'Multiplaza','Cajas'),
	(2,1,'Novacentro','Cajas'),
	(3,2,'Tienda Norte','Cajas'),
	(4,2,'Tienda Sur','Cajas'),
	(7,1,'Trejos','Ana'),
	(8,22,'eso','linda'),
	(9,23,'Escazú','Cajas'),
	(10,22,'tienda','escazú'),
	(11,22,'tienda','San Pedro'),
	(12,24,'San Pedro','Caja #2'),
	(13,24,'San Juan','Caja #1');

/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `surveyID` int(11) DEFAULT NULL,
  `question` varchar(500) DEFAULT NULL,
  `categoryID` int(11) DEFAULT NULL,
  `type` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;

INSERT INTO `questions` (`id`, `surveyID`, `question`, `categoryID`, `type`)
VALUES
	(67,82,'sasas',0,'multiple'),
	(68,82,'sadsa',2,'polar'),
	(69,82,'sadsa 3',2,'polar'),
	(87,81,'fds',0,'multiple'),
	(88,81,'dsdsd',1,'polar');

/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table survey
# ------------------------------------------------------------

DROP TABLE IF EXISTS `survey`;

CREATE TABLE `survey` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `status` varchar(250) NOT NULL,
  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `surveyKey` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `survey` WRITE;
/*!40000 ALTER TABLE `survey` DISABLE KEYS */;

INSERT INTO `survey` (`id`, `name`, `status`, `Date`, `surveyKey`)
VALUES
	(81,'Prueba 2','active','2015-10-26 10:55:04','6922868e-c1f0-1a24-48d3-03db9e238619'),
	(82,'En eso','active','2015-10-26 11:17:02','cab6f6dc-724c-2892-7a2e-1eed397329ec');

/*!40000 ALTER TABLE `survey` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table survey_by_location
# ------------------------------------------------------------

DROP TABLE IF EXISTS `survey_by_location`;

CREATE TABLE `survey_by_location` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `surveyID` int(11) DEFAULT NULL,
  `locationID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `survey_by_location` WRITE;
/*!40000 ALTER TABLE `survey_by_location` DISABLE KEYS */;

INSERT INTO `survey_by_location` (`id`, `surveyID`, `locationID`)
VALUES
	(108,82,2),
	(132,81,1),
	(133,81,2),
	(134,81,7);

/*!40000 ALTER TABLE `survey_by_location` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `type` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
