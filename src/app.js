const express = require("express");
const app = express();
const morgan = require("morgan");
const validateZip = require("./middleware/validateZip");
const getZoos = require("./utils/getZoos");


app.use(morgan("dev"));
app.get("/zoos/all", (req, res, next) =>{
    const {admin}  = req.query;
    const zoos = getZoos();
    const content = admin === "true" ? `All zoos: ${zoos.join("; ")}` : "You do not have access to that route.";
    res.send(content);
    }
)

app.get("/zoos/:zip", validateZip, (req, res, next) =>{
    const { zip } = req.params;
    const content = getZoos(zip);
    if (content.length === 0){
        next(`${zip} has no zoos.`)
    } else{
        res.send(`${zip} zoos: ${content.join("; ")}`)
    }
})


app.get("/check/:zip", validateZip, (req, res, next) =>{
    const { zip } = req.params;
    const content = getZoos(zip);
    if (!content){
        res.send(`${zip} does not exist in our records.`)
    } else{
        res.send(`${zip} exists in our records.`)
    }
});

app.use((req, res, next) => {
    next('That route could not be found!');
  });
app.use((err, req, res, next) =>{
    res.send(err);
})

module.exports = app;