const {Router} = require ('express');
const {Dog, Temperament} = require ('../db');
const {getDogs} = require('./functions')
const router = Router();


router.get('/',async(req,res,next)=>{
    try{
        const {name}=req.query;
        let dogsTotal = await getDogs();
        //console.log(dogsTotal);

        if(name){
            //hago un filter de dogsTotal (un array de objetos) para verificar si el nombre que viene por query se encunetra o en la api o en la base de datos
            let nameDog= await dogsTotal.filter(elem => elem.name.toLowerCase().includes(name.toLowerCase()));
            nameDog.length>0? res.status(200).send(nameDog) : res.status(404).json({error : "Dog not found"});
        }else res.status(200).send(dogsTotal) //variable que contiene el perro buscado

    }catch(error){
        next(error)
        //res.json({error: "No se encontró el perro"})
    }
});

router.get('/:id',async(req,res,next)=>{
    try{
        const {id}=req.params;
        let dogsTotal = await getDogs();

        if(id){
            let idDog = await dogsTotal.filter(dog => id.length>8 ? dog.id === id : (dog.id)===parseInt(id));
            idDog ? res.status(200).send(idDog) : res.status(404).send("Dog not found");
        }
    }catch (error){
        next(error)
    }
});


router.post('/',async(req,res,next)=>{
    let {name, life_span, minWeight, maxWeight, minHeight, maxHeight, image, temperament}=req.body;
    
    // if (isNaN(life_span) || isNaN(minweight) || isNaN(maxweight) || isNaN(minheight) || isNaN(maxheight) || !temperament || !temperament.length){
    //     return res.json({error: "One of the arguments is not a number or does not contain a temperament"})
    // }else if (!name){
    //     return res.json({error: "Name is required"});
    // }
    if (!name){
        return res.json({error: "Name is required"});
    }

    const existe = await Dog.findOne({ where: { name: name } });
    if (existe) return res.json({ error: "The dog already exists" });

    try{
        let dogCreate = await Dog.create({
            name,
            minWeight,
            maxWeight,
            minHeight,
            maxHeight,
            life_span,
            image,
        })

        // let temperamentDb = await Temperament.findAll ({
        //     where: {name: temperament }
        // })

        dogCreate.addTemperament(temperament);
        res.send("Dog add successfully!!");
    }catch(error){
        next(error)
    }
});


module.exports = router;