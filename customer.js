// This file will contain the queries to the customer table
const database = require("./database");
const express = require("express");

// Allows us to define a mapping from the URI to a function
router = express.Router();

// can be used to define a GET API.   URI -> CB function.
router.get("/orders/topthree", (request, response) => {
  database.connection.all("select s.id, i.price*s.quantity as purchasevalue from shop_order s inner join item i on s.itemID = i.id order by purchasevalue desc limit 3", (errors, results) => {
    if (errors) {
      response.status(500).send("Some error occurred");
    } else {
      response.status(200).send(results);
    }
  });
});
//Note: use query instead of all for MySQL - database.connection.query("select * from customer"

// defines an API which takes id in the request and return the record in response
router.get("/order/customer", (request, response) => {
  database.connection.all(
    `select c.name, i.name, s.quantity, s.shipping_date from shop_order s left join customer c on c.email = s.custEmail left join item i on i.id = s.itemID where c.email = '${request.query.cemail}'`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send(results);
      }
    }
  );
});

// a POST API to store the record received in the request
router.post("/order/add", (request, response) => {
  database.connection.all(
    `insert into shop_order values ('${request.body.id}','${request.body.cemail}','${request.body.itemid}','${request.body.qty}','${request.body.address}','${request.body.odate}','${request.body.sdate}')`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send("Record saved successfully!");
      }
    }
  );
});

router.get("/customer/checkandadd", (request, response) => {
  database.connection.all(
    `insert into customer SELECT '${request.query.cemail}', '${request.query.cname}' WHERE NOT EXISTS (SELECT * FROM customer where email = '${request.query.cemail}')`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send("Checked and added successfully!");
      }
    }
  );
});

// POST + PUT = Body, GET + DELETE = Query
router.put("/order/updateaddress", (request, response) => {
  database.connection.all(
    `update shop_order set address = ${request.query.address} where id = ${request.query.id}`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send("Record updated successfully!");
      }
    }
  );
});

router.delete("/order/delete", (request, response) => {
  database.connection.all(
    `delete from shop_order where id = '${request.body.id}'`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send("Record deleted successfully!");
      }
    }
  );
});

module.exports = {
  router,
};
