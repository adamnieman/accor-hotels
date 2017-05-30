<?php

	require "php/head_include.php";

	$link_include = new head_include("link");
	$script_include = new head_include("script");

	foreach ($settings->head_include->fonts as $font) {
		echo $link_include->output(array(
			"rel" => "stylesheet",
			"type" => "text/css",
			"href" => $font
		));
	}

	foreach ($settings->head_include->css as $css) {
		echo $link_include->output(array(
			"rel" => "stylesheet",
			"type" => "text/css",
			"href" => "css/$css.css"
		));
	}

	foreach ($settings->head_include->js->libs as $js) {
		echo $script_include->output(array(
			"src" => "js/libs/$js.js"
		));
	}

	foreach ($settings->head_include->js->main as $js) {
		echo $script_include->output(array(
			"src" => "js/$js.js"
		));
	}

	foreach ($settings->head_include->js->modules as $js) {
		echo $script_include->output(array(
			"src" => "js/modules/$js.js"
		));
	}

?>