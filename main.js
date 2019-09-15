Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">

      <div class="product-image">
        <img :src="image" >
      </div>

      <div class="product-info">
          <h1>{{ title }}</h1>
          <p v-if="inStock">In Stock</p>
          <p v-else>Out of Stock</p>
          <p>Shipping: {{ shipping }}</p>

          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>

          <div class="color-box"
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(index)">
          </div>

          <button v-on:click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }">Add to Cart</button>

          <button v-on:click="removeFromCart">Remove from Cart</button>

      </div>

      <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>Would recommend: {{ review.recommend }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>

      <product-review @review-submitted="addReview"></product-review>
    </div>
  `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      selectedVariant: 0,
      details: ["100% cotton", "modern colors", "cool logo"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./images/vmSocks-green-onWhite.jpg",
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./images/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0
        }
      ],
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit("remove-from-cart");
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    }
  }
});

Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name">
    </p>

    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
      <p>Would you recommend to a friend?</p>
      <label for="yesRecommend">Yes</label>
      <input type="radio" id="yesRecommend" name="recommend" value="yes" v-model="recommend">

      <label for="noRecommend">No</label>
      <input type="radio" id="noRecommend" name="recommend" value="no" v-model="recommend">
    </p>

    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>
      <input type="submit" value="Submit">
    </p>

  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      recommend: null,
      rating: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          recommend: this.recommend,
          rating: this.rating
        };
        this.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.recommend = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.review) this.errors.push("Recommendation response required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    }
  }
});

let app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: []
  },
  methods: {
    addItem(id) {
      this.cart.push(id);
    },
    removeItem() {
      this.cart.pop();
    }
  }
});
