const express = require('express');
const session = require('express-session');
const app = express();
const router = express.Router();
const db = require('./modulos/db');

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'miClaveSecreta',
    resave: false,
    saveUninitialized: false
}));
app.use('/', router);

router.get('/', async(req, res)=>{res.redirect('/contabilidad/app/index.html')})
router.post('/login', async(req, res)=>{
    if(await db.login(req.body.usuario, req.body.password)){
        req.session.usuario = req.body.usuario;
        res.json({ok : true});
    }else{
        res.json({ok : false});
    }
    
})
router.post('/crearCuenta', async(req, res)=>{res.json(await db.crearCuenta(req.body.nombre, req.body.usuarios))});
router.post('/agregarMovimiento', async(req, res)=>{res.json(await db.agregarMovimiento(req.body.cuenta, req.body.movimiento))});
router.post('/listadoCuentas', async(req, res)=>{
    if(req.session.usuario){
        res.json({ok : true, cuentas : await db.listadoCuentas(req.session.usuario), usuario : req.session.usuario})
    }else{
        res.json({ok : false})
    } 
});
router.post('/detalleCuenta', async(req, res)=>{res.json({movimientos : await db.detalleCuenta(req.body.cuenta)})});

module.exports = router;
//app.listen(3000, ()=>{console.log('Servidor corriendo en el puerto 3000')});