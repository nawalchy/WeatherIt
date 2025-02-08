<?php
// AUTHOR: SAMIP REGMI
// GROUP: L4CG1
// APPLICATION: WEATHER APP
// PROTOTYPE: 3

$serverName = "";
$userName = "";
$password = "";

$conn = mysqli_connect($serverName, $userName, $password);
if (!$conn) {
    die("failed to connect: " . mysqli_connect_error());
}

$createDatabase = "CREATE DATABASE IF NOT EXISTS test";
if (!mysqli_query($conn, $createDatabase)) {
    die("failed to create database: " . mysqli_error($conn));
}

mysqli_select_db($conn, 'test');

$createTable = "CREATE TABLE IF NOT EXISTS test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    humidity FLOAT NOT NULL,
    wind FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    temp FLOAT NOT NULL,
    weatherMain VARCHAR(50) NOT NULL,
    weatherDesc VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if (!mysqli_query($conn, $createTable)) {
    die("failed to create table: " . mysqli_error($conn));
}

if (isset($_GET['q'])) {
    $cityName = $_GET['q'];
} else {
    $cityName = "Biratnagar";
}

$selectAllData = "SELECT * FROM test WHERE city = '$cityName' AND TIMESTAMPDIFF(HOUR, timestamp, NOW()) < 2";
$result = mysqli_query($conn, $selectAllData);

if (mysqli_num_rows($result) > 0) {
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($rows);
} else {
    $apiKey = "";
    $url = "https://api.openweathermap.org/data/2.5/weather?q=$cityName&appid=$apiKey&units=metric";
    $response = @file_get_contents($url);

    if ($response === false) {
        echo json_encode(["error" => "failed to fetch data"]);
        exit();
    }

    $data = json_decode($response, true);
    if (isset($data['main'])) {
        $humidity = $data['main']['humidity'];
        $wind = $data['wind']['speed'];
        $pressure = $data['main']['pressure'];
        $icon = $data['weather'][0]['icon'];
        $temp = $data['main']['temp'];
        $weatherMain = $data['weather'][0]['main'];
        $weatherDesc = $data['weather'][0]['description'];


        $deleteOldData = "DELETE FROM test WHERE city = '$cityName'";
        mysqli_query($conn, $deleteOldData);

        $insertData = "INSERT INTO test (city, humidity, wind, pressure, icon, temp, weatherMain, weatherDesc) 
        VALUES ('$cityName', '$humidity', '$wind', '$pressure', '$icon', '$temp', '$weatherMain', '$weatherDesc')";

        if (mysqli_query($conn, $insertData)) {
            $selectAllData = "SELECT * FROM test WHERE city = '$cityName' ";
            $result = mysqli_query($conn, $selectAllData);
            $rows = [];
            while ($row = mysqli_fetch_assoc($result)) {
              $rows[] = $row;
            }
          header('Content-Type: application/json');
          echo json_encode($rows);

        } else {
            echo json_encode(["error" => "failed to insert data: " . mysqli_error($conn)]);
        }
    } else {
        echo json_encode(["error" => "invalid data received "]);
    }
}

mysqli_close($conn);
?>
