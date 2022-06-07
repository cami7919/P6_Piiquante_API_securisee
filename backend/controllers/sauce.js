
const req = require('express/lib/request');
const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => { console.log(error); res.status(400).json({ error }) });
};

//.catch(error => res.status(400).json({ error }));      
//.catch(error =>{console.log(error);     res.status(400).json({error})});


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};




   

exports.removeSauce = (req, res, next) => {    
        Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
            });
          })
          .catch(error => res.status(500).json({ error }));
      };




exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};



exports.likeSauce = (req, res, next) => {
    // On récupère la sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            switch (req.body.like) {
                //Si l'utilisateur dislike : 
                case -1:
                    // mise à jour de la BDD:
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: 'Dislike pris en compte !' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                //Si like ou dislike differe de 0, on retire le like / dislike'
                case 0:
                    //Si la sauce est déjà liké :
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: ' Avis mis à jour !' }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    //Si la sauce est déjà disliké :
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: ' Avis mis à jour !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                //Si l'utilisateur like la sauce, +1 :
                case 1:
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: 'Like pris en compte !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    return res.status(500).json({ error });
            }
        })
        .catch(error => res.status(500).json({ error }))
}
