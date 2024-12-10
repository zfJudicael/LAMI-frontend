<template>
    <footer>
        <div class="info">
            <h3>QUI SOMMES NOUS?</h3>
            <p>Notre histoire</p>
            <p>Notre équipe</p>
        </div>

        <div class="join">
            <h3>NOUS REJOINDRE</h3>
            <p>Recrutement</p>
        </div>

        <div class="help">
            <h3>BESOIN D'AIDE?</h3>
            <p>Question fréquentes</p>
            <p>Modes de livraison</p>
            <p>Modes de payement</p>
        </div>

        <div class="contact">
            <h3>NOTRE CONTACT</h3>
            <p>Numéro : 032 00 000 00</p>
            <p>Email : laminfo@gmail.com</p>
        </div>
    </footer>
</template>

<style scoped>
footer{
    height: 100%;
    text-align: left;
    display: grid;
    gap: 20px;
    background-color: #6df7c8;
    color: #086d4b;
}

footer >div{
    padding: 0 50px 0 50px;
}

footer >div h3{
    border-bottom: 2px solid #086d4b;
}

footer > div p:hover{
    color: white;
    cursor: pointer;
    text-decoration: underline;
}


@media only screen and (min-width: 600px) {
    footer{
        grid-template-columns:repeat(2, 1fr);
    }

    footer >div{
        min-width: 100px;   
    }
}

@media only screen and (min-width: 768px) {
    footer{
        grid-template-columns:repeat(4, 1fr);
    }

    footer >div{
        min-width: 100px;   
    }
}
</style>