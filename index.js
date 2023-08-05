const express = require('express');
const app = express();
const db = require('./modulos/db');

app.use(express.static('public'));
app.use(express.json());

app.post('/crearCuenta', async(req, res)=>{res.json(await db.crearCuenta(req.body.nombre, req.body.usuarios))});
app.post('/agregarMovimiento', async(req, res)=>{res.json(await db.agregarMovimiento(req.body.cuenta, req.body.movimiento))});
app.post('/listadoCuentas', async(req, res)=>{res.json({cuentas : await db.listadoCuentas('Anto'), usuario : 'Anto'})});
app.post('/detalleCuenta', async(req, res)=>{res.json({movimeintos : await db.detalleCuenta(req.body.cuenta)})});

app.listen(3000, ()=>{console.log('Servidor corriendo en el puerto 3000')});