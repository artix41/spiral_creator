var mongoose = require( 'mongoose' );

var dbURI = 'mongodb://localhost:27017/spiral_creator';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var userSchema = new mongoose.Schema({
    pseudo: {type: String, unique:true},
    password: String
});

var galaxySchema = new mongoose.Schema({
    name: {type:String, unique:true},
    image: String,
    description: String,
    constellation: String,
    distance: Number,
    mass: Number,
    dimension: Number,
    otherName: {type: String, default:'none'},
    type: {type:String, default:'spiral'},
    hubbleSequence: {type:String, default:'Sa'}
});

mongoose.model("User", userSchema);
mongoose.model("Galaxy", galaxySchema);
