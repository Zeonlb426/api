const BlackList = require("../models").BlackList;

module.exports.BanToken = (obj) => {

    const { id, tokenId, exp } = obj;

    if (!id || !tokenId || !exp) throw new Error('Obj не содержит необходимых свойств');
    
    return BlackList.create({id: tokenId, userId: id, timeLive: exp});
}