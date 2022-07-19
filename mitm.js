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
    console.log('############ Alice: public key is sent to Bob')





    /**
     * 
     * 💀💀💀💀💀💀💀💀💀💀💀💀💀
     * 
     * Mallory wants to be in the middle...
     * 
     * Mallory replaces Alice public key with his own!
     * 
     * 💀💀💀💀💀💀💀💀💀💀💀💀💀
     */
     let malloryKeypair = await sodium.crypto_box_keypair();
     let mallorySecret = await sodium.crypto_box_secretkey(malloryKeypair);
     let malloryPublic = await sodium.crypto_box_publickey(malloryKeypair);
     console.error('############ 💀💀💀 MITM: Mallory is in the middle: Mallory replaces Alice public key')
     let replacedAliceKey = alicePublic
     alicePublic = malloryPublic





    /**
     * Bob need to send a top secret message to Alice
     */
    let bobs_message = 'Dear Alice, This is a top secret (CC CVV NO). Regards, Bob';
    let ciphertext = await sodium.crypto_box_seal(bobs_message, alicePublic);
    console.log('############ Bob sends sealed cryptobox to Alice')
    console.log(ciphertext.toString('hex'))    





    /**
     * 
     * 💀💀💀💀💀💀💀💀💀💀💀💀💀
     * 
     * Mallory is again in the middle...
     * 
     * 💀💀💀💀💀💀💀💀💀💀💀💀💀
     */
     let m_decrypted = await sodium.crypto_box_seal_open(ciphertext, malloryPublic, mallorySecret);
     console.error('############ 💀💀💀 MITM: Mallory can see inside the box!!! He can also alter the message if he wants')
     console.error('Original: ' + m_decrypted.toString());
     let seenAndAlteredMessage = m_decrypted.toString().replace('Regards', 'Best Regards')
     console.error('Seen and Altered: ' + seenAndAlteredMessage);

     console.error('############ 💀💀💀 MITM: Mallory sends the message back to Alice')
     ciphertext = await sodium.crypto_box_seal(seenAndAlteredMessage, replacedAliceKey);
     alicePublic = replacedAliceKey





    /**
     * Alice received bobs message as a ciphertext
     */
    let decrypted = await sodium.crypto_box_seal_open(ciphertext, alicePublic, aliceSecret);
    console.log('############ Alice opens sealed crypto box')
    console.log(decrypted.toString());

})();