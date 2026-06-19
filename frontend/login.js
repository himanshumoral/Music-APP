const loginForm = document.querySelector('form')

loginForm.addEventListener('submit', async function(e){
     e.preventDefault();

     const username = document.querySelector('input[name="username"]').value;
     const password = document.querySelector('input[name="password"]').value;

     console.log(username, password);

     const response = await fetch('/api/auth/login',{
        method: 'POST',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
     })

     const result = await response.json();

     console.log(result);

     if(response.ok){
        localStorage.setItem('role', result.user.role);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'home.html';
     }
     else{
        alert(result.message);
     }
});