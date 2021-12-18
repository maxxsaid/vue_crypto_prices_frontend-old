const app = new Vue({
  el: "#app",
  data: {
    loggedin: false,
    JWT: "",
    loginUsername: "",
    loginPassword: "",
    createUsername: "",
    createPassword: "",
    devURL: "http://localhost:3000",
    prodURL: "https://qb-ms-ruby-rails-backend.herokuapp.com",
    user: null,
    token: null,
    coins: [],
    newCoin: "",
    updateCoin: "",
    editID: 0,
  },
  methods: {
    handleLogin: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = {
        username: this.loginUsername,
        password: this.loginPassword,
      };
      fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("error logging in");
          } else {
            this.user = data.user;
            this.token = data.token;
            this.loggedin = true;
            this.getCoins();
            this.loginPassword = "";
            this.loginUsername = "";
            window.sessionStorage.setItem("login", JSON.stringify(data));
          }
        });
    },
    handleLogout: function () {
      this.loggedin = false;
      this.user = null;
      this.token = null;
      window.sessionStorage.removeItem("login");
    },
    handleSignup: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = {
        username: this.createUsername,
        password: this.createPassword,
      };
      fetch(`${URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: user,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("sign up unsuccessul");
          } else {
            alert("sign up successful");
            this.createUsername = "";
            this.createPassword = "";
          }
        });
    },
    getCoins: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      fetch(`${URL}/coins`, {
        method: "get",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.coins = data;
        });
    },
    createCoin: function () {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const coin = { ticker: this.newCoin };

      fetch(`${URL}/coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${this.token}`,
        },
        body: JSON.stringify(coin),
      }).then((response) => {
        this.newCoin = "";
        this.getCoins();
      });
    },
    deleteCoin: function (event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;

      fetch(`${URL}/coins/${ID}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }).then((response) => {
        this.getCoins();
      });
    },
    editCoin: function (event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;
      const updated = { ticker: this.updateCoin };

      fetch(`${URL}/coins/${ID}`, {
        method: "PUT",
        headers: {
          Authorization: `bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      }).then((response) => {
        this.getCoins();
      });
    },
    editSelect: function (event) {
      this.editID = event.target.id;
      const theCoin = this.coins.find((coin) => {
        return coin.id == this.editID;
      });
      this.updateCoin = theCoin.ticker;
    },
  },
  created: function () {
    const getLogin = JSON.parse(window.sessionStorage.getItem("login"));
    if (getLogin) {
      this.user = getLogin.user;
      this.token = getLogin.token;
      this.loggedin = true;
      this.getCoins();
    }
  },
});
