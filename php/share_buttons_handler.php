<?php
	foreach ($visualiser_config['share_buttons'] as $share_button) {
		$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

		$img = "<img src ='{$share_button['icon_path']}' class = 'share-icon' id = '{$share_button['name']}-share-icon'>";

		$a = "<a id = '{$share_button['name']}-share-link' class = 'share-link' target = '_blank' href = '{$share_button['share_link']}?{$share_button['text_key']}={$url}'>{$img}</a>";


		echo $a;
	}

?>