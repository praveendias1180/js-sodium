<?php
session_start();

if(!$_SESSION["secret_key"]){
    echo "Key Generation Step";  
    $key_pair = sodium_crypto_box_keypair();
    $secret_key = sodium_crypto_box_secretkey($key_pair);
    $public_key = sodium_crypto_box_publickey($key_pair);
    
    $_SESSION["secret_key"] = sodium_bin2hex($secret_key);
    $_SESSION["public_key"] = sodium_bin2hex($public_key);
    $_SESSION["key_pair"] = sodium_bin2hex($key_pair);
}

if($_GET["name"]){
    $name = $_GET["name"];
    echo $name;
    $opened = sodium_crypto_box_seal_open(sodium_hex2bin($name), sodium_hex2bin($_SESSION["key_pair"]));
    echo '<br><br>' . $opened;
    echo '<br><br>=========================';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Sodium Plus</title>
</head>
<body>
    <h1>NaCl</h1>
    <form action="/nacl.php" method="get">
        Name: <input type="text" name="name"><br><br>
    <input type="submit">
    </form>
    <script src="sodium-plus.js" ></script>
    <script>
        document.querySelector('form').addEventListener('submit', e => on_sumit(e))
        async function on_sumit(e) {
            e.preventDefault()
            if (!window.sodium) window.sodium = await SodiumPlus.auto();

            let message = document.querySelector('[name="name"]').value;
            let public_key = X25519PublicKey.from( '<?php echo $_SESSION["public_key"]; ?>', 'hex')
            console.log(public_key)
            let ciphertext = await sodium.crypto_box_seal(message, public_key);
            console.log(ciphertext.toString('hex'))
            document.querySelector('[name="name"]').value = ciphertext.toString('hex')
            e.target.submit()
        };
    </script>
</body>
</html>