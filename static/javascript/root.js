// DEBUG
console.log("DEBUG : loaded root.js");


// COMPONENTS

// SIGNUP-COMPONENT
Vue.component('signup',{

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
            <button class="root-btn-submit1" @click=submit()>Submit</button>
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











const app = new Vue({
    delimiters:["{[","]}"],
    el:'#app',
    data:{
        message:"loaded by vue"
    }
})
