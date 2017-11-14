<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ancient Empire</title>
    <link href="../public/css/style.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab" rel="stylesheet">
</head>
<body>
<?php include "partials/header.php"; ?>
<section>
    <div class="gameboard">
        <canvas></canvas>
        <div class="tools">
            <div class="class" class-specific="warrior"></div>
            <div class="class" class-specific="archer"></div>
            <div class="class" class-specific="mage"></div>
        </div>
    </div>
</section>
<?php include "partials/footer.php"; ?>
<script src="../public/scripts/gameboard.js"></script>
<script>
    let game = new Game();
</script>
</body>
</html>