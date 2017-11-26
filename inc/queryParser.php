<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 25/11/2017
 * Time: 14:57
 */
function parsePHPQuery($query, $values) {
    foreach($values as $property => $value) {
        global $replace;
        if(is_string($value)) {
            $replace = '\'' . $value . '\'';
        } else {
            $replace = $value;
        }
        preg_replace('/\\'.$property.'/', $replace, $query);
    }
    return $query;
}