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
            <button class="root-btn-submit1">Sign Up</button>
        </router-link>
        <router-link to="/login">
            <button class="root-btn-submit1">Log In</button>
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
            <p class="root-label1">Username</p>
            <input type="text" class="root-input1" v-model="username">
            <p class="root-label1">Email</p>
            <input type="text" class="root-input1" v-model="email">
            <p class="root-label1">password</p>
            <input type="password" class="root-input1" v-model="password">
            </br class="line">
            <button class="root-btn-submit1" @click=submit()>Sign Up</button>
            <router-link to="/login">
                <button class="root-btn-submit1">Log In</button>
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
            fetch("http://localhost:5000/api-validate",{method:'POST',headers:{'Content-Type':'application/json'},
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
            <p class="root-label1">Username</p>
            <input type="text" class="root-input1" v-model="username">
            <p class="root-label1">password</p>
            <input type="password" class="root-input1" v-model="password">
            </br class="line">
            <button class="root-btn-submit1" @click=submit()>Log in</button>
            <router-link to="/signup">
                <button class="root-btn-submit1">Sign up</button>
            </router-link>
            <p v-if="somethingwrong">Unable to register. Something went wrong :(</p>
            <p v-if= "user_not_exists || password_incorrect">Please fix the following errors</p>
            <p v-if="user_not_exists">User not found</p>
            <p v-if="password_incorrect">Password Wrong</p>
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
        username:'',
        password:''
        }
    },

    // COMPONENT METHODS
    methods:{
        // FUNCTION SUBMIT
        submit:function(){
            this.loading=true;
            console.log("DEBUG : root-signup-block submitted")
            fetch("http://localhost:5000/api-login",{method:'POST',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({'username':this.username,"password":this.password})})
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
                    fetch("http://localhost:5000/",{method:'POST',headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({'username':this.username,'password':this.password,'context':'LOGIN'})}).then((response) => {
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
    }
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
