<h1>Arrays</h1>

<?php

$cars = array("Volvo", "BMW", "Toyota");
// Same as the code below
$cars = ["Volvo", "BMW", "Toyota"];

print_r($cars);

echo "<br/> <h1> Var Dump </h1>";

var_dump($cars);

echo "<br/> <h1> Specific Value </h1>";

echo $cars[0];

echo "<br/> <h1> Push Values</h1>";
$cars [] = "Lexus";
print_r($cars);

echo "<br/> <h1> Echo with For Each</h1>";

foreach($cars as $car){
    echo "$car <br/>";
}

echo "<br/> <h1> Associative Array</h1>";

$car = array("brand"=>"Ford", "model"=>"Mustang", "year"=>1964);
echo $car["model"];
$car["year"] = 2024;


$userInfo = array(
    "user" => array(
        "firstName" => "Franc Alvenn",
        "middleName" => "Tumamapil",
        "lastName" => "Dela Cruz",
        "class" => array(
            "section" => "3A",
            "course" => "BSIT"
        )

    ),
    "address" => array(
        "province" => "bulacan",
        "municipality" => "bocaue",
        "baranggay" => "sulucan"
    )
);

echo $userInfo['user']['lastName'] . $userInfo['user']['lastName'];
