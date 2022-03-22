// DEBUG
console.log("DEBUG : loaded root.js");


// COMPONENTS

// START COMPONENT START
const start = Vue.component('start',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="root-signup-block">
    <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="100" height="100">
    </div>
    <div v-else>
        <router-link to="/signup">
            <button class="btn btn-light root-btn-submit1">Sign Up</button>
        </router-link>
        </br class="line">
        <router-link to="/login">
            <button class="btn btn-light root-btn-submit1">Log In</button>
        </router-link>
        <p v-if="somethingwrong">Unable to register. Something went wrong :(</p>
        <p v-if= "invalid_email || email_in_use || username_in_use">Please fix the following errors</p>
        <p v-if="invalid_email">Invalid Email</p>
        <p v-if="email_in_use">Email in use</p>
        <p v-if="username_in_use">Username in use</p>
    </div>
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:false,
        somethingwrong:false,
        invalid_email:false,
        email_in_use:false,
        username_in_use:false,
        username:'',
        email:'',
        password:''
        }
    },

    // COMPONENT METHODS
    methods:{
        // FUNCTION SUBMIT
        submit:function(){
            this.loading=true;
            console.log("DEBUG : root-signup-block submitted")
            fetch("http://localhost:5000/validate",{method:'POST',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({'username':this.username,'email':this.email})})
            .then((response)=>{
                if (!response.ok) {
                    console.log("Response not ok");
                }
                return response.json();
            }).then((data)=>{
                console.log("Got data",data);
                if (data['username_in_use']){
                    this.username_in_use = true;
                    console.log("DEBUG : username in use")
                }
                if (data['email_in_use']){
                    this.email_in_use = true;
                    console.log("DEBUG : email in use")
                }

                if (!data['username_in_use'] && !data['email_in_use']){
                    fetch("http://localhost:5000/",{method:'POST',headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({'username':this.username,'email':this.email,'password':this.password,'context':'SIGNIN'})}).then((response) => {
                  return response.text();
              }).then((response)=>{
                window.location.href = 'http://localhost:5000/dashboard'
              })


                    //fetch("http://localhost:5000/",{method:'POST',headers:{'Content-Type':'application/json'},
                    //body:JSON.stringify({'username':this.username,'email':this.email,'password':this.password,'context':'SIGNIN'})})
                    //console.log("DEBUG : VALID REGISTRATION");
                }
            })
            .catch((error)=>{
                console.log("Caught error",error)
            });
            this.loading=false;
        }
    },
})
// SIGNUP COMPONENT END

// SIGNUP COMPONENT START
const signup = Vue.component('signup',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="root-signup-block">
        <div v-if="loading">
            <img stryle="" src="static/img/loader3.gif" alt="loading" width="100" height="100">
        </div>
        <div v-else>
            <div class="mb-3 mb-3-custom">
                <label for="signup-form-input-username" class="form-label signup-form-label">Username</label>
                <input v-model="username" type="text" class="form-control signup-form-input" id="signup-form-input-username" placeholder="Username (> 4 characters)">
            </div>
            
            <div class="mb-3 mb-3-custom">
                <label for="signup-form-input-email" class="form-label signup-form-label">Email</label>
                <input v-model="email" type="text" class="form-control signup-form-input" id="signup-form-input-email" placeholder="Email">
            </div>

            <div class="mb-3 mb-3-custom">
                <label for="signup-form-input-password" class="form-label signup-form-label">Password</label>
                <input v-model="password" type="password" class="form-control signup-form-input" id="signup-form-input-password" placeholder="Password (> 5 characters)">
            </div>

            <!--
            <p class="root-label1">Username</p>
            <input type="text" class="root-input1" v-model="username">
            <p class="root-label1">Email</p>
            <input type="text" class="root-input1" v-model="email">
            <p class="root-label1">password</p>
            <input type="password" class="root-input1" v-model="password">
            </br class="line">
            -->
            <button class="btn btn-light root-btn-submit1" @click=submit()>Sign Up</button>
            </br class="line">
            <router-link to="/login">
                <button class="btn btn-light root-btn-submit1">Log In</button>
            </router-link>
            <p v-if="somethingwrong">Unable to register. Something went wrong :(</p>
            <p v-if= "invalid_email || email_in_use || username_in_use || username_length_incorrect || password_length_incorrect">Please fix the following errors</p>
            <p v-if="invalid_email">Invalid Email</p>
            <p v-if="email_in_use">Email in use</p>
            <p v-if="username_in_use">Username in use</p>
            <p v-if="username_length_incorrect">Username length must be > 4</p>
            <p v-if="password_length_incorrect">Password length must be > 5</p>
        </div>
        </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:false,
        somethingwrong:false,
        invalid_email:false,
        email_in_use:false,
        username_in_use:false,
        username_length_incorrect: false,
        password_length_incorrect: false,
        username:'',
        email:'',
        password:''
        }
    },

    // COMPONENT METHODS
    methods:{
            emailregex: function(mail) {
                this.username_length_incorrect = false;
                this.password_length_incorrect = false;
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
                return (true);
                }
            else {
                alert("invalid email address");
                return (false);
                }
            },

        // FUNCTION SUBMIT
        submit:function(){
            const url_api_validate = 'http://'+window.location.host+'/api-validate';
            const url_dashboard = 'http://'+window.location.host+'/dashboard';
            if (this.username.length<5 || this.password.length<6){
                if (this.username.length <=4){
                    console.log("username length incorrect");
                    this.username_length_incorrect = true;
                    }
                else {
                    this.username_length_incorrect = false;
                }
                if (this.password.length <6){
                    console.log("password length incorrect");
                    this.password_length_incorrect = true;
                    }
                else {
                    this.password_length_incorrect = false;
                    }
                return;
                }
            if (!this.emailregex(this.email)){
                return;
            }
            this.loading=true;
            console.log("DEBUG : root-signup-block submitted")
            fetch(url_api_validate,{method:'GET',headers:{'Content-Type':'application/json','username':this.username,'email':this.email},
            //body:JSON.stringify({'username':this.username,'email':this.email})
        })
            .then((response)=>{
                if (!response.ok) {
                    console.log("Response not ok");
                }
                return response.json();
            }).then((data)=>{
                console.log("Got data",data);
                if (data['username_in_use']){
                    this.username_in_use = true;
                    console.log("DEBUG : username in use")
                }
                else{
                    this.username_in_use = false;
                }
                if (data['email_in_use']){
                    this.email_in_use = true;
                    console.log("DEBUG : email in use")
                }
                else{
                    this.email_in_use = false;
                }

                if (!data['username_in_use'] && !data['email_in_use']){
                    fetch(url_api_validate,{method:'POST',headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({'username':this.username,'email':this.email,'password':this.password,'context':'SIGNIN'})}).then((response) => {
                  //return response.text();
                  if (!response.ok) {
                    console.log("Response not ok");
                }
                return response.json();
                
              })
              .then((data)=>{
                console.log("Got data",data);
                if (data['success']){
                    console.log("DEBUG : logging in")
                    console.log(data['auth-token'])
                    this.setCookie('auth-token',data['auth-token'],6)
                    window.location.href = url_dashboard;
                }
                else{
                    console.log("unable to login")
                }})
                }
            })
            .catch((error)=>{
                console.log("Caught error",error)
            });
            this.loading=false;
        },
        setCookie: function(cname, cvalue, exhours) {
            const d = new Date();
            d.setTime(d.getTime() + (exhours*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          },
    },
})
// SIGNUP COMPONENT END

// LOGIN COMPONENT START
const login = Vue.component('login',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="root-signup-block">
        <div v-if="loading">
            <img stryle="" src="static/img/loader3.gif" alt="loading" width="100" height="100">
        </div>
        <div v-else>

            <div class="mb-3 mb-3-custom">
                <label for="login-form-input-name" class="form-label login-form-label">Username</label>
                <input v-model="username" type="text" class="form-control login-form-input" id="login-form-input-name" placeholder="Username (> 4 characters)">
            </div>

            <div class="mb-3 mb-3-custom">
                <label for="login-form-input-password" class="form-label login-form-label">Password</label>
                <input v-model="password" type="password" class="form-control login-form-input" id="login-form-input-password" placeholder="Password (> 5 characters)">
            </div>

            <!--
            <p class="root-label1">Username</p>
            <input type="text" class="root-input1" v-model="username">
            <p class="root-label1">password</p>
            <input type="password" class="root-input1" v-model="password">
            -->
            </br class="line">
            <button class="btn btn-light root-btn-submit1" @click=submit()>Log in</button>
            </br class="line">
            <router-link to="/signup">
                <button class="btn btn-light root-btn-submit1">Sign up</button>
            </router-link>
            <p v-if="somethingwrong">Unable to register. Something went wrong :(</p>
            <p v-if= "user_not_exists || password_incorrect || username_length_incorrect || password_length_incorrect">Please fix the following errors</p>
            <p v-if="user_not_exists">User not found</p>
            <p v-if="password_incorrect">Password Wrong</p>
            <p v-if="username_length_incorrect">Username length must be > 4</p>
            <p v-if="password_length_incorrect">Password length must be > 5</p>
        </div>
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:false,
        somethingwrong:false,
        password_incorrect:false,
        user_not_exists:false,
        username_length_incorrect: false,
        password_length_incorrect: false,
        username:'',
        password:''
        }
    },

    // COMPONENT METHODS
    methods:{
        // FUNCTION SUBMIT
        submit:function(){
            const url_api_login = 'http://'+window.location.host+'/api-login';
            const url_dashboard = 'http://'+window.location.host+'/dashboard';
            if (this.username.length<5 || this.password.length<6){
                if (this.username.length <=4){
                    console.log("username length incorrect");
                    this.username_length_incorrect = true;
                    }
                else {
                    this.username_length_incorrect = false;
                }
                if (this.password.length <6){
                    console.log("password length incorrect");
                    this.password_length_incorrect = true;
                    }
                else {
                    this.passwordl_ength_incorrect = false;
                    }
                return;
                }
            this.loading=true;
            console.log("DEBUG : root-login-block submitted")
            fetch(url_api_login,{method:'GET',headers:{'Content-Type':'application/json','username':this.username,"password":this.password},
            //body:JSON.stringify({'username':this.username,"password":this.password})
        })
            .then((response)=>{
                if (!response.ok) {
                    console.log("Response not ok");
                }
                return response.json();
            }).then((data)=>{
                console.log("Got data",data);
                if (!data['user_exists']){
                    this.user_not_exists = true;
                    console.log("DEBUG : user does not exist")
                }
                if (!data['password_correct']){
                    this.password_incorrect = true;
                    console.log("DEBUG : password incorrect")
                }

                if (data['user_exists'] && data['password_correct']){
                    fetch(url_api_login,{method:'POST',headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({'username':this.username,'password':this.password,'context':'LOGIN'})}).then((response) => {
                  //return response.text();
                  if (!response.ok) {
                    console.log("Response not ok");
                }
                return response.json();
              })
              .then((data)=>{
                console.log("Got data",data);
                if (data['success']){
                    console.log("DEBUG : logging in")
                    console.log(data['auth-token'])
                    this.setCookie('auth-token',data['auth-token'],6)
                    window.location.href = url_dashboard;
                }
                else{
                    console.log("unable to login")
                }})
                }
            })
            .catch((error)=>{
                console.log("Caught error",error)
            });
            this.loading=false;
        },
        setCookie: function(cname, cvalue, exhours) {
            const d = new Date();
            d.setTime(d.getTime() + (exhours*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          },
        getCookie:function(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return null;
          }
    },
})
// LOGIN COMPONENT END




const routes = [
    {
        path:'/',
        component:start,
    },
    {
        path:'/signup',
        component:signup,
    },

    {
        path:'/login',
        component:login,
    },

    {
        path:'/*',
        component:start,
    },
]

const router = new VueRouter({
    routes:routes,
})






const app = new Vue({
    delimiters:["{[","]}"],
    el:'#app',
    router:router,
    data:{
        message:"loaded by vue"
    }
})
