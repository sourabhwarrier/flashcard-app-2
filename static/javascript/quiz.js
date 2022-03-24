// DEBUG
console.log("DEBUG : loaded quiz.js");

// GLOBAL STORE
const store = new Vuex.Store({
    state:{
        number_of_questions:null,
        current_index:null,
        current_deck_being_quizzed_on:null,
        submissions:[],
    }
});

// DECK COMPONENT START
const deck = Vue.component("deck",{
    // COMPONENT PROPS
    props:["deck","current_user", "index"],

    // COMPONENT DATA
    data:function(){
        return{
            deck_id:this.deck.deck_id,
            user_id:this.current_user.user_id,
        }
    },
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center card-custom">
        <div class="card-header">
        <br>
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ deck.name ]}</h5>
        <p class="card-text">{[ deck.description ]}</p>
        <p>{[ deck.number_of_cards ]} cards</p>
        <p>Created by {[ deck.owner ]}</p>
        <button class="btn btn-primary card-button-1" @click="startquiz()">Start quiz</button>
        </div>
        <div class="card-footer text-muted">
            Last reviewed : {[ deck.last_reviewed ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{

        startquiz:function(){
            store.state.current_deck_being_quizzed_on = this.deck_id,
            window.location.href = 'http://'+window.location.host + '/quiz#/active';
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
          },
    }
})



// QUESTION COMPONENT START
const question = Vue.component("question",{
    // COMPONENT PROPS
    props:['questions','length'],

    // COMPONENT DATA
    data:function(){
        return{
            index:0,
            position:1,
            //questions:this.questions,
            //length:this.length,            
        }
    },
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center card-custom">
        <div class="card-header">
        <p>Question {[ position ]}/{[ length ]}</p>
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ questions[index].question ]}</h5>
        <p class="card-text">{[ questions[index].hint ]}</p>
        <br>
        <div v-for="(option,i) in options" class="form-check custom-check-form">
            <input class="form-check-input custom-check" type="radio" :value="option" name="flexRadioDefault" id="flexRadioDefault">
            <label class="form-check-label question-form-label" for="flexRadioDefault1">{[ option ]}</label>
        </div>
        <button v-if="!completed" class="btn btn-primary card-button-1" @click="next()">Next</button>
        <button v-else class="btn btn-primary card-button-1" @click="finish()">Finish</button>
        </div>
        <div class="card-footer text-muted">
            Last reviewed : {[  ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{

        process:function(){
            flag = true;
            card_id = this.questions[this.index].card_id;
            checks = document.getElementsByClassName("custom-check");
            //console.log(checks.length) // debug
            for (let i= 0;i<checks.length;i++){
                check = checks[i];
                if (check.checked){
                    flag = false;
                    reply = check.value
                }
            }
            if (flag){
                reply = undefined;
            }
            console.log("responded : "+reply);
            console.log("card_id : "+card_id);
            store.state.submissions.push({'card_id':card_id,'reply':reply});
            var selected = document. querySelector('input[type=radio][name=flexRadioDefault]:checked');
            if (selected){
            selected. checked = false;
        }
        },

        //store.state.submissions[]

        next:function(){
            this.process();
            this.index++;
            this.position++;
            console.log("saved");
        },

        finish:function(){
            this.process();
            console.log(store.state.submissions[0]["reply"])
            console.log("finished");
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
          },
    },

    computed:{
        completed:function(){
            return this.position==this.length;
        },

        options:function(){
            return this.questions[this.index].options;
        },
    },
})


// DECKSVIEW COMPONENT START
const decksview = Vue.component('decksview',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
            <br>
            <deck v-for="(deck,i) in decks" :index="i" :deck="deck" :current_user="current_user"></deck>
        </div>    
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:true,
        current_user:{'username':undefined,'user_id':undefined},
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
        url_dashboard:'http://'+window.location.host+'/dashboard',
        url_api_quiz_loader:'http://'+window.location.host+'/api-quiz-loader',
        decks:[],
       }

    },

    // COMPONENT METHODS
    methods :{
        load_user:function (auth_token){
            fetch(this.url_api_whoami,{method:'GET',headers:{'Content-Type':'application/json','auth-token':auth_token},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    this.current_user['username'] = data["username"];
                    this.current_user['user_id'] = data["user_id"]
                    this.pupolate_decksview(auth_token);
                    this.console.log(data);
                }
                else {
                    this.current_user['username'] = undefined;
                    this.current_user['user_id'] = undefined;
                    window.location.href = 'http://'+window.location.host + '/';
                }
            })
            .catch((error)=>{
                console.log(error);
            });   
        },

        pupolate_decksview:function(auth_token){
            fetch(this.url_api_quiz_loader,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token,'purpose':'all'},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                console.log(this.decks);
                this.decks = data["decks"];
                this.loading=false;
            })
            .catch((error)=>{
                console.log(error);
            });
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
          },
    }, 

    // MOUNTED
    mounted:function(){
        let auth_token = this.getCookie('auth-token')
        if (auth_token != null){
            console.log('auth-token : '+auth_token)
            this.load_user(auth_token)
        }
        else{
            window.location.href = 'http://'+window.location.host + '/logout';
        }

        
    }
})



// QUIZINTERFACE COMPONENT START
const quizinterface = Vue.component('quizinterface',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
            <br>
            <question :questions="questions" :length="length"></question>
        </div>    
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:true,
        finished:false,
        current_user:{'username':undefined,'user_id':undefined},
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
        url_dashboard:'http://'+window.location.host+'/dashboard',
        url_api_quiz:'http://'+window.location.host+'/api-quiz',
        questions:undefined,
        deck_id:undefined,
        length:undefined,
       }

    },

    // COMPONENT METHODS
    methods :{
        load_user:function (auth_token){
            fetch(this.url_api_whoami,{method:'GET',headers:{'Content-Type':'application/json','auth-token':auth_token},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    this.current_user['username'] = data["username"];
                    this.current_user['user_id'] = data["user_id"]
                    this.load_questions(auth_token);
                    this.console.log(data);
                }
                else {
                    this.current_user['username'] = undefined;
                    this.current_user['user_id'] = undefined;
                    window.location.href = 'http://'+window.location.host + '/';
                }
            })
            .catch((error)=>{
                console.log(error);
            });   
        },

        load_questions:function(auth_token){
            fetch(this.url_api_quiz,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token,'deck_id':this.deck_id},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                console.log(data);
                this.questions = data['questions'];
                this.length=data['length']
                this.loading=false;
            })
            .catch((error)=>{
                console.log(error);
            });
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
          },
    }, 


    // MOUNTED
    mounted:function(){
        if (store.state.current_deck_being_quizzed_on){
            this.deck_id=store.state.current_deck_being_quizzed_on;
        }
        else{
            window.location.href = 'http://'+window.location.host + '/quiz';
        }

        let auth_token = this.getCookie('auth-token')
        if (auth_token != null){
            console.log('auth-token : '+auth_token)
            this.load_user(auth_token)
        }
        else{
            window.location.href = 'http://'+window.location.host + '/logout';
        }

        
    },

    destroyed:function(){
        store.state.current_deck_being_quizzed_on=null;
        store.state.submissions=[];
    }
})














// ROUTES
const routes = [
    {
        path:'/',
        component:decksview,
    },   
    
    {
        path:'/active',
        component:quizinterface,
    },   
]

// ROUTER
const router = new VueRouter({
    routes:routes,
})


const app = new Vue({
    delimiters:["{[","]}"],
    el:'#app',
    router:router,
    data:{
        userloaded:false,
        current_user:{'username':undefined,'uder_id':undefined},
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
    },
    methods:{
        load_user:function (auth_token){
            fetch(this.url_api_whoami,{method:'GET',headers:{'Content-Type':'application/json','auth-token':auth_token},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    this.current_user['username'] = data["username"];
                    this.current_user['user_id'] = data["user_id"];
                    this.userloaded=true;
                    this.console.log(data);
                }
                else {
                    this.current_user['username'] = undefined;
                    this.current_user['user_id'] = undefined;
                    window.location.href = 'http://'+window.location.host + '/';
                }
            })
            .catch((error)=>{
                console.log(error);
            });   
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
          },
    },

    created:function(){
        let auth_token = this.getCookie('auth-token')
        if (auth_token != null){
            console.log('auth-token : '+auth_token)
            this.load_user(auth_token)
        }
        else{
            window.location.href = 'http://'+window.location.host + '/logout';
        }
    },
})
