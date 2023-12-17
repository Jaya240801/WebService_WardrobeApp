const express = require('express')
const { mysqlDB, getConnection} = require('../../../db.js')
const router = express.Router()

router.post('/material', async (req, res) => {
    try {
        const conn = await getConnection()
        const { materialName, supId, price, quantity } = req.body;
        const data = await conn.execute(`INSERT INTO materials VALUES(DEFAULT, ?, ?, ?, ?)`, [materialName, supId, price, quantity])
        const statusCode = 200; 
        const message = "Berhasil membuat bahan baku baru!";
        if (data[0].affectedRows == 0) {
            statusCode = 400;
            message = 'Gagal membuat bahan baku baru!';
        }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statuCode: 400,
            message: "Have an error :" + e
        })
    }
})

router.get('/material', async (req, res) => {
    try {
        const conn = await getConnection()
        const data = await conn.execute(`select
        a.material_id,
        a.material_name,
        a.supplier_id,
        b.supplier_name,
        a.price,
        a.quantity_in_stock from materials a
    inner join suppliers b
    on a.supplier_id = b.supplier_id
    order by a.material_id`)
        res.status(200).json(data[0]);
    } catch (e) {
        res.status(400).json({
            statuCode: '400',
            message: 'Have an error :' + e
        })
    }
})

router.put('/material/:id?', async (req, res) => {
    try {
        const conn = await getConnection()
        const { materialName, supId, price, quantity } = req.body
        const id = req.params.id

        const data = await conn.execute(`UPDATE materials SET material_name = ?, supplier_id = ?,
        price = ?, quantity_in_stock = ? WHERE material_id = ?`, [materialName, supId, price, quantity, id])
        statuCode = 200, message = "Berhasil edit bahan baku dengan ID : " + id
        if (data[0].affectedRows == 0) {
            statuCode = 400,
                message = 'Gagal Edit bahan baku!'
        } else {
            res.status(statuCode).json({
                statuCode,
                message
            })
        }
    } catch (e) {
        res.status(400).json({
            statuCode: 400,
            message: 'Have an error :' + e
        })
    }
})

router.delete('/material/:id?', async (req, res) => {
    try {
        const conn = await getConnection()
        const { id } = req.params
        const data = await conn.execute(`DELETE FROM materials WHERE material_id = ?`, [id])
        statuCode = 200, message = "Berhasil hapus bahan baku dengan ID : " + id
        if(data[0].affectedRows > 0) {
            const tableName = 'materials';
            const columnName = 'material_id';
            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;
            
            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);

            res.status(statuCode).json({
                statuCode,
                message
            })
        } else {
            statusCode = 400;
            message = 'Gagal hapus bahan baku dengan ID : ' + id;
            res.status(statuCode).json({
                statuCode,
                message
            })
        }
    } catch (e) {
        res.status(400).json({
            statuCode: 400,
            message: 'Have an error :' + e
        })
    }
})

module.exports = router