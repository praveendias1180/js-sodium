(async function() {
    if (!window.sodium) window.sodium = await SodiumPlus.auto();

    /**
     * Alice wants to receive sealed boxes from anyone.
     * 
     * Let's use Sodium Plus sealed boxes.
     * 
     * Alice releases her public key to the world.
     */
    let aliceKeypair = await sodium.crypto_box_keypair();
    let aliceSecret = await sodium.crypto_box_secretkey(aliceKeypair);
    let alicePublic = await sodium.crypto_box_publickey(aliceKeypair);
    

    /**
     * Bob need to send a top secret message to Alice
     */
    let bobs_message = 'Dear Alice, This is a top secret. Regards, Bob';
    let ciphertext = await sodium.crypto_box_seal(bobs_message, alicePublic);
    console.log('############ Bob sends sealed cryptobox to Alice')
    console.log(ciphertext.toString('hex'))    


    /**
     * Alice received bobs message as a ciphertext
     */
    let decrypted = await sodium.crypto_box_seal_open(ciphertext, alicePublic, aliceSecret);
    console.log('############ Alice opens sealed crypto box')
    console.log(decrypted.toString());

})();