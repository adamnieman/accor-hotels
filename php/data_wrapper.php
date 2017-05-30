<?php

class data_wrapper {

	private $data = array();

	function __construct ($data_location)	{
		ini_set("auto_detect_line_endings", true);

		$this->load_data($data_location);

		
	}

	public function get_brands () {
		$brands = array();

		foreach ($this->data as $data_point) {

			if (!in_array($data_point['brand'], $brands)) {
				array_push($brands, $data_point['brand']);
			}
		}

		print_r($brands);

		return $brands;
	}

	public function get_hotels ($brand) {
		
		$hotels = array();

		foreach ($this->data as $data_point) {

			if ($data_point['brand'] == $brand) {
				array_push($hotels, $data_point['hotel']);
			}
		}

		return $hotels;
	}

	public function seek_rate_for ($brand, $hotel) {
		$data = $this->seek_data_for($brand, $hotel);

		$total = 0;

		foreach ($data as $data_point) {
			$total += $data_point['kg_co2_s'];
		}
		return $total;
	}

	public function seek_data_for ($brand, $hotel) {
		$data = $this->filter_data_by_brand($this->data, $brand);
		$data = $this->filter_data_by_hotel($data, $hotel);

		return $data;
	}

	private function load_data ($data_location) {

		$file = fopen($data_location, "r");
		$column_headings = fgetcsv($file);

		while(($row = fgetcsv($file)) != FALSE) {
			array_push($this->data, array(
				$column_headings[0] => $row[0],
				$column_headings[1] => $row[1],
				$column_headings[2] => $row[2],
			));

		}
	
		fclose($file);
		
	}

	private function filter_data_by_brand ($data, $brand) {

		if (!$brand) {return $data;}

		foreach ($data as $data_point) {
			if ($data_point['brand'] != $brand) {
				$key = array_search($data_point, $data);
				unset($data[$key]);
			}
		}

		return $data;
	}

	private function filter_data_by_hotel ($data, $hotel) {

		if (!$hotel) {return $data;}

		foreach ($data as $data_point) {
			if ($data_point['hotel'] != $hotel) {
				$key = array_search($data_point, $data);
				unset($data[$key]);
			}
		}

		return $data;
	}
}

?>
