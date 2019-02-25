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

$('#demo').click(event => {
    // event.preventDefault();
    console.log("go to demo");

    const userObject = {
        username: "user",
        password: "pass123"
    };
    loginUser(userObject);
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
        loginUser(userObject);
    }
});        

function loginUser(creds) {
    console.log("loginUser ran with ", creds);
    $('.intro').addClass('hidden');
        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/auth/login',
                dataType: 'json',
                data: JSON.stringify(creds),
                contentType: 'application/json'
            })
            //if call is successfull
            .done(function(result) {
                $('#loggedInUserName').val(username);
                console.log(result, username);
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
}

// TOP NAVIGATION TRIGGERS

// new category trigger
$('#new-category').click(event=> {
    event.preventDefault();
    console.log("new-category");
    const username = $('#loggedInUserName').val();
    $('.back-img').removeClass('hidden');
    $('.search').removeClass('hidden');
    if (!$('.results').hasClass('hidden')) {
        $('.results').addClass('hidden');
    } else if (!$('.single-item').hasClass('hidden')) {
        $('.single-item').addClass('hidden');
    } else if (!$('.wish-list').hasClass('hidden')) {
        $('.wish-list').addClass('hidden');
    } else if (!$('.edit-item').hasClass('hidden')) {
        $('.edit-item').addClass('hidden');
    };
});

// wishlist trigger
$('#wishlist').click(event => {
    event.preventDefault();
    console.log("wishlist");
    const username = $('#loggedInUserName').val();
    if (!$('.back-img').hasClass('hidden')) {
        $('.back-img').addClass('hidden');
    } else if (!$('.results').hasClass('hidden')) {
        $('.results').addClass('hidden');
    } else if (!$('.single-item').hasClass('hidden')) {
        $('.single-item').addClass('hidden');
    } else if (!$('.search').hasClass('hidden')) {
        $('.search').addClass('hidden');
    } else if (!$('.edit-item').hasClass('hidden')) {
        $('.edit-item').addClass('hidden');
    };
    getWishList(username);
});

// logout trigger
$('#logout').click(event => {
    console.log("logout anchor clicked");
    event.preventDefault();
    $('#loggedInUserName').val("");
    location.reload();
});


// CALL EXTERNAL API

$('.category-name').on('change', event => {
    event.preventDefault();
    console.log("js-search-form ran");
    // capture values for category
    let category = $(event.currentTarget).val();
    if (category =="Category") {
        alert("Please select a valid category")
    };
    // const category = $('.category-name').val();
    // const username = $('#loggedInUserName').val();
    console.log(category);
    if (category !="Category") {
        $.ajax({
            type: 'GET',
            url: `/bestbuy/${category}`,
            dataType: 'json',
            contentType: 'application/json',
            
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
    }
})

// DISPLAY RESULTS OF SUCCESSFUL EXTERNAL API CALL

let productList = [];


function displayProducts(products) {
    console.log("displayProducts");
    $('.back-img').addClass('hidden');
    productList = products.results;
    console.log("productList", productList);
    
    const long = productList.length;

    const productString = [];
    for (let x=0; x<long; x++) {
        if (productList[x].images.standard==null) {
            productList[x].images.standard='./images/no-image.png'
        }
      productString.push(
          `<article>
          <div class="picture">
              <img src="${productList[x].images.standard}" alt="${productList[x].names.title}" />
              <span>${productList[x].rank}</span>
          </div>
          <h3>${productList[x].names.title}</h3>
          <div class="item-description">
              <p><span class="tag">Regular Price:  </span>${productList[x].prices.regular}</p>
              <p><span class="tag">Current Price:  </span> ${productList[x].prices.current}</p>
              <p><span class="tag">Average Rating:  </span>${productList[x].customerReviews.averageScore}</p>
              <p><span class="tag">Number of Reviews:   </span>${productList[x].customerReviews.count}</p>
          </div>
          <button class="item" index="${x}">more details</button>
      </article>`
      )
    };
    // console.log("productString", productString);
    $('.flex').html(productString);
    $('.results').removeClass('hidden');
}

// DISPLAY SINGLE ITEM FROM RESULTS ABOVE


// get index for item clicked
$('.flex').on('click', '.item', event => {
    console.log("item clicked");
    const itemIndex = $(event.currentTarget).attr('index');
    console.log("itemIndex", itemIndex);
    displaySingleItem(itemIndex);
});

function displaySingleItem(index) {
    console.log("displaySingleItem");
    $('.results').addClass('hidden');
    const singleItem = productList[index];
    console.log("singleItem", singleItem);

    const itemString= 
        `<h2>Item Details </h2>  
        <article class="single">
        
        <div class="picture">
        <img src="${singleItem.images.standard}" alt="${singleItem.names.title}" />
        </div>
        <h3>${singleItem.names.title}</h3>
        <div class="description">
            <p><span class="tag">Regular Price:  </span>${singleItem.prices.regular}</p>
            <p><span class="tag">Current Price:  </span> ${singleItem.prices.current}</p>
            <p><span class="tag">Average Rating:  </span>${singleItem.customerReviews.averageScore}</p>
            <p><span class="tag">Number of Reviews:   </span>${singleItem.customerReviews.count}</p>
            <p><span class="tag">Description:  </span>${singleItem.descriptions.short} </p>
        </div>
        <form action="" class="add-note">
            <fieldset>
                <label for="notes"><span class="tag">Note:</span> </label>
                <textarea id="notes" rows="15" cols="40"></textarea>
            </fieldset>
        </form>
        <ul>
            <a href="#" class="wishlist-button" index="${index}">
                <li>add to wishlist</li>
            </a>
            <a href="${singleItem.links.web}" target="_blank" class="purchase">
                <li>purchase</li>
            </a>
            <a href="#" class="results-list-button">
                <li>back to list</li>
            </a>
        </ul>
    </article>`
    ;
    
    $('.single-item').removeClass('hidden').html(itemString);
}

// WISHLIST API CALLS

// trigger listener to add wishlist item
$('.single-item').on('click', '.wishlist-button', event => {
    console.log("wishlist-button clicked");
    const itemIndex = $(event.currentTarget).attr('index');
    console.log("itemIndex", itemIndex);
    const note = $('.single-item').find('#notes').val();
    console.log("note", note);
    const wishListItem = productList[itemIndex];
    wishListItem.note = note;
    console.log(wishListItem);
    $('.single-item').addClass('hidden');
    addWishListItem(wishListItem);
});

// CREATE products API call
function addWishListItem(item) {
    console.log("addWishListItem", item);
    const image = item.images.standard;
    const name = item.names.title;
    const purchaseUrl = item.links.web;
    const regularPrice = item.prices.regular;
    const currentPrice = item.prices.current;
    const rating = item.customerReviews.averageScore;
    const reviewsCount = item.customerReviews.count;
    const description = item.descriptions.short;
    const notes = item.note;
    const loggedInUserName = $('#loggedInUserName').val();
    //create the payload object (what data we send to the api call)
    const wishlistObject = {
        image: image,
        name: name,
        purchaseUrl: purchaseUrl,
        regularPrice: regularPrice,
        currentPrice: currentPrice,
        rating: rating,
        reviewsCount: reviewsCount,
        description: description,
        notes: notes,
        loggedInUserName: loggedInUserName
    };
    console.log(wishlistObject);
    // make the api call using the payload above
    $.ajax({
            type: 'POST',
            url: '/products/create',
            dataType: 'json',
            data: JSON.stringify(wishlistObject),
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function(result) {
            console.log("result", result);
            getWishList(result.loggedInUserName);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('wishlist item failed to create');
        });
}

// // READ products API call

// make API call to database for products and send results to callback
// function to be displayed to client
function getWishList(username) {
    console.log("getWishList function ran")
    if ((username == "") || (username == undefined) || (username == null)) {
        username = $('#loggedInUserName').val();
    }
    console.log(username);
    //make the api call using the payload above
    $.ajax({
            type: 'GET',
            url: `/products/${username}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function(result) {
            console.log("result", result);
            displayWishlist(result);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayWishlist(item) {
    console.log("displayWishlist", item);
    const wishlistStringArray =[`<h2>Wish List</h2>`];
    
    if (item.products.length==0) {
        wishlistStringArray.push(`<p class="empty">Your wishlist is empty.</p>`);
    };
    
    $.each(item.products, function (itemkey, itemvalue) {
        wishlistStringArray.push (
            `<article>
                <div class="picture">
                <img src="${itemvalue.image}" alt="${itemvalue.name}" />
            </div>
            <h3>${itemvalue.name}</h3>
            <div class="description">
                <p><span class="tag">Regular Price:  </span>${itemvalue.regularPrice}</p>
                <p><span class="tag">Current Price:  </span>${itemvalue.currentPrice}</p>
                <p><span class="tag">Average Rating:  </span>${itemvalue.rating}</p>
                <p><span class="tag">Number of Reviews:   </span>${itemvalue.reviewsCount}</p>
                <p><span class="tag">Description:  </span> ${itemvalue.description}</p>
                <p class="note"><span class="tag">Note:  </span>${itemvalue.notes}</p>
            </div>
            
            <ul>
            <a href="#" class="edit-note" data="${itemvalue.id}"><li>edit note</li></a>
            <a href="${itemvalue.purchaseUrl}" target="_blank" class="purchase"><li>purchase</li></a>
            <a href="#" class="delete-item" data="${itemvalue.id}"><li>delete item</li></a>
            </ul>
            </article>`
        )
    });
    console.log("wishlistStringArray", wishlistStringArray);
    $('.wish-list').removeClass('hidden').html(wishlistStringArray);
}

// EDIT WISHLIST ITEM NOTE

// wishlist item edit trigger
$('.wish-list').on('click', '.edit-note', event => {
    event.preventDefault();
    console.log("edit-note clicked");
    const itemId = $(event.currentTarget).attr('data');
    console.log("id", itemId);
    editWishlistItem(itemId);
});

// API call to PUT

// fetch wishlist item for editing
function editWishlistItem(itemId) {
    console.log("editWishlistItem", itemId);
    $.ajax({
        type: 'GET',
        url: `/products/edit/${itemId}`,
        dataType: 'json',
        contentType: 'application/json'
    })
    .done(function(result) {
        console.log("result", result);
        displayEditNoteForm(result);
    })
    // if the call is failing
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
        
    });
};

// edit wishlist item form poplulated with current note
function displayEditNoteForm(data) {
    console.log("displayEditNoteForm function ran", data);
    $('.wish-list').addClass('hidden');

    $('.edit-item').removeClass('hidden').html(
        `<h2>Edit Note</h2>
        <article>
        <div class="picture">
        <img src="${data.image}" alt="${data.name}" />
    </div>
    <h3>${data.name}</h3>
    <div class="description">
        <p><span class="tag">Regular Price:  </span>${data.regularPrice}</p>
        <p><span class="tag">Current Price:  </span>${data.currentPrice}</p>
        <p><span class="tag">Average Rating:  </span>${data.rating}</p>
        <p><span class="tag">Number of Reviews:   </span>${data.reviewsCount}</p>
        <p><span class="tag">Description:  </span> ${data.description}</p>
        
    </div>
    
    <form class="edit-note-form">
    <fieldset>
        <label for="edit-note"><span class="tag">Note:</span> </label>
        <textarea id="edit-note" rows="15" cols="40" data="${data._id}">${data.notes}</textarea>
    </fieldset>
    <button role='button' type='submit' class='note-edit-btn'>Submit</button>
    <button role='button' type='cancel' >Cancel</button>
    </form>

   </article>`
    );
};

// listener for form to edit journey
$('.edit-item').on('submit', '.edit-note-form', function(event) {
    event.preventDefault();
    console.log("note-edit-btn has been pressed");
    const notes = $('#edit-note').val();
    const id = $('#edit-note').attr('data');
    console.log("here", notes, id);

    // create paylode object
    const editNoteObject = {
        notes: notes,
        id: id
    };
    console.log(editNoteObject);
    //make the api call using the payload above
    $.ajax({
            type: 'PUT',
            url: `/products/update/${id}`,
            dataType: 'json',
            data: JSON.stringify(editNoteObject),
            contentType: 'application/json'
        })
        // if the call is successful
        .done(function(result) {
            const username = $('#loggedInUserName').val();
            console.log(username);
            $('.edit-item').addClass('hidden');
            getWishList(username);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);

        });
});


// DELETE wishlist API CALL


// delete wishlist item listener

// wishlist item edit trigger
$('.wish-list').on('click', '.delete-item', event => {
    event.preventDefault();
    console.log("delete-item clicked");
    const itemId = $(event.currentTarget).attr('data');
    console.log("id", itemId);
    verifyDeletion(itemId);
});


function verifyDeletion(id) {
    let decision = confirm("Are you sure you want to delete this journey?");
    if (decision == true) {
        console.log("you pressed true");
        deleteWishlistItem(id);
        $('.album').empty();
    } else {
        console.log("You pressed Cancel!");
    }
}

// delete journey API call
function deleteWishlistItem(id) {
    console.log("deleteWishlistItem", id);
    //make the api call to delete specific item
    $.ajax({
            type: 'DELETE',
            url: `/products/${id}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        // if the call is successful
        .done(function(message) {
            const username = $('#loggedInUserName').val();
            console.log(username);
            getWishList(username);
        })
        // if the call is failing
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            
        });
}







