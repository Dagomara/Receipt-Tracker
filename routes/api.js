const express = require('express');
const router = express.Router();
const path = require('path');
const {Item, Company, Receipt, Spender} = require('../db/MongooseSchemas');
const cors = require('cors')
require('dotenv').config();
const clientRoot = process.env.URL_ROOT_CLIENT;
const serverRoot = process.env.URL_ROOT_SERVER;

const jwt = require('jsonwebtoken');
const authenticateToken = require('./authJwt').authenticateToken;

// CORS middlewares for /api
var allowlist = [clientRoot, serverRoot];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
        origin: true, // reflect (enable) the requested origin in the CORS response
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        optionsSuccessStatus: 200,
        credentials: true
    } 
  } else {
    corsOptions = {
        origin: false // disable CORS for this request
    }
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// Top-level API calls
router.get('/getSpender', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

router.patch('/editName', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

router.patch('/changePassword', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

router.get('/getCompanies', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT
  // out: companies

  await Company.find({}, 'name stats')
  .then( (comps, err) => {
    if (!err) {
      if (comps.length > 0)
        res.status(200).json({companies: comps});
      else {
        console.log("Issue getting companies.");
        throw "try reloading page!";
      }
    }
  }).catch((err) => {
    res.status(400).json({"error": err});
  });
});

router.get('/getCompany', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT, companyID
  // out: company
  let {companyID} = req.body;

  await Company.findById(companyID)
  .then( (company, err) => {
    if (!err) {
      res.status(200).json({company: company});
    }
  }).catch((err) => {
    res.status(400).json({"error": err});
  });
});

router.put('/addCompany', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT, companyName
  // out: success?
  let {companyName} = req.body;

  let newCompany = await Company.create({
    name: companyName, items: [], receipts: [], stats: {}
  })
  .catch((err) => {
    console.log("addCompany creation error!");
    res.status(400).json({"error": err, "success": false});
    return;
  });

  console.log("addCompany: Company.Create() done");
  res.status(200).json({success: true, newCompany: newCompany});
});

router.delete('/deleteCompany', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT, companyID
  // out: success?
  let {companyID} = req.body;

  await Company.findByIdAndDelete(companyID)
  .then(() => {
    res.status(200).json({success: true});
  }).catch((err) => {
    res.status(400).json({"error": err, "success": false});
  });
});

router.delete('/deleteCompanies', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT, companyIDs
  // out: success?
  let {companyIDs} = req.body;

  await companyIDs.forEach(async (id, i) => {
    await Company.findByIdAndDelete(id)
    .catch((err) => {
      // no errors are thrown for nonexistent ids, btw!
      console.log("deleteCompanies: error deleting ", id, "at position ", i);
      res.status(400).json({"error": err, "success": false});
    });
  });

  res.status(200).json({success: true});
});

router.patch('/editCompany', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT, companyID, newName
  // out: success?
  let {companyID, newName} = req.body;

  await Company.findByIdAndUpdate(companyID, {name: newName}).exec()
  .catch((err) => {
    console.log("editCompany: error editing ", id, "with newName: ", newName);
    res.status(400).json({"error": err, "success": false});
  });

  res.status(200).json({success: true});
});




// Company-level API calls
router.get('/getStats', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT, companyID
  // out: stats
  let {companyID} = req.body;

  await Company.findById(companyID, "name stats").exec()
  .then((comp, err) => {
    console.log(comp, err);
    if (!err) {
      res.status(200).json({name: comp.name, stats: comp.stats});
    }
  }).catch((err) => {
    console.log("getStats: error for ", id, ": ", err);
    res.status(400).json({"error": err});
  })

  
});

//getReceipt
router.get('/getReceipts', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

router.get('/addReceipt', cors(corsOptionsDelegate), async (req, res, next) => {
  // in: JWT, companyID, receipt, newItems
  // out: success? 
  let {companyID, receipt, newItems} = req.body;

  Company.findByIdAndUpdate(companyID, {$push: { receipts: newReceipt },
                                        $set: { items: newItems }}).exec()
  .then((results, err) => {
    console.log("results: ", results);
    console.log("err: ", err);
    if (!err) {
      res.status(200).json({success: true});
    }
  }).catch((err) => {
    res.status(400).json({error: err, success: false});
  });
  
});

router.get('/deleteReceipt', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

router.get('/editReceipt', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

//getItem
router.get('/getItems', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

router.get('/editItems', cors(corsOptionsDelegate), async (req, res, next) => {
  res.status(200).json({dummyText: true});
});

//deleteItem // if an autofill typo keeps coming up



module.exports = router;