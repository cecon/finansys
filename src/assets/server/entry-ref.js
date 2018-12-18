const db = require('./../../../db.json');
module.exports = (req, res, next) => {
    console.log('URL**', req.url);
    
    if (req.url.indexOf('/entries') !== -1 && (req.method === 'POST' || req.method === 'PUT')) {
        const category = db.categories.find((value, propertyName) => {
            return value.id == req.body.categoryId;
        });
        req.body.category = category;
        console.log('body', req.body);
    }
    next()
}