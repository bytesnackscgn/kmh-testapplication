<template>
    <q-card class="q-px-lg q-py-lg">
        <q-card-section class="column items-center q-py-none">
            <q-img
                class="q-mb-md"
                src="https://kmh-gmbh.com/wp-content/uploads/2022/04/kmh-logo-blau.png"
                loading="lazy"
                spinner-color="white"
                style="max-width: 150px;"
            />
        </q-card-section>
        <q-form @submit="requestPasswortReset()" class="form q-gutter-md">
            <div class="row">
                <div class="col q-px-sm">
                    <q-input dense outlined v-model="form.email" label="E-Mail" lazy-rules :rules="[ val => val && val.length > 0 || formmsg.empty]" />
                </div>
            </div>
            <div class="column items-center">
                <q-btn class="q-mb-md" label="Passwort anfordern" type="submit" color="primary" :disable="disableSubmit"/>
                <span class="cursor-pointer text-primary"  @click="$router.push({ name: 'Login' })">Zurück zum Login</span>
            </div>
        </q-form>
    </q-card>
</template>

<script>
import { ref} from 'vue';

export default {
    name: 'PasswordResetRequestForm',
    data() {
        return {
            formmsg: {
                empty: 'Bitte füllen Sie dieses Feld aus!',
            },
            form: {
                email: '',
                reset_url : `${window.location.origin}/auth/passwort/zuruecksetzen`
            },
        };
    },
    computed : {
        disableSubmit(){
            return !this.$validator.email(this.form.email);
        }
    },
    methods: {
        async requestPasswortReset() {
            try{
                if(!this.disableSubmit === true){
                    await this.$cms.auth.requestPassword(this.form.email, this.form.reset_url);
                    this.$q.notify({
                        type: 'positive',
                        message: 'Erfolgreich!',
                        caption: 'Sie sollten eine E-Mail erhalten haben',
                    });
                    this.$router.push({ name : 'Login' });
                }
            }catch(e){
                console.log(e);
                this.$q.notify({
                    type: 'negative',
                    message: 'Fehlgeschlagen!',
                    caption: 'Beim anfordern ist etwas schiefgelaufen',
                });
            }
        },
    },
    setup() {
        return {
            isPwd: ref(true),
        };
    },
};

</script>