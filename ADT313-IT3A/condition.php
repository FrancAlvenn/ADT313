<h1>Conditional</h1>

<?php
    $age = 10;

    if($age >= 18){
        echo "Legal Age";
    }
    else if($age >= 0 && $age <= 10){
        echo "Something";
    }else{
        echo "Minor";
    }

    #ternary condition
    $checkAge = ($age >= 18) ? "Legal Age" : "Minor";

    echo $checkAge;


    $variable = "instructor";

    switch($variable){
        case "admin":
            echo "you have access to everything";
            break;
        case "student":
            echo "you have access to the lessons and quizzes";
            break;
        case "instructor":
            echo "you have access to almost everything";
            break;
        default:
            echo "No Access";




    }


















?>






