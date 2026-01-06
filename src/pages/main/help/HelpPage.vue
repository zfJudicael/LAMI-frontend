<template>
    <div class="helpPage">
        <div>
            <h3>Besoin d'une assistance ou plus d'information?</h3>
            <p>N'hesitez pas à nous contacter sur</p>
            <p class="mail">
                <i class="pi pi-envelope"></i> 
                laminfo@gmail.com
            </p>

            <p class="phone">
                <i class="pi pi-phone"></i> 
                032 00 000 00 / 034 00 000 00
            </p>

            <p class="separator">Ou veuillez nous rejoindre à notre siège</p>

            <p class="adress">
                <i class="pi pi-map-marker" style="color: black;"></i>
                10 Bis, Bd Augagneur Anjoma Toamasina
            </p>
        </div>
    </div>
</template>

<style lang="scss">
.helpPage{
    display: flex; 
    justify-content: center;

    div{
        h3, p{
            text-align: center;

            i{
                font-size: 1.8rem;
            }
        }

        p.mail, p.phone, p.adress{
            display: flex; align-items: center; gap: 10px;
        }

        p.separator{
            margin-top: 50px;
        }
    }
}
</style>