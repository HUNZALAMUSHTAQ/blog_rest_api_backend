const Validator = require("fastest-validator")
const models = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signUp = async (req, res) => {
    const schema = {
        name: { type: "string", optional: false, max: "100" },
        password: { type: "string", optional: false, min: "4", max: "20" },
        email: { type: "email", optional: false }
    }
    const v = new Validator()
    const validationResponse = v.validate({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    }, schema)

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            error: validationResponse
        })
    }

    const password = req.body.password
    let saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    models.User.findOne({ where: { email: req.body.email } }).then(result => {

        if (result) {

            res.status(409).json({ message: "Email Already exists" })

        } else {

            // If user email not exists in the database then
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
            console.log(user)

            // Model Interface
            models.User.create(user).then(result => {
                res.status(201).json({
                    message: "User Created Succesfully"
                })
            }).catch(err => {
                res.status(500).json({
                    message: "Something Went Worng ",
                    error: err
                })
            })

        }
    })
        .catch(err => {
            res.status(500).json({ message: "Something Went Wrong ", error: err })
        })


}

const signIn = (req, res) => {

    const email = req.body.email
    const password = req.body.password
    console.log(email, password)

    const schema = {
        password: { type: "string", optional: false, min: "4", max: "20" },
        email: { type: "email", optional: false }
    }
    const v = new Validator()
    const validationResponse = v.validate({
        password: req.body.password,
        email: req.body.email
    }, schema)

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            error: validationResponse
        })
    }

    models.User.findOne({ where: { email: email } }).then(result => {
        if (result === null) {
            res.status(401).json({ message: "Invalid Credential Email" })
        } else {
            const user = result
            console.log(user)

            bcrypt.compare(password, user.password, (err, result) => {

                if (err) { throw err }
                if (result) {

                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                    }, 'secret', (err, token) => {
                        if (err) { throw err }
                        if (token) {

                            res.status(200).json({
                                message: "Auth Successfull",
                                token: token
                            })
                        }
                    })
                } else {
                    res.status(401).json({ message: "Invalid Credential Password" })
                }
            })

        }
    })

}

module.exports = {
    signUp: signUp,
    signIn: signIn

}