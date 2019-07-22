const Light = require("../model/light")
const {ObjectID} = require("mongodb")
module.exports.create = async(req, res) => {
    let obj = {
        light : "off"
    }

    await Light.create(obj)
    return res.send('ok')
}

module.exports.get = async(req, res) => {
    let lights = await Light.find();
    return res.send(lights)
}

module.exports.update = async(req, res) => {
    const lightId = "5d35728de63ee83a84fa7b52";
    var newLight = "";
    try {
        let light = await Light.findOne({_id: ObjectID(lightId)});

        if(light.light == "off"){
            newLight = "on"
        } else {
            newLight = "off";
        }

        let result = await Light.updateOne({_id: ObjectID(lightId)}, {$set: {light : newLight}})

        return res.send(result)
    } catch (error) {
        console.log(error);
        return res.send({
            error: true
        })
        
    }
}