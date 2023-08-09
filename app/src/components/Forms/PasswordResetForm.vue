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
        <q-form @submit="resetPassword()" class="form q-gutter-md">
            <div class="row">
                <div class="col q-px-sm">
                    <q-input class="" dense v-model="form.password" outlined :type="isPwd ? 'password' : 'text'" label="Passwort" lazy-rules :rules="validatePassLazy()"> 
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                    <q-input dense v-model="form.passwordRepeat" outlined :type="isPwd ? 'password' : 'text'" label="Passwort wiederholen">
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"  @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="column items-center">
                <q-btn class="q-mb-md" label="Passwort zurücksetzen" type="submit" color="primary" :disable="disableSubmit" />
            </div>
        </q-form>
    </q-card>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'PasswordResetForm',
    data() {
        return {
            formmsg: {
                empty: 'Bitte füllen Sie dieses Feld aus!',
            },
            form: {
                password : '',
                passwordRepeat : '',
                token : '',
            },
        };
    },
    computed : {
        disableSubmit(){
            const key = this.$validator.validatePasswordInvalidKey(this.form.password,this.form.passwordRepeat);
            return key === true ? false : true;
        }
    },
    methods: {
        validatePassLazy(){
            const key = this.$validator.validatePasswordInvalidKey(this.form.password,this.form.passwordRepeat);
            return [
                (v) => key === true || this.$constants.formmsg[key],
            ];
        },
        async resetPassword(){
            try{
                if(!this.disableSubmit === true){
                    const resetResponse = await this.$cms.auth.resetPassword(this.form.token, this.form.password);
                    this.$q.notify({
                        type: 'positive',
                        message: 'Erfolgreich!',
                        caption: 'Passwort wurde zurückgesetzt',
                    });
                    this.$router.push({ name : 'Login' });
                }
            }catch(e){
                console.log(e);
                this.$q.notify({
                    type: 'negative',
                    message: 'Fehlgeschlagen',
                    caption: 'Es wurde keine gültige E-Mail eingegeben!',
                });
            }
        },
    },
    created() {
        const query = new URLSearchParams(window.location.search);
        if(query.has('token')){
            const token = query.get('token');
            if(`${token}`.trim() != '') this.form.token = token;
        }
    },
    setup() {
        return {
            isPwd: ref(true),
        };
    },
};
</script>