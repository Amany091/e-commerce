async function getProducts() {
  let data = await fetch("https://ecommerce.routemisr.com/api/v1/products");
  let res = await data.json();

  displayProducts(res.data);

  // show details of product when clicking on its img
  document
    .querySelectorAll("#containerProducts .product img")
    .forEach((product) => {
      product.addEventListener("click", (e) => {
        let index = e.target.closest(".product").getAttribute("data-index");
        saveDetailsToLocalStorage(res.data[index]); // get the object by its index and save it to local storage
        window.location.href = "./details.html";
      });
    });
}
getProducts();

// show api
function displayProducts(products) {
  let container = "";
  products.forEach((product, index) => {
    container += `
      <div class="col-md-4 product" data-index=${index}>
        <div class="item">
          <img src="${product.imageCover}" class="w-100">
          <p class="text-main">${product.category.name}</p>
          <h5>${product.slug.split("-").slice(0, 3).join(" ")}</h5>
          <p>${Math.round(product.price)} EGP</p>
          <div class="icons">
            <i class="fa-solid fa-heart heart-icon" onclick="addToWish('${
              product._id
            }', this)"></i>
            <i class="fa-solid fa-cart-shopping" id="cardColor" onclick="addToCart('${
              product._id
            }')"></i>
          </div>
        </div>
      </div>`;
  });

  document.getElementById("containerProducts").innerHTML = container;
}
function saveDetailsToLocalStorage(product) {
  localStorage.setItem("details", JSON.stringify(product));
}
function scrollToProducts() {
  document
    .getElementById("productsSection")
    .scrollIntoView({ behavior: "smooth" });
}
// get the number of products that are saved to local storage
function countCarts() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelector(".carts").innerText = cart.length;
}
//------------------brands-------------------
async function getBrands() {
  let data = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
  let res = await data.json();

  displayBrands(res.data);
}
getBrands();

// show api
function displayBrands(products) {
  let container = "";
  products.forEach((brand) => {
    container += `
      <div class="col-md-3">
                <div class="card">
                  <img src=${brand.image} class="img-fluid" alt="" />
                  <h4 class="text-center text-main">${brand.name}</h4>
                </div>
              </div>
      `;
  });

  document.getElementById("brands-container").innerHTML = container;
}
//------------------category-------------------
async function getCategory() {
  let data = await fetch("https://ecommerce.routemisr.com/api/v1/categories");
  let res = await data.json();

  displayCategory(res.data);
}
getCategory();

// show api
function displayCategory(products) {
  let container = "";
  products.forEach((category) => {
    container += `
      <div  class="col-md-4">
                <div class="card">
               <div class="card-img">
               <img
                  src=${category.image}
                  class="cat img-fluid w-100"
                  alt=""
                />
               </div>
                <div class="card-body"><h5 class="text-center text-main">${category.name}</h5></div>
               </div>
              </div>
      `;
  });

  document.getElementById("category-container").innerHTML = container;
}
// -----------------Cart---------------------
async function addToCart(productId) {
  if (!isLoggedIn()) {
    window.alert("Please log in to add products to the cart.");
    return;
  }

  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const product = await response.json();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(product.data);
    // إضافة المنتج إلى السلة
    cart.push(product.data);
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("تمت إضافة المنتج إلى السلة:", product.data);
    window.alert("Product added successfully to Cart");
    countCarts();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function isLoggedIn() {
  return !!localStorage.getItem("userName");
}

function displayCart() {
  try {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
      cartContainer.innerHTML = `<p class='text-center mt-5 text-main'>Your Cart is empty .. <a href='index.html'
            class='p-1 text-white bg-main'>continue shopping</a>`;
      return;
    }
    let totalPrice = 0;
    cart.forEach((product, index) => {
      totalPrice += Math.round(product.price);
      const productElement = document.createElement("div");
      productElement.className = "cart-product";
      productElement.innerHTML = `  <div
                  class="row py-3 align-items-center border-bottom g-4">
                  <div class="col-md-9">
                    <div class="row align-items-center">
                      <div class="col-2">
                        <img
                          src=${product.imageCover}
                          alt="cart-product"
                          class="w-100 object-fit-cover"
                        />
                      </div>
                      <div class="col-10">
                        <p class="fw-bold">
                          ${product.title.split(" ").slice(0, 2).join(" ")}
                        </p>
                        <p class="text-main fw-bold">
                          Price : ${Math.round(product.price)} EGP
                        </p>
                        <button class="btn btn-outline-danger " onclick='removeFromCart(${index})'>
                          <i class="fa-solid fa-trash fa-lg"></i> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>`;
      cartContainer.appendChild(productElement);
    });
    document.querySelector(".summary p span").innerText = `${totalPrice} EGP`;
  } catch (error) {
    // console.error(error);
  }
}
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  countCarts();
}
window.addEventListener("DOMContentLoaded", () => {
  displayCart();
  countCarts();
  getDetails();
});
function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
  countCarts();
}

// --------------------------- signup-login -------------------------------------------------

var signinemail = document.getElementById("signInEmail");
var signinpassword = document.getElementById("signInPassword");
var signupname = document.getElementById("signUpName");
var signupemail = document.getElementById("signUpEmail");
var signuppassword = document.getElementById("signUpPassword");

//Email should have at least a char or digit and end with @gmail.com
var exmailRegex =
  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//Password should have capital and small chars, digits and sympols
var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;

// Chech if the user has an account or not
var signUpArray = [];
if (localStorage.getItem("usersInfo") != null) {
  signUpArray = JSON.parse(localStorage["usersInfo"]);
}

//check if any input is empty or not
function isSignUpEmpty() {
  if (
    signupemail.value == "" ||
    signuppassword.value == "" ||
    signupname.value == ""
  ) {
    return false;
  }
  return true;
}

function isEmailExist(emailToCheck) {
  for (var i = 0; i < signUpArray.length; i++) {
    if (signUpArray[i].email.toLowerCase() == emailToCheck.toLowerCase()) {
      document.querySelector(".exist").classList.replace("d-none", "d-block");
      return true;
    }
  }
  return false;
}

function signUp() {
  if (isSignUpEmpty() == false) {
    document.querySelector(".wrong").classList.replace("d-none", "d-block");
  } else {
    if (
      passwordRegex.test(signuppassword.value) == false ||
      exmailRegex.test(signupemail.value) == false
    ) {
      if (passwordRegex.test(signuppassword.value) == false) {
        document
          .querySelector(".validatePass")
          .classList.replace("d-none", "d-block");
      }
      if (exmailRegex.test(signupemail.value) == false) {
        document
          .querySelector(".validateEmail")
          .classList.replace("d-none", "d-block");
      }
    } else {
      var singUpData = {
        name: signupname.value,
        email: signupemail.value,
        password: signuppassword.value,
      };
      if (isEmailExist(singUpData.email)) {
        signupname.value = "";
        signupemail.value = "";
        signuppassword.value = "";
      } else {
        signUpArray.push(singUpData);
        localStorage.setItem("usersInfo", JSON.stringify(signUpArray));
        document
          .querySelector(".passed")
          .classList.replace("d-none", "d-block");
        localStorage.setItem("userName", singUpData.name);
        window.location.href = "login.html";
      }
    }
  }
}

function isLoginEmpty() {
  if (signinemail.value == "" || signinpassword.value == "") {
    return false;
  }
  return true;
}

function logIn() {
  if (isLoginEmpty() == false) {
    document.querySelector(".wrong").classList.replace("d-none", "d-block");
  } else {
    var password = signinpassword.value;
    var email = signinemail.value;
    for (var i = 0; i < signUpArray.length; i++) {
      if (
        password.toLowerCase() == signUpArray[i].password.toLowerCase() &&
        email.toLowerCase() == signUpArray[i].email.toLowerCase()
      ) {
        localStorage.setItem("userName", signUpArray[i].name);
        window.location.href = "index.html";
        return;
      }
    }
    document
      .querySelector(".wrongLogin")
      .classList.replace("d-none", "d-block");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userBtn = document.querySelector(".user");
  const wishlistShow = document.querySelector(".showWish");
  const cartShow = document.querySelector(".showCart");
  const cartShowI = document.querySelector(".showCartI");

  function updateButtons() {
    const userName = localStorage.getItem("userName");

    if (userName) {
      if (loginBtn) loginBtn.classList.add("d-none");
      if (registerBtn) registerBtn.classList.add("d-none");
      if (logoutBtn) logoutBtn.classList.remove("d-none");
      if (userBtn) userBtn.classList.remove("d-none");
      if (wishlistShow) wishlistShow.classList.remove("d-none");
      if (cartShow) cartShow.classList.remove("d-none");
      if (cartShowI) cartShowI.classList.remove("d-none");
    } else {
      if (loginBtn) loginBtn.classList.remove("d-none");
      if (registerBtn) registerBtn.classList.remove("d-none");
      if (logoutBtn) logoutBtn.classList.add("d-none");
      if (userBtn) userBtn.classList.add("d-none");
      if (wishlistShow) wishlistShow.classList.add("d-none");
      if (cartShow) cartShow.classList.add("d-none");
      if (cartShowI) cartShowI.classList.add("d-none");
    }
  }

  updateButtons();
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("userName");
  window.location.href = "login.html";
});
//---------------nav active---------------
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  // Get the current URL path
  const currentPath = window.location.pathname.split("/").pop();

  // Loop through nav links to find the one that matches the current URL path
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// --------------------- WISHLIST -------------------------------------

// async function addToWish(productId, heartIcon) {
//   try {
//     const response = await fetch(
//       `https://ecommerce.routemisr.com/api/v1/products/${productId}`
//     );
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const product = await response.json();
//     let wish = JSON.parse(localStorage.getItem("wish")) || [];

//     // Check if the product is already in the wishlist
//     if (wish.some((item) => item._id === product.data._id)) {
//       window.alert("Product is already in the wishlist");
//       return;
//     }

//     wish.push(product.data);
//     localStorage.setItem("wish", JSON.stringify(wish));

//     // Change the heart icon color
//     heartIcon.classList.add("added-to-wishlist");

//     console.log("تمت إضافة المنتج إلى السلة:", product.data);
//   } catch (error) {
//     console.error("كانت هناك مشكلة في عملية الجلب:", error);
//   }
// }
async function addToWish(productId, heartIcon) {
  if (!isLoggedIn()) {
    window.alert("Please log in to add products to the wishlist.");
    return;
  }

  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const product = await response.json();
    let wish = JSON.parse(localStorage.getItem("wish")) || [];

    // تحقق مما إذا كان المنتج موجودًا بالفعل في القائمة
    if (wish.some((item) => item._id === product.data._id)) {
      window.alert("Product is already in the wishlist");
      return;
    }

    wish.push(product.data);
    localStorage.setItem("wish", JSON.stringify(wish));

    heartIcon.classList.add("added-to-wishlist");
    console.log("تمت إضافة المنتج إلى قائمة الأمنيات:", product.data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function displayWish() {
  try {
    let wish = JSON.parse(localStorage.getItem("wish")) || [];
    const wishContainer = document.getElementById("wish-container");
    wishContainer.innerHTML = "";

    if (wish.length === 0) {
      wishContainer.innerHTML = `<p class='text-center mt-5 text-main'>Your wishlist is empty .. <a href='index.html'
            class='p-1 text-white bg-main'>continue shopping</a> to like your products</p>`;
      return;
    }

    wish.forEach((product, index) => {
      const productElement = document.createElement("div");
      productElement.className = "wish-product";
      productElement.innerHTML = `
        <div class="row py-3 align-items-center border-bottom g-4">
          <div class="col-md-9">
            <div class="row align-items-center">
              <div class="col-2">
                <img
                  src=${product.imageCover}
                  alt="cart-product"
                  class="w-100 object-fit-cover"
                />
              </div>
              <div class="col-10">
                <p class="fw-bold">
                  ${product.title.split(" ").slice(0, 2).join(" ")}
                </p>
                <p class="text-main fw-bold">
                  Price : ${Math.round(product.price)} EGP
                </p>
                <button class="btn btn-outline-danger" onclick='removeFromWish(${index})'>
                  <i class="fa-solid fa-trash fa-lg"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </div>`;
      wishContainer.appendChild(productElement);
    });
  } catch (error) {
    console.error(error);
  }
}

function removeFromWish(index) {
  let wish = JSON.parse(localStorage.getItem("wish")) || [];
  wish.splice(index, 1);
  localStorage.setItem("wish", JSON.stringify(wish));
  displayWish();
}

function updateHeartIcons() {
  const wish = JSON.parse(localStorage.getItem("wish")) || [];
  const heartIcons = document.querySelectorAll(".heart-icon"); // Assuming heart icons have this class

  heartIcons.forEach((icon) => {
    const productId = icon.dataset.productId; // Assuming heart icons have data-product-id attribute
    if (wish.some((item) => item._id === productId)) {
      icon.classList.add("added-to-wishlist");
    } else {
      icon.classList.remove("added-to-wishlist");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  displayWish();
  updateHeartIcons();
});

// ------------details-------
let product = JSON.parse(localStorage.getItem("details")) || {};

function getDetails() {
  let imagesHtml = product.images
    .map(
      (image) => `<img src="${image}" alt="${product.slug}" class="mx-1 my-1">`
    )
    .join("");

  let detailsContainer = `
    <div class="container p-4 shadow">
      <div class="row">
        <div class="product-info col-lg-4 col-md-12 col-sm-12">
          <div class="product-image">
            <img src="${product.imageCover}" alt="${product.slug}" class="w-100 mb-1 rounded-start">
          </div>
        </div>
        <div class="info col-lg-4 col-md-2 col-sm-12 d-flex py-5 flex-column">
          <h3>${product.slug} Details</h3>
          <p class="lead small">${product.description}</p>
          <h4 class="price larger fw-bold">$${product.price}</h4>
          <div class="review d-flex align-items-baseline">
            <p class="fw-bold small">Review: </p>
            <i class="fa">&#xf005</i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <p class="fw-bold small">${product.ratingsAverage}</p>
          </div>
          <div class="images d-flex flex-wrap my-4">
            ${imagesHtml}
          </div>
          <button type="button" class="btn rounded-pell bg-main text-white" onclick="addToCart('${product._id}')">Add To Cart</button>
        </div>
      </div>
    </div>
  `;

  document.querySelector(".details").innerHTML = detailsContainer;

  // عرض صور المنتجات المرتبطة عند النقر عليها
  document.querySelectorAll(".images img").forEach((image) => {
    image.addEventListener("click", (e) => {
      let src = e.target.src;
      document.querySelector(".product-image img").src = src;
    });
  });
}
