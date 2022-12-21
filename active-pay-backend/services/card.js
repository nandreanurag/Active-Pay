const Card = require('../model/card.js')
var crypto = require('crypto');
const Profile = require('../model/profile.js')
const Transaction = require('../model/transaction.js');
const { json } = require('body-parser');
const cypherKey = "mySecretKey";
const daysInMonth = (month, year) => {
    const temp =  new Date(year, month + 1, 0);
    return parseInt(temp.getDate());
}
function encrypt(text) {
    var cipher = crypto.createCipher('aes-256-cbc', cypherKey)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted; //94grt976c099df25794bf9ccb85bea72
}

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', cypherKey)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec; //myPlainText
}
const updateCoins = (initialCoins, amount) => {
    const today = new Date();
    const currentMonth = parseInt(today.getMonth());
    const currentYear = parseInt(today.getYear());
    const numberOfDays = daysInMonth(currentMonth, currentYear);
    const todayDate = parseInt(today.getDate());

    const daysRemaining = numberOfDays - todayDate;
    const slope = (0.05 / numberOfDays);
    const fraction = slope * daysRemaining;
    const coinsEarned = parseInt(fraction * parseInt(amount));
    const finalCoins = parseInt(initialCoins) + coinsEarned;
    //console.log(currentYear, currentMonth, numberOfDays, todayDate, daysRemaining, slope, fraction, coinsEarned, finalCoins);
    return finalCoins;
}
module.exports = {
    addCard: async (req, res) => {
        try {
            const hashedCardNumber = encrypt(req.body.cardNumber);
            // we have to check for all the cards
            const userCards = await Card.find({
                attributes: ['cardNumber', 'cardOwnerName', 'expiryMonth', 'expiryYear', 'id']
            })
                .catch((err) => {
                    res.statusCode = 500;
                    throw new Error(err);
                })
            // if there is not authCode in req
            // if (true) {
            for (const card of userCards) {
                // const currentCardNumber =await bcrypt.hash(card.cardNumber,10);
                // await bcrypt.compare(card.cardNumber, req.body.cardNumber)
                // if we found the same cardNumber
                // console.log(decrypt(card.cardNumber)+"   "+req.body.cardNumber)
                if (req.body.cardNumber === decrypt(card.cardNumber)) {
                    for (const profile of card.profile) {

                        // if the found card is added by the same user
                        if (req.user.id === profile._id) {
                            res.statusCode = 409;
                            throw new Error('Card is Already Added');
                        }
                    }

                    // if the found card is added by some other user
                    res.statusCode = 422;
                    throw new Error('You\'re are not authorised to add this card');
                }
            }

            // now we didn't encounter any card with user input card number, so here we assume the user is legit and we will add the card into db.
            const profileAssociated = await Profile.findOne({
                _id: req.user.id,
            }).catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })
            const newCard = new Card({
                cardOwnerName: req.body.cardOwnerName.toUpperCase(),
                cardNumber: hashedCardNumber,
                expiryMonth: req.body.expiryMonth,
                expiryYear: req.body.expiryYear,
                cvv: req.body.cvv,
                profile: profileAssociated
            })
            await newCard.save().catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })
            const updated_profile = []
            // console.log([...profileAssociated.card, newCard])
            await profileAssociated.update({
                _id: profileAssociated._id,
                card: [...profileAssociated.card, newCard]

            })
            res.status(200).send(newCard);
        }
        catch (err) {
            // err.statusCode=500
            throw new Error(err)
        }

    },
    getAllCards: async (req, res) => {
         console.log(req.user.id)
        // we have to get cards associated with the current user.
        const userCards = await Profile.find({
            _id: req.user.id // getting the profile associated with the currentLoggedIn user
            // getting the card associated with the currentProfile
        }).catch((err) => {
            res.statusCode = 500;
            throw new Error(err);
        })
        console.log(userCards)
        // let data = [{"id":"1adbeaaf-700a-4410-89ac-e72cf8dda280","cardOwnerName":"ABHISHEK RANJAN","cardNumber":"4242424242424242","expiryMonth":7,"expiryYear":2026,"outstandingAmount":38},{"id":"6e837d5d-130a-4971-9568-41035ee81ae9","cardOwnerName":"TEMP USER","cardNumber":"2720999448373736","expiryMonth":5,"expiryYear":2027,"outstandingAmount":11547},{"id":"c1ef0fa8-205a-4c3a-91b9-f2d860ce412d","cardOwnerName":"RAHUL","cardNumber":"378282246310005","expiryMonth":11,"expiryYear":2027,"outstandingAmount":0},{"id":"c4a1d5c2-d0d7-48c9-b516-954ca628b9f2","cardOwnerName":"ABHI","cardNumber":"6010601060106010","expiryMonth":1,"expiryYear":2021,"outstandingAmount":0}]
        let data = []
        for (const card of userCards[0].card) {

            // let outstandingAmount = 0
            let card_filtered = await Card.findById(card)
            // let outstandingAmount = await calculateOutstandingAmount(card.cardNumber);
            let cardInfo = {
                id: card_filtered._id.toString(),
                cardOwnerName: card_filtered.cardOwnerName,
                cardNumber: decrypt(card_filtered.cardNumber),
                expiryMonth: card_filtered.expiryMonth,
                expiryYear: card_filtered.expiryYear,
                outstandingAmount: card_filtered.outstandingAmount.toString(),
            }
            data.push(cardInfo);
        }
        // console.log(data)
        res.send(data);
    },
    getCardById: async (req, res) => {
        try {
            const cardInfo = await Card.findOne({
                _id: (req.params.card_id)
            }).catch((err) => {
                err.statusCode = 404;
                throw new Error('Wrong card id or you\'re not authorised !');
            })
            if (cardInfo) {
                let modified_cardInfo = {
                    id: cardInfo._id.toString(),
                    cardOwnerName: cardInfo.cardOwnerName,
                    cardNumber: decrypt(cardInfo.cardNumber),
                    expiryMonth: cardInfo.expiryMonth,
                    expiryYear: cardInfo.expiryYear,
                    outstandingAmount: cardInfo.outstandingAmount.toString(),
                }
                res.status(200).send(modified_cardInfo)
            }
        } catch (err) {
            if (!err.statusCode)
                err.statusCode = 500
            throw new Error(err)
        }

    },
  deleteCardById: async (req, res) => {       // function to delete card from user profile and card db
    try {
      const profileAssociated = await Profile.findById({
          _id: req.user.id
      }).catch((err) => {
          res.statusCode = 500;
          throw new Error(err);
      })
      const cardsAssociated = profileAssociated.card
      for (const profileCardId of cardsAssociated) {
        // if we get the same card number associated with the currentLoggedIn user.
        if(profileCardId==req.params.card_id){
          //delete card from the card array
               const delete_card=await Card.findByIdAndDelete({
                 _id:profileCardId
               }).catch((err)=>{
                 throw new Error("Error in deleting Card")
               })
               //delete card from profile
               profileAssociated.card=profileAssociated.card.filter(i=>i!==profileCardId)
                await profileAssociated.save().catch((err)=>{ // ave the updated card array of the current user's profile
                 throw new Error("Error in deleting Card from Profile")
               })
               break
           }
          }
          res.status(200).send({"message":"successfully deleted Card"});
      }
      catch (err) {
      if (!err.statusCode)
      err.statusCode = 500
      throw new Error(err)
    }

  },
    getAllstatements: async (req, res) => {
        // getting the profile associated with the current loggedIn user
        try {
            const profileAssociated = await Profile.findById({
                _id: req.user.id
            }).catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })
            const cardsAssociated = profileAssociated.card
            let statementsPojo = []
            for (const profileCardId of cardsAssociated) {
                const currentCard = await Card.findOne({
                    _id: profileCardId,
                }).catch((err) => {
                    res.statusCode(500);
                    throw new Error(err);
                })
                const currentCardNumber = decrypt(currentCard.cardNumber);
                // if we get the same card number associated with the currentLoggedIn user.
                if (currentCardNumber === req.params.id) {
                    const statements = await Transaction.find({
                        cardNumber: currentCardNumber,
                    }
                    ).catch((err) => {
                        res.statusCode = 500;
                        throw new Error(err);
                    })
                    statements.sort(function (a, b) {   // sort the statements received based on dates in sescending order
                        if (a.transactionDateTime > b.transactionDateTime)
                            return 1;
                        if (a.transactionDateTime < b.transactionDateTime)
                            return -1;
                        return 0;
                    });
                    statementsPojo = statements.map(s => ({
                        transactionId: s._id,
                        amount: s.amount.toString(),
                        vendor: s.vendor,
                        credDeb: s.credDeb,
                        category: s.category,
                        transactionDateTime: s.transactionDateTime,
                        userAssociated: s.userAssociated

                    }))
                    break
                }
            }
            res.status(200).send(statementsPojo);
        } catch (err) {
            if (!err.statusCode)
                err.statusCode = 500
            throw new Error(err)
        }
    },
    postStatements: async (req, res) => {   // function check if the transaction amount is within the balance available in credit card and then to store statements in the database.
        try {
          // find card associated with the current user
            const cardAssociated = await Card.findOne({
                cardNumber: encrypt(req.params.id)
            }).catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })
            if (!cardAssociated)
                throw new Error("Not a valid card Number");
            if (req.body.credDeb && parseFloat(cardAssociated.outstandingAmount) < req.body.amount)
                throw new Error("Entered Amount is more than Bill Amount");
            const transaction = new Transaction({
                "cardNumber": req.params.id,
                "amount": req.body.amount,
                "vendor": req.body.vendor,
                "credDeb": req.body.credDeb,
                "category": req.body.category,
                "transactionDateTime": req.body.transactionDateTime,
                "userAssociated": req.body.userAssociated
            },
            )
            const transaction_saved = await transaction.save().catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })
            cardAssociated.transcation = [...cardAssociated.transcation, transaction_saved._id]
            if (transaction_saved.credDeb) {
                cardAssociated.outstandingAmount = parseFloat(cardAssociated.outstandingAmount) - parseFloat(transaction_saved.amount);
            }
            else cardAssociated.outstandingAmount = parseFloat(cardAssociated.outstandingAmount) + parseFloat(transaction_saved.amount);
            cardAssociated.save().catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })
            res.status(200).send(transaction_saved)
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500
            throw new Error(err)
        }
    },
    payBill: async (req, res) => {      // function to pay bill of the credit card

        try {
            // getting the profile associated with the current loggedIn user
            const profileAssociated = await Profile.findById({
                _id: req.user.id
            }).catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })
          const coinCount = updateCoins(profileAssociated.coins, req.body.amount);
            const allProfileCardIds = profileAssociated.card
            let currentTransaction = {};
            // we will now check for every card associated with current LoggedIn user,
            for (const profileCardId of allProfileCardIds) {
                const currentUserCard = await Card.findById({
                    _id: profileCardId,
                }
                ).catch((err) => {
                    res.statusCode(500);
                    throw new Error(err);
                })

                const currentUserCardNumber = decrypt(currentUserCard.cardNumber);

                // if we get the same card number associated with the currentLoggedIn user.
                if (req.params.id === currentUserCardNumber) {

                    profileAssociated.coins = coinCount;
                    await profileAssociated.save();

                    // now we can simply create the new transaction
                    const transaction = new Transaction({
                        amount: req.body.amount,
                        vendor: 'BILL',
                        credDeb: true,
                        category: 'PAYMENT',
                        cardNumber: currentUserCardNumber,
                        transactionDateTime: Date.now(),
                        CardId: profileCardId,
                        userAssociated: req.user.email,
                    })
                    currentTransaction = await transaction.save().catch((err) => {
                        res.statusCode = 500;
                        throw new Error(err);
                    })
                    currentUserCard.outstandingAmount = parseFloat(currentUserCard.outstandingAmount) - parseFloat(currentTransaction.amount)
                    currentUserCard.transcation = [...currentUserCard.transcation, currentTransaction._id]
                    await currentUserCard.save()
                    break
                }
                if (!currentTransaction)
                    throw new Error("Bill Payment Error")
                res.status(200).send(currentTransaction);
            }
        } catch (err) {
            console.log(err)
            if (!err.statusCode)
                err.statusCode = 500
            throw new Error(err)
        }
    },

    getStatementsYearMonth: async (req, res) => {

        try {
            // cardNumber, year, month
            let month = req.params.month;
            let year = req.params.year;

            const endingDate = new Date(year, month);

            month = parseInt(month) - 1;

            const startingDate = new Date(year, month);
            // getting the profile associated with the current loggedIn user
            const profileAssociated = await Profile.findById({
                _id: req.user.id
            }).catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })

            const allProfileCardIds = profileAssociated.card
            // we will now check for every card associated with current LoggedIn user,
            for (const profileCardId of allProfileCardIds) {
                const currentCard = await Card.findById({
                    _id: profileCardId
                }).catch((err) => {
                    res.statusCode(500);
                    throw new Error(err);
                })
                const currentCardNumber = decrypt(currentCard.cardNumber);

                // if we get the same card number associated with the currentLoggedIn user.
                if (currentCardNumber === req.params.id) {
                    const statements = await Transaction.find({
                        cardNumber: currentCardNumber,
                        transactionDateTime: { // we are now fetching all the statements between the starting and endingDate
                            $gte: startingDate,
                            $lte: endingDate,
                        }
                    }).catch((err) => {
                        res.statusCode = 500;
                        throw new Error(err);
                    })
                    statements.sort(function (a, b) {
                        if (a.transactionDateTime > b.transactionDateTime)
                            return 1;
                        if (a.transactionDateTime < b.transactionDateTime)
                            return -1;
                        return 0;
                    });
                    // Pagination
                    statements.reverse();
                    const perPage = 10;
                    const page = Number(req.query.pageNumber) || 1;
                    const count = statements.length;
                    const pages = Math.ceil(count / perPage);
                    const indexOfLastStatement = page * perPage;
                    const indexOfFirstStatement = indexOfLastStatement - perPage;
                    const currentStatements = statements.slice(indexOfFirstStatement, indexOfLastStatement);
                    const modified_current_statements = currentStatements.map(s => ({
                        transactionId: s._id,
                        amount: s.amount.toString(),
                        vendor: s.vendor,
                        credDeb: s.credDeb,
                        category: s.category,
                        transactionDateTime: s.transactionDateTime,
                        userAssociated: s.userAssociated
                    }))
                    res.status(200).json({ data: modified_current_statements, pages, page });
                    return;
                }
            }
        } catch (err) {
            console.log(err)
            if (!err.statusCode)
                err.statusCode = 500
            throw new Error(err)
        }
    }, getSmartStatementYearMonth: async (req, res) => {
        // cardNumber, year, month
        try {
            let month = req.params.month;
            let year = req.params.year;

            const endingDate = new Date(year, month);

            month = parseInt(month) - 1;

            const startingDate = new Date(year, month);

            // getting the profile associated with the current loggedIn user
            const profileAssociated = await Profile.findById({
                _id: req.user.id
            }).catch((err) => {
                res.statusCode = 500;
                throw new Error(err);
            })

            const allProfileCardIds = profileAssociated.card
            let smartStatement={}
            // we will now check for every card associated with current LoggedIn user,
            for (const profileCardId of allProfileCardIds) {
                const currentCard = await Card.findById({
                    _id: profileCardId
                }).catch((err) => {
                    res.statusCode(500);
                    throw new Error(err);
                })
                const currentCardNumber = decrypt(currentCard.cardNumber);

                // if we get the same card number associated with the currentLoggedIn user.
                if (currentCardNumber === req.params.id) {
                    const allStatements = await Transaction.find({
                        cardNumber: currentCardNumber,
                        transactionDateTime: { // we are now fetching all the statements between the starting and endingDate
                            $gte: startingDate,
                            $lte: endingDate,
                        }
                    }).catch((err) => {
                        res.statusCode = 500;
                        throw new Error(err);
                    })
                    const allCategories = new Set();
                    const allVendors = new Set();

                    for (const statement of allStatements) {
                        allCategories.add(statement.category);
                        allVendors.add(statement.vendor);
                    }


                    let labels = [];
                    let data = [];
                    let count = [];
                    for (let currCategory of allCategories) {
                        labels.push(currCategory);
                        let totalAmount = 0;
                        let currentCount = 0;
                        for (let statement of allStatements) {
                            if (statement.category === currCategory) {
                                totalAmount += parseFloat(statement.amount);
                                currentCount += 1;
                            }
                        }
                        data.push(totalAmount);
                        count.push(currentCount);
                    }

                    const categories = {
                        labels: [...labels],
                        data: [...data]
                    };

                    const categoriesCount = {
                        labels: [...labels],
                        data: [...count]
                    }

                    labels = [];
                    data = [];
                    count = [];

                    for (let currVendor of allVendors) {
                        labels.push(currVendor);
                        let totalAmount = 0;
                        let currentCount = 0;
                        for (let statement of allStatements) {
                            if (statement.vendor === currVendor) {
                                totalAmount += parseFloat(statement.amount);
                                currentCount += 1;
                            }
                        }
                        data.push(totalAmount);
                        count.push(currentCount);
                    }

                    const vendors = {
                        labels: [...labels],
                        data: [...data]
                    }

                    const vendorsCount = {
                        labels: [...labels],
                        data: [...count]
                    }

                    smartStatement = {
                        categories: categories,
                        vendors: vendors,
                        categoriesCount: categoriesCount,
                        vendorsCount: vendorsCount
                    }
                    break;
                }
            }
            res.status(200).send(smartStatement)

        } catch (err) {
            console.log(err)
            if (!err.statusCode)
                err.statusCode = 500
            throw new Error(err)
        }

    }
}
