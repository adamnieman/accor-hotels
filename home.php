
<?php
	$settings_location = "settings.json";
	$settings = json_decode(file_get_contents($settings_location));

	require "php/data_wrapper.php";

	$dw = new data_wrapper($settings->data_location);

	if (array_key_exists('brand', $_GET) && 
		array_key_exists('hotel', $_GET)) {


		$rate = $dw->seek_rate_for($_GET['brand'], $_GET['hotel']);
		$hotel_name = $_GET['hotel'] ? $_GET['hotel'] : "all hotels";
		$brand_name = $_GET['brand'] ? $_GET['brand'] : "all brands";
	}

	/*$brands = $dw->get_brands();
	foreach ($brands as $brand) {
		print_r($brand);
		echo "</br>";
		$hotels = $dw->get_hotels($brand);
		print_r($hotels);
		echo "</br>";
		echo "</br>";
	}

	exit()*/
?>
<!DOCTYPE html>
<html> 
<head>
	<meta charset="UTF-8"> 
	<title>
		Hotel emissions
	</title>

	<?php 
	require "php/head_include_handler.php"; 
	?>

	
</head>
<body>
	<div id = "mother">
	<div id = "form-container">
	<form>
	<p>Select a brand</p>
	<select id = "brand-select" name="brand">
		<option value=0>All brands</option>
<?php
	$brands = $dw->get_brands();

	foreach ($brands as $brand) {
		echo "<option value = '{$brand}'>{$brand}</option>";
	}
?>
	</select>
	<p>Select a hotel</p>
	<select id = "hotel-select" name="hotel">
		<option class = 'active' value=0>All hotels</option>
<?php

	foreach ($brands as $brand) {
		$hotels = $dw->get_hotels($brand);

		$brand_hyphenated = str_replace(' ', '-', $brand);
		foreach ($hotels as $hotel) {
			echo "<option class ='{$brand_hyphenated} active' value = '{$hotel}'>{$hotel}</option>";
		} 
	}
?>
	</select>
	<p><input type="submit" value="Submit"></p>
	</form>
	</div>
	<div id = "vis-container">
<?php

	if ($rate) { 
		if ($hotel_name != "all hotels") {
			echo "<h1>Emissions rate of {$hotel_name}</h1>";
		} else {
			echo  "<h1>Emissions rate of {$hotel_name} belonging to {$brand_name}</h1>";
		}

		echo "<iframe id = 'iframe' src ='http://178.62.119.175/realtime-vis/home.html?gas=carbon dioxide&rate={$rate}'></iframe>";
	}
?>
		
	</div>
</body>
</html>