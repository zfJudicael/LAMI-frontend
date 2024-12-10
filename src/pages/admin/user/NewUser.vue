<template>
    <div class="signUp">
        <form @submit.prevent="onSubmit" @reset="handleReset">
            <h3>Création d'un nouveau compte utilisateur</h3>
            <div class="group">
                <div class="input">
                    <label for="name">Nom*</label>
                    <InputText id="name" aria-labelledby="name" v-model="name" :invalid="errors.name ? true : false"/> 
                    <small class="errorMessage">{{ errors.name }}</small>
                </div>
                <div class="input">
                    <label for="firstname">Prénoms</label>
                    <InputText id="firstname" aria-labelledby="firstname" v-model="firstname" :invalid="errors.firstname ? true : false"/>
                    <small class="errorMessage">{{ errors.firstname }}</small>
                </div>
            </div>

            <div class="input">
                <label for="email">Adresse email*</label>
                <InputText id="email" aria-labelledby="email" aria-describedby="email-help" v-model="email" :invalid="errors.email ? true : false"/>
                <small class="errorMessage">{{ errors.email }}</small>
                <small id="email-help">Cette adresse est indispensable lors de la connexion à votre compte. Nous vous envoyerons les factures</small>
            </div>

            <div class="input">
                <label for="phoneNumber">Numéro de téléphone*</label>
                <InputGroup>
                    <InputGroupAddon>+261</InputGroupAddon>
                    <InputNumber id="phoneNumber" aria-labelledby="phoneNumber" aria-describedby="phoneNumber-help" :use-grouping="false" v-model="phoneNumber" :invalid="errors.phoneNumber ? true : false"/>
                </InputGroup>
                <small class="errorMessage">{{ errors.phoneNumber }}</small>
                <small id="phoneNumber-help">Notre livreur utilise ce numéro pour vous contacter</small>
            </div>

            <div class="input">
                <label for="role">Choisissez le rôle que vous voulez attribuez au nouveau utilisateur</label>
                <Select v-model="role" :options="userRole" aria-labelledby="role" option-label="label" aria-describedby="role-help" v-on:update:model-value="isRoleSelected = true"></Select>
                <small class="errorMessage">{{ errors.role }}</small>
                <small id="role-help">Le rôle definit le privilège et le tâche du personnel dans le plateform</small>
            </div>

            <div class="password-input">
                <label for="password">Mots de passe</label>
                <Password id="password" aria-labelledby="password" :feedback="false" toggle-mask v-model="password" :invalid="errors.password ? true : false"/>
                <br>
                <small class="errorMessage">{{ errors.password }}</small>
            </div>

            <div class="password-input">
                <label for="confirmPassword">Confirmez le mots de passe</label>
                <Password id="confirmPassword" :feedback="false" aria-labelledby="confirmPassword" toggle-mask v-model="confirmPassword" :invalid="errors.confirmPassword ? true : false"/>
                <br>
                <small class="errorMessage">{{ errors.confirmPassword }}</small>
            </div>

            <div class="BTN">
                <Button type="reset" severity="secondary" outlined>Effacer</Button>
                <Button type="submit" :disabled="!isRoleSelected">Confirmer</Button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Select from 'primevue/select'; 
import Button from 'primevue/button';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm, useField } from 'vee-validate';
import { object, string, number, ref as REF } from 'yup';
import { Role } from '@/models/User';
import { useToast } from 'primevue/usetoast';
import { UserService } from '@/modules/user/user.service';
import { ref } from 'vue';

const userRole = [
    {
        id: 'COMMERCIAL',
        label: 'Commercial'
    },
    {
        id: 'STOREMAN',
        label: 'Magasinier'
    }
]

const validationSchema = toTypedSchema(
    object({
        name: string()
                    .required("Le nom est obligatoire"),
        firstname: string()
                        .default(''),
        phoneNumber: number()
                        .required("Veuillez remplir ce champ")
                        .test('len', 'Le numéro de téléphone doit comporter 9 chiffres', val => val.toString().length === 9),
        email: string()
                    .required("L'adresse email est obligatoire")
                    .min(1, "L'adresse email est obligatoire")
                    .email("L'adresse email n'est pas valide"),
        avatar: string()
                    .default(''),
        password: string()
                        .trim()
                        .required("Remplir avec votre mots de passe")
                        .min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
        confirmPassword: string()
                            .required("Veuillez confirmez votre mots de passe")
                            .oneOf([REF('password')], 'Different du mots de passe'),
        role: object({
                        id: string(),
                        label: string()
                    })
                .required("Champ réquis")
    })
)

const { handleSubmit, handleReset, errors } = useForm({ 
    validationSchema,
});

const { value: name } = useField('name');
const { value: firstname } = useField('firstname');
const { value: phoneNumber } = useField('phoneNumber');
const { value: email } = useField('email');
const { value: role } = useField('role');
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword')

const toast = useToast();
const onSubmit = handleSubmit((values)=>{
    UserService.create({
        name: values.name,
        firstname: values.firstname,
        phoneNumber: values.phoneNumber.toString(), 
        email: values.email, 
        password: values.password,
        role: values.role.id as Role
    }).then(async (res)=>{
        toast.add({ severity: 'success', summary: 'Info Message', detail: 'Compte du personnel crée avec succès', life: 3000 });
        handleReset();
        isRoleSelected.value = false;
    }).catch((err)=>{
        toast.add({ severity: 'error', summary: 'Info Message', detail: 'Échec de la création de compte', life: 3000 });
    })
})

const isRoleSelected = ref(false)

</script>

<style>
.signUp form{
    max-width: 500px;
    margin: 0 auto;
}

.signUp form h3{
    text-align: center;
}

.signUp .input{
    display: flex;
    flex-direction: column;
    margin-bottom: 15px ;
}

.signUp .errorMessage {
    color: red;
}

.signUp .password-input{
    margin-bottom: 15px;
}

.signUp .password-input label{
    display: block;
}

.signUp .acceptTerms{
    display: flex;
    gap: 5px;
    margin-bottom: 15px;
}

.signUp .BTN {
    display: flex; 
    gap: 5px;
}

.signUp .BTN button:nth-child(1){
    flex-grow: 1;
}

.signUp .BTN button:nth-child(2){
    flex-grow: 2;
}

@media only screen and (min-width: 600px) {
    .signUp form .group{
        display: flex;
        gap: 5px;
    }

    .signUp form .group div:nth-child(2){
        flex-grow: 1;
    }
}

</style>