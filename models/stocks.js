const mongoose = require("mongoose");

const commonRules ={
        type:String,
        required:true,
        trim:true,
        minlength:1    
}

var StockSchema = new mongoose.Schema({
    symbol:commonRules,
});



var Stock = mongoose.model('Stock', StockSchema);

module.exports = {Stock};

