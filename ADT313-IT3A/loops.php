<h1>Loops</h1>


<?php

    echo "<h3>While Loops</h3>";

    $i = 1;
    while ($i < 6){
        echo $i;
        $i ++;
    }

    echo "<h3>Do While Loops</h3>";

    do {
        echo $i;
        $i++;
        }
    while ($i < 6);


    echo "<h3>For Loops</h3>";

    for ($x = 0; $x <= 10; $x++) {
        echo "The number is: $x <br>";
    }


    echo "<h3>For Each Loops</h3>";

    $colors = array("red", "green", "blue", "yellow");
        foreach ($colors as $x) {
        echo "$x <br>";
    }

    echo "<h3>Break</h3>";

    for ($x = 0; $x < 10; $x++) {
        if ($x == 4) {
        break;
        }
        echo "The number is: $x <br>";
    }


    echo "<h3>Continue</h3>";

    for ($x = 0; $x < 10; $x++) {
        if ($x == 4) {
        continue;
        }
        echo "The number is: $x <br>";
    }

    

    $colors = array("red", "blue")

















?>