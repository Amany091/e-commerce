let product = JSON.parse(localStorage.getItem("details")) || {}
function getDetails() {
    let detailsContainer = `
    <div class="container p-4 shadow">
    <div class="row">
    <div class="product-info col-lg-4 col-md-12 col-sm-12">
      <div class="product-image">
      <img src="${product.imageCover}" alt="${product.slug}" class="w-100 mb-1 rounded-start "  >
      </div>

    </div>
    <div class="info col-lg-4 col-md-2 col-sm-12 d-flex py-5 flex-column ">
    <h3 >${product.slug} Details</h3>
                  <p class="lead small  ">${product.description}</p>
                      <h4 class="price larger fw-bold">$${product.price}</h4>
                      <div class="review d-flex align-items-baseline ">
                          <p class="fw-bold small">Review: </p>
                          <i class="fa">&#xf005</i>
                          <i class="fa fa-star"></i>
                          <i class="fa fa-star"></i>
                          <i class="fa fa-star"></i>
                          <p class="fw-bold small">${product.ratingsAverage}</p>
                      </div>
                      <div class="images d-flex flex-wrap my-4">
                      ${
                        product.images.map(image => `<img src="${image}" alt="${product.slug}" class="mx-1 my-1">  ` )
                      }
                      </div>
                      <button type="button" class="btn rounded-pell border border-1 border-dark" onclick="addToCart('${product._id}')" >Add To Cart</button>
                  </div>
              </div>
          </div>
    
    `
    document.querySelector(".details").innerHTML = detailsContainer;

  // perview related products images
    document.querySelectorAll(".images img").forEach(image => {
        image.addEventListener("click", (e) => {
            let src = e.target.src
            document.querySelector(".product-image img").src = src

        })
    })

    
}

async function addToCart(productId) {
    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products/${productId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const product = await response.json();
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      console.log(product.data)
      // إضافة المنتج إلى السلة
      cart.push(product.data);
      localStorage.setItem("cart", JSON.stringify(cart));
  
      console.log("تمت إضافة المنتج إلى السلة:", product.data);
      window.alert("product added successfully to Cart");
    } catch (error) {
      console.error("كانت هناك مشكلة في عملية الجلب:", error);
    }
  }
  
  function countCarts() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.querySelector(".carts").innerText = cart.length
  }

  
window.addEventListener("DOMContentLoaded", () => {
  getDetails()
  countCarts()
})