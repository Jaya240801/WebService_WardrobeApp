const express = require('express')
const { mysqlDB, getConnection } = require('../../../db.js')
const router = express.Router();

router.get('/ordermo', async (req, res) => {
    try {
        const conn = await getConnection()
        const data = await conn.execute(`SELECT 
        a.orderMO_id, 
        a.product_id, 
        c.category_name, 
        b.product_name , 
        a.quantity, 
        a.total , 
        a.status ,
        a.tanggal 
        FROM order_mo a
        INNER JOIN products b
        ON a.product_id = b.product_id
        INNER JOIN product_categories c
        on b.category_id = c.category_id
        order by a.orderMO_id`)
        res.status(200).json(data[0]);
    } catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: 'Have an error: ' + e
        })
    }
})

router.post('/ordermo', async (req, res) => {
    const conn = await getConnection()
    try {
        const { productId, quantity, total, statusMo, tanggal } = req.body
        const data = await conn.execute(`INSERT INTO order_mo VALUES(DEFAULT,?,?,?,?,?)`, [productId, quantity, total, statusMo, tanggal])
        statusCode = 200, message = "Berhasil membuat MO baru!"
        if (data[0].affectedRows == 0) {
            statusCode = 400,
                message = "Gagal membuat MO baru!"
        }

        // update produk stock
        if (quantity > 0 && statusMo == "Finnished") {
            const data = await conn.execute(`UPDATE products SET product_Stock=product_Stock+? WHERE product_id = ?`,
                [quantity, productId]);

            let statusCodeP = 200, messageP = "Berhasil menambah stok produk dengan ID : " + productId;

            if (data[0].affectedRows === 0) {
                statusCodeP = 400;
                messageP = "Gagal menambah stok produk dengan ID : " + productId;
                res.status(statusCodeP).json({
                    statusCodeP,
                    messageP,
                });
            } else {
                res.status(statusCodeP).json({
                    statusCodeP,
                    messageP,
                });
            }
        }

        res.status(statusCode).json({
            statusCode,
            message,
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error :' + e
        })
    }
})

router.put('/ordermo/:id', async (req, res) => {
    const conn = await getConnection();
    try {
        const { productId, quantity, total, statusMo, tanggal } = req.body;
        const id = req.params.id;
        const data = await conn.execute('UPDATE order_mo SET product_id = ?, quantity = ?, total = ?, status = ?, tanggal = ? WHERE orderMO_id = ?',
            [productId, quantity, total, statusMo, tanggal, id]);
        let statusCode = 200, message = "Berhasil edit MO dengan ID : " + id;
        if (data[0].affectedRows === 0) {
            statusCode = 400;
            message = "Gagal edit MO dengan ID : " + id;
        }

        // update produk stock
        if (quantity > 0 && statusMo == "Finnished") {
            const data = await conn.execute(`UPDATE products SET product_Stock=product_Stock+? WHERE product_id = ?`,
                [quantity, productId]);

            let statusCodeP = 200, messageP = "Berhasil menambah stok produk dengan ID : " + productId;

            if (data[0].affectedRows === 0) {
                statusCodeP = 400;
                messageP = "Gagal menambah stok produk dengan ID : " + productId;
                res.status(statusCodeP).json({
                    statusCodeP,
                    messageP,
                });
            } else {
                res.status(statusCodeP).json({
                    statusCodeP,
                    messageP,
                });
            }
        }

        res.status(statusCode).json({
            statusCode,
            message,
        });
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'An error occurred: ' + e.message
        });
    }
});

router.delete('/ordermo/:id', async (req, res) => {
    const conn = await getConnection();
    try {
        const { id } = req.params;
        const data = await conn.execute('DELETE FROM order_mo WHERE orderMO_id = ?', [id]);
        let statusCode = 200;
        let message = "Berhasil haous MO dengan ID : " + id;
        
        if (data[0].affectedRows > 0) {
            const tableName = 'order_mo';
            const columnName = 'orderMO_id';

            const maxIdQuery = `SELECT COALESCE(MAX(${columnName}), 0) + 1 AS max_id FROM ${tableName}`;
            const [maxIdData] = await conn.execute(maxIdQuery);
            const maxId = maxIdData[0].max_id;
            
            const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = ${maxId}`;
            await conn.execute(resetQuery);

            res.status(statusCode).json({
                statusCode,
                message
            });
        } else {
            statusCode = 400;
            message = "Gagal haous MO dengan ID : " + id;
            res.status(statusCode).json({
                statusCode,
                message
            });
        }
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: 'Have an error ' + e.message
        });
    }
});

module.exports = router