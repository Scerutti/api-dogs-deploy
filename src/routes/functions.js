const axios = require('axios');
const {Dog,Temperament} = require ('../db');
const {YOUR_API_KEY} = process.env;


const getInfoApi = async () => { //saco toda la info desde la API Externa
    const urlApi = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`);
    const infoApi = await urlApi.data.map(elem =>{
        return{
            name: elem.name,
            id: elem.id,
            life_span: elem.life_span,
            temperament: elem.temperament,

            minWeight: elem.weight.metric.slice(0,2), //como es un string donde esta esta info, le saco el valor que quiero y lo guardo en la variable correspondiente
            maxWeight: elem.weight.metric.slice(4),
            minHeight: elem.height.metric.slice(0,2),
            maxHeight: elem.height.metric.slice(4),

            // minWeight: Number(elem.weight.metric.slice(0,2)), //como es un string donde esta esta info, le saco el valor que quiero y lo guardo en la variable correspondiente
            // maxWeight: Number(elem.weight.metric.slice(4)),
            // minHeight: Number(elem.height.metric.slice(0,2)),
            // maxHeight: Number(elem.height.metric.slice(4)),
            
            image: "https://cdn2.thedogapi.com/images/" + elem.reference_image_id + ".jpg",
        }
    });
    return infoApi;
};

const getInfoDB = async () => { //saco toda la info de mi base de datos en el model Dogs e incluyo el model Temperament
    const infoDb = await Dog.findAll({
        include: [{
            model: Temperament,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }]
    });
     return infoDb;
}

const getDogs = async () => {
    const apiInfo= await getInfoApi();
    const dbInfo = await getInfoDB();
    const total = await apiInfo.concat(dbInfo); //unifico toda la info en un mismo array
    return total;
}

module.exports = {getDogs};