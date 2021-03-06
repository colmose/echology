/**
 * Created by Margo on 24/08/15.
 */
module.exports = function(apiRoutes, app) {

    var User = require('./app/models/user.js');
    var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
    apiRoutes.post('/sendMail', function (req, res) {
        require('/www/echology/server/mail/sendMail.js')(req, res);
    })

    app.get('/admin', function(req,res){
        console.log('in admin route')
        res.render('signin.html');
    });

    app.get('/newUser', function(req, res) {

        // create a sample user
        var nick = new User({
            name: 'Jack Egerton',
            password: 'jackjack',
            admin: true
        });

        // save the sample user
        nick.save(function(err) {
            if (err) throw err;

            console.log('User saved successfully');
            res.json({ success: true });
        });
    });

    apiRoutes.post('/authenticate', function (req, res) {

        // find the user
        User.findOne({
            name: req.body.name
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });

// route middleware to verify a token
    apiRoutes.use(function (req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    apiRoutes.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            res.json(users);
        });
    });
}

