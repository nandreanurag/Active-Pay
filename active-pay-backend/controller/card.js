
//controller for managing operations on cards

const cardService = require('../services/card.js');

module.exports = {
    addCard: async(req, res, next) => {   //card addition to user profile and card database
        cardService.addCard(req, res, next)
            .catch(next);
    },
    getAllCards: async(req, res, next) => {   //card retrieval from card database
        cardService.getAllCards(req, res)
            .catch(next);
    },
    getCardById: async(req, res, next) => {   //retrieve particular card by id
        cardService.getCardById(req, res)
            .catch(next);
    },
    deleteCardById: async(req, res, next) => {    //delete particular card from cord db and from user profile by id
        cardService.deleteCardById(req, res)
            .catch(next);
    },
    payBill: async(req, res, next) => {   //pay the credit card bill
        cardService.payBill(req, res)
            .catch(next);
    },
    getAllStatements: async(req, res, next) => {  //retrieve all statements of card
        cardService.getAllstatements(req, res)
            .catch(next);
    },
    postStatements: async(req, res, next) => {    //update the statements of that card
        cardService.postStatements(req, res)
            .catch(next);
    },
    getStatementsYearMonth: async(req, res, next) => {    //retrieve particular statement associated with that year and that month
        cardService.getStatementsYearMonth(req, res)
            .catch(next);
    },
    getSmartStatementYearMonth: async(req, res, next) => {    //retrieve spendings and transactions of the particular month and year
        cardService.getSmartStatementYearMonth(req, res)
            .catch(next);
    }
};
