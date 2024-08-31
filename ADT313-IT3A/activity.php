<h1>Hands-on-Activity | Franc Alvenn Dela Cruz</h1>

<?php
    $table = array(
        "header" => array(
            "StudentID",
            "Firstname",
            "Middlename",
            "Lastname",
            "Section",
            "Course",
            "Yearlevel"
        ),
        "body" => array(
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
            array(
                "firstname" => "Firstname",
                "middlename" => "Middlename",
                "lastname" => "Lastname",
                "section" => "Section",
                "course" => "Course",
                "yearlevel" => "Yearlevel"
            ),
        )
        );

?>

<table border = "1">
    <thead>
        <?php
            foreach($table['header'] as $tableHeader){
                echo  "<th> $tableHeader </th>";
            }
        ?>
    </thead>

    <tbody>
        <?php
            $index = 0;
            foreach($table['body'] as $body){
                echo "<tr>";
                echo "<td> " . $index .  "</td>";
                echo "<td> " .$body['firstname'] . "</td>";
                echo "<td> " .$body['middlename'] . "</td>";
                echo "<td> " .$body['lastname'] . "</td>";
                echo "<td> " .$body['section'] . "</td>";
                echo "<td> " .$body['course'] . "</td>";
                echo "<td> " .$body['yearlevel'] . "</td>";
                echo "</tr>";
                $index++;
            }
        ?>

    </tbody>

</table>