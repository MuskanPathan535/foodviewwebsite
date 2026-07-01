// const express = require('express');
// const foodController = require("../controllers/food.controller")
// const authMiddleware = require("../middlewares/auth.middleware")
// const router = express.Router();
// const multer = require('multer');

// const upload = multer({
//     storage: multer.memoryStorage(),
// })

// router.post('/',
//     authMiddleware.authFoodPartnerMiddleware,
//      upload.single("video"),
//     foodController.createFood)



// /* GET /api/food/ [protected] */
// router.get("/",
//     authMiddleware.authUserMiddleware,
//     foodController.getFoodItems)

    
// module.exports = router
const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("mama"),
    foodController.createFood)


/* GET /api/food/ */
router.get("/",
    foodController.getFoodItems)


router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)

router.post('/comment',
    authMiddleware.authUserMiddleware,
    foodController.commentFood
)

router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)



module.exports = router