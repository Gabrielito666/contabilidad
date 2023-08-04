const sqliteExpress = require('sqlite-express');
const db = sqliteExpress.createDB('./data.db');

sqliteExpress.createTable(db, 'cuentas', {nombre : 'text unique', movimientos : 'text'});
sqliteExpress.createTable(db, 'usuarios', {nombre : 'text primary key', cuentas : 'text'});

module.exports = {
    crearCuenta : async(nombre, usuarios)=>{
        try{
            await sqliteExpress.insert(db, 'cuentas', {nombre : nombre, movimientos : [], usuarios : usuarios});
            await sqliteExpress.update(db, 'usuarios', {cuentas : (x)=>{return [...x, nombre]}}, {nombre : usuarios}, 'OR');
            return {ok : true, mensaje : `Éxito al crear cuenta ${nombre}`};
        }catch(err){
            return {
                ok : false,
                mensaje : err.message.includes('UNIQUE constraint failed') ? 'Ya existe una cuenta con ese nombre' : 'Ha oocurrido un error. Por favor intentelo más tarde'
            };
        }
    }, 
    agregarMovimiento : async(cuenta, movimiento)=>{
        movimiento.fecha = new Date().toLocaleString('es-CL', {timeZone: 'America/Santiago', hour12: false});
        try{
            await sqliteExpress.update(db, 'cuentas', {movimientos : (x)=>{return [...x, movimiento]}}, {cuenta : cuenta})
            return {ok : true, mensaje : 'Éxito al registrar el movimiento'};
        }catch(err){
            return {ok : false, mensaje : 'Ha ocurrido un error al registrar ell movimiento, Por favor intentelo más tárde'};
        }
    },
    listadoCuentas : async(usuario)=>{
        return await sqliteExpress.select(db, 'usuarios', 'cuentas', {nombre : usuario})
    },
    detalleCuenta : async(cuenta)=>{
        return await sqliteExpress.select(db, 'cuentas', 'movimientos', {nombre : cuenta})
    }
}