var current_user = undefined;
const url_api_whoami = 'http://'+window.location.host+'/api-whoami';
const url_dashboard = 'http://'+window.location.host+'/dashboard';

async function load_user(){
    await fetch(url_api_whoami,{method:'GET',headers:{'Content-Type':'application/json'},})
    .then((response)=>{
        if (!response.ok){
            console.log("Response not ok");
        }
        return response.json();
    })
    .then((data)=>{
        if (data["authenticated"]) {
            current_user = data["me"];
            console.log(data);
        }
        else {
            current_user = undefined;
            window.location.href = 'http://'+window.location.host + '/';
        }
    })
    .catch((error)=>{
        console.log(error);
    });
    console.log(current_user)   
}

load_user()


// START COMPONENT START
const start = Vue.component('deck',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`

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
})



