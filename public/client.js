'use strict';

// USER VALIDATION AND REGISTRATION

// Anchors and buttons for login and signup

$('.signup-button').click(event => {
    // event.preventDefault();
    console.log("go to sign up");
    signupForm();
});

$('.signup-anchor').click(event => {
    event.preventDefault();
    console.log("go to sign up");
    signupForm();
});

function signupForm() { 
    console.log("signupForm");
    $('.intro').hide();
    $('.signup-form').removeClass('hidden');
    if(!($('.login-form').hasClass('hidden'))) {
        $('.login-form').addClass('hidden');
    };
};

$('.login-button').click(event => {
    // event.preventDefault();
    console.log("go to login");
    loginForm();
});

$('.login-anchor').click(event => {
    event.preventDefault();
    console.log("go to login");
    loginForm();
});

function loginForm() {
    console.log("loginForm");
    $('.intro').hide();
    $('.login-form').removeClass('hidden');
    if(!($('.signup-form').hasClass('hidden'))) {
        $('.signup-form').addClass('hidden');
    }
};

// API CALLS TO USER ROUTER

// sign up API call to create user
$('.signup-form').submit(function(event) {
    event.preventDefault();
    console.log("signup form ran");
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const username = $('#username').val();
    const password = $('#password').val();
    const match = $('#match-password').val();


    //validate the input
    if (firstName == "") {
        alert('Please add a first name');
    } else if (lastName == "") {
        alert('Please add a last name');
    } else if (username == "") {
        alert('Please add an user name');
    } else if (password == "") {
        alert('Please add a password');
    } else if (match == "") {
        alert('Please confirm password');
    } else if (password != match) {
        alert('password and confirm password must match')
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const newUserObject = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            
        };
        console.log(newUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            //if call is successfull
            .done(function(result) {
                $('#loggedInUserName').val(result.username);
                $('.validation').addClass('hidden');
                $('.top-menu').removeClass('hidden');
                $('.search').removeClass('hidden');
                
            })
            //if the call is failing
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                const message = jqXHR.responseJSON.message;
                alert(message);
            });
    }
});

// login API call
$('.login-form').submit(function(event) {
    event.preventDefault();
    console.log("login form ran");

    const username = $('#login-username').val();
    const password = $('#login-password').val();
    // console.log(username);
    // console.log(password);

    if (username == "") {
        alert('Please enter username');
    } else if (password == "") {
        alert('Please enter password');
    } else {
        //create the payload object (what data we send to the api call)
        const userObject = {
            username: username,
            password: password
        };
        console.log(userObject);
        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(userObject),
                contentType: 'application/json'
            })
            //if call is successfull
            .done(function(result) {
                $('#loggedInUserName').val(result.username);
                console.log(result.username);
                $('.validation').addClass('hidden');
                $('.top-menu').removeClass('hidden');
                $('.search').removeClass('hidden');
            })
            // if the call is failing
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                const message = jqXHR.responseJSON.message;
                alert(message);
            });
    };
});

$('.category-name').on('change', event => {
    event.preventDefault();
    console.log("js-search-form ran");
    // capture values for category
    const category = $(event.currentTarget).val();
    // const category = $('.category-name').val();
    // const username = $('#loggedInUserName').val();
    console.log(category);
    
    $.ajax({
        type: 'GET',
        url: `/bestbuy/${category}`,
        dataType: 'json',
        contentType: 'application/json'
    })
    //if call is successfull
    .done(function(result) {
        console.log(result);
        displayProducts(result);
    })
    // if the call is failing
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
        
    });
})

function displayProducts(products) {
    console.log("displayProducts");
    $('.search').addClass('hidden');
    $('.results').removeClass('hidden');
    const long = products.results.length;
    const productString = [];
    for (let x=0; x<long; x++) {
      console.log(products.results[x].names.title);
      productString.push(
          `<article>
          <div class="picture">
              <img src="${products.results[x].images.standard}" alt="${products.results[x].names.title}" />
              <span>${products.results[x].rank}</span>
          </div>
          <h3>${products.results[x].names.title}</h3>
          <div class="item-description">
              <p><span class="tag">Regular Price:  </span>${products.results[x].prices.regular}</p>
              <p><span class="tag">Current Price:  </span> ${products.results[x].prices.current}</p>
              <p><span class="tag">Average Rating:  </span>${products.results[x].customerReviews.averageScore}</p>
              <p><span class="tag">Number of Reviews:   </span>${products.results[x].customerReviews.count}</p>
          </div>
          <a href="#" target="_blank">more info</a>
      </article>`
      )

    }
}

