<?php

class head_include {

	protected $closing_tag = false;
	protected $tag;

	function __construct ($tag) {
		if ($tag) {
			$this->tag = $tag;

			if (strtolower($tag) == "script") {
				$this->closing_tag = true;
			}
		};
	}

	public function output ($attributes) {
		if (!is_array($attributes)) {
			return;
		}
		
		$attribute_string = " ";
		$output_string;

		foreach ($attributes as $key => $value) {
			$attribute_string.= "$key='$value' "; 
		}

		$output_string = "<$this->tag $attribute_string>";

		if ($this->closing_tag) {
			$output_string .= "</$this->tag>";
		}

		$output_string .= "\n";

		return $output_string;
	}

}

?>
