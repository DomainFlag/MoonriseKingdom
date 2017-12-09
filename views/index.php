<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Moonrise Kingdom</title>
    <link href="../public/css/style.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab" rel="stylesheet">
</head>
<body>
<?php include "partials/header.php"; ?>
<section>
    <p class="action"></p>
    <div class="gameboard">
        <canvas></canvas>
        <div class="tools">
            <div class="class" class-specific="warrior"></div>
            <div class="class" class-specific="archer"></div>
            <div class="class" class-specific="mage"></div>
        </div>
        <div class="tools">
            <div class="class" class-specific="fireball"></div>
            <div class="class" class-specific="heal"></div>
            <div class="class" class-specific="armageddon"></div>
        </div>
        <div class="popup">
            <h1 class="popup_header">Victory</h1>
            <p class="popup_paragraph"></p>
            <button class="popup_action">New Game</button>
            <p class="popup_note">Or rewind down below.</p>
        </div>
    </div>
    <div class="rewind">
        <p class="message"></p>
    </div>
</section>
<?php include "partials/footer.php"; ?>
<script src="../public/scripts/gameboard.js"></script>
<script>
    let game = new Game();
</script>
</body>
</html>