const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')
const router = express.Router()

router.post('/productCategory', async (req, res) => {
    try {
        const conn = await getConnection()
        const { name } = req.body
        const data = await conn.execute(`INSERT INTO product_categories VALUES (DEFAULT, ?)`, [name])
        var statusCode = 200, message = "Berhasil membuat kategori baru!";
        if (data[0].affectedRows == 0) {
            statusCode = 400,
            message = 'Gagal membuat kategori baru!'
        } else {
            res.status(statusCode).json({
                statusCode,
                message
            })
        }
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

router.get('/productCategory', async (req, res) => {
    try {
        const conn = await getConnection()
        const data = await conn.execute(`SELECT * FROM product_categories`)
        res.status(200).send(data[0]);
        // res.status(200).json({
        //     data: data.result,
        //     statusCode: 200,
        //     message: 'success'
        // })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
    // try {
    //     mysqlDB.query(`SELECT * FROM product_categories`, (error, results, fields) => {
    //         if (error) {
    //             res.status(400).json({
    //                 statusCode: 400,
    //                 message: 'Have an error ' + error
    //             });
    //         } else {
    //             res.status(200).json(results);
    //         }
    //     });
    // } catch (e) {
    //     res.status(400).json({
    //         statusCode: 400,
    //         message: 'Have an error ' + e
    //     });
    // }
})

router.put('/productCategory/:id?', async (req, res) => {
    try {
        const conn = await getConnection()
        const { id } = req.params
        const { name } = req.body
        const data = await conn.execute(`UPDATE product_categories SET category_name = ? WHERE category_id = ?`, [name, id])
        statusCode = 200, message = "Berhasil edit kategori dengan ID : " + id
        if (data[0].affectedRows == 0) {
            statusCode = 400,
                message = 'Gagal edit kategori dengan ID : ' + id
        }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})
router.delete('/productCategory/:id?', async (req, res) => {
    try {
        const conn = await getConnection()
        const { id } = req.params
        const data = await conn.execute(`DELETE FROM product_categories WHERE category_id = ?`, [id])
        var statusCode = 200, message = "Berhasil hapus kategori dengan ID : " + id;
        if(data[0].affectedRows > 0) {
            const tableName = 'product_categories';
            const columnName = 'category_id';
            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;

            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);
        } else{
            statusCode = 400,
            message = 'Gagal hapus kategori dengan ID : ' + id
        }
        res.status(statusCode).json({
            statusCode,
            message
        })
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error ' + e
        })
    }
})

// router.get('/productCategory/:id?', async (req, res) => {
//     try {
//         const conn = await getConnection()
//         const id = parseInt(req.params.id)
//         const data = await conn.execute(`SELECT * FROM product_categories WHERE category_id = ?`, [id])
//         res.status(200).send(data[0]);
//         // res.status(200).json({
//         //     data: data.rows,
//         //     statusCode: 200,
//         //     message: 'success'
//         // })
//     } catch (e) {
//         res.status(400).json({
//             statusCode: 400,
//             message: 'Have an error ' + e
//         })
//     }
// })

module.exports = router