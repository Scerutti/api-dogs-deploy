const {Router} = require ('express');
const axios = require ('axios');
const {Temperament} = require ('../db');
const router = Router();
const {YOUR_API_KEY} = process.env;

//loclahost:3001/temperament
router.get('/',async(req,res)=>{
    try{
        let tempeSet = new Set();
        const temperamentApi = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`)

        // console.log(temperamentApi); //traigo todo de la api
        //const temperament = temperamentApi.data.map(elem=>elem.temperament).join(', ').split(', ');
       
        //console.log(temperament) //extraigo todos los temperamentos

        temperamentApi.data.forEach(dog => {
            let tempArray = dog.temperament ? dog.temperament.split(', ') : []
            tempArray.forEach(temperament => tempeSet.add(temperament))

        })
        const tempe = Array.from(tempeSet)

        // res.json(tempe)
        // temperament.map(elem => tempe.includes(elem) ? "" : tempe.push(elem))
        //console.log(tempe); //Tengo todos los temperamentos sin repetir

        //temperament.forEach(elem => tempe.includes(elem)||tempe.push(elem))
        //console.log(tempe)

        tempe.forEach(async(elem)=>{
            await Temperament.findOrCreate({
                    where:{
                        name:elem,
                    }
                });
        });

        const temperamentDog = await Temperament.findAll();
        res.json(temperamentDog);
        
    }catch (error){
        console.log(error);
    }
});




module.exports = router;