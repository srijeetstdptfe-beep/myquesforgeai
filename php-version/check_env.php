<?php
echo "allow_url_fopen: " . ini_get('allow_url_fopen') . "\n";
echo "curl_init: " . (function_exists('curl_init') ? 'exists' : 'missing') . "\n";
