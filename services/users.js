const pool = require("../configs/database")



exports.get = async (req, res) => {
    const conn = await pool.connect()    
    try {
        const result = await conn.query(`SELECT * FROM public.users ORDER BY id ASC`)
        res.send(result.rows)
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}

exports.getById = async (req, res) => {
    const conn = await pool.connect()
    const id = parseInt(req.params.id)
    try {
        const result = await conn.query(`SELECT * FROM public.users WHERE id = $1`, [id])
        res.send(result.rows)
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    } 
}


exports.create = async (req, res) => {
    const conn = await pool.connect()
    const { username, password, email } = req.body
    try {
        const result = await conn.query(`INSERT INTO public.users (username, password, email) VALUES ($1, $2, $3)`, [username, password, email])
        res.send({ success: `User created with id ${result.insertId}` })
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}


exports.update = async (req, res) => {
    const conn = await pool.connect()
    const id = parseInt(req.params.id)
    const { username, password, email } = req.body

    try {
        await conn.query(`UPDATE public.users SET username = $1, password = $2, email = $3 WHERE id = $4`, [username, password, email, id])
        res.send({ success: `User updated with id ${id}` })
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}


exports.delete = async (req, res) => {
    const conn = await pool.connect()
    const id = parseInt(req.params.id)
    try {
        await conn.query(`DELETE FROM public.users WHERE id = $1`, [id])
        res.send({ success: `User deleted with id ${id}` })
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}