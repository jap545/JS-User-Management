// Import express and create router object
const express = require("express");
const router = express.Router();

//import mongoose model
const Customer = require("../models/customer");

// Reusable function to check whether user is authenticated
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // continue processing request
  }
  res.redirect("/login"); // not authenticated
}

// Configure router object with request handlers
// GET handler for /Customers/
router.get("/", (req, res, next) => {
  // TODO: Retrieve all customers from DB
  //res.render("customers/index", { title: "User Management" });

  //Find all customers and show

  Customer.find((err, customers) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render("customers/index", {
            title: "User Management",
            dataset: customers,
            user: req.user
          });
    }
  });
});

// GET handler for /Customers/Add > shows empty form for users to fill in
router.get("/add", IsLoggedIn, (req, res, next) => {
  //res.render("customers/add", { title: "Add a New User" });
  Customer.find((err, customers) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render("customers/add", {
            title: "Add a new Customer",
            dataset: customers,
            user: req.user
          });
    }
  });
});

// POST handler for /Customers/Add > triggered when users click the 'Add Customer' button
router.post("/add", IsLoggedIn, (req, res, next) => {
    Customer.create(
        {
          name: req.body.name,
          tel: req.body.tel,
          email: req.body.email,
          details: req.body.details,
        },
        (err, newCustomer) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/customers"); // success redirect to customers page
          }
        }
      );
  });
  
// GET handler for Delete operations
// :_id is a placeholder for naming whatever is after the / in the path
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  // call remove method and pass id as a json object
  Customer.remove({ _id: req.params._id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/customers");
    }
  });
});

// GET handler for Edit operations
router.get("/edit/:_id", IsLoggedIn, (req, res, next) => {
  // Find the Customer by ID
  // Find available courses
  // Pass them to the view
  Customer.findById(req.params._id, (err, customer) => {
    if (err) {
      console.log(err);
    } else {
          res.render("customers/edit", {
            title: "Edit a User",
            customer: customer,
            user: req.user
          });
        }
    });
});

// POST handler for Edit operations
router.post("/edit/:_id", IsLoggedIn, (req, res, next) => {
  // find customer based on ID
  // try updating with form values
  // redirect to /Customers
  Customer.findOneAndUpdate(
    { _id: req.params._id },
    {
      name: req.body.name,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
    },
    (err, updatedCustomer) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/customers");
      }
    }
  );
});

//Export router object
module.exports = router;
