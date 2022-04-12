// DEBUG
console.log("DEBUG : loaded quiz.js");

// GLOBAL STORE
const store = new Vuex.Store({
    state:{
        number_of_questions:null,
        current_index:null,
        current_deck_being_quizzed_on:null,
        current_deck_name_being_quizzed_on:null,
        submissions:[],
        showquiz:false,
        showsubmit:false,
        showresult:false,
        correct:null,
        total:null,
        percentage:null
    }
});

// DECK COMPONENT START
const deck = Vue.component("deck",{
    // COMPONENT PROPS
    props:["deck","current_user", "index"],

    // COMPONENT DATA
    data:function(){
        return{
            deck_name:this.deck.name,
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
            store.state.current_deck_name_being_quizzed_on=this.deck.name;
            store.state.showquiz=true
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
        <br>
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
                reply = null;
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
            store.state.showquiz=false;
            store.state.showsubmit=true;
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



// CONFIRMATION COMPONENT START
const confirmation = Vue.component("confirmation",{
    // COMPONENT PROPS
    props:["current_user"],

    // COMPONENT DATA
    data:function(){
        return{
            url_api_quiz:'http://'+window.location.host+'/api-quiz',
        }
    },
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center table-view">
        <h4>You are about to submit the following response for {[ deck_name ]}</h4>
        <br>
        <br>
        <table>
            <tr>
                <th>Questsion</th>
                <th>Response</th>
            </tr>
            <tr v-for="(x,i) in submissions">
                <td>{[ i+1 ]}</td>
                <td v-if="x.reply==undefined">Not answered</td>
                <td v-else>{[ x.reply ]}</td>
            </tr>
        </table>
        <div class="card-body">
        <p>Please rate this deck (optional)</p>
            <div class="form-check custom-check-form">
                <input class="form-check-input custom-check" type="radio" value="Easy" name="flexRadioDefault" id="flexRadioDefault">
                <label class="form-check-label question-form-label" for="flexRadioDefault1">Easy</label>
            </div>

            <div class="form-check custom-check-form">
                <input class="form-check-input custom-check" type="radio" value="Medium" name="flexRadioDefault" id="flexRadioDefault">
                <label class="form-check-label question-form-label" for="flexRadioDefault1">Medium</label>
            </div>

            <div class="form-check custom-check-form">
                <input class="form-check-input custom-check" type="radio" value="Hard" name="flexRadioDefault" id="flexRadioDefault">
                <label class="form-check-label question-form-label" for="flexRadioDefault1">Hard</label>
            </div>
        <button class="btn btn-primary card-button-2" @click="submit()">Submit</button>
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{

        process:function(){
            let auth_token = this.getCookie('auth-token')
            flag = true;
            checks = document.getElementsByClassName("custom-check");
            //console.log(checks.length) // debug
            for (let i= 0;i<checks.length;i++){
                check = checks[i];
                if (check.checked){
                    flag = false;
                    rating = check.value
                }
            }
            if (flag){
                rating = null;
            }
            submission=store.state.submissions;
            deck_id=store.state.current_deck_being_quizzed_on

            // FETCH API POST TO QUIZ
            fetch(this.url_api_quiz,{method:'POST',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token},
            body:JSON.stringify({'deck_id':deck_id,'submission':submission,'rating':rating})})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                    alert("Something went wrong")
                }
            return response.json();
            })
            .then((data)=>{
                if (data['authenticated'] && data['success']){
                    console.log(data);
                    console.log("submission successful!");
                    console.log("correct : "+ data["correct"]);
                    console.log("total : "+ data["total"]);
                    store.state.correct=data["correct"];
                    store.state.total=data["total"];
                    store.state.percentage=data["percentage"];
                    store.state.showresult=true;
                    store.state.showsubmit=false;
                    store.state.showquiz=false;
                }
                else{
                    console.log(data)
                    alert("could not update score")
                    window.location.href = 'http://'+window.location.host + '/dashboard';
                }
            })
            .catch((error)=>{
                console.log(error);
            });

            // CLEANING UP
            console.log("rated : "+rating)
            var selected = document. querySelector('input[type=radio][name=flexRadioDefault]:checked');
            if (selected){
            selected. checked = false;
        }
        },

        submit:function(){
            this.process()
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
        submissions:function(){
            return store.state.submissions;
        },

        deck_name:function(){
        return store.state.current_deck_name_being_quizzed_on;
        }
    }
})




// RESULT COMPONENT START
const result = Vue.component("result",{
    // COMPONENT PROPS
    //props:["current_user"],

    // COMPONENT DATA
    data:function(){
        return{
            
        }
    },
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center table-view">
        <div class="card-body">
            <br>
            <br>
            <h4>You answered {[ correct ]} questions correctly out of {[ total ]}!</h4>
            <br>
            <br>
            <h4>Your score is {[ percentage ]}%</h4>
            <br>
            <br>
        <button class="btn btn-primary card-button-2" @click="submit()">Okay</button>
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{

        submit:function(){
            window.location.href = 'http://'+window.location.host + '/dashboard';
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
        correct:function(){
            return store.state.correct;
        },

        total:function(){
        return store.state.total;
        },

        percentage:function(){
            return store.state.percentage;
        }
    },

    destroyed:function(){
        store.state.number_of_questions=null,
        store.state.current_index=null,
        store.state.current_deck_being_quizzed_on=null,
        store.state.current_deck_name_being_quizzed_on=null,
        store.state.submissions=[],
        store.state.showquiz=false,
        store.state.showsubmit=false,
        store.state.showresult=false,
        store.state.correct=null,
        store.state.total=null,
        store.state.percentage=null
    }
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
        <div v-if="showquiz">
            <br>
            <question :questions="questions" :length="length"></question>
        </div>
        <div v-else-if="showsubmit">
            <confirmation :current_user="current_user"></confirmation>
        </div> 
        <div v-else-if="showresult">
            <result></result>
        </div> 
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

    computed:{
        showsubmit:function(){
            return store.state.showsubmit;
        },

        showquiz:function(){
            return store.state.showquiz;
        },

        showresult:function(){
            return store.state.showresult;
        }
    },

    destroyed:function(){
        store.state.current_deck_name_being_quizzed_on=null;
        store.state.current_deck_being_quizzed_on=null;
        store.state.submissions=[];
    }
})


const notfound = Vue.component('notfound',{
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
   
    // COMPONENT TEMPLATE
    template:`
    <div>
        <h1>404</h1>
    </div>
    `,
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
    
    {
        path:'/*',
        component:notfound,
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
