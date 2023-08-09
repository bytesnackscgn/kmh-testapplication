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
        <q-form @submit="signIn()" class="form q-gutter-md">
            <div class="row">
                <div class="col q-px-sm">
                    <q-input dense outlined v-model="form.username" label="E-Mail" lazy-rules :rules="[ val => val && val.length > 0 || formmsg.empty]" />
                    <q-input dense v-model="form.password" outlined :type="isPwd ? 'password' : 'text'" label="Passwort">
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="column items-center">
                <q-btn class="q-mb-md" label="Anmelden" type="submit" color="primary" />
                <span class="cursor-pointer text-primary"  @click="$router.push({ name: 'Passwort Anfordern' })">Passwort vergessen?</span>
            </div>
        </q-form>
    </q-card>
</template>

<script>
import { ref } from 'vue';
export default {
    name: 'form-signin',
    data() {
        return {
            formmsg: {
                empty: 'Bitte füllen Sie dieses Feld aus!',
            },
            form: {
                username: '',
                password: '',
                rememberme: false,
            },
            alert :{
                persistent : false,
                colorcode : '',
                label : '',
                message : '',
                btnlabel : ''
            }
        };
    },
    computed : {},
    methods: {
        redirToPasswordRequest(){
            this.$router.push({ name: 'Passwort Anfordern' });
        },
        async signIn() {
            try{
                let user = {};
                const authdataresponse = await this.$cms.auth.login({ email: this.form.username, password: this.form.password });
                if ( Object.prototype.hasOwnProperty.call(authdataresponse , 'access_token') ) {
                    localStorage.setItem('auth_token',authdataresponse.access_token);
                    const user = await this.$auth.authByToken();
                    if(await user != false){
                        this.$store.commit('user/cu', {...user});
                        this.$q.notify({
                            type: 'positive',
                            message: 'Login erfolgreich',
                            caption: 'Sie werden weitergeleitet',
                            // color: 'secondary'
                        });
                        this.$router.push('/cms/bestellungen');
                    }
                }
            }catch(e){
                console.log(e);
                if(e == 'Error: "email" must be a valid email'){
                    this.$q.notify({
                        type: 'negative',
                        message: 'Fehlgeschlagen',
                        caption: 'Es wurde keine gültige E-Mail eingegeben!',
                        // color: 'secondary'
                    });
                }else if(e == 'Error: Invalid user credentials.'){
                    this.$q.notify({
                        type: 'negative',
                        message: 'Fehlgeschlagen',
                        caption: 'Ihre Logindaten stimmen nicht überein!',
                        // color: 'secondary'
                    });
                }
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