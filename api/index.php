<?php

header( 'Access-Control-Allow-Origin: *' );
header( 'Content-Type: text/html; charset=utf-8' );
header( 'Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept' );

header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );

require 'Slim/Slim.php';

$app = new Slim();

//Global
$app->get('/location/:id/customer/:customerID',	'getLocationByCustomer');

$app->get('/customers', 'getCustomers');
$app->get('/customer/:id',	'getCustomer');
$app->get('/survey/customer/:customerID',	'getSurveyByCustomer');
$app->get('/survey/:id/',	'getSurveyQuestions');
$app->post('/survey/save',	'saveAnswers');

//Admin
$app->get('/admin', 'login');
$app->get('/customer/:id/locations', 'getCustomerLocations');
$app->get('/customer/:id/survey', 'getCustomerSurvey');
$app->get('/survey/location/:id/answers/',	'getSurveyAnswersByLocation');

$app->post('/customer/add', 'addCustomer');
$app->get('/customer/delete/:id/', 'deleteCustomer');

//$app->get('/wines/search/:query', 'findByName');
//$app->post('/survey', 'addWine');
//$app->put('/wines/:id', 'updateWine');
//$app->delete('/wines/:id',	'deleteWine');

$app->run();

function getCustomers() {

	$sql = "select * FROM customer";
	try {

		$db = getConnection();
		$stmt = $db->query($sql);

		$customers = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"customer": ' . json_encode($customers) . '}';
    //echo json_encode($customers);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
//
function getCustomer($id) {
	$sql = "SELECT * FROM customer WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$customer = $stmt->fetchObject();
		$db = null;
		echo json_encode($customer);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getCustomerLocations($id) {
  $sql = "SELECT * FROM location WHERE idCustomer=:id";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->execute();
    $customerLocation = $stmt->fetchAll(PDO::FETCH_OBJ);

    $db = null;
    echo json_encode($customerLocation);
  } catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function getCustomerSurvey($id) {
  $sql = "SELECT * FROM survey WHERE customerID=:id";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->execute();
    $customerSurvey = $stmt->fetchAll(PDO::FETCH_OBJ);

    $db = null;
    echo json_encode($customerSurvey);
  } catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function getLocationByCustomer($locationID, $customerID) {
  $sql = "SELECT * FROM location WHERE id=:id AND idCustomer=:idCustomer";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $locationID);
    $stmt->bindParam("idCustomer", $customerID);

    $stmt->execute();
    $customer = $stmt->fetchObject();
    $db = null;

    echo json_encode($customer);
  } catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}
//

function getSurveyByCustomer( $customerID ) {
  $sql = "SELECT id FROM survey WHERE customerID =:customerID AND status = 'active'";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("customerID", $customerID);
    $stmt->execute();
    $surveyID = $stmt->fetchObject();
    $db = null;

    echo json_encode($surveyID);
  } catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}


function getSurveyQuestions($id) {
  $sql = "SELECT * FROM questions WHERE surveyID=:id";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->execute();
    $surveyQuestions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $db = null;
    echo json_encode($surveyQuestions);
  } catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function getSurveyAnswersByLocation($id) {
  //$sql = "SELECT answers.questionID, answers.answer, questions.id, questions.question, questions.surveyID FROM answers INNER JOIN questions ON questions.surveyID=:id AND answers.questionID = questions.id";
  //$sql = "SELECT answers.questionID, answers.answer, questions.id, questions.question, questions.surveyID FROM answers INNER JOIN questions ON questions.surveyID=:id";
  $sql = "SELECT * FROM answers WHERE locationID=:id";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->execute();
    $surveyAnswers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $db = null;
    echo json_encode($surveyAnswers);
  } catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}
//
function addCustomer() {
  error_log('addCustomer\n', 3, '/var/tmp/php.log');
  $request = Slim::getInstance()->request();
  $customerName = json_decode($request->getBody());


  $sql = "INSERT INTO customer (`name`) VALUES (:customer)";


  try {
    $db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindValue(":customer", $customerName->name);

		$stmt->execute();
		$db = null;
		//echo json_encode($customerName);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

//
function deleteCustomer($id) {
	$sql = "DELETE FROM customer WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

//
function saveAnswers() {
	error_log('addWine\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$answers = json_decode($request->getBody());

  print_r($answers);

 // print_r($answers[0]->id);

	$sql = "INSERT INTO answers (questionID, locationID, answer, created) VALUES ";
  $qPart = array_fill(0, count($answers), "(?, ?, ?, ?)");
  $sql .= implode(",",$qPart);



  $i = 1;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);

    foreach($answers as $item) { //bind the values one by one

      $stmt->bindValue($i++, $item->id);
      $stmt->bindValue($i++, $item->location);
      $stmt->bindValue($i++, $item->answer);
      $stmt->bindValue($i++, $item->created);


    }
//    print_r($stmt);
//    die();

		$stmt->execute();

		$db = null;
		echo json_encode($answers);
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
//
//function updateWine($id) {
//	$request = Slim::getInstance()->request();
//	$body = $request->getBody();
//	$wine = json_decode($body);
//	$sql = "UPDATE wine SET name=:name, grapes=:grapes, country=:country, region=:region, year=:year, description=:description WHERE id=:id";
//	try {
//		$db = getConnection();
//		$stmt = $db->prepare($sql);
//		$stmt->bindParam("name", $wine->name);
//		$stmt->bindParam("grapes", $wine->grapes);
//		$stmt->bindParam("country", $wine->country);
//		$stmt->bindParam("region", $wine->region);
//		$stmt->bindParam("year", $wine->year);
//		$stmt->bindParam("description", $wine->description);
//		$stmt->bindParam("id", $id);
//		$stmt->execute();
//		$db = null;
//		echo json_encode($wine);
//	} catch(PDOException $e) {
//		echo '{"error":{"text":'. $e->getMessage() .'}}';
//	}
//}
//
//function deleteWine($id) {
//	$sql = "DELETE FROM wine WHERE id=:id";
//	try {
//		$db = getConnection();
//		$stmt = $db->prepare($sql);
//		$stmt->bindParam("id", $id);
//		$stmt->execute();
//		$db = null;
//	} catch(PDOException $e) {
//		echo '{"error":{"text":'. $e->getMessage() .'}}';
//	}
//}
//
//function findByName($query) {
//	$sql = "SELECT * FROM wine WHERE UPPER(name) LIKE :query ORDER BY name";
//	try {
//		$db = getConnection();
//		$stmt = $db->prepare($sql);
//		$query = "%".$query."%";
//		$stmt->bindParam("query", $query);
//		$stmt->execute();
//		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
//		$db = null;
//		echo '{"wine": ' . json_encode($wines) . '}';
//	} catch(PDOException $e) {
//		echo '{"error":{"text":'. $e->getMessage() .'}}';
//	}
//}

function getConnection() {

	$dbhost="localhost";
	$dbuser="andresru_stabs";
	$dbpass="sw1tch4b5";
	$dbname="andresru_stabs";

	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
  $dbh -> exec("set names utf8");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>